# 🎟️ End-to-End Concert Booking Platform - Architecture

> **Project:** high_concurrency_booking
> **Last updated:** 2026-06-04

---

## Table of Contents

- [Overview](#overview)
- [End-to-End User Flow](#end-to-end-user-flow)
- [High-Level Diagram](#high-level-diagram)
- [Services](#services)
- [Data Layer](#data-layer)
- [Concurrency & Locking](#concurrency--locking)
- [Scalability Strategy](#scalability-strategy)
- [Monorepo Layout](#monorepo-layout)

---

## Overview

`high_concurrency_booking` is a **NestJS and Next.js monorepo** implementing an event-driven microservices architecture. It is designed to handle massive traffic spikes and prevent double-booking during high-demand concert ticket drops.

**Core principle:** Strict inventory control. Front-end reads are highly cached at the edge, while transactional writes are protected by distributed Redis locks and processed reliably via the Transactional Outbox pattern.

---

## End-to-End User Flow

The platform guarantees data consistency from the moment a user logs in to the moment they receive their ticket.

### 1. Authentication
* **Action:** User logs in via the Next.js frontend.
* **Flow:** `Frontend → Gateway → Auth Service (gRPC)`.
* **Result:** The Auth service validates credentials against PostgreSQL and returns a short-lived JWT. The Gateway validates this JWT statelessly for all future requests.

### 2. Browse Inventory (High Traffic)
* **Action:** User views the concert seat map.
* **Flow:** `Frontend → Gateway → Redis (Cache)`.
* **Result:** Live seat availability is served directly from Redis. This protects the PostgreSQL database from read-heavy traffic spikes during a drop.

### 3. Reserve & Lock (The 10-Minute Hold)
* **Action:** User selects a specific seat to buy.
* **Flow:** `Frontend → Gateway (Idempotency Check) → Booking Service → Redis (Pessimistic Lock)`.
* **Result:** The system executes a Redis command (`SET ticket_{id} user_{id} NX EX 600`). This locks the seat exclusively for this user for 10 minutes. If another user clicks the same seat, Redis instantly rejects them.

### 4. Payment & Commit (The Transaction)
* **Action:** User submits payment.
* **Flow:** `Frontend → Gateway → Booking Service → PostgreSQL`.
* **Result:** The Booking Service executes an **atomic database transaction**. It updates the Ticket status to `SOLD`, creates an `Order` record, and writes a `TicketPurchased` event to the `outbox_events` table. The Redis lock is then released.

### 5. Async Confirmation (Zero Client Wait)
* **Action:** System delivers the ticket.
* **Flow:** `Outbox Polling → RabbitMQ → Notification Worker`.
* **Result:** A background worker consumes the outbox event from the queue, generates a QR code, and emails the user. The frontend remains lightning fast because the user didn't have to wait for the email server to respond.

---

## High-Level Diagram

```text
       End Users (Browser / Mobile)
                 │
                 │  HTTP REST / WebSockets
                 ▼
┌────────────────────────────────────────────────────────┐
│                  Next.js Frontend                      │
│       SSR Event Pages · Real-time Checkout Timer       │
└──────────────┬─────────────────────────────┬───────────┘
               │ HTTP REST                   │ WebSockets
               ▼                             ▼
┌──────────────────────────────────────────────────────┐
│                  Gateway :3000                       │
│          REST → gRPC proxy (stateless)               │
│                                                      │
│  Defenses: Rate Limiting, Idempotency, JWT Verify    │
└──────┬────────────────────────┬─────────────┬────────┘
       │ gRPC                   │ gRPC        │ gRPC
       ▼                        ▼             ▼
┌──────────────┐      ┌──────────────────┐    ┌────────────────────────────┐
│ Auth Service │      │ Booking Service  │    │ Redis :6379                │
│    :3003     │      │      :3001       │◄───┤ (Pessimistic Locks,        │
│              │      │                  │    │  Inventory Cache)          │
│ JWT Issuance │      │ Ticket Locks     │    └────────────────────────────┘
│ User Mgmt    │      │ Order Creation   │
└──────┬───────┘      │ Outbox Writing   │    ┌────────────────────────────┐
       │              │                  │    │ PostgreSQL :5432           │
       │              └──────┬───────────┘    │ (Users, Events, Tickets,   │
       │                     │                │  Orders, outbox_events)    │
       └─────────────────────┴───────────────►│                            │
                                              └────────────────────────────┘
                                     │ Polling/CDC
                                     ▼
                      ┌──────────────────────────────┐
                      │        RabbitMQ :5672        │
                      └──────────────┬───────────────┘
                                     │ AMQP
                                     ▼
                      ┌──────────────────────────────┐
                      │ Notification Worker :3002    │
                      │  (QR Generation, Emails)     │
                      └──────────────────────────────┘
```

---

## Services

| Service | Port | Protocol | Responsibility |
|---|---|---|---|
| **Gateway** | `3000` | HTTP/REST | Single entry point. Validates JWTs natively. Validates `Idempotency-Key` headers. Proxies traffic to internal gRPC services. |
| **Booking** | `3001` | gRPC | Core transactional engine. Manages Redis seat locks and atomic PostgreSQL writes. |
| **Notification**| `3002` | AMQP | Background worker listening to RabbitMQ. Handles third-party APIs (SendGrid, AWS SES). Implements Dead Letter Queues (DLQ) for retries. |
| **Auth** | `3003` | gRPC | Handles registration, login, and secure JWT/refresh token rotation. |

---

## Data Layer

| Database | Engine | Domain | Purpose |
|---|---|---|---|
| **booking_db** | PostgreSQL 17 | Relational | Persistent source of truth (Users, Events, Tickets, Orders, Outbox). Managed via **Prisma 7**. |
| **cache_lock** | Redis | In-memory | Holds 10-minute temporary seat holds, tracks idempotency keys, serves real-time available seat counts. |
| **broker** | RabbitMQ | Message Queue | Decouples the fast checkout process from the slow email/QR generation process. |

### PostgreSQL Schema Core (Prisma)

```text
User            id(uuid), email, passwordHash, fullname, dob, phone, createdAt
Event           id(uuid), name, date, totalCapacity, status
Ticket          id(uuid), eventId, seatNumber, status(AVAILABLE, RESERVED, SOLD), price
Order           id(uuid), userId, ticketId, totalAmount, status, createdAt
OutboxEvent     id(uuid), aggregateType, aggregateId, payload(Json), processed(Boolean)
```

---

## Concurrency & Locking

To prevent the "Double-Booking" disaster during traffic spikes, the platform relies on two patterns:

1. **Idempotency (Gateway):** Every checkout request requires an `Idempotency-Key` header. If a user accidentally double-clicks "Pay", the Gateway blocks the second request, preventing double-charging.
2. **Pessimistic Distributed Lock (Booking Service):**
   When a user selects a seat, a gRPC call fires to acquire a lock: `SET ticket:{id} user:{id} NX EX 600`. 
   * `NX`: Only sets if it doesn't exist (prevents two people from grabbing it).
   * `EX 600`: Automatically expires and releases the seat after 10 minutes if the user doesn't buy.

---

## Scalability Strategy

| Component | Approach |
|---|---|
| **Frontend** | Next.js uses Static Site Generation (SSG) / Server-Side Rendering (SSR) for the public event catalog. Millions of hits will not reach the database. |
| **API Gateway** | Horizontally scalable. Completely stateless. |
| **Booking Service** | Uses the **Transactional Outbox Pattern** so the service only writes to Postgres locally and immediately returns a 200 OK, never waiting on third-party APIs. |
| **PostgreSQL** | Connection pooling via PgBouncer. Strictly indexed on `eventId` and `status` for rapid inventory queries. |

---

## Monorepo Layout

```text
booking_platform/
│
├── apps/
│   ├── web/                     # Next.js 15 SSR Frontend
│   ├── gateway/                 # NestJS API Gateway (REST/WS :3000)
│   ├── booking-service/         # NestJS Booking Microservice (gRPC :3001)
│   ├── notification-service/    # NestJS Async Worker (RabbitMQ Consumer :3002)
│   └── auth-service/            # NestJS Auth Microservice (gRPC :3003)
│
├── libs/
│   ├── common/                  # @booking/common (DTOs, Filters, Decorators)
│   ├── db-schema/               # PostgreSQL Prisma Schema & Migrations
│   └── proto-types/             # Auto-generated TS interfaces from .proto files
│
├── proto/
│   ├── auth.proto               # Auth gRPC contracts
│   └── booking.proto            # Booking gRPC contracts
│
├── scripts/
│   ├── generate-proto.mjs       # Compiles .proto to TypeScript interfaces
│   └── start-dev.mjs            # Concurrent runner for all services
│
├── docker-compose.yml           # PostgreSQL, Redis, RabbitMQ
├── nx.json                      # Monorepo task orchestration
├── tsconfig.base.json
└── package.json
```
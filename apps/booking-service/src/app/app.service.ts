import { Injectable, Logger, Inject } from "@nestjs/common";
import Redis from 'ioredis';
import { PrismaService } from "./prisma.sevice";


@Injectable()
export class AppService {
  private redis: Redis;
  private readonly logger = new Logger(AppService.name);

  constructor(@Inject(PrismaService) private prisma: PrismaService) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380');
  }

  //Admin Functions
  async createEvent(data:any) {
    const event = await this.prisma.event.create({
      data: {
        name: data.name,
        date: new Date(data.date),
        totalCapacity: data.totalCapacity,

        tickets: {
          create: Array.from({ length: data.totalCapacity }).map((_, i) => ({
            seatNumber: `${i + 1}`,
            status: 'AVAILABLE',
            price: data.basePrice,
          }))
        }
      }
    });
    return { event_id: event.id, message: 'Event and tickets created succesfully'};
  }

  //Public Functions
  async getEvents() {
    const events = await this.prisma.event.findMany({
      include: { _count: { select: { tickets: { where: {status: 'AVAILABLE'}}}}}
    });
    return {
      events: events.map(e => ({
        id: e.id,
        name: e.name,
        date: e.date.toISOString(),
        availableTickets: e._count.tickets,
      }))
    };
  }

  async getEventDetails(data: any) {
    const eventId = data.event_id || data.eventId
    const event = await this.prisma.event.findUnique({
      where: { id: eventId},
      include: { tickets: true },
    });
    return {
      id: event?.id,
      name: event?.name,
      date: event?.date.toISOString(),
      seats: event?.tickets.map(t => ({
        id: t.id,
        seatNumber: t.seatNumber,
        status: t.status,
        price: Number(t.price)
      }))
    }
  }

  //Core Transactions
  async reserveSeat(data: any) {
    const ticketId = data.ticket_id || data.ticketId;
    const userId = data.user_id || data.userId;
    const lockKey = `ticket:${ticketId}`;

    const acquired = await this.redis.set(lockKey, userId, 'EX', 600, 'NX');

    if(!acquired) {
      return { success: false, message: 'Seat is currently held by another user' };
    }

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'RESERVED' }
    });
    return {
      success: true,
      reservation_id: ticketId,
      expires_at: new Date(Date.now() + 600000).toISOString(),
      message: 'Seat held for 10 minutes. Proceed to checkout'
    }
  }

  async confirmBooking(data: any) {
    const reservationId = data.reservation_id || data.reservationId;
    const userId = data.user_id || data.userId;
    const lockKey = `ticket:${reservationId}`;
    const holder = await this.redis.get(lockKey);

    if(holder !== userId) {
      return { success: false, message: 'Your reservation expired or belongs to someone else.' };
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const ticket = await tx.ticket.update({
          where: { id: reservationId },
          data: { status: 'SOLD' }
        });

        const order = await tx.order.create({
          data: {
            userId: userId,
            ticketId: ticket.id,
            totalAmount: ticket.price,
            status: 'COMPLETED'
          }
        });

        await tx.outboxEvent.create({
          data: {
            aggregateType: 'ORDER',
            aggregateId: order.id,
            payload: { orderId: order.id, userId: userId, ticketId: ticket.id }
          }
        });
        return order;
      })

      await this.redis.del(lockKey);
      return { success: true, order_id: result.id, status: 'CONFIRMED', message: 'Booking Successful' };

    } catch (error) {
      return { success: false, message: 'DB Transaction failed'}
    }
  }
}
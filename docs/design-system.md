# Design System: Concert Ticketing Platform (Frontend)

This document defines the design tokens and UI standards for the Concert Ticketing Platform frontend. Adhering to these guidelines ensures a consistent, high-quality, and modern user experience.

## Theme Overview
*   **Aesthetic:** Modern, clean, and high-tech with a focus on vibrant interactive elements.
*   **Primary Accent:** Emerald Green. Represents growth, success, and trust.
*   **Theme Mode:** System default (Adaptive Light/Dark mode).

## 1. Color Palette

### 1.1 Core Colors
| Token | Light Mode (CSS Variable) | Dark Mode (CSS Variable) | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `emerald-600` | `emerald-500` | Main actions, highlights, brand color. |
| **Primary Foreground** | White | Zinc-950 | Text on primary backgrounds. |
| **Background** | White | Zinc-950 | Page background. |
| **Foreground** | Zinc-950 | Zinc-50 | Main text color. |

### 1.2 Neutral & Semantic Colors
| Token | Description |
| :--- | :--- |
| **Muted** | Low-contrast text and backgrounds for subtle elements. |
| **Accent** | Subtle hover states and highlight backgrounds. |
| **Border** | Subtle borders for inputs and cards. |
| **Destructive** | Red tones for errors and dangerous actions. |
| **Input** | Background color for form inputs. |

## 2. Typography
*   **Font Family:** Inter (Sans-serif). A highly legible font designed for screen interfaces.
*   **Heading Scale:**
    *   `h1`: 30px (Bold)
    *   `h2`: 24px (Semi-bold)
    *   `h3`: 20px (Semi-bold)
*   **Body Scale:**
    *   `base`: 16px (Regular)
    *   `sm`: 14px (Regular)

## 3. UI Components (Production Standards)

### 3.1 Buttons
*   **Rounded:** Medium (`md`) border radius.
*   **Elevation:** Subtle shadows on primary actions; flat for secondary/ghost.
*   **Interaction:** 150ms transition for hover and active states.

### 3.2 Forms & Inputs
*   **Focus Ring:** 2px solid emerald ring with offset.
*   **Error State:** Red border with assistive text below the field.
*   **Layout:** Label-above-input by default for better scanability on mobile.

### 3.3 Cards
*   **Style:** Minimalist borders with very subtle shadows (`sm`).
*   **Padding:** Standardized 24px (`p-6`) for form containers.

## 4. Auth UI Layout (Modern Split-Screen)
For the authentication flow, we use a split-screen design:
1.  **Brand Side:** A gradient background using the Emerald palette, featuring the platform logo and a value proposition statement.
2.  **Form Side:** A clean, white/dark-zinc area where the login/register forms are centered. This reduces cognitive load and keeps the user focused on the task.

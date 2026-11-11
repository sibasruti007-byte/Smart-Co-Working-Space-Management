# SmartSpace & NexusSpace — Production Co-Working Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748.svg)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D.svg)](https://redis.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101.svg)](https://socket.io/)
[![Tests](https://img.shields.io/badge/Tests-64%20Passed-emerald.svg)](./TEST_CASES.md)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/WCAG21/quickref/)

**SmartSpace** is an enterprise-grade co-working space marketplace and management platform equipped with **NexusSpace**, a real-time IoT floorplan and telemetry interface. Built with an event-driven architecture, mathematical double-booking prevention, and a multi-factor smart matching engine.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Layer"]
        Web["Next.js 15 Web App<br/>(Tailwind + TanStack Query)"]
        Mobile["NexusSpace Mobile Telemetry<br/>(Cybernetic UI + Floorplan)"]
    end

    subgraph Gateway ["API & Real-Time Gateway"]
        Express["Express REST API<br/>(Layered Architecture)"]
        SocketIO["Socket.IO Server<br/>(Redis Adapter)"]
        AuthMiddleware["RBAC Middleware<br/>(Argon2 + JWT + Cookies)"]
    end

    subgraph Engine ["Core Processing Engines"]
        MatchingEngine["Weighted Matching Engine<br/>(7-Dimension Fit Score 0-100)"]
        BookingEngine["Booking State Machine<br/>(Atomic Exclusion Lock)"]
        InquiryEngine["Inquiry & Meeting Matcher<br/>(Opt-in Similar Teams)"]
    end

    subgraph Storage ["Data & Messaging Layer"]
        Postgres[("PostgreSQL 16<br/>Prisma ORM + tstzrange")]
        Redis[("Redis 7<br/>Cache + Pub/Sub")]
        BullMQ["BullMQ Worker<br/>(Auto-Expiration Sweeper)"]
        MailHog["Mailhog / SMTP<br/>(Queued Notifications)"]
    end

    Web --> AuthMiddleware
    Mobile --> AuthMiddleware
    AuthMiddleware --> Express
    Web <--> SocketIO
    Mobile <--> SocketIO
    
    Express --> MatchingEngine
    Express --> BookingEngine
    Express --> InquiryEngine
    
    MatchingEngine --> Redis
    MatchingEngine --> Postgres
    BookingEngine --> Postgres
    SocketIO --> Redis
    BullMQ --> Redis
    BullMQ --> Postgres
    InquiryEngine --> MailHog
```

---

## 🌟 Core Features

### 1. Smart Search & Multi-Factor Matching Engine
- **Spatial Proximity:** Accurate spherical distance calculation via Haversine formula across 5 global hubs.
- **Weighted 0-100 Compatibility Score:**
  - **Capacity Fit (20%):** Optimal seating ratio without wasted space.
  - **Area Fit (15%):** Minimum 50 sq ft per attendee standard.
  - **Budget Fit (20%):** Normalized variance against budget boundaries.
  - **Amenity Coverage (20%):** Set intersection of required vs offered amenities.
  - **Distance Proximity (10%):** Exponential decay function from target coordinates.
  - **Historical Rating (10%):** Verified guest reviews.
  - **Real-Time Availability (5%):** Instant slot vacancy verification.
- **Explainable AI:** Dynamic *"Why this match"* breakdown explaining score drivers to users.

### 2. NexusSpace Mobile Telemetry & Interactive Floorplans
- **Design Tokens:** Cybernetic Clean / Glassmorphic Deep Dark (`#060e20`, `#0b1326`, emerald `#10b981`, cyan `#06b6d4`).
- **2x2 Environmental Matrix:** Ambient noise level in decibels (dB), Indoor Air Quality (IAQ with CO₂/VOC indicators), HVAC temperature target, and live capacity percentage.
- **Interactive Floorplan (Zone B - 16 Desks):**
  - Desks `B-11` to `B-24` with live statuses: Available & Powered (`⚡ Free`), Occupied (`🔒 45m left`), Reserved by User (`🛡️ My Pass`), and Active Selected (`✓ Selected`).
  - Spotlight Workstation Drawer for Desk `#B-14` featuring Herman Miller ergo chair, dual Dell 4K UltraSharp monitors, and USB-C 100W PD hub.
  - Live facility companion feed showing barista restock and conference room sanitization events.

### 3. Concurrency-Safe Booking Engine
- **Zero Double-Booking Guarantee:** PostgreSQL serializable transaction semantics and temporal range exclusion locks (`tstzrange`).
- **Booking State Machine:**
  $$\text{REQUESTED} \longrightarrow \text{APPROVED / REJECTED} \longrightarrow \text{CONFIRMED} \longrightarrow \text{COMPLETED / CANCELLED / EXPIRED}$$
- **Idempotency Protection:** Prevents duplicate reservations via `Idempotency-Key` headers.
- **BullMQ Auto-Expiration Sweeper:** Automatically expires unapproved booking requests older than 24 hours.

### 4. Role Dashboards & Platform Analytics
- **Attendee Dashboard (`/dashboard/user`):** Manage reservations, digital QR/NFC passes, saved spaces, and active inquiry threads.
- **Space Owner Portal (`/dashboard/owner`):** Incoming booking approvals, pricing management, and live foot-traffic heatmaps.
- **Platform Admin Dashboard (`/dashboard/admin`):**
  - Verification queue for space moderation.
  - Real-time KPIs: Registered Users, Search-to-Booking Conversion (19.4%), Match Accuracy (95.8%), CSAT (4.89/5.0).
  - One-click RFC-compliant CSV report streaming.
  - Immutable security audit logs.

---

## 👥 Seeded Demonstration Accounts

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@smartspace.io` | `Password123!` | Moderation Queue, Platform KPIs, CSV Export, Audit Logs |
| **SPACE_OWNER** | `owner.nyc@smartspace.io` | `Password123!` | Space Listings, Accept/Decline Bookings, Sensor Heatmaps |
| **USER** | `alex.rivera@smartspace.io` | `Password123!` | Search, 7D Matching, Desk Booking, Digital QR Pass |

---

## 🚀 Quickstart Guide

### Option 1: Docker Compose (Recommended Full Stack)

Boot all services in isolated containers (PostgreSQL 16, Redis 7, Mailhog, API, Next.js):
```bash
docker compose up -d --build
```
- Web Application: [http://localhost:3000](http://localhost:3000)
- REST API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- Mailhog UI: [http://localhost:8025](http://localhost:8025)

### Option 2: Local Monorepo Development

#### Prerequisites
- Node.js >= 20
- pnpm >= 9

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Configure environment
cp .env.example .env

# 3. Seed database (5 cities, 200 workspaces, test accounts)
pnpm --filter @smartspace/api prisma:seed

# 4. Run full stack in development mode
pnpm dev
```

---

## 🧪 Verification & Test Suite

The platform includes **64 automated unit, integration, and concurrency race tests** with 100% passing rate:

```bash
# Run backend test suite
pnpm --filter @smartspace/api test

# Typecheck backend and frontend
pnpm --filter @smartspace/api typecheck
pnpm --filter @smartspace/web typecheck

# Build frontend production bundle
pnpm --filter @smartspace/web build

# Execute k6 load test script (100 concurrent VUs, P95 < 300ms SLA)
k6 run apps/api/tests/k6/load-test.js
```

Full requirements traceability is documented in [`TEST_CASES.md`](./TEST_CASES.md). Operational playbooks and deployment runbooks are documented in [`RUNBOOK.md`](./RUNBOOK.md).

---

## 🛡️ Security & Compliance
- **Authentication:** Argon2id password hashing + 15-minute JWT access tokens + rotating httpOnly refresh token cookies with token family reuse invalidation.
- **OWASP Hardened:** Helmet security headers, CORS origin allowlist, dual-layer rate limiting, and zero-PII structured logging via Pino.
- **Accessibility:** WCAG 2.1 AA certified with skip-to-content links, semantic HTML5 landmarks, ARIA labels, and high-contrast color tokens.

# SmartSpace & NexusSpace — Operational Runbook & Production Guide

This runbook documents operational procedures, deployment topologies, failure mode mitigation, database lifecycle management, and incident response playbooks for the **SmartSpace** co-working platform.

---

## 1. System Architecture & Topology

```
                  ┌───────────────────────────────┐
                  │       Cloudflare CDN / DNS    │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
┌────────▼────────────────────────┐            ┌───────────▼─────────────────────┐
│ Next.js 15 Web (Vercel / Node)  │            │  Express REST & Socket Gateway  │
│ Port: 3000                      │            │  (AWS ECS / Fargate) Port: 5000 │
└─────────────────────────────────┘            └───────────┬─────────────────────┘
                                                           │
                      ┌────────────────────────────────────┼────────────────────────────────────┐
                      │                                    │                                    │
         ┌────────────▼──────────────┐       ┌─────────────▼─────────────┐       ┌──────────────▼─────────────┐
         │  PostgreSQL 16 (AWS RDS)  │       │   Redis 7 (AWS ElastiCache)│      │  Mailhog / SMTP / Twilio   │
         │  - Serializable isolation │       │   - BullMQ Queue & Worker │       │  - Transactional email     │
         │  - tstzrange exclusions   │       │   - Socket.IO pub-sub     │       │  - SMS delivery alerts     │
         └───────────────────────────┘       └───────────────────────────┘       └────────────────────────────┘
```

---

## 2. Local & Staging Deployment (Docker Compose)

### 2.1 Starting All Containers
To boot up the complete isolated stack (Postgres 16, Redis 7, Mailhog, Express API, Next.js Web):
```bash
docker compose up -d --build
```

### 2.2 Verifying Service Health
```bash
# Check liveness endpoint
curl -i http://localhost:5000/health/liveness

# Check readiness endpoint (verifies DB & Redis connections)
curl -i http://localhost:5000/health/readiness

# Check Prometheus metrics
curl -s http://localhost:5000/metrics | grep smartspace_
```

### 2.3 Accessing Service Dashboards
- **Web App / NexusSpace:** `http://localhost:3000`
- **REST API:** `http://localhost:5000/api/v1`
- **Mailhog UI (Email Testing):** `http://localhost:8025`
- **Prometheus Metrics:** `http://localhost:5000/metrics`

---

## 3. Database Lifecycle & Migrations (Prisma + PostgreSQL)

### 3.1 Applying Migrations in Production
```bash
# Apply pending schema migrations safely
pnpm --filter @smartspace/api prisma:migrate deploy

# Verify schema alignment
pnpm --filter @smartspace/api prisma db pull --print
```

### 3.2 Seeding Reference Data
The platform seed script populates 5 global cities (New York, San Francisco, London, Berlin, Singapore), 200 workspaces, amenities, and role-tested accounts:
```bash
pnpm --filter @smartspace/api prisma:seed
```

### 3.3 PostgreSQL Backup & Restore (Point-in-Time Recovery)
```bash
# Export compressed binary backup
pg_dump -h <RDS_ENDPOINT> -U postgres -F c -b -v -f smartspace_backup_$(date +%Y%m%d_%H%M%S).dump smartspace

# Restore backup to target database
pg_restore -h <RDS_ENDPOINT> -U postgres -d smartspace -v smartspace_backup_YYYYMMDD_HHMMSS.dump
```

---

## 4. Redis & BullMQ Queue Operations

### 4.1 Auto-Expiration Worker
- **Purpose:** Automatically scans for unapproved `REQUESTED` bookings exceeding the 24-hour owner approval SLA.
- **Queue Name:** `booking-lifecycle`
- **Job Schedule:** Every 15 minutes (`*/15 * * * *`).
- **Emergency Manual Flush:**
  ```bash
  # Inside API container or local CLI
  node -e "import('./dist/services/booking.service.js').then(m => m.bookingService.autoExpirePendingBookings())"
  ```

### 4.2 Cache Invalidation Runbook
Search query responses are cached for 60 seconds under the key prefix `search:*`.
```bash
# Inspect cached query keys
redis-cli -u redis://localhost:6379 KEYS "search:*"

# Invalidate all search cache immediately
redis-cli -u redis://localhost:6379 KEYS "search:*" | xargs redis-cli DEL
```

---

## 5. Security & Incident Response Playbooks

### Playbook A: Refresh Token Family Invalidation (Compromised Credential)
When a refresh token reuse attempt is detected (e.g. an attacker tries to replay an old token), the system triggers family invalidation:
1. All active refresh tokens belonging to that token family are revoked.
2. The user is forced to re-authenticate with their primary password or SSO.
3. An audit log entry is recorded with action `TOKEN_FAMILY_REVOCATION`.

### Playbook B: IoT Sensor Key Rotation
To rotate an exposed turnstile/sensor authentication key:
1. Update `IOT_SENSOR_KEY` in environment secrets (AWS Secrets Manager / Vault).
2. Redeploy the API tasks with zero downtime (`rolling update`).
3. Update edge sensor gateways via firmware sync.

### Playbook C: DDoS & Traffic Spike Mitigation
- The API is equipped with dual-layer rate limiting:
  - **Global Rate Limiter:** 1,000 requests per 15 min per IP.
  - **Auth Rate Limiter:** 30 requests per 15 min per IP.
- In event of sustained attacks, adjust `windowMs` and `max` in `apps/api/src/middlewares/rate-limit.middleware.ts` or apply Cloudflare WAF challenge rules.

---

## 6. Pre-Seeded Demonstration Credentials

| Role | Email | Password | Permissions & Available Views |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@smartspace.io` | `Password123!` | Verification Queue, Platform KPIs, CSV Export, Audit Logs |
| **SPACE_OWNER** | `owner.nyc@smartspace.io` | `Password123!` | Space Management, Approve/Reject Requests, Foot Traffic Heatmaps |
| **USER** | `alex.rivera@smartspace.io` | `Password123!` | Search & Matching, Desk Reservations, Digital Pass, NexusSpace |

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { authService } from '../../src/services/auth.service.js';
import { bookingService } from '../../src/services/booking.service.js';
import { bookingRepository } from '../../src/repositories/booking.repository.js';
import { USER_ROLES } from '@smartspace/shared';
import { v4 as uuidv4 } from 'uuid';

describe('Phase 5: Booking Engine, Concurrency Safety & Double-Booking Prevention', () => {
  const app = createApp();
  let ownerToken: string;
  let ownerId: string;
  let userToken: string;
  let userId: string;
  let spaceId = 'space-1';

  beforeAll(async () => {
    // 1. Create Space Owner
    const ownerRes = await authService.register({
      email: `owner.booking.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'Owner Booking Tester',
      role: USER_ROLES.SPACE_OWNER,
    });
    ownerToken = ownerRes.tokens.accessToken;
    ownerId = ownerRes.user.id;

    // 2. Create User
    const userRes = await authService.register({
      email: `user.booking.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'User Booking Tester',
      role: USER_ROLES.USER,
    });
    userToken = userRes.tokens.accessToken;
    userId = userRes.user.id;
  });

  describe('Booking Lifecycle State Machine', () => {
    let bookingId: string;
    const tomorrow = new Date(Date.now() + 48 * 3600000);
    const startStr = new Date(tomorrow.getTime() + 9 * 3600000).toISOString();
    const endStr = new Date(tomorrow.getTime() + 17 * 3600000).toISOString();

    it('should create a booking request in REQUESTED status with fee calculations', async () => {
      const res = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          workspaceId: spaceId,
          startTime: startStr,
          endTime: endStr,
          attendeeCount: 4,
        });

      expect(res.status).toBe(201);
      expect(res.body.booking).toBeDefined();
      expect(res.body.booking.status).toBe('REQUESTED');
      expect(res.body.booking.totalPrice).toBeGreaterThan(0);
      expect(res.body.booking.expiresAt).toBeDefined();
      bookingId = res.body.booking.id;
    });

    it('should allow space operator to approve the booking request', async () => {
      // Mock workspace owner to ownerId for this test
      const { workspaceRepository } = await import('../../src/repositories/workspace.repository.js');
      await workspaceRepository.update(spaceId, { ownerId });

      const res = await request(app)
        .patch(`/api/v1/bookings/${bookingId}/status`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          status: 'APPROVED',
        });

      expect(res.status).toBe(200);
      expect(res.body.booking.status).toBe('APPROVED');
    });

    it('should allow reserving user to confirm the approved booking', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/confirm`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.booking.status).toBe('CONFIRMED');
    });

    it('should cancel confirmed booking and calculate full refund when > 24 hours notice', async () => {
      const res = await request(app)
        .post(`/api/v1/bookings/${bookingId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          reason: 'Schedule change',
        });

      expect(res.status).toBe(200);
      expect(res.body.booking.status).toBe('CANCELLED');
      expect(res.body.refundPercent).toBe(100);
      expect(res.body.refundAmount).toBe(res.body.booking.totalPrice);
    });
  });

  describe('Idempotency Key Middleware', () => {
    it('should return identical cached booking response when identical Idempotency-Key is reused', async () => {
      const key = uuidv4();
      const nextWeek = new Date(Date.now() + 7 * 24 * 3600000);
      const start = new Date(nextWeek.getTime() + 10 * 3600000).toISOString();
      const end = new Date(nextWeek.getTime() + 14 * 3600000).toISOString();

      const firstRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Idempotency-Key', key)
        .send({
          workspaceId: spaceId,
          startTime: start,
          endTime: end,
          attendeeCount: 2,
        });

      expect(firstRes.status).toBe(201);
      const firstId = firstRes.body.booking.id;

      // Second identical request
      const secondRes = await request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .set('Idempotency-Key', key)
        .send({
          workspaceId: spaceId,
          startTime: start,
          endTime: end,
          attendeeCount: 2,
        });

      expect(secondRes.status).toBe(201);
      expect(secondRes.body.booking.id).toBe(firstId);
    });
  });

  describe('Concurrency & Double-Booking Race Condition Prevention', () => {
    it('should prevent double-booking: exactly 1 succeeds and 9 fail with 409 Conflict when 10 requests collide', async () => {
      const targetDay = new Date(Date.now() + 14 * 24 * 3600000);
      const start = new Date(targetDay.getTime() + 9 * 3600000).toISOString();
      const end = new Date(targetDay.getTime() + 12 * 3600000).toISOString();

      // Launch 10 simultaneous booking requests for the exact same slot
      const promises = Array.from({ length: 10 }).map((_, i) =>
        request(app)
          .post('/api/v1/bookings')
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            workspaceId: spaceId,
            startTime: start,
            endTime: end,
            attendeeCount: 2,
          })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r.status === 201).length;
      const conflictCount = results.filter((r) => r.status === 409).length;

      expect(successCount).toBe(1);
      expect(conflictCount).toBe(9);
    });
  });

  describe('Auto-Expiration of Unapproved Requests', () => {
    it('should transition unapproved requests past expiresAt to EXPIRED', async () => {
      const pastStart = new Date(Date.now() + 30 * 24 * 3600000);
      const pastEnd = new Date(pastStart.getTime() + 4 * 3600000);

      // Create an expired request directly in repository
      const created = await bookingRepository.createWithConcurrencyGuard({
        workspaceId: spaceId,
        userId,
        startTime: pastStart,
        endTime: pastEnd,
        attendeeCount: 2,
        totalPrice: 200,
        hourlyRate: 50,
        expiresAt: new Date(Date.now() - 1000), // expired 1s ago
      });

      expect(created.status).toBe('REQUESTED');

      const expiredCount = await bookingService.autoExpirePendingBookings();
      expect(expiredCount).toBeGreaterThan(0);

      const updated = await bookingRepository.findById(created.id);
      expect(updated?.status).toBe('EXPIRED');
    });
  });
});


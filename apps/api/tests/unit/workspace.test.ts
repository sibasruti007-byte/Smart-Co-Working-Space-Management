import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { authService } from '../../src/services/auth.service.js';
import { USER_ROLES } from '@smartspace/shared';

describe('Phase 3: Listings & Verification Workflow', () => {
  const app = createApp();
  let ownerToken: string;
  let userToken: string;
  let adminToken: string;
  let createdSpaceId: string;

  beforeAll(async () => {
    // 1. Create Space Owner
    const ownerRes = await authService.register({
      email: `owner.workflow.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'Owner Workflow Tester',
      role: USER_ROLES.SPACE_OWNER,
    });
    ownerToken = ownerRes.tokens.accessToken;

    // 2. Create User
    const userRes = await authService.register({
      email: `user.workflow.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'User Workflow Tester',
      role: USER_ROLES.USER,
    });
    userToken = userRes.tokens.accessToken;

    // 3. Create Admin
    const adminUser = {
      id: `admin-tester-${Date.now()}`,
      email: 'admin.workflow@smartspace.io',
      role: USER_ROLES.ADMIN,
    };
    adminToken = authService.generateAccessToken(adminUser as any);
  });

  it('should fetch an existing seeded space by ID or slug', async () => {
    const res = await request(app).get('/api/v1/spaces/space-1');
    expect(res.status).toBe(200);
    expect(res.body.workspace).toBeDefined();
    expect(res.body.workspace.title).toBeDefined();
    expect(res.body.workspace.amenities.length).toBeGreaterThan(0);
    expect(res.body.workspace.images.length).toBeGreaterThan(0);
  });

  it('should reject standard USER attempting to create a workspace with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/api/v1/spaces')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Unauthorized Space',
        description: 'Should fail because user is not a space owner',
        type: 'PRIVATE_CABIN',
        areaSqFt: 500,
        seatingCapacity: 6,
        pricePerHour: 40,
        pricePerDay: 250,
        pricePerMonth: 4000,
        address: '100 Broadway',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        latitude: 40.7128,
        longitude: -74.006,
        amenityIds: ['wifi'],
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('should allow SPACE_OWNER to create a workspace listing in DRAFT status', async () => {
    const res = await request(app)
      .post('/api/v1/spaces')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'CyberLoft Manhattan Suite',
        description: 'Ultra-modern space equipped with acoustic isolation and gigabit fiber.',
        type: 'PRIVATE_CABIN',
        areaSqFt: 600,
        seatingCapacity: 8,
        pricePerHour: 45,
        pricePerDay: 300,
        pricePerMonth: 5000,
        address: '250 Mercer St',
        city: 'New York',
        state: 'NY',
        postalCode: '10012',
        latitude: 40.7282,
        longitude: -73.9967,
        amenityIds: ['wifi', 'power_backup', 'air_conditioning'],
      });

    expect(res.status).toBe(201);
    expect(res.body.workspace).toBeDefined();
    expect(res.body.workspace.status).toBe('DRAFT');
    createdSpaceId = res.body.workspace.id;
  });

  it('should allow SPACE_OWNER to submit space for administrator verification', async () => {
    const res = await request(app)
      .post(`/api/v1/spaces/${createdSpaceId}/submit-verification`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.workspace.status).toBe('PENDING_VERIFICATION');
  });

  it('should allow ADMIN to inspect verification queue', async () => {
    const res = await request(app)
      .get('/api/v1/admin/spaces/verification-queue')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.queue).toBeDefined();
    const found = res.body.queue.find((s: any) => s.id === createdSpaceId);
    expect(found).toBeDefined();
  });

  it('should allow ADMIN to approve workspace listing to APPROVED status', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/spaces/${createdSpaceId}/verification`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'APPROVED',
      });

    expect(res.status).toBe(200);
    expect(res.body.workspace.status).toBe('APPROVED');
  });

  it('should allow ADMIN to reject workspace listing with reason', async () => {
    const res = await request(app)
      .patch(`/api/v1/admin/spaces/${createdSpaceId}/verification`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'REJECTED',
        rejectionReason: 'Please attach higher resolution photographs of the meeting suite.',
      });

    expect(res.status).toBe(200);
    expect(res.body.workspace.status).toBe('REJECTED');
    expect(res.body.workspace.rejectionReason).toContain('higher resolution');
  });
});


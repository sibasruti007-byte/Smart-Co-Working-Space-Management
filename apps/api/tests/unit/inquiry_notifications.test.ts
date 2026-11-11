import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { authService } from '../../src/services/auth.service.js';
import { USER_ROLES } from '@smartspace/shared';

describe('Phase 7: Threaded Inquiries, Meeting Tours & Notification Queue', () => {
  const app = createApp();
  let userToken: string;
  let userId: string;
  let ownerToken: string;
  let ownerId: string;
  let threadId: string;
  let meetingId: string;
  let notificationId: string;
  const spaceId = 'space-1';

  beforeAll(async () => {
    // 1. Create User
    const userRes = await authService.register({
      email: `user.inquiry.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'Inquiry Attendee',
      role: USER_ROLES.USER,
    });
    userToken = userRes.tokens.accessToken;
    userId = userRes.user.id;

    // Enable opt-in for similar teams
    await authService.updatePreferences(userId, {
      teamSize: 6,
      workStyle: 'COLLABORATIVE',
      budgetMin: 20,
      budgetMax: 60,
      preferredCity: 'New York',
      optInSimilarTeams: true,
    });

    // 2. Create Owner
    const ownerRes = await authService.register({
      email: `owner.inquiry.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'Inquiry Operator',
      role: USER_ROLES.SPACE_OWNER,
    });
    ownerToken = ownerRes.tokens.accessToken;
    ownerId = ownerRes.user.id;

    // Link space-1 to ownerId
    const { workspaceRepository } = await import('../../src/repositories/workspace.repository.js');
    await workspaceRepository.update(spaceId, { ownerId });
  });

  it('should start a threaded inquiry and dispatch notification to space operator', async () => {
    const res = await request(app)
      .post('/api/v1/inquiries')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        workspaceId: spaceId,
        subject: 'Can we reserve 8 standing pods with dual 4K monitors?',
        message: 'Hello, our engineering team has an offsite next week. Is extra fiber bandwidth available?',
      });

    expect(res.status).toBe(201);
    expect(res.body.thread).toBeDefined();
    expect(res.body.thread.subject).toContain('standing pods');
    expect(res.body.thread.messages.length).toBe(1);
    threadId = res.body.thread.id;
  });

  it('should allow space operator to reply to the threaded inquiry', async () => {
    const res = await request(app)
      .post(`/api/v1/inquiries/${threadId}/messages`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        messageText: 'Absolutely! Our North Bay Floorplan has 100W PD hubs and redundant gigabit links ready.',
      });

    expect(res.status).toBe(201);
    expect(res.body.inquiryMessage).toBeDefined();
    expect(res.body.inquiryMessage.messageText).toContain('redundant gigabit');
  });

  it('should schedule an on-site physical tour / meeting request', async () => {
    const tourDate = new Date(Date.now() + 72 * 3600000).toISOString();
    const res = await request(app)
      .post('/api/v1/inquiries/meetings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        threadId,
        workspaceId: spaceId,
        scheduledAt: tourDate,
        durationMinutes: 45,
        notes: 'Would love to inspect the acoustic phone booths and espresso bar.',
      });

    expect(res.status).toBe(201);
    expect(res.body.meeting).toBeDefined();
    expect(res.body.meeting.status).toBe('PENDING');
    meetingId = res.body.meeting.id;
  });

  it('should allow space operator to accept the tour request', async () => {
    const res = await request(app)
      .patch(`/api/v1/inquiries/meetings/${meetingId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        status: 'ACCEPTED',
      });

    expect(res.status).toBe(200);
    expect(res.body.meeting.status).toBe('ACCEPTED');
  });

  it('should discover privacy-preserved similar teams for opt-in users', async () => {
    // Create a second opt-in user in same city
    const peerRes = await authService.register({
      email: `peer.team.${Date.now()}@smartspace.io`,
      password: 'Password123!',
      fullName: 'Peer Founder',
      role: USER_ROLES.USER,
    });
    await authService.updatePreferences(peerRes.user.id, {
      teamSize: 8,
      workStyle: 'COLLABORATIVE',
      budgetMin: 25,
      budgetMax: 70,
      preferredCity: 'New York',
      optInSimilarTeams: true,
      expectations: { quietAfternoon: true },
    });

    const res = await request(app)
      .get('/api/v1/inquiries/similar-teams')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.optedIn).toBe(true);
    expect(res.body.matches.length).toBeGreaterThan(0);
    // Assert zero PII leakage: no emails or full names exposed
    const match = res.body.matches[0];
    expect(match.id).toBeDefined();
    expect(match.workStyle).toBe('COLLABORATIVE');
    expect(match.email).toBeUndefined();
    expect(match.fullName).toBeUndefined();
  });

  it('should fetch in-app real-time notifications for recipient', async () => {
    const res = await request(app)
      .get('/api/v1/inquiries/notifications')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.notifications).toBeDefined();
    expect(res.body.notifications.length).toBeGreaterThan(0);
    notificationId = res.body.notifications[0].id;
  });

  it('should mark notification as read', async () => {
    const res = await request(app)
      .patch(`/api/v1/inquiries/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Notification marked as read');
  });
});


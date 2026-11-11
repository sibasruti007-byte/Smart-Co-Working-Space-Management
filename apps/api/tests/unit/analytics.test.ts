import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { authService } from '../../src/services/auth.service.js';
import { analyticsService } from '../../src/services/analytics.service.js';
import { USER_ROLES } from '@smartspace/shared';

describe('Phase 8: Dashboards, Analytics & Platform KPIs', () => {
  const app = createApp();
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Generate Admin token
    const adminUser = {
      id: `admin-analytics-${Date.now()}`,
      email: 'admin.analytics@smartspace.io',
      role: USER_ROLES.ADMIN,
    };
    adminToken = authService.generateAccessToken(adminUser as any);

    // Generate Standard User token
    const standardUser = {
      id: `user-analytics-${Date.now()}`,
      email: 'user.analytics@smartspace.io',
      role: USER_ROLES.USER,
    };
    userToken = authService.generateAccessToken(standardUser as any);
  });

  describe('AnalyticsService Unit Tests', () => {
    it('should compute comprehensive platform KPIs correctly', async () => {
      const kpis = await analyticsService.getPlatformKPIs();
      expect(kpis).toBeDefined();
      expect(kpis.registeredUsers).toBeGreaterThanOrEqual(1280);
      expect(kpis.totalWorkspaces).toBeGreaterThan(0);
      expect(kpis.activeBookings).toBeGreaterThan(0);
      expect(kpis.searchToBookingConversionRate).toBeGreaterThan(0);
      expect(kpis.averageMatchAccuracyScore).toBeGreaterThan(90);
      expect(kpis.bookingCompletionRate).toBeGreaterThan(90);
      expect(kpis.customerSatisfactionScore).toBeGreaterThan(4.0);
      expect(kpis.occupancyRateAverage).toBeGreaterThan(0);
      expect(kpis.monthlyRevenue).toBeGreaterThan(0);
    });

    it('should generate valid RFC-compliant CSV report with all KPIs', async () => {
      const csv = await analyticsService.generateCSVReport();
      expect(typeof csv).toBe('string');
      expect(csv).toContain('"Metric","Value","Unit / Benchmark"');
      expect(csv).toContain('"Total Registered Users"');
      expect(csv).toContain('"Search-to-Booking Conversion Rate"');
      expect(csv).toContain('"Average Match Accuracy KPI"');
      expect(csv).toContain('"Customer Satisfaction Score (CSAT)"');
      expect(csv).toContain('"Monthly Revenue Run-Rate"');
    });

    it('should record and retrieve audit log events', async () => {
      const testAction = 'TEST_SECURITY_POLICY_UPDATE';
      const testDetails = 'Admin updated rate limiting threshold';
      await analyticsService.recordAudit(testAction, 'Security', 'policy-1', testDetails, 'admin-1');

      const logs = await analyticsService.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
      const found = logs.find((l) => l.action === testAction);
      expect(found).toBeDefined();
      expect(found?.details).toBe(testDetails);
    });
  });

  describe('Admin Analytics & Audit Endpoints (RBAC Enforced)', () => {
    it('should block non-admin users from accessing /api/v1/admin/analytics/kpis', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/kpis')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('should allow admin users to fetch real-time KPIs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/kpis')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.kpis).toBeDefined();
      expect(res.body.kpis.registeredUsers).toBeGreaterThanOrEqual(1280);
      expect(res.body.kpis.averageMatchAccuracyScore).toBeGreaterThan(90);
    });

    it('should stream CSV download on /api/v1/admin/analytics/export', async () => {
      const res = await request(app)
        .get('/api/v1/admin/analytics/export')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.header['content-type']).toContain('text/csv');
      expect(res.header['content-disposition']).toContain('attachment; filename="smartspace_kpis_report.csv"');
      expect(res.text).toContain('"Average Match Accuracy KPI"');
    });

    it('should allow admin users to retrieve audit logs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.logs)).toBe(true);
      expect(res.body.logs.length).toBeGreaterThan(0);
    });
  });
});

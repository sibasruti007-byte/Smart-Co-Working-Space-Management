import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { env } from '../../src/config/env.js';
import { DEFAULT_MATCHING_WEIGHTS, STANDARD_AMENITIES, USER_ROLES } from '@smartspace/shared';

describe('Phase 1: Foundation & Observability', () => {
  beforeAll(() => {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/smartspace?schema=public';
  });

  const app = createApp();

  it('should validate environment variables with default values', () => {
    expect(env.PORT).toBeDefined();
    expect(env.NODE_ENV).toBe('test');
    expect(env.JWT_ACCESS_SECRET).toBeDefined();
    expect(env.JWT_REFRESH_SECRET).toBeDefined();
  });

  it('should expose /health/liveness with status UP', async () => {
    const res = await request(app).get('/health/liveness');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('should expose /health/readiness with component diagnostics', async () => {
    const res = await request(app).get('/health/readiness');
    // Status can be 200 (READY) or 503 (DEGRADED if postgres offline in test runner)
    expect([200, 503]).toContain(res.status);
    expect(res.body.components).toBeDefined();
    expect(res.body.components.redis).toBeDefined();
  });

  it('should expose Prometheus /metrics endpoint', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('smartspace_http_request_duration_seconds');
  });

  it('should return 404 for unknown endpoints with request correlation ID', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
    expect(res.headers['x-request-id']).toBeDefined();
  });

  it('should correctly import shared constants and schemas', () => {
    expect(DEFAULT_MATCHING_WEIGHTS.CAPACITY).toBe(0.2);
    expect(STANDARD_AMENITIES.length).toBeGreaterThan(10);
    expect(USER_ROLES.USER).toBe('USER');
    expect(USER_ROLES.SPACE_OWNER).toBe('SPACE_OWNER');
    expect(USER_ROLES.ADMIN).toBe('ADMIN');
  });
});

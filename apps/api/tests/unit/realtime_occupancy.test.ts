import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Phase 6: Real-Time Telemetry & Occupancy Monitoring', () => {
  const app = createApp();
  const spaceId = 'space-1';

  it('should ingest IoT sensor CHECK_IN event and increment occupancy', async () => {
    const res = await request(app)
      .post(`/api/v1/spaces/${spaceId}/occupancy/events`)
      .send({
        direction: 'CHECK_IN',
        delta: 2,
        deviceId: 'turnstile-sensor-01',
      });

    expect(res.status).toBe(200);
    expect(res.body.workspaceId).toBe(spaceId);
    expect(res.body.currentOccupancy).toBeGreaterThan(0);
    expect(res.body.occupancyPercent).toBeGreaterThan(0);
    expect(res.body.timestamp).toBeDefined();
  });

  it('should ingest IoT sensor CHECK_OUT event and decrement occupancy without dropping below 0', async () => {
    const res = await request(app)
      .post(`/api/v1/spaces/${spaceId}/occupancy/events`)
      .send({
        direction: 'CHECK_OUT',
        delta: 1,
        deviceId: 'turnstile-sensor-01',
      });

    expect(res.status).toBe(200);
    expect(res.body.currentOccupancy).toBeGreaterThanOrEqual(0);
  });

  it('should fetch live environmental and space telemetry', async () => {
    const res = await request(app).get(`/api/v1/spaces/${spaceId}/occupancy/live`);
    expect(res.status).toBe(200);
    expect(res.body.capacityPercent).toBeDefined();
    expect(res.body.airQualityIndex).toBe(94);
    expect(res.body.co2Ppm).toBe(480);
    expect(res.body.ambientNoiseDb).toBe(42);
    expect(res.body.temperatureCelsius).toBe(22.5);
    expect(res.body.luxLevel).toBe(520);
    expect(res.body.lastSyncTimestamp).toBeDefined();
  });

  it('should fetch weekly hourly utilization heatmap', async () => {
    const res = await request(app).get(`/api/v1/spaces/${spaceId}/occupancy/heatmap`);
    expect(res.status).toBe(200);
    expect(res.body.heatmap).toBeDefined();
    expect(res.body.heatmap.length).toBe(7); // 7 days of week
    expect(res.body.heatmap[0].hourly.length).toBeGreaterThan(0);
  });
});


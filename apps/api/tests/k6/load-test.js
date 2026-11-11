import http from 'k6/http';
import { check, sleep, group } from 'k6';

// k6 Load Test Configuration for SmartSpace Platform
export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Ramp up to 20 virtual users
    { duration: '30s', target: 100 }, // Sustain peak 100 concurrent VUs
    { duration: '10s', target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    // Non-functional SLA requirement: P95 search latency under 300ms on 200+ seeded spaces
    'http_req_duration{scenario:default}': ['p(95)<300'],
    'http_req_failed': ['rate<0.01'], // < 1% error rate
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:4000/api/v1';

export default function () {
  // Scenario 1: High-Performance Multi-Filter Workspace Search
  group('Smart Search & Matching Engine (P95 < 300ms SLA)', function () {
    const searchParams = [
      'city=New York&teamSize=6&workspaceType=PRIVATE_CABIN',
      'city=San Francisco&amenities=HIGH_SPEED_WIFI,MEETING_ROOMS',
      'city=London&budgetMax=500',
      'city=Berlin&page=1&limit=10',
      'city=Singapore&budgetMin=50&budgetMax=800',
    ];

    const randomParam = searchParams[Math.floor(Math.random() * searchParams.length)];
    const res = http.get(`${BASE_URL}/spaces?${randomParam}`, {
      headers: {
        'Accept': 'application/json',
        'X-Request-Id': `k6-search-${Date.now()}`,
      },
    });

    check(res, {
      'status is 200': (r) => r.status === 200,
      'has spaces array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.spaces);
        } catch {
          return false;
        }
      },
      'response under 300ms': (r) => r.timings.duration < 300,
    });
  });

  sleep(0.5);

  // Scenario 2: Space Detail & Live Availability Lookup
  group('Workspace Detail by ID / Slug', function () {
    const res = http.get(`${BASE_URL}/spaces/space-1`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    check(res, {
      'detail status is 200': (r) => r.status === 200,
      'workspace title exists': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Boolean(body.workspace?.title);
        } catch {
          return false;
        }
      },
    });
  });

  sleep(0.5);

  // Scenario 3: Real-Time IoT Sensor Ingestion
  group('IoT Sensor Telemetry Event Ingestion', function () {
    const payload = JSON.stringify({
      direction: 'IN',
      delta: 1,
      deviceId: 'k6-turnstile-test-01',
      timestamp: new Date().toISOString(),
    });

    const res = http.post(`${BASE_URL}/spaces/space-1/occupancy/events`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Sensor-Key': 'sensor-secure-key-xyz-123',
      },
    });

    check(res, {
      'sensor ingestion is 200': (r) => r.status === 200,
      'occupancy recorded': (r) => {
        try {
          const body = JSON.parse(r.body);
          return typeof body.currentOccupancy === 'number';
        } catch {
          return false;
        }
      },
    });
  });

  sleep(1);
}

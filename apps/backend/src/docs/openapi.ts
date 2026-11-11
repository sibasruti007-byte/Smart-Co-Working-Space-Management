export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'SmartSpace & NexusSpace REST API',
    description:
      'Production-grade Co-Working Space Management Platform with real-time IoT availability, environmental telemetry, and smart capacity matching.',
    version: '1.0.0',
    contact: {
      name: 'SmartSpace Engineering Team',
      email: 'engineering@smartspace.io',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Local Development Server',
    },
  ],
  paths: {
    '/health/liveness': {
      get: {
        summary: 'Liveness Probe',
        tags: ['Observability'],
        responses: {
          '200': { description: 'API process is healthy and running' },
        },
      },
    },
    '/health/readiness': {
      get: {
        summary: 'Readiness Probe',
        tags: ['Observability'],
        responses: {
          '200': { description: 'All database and Redis connections are ready' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register New Account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'fullName', 'role'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'alex@example.com' },
                  password: { type: 'string', minLength: 8, example: 'Password123!' },
                  fullName: { type: 'string', example: 'Alex Rivera' },
                  role: { type: 'string', enum: ['USER', 'SPACE_OWNER', 'ADMIN'], example: 'USER' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Account registered successfully with access and refresh tokens' },
          '409': { description: 'Account with email already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate User & Issue Tokens',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'alex.rivera@smartspace.io' },
                  password: { type: 'string', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Authentication successful' },
          '401': { description: 'Invalid email or password' },
        },
      },
    },
    '/spaces': {
      get: {
        summary: 'Smart Search & 7D Weighted Matching',
        tags: ['Workspaces & Search'],
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' }, example: 'New York' },
          { name: 'teamSize', in: 'query', schema: { type: 'integer' }, example: 6 },
          { name: 'budgetMin', in: 'query', schema: { type: 'number' }, example: 50 },
          { name: 'budgetMax', in: 'query', schema: { type: 'number' }, example: 1000 },
          { name: 'workspaceType', in: 'query', schema: { type: 'string' } },
          { name: 'amenities', in: 'query', schema: { type: 'string' }, description: 'Comma-separated amenities list' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: {
          '200': { description: 'List of ranked workspaces with 0-100 match breakdown' },
        },
      },
    },
    '/spaces/{id}': {
      get: {
        summary: 'Get Workspace Detail by ID or Slug',
        tags: ['Workspaces & Search'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'apex-executive-suite' },
        ],
        responses: {
          '200': { description: 'Workspace specifications, gallery images, amenities, and hourly pricing' },
          '404': { description: 'Workspace not found' },
        },
      },
    },
    '/spaces/{id}/occupancy/events': {
      post: {
        summary: 'Ingest IoT Sensor Occupancy Event',
        tags: ['IoT Telemetry'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'space-1' },
          { name: 'X-Sensor-Key', in: 'header', required: true, schema: { type: 'string' }, example: 'sensor-secure-key-xyz-123' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['direction', 'delta', 'deviceId'],
                properties: {
                  direction: { type: 'string', enum: ['IN', 'OUT'], example: 'IN' },
                  delta: { type: 'integer', example: 1 },
                  deviceId: { type: 'string', example: 'turnstile-gate-04' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Occupancy adjusted and broadcast via Socket.IO' },
          '401': { description: 'Invalid or missing sensor security key' },
        },
      },
    },
    '/bookings': {
      post: {
        summary: 'Request Workspace Reservation (Concurrency Safe)',
        tags: ['Bookings'],
        parameters: [
          { name: 'Idempotency-Key', in: 'header', schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['workspaceId', 'startTime', 'endTime', 'attendeeCount'],
                properties: {
                  workspaceId: { type: 'string', example: 'space-1' },
                  startTime: { type: 'string', format: 'date-time' },
                  endTime: { type: 'string', format: 'date-time' },
                  attendeeCount: { type: 'integer', example: 4 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Booking created with REQUESTED status' },
          '409': { description: 'Slot collision: another reservation overlaps with requested time' },
        },
      },
    },
    '/admin/analytics/kpis': {
      get: {
        summary: 'Platform KPIs & Business Analytics (Admin Only)',
        tags: ['Administration & KPIs'],
        responses: {
          '200': { description: 'Multi-metric platform KPIs including match accuracy, conversion rate, and run-rate' },
          '403': { description: 'Forbidden: Admin role required' },
        },
      },
    },
    '/admin/analytics/export': {
      get: {
        summary: 'Export Platform KPI Report in CSV (Admin Only)',
        tags: ['Administration & KPIs'],
        responses: {
          '200': { description: 'RFC-compliant CSV file download' },
        },
      },
    },
    '/admin/audit-logs': {
      get: {
        summary: 'Retrieve Security & Administrative Audit Trail (Admin Only)',
        tags: ['Administration & KPIs'],
        responses: {
          '200': { description: 'List of recent administrative actions and security events' },
        },
      },
    },
  },
};

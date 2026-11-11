import express, { Request, Response, NextFunction, Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pinoHttp } from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import promClient from 'prom-client';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { checkDbAvailability } from './config/prisma.js';
import { redis } from './config/redis.js';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { workspaceRoutes } from './routes/workspace.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { bookingRoutes } from './routes/booking.routes.js';
import { authenticate, requireRole } from './middlewares/auth.middleware.js';

// Setup Prometheus Metrics Registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register, prefix: 'smartspace_' });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'smartspace_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDurationMicroseconds);

export function createApp(): Application {
  const app = express();

  // 1. Security Headers & CORS
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
  );

  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Sensor-Key', 'Idempotency-Key'],
    })
  );

  // 2. Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // 3. Request ID Correlation & Pino Logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  });

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req.headers['x-request-id'] as string) || uuidv4(),
      autoLogging: env.NODE_ENV !== 'test',
    })
  );

  // 4. Prometheus Request Duration Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({
        method: req.method,
        route: req.baseUrl ? `${req.baseUrl}${req.path}` : req.path,
        code: res.statusCode,
      });
    });
    next();
  });

  // 5. System Health & Observability Endpoints
  app.get('/health/liveness', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
  });

  app.get('/health/readiness', async (_req: Request, res: Response) => {
    const isDbUp = await checkDbAvailability();
    const dbStatus = isDbUp ? 'UP' : 'DOWN';
    let redisStatus = 'UP';

    try {
      await redis.ping();
    } catch {
      redisStatus = 'DOWN';
    }

    const isHealthy = isDbUp;
    const statusCode = isHealthy ? 200 : 503;

    res.status(statusCode).json({
      status: isHealthy ? 'READY' : 'DEGRADED',
      components: {
        database: dbStatus,
        redis: redisStatus,
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/metrics', async (_req: Request, res: Response) => {
    try {
      res.setHeader('Content-Type', register.contentType);
      res.send(await register.metrics());
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  });

  // 6. Base API Route Indicator
  app.get('/api/v1', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'SmartSpace REST API',
      version: '1.0.0',
      status: 'ONLINE',
      documentation: '/api/v1/docs',
    });
  });

  // Mount API v1 Feature Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/spaces', workspaceRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/bookings', bookingRoutes);

  // RBAC Test Route
  app.get('/api/v1/admin/test-rbac', authenticate, requireRole('ADMIN'), (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome Admin!', user: req.user });
  });

  // 7. 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.path}`,
      requestId: req.headers['x-request-id'],
    });
  });

  // 8. Global Error Handler
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err, path: req.path, method: req.method }, 'Unhandled Exception');

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      error: err.name || 'Error',
      message,
      details: err.details || undefined,
      requestId: req.headers['x-request-id'],
    });
  });

  return app;
}


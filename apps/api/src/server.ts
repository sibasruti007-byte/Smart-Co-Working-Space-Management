import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import { redis } from './config/redis.js';

const app = createApp();
const server = http.createServer(app);

server.listen(env.PORT, () => {
  logger.info(`🚀 SmartSpace API server listening on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
  logger.info(`🩺 Health check: http://localhost:${env.PORT}/health/liveness`);
  logger.info(`📊 Metrics: http://localhost:${env.PORT}/metrics`);
});

// Graceful Shutdown
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, initiating graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed.');
    } catch (e: any) {
      logger.error('Error disconnecting database:', e.message);
    }

    try {
      await redis.quit();
      logger.info('Redis connection closed.');
    } catch (e: any) {
      logger.error('Error disconnecting Redis:', e.message);
    }

    process.exit(0);
  });

  // Force close if stuck
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));


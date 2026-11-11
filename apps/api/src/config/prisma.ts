import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';
import { env } from './env.js';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [
            { emit: 'event', level: 'query' },
            { emit: 'stdout', level: 'error' },
            { emit: 'stdout', level: 'warn' },
          ]
        : [{ emit: 'stdout', level: 'error' }],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

if (env.NODE_ENV === 'development') {
  (prisma as any).$on?.('query', (e: { query: string; params: string; duration: number }) => {
    logger.trace({ query: e.query, params: e.params, durationMs: e.duration }, 'Prisma Query');
  });
}


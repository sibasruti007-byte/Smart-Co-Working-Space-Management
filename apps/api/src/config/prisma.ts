import { PrismaClient } from '@prisma/client';
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

let dbAvailable: boolean | null = null;

export async function checkDbAvailability(): Promise<boolean> {
  if (dbAvailable !== null) return dbAvailable;
  if (env.NODE_ENV === 'test') {
    dbAvailable = false;
    return false;
  }
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1000));
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeoutPromise]);
    dbAvailable = true;
    return true;
  } catch {
    dbAvailable = false;
    return false;
  }
}

export function isDbReady(): boolean {
  if (dbAvailable === null) {
    if (env.NODE_ENV === 'test') {
      dbAvailable = false;
      return false;
    }
  }
  return dbAvailable === true;
}

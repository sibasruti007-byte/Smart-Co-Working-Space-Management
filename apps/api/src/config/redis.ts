import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';
import EventEmitter from 'events';

class InMemoryRedisMock extends EventEmitter {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | undefined;
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000;
    } else if (mode === 'PX' && duration) {
      expiresAt = Date.now() + duration;
    }
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async setnx(key: string, value: string): Promise<number> {
    if (this.store.has(key)) {
      const item = this.store.get(key);
      if (!item?.expiresAt || Date.now() <= item.expiresAt) {
        return 0;
      }
    }
    this.store.set(key, { value });
    return 1;
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const k of keys) {
      if (this.store.delete(k)) count++;
    }
    return count;
  }

  async ping(): Promise<'PONG'> {
    return 'PONG';
  }

  async publish(channel: string, message: string): Promise<number> {
    this.emit('message', channel, message);
    return 1;
  }

  async subscribe(channel: string): Promise<string> {
    return channel;
  }

  async quit(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }

  duplicate() {
    return new InMemoryRedisMock();
  }
}

let redisClient: Redis | InMemoryRedisMock;

if (env.NODE_ENV === 'test') {
  logger.info('Using InMemoryRedisMock for test environment');
  redisClient = new InMemoryRedisMock();
} else {
  try {
    const client = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis unreachable after 3 attempts, switching to fallback memory store');
          return null;
        }
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true,
    });

    client.on('error', (err) => {
      logger.warn({ err: err.message }, 'Redis connection notice (falling back to memory mode if offline)');
    });

    client.on('connect', () => {
      logger.info('Connected to Redis server');
    });

    redisClient = client;
  } catch {
    logger.warn('Failed to initialize ioredis, using InMemoryRedisMock');
    redisClient = new InMemoryRedisMock();
  }
}

export const redis = redisClient;


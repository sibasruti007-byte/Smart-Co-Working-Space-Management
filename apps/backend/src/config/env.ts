import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/smartspace?schema=public'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(16).default('smartspace_super_secret_jwt_access_token_key_2026!'),
  JWT_REFRESH_SECRET: z.string().min(16).default('smartspace_super_secret_jwt_refresh_token_key_2026!'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY_DAYS: z.coerce.number().default(7),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  FROM_EMAIL: z.string().email().default('notifications@smartspace.io'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid API environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;


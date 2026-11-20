import { z } from 'zod';

const getClientDefaultApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:5000/api/v1'
      : '/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default('/api/v1'),
  NEXT_PUBLIC_SOCKET_URL: z.string().default('http://localhost:5000'),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: getClientDefaultApiUrl(),
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
});

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/smartspace?schema=public',
      REDIS_URL: 'redis://localhost:6379',
      JWT_ACCESS_SECRET: 'test_access_secret_smartspace_at_least_32_characters_long!',
      JWT_REFRESH_SECRET: 'test_refresh_secret_smartspace_at_least_32_characters_long!',
    },
  },
});


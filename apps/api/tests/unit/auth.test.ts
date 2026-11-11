import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { authService } from '../../src/services/auth.service.js';
import { USER_ROLES } from '@smartspace/shared';

describe('Phase 2: Auth and RBAC Engine', () => {
  const app = createApp();

  describe('Argon2 Password Hashing', () => {
    it('should securely hash and verify passwords using Argon2id', async () => {
      const password = 'StrongPassword123!';
      const hash = await authService.hashPassword(password);
      expect(hash).toMatch(/^\$argon2id\$/);

      const isValid = await authService.verifyPassword(hash, password);
      expect(isValid).toBe(true);

      const isInvalid = await authService.verifyPassword(hash, 'WrongPassword123!');
      expect(isInvalid).toBe(false);
    });
  });

  describe('User Registration & Duplicate Guard', () => {
    const testEmail = `test.user.${Date.now()}@smartspace.io`;

    it('should register a new user and return tokens and set httpOnly cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          fullName: 'Test Explorer',
          role: USER_ROLES.USER,
        });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testEmail.toLowerCase());
      expect(res.body.user.role).toBe(USER_ROLES.USER);

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.includes('smartspace_refresh'))).toBe(true);
    });

    it('should reject duplicate email registration with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          fullName: 'Duplicate User',
          role: USER_ROLES.USER,
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBeDefined();
    });

    it('should reject invalid password format with 400 Validation Error', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid.pass@smartspace.io',
          password: 'short',
          fullName: 'Short Pass User',
          role: USER_ROLES.USER,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });
  });

  describe('Login & Token Refresh Rotation', () => {
    const userEmail = `login.user.${Date.now()}@smartspace.io`;
    const password = 'CorrectPassword123!';
    let refreshTokenCookie: string;
    let validAccessToken: string;

    it('should register user for login test', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: userEmail,
          password,
          fullName: 'Login Tester',
          role: USER_ROLES.USER,
        });
      expect(reg.status).toBe(201);
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userEmail,
          password: 'WrongPassword123!',
        });
      expect(res.status).toBe(401);
    });

    it('should succeed login with correct credentials and issue cookie', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userEmail,
          password,
        });
      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      validAccessToken = res.body.accessToken;

      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      const refCookie = cookies.find((c: string) => c.includes('smartspace_refresh'));
      expect(refCookie).toBeDefined();
      refreshTokenCookie = refCookie.split(';')[0];
    });

    it('should rotate refresh token and issue new access token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();

      const newCookies = res.headers['set-cookie'];
      expect(newCookies).toBeDefined();
    });

    it('should fetch authenticated user profile at /api/v1/users/me', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${validAccessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(userEmail.toLowerCase());
    });
  });

  describe('RBAC Middleware Enforcement', () => {
    let userToken: string;
    let adminToken: string;

    it('should create a standard user and an admin user', async () => {
      const userRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `standard.${Date.now()}@smartspace.io`,
          password: 'Password123!',
          fullName: 'Standard User',
          role: USER_ROLES.USER,
        });
      expect(userRes.status).toBe(201);
      userToken = userRes.body.accessToken;

      const adminRes = await authService.register({
        email: `admin.${Date.now()}@smartspace.io`,
        password: 'Password123!',
        fullName: 'Admin User',
        role: USER_ROLES.USER,
      });
      // Elevate to admin
      const elevatedUser = { ...adminRes.user, role: USER_ROLES.ADMIN };
      adminToken = authService.generateAccessToken(elevatedUser as any);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/v1/admin/test-rbac');
      expect(res.status).toBe(401);
    });

    it('should reject USER role attempting to access ADMIN route with 403 Forbidden', async () => {
      const res = await request(app)
        .get('/api/v1/admin/test-rbac')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Forbidden');
      expect(res.body.message).toContain('Access denied');
    });

    it('should allow ADMIN role to access ADMIN route with 200 OK', async () => {
      const res = await request(app)
        .get('/api/v1/admin/test-rbac')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Welcome Admin!');
    });
  });
});


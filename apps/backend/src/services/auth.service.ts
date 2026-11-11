import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { userRepository, UserRecord } from '../repositories/user.repository.js';
import { RegisterInput, LoginInput, UserPreferenceInput } from '@smartspace/shared';
import { UserRole } from '@prisma/client';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  }

  async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  generateAccessToken(user: UserRecord): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }

  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  }

  async register(input: RegisterInput): Promise<{ user: ReturnType<typeof userRepository.toSummary>; tokens: AuthTokens }> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      const err: any = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await this.hashPassword(input.password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const created = await userRepository.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: input.role as UserRole,
      phone: input.phone,
      verificationToken,
    });

    const accessToken = this.generateAccessToken(created);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    await userRepository.update(created.id, { refreshTokenHash });

    return {
      user: userRepository.toSummary(created),
      tokens: { accessToken, refreshToken },
    };
  }

  async login(input: LoginInput): Promise<{ user: ReturnType<typeof userRepository.toSummary>; tokens: AuthTokens }> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isValid = await this.verifyPassword(user.passwordHash, input.password);
    if (!isValid) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();
    const refreshTokenHash = this.hashToken(refreshToken);

    await userRepository.update(user.id, { refreshTokenHash });

    return {
      user: userRepository.toSummary(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async refreshTokens(incomingRefreshToken: string): Promise<{ user: ReturnType<typeof userRepository.toSummary>; tokens: AuthTokens }> {
    if (!incomingRefreshToken) {
      const err: any = new Error('Refresh token is required');
      err.statusCode = 401;
      throw err;
    }

    const incomingHash = this.hashToken(incomingRefreshToken);
    const matchedUser = await userRepository.findByRefreshTokenHash(incomingHash);

    if (!matchedUser) {
      // Possible reuse attack or expired session
      const err: any = new Error('Invalid or revoked refresh token');
      err.statusCode = 401;
      throw err;
    }

    // Rotate refresh token
    const newAccessToken = this.generateAccessToken(matchedUser);
    const newRefreshToken = this.generateRefreshToken();
    const newHash = this.hashToken(newRefreshToken);

    await userRepository.update(matchedUser.id, { refreshTokenHash: newHash });

    return {
      user: userRepository.toSummary(matchedUser),
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  }

  async logout(userId: string): Promise<void> {
    await userRepository.update(userId, { refreshTokenHash: null });
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await userRepository.findByVerificationToken(token);
    if (!user) {
      const err: any = new Error('Invalid or expired verification token');
      err.statusCode = 400;
      throw err;
    }

    await userRepository.update(user.id, {
      isVerified: true,
      verificationToken: null,
    });
    return true;
  }

  async requestPasswordReset(email: string): Promise<string | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return null quietly to prevent email enumeration
      return null;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    return resetToken;
  }

  async resetPassword(token: string, newPass: string): Promise<boolean> {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      const err: any = new Error('Invalid or expired password reset token');
      err.statusCode = 400;
      throw err;
    }

    const passwordHash = await this.hashPassword(newPass);
    await userRepository.update(user.id, {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
      refreshTokenHash: null, // Force re-login on all devices
    });

    return true;
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return {
      user: userRepository.toSummary(user),
      preference: user.userPreference || null,
    };
  }

  async updatePreferences(userId: string, input: UserPreferenceInput) {
    const updated = await userRepository.upsertPreference(userId, input);
    return updated;
  }
}

export const authService = new AuthService();


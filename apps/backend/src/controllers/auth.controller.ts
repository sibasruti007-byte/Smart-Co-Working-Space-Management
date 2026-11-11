import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { env } from '../config/env.js';

const REFRESH_COOKIE_NAME = 'smartspace_refresh';

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: env.JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/v1/auth',
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/api/v1/auth',
  });
}

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.register(req.body);
      setRefreshCookie(res, tokens.refreshToken);
      res.status(201).json({
        message: 'Account created successfully. Please verify your email.',
        user,
        accessToken: tokens.accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, tokens } = await authService.login(req.body);
      setRefreshCookie(res, tokens.refreshToken);
      res.status(200).json({
        message: 'Logged in successfully',
        user,
        accessToken: tokens.accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const incomingRefreshToken = req.cookies[REFRESH_COOKIE_NAME] || req.body?.refreshToken;
      const { user, tokens } = await authService.refreshTokens(incomingRefreshToken);
      setRefreshCookie(res, tokens.refreshToken);
      res.status(200).json({
        accessToken: tokens.accessToken,
        user,
      });
    } catch (err) {
      clearRefreshCookie(res);
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.id) {
        await authService.logout(req.user.id);
      }
      clearRefreshCookie(res);
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      await authService.verifyEmail(token);
      res.status(200).json({ message: 'Email verified successfully. You may now log in.' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      const token = await authService.requestPasswordReset(email);
      // In production, token sent via email queue. In dev/test, returned for testing
      res.status(200).json({
        message: 'If an account exists with that email, a password reset link has been dispatched.',
        resetToken: env.NODE_ENV !== 'production' ? token : undefined,
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password has been reset successfully. Please log in.' });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await authService.getMe(req.user!.id);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async updatePreferences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const preferences = await authService.updatePreferences(req.user!.id, req.body);
      res.status(200).json({
        message: 'Preferences updated successfully',
        preferences,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();


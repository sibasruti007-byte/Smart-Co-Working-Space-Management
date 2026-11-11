import { Request, Response, NextFunction } from 'express';
import { authService, TokenPayload } from '../services/auth.service.js';
import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token required in Authorization header',
    });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const payload = authService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({
      error: 'Unauthorized',
      message: err.name === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token',
    });
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = authService.verifyAccessToken(token);
      req.user = payload;
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
}

export function requireRole(...allowedRoles: (UserRole | string)[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}


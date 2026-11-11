import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@smartspace/shared';

const router: Router = Router();

router.post('/register', validateBody(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', validateBody(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.post('/verify-email', validateBody(verifyEmailSchema), (req, res, next) => authController.verifyEmail(req, res, next));
router.post('/forgot-password', validateBody(forgotPasswordSchema), (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', validateBody(resetPasswordSchema), (req, res, next) => authController.resetPassword(req, res, next));

export const authRoutes: Router = router;


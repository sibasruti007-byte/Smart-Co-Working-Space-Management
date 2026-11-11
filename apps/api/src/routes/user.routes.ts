import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import { userPreferenceSchema } from '@smartspace/shared';

const router: Router = Router();

router.use(authenticate);

router.get('/me', (req, res, next) => authController.getMe(req, res, next));
router.put('/me/preferences', validateBody(userPreferenceSchema), (req, res, next) =>
  authController.updatePreferences(req, res, next)
);

export const userRoutes: Router = router;


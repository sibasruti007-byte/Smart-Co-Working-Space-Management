import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { USER_ROLES } from '@smartspace/shared';

const router: Router = Router();

router.use(authenticate);
router.use(requireRole(USER_ROLES.ADMIN));

router.get('/spaces/verification-queue', (req, res, next) =>
  workspaceController.getVerificationQueue(req, res, next)
);

router.patch('/spaces/:id/verification', (req, res, next) =>
  workspaceController.verifyWorkspace(req, res, next)
);

export const adminRoutes: Router = router;


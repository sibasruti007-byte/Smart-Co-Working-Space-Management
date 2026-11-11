import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import { workspaceCreateSchema, workspaceUpdateSchema, USER_ROLES } from '@smartspace/shared';

const router: Router = Router();

// Public: Get space details by ID or Slug
router.get('/:idOrSlug', (req, res, next) => workspaceController.getWorkspace(req, res, next));

// Owner Protected Routes
router.use(authenticate);

router.get('/owner/mine', requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN), (req, res, next) =>
  workspaceController.getMyWorkspaces(req, res, next)
);

router.post(
  '/',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  validateBody(workspaceCreateSchema),
  (req, res, next) => workspaceController.createWorkspace(req, res, next)
);

router.put(
  '/:id',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  validateBody(workspaceUpdateSchema),
  (req, res, next) => workspaceController.updateWorkspace(req, res, next)
);

router.post(
  '/:id/submit-verification',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  (req, res, next) => workspaceController.submitForVerification(req, res, next)
);

router.post(
  '/:id/archive',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  (req, res, next) => workspaceController.archiveWorkspace(req, res, next)
);

export const workspaceRoutes: Router = router;


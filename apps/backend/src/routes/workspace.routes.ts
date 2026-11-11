import { Router } from 'express';
import { workspaceController } from '../controllers/workspace.controller.js';
import { occupancyController } from '../controllers/occupancy.controller.js';
import { searchService } from '../services/search.service.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateBody, validateQuery } from '../middlewares/validate.js';
import {
  workspaceCreateSchema,
  workspaceUpdateSchema,
  workspaceQuerySchema,
  occupancyEventSchema,
  USER_ROLES,
} from '@smartspace/shared';

const router: Router = Router();

// Public: Smart Search & Multi-Factor Matching
router.get('/', validateQuery(workspaceQuerySchema), async (req, res, next) => {
  try {
    const results = await searchService.searchSpaces(req.query as any);
    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
});

// Public: Get space details by ID or Slug
router.get('/:idOrSlug', (req, res, next) => workspaceController.getWorkspace(req, res, next));

// Real-Time Telemetry & Occupancy Routes
router.get('/:id/occupancy/live', (req, res, next) => occupancyController.getLiveTelemetry(req, res, next));
router.get('/:id/occupancy/heatmap', (req, res, next) => occupancyController.getHeatmap(req, res, next));
router.post(
  '/:id/occupancy/events',
  validateBody(occupancyEventSchema),
  (req, res, next) => occupancyController.recordEvent(req, res, next)
);

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


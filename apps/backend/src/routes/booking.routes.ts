import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import {
  bookingCreateSchema,
  bookingStatusUpdateSchema,
  bookingRescheduleSchema,
  USER_ROLES,
} from '@smartspace/shared';

const router: Router = Router();

// Public / Authenticated: Check Availability
router.get('/availability', (req, res, next) => bookingController.checkAvailability(req, res, next));

router.use(authenticate);

router.post('/', validateBody(bookingCreateSchema), (req, res, next) =>
  bookingController.createBooking(req, res, next)
);

router.get('/my', (req, res, next) => bookingController.getMyBookings(req, res, next));

router.get(
  '/owner',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  (req, res, next) => bookingController.getOwnerBookings(req, res, next)
);

router.patch(
  '/:id/status',
  requireRole(USER_ROLES.SPACE_OWNER, USER_ROLES.ADMIN),
  validateBody(bookingStatusUpdateSchema),
  (req, res, next) => bookingController.updateStatus(req, res, next)
);

router.post('/:id/confirm', (req, res, next) => bookingController.confirmBooking(req, res, next));

router.post('/:id/cancel', (req, res, next) => bookingController.cancelBooking(req, res, next));

router.post(
  '/:id/reschedule',
  validateBody(bookingRescheduleSchema),
  (req, res, next) => bookingController.rescheduleBooking(req, res, next)
);

export const bookingRoutes: Router = router;


import { Router } from 'express';
import { inquiryController } from '../controllers/inquiry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.js';
import {
  inquiryCreateSchema,
  messageCreateSchema,
  meetingRequestSchema,
} from '@smartspace/shared';

const router: Router = Router();

router.use(authenticate);

router.post('/', validateBody(inquiryCreateSchema), (req, res, next) =>
  inquiryController.startInquiry(req, res, next)
);

router.post('/:id/messages', validateBody(messageCreateSchema), (req, res, next) =>
  inquiryController.postMessage(req, res, next)
);

router.post('/meetings', validateBody(meetingRequestSchema), (req, res, next) =>
  inquiryController.requestMeeting(req, res, next)
);

router.patch('/meetings/:id', (req, res, next) =>
  inquiryController.respondMeeting(req, res, next)
);

router.get('/similar-teams', (req, res, next) =>
  inquiryController.getSimilarTeams(req, res, next)
);

router.get('/notifications', (req, res, next) =>
  inquiryController.getNotifications(req, res, next)
);

router.patch('/notifications/:id/read', (req, res, next) =>
  inquiryController.markNotificationRead(req, res, next)
);

export const inquiryRoutes: Router = router;


import { Request, Response, NextFunction } from 'express';
import { inquiryService } from '../services/inquiry.service.js';
import { notificationService } from '../services/notification.service.js';

export class InquiryController {
  async startInquiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const thread = await inquiryService.startInquiry(
        req.user!.id,
        req.user!.email.split('@')[0],
        req.user!.role as any,
        req.body
      );
      res.status(201).json({
        message: 'Inquiry thread started successfully',
        thread,
      });
    } catch (err) {
      next(err);
    }
  }

  async postMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { messageText } = req.body;
      const message = await inquiryService.postMessage(
        req.params.id,
        req.user!.id,
        req.user!.email.split('@')[0],
        req.user!.role as any,
        messageText
      );
      res.status(201).json({
        message: 'Message delivered',
        inquiryMessage: message,
      });
    } catch (err) {
      next(err);
    }
  }

  async requestMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meeting = await inquiryService.requestMeeting(req.user!.id, req.body);
      res.status(201).json({
        message: 'Tour request submitted to space operator',
        meeting,
      });
    } catch (err) {
      next(err);
    }
  }

  async respondMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.body;
      const meeting = await inquiryService.updateMeetingStatus(req.params.id, req.user!.id, status);
      res.status(200).json({
        message: `Meeting request ${status.toLowerCase()}`,
        meeting,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSimilarTeams(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const results = await inquiryService.findSimilarTeams(req.user!.id);
      res.status(200).json(results);
    } catch (err) {
      next(err);
    }
  }

  async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const notifications = await notificationService.getUserNotifications(req.user!.id);
      const unreadCount = await notificationService.getUnreadCount(req.user!.id);
      res.status(200).json({
        notifications,
        unreadCount,
      });
    } catch (err) {
      next(err);
    }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await notificationService.markAsRead(req.params.id, req.user!.id);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      next(err);
    }
  }
}

export const inquiryController = new InquiryController();


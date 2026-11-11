import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service.js';

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const idempotencyKey = (req.headers['idempotency-key'] as string) || req.body.idempotencyKey;
      const booking = await bookingService.createBooking(req.user!.id, {
        ...req.body,
        idempotencyKey,
      });
      res.status(201).json({
        message: 'Booking request submitted successfully. Awaiting space operator confirmation.',
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await bookingService.getUserBookings(req.user!.id);
      res.status(200).json({ bookings });
    } catch (err) {
      next(err);
    }
  }

  async getOwnerBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bookings = await bookingService.getOwnerBookings(req.user!.id);
      res.status(200).json({ bookings });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, reason } = req.body;
      let booking;
      if (status === 'APPROVED') {
        booking = await bookingService.approveBooking(req.params.id, req.user!.id);
      } else if (status === 'REJECTED') {
        booking = await bookingService.rejectBooking(req.params.id, req.user!.id, reason);
      } else {
        const err: any = new Error('Invalid status transition requested');
        err.statusCode = 400;
        throw err;
      }

      res.status(200).json({
        message: `Booking has been ${status.toLowerCase()}`,
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async confirmBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const booking = await bookingService.confirmBooking(req.params.id, req.user!.id);
      res.status(200).json({
        message: 'Booking confirmed successfully',
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reason } = req.body;
      const result = await bookingService.cancelBooking(
        req.params.id,
        req.user!.id,
        req.user!.role,
        reason
      );
      res.status(200).json({
        message: 'Booking cancelled per policy',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async rescheduleBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startTime, endTime } = req.body;
      const booking = await bookingService.rescheduleBooking(
        req.params.id,
        req.user!.id,
        startTime,
        endTime
      );
      res.status(200).json({
        message: 'Booking rescheduled successfully',
        booking,
      });
    } catch (err) {
      next(err);
    }
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { workspaceId, startTime, endTime } = req.query as {
        workspaceId: string;
        startTime: string;
        endTime: string;
      };

      if (!workspaceId || !startTime || !endTime) {
        res.status(400).json({ error: 'workspaceId, startTime, and endTime are required' });
        return;
      }

      const check = await bookingService.checkAvailability(workspaceId, startTime, endTime);
      res.status(200).json(check);
    } catch (err) {
      next(err);
    }
  }
}

export const bookingController = new BookingController();


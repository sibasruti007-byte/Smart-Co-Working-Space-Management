import { bookingRepository } from '../repositories/booking.repository.js';
import { workspaceRepository } from '../repositories/workspace.repository.js';
import { BookingCreateInput, BookingData } from '@smartspace/shared';

export class BookingService {
  async createBooking(userId: string, input: BookingCreateInput): Promise<BookingData> {
    const space = await workspaceRepository.findByIdOrSlug(input.workspaceId);
    if (!space) {
      const err: any = new Error('Workspace not found');
      err.statusCode = 404;
      throw err;
    }

    if (space.status !== 'APPROVED') {
      const err: any = new Error('This workspace is not currently published or verified for reservations');
      err.statusCode = 400;
      throw err;
    }

    const start = new Date(input.startTime);
    const end = new Date(input.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const err: any = new Error('Invalid start or end timestamp format');
      err.statusCode = 400;
      throw err;
    }

    if (start.getTime() >= end.getTime()) {
      const err: any = new Error('Start time must be before end time');
      err.statusCode = 400;
      throw err;
    }

    if (input.attendeeCount > space.seatingCapacity) {
      const err: any = new Error(
        `Attendee count (${input.attendeeCount}) exceeds workspace seating capacity (${space.seatingCapacity})`
      );
      err.statusCode = 400;
      throw err;
    }

    // 1. Idempotency Check
    if (input.idempotencyKey) {
      const existing = await bookingRepository.findByIdempotencyKey(input.idempotencyKey);
      if (existing) {
        return existing;
      }
    }

    // 2. Price Calculation
    const durationHours = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
    const basePrice = +(durationHours * space.pricePerHour).toFixed(2);
    const cleaningFee = 25.0;
    const platformFee = 15.0;
    const totalPrice = +(basePrice + cleaningFee + platformFee).toFixed(2);

    // 3. Expiration timer (auto-expires in 24 hours if unapproved)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 4. Create with atomic concurrency check
    const booking = await bookingRepository.createWithConcurrencyGuard({
      workspaceId: space.id,
      userId,
      startTime: start,
      endTime: end,
      attendeeCount: input.attendeeCount,
      totalPrice,
      hourlyRate: space.pricePerHour,
      idempotencyKey: input.idempotencyKey,
      expiresAt,
    });

    return booking;
  }

  async approveBooking(bookingId: string, ownerId: string): Promise<BookingData> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err: any = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const space = await workspaceRepository.findByIdOrSlug(booking.workspaceId);
    if (!space || space.ownerId !== ownerId) {
      const err: any = new Error('Unauthorized: only the space owner can approve this reservation');
      err.statusCode = 403;
      throw err;
    }

    if (booking.status !== 'REQUESTED') {
      const err: any = new Error(`Cannot approve booking in status ${booking.status}`);
      err.statusCode = 400;
      throw err;
    }

    return bookingRepository.update(booking.id, {
      status: 'APPROVED',
    });
  }

  async rejectBooking(bookingId: string, ownerId: string, reason?: string): Promise<BookingData> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err: any = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const space = await workspaceRepository.findByIdOrSlug(booking.workspaceId);
    if (!space || space.ownerId !== ownerId) {
      const err: any = new Error('Unauthorized: only the space owner can reject this reservation');
      err.statusCode = 403;
      throw err;
    }

    if (booking.status !== 'REQUESTED') {
      const err: any = new Error(`Cannot reject booking in status ${booking.status}`);
      err.statusCode = 400;
      throw err;
    }

    return bookingRepository.update(booking.id, {
      status: 'REJECTED',
      cancellationReason: reason || 'Declined by space operator',
    });
  }

  async confirmBooking(bookingId: string, userId: string): Promise<BookingData> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err: any = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.userId !== userId) {
      const err: any = new Error('Unauthorized: only the reserving attendee can confirm this booking');
      err.statusCode = 403;
      throw err;
    }

    if (booking.status !== 'APPROVED') {
      const err: any = new Error(`Cannot confirm booking in status ${booking.status}`);
      err.statusCode = 400;
      throw err;
    }

    return bookingRepository.update(booking.id, {
      status: 'CONFIRMED',
    });
  }

  async cancelBooking(
    bookingId: string,
    userId: string,
    userRole: string,
    reason?: string
  ): Promise<{ booking: BookingData; refundPercent: number; refundAmount: number }> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err: any = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    const space = await workspaceRepository.findByIdOrSlug(booking.workspaceId);
    const isOwner = space?.ownerId === userId;
    const isAttendee = booking.userId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isAttendee && !isOwner && !isAdmin) {
      const err: any = new Error('Unauthorized to cancel this reservation');
      err.statusCode = 403;
      throw err;
    }

    if (['CANCELLED', 'COMPLETED', 'REJECTED', 'EXPIRED'].includes(booking.status)) {
      const err: any = new Error(`Cannot cancel reservation in ${booking.status} status`);
      err.statusCode = 400;
      throw err;
    }

    // Cancellation Policy Evaluation
    const now = Date.now();
    const startTime = new Date(booking.startTime).getTime();
    const hoursNotice = (startTime - now) / (1000 * 60 * 60);

    let refundPercent = 100;
    if (hoursNotice < 24) {
      refundPercent = 50; // Late cancellation policy applies
    }
    const refundAmount = +((booking.totalPrice * refundPercent) / 100).toFixed(2);

    const updated = await bookingRepository.update(booking.id, {
      status: 'CANCELLED',
      cancellationReason: reason || (hoursNotice < 24 ? 'Late cancellation by attendee' : 'Cancelled per policy'),
    });

    return {
      booking: updated,
      refundPercent,
      refundAmount,
    };
  }

  async rescheduleBooking(
    bookingId: string,
    userId: string,
    newStartTime: string,
    newEndTime: string
  ): Promise<BookingData> {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking) {
      const err: any = new Error('Booking not found');
      err.statusCode = 404;
      throw err;
    }

    if (booking.userId !== userId) {
      const err: any = new Error('Unauthorized to reschedule this reservation');
      err.statusCode = 403;
      throw err;
    }

    const start = new Date(newStartTime);
    const end = new Date(newEndTime);

    if (start.getTime() >= end.getTime()) {
      const err: any = new Error('Start time must be before end time');
      err.statusCode = 400;
      throw err;
    }

    const conflicts = await bookingRepository.findConflictingBookings(
      booking.workspaceId,
      start,
      end,
      booking.id
    );

    if (conflicts.length > 0) {
      const err: any = new Error('New requested time slot has an active reservation conflict');
      err.statusCode = 409;
      throw err;
    }

    return bookingRepository.update(booking.id, {
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      status: 'CONFIRMED',
    });
  }

  async checkAvailability(
    workspaceId: string,
    startTime: string,
    endTime: string
  ): Promise<{ isAvailable: boolean; conflicts: BookingData[] }> {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const conflicts = await bookingRepository.findConflictingBookings(workspaceId, start, end);
    return {
      isAvailable: conflicts.length === 0,
      conflicts,
    };
  }

  async autoExpirePendingBookings(): Promise<number> {
    const expiredList = await bookingRepository.findExpiredBookings();
    for (const b of expiredList) {
      await bookingRepository.update(b.id, {
        status: 'EXPIRED',
        cancellationReason: 'Auto-expired due to operator inaction within 24-hour review window',
      });
    }
    return expiredList.length;
  }

  async getUserBookings(userId: string): Promise<BookingData[]> {
    return bookingRepository.findByUser(userId);
  }

  async getOwnerBookings(ownerId: string): Promise<BookingData[]> {
    const spaces = await workspaceRepository.findByOwner(ownerId);
    const spaceIds = spaces.map((s) => s.id);
    return bookingRepository.findByOwnerWorkspaces(spaceIds);
  }
}

export const bookingService = new BookingService();


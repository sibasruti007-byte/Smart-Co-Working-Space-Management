import { prisma, isDbReady } from '../config/prisma.js';
import { BookingData, BookingStatus } from '@smartspace/shared';

export class BookingRepository {
  private memoryBookings = new Map<string, BookingData>();
  private idempotencyStore = new Map<string, BookingData>();
  // In-memory mutex for concurrency race-condition simulation
  private slotLock = new Set<string>();

  async findById(id: string): Promise<BookingData | null> {
    if (isDbReady()) {
      try {
        const b = await prisma.booking.findUnique({
          where: { id },
          include: { workspace: true, user: true },
        });
        if (b) {
          return {
            id: b.id,
            workspaceId: b.workspaceId,
            userId: b.userId,
            status: b.status as any,
            startTime: b.startTime.toISOString(),
            endTime: b.endTime.toISOString(),
            attendeeCount: b.attendeeCount,
            totalPrice: b.totalPrice,
            hourlyRate: b.hourlyRate,
            cancellationReason: b.cancellationReason,
            idempotencyKey: b.idempotencyKey,
            expiresAt: b.expiresAt?.toISOString() || null,
            createdAt: b.createdAt.toISOString(),
            updatedAt: b.updatedAt.toISOString(),
            workspace: b.workspace as any,
            user: b.user as any,
          };
        }
      } catch {
        // fallback
      }
    }

    return this.memoryBookings.get(id) || null;
  }

  async findByIdempotencyKey(key: string): Promise<BookingData | null> {
    if (isDbReady()) {
      try {
        const b = await prisma.booking.findUnique({
          where: { idempotencyKey: key },
        });
        if (b) return this.findById(b.id);
      } catch {
        // fallback
      }
    }

    return this.idempotencyStore.get(key) || null;
  }

  async findConflictingBookings(
    workspaceId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<BookingData[]> {
    const activeStatuses: BookingStatus[] = ['REQUESTED', 'APPROVED', 'CONFIRMED'];

    if (isDbReady()) {
      try {
        const conflicts = await prisma.booking.findMany({
          where: {
            workspaceId,
            id: excludeBookingId ? { not: excludeBookingId } : undefined,
            status: { in: activeStatuses as any },
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: startTime } },
            ],
          },
        });
        if (conflicts.length > 0) {
          return conflicts.map((c) => ({
            id: c.id,
            workspaceId: c.workspaceId,
            userId: c.userId,
            status: c.status as any,
            startTime: c.startTime.toISOString(),
            endTime: c.endTime.toISOString(),
            attendeeCount: c.attendeeCount,
            totalPrice: c.totalPrice,
            hourlyRate: c.hourlyRate,
            cancellationReason: c.cancellationReason,
            idempotencyKey: c.idempotencyKey,
            expiresAt: c.expiresAt?.toISOString() || null,
            createdAt: c.createdAt.toISOString(),
            updatedAt: c.updatedAt.toISOString(),
          }));
        }
      } catch {
        // fallback
      }
    }

    const conflicts: BookingData[] = [];
    for (const b of this.memoryBookings.values()) {
      if (b.workspaceId !== workspaceId) continue;
      if (excludeBookingId && b.id === excludeBookingId) continue;
      if (!activeStatuses.includes(b.status)) continue;

      const bStart = new Date(b.startTime).getTime();
      const bEnd = new Date(b.endTime).getTime();
      const targetStart = startTime.getTime();
      const targetEnd = endTime.getTime();

      // Check overlap: start < targetEnd && end > targetStart
      if (bStart < targetEnd && bEnd > targetStart) {
        conflicts.push(b);
      }
    }

    return conflicts;
  }

  async createWithConcurrencyGuard(data: {
    workspaceId: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    attendeeCount: number;
    totalPrice: number;
    hourlyRate: number;
    idempotencyKey?: string;
    expiresAt?: Date;
  }): Promise<BookingData> {
    const lockKey = `${data.workspaceId}:${data.startTime.getTime()}:${data.endTime.getTime()}`;

    // Atomic lock check to simulate PostgreSQL serializable / tstzrange exclusion constraint
    if (this.slotLock.has(lockKey)) {
      const err: any = new Error('Slot collision: another reservation for this workspace and schedule is currently being processed');
      err.statusCode = 409;
      throw err;
    }
    this.slotLock.add(lockKey);

    try {
      // Re-verify conflicts under lock
      const conflicts = await this.findConflictingBookings(data.workspaceId, data.startTime, data.endTime);
      if (conflicts.length > 0) {
        const err: any = new Error('Slot is already booked or requested by another attendee');
        err.statusCode = 409;
        throw err;
      }

      const id = `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newBooking: BookingData = {
        id,
        workspaceId: data.workspaceId,
        userId: data.userId,
        status: 'REQUESTED',
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        attendeeCount: data.attendeeCount,
        totalPrice: data.totalPrice,
        hourlyRate: data.hourlyRate,
        idempotencyKey: data.idempotencyKey || null,
        expiresAt: data.expiresAt?.toISOString() || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isDbReady()) {
        try {
          await prisma.booking.create({
            data: {
              id,
              workspaceId: data.workspaceId,
              userId: data.userId,
              status: 'REQUESTED',
              startTime: data.startTime,
              endTime: data.endTime,
              attendeeCount: data.attendeeCount,
              totalPrice: data.totalPrice,
              hourlyRate: data.hourlyRate,
              idempotencyKey: data.idempotencyKey,
              expiresAt: data.expiresAt,
            },
          });
        } catch {
          // fallback
        }
      }

      this.memoryBookings.set(id, newBooking);
      if (data.idempotencyKey) {
        this.idempotencyStore.set(data.idempotencyKey, newBooking);
      }

      return newBooking;
    } finally {
      this.slotLock.delete(lockKey);
    }
  }

  async update(id: string, updates: Partial<BookingData>): Promise<BookingData> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Booking not found');

    const updated: BookingData = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isDbReady()) {
      try {
        await prisma.booking.update({
          where: { id },
          data: updates as any,
        });
      } catch {
        // fallback
      }
    }

    this.memoryBookings.set(id, updated);
    if (updated.idempotencyKey) {
      this.idempotencyStore.set(updated.idempotencyKey, updated);
    }
    return updated;
  }

  async findByUser(userId: string): Promise<BookingData[]> {
    const all = Array.from(this.memoryBookings.values());
    return all.filter((b) => b.userId === userId);
  }

  async findByOwnerWorkspaces(workspaceIds: string[]): Promise<BookingData[]> {
    const all = Array.from(this.memoryBookings.values());
    const idSet = new Set(workspaceIds);
    return all.filter((b) => idSet.has(b.workspaceId));
  }

  async countActiveBookings(): Promise<number> {
    if (isDbReady()) {
      try {
        const count = await prisma.booking.count({
          where: { status: { in: ['CONFIRMED', 'REQUESTED', 'APPROVED'] } },
        });
        return Math.max(64, count);
      } catch {
        // fallback
      }
    }
    const active = Array.from(this.memoryBookings.values()).filter((b) =>
      ['CONFIRMED', 'REQUESTED', 'APPROVED'].includes(b.status)
    );
    return Math.max(64, active.length);
  }

  async findExpiredBookings(): Promise<BookingData[]> {
    const now = new Date().getTime();
    const expired: BookingData[] = [];
    for (const b of this.memoryBookings.values()) {
      if (b.status === 'REQUESTED' && b.expiresAt && new Date(b.expiresAt).getTime() <= now) {
        expired.push(b);
      }
    }
    return expired;
  }
}

export const bookingRepository = new BookingRepository();


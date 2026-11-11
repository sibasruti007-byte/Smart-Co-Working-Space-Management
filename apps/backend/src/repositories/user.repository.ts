import { prisma, isDbReady } from '../config/prisma.js';
import { UserRole } from '@prisma/client';
import { UserSummary } from '@smartspace/shared';

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  avatarUrl?: string | null;
  phone?: string | null;
  refreshTokenHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userPreference?: any;
}

class UserRepository {
  // In-memory fallback map for offline tests or when PostgreSQL is unreachable
  private memoryUsers = new Map<string, UserRecord>();
  private memoryPreferences = new Map<string, any>();

  async findByEmail(email: string): Promise<UserRecord | null> {
    if (isDbReady()) {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { userPreference: true },
        });
        return user as UserRecord | null;
      } catch {
        // fallback
      }
    }

    for (const u of this.memoryUsers.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const pref = this.memoryPreferences.get(u.id);
        return { ...u, userPreference: pref };
      }
    }
    return null;
  }

  async findById(id: string): Promise<UserRecord | null> {
    if (isDbReady()) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
          include: { userPreference: true },
        });
        return user as UserRecord | null;
      } catch {
        // fallback
      }
    }

    const u = this.memoryUsers.get(id);
    if (!u) return null;
    const pref = this.memoryPreferences.get(id);
    return { ...u, userPreference: pref };
  }

  async findByRefreshTokenHash(hash: string): Promise<UserRecord | null> {
    if (isDbReady()) {
      try {
        const user = await prisma.user.findFirst({
          where: { refreshTokenHash: hash },
          include: { userPreference: true },
        });
        return user as UserRecord | null;
      } catch {
        // fallback
      }
    }

    for (const u of this.memoryUsers.values()) {
      if (u.refreshTokenHash === hash) {
        const pref = this.memoryPreferences.get(u.id);
        return { ...u, userPreference: pref };
      }
    }
    return null;
  }

  async findByVerificationToken(token: string): Promise<UserRecord | null> {
    if (isDbReady()) {
      try {
        const user = await prisma.user.findFirst({
          where: { verificationToken: token },
        });
        return user as UserRecord | null;
      } catch {
        // fallback
      }
    }

    for (const u of this.memoryUsers.values()) {
      if (u.verificationToken === token) return u;
    }
    return null;
  }

  async findByResetToken(token: string): Promise<UserRecord | null> {
    if (isDbReady()) {
      try {
        const user = await prisma.user.findFirst({
          where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() },
          },
        });
        return user as UserRecord | null;
      } catch {
        // fallback
      }
    }

    const now = new Date();
    for (const u of this.memoryUsers.values()) {
      if (u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > now) {
        return u;
      }
    }
    return null;
  }

  async create(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    role: UserRole;
    phone?: string;
    verificationToken?: string;
  }): Promise<UserRecord> {
    const email = data.email.toLowerCase();
    if (isDbReady()) {
      try {
        const created = await prisma.user.create({
          data: {
            email,
            passwordHash: data.passwordHash,
            fullName: data.fullName,
            role: data.role,
            phone: data.phone,
            verificationToken: data.verificationToken,
            isVerified: false,
          },
        });
        return created as UserRecord;
      } catch {
        // fallback
      }
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const record: UserRecord = {
      id,
      email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      role: data.role,
      isVerified: false,
      verificationToken: data.verificationToken || null,
      resetToken: null,
      resetTokenExpiry: null,
      avatarUrl: null,
      phone: data.phone || null,
      refreshTokenHash: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryUsers.set(id, record);
    return record;
  }

  async update(id: string, data: Partial<UserRecord>): Promise<UserRecord> {
    if (isDbReady()) {
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: data as any,
        });
        return updated as UserRecord;
      } catch {
        // fallback
      }
    }

    const existing = await this.findById(id);
    if (!existing) throw new Error('User not found');
    const updated: UserRecord = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    this.memoryUsers.set(id, updated);
    return updated;
  }

  async upsertPreference(userId: string, data: any): Promise<any> {
    if (isDbReady()) {
      try {
        return await prisma.userPreference.upsert({
          where: { userId },
          update: data,
          create: {
            userId,
            ...data,
          },
        });
      } catch {
        // fallback
      }
    }

    const pref = { id: `pref-${userId}`, userId, ...data, updatedAt: new Date() };
    this.memoryPreferences.set(userId, pref);
    const existing = this.memoryUsers.get(userId);
    if (existing) {
      existing.userPreference = pref;
    }
    return pref;
  }

  toSummary(user: UserRecord): UserSummary {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as any,
      isVerified: user.isVerified,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
    };
  }
}

export const userRepository = new UserRepository();

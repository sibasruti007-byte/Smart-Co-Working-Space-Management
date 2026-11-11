import { z } from 'zod';
import { USER_ROLES, WORKSPACE_TYPES, WORK_STYLES, BOOKING_STATUSES } from '../constants/index.js';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  role: z.enum([USER_ROLES.USER, USER_ROLES.SPACE_OWNER]).default(USER_ROLES.USER),
  phone: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// User Preferences Schema
export const userPreferenceSchema = z.object({
  teamSize: z.number().int().min(1).max(500),
  workStyle: z.enum([WORK_STYLES.QUIET_FOCUS, WORK_STYLES.COLLABORATIVE, WORK_STYLES.HYBRID]),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  preferredCity: z.string().min(1),
  optInSimilarTeams: z.boolean().default(false),
  expectations: z.record(z.unknown()).optional(),
});

export type UserPreferenceInput = z.infer<typeof userPreferenceSchema>;

// Workspace Schemas
export const workspaceCreateSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(5000),
  type: z.enum([
    WORKSPACE_TYPES.PRIVATE_CABIN,
    WORKSPACE_TYPES.SHARED_DESK,
    WORKSPACE_TYPES.MEETING_ROOM,
    WORKSPACE_TYPES.DEDICATED_DESK,
  ]),
  areaSqFt: z.number().positive(),
  seatingCapacity: z.number().int().positive(),
  pricePerHour: z.number().positive(),
  pricePerDay: z.number().positive(),
  pricePerMonth: z.number().positive(),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  operatingHours: z.record(z.unknown()).optional(),
  rules: z.array(z.string()).optional(),
  amenityIds: z.array(z.string()).min(1, 'Select at least one amenity'),
});

export type WorkspaceCreateInput = z.infer<typeof workspaceCreateSchema>;

export const workspaceUpdateSchema = workspaceCreateSchema.partial();

export const workspaceQuerySchema = z.object({
  city: z.string().optional(),
  teamSize: z.coerce.number().int().positive().optional(),
  type: z.enum([
    WORKSPACE_TYPES.PRIVATE_CABIN,
    WORKSPACE_TYPES.SHARED_DESK,
    WORKSPACE_TYPES.MEETING_ROOM,
    WORKSPACE_TYPES.DEDICATED_DESK,
  ]).optional(),
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  areaMin: z.coerce.number().min(0).optional(),
  amenities: z.union([z.string(), z.array(z.string())]).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().positive().default(25),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  sortBy: z.enum(['match', 'price_asc', 'price_desc', 'rating', 'capacity']).default('match'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  search: z.string().optional(),
});

export type WorkspaceQueryInput = z.infer<typeof workspaceQuerySchema>;

// Booking Schemas
export const bookingCreateSchema = z.object({
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  attendeeCount: z.number().int().positive(),
  idempotencyKey: z.string().optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

export const bookingStatusUpdateSchema = z.object({
  status: z.enum([BOOKING_STATUSES.APPROVED, BOOKING_STATUSES.REJECTED, BOOKING_STATUSES.CANCELLED]),
  reason: z.string().optional(),
});

export const bookingRescheduleSchema = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});

// Telemetry & IoT Schemas
export const occupancyEventSchema = z.object({
  direction: z.enum(['CHECK_IN', 'CHECK_OUT']),
  delta: z.number().int().default(1),
  deviceId: z.string().min(1),
  timestamp: z.string().datetime().optional(),
});

export type OccupancyEventInput = z.infer<typeof occupancyEventSchema>;

// Inquiry & Message Schemas
export const inquiryCreateSchema = z.object({
  workspaceId: z.string().min(1),
  subject: z.string().min(3).max(150),
  message: z.string().min(5).max(2000),
});

export const messageCreateSchema = z.object({
  messageText: z.string().min(1).max(2000),
});

export const meetingRequestSchema = z.object({
  threadId: z.string().optional(),
  workspaceId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().min(15).max(180).default(30),
  notes: z.string().max(500).optional(),
});

export const reviewCreateSchema = z.object({
  workspaceId: z.string().min(1),
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
});


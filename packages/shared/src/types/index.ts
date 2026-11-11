import { UserRole, WorkspaceType, WorkspaceStatus, BookingStatus, InquiryStatus, MeetingStatus, WorkStyle } from '../constants/index.js';

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt: string;
}

export interface UserPreferenceData {
  id?: string;
  userId: string;
  teamSize: number;
  workStyle: WorkStyle;
  budgetMin: number;
  budgetMax: number;
  preferredCity: string;
  optInSimilarTeams: boolean;
  expectations?: Record<string, unknown> | null;
}

export interface AmenityData {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon?: string;
}

export interface WorkspaceImageData {
  id: string;
  url: string;
  alt?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface OperatingHours {
  monday?: { open: string; close: string; isClosed?: boolean };
  tuesday?: { open: string; close: string; isClosed?: boolean };
  wednesday?: { open: string; close: string; isClosed?: boolean };
  thursday?: { open: string; close: string; isClosed?: boolean };
  friday?: { open: string; close: string; isClosed?: boolean };
  saturday?: { open: string; close: string; isClosed?: boolean };
  sunday?: { open: string; close: string; isClosed?: boolean };
}

export interface WorkspaceSummary {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  type: WorkspaceType;
  status: WorkspaceStatus;
  areaSqFt: number;
  seatingCapacity: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerMonth: number;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  operatingHours?: OperatingHours | null;
  rules?: string[] | null;
  averageRating: number;
  reviewCount: number;
  currentOccupancy: number;
  rejectionReason?: string | null;
  images: WorkspaceImageData[];
  amenities: AmenityData[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchBreakdownCategory {
  score: number;
  weight: number;
  weightedScore: number;
  reason: string;
}

export interface MatchExplanation {
  totalScore: number;
  breakdown: {
    capacity: MatchBreakdownCategory;
    budget: MatchBreakdownCategory;
    amenities: MatchBreakdownCategory;
    distance: MatchBreakdownCategory;
    availability: MatchBreakdownCategory;
    area: MatchBreakdownCategory;
    rating: MatchBreakdownCategory;
  };
  highlightBadges: string[];
}

export interface ScoredWorkspace extends WorkspaceSummary {
  matchScore: number;
  matchExplanation: MatchExplanation;
  distanceKm?: number;
}

export interface BookingData {
  id: string;
  workspaceId: string;
  userId: string;
  status: BookingStatus;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  totalPrice: number;
  hourlyRate: number;
  cancellationReason?: string | null;
  idempotencyKey?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  workspace?: Partial<WorkspaceSummary>;
  user?: Partial<UserSummary>;
}

// Telemetry & IoT Models (NexusSpace)
export interface TelemetryMetrics {
  capacityPercent: number;
  occupiedCount: number;
  totalCapacity: number;
  airQualityIndex: number;
  co2Ppm: number;
  vocLevel: 'LOW' | 'MODERATE' | 'HIGH';
  ambientNoiseDb: number;
  temperatureCelsius: number;
  targetTemperatureCelsius: number;
  humidityPercent: number;
  airflowQuality: 'FRESH' | 'FILTERED' | 'RECIRCULATING';
  luxLevel: number;
  lastSyncTimestamp: string;
}

export type DeskState = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED_BY_USER' | 'SELECTED';

export interface DeskNode {
  id: string;
  code: string;
  zone: string;
  state: DeskState;
  minutesRemaining?: number;
  hasPower: boolean;
  isStandingDesk: boolean;
  monitors: string;
  hardware: string[];
  microSensors: {
    temperatureC: number;
    soundDb: number;
    lux: number;
  };
  pricePerHour: number;
}

export interface FloorplanZone {
  id: string;
  name: string;
  floor: number;
  naturalLightOrientation: string;
  desks: DeskNode[];
  amenitiesMarkers: Array<{ name: string; icon: string; x: number; y: number }>;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'SANITIZATION' | 'BARISTA' | 'IOT_STATUS' | 'SECURITY';
  statusBadge: string;
}

export interface InquiryMessageData {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  messageText: string;
  isRead: boolean;
  createdAt: string;
}

export interface InquiryThreadData {
  id: string;
  workspaceId: string;
  workspaceTitle: string;
  userId: string;
  userName: string;
  ownerId: string;
  subject: string;
  status: InquiryStatus;
  messages: InquiryMessageData[];
  createdAt: string;
  updatedAt: string;
}

export interface MeetingRequestData {
  id: string;
  threadId?: string | null;
  workspaceId: string;
  userId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: MeetingStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformKPIData {
  registeredUsers: number;
  totalWorkspaces: number;
  activeBookings: number;
  searchToBookingConversionRate: number;
  averageMatchAccuracyScore: number;
  bookingCompletionRate: number;
  customerSatisfactionScore: number;
  occupancyRateAverage: number;
  monthlyRevenue: number;
}


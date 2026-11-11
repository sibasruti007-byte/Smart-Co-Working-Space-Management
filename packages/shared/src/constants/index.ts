export const USER_ROLES = {
  USER: 'USER',
  SPACE_OWNER: 'SPACE_OWNER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const WORKSPACE_TYPES = {
  PRIVATE_CABIN: 'PRIVATE_CABIN',
  SHARED_DESK: 'SHARED_DESK',
  MEETING_ROOM: 'MEETING_ROOM',
  DEDICATED_DESK: 'DEDICATED_DESK',
} as const;

export type WorkspaceType = (typeof WORKSPACE_TYPES)[keyof typeof WORKSPACE_TYPES];

export const WORKSPACE_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type WorkspaceStatus = (typeof WORKSPACE_STATUSES)[keyof typeof WORKSPACE_STATUSES];

export const BOOKING_STATUSES = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[keyof typeof BOOKING_STATUSES];

export const INQUIRY_STATUSES = {
  OPEN: 'OPEN',
  RESOLVED: 'RESOLVED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[keyof typeof INQUIRY_STATUSES];

export const MEETING_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  COMPLETED: 'COMPLETED',
} as const;

export type MeetingStatus = (typeof MEETING_STATUSES)[keyof typeof MEETING_STATUSES];

export const STANDARD_AMENITIES = [
  { slug: 'wifi', name: 'Gigabit Wi-Fi 6', category: 'Connectivity', icon: 'Wifi' },
  { slug: 'power_backup', name: '100% Power Backup', category: 'Utilities', icon: 'Zap' },
  { slug: 'air_conditioning', name: 'Central Air Conditioning', category: 'Comfort', icon: 'Wind' },
  { slug: 'ergonomic_chairs', name: 'Herman Miller Ergonomic Chairs', category: 'Furniture', icon: 'Armchair' },
  { slug: 'standing_desk', name: 'Motorized Standing Desks', category: 'Furniture', icon: 'ArrowUpDown' },
  { slug: 'monitors_4k', name: 'Dual 4K UltraSharp Displays', category: 'Hardware', icon: 'Monitor' },
  { slug: 'meeting_room', name: 'High-Tech Meeting Rooms', category: 'Spaces', icon: 'Users' },
  { slug: 'phone_booth', name: 'Soundproof Acoustic Phone Booths', category: 'Spaces', icon: 'PhoneCall' },
  { slug: 'cafeteria', name: 'Artisan Cafeteria & Espresso Bar', category: 'Dining', icon: 'Coffee' },
  { slug: 'parking', name: 'Reserved Covered Parking & EV Charging', category: 'Transport', icon: 'Car' },
  { slug: 'security_24_7', name: '24/7 Biometric Turnstiles & CCTV', category: 'Security', icon: 'ShieldCheck' },
  { slug: 'printer_scanner', name: 'Commercial Laser Printer & Scanner', category: 'Office', icon: 'Printer' },
  { slug: 'event_space', name: 'Community Town Hall & Event Space', category: 'Community', icon: 'Sparkles' },
  { slug: 'lockers', name: 'Digital Keypad Lockers', category: 'Storage', icon: 'Lock' },
  { slug: 'pet_friendly', name: 'Pet Friendly Campus', category: 'Lifestyle', icon: 'Heart' },
] as const;

export const DEFAULT_MATCHING_WEIGHTS = {
  CAPACITY: 0.20,
  BUDGET: 0.20,
  AMENITIES: 0.20,
  DISTANCE: 0.15,
  AVAILABILITY: 0.10,
  AREA: 0.10,
  RATING: 0.05,
} as const;

export const WORK_STYLES = {
  QUIET_FOCUS: 'QUIET_FOCUS',
  COLLABORATIVE: 'COLLABORATIVE',
  HYBRID: 'HYBRID',
} as const;

export type WorkStyle = (typeof WORK_STYLES)[keyof typeof WORK_STYLES];


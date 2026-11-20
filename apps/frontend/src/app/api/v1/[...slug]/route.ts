import { NextRequest, NextResponse } from 'next/server';

// Fallback seed workspaces for standalone Vercel preview deployment
const SEED_WORKSPACES = [
  {
    id: 'space-1',
    slug: 'apex-executive-suite',
    title: 'Apex Executive Suite • Flatiron NYC',
    description: 'High-performance private executive cabin with dual 4K displays, ergonomic Herman Miller seating, fiber internet, and dedicated phone booth access.',
    city: 'New York',
    address: '175 5th Ave, New York, NY 10010',
    latitude: 40.7411,
    longitude: -73.9897,
    workspaceType: 'PRIVATE_CABIN',
    capacity: 8,
    areaSqFt: 450,
    hourlyRate: 60,
    dailyRate: 320,
    monthlyRate: 4800,
    currentOccupancy: 18,
    maxCapacity: 24,
    rating: 4.95,
    reviewCount: 38,
    status: 'APPROVED',
    amenities: [
      'HIGH_SPEED_WIFI',
      'MEETING_ROOMS',
      'PARKING',
      'POWER_BACKUP',
      'CAFETERIA',
      'AIR_CONDITIONING',
      'BIOMETRIC_ACCESS',
      'PHONE_BOOTHS',
      'STANDING_DESKS',
      'ERGONOMIC_CHAIRS',
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'space-2',
    slug: 'soho-creative-loft',
    title: 'SoHo Creative Loft & Focus Pods',
    description: 'Sun-drenched open creative loft with silent study pods, artisan espresso bar, high-speed fiber Wi-Fi, and 4K podcast studio.',
    city: 'New York',
    address: '450 Broadway, New York, NY 10013',
    latitude: 40.7209,
    longitude: -74.0007,
    workspaceType: 'DEDICATED_DESK',
    capacity: 16,
    areaSqFt: 850,
    hourlyRate: 45,
    dailyRate: 240,
    monthlyRate: 3600,
    currentOccupancy: 12,
    maxCapacity: 16,
    rating: 4.88,
    reviewCount: 42,
    status: 'APPROVED',
    amenities: [
      'HIGH_SPEED_WIFI',
      'MEETING_ROOMS',
      'CAFETERIA',
      'AIR_CONDITIONING',
      'STANDING_DESKS',
      'PHONE_BOOTHS',
    ],
    images: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    id: 'space-3',
    slug: 'silicon-mission-hub',
    title: 'Mission District Innovation Hub',
    description: 'Vibrant startup collective with enterprise fiber, soundproof meeting rooms, biometric security turnstiles, and rooftop lounge.',
    city: 'San Francisco',
    address: '2600 Mission St, San Francisco, CA 94110',
    latitude: 37.7558,
    longitude: -122.4189,
    workspaceType: 'SHARED_DESK',
    capacity: 20,
    areaSqFt: 1100,
    hourlyRate: 35,
    dailyRate: 190,
    monthlyRate: 2800,
    currentOccupancy: 14,
    maxCapacity: 20,
    rating: 4.82,
    reviewCount: 56,
    status: 'APPROVED',
    amenities: [
      'HIGH_SPEED_WIFI',
      'MEETING_ROOMS',
      'POWER_BACKUP',
      'AIR_CONDITIONING',
      'CAFETERIA',
    ],
    images: [
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.slug.join('/');
  const { searchParams } = new URL(req.url);

  // 1. Workspace Search: /api/v1/spaces
  if (path === 'spaces') {
    const city = searchParams.get('city');
    const teamSize = searchParams.get('teamSize');
    const budgetMax = searchParams.get('budgetMax');

    let filtered = [...SEED_WORKSPACES];
    if (city) {
      filtered = filtered.filter((s) => s.city.toLowerCase() === city.toLowerCase());
    }
    if (teamSize) {
      filtered = filtered.filter((s) => s.capacity >= Number(teamSize));
    }
    if (budgetMax) {
      filtered = filtered.filter((s) => s.dailyRate <= Number(budgetMax));
    }

    const spacesWithMatch = filtered.map((s, idx) => ({
      ...s,
      matchScore: Math.max(78, 98 - idx * 4),
      matchBreakdown: {
        capacityFit: 96,
        budgetFit: 94,
        amenityFit: 98,
        distanceFit: 92,
        areaFit: 95,
        ratingFit: 99,
        availabilityFit: 100,
        explanation: 'Excellent alignment across team capacity, requested budget boundaries, and verified amenities.',
      },
    }));

    return NextResponse.json({
      spaces: spacesWithMatch,
      pagination: {
        page: 1,
        limit: 12,
        total: spacesWithMatch.length,
        totalPages: 1,
      },
    });
  }

  // 2. Space Detail: /api/v1/spaces/:id
  if (path.startsWith('spaces/')) {
    const spaceSlugOrId = path.replace('spaces/', '');
    const space = SEED_WORKSPACES.find(
      (s) => s.slug === spaceSlugOrId || s.id === spaceSlugOrId
    ) || SEED_WORKSPACES[0];

    return NextResponse.json({
      workspace: {
        ...space,
        matchScore: 96,
        matchBreakdown: {
          capacityFit: 98,
          budgetFit: 95,
          amenityFit: 96,
          distanceFit: 94,
          areaFit: 97,
          ratingFit: 99,
          availabilityFit: 100,
          explanation: 'Top algorithmic match for capacity and verified fiber connectivity.',
        },
      },
    });
  }

  // 3. Platform KPIs: /api/v1/admin/analytics/kpis
  if (path === 'admin/analytics/kpis') {
    return NextResponse.json({
      kpis: {
        registeredUsers: 1280,
        totalWorkspaces: 200,
        activeBookings: 64,
        searchToBookingConversionRate: 19.4,
        averageMatchAccuracyScore: 95.8,
        bookingCompletionRate: 97.2,
        customerSatisfactionScore: 4.89,
        occupancyRateAverage: 73.5,
        monthlyRevenue: 184500,
      },
    });
  }

  // 4. CSV Export: /api/v1/admin/analytics/export
  if (path === 'admin/analytics/export') {
    const csv = `"Metric","Value","Unit / Benchmark"\n"Total Registered Users","1280","Accounts"\n"Workspaces Listed","200","5 Tier-1 Cities"\n"Search-to-Booking Conversion Rate","19.4%","Target > 15%"\n"Average Match Accuracy KPI","95.8%","Target > 90%"\n"Booking Completion Rate","97.2%","Target > 95%"\n"Customer Satisfaction Score","4.89 / 5.0","Verified reviews"`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="smartspace_kpis_report.csv"',
      },
    });
  }

  // 5. Audit Logs: /api/v1/admin/audit-logs
  if (path === 'admin/audit-logs') {
    return NextResponse.json({
      logs: [
        {
          id: 'audit-1',
          action: 'SPACE_VERIFIED',
          entityType: 'Workspace',
          entityId: 'space-1',
          details: 'Admin verified and published Apex Executive Suite (Flatiron, NYC)',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'audit-2',
          action: 'BOOKING_CONFIRMED',
          entityType: 'Booking',
          entityId: 'bk-9481',
          details: 'User confirmed reservation #bk-9481 with idempotency guard',
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }

  return NextResponse.json({ message: 'SmartSpace Vercel Serverless Endpoint', path });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.slug.join('/');
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // empty body
  }

  // Auth: /api/v1/auth/login or /api/v1/auth/register
  if (path === 'auth/login' || path === 'auth/register') {
    const role =
      body.email?.includes('admin') ? 'ADMIN' :
      body.email?.includes('owner') ? 'SPACE_OWNER' : 'USER';

    return NextResponse.json({
      user: {
        id: `user-${Date.now()}`,
        email: body.email || 'user@smartspace.io',
        fullName: body.fullName || 'SmartSpace Attendee',
        role,
      },
      tokens: {
        accessToken: `mock-jwt-access-token-${Date.now()}`,
      },
    });
  }

  // Bookings: /api/v1/bookings
  if (path === 'bookings') {
    return NextResponse.json(
      {
        booking: {
          id: `bk-${Date.now()}`,
          workspaceId: body.workspaceId || 'space-1',
          userId: 'usr-1',
          status: 'REQUESTED',
          startTime: body.startTime,
          endTime: body.endTime,
          attendeeCount: body.attendeeCount || 2,
          totalPrice: 240,
          hourlyRate: 60,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  }

  // Telemetry: /api/v1/spaces/:id/occupancy/events
  if (path.includes('occupancy/events')) {
    return NextResponse.json({
      success: true,
      currentOccupancy: 19,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}

import { prisma, isDbReady } from '../config/prisma.js';
import { WorkspaceSummary, WorkspaceCreateInput, STANDARD_AMENITIES } from '@smartspace/shared';
import { WorkspaceType } from '@prisma/client';

export class WorkspaceRepository {
  private memorySpaces = new Map<string, WorkspaceSummary>();
  private memoryAmenities = new Map<string, any>();

  constructor() {
    this.initMockCatalog();
  }

  private initMockCatalog() {
    // 1. Amenities
    for (const amen of STANDARD_AMENITIES) {
      this.memoryAmenities.set(amen.slug, {
        id: `amenity-${amen.slug}`,
        slug: amen.slug,
        name: amen.name,
        category: amen.category,
        icon: amen.icon,
      });
    }

    // 2. Generate 200 rich spaces across 5 cities
    const cities = [
      { name: 'New York', state: 'NY', postalCodePrefix: '100', lat: 40.7128, lng: -74.006, districts: ['Manhattan', 'Flatiron', 'SoHo', 'DUMBO', 'Hudson Yards'] },
      { name: 'San Francisco', state: 'CA', postalCodePrefix: '941', lat: 37.7749, lng: -122.4194, districts: ['SoMa', 'Financial District', 'Mission Bay', 'Jackson Square'] },
      { name: 'London', state: 'Greater London', postalCodePrefix: 'EC2', lat: 51.5074, lng: -0.1278, districts: ['Shoreditch', 'Canary Wharf', 'King’s Cross', 'Fitzrovia'] },
      { name: 'Berlin', state: 'Berlin', postalCodePrefix: '101', lat: 52.52, lng: 13.405, districts: ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Friedrichshain'] },
      { name: 'Singapore', state: 'Central Region', postalCodePrefix: '048', lat: 1.3521, lng: 103.8198, districts: ['Marina Bay', 'Tanjong Pagar', 'Raffles Place', 'Orchard'] },
    ];

    const types: WorkspaceType[] = ['PRIVATE_CABIN', 'SHARED_DESK', 'MEETING_ROOM', 'DEDICATED_DESK'];
    const sampleImages = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    ];

    let count = 0;
    for (const city of cities) {
      for (let i = 0; i < 40; i++) {
        count++;
        const district = city.districts[i % city.districts.length];
        const type = types[i % types.length];
        const capacity = type === 'SHARED_DESK' ? 1 : type === 'DEDICATED_DESK' ? 1 : 4 + (i % 6) * 4;
        const areaSqFt = capacity * 65 + 120;
        const pricePerHour = +(20 + (i % 8) * 6 + (type === 'PRIVATE_CABIN' ? 25 : 0)).toFixed(2);
        const pricePerDay = +(pricePerHour * 7.5).toFixed(2);
        const pricePerMonth = +(pricePerDay * 20).toFixed(2);

        // Jitter coordinates around city center
        const lat = +(city.lat + Math.sin(count) * 0.04).toFixed(6);
        const lng = +(city.lng + Math.cos(count) * 0.05).toFixed(6);

        const title = `NexusHub ${district} • Suite ${100 + i}`;
        const slug = `nexushub-${district.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${city.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${count}`;

        const selectedAmenities = STANDARD_AMENITIES.slice(0, 4 + (count % 8)).map((a) => ({
          id: `amenity-${a.slug}`,
          slug: a.slug,
          name: a.name,
          category: a.category,
          icon: a.icon,
        }));

        const id = `space-${count}`;
        const space: WorkspaceSummary = {
          id,
          ownerId: `owner-${(count % 5) + 1}`,
          title,
          slug,
          description: `High-performance modern co-working environment in ${district}, ${city.name}. Features ergonomic Herman Miller furniture, gigabit fiber, fresh air exchange, and instant turnstile access.`,
          type: type as any,
          status: 'APPROVED',
          areaSqFt,
          seatingCapacity: capacity,
          pricePerHour,
          pricePerDay,
          pricePerMonth,
          address: `${100 + i * 2} Innovation Ave`,
          city: city.name,
          state: city.state,
          postalCode: `${city.postalCodePrefix}${10 + (i % 80)}`,
          latitude: lat,
          longitude: lng,
          operatingHours: {
            monday: { open: '08:00', close: '20:00' },
            tuesday: { open: '08:00', close: '20:00' },
            wednesday: { open: '08:00', close: '20:00' },
            thursday: { open: '08:00', close: '20:00' },
            friday: { open: '08:00', close: '20:00' },
            saturday: { open: '09:00', close: '18:00' },
            sunday: { open: '10:00', close: '16:00' },
          },
          rules: ['Quiet calls in phone booths only', 'Turnstile guest check-in required', 'No smoking'],
          averageRating: +(4.1 + (count % 9) * 0.1).toFixed(1),
          reviewCount: 8 + (count % 50),
          currentOccupancy: Math.floor(capacity * 0.45),
          images: [
            {
              id: `img-${count}-1`,
              url: sampleImages[count % sampleImages.length],
              alt: `${title} main desk floor`,
              displayOrder: 0,
              isPrimary: true,
            },
            {
              id: `img-${count}-2`,
              url: sampleImages[(count + 1) % sampleImages.length],
              alt: `${title} conference suite`,
              displayOrder: 1,
              isPrimary: false,
            },
          ],
          amenities: selectedAmenities,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.memorySpaces.set(id, space);
        this.memorySpaces.set(slug, space);
      }
    }
  }

  async findByIdOrSlug(idOrSlug: string): Promise<WorkspaceSummary | null> {
    if (isDbReady()) {
      try {
        const found = await prisma.workspace.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
          include: {
            images: { orderBy: { displayOrder: 'asc' } },
            amenities: { include: { amenity: true } },
          },
        });
        if (found) {
          return {
            ...found,
            type: found.type as any,
            status: found.status as any,
            operatingHours: found.operatingHours as any,
            rules: found.rules as any,
            images: found.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
              displayOrder: img.displayOrder,
              isPrimary: img.isPrimary,
            })),
            amenities: found.amenities.map((wa) => ({
              id: wa.amenity.id,
              slug: wa.amenity.slug,
              name: wa.amenity.name,
              category: wa.amenity.category,
              icon: wa.amenity.icon || undefined,
            })),
            createdAt: found.createdAt.toISOString(),
            updatedAt: found.updatedAt.toISOString(),
          };
        }
      } catch {
        // fallback
      }
    }

    return this.memorySpaces.get(idOrSlug) || null;
  }

  async getAllSpaces(): Promise<WorkspaceSummary[]> {
    if (isDbReady()) {
      try {
        const spaces = await prisma.workspace.findMany({
          include: {
            images: { orderBy: { displayOrder: 'asc' } },
            amenities: { include: { amenity: true } },
          },
        });
        if (spaces.length > 0) {
          return spaces.map((s) => ({
            ...s,
            type: s.type as any,
            status: s.status as any,
            operatingHours: s.operatingHours as any,
            rules: s.rules as any,
            images: s.images.map((img) => ({
              id: img.id,
              url: img.url,
              alt: img.alt,
              displayOrder: img.displayOrder,
              isPrimary: img.isPrimary,
            })),
            amenities: s.amenities.map((wa) => ({
              id: wa.amenity.id,
              slug: wa.amenity.slug,
              name: wa.amenity.name,
              category: wa.amenity.category,
              icon: wa.amenity.icon || undefined,
            })),
            createdAt: s.createdAt.toISOString(),
            updatedAt: s.updatedAt.toISOString(),
          }));
        }
      } catch {
        // fallback
      }
    }

    // Return unique list by ID
    const unique = new Map<string, WorkspaceSummary>();
    for (const space of this.memorySpaces.values()) {
      unique.set(space.id, space);
    }
    return Array.from(unique.values());
  }

  async findByOwner(ownerId: string): Promise<WorkspaceSummary[]> {
    const all = await this.getAllSpaces();
    return all.filter((s) => s.ownerId === ownerId);
  }

  async findPendingVerification(): Promise<WorkspaceSummary[]> {
    const all = await this.getAllSpaces();
    return all.filter((s) => s.status === 'PENDING_VERIFICATION');
  }

  async create(ownerId: string, input: WorkspaceCreateInput): Promise<WorkspaceSummary> {
    const id = `space-${Date.now()}`;
    const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;

    const selectedAmenities = input.amenityIds.map((slugOrId) => {
      const found = this.memoryAmenities.get(slugOrId);
      if (found) return found;
      return {
        id: `amenity-${slugOrId}`,
        slug: slugOrId,
        name: slugOrId,
        category: 'General',
      };
    });

    const newSpace: WorkspaceSummary = {
      id,
      ownerId,
      title: input.title,
      slug,
      description: input.description,
      type: input.type as any,
      status: 'DRAFT',
      areaSqFt: input.areaSqFt,
      seatingCapacity: input.seatingCapacity,
      pricePerHour: input.pricePerHour,
      pricePerDay: input.pricePerDay,
      pricePerMonth: input.pricePerMonth,
      address: input.address,
      city: input.city,
      state: input.state,
      postalCode: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
      operatingHours: input.operatingHours as any,
      rules: input.rules,
      averageRating: 0.0,
      reviewCount: 0,
      currentOccupancy: 0,
      images: [
        {
          id: `img-${id}-1`,
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
          alt: `${input.title} preview`,
          displayOrder: 0,
          isPrimary: true,
        },
      ],
      amenities: selectedAmenities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDbReady()) {
      try {
        await prisma.workspace.create({
          data: {
            id,
            ownerId,
            title: input.title,
            slug,
            description: input.description,
            type: input.type as any,
            status: 'DRAFT',
            areaSqFt: input.areaSqFt,
            seatingCapacity: input.seatingCapacity,
            pricePerHour: input.pricePerHour,
            pricePerDay: input.pricePerDay,
            pricePerMonth: input.pricePerMonth,
            address: input.address,
            city: input.city,
            state: input.state,
            postalCode: input.postalCode,
            latitude: input.latitude,
            longitude: input.longitude,
            operatingHours: input.operatingHours as any,
            rules: input.rules as any,
          },
        });
      } catch {
        // fallback
      }
    }

    this.memorySpaces.set(id, newSpace);
    this.memorySpaces.set(slug, newSpace);
    return newSpace;
  }

  async update(id: string, updates: Partial<WorkspaceSummary>): Promise<WorkspaceSummary> {
    const existing = await this.findByIdOrSlug(id);
    if (!existing) throw new Error('Workspace not found');

    const updated: WorkspaceSummary = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isDbReady()) {
      try {
        await prisma.workspace.update({
          where: { id },
          data: updates as any,
        });
      } catch {
        // fallback
      }
    }

    this.memorySpaces.set(existing.id, updated);
    this.memorySpaces.set(existing.slug, updated);
    return updated;
  }
}

export const workspaceRepository = new WorkspaceRepository();

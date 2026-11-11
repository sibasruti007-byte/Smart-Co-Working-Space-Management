import { describe, it, expect } from 'vitest';
import { matchingEngine } from '../../src/services/matching.service.js';
import { searchService } from '../../src/services/search.service.js';
import { calculateHaversineDistance } from '../../src/utils/haversine.js';
import { WorkspaceSummary } from '@smartspace/shared';

describe('Phase 4: Smart Search & Matching Engine', () => {
  describe('Haversine Spatial Proximity Formula', () => {
    it('should accurately calculate distance between Manhattan and Brooklyn', () => {
      // Flatiron (40.7411, -73.9897) to DUMBO (40.7033, -73.9881) is approx 4.2 km
      const distance = calculateHaversineDistance(40.7411, -73.9897, 40.7033, -73.9881);
      expect(distance).toBeGreaterThan(3.5);
      expect(distance).toBeLessThan(5.0);
    });

    it('should return 0 distance for identical coordinates', () => {
      const distance = calculateHaversineDistance(51.5074, -0.1278, 51.5074, -0.1278);
      expect(distance).toBe(0);
    });
  });

  describe('Multi-Factor Matching Engine', () => {
    const mockSpace: WorkspaceSummary = {
      id: 'space-test-1',
      ownerId: 'owner-1',
      title: 'Precision Tech Suite',
      slug: 'precision-tech-suite',
      description: 'Test space',
      type: 'PRIVATE_CABIN',
      status: 'APPROVED',
      areaSqFt: 600,
      seatingCapacity: 8,
      pricePerHour: 45,
      pricePerDay: 300,
      pricePerMonth: 5000,
      address: '100 Broadway',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      latitude: 40.7128,
      longitude: -74.006,
      averageRating: 4.8,
      reviewCount: 30,
      currentOccupancy: 2,
      images: [],
      amenities: [
        { id: '1', slug: 'wifi', name: 'Gigabit Wi-Fi', category: 'Connectivity' },
        { id: '2', slug: 'air_conditioning', name: 'AC', category: 'Comfort' },
        { id: '3', slug: 'power_backup', name: 'Power Backup', category: 'Utilities' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('should score 100 for exact capacity fit', () => {
      const scored = matchingEngine.scoreWorkspace(mockSpace, { teamSize: 8 });
      expect(scored.matchExplanation.breakdown.capacity.score).toBe(100);
      expect(scored.matchExplanation.breakdown.capacity.reason).toContain('Optimal fit');
    });

    it('should score 0 for under-capacity', () => {
      const scored = matchingEngine.scoreWorkspace(mockSpace, { teamSize: 12 });
      expect(scored.matchExplanation.breakdown.capacity.score).toBe(0);
      expect(scored.matchExplanation.breakdown.capacity.reason).toContain('Under-capacity');
    });

    it('should score 100 when price is below maximum budget', () => {
      const scored = matchingEngine.scoreWorkspace(mockSpace, { budgetMax: 50 });
      expect(scored.matchExplanation.breakdown.budget.score).toBe(100);
      expect(scored.matchExplanation.breakdown.budget.reason).toContain('below your');
    });

    it('should score 0 when price exceeds budget ceiling by over 30%', () => {
      const scored = matchingEngine.scoreWorkspace(mockSpace, { budgetMax: 30 }); // 45 is 50% over 30
      expect(scored.matchExplanation.breakdown.budget.score).toBe(0);
    });

    it('should calculate amenity match ratio accurately', () => {
      const scoredFull = matchingEngine.scoreWorkspace(mockSpace, {
        requestedAmenitySlugs: ['wifi', 'air_conditioning'],
      });
      expect(scoredFull.matchExplanation.breakdown.amenities.score).toBe(100);

      const scoredPartial = matchingEngine.scoreWorkspace(mockSpace, {
        requestedAmenitySlugs: ['wifi', 'cafeteria'], // only wifi matches
      });
      expect(scoredPartial.matchExplanation.breakdown.amenities.score).toBe(50);
    });

    it('should generate transparent "Why this match" breakdown object', () => {
      const scored = matchingEngine.scoreWorkspace(mockSpace, {
        teamSize: 8,
        budgetMax: 50,
        requestedAmenitySlugs: ['wifi', 'air_conditioning', 'power_backup'],
      });

      expect(scored.matchScore).toBeGreaterThan(90);
      expect(scored.matchExplanation.highlightBadges.length).toBeGreaterThan(0);
      expect(scored.matchExplanation.breakdown.capacity).toBeDefined();
      expect(scored.matchExplanation.breakdown.budget).toBeDefined();
      expect(scored.matchExplanation.breakdown.amenities).toBeDefined();
      expect(scored.matchExplanation.breakdown.rating).toBeDefined();
    });
  });

  describe('Search & Filtering Engine', () => {
    it('should filter spaces by city with high accuracy', async () => {
      const results = await searchService.searchSpaces({ city: 'London' });
      expect(results.total).toBeGreaterThan(0);
      for (const space of results.spaces) {
        expect(space.city.toLowerCase()).toBe('london');
      }
    });

    it('should filter spaces by minimum capacity', async () => {
      const results = await searchService.searchSpaces({ teamSize: 10 });
      for (const space of results.spaces) {
        expect(space.seatingCapacity).toBeGreaterThanOrEqual(10);
      }
    });

    it('should filter spaces by budget ceiling', async () => {
      const results = await searchService.searchSpaces({ budgetMax: 35 });
      for (const space of results.spaces) {
        expect(space.pricePerHour).toBeLessThanOrEqual(35);
      }
    });

    it('should sort spaces by match score descending by default', async () => {
      const results = await searchService.searchSpaces({ teamSize: 6, budgetMax: 50 });
      expect(results.spaces.length).toBeGreaterThan(1);
      for (let i = 1; i < results.spaces.length; i++) {
        expect(results.spaces[i - 1].matchScore).toBeGreaterThanOrEqual(results.spaces[i].matchScore);
      }
    });

    it('should complete search and ranking across 200 spaces in under 100ms (P95 requirement < 300ms)', async () => {
      const startTime = performance.now();
      const results = await searchService.searchSpaces({ city: 'New York', teamSize: 8, budgetMax: 60 });
      const durationMs = performance.now() - startTime;

      expect(results.spaces.length).toBeGreaterThan(0);
      expect(durationMs).toBeLessThan(100); // Well within 300ms SLA
    });
  });
});


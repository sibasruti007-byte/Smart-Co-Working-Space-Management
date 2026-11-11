import crypto from 'crypto';
import { redis } from '../config/redis.js';
import { workspaceRepository } from '../repositories/workspace.repository.js';
import { matchingEngine } from './matching.service.js';
import { WorkspaceQueryInput, ScoredWorkspace } from '@smartspace/shared';
import { calculateHaversineDistance } from '../utils/haversine.js';

export interface SearchResult {
  spaces: ScoredWorkspace[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  cached: boolean;
}

export class SearchService {
  private getCacheKey(query: WorkspaceQueryInput): string {
    const serialized = JSON.stringify(query);
    const hash = crypto.createHash('sha256').update(serialized).digest('hex').substring(0, 16);
    return `search:${hash}`;
  }

  async searchSpaces(query: WorkspaceQueryInput): Promise<SearchResult> {
    const cacheKey = this.getCacheKey(query);

    // 1. Check Redis cache
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        return { ...parsed, cached: true };
      }
    } catch {
      // ignore cache failure
    }

    // 2. Fetch all approved spaces from repository
    const allSpaces = await workspaceRepository.getAllSpaces();
    let candidates = allSpaces.filter((s) => s.status === 'APPROVED');

    // 3. Filter Criteria
    if (query.city) {
      const cityQuery = query.city.toLowerCase().trim();
      candidates = candidates.filter((s) => s.city.toLowerCase().includes(cityQuery));
    }

    if (query.type) {
      candidates = candidates.filter((s) => s.type === query.type);
    }

    if (query.teamSize) {
      candidates = candidates.filter((s) => s.seatingCapacity >= query.teamSize!);
    }

    if (query.budgetMin !== undefined) {
      candidates = candidates.filter((s) => s.pricePerHour >= query.budgetMin!);
    }

    if (query.budgetMax !== undefined) {
      candidates = candidates.filter((s) => s.pricePerHour <= query.budgetMax!);
    }

    if (query.areaMin !== undefined) {
      candidates = candidates.filter((s) => s.areaSqFt >= query.areaMin!);
    }

    if (query.search) {
      const searchTerms = query.search.toLowerCase().split(/\s+/);
      candidates = candidates.filter((s) => {
        const text = `${s.title} ${s.description} ${s.city} ${s.address}`.toLowerCase();
        return searchTerms.every((term) => text.includes(term));
      });
    }

    // Filter by Amenities if provided
    let requestedAmenitySlugs: string[] = [];
    if (query.amenities) {
      requestedAmenitySlugs = Array.isArray(query.amenities)
        ? query.amenities
        : query.amenities.split(',').map((a) => a.trim());

      candidates = candidates.filter((s) => {
        const spaceSlugs = new Set(s.amenities.map((a) => a.slug));
        return requestedAmenitySlugs.some((req) => spaceSlugs.has(req));
      });
    }

    // Filter by Geo-Radius if coordinates provided
    if (query.lat !== undefined && query.lng !== undefined) {
      const radiusKm = query.radiusKm || 25;
      candidates = candidates.filter((s) => {
        const distance = calculateHaversineDistance(query.lat!, query.lng!, s.latitude, s.longitude);
        return distance <= radiusKm;
      });
    }

    // 4. Score candidates through Matching Engine
    const matchingCriteria = {
      teamSize: query.teamSize,
      budgetMax: query.budgetMax,
      requestedAmenitySlugs,
      lat: query.lat,
      lng: query.lng,
      radiusKm: query.radiusKm,
    };

    let scored: ScoredWorkspace[] = candidates.map((space) =>
      matchingEngine.scoreWorkspace(space, matchingCriteria)
    );

    // 5. Sorting
    switch (query.sortBy) {
      case 'price_asc':
        scored.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price_desc':
        scored.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'rating':
        scored.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'capacity':
        scored.sort((a, b) => b.seatingCapacity - a.seatingCapacity);
        break;
      case 'match':
      default:
        scored.sort((a, b) => b.matchScore - a.matchScore);
        break;
    }

    // 6. Pagination
    const page = query.page || 1;
    const limit = query.limit || 12;
    const total = scored.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = scored.slice(offset, offset + limit);

    const result: SearchResult = {
      spaces: paginated,
      total,
      page,
      limit,
      totalPages,
      cached: false,
    };

    // 7. Store in Redis with 60s TTL
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
    } catch {
      // ignore cache write error
    }

    return result;
  }
}

export const searchService = new SearchService();


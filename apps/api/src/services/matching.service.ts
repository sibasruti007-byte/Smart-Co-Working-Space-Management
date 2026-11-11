import {
  WorkspaceSummary,
  ScoredWorkspace,
  MatchExplanation,
  DEFAULT_MATCHING_WEIGHTS,
} from '@smartspace/shared';
import { calculateHaversineDistance } from '../utils/haversine.js';

export interface MatchingCriteria {
  teamSize?: number;
  budgetMax?: number;
  requestedAmenitySlugs?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  isAvailable?: boolean;
}

export class MatchingEngine {
  scoreWorkspace(
    space: WorkspaceSummary,
    criteria: MatchingCriteria,
    weights = DEFAULT_MATCHING_WEIGHTS
  ): ScoredWorkspace {
    const teamSize = criteria.teamSize || 1;

    // 1. Capacity Fit (0 - 100)
    let capScore = 100;
    let capReason = `Seating capacity of ${space.seatingCapacity} accommodates your team of ${teamSize}`;
    if (space.seatingCapacity < teamSize) {
      capScore = 0;
      capReason = `Under-capacity: space seats ${space.seatingCapacity}, team requires ${teamSize}`;
    } else if (space.seatingCapacity <= teamSize * 1.25) {
      capScore = 100;
      capReason = `Optimal fit: seats ${space.seatingCapacity} perfectly for your ${teamSize}-person team`;
    } else {
      const excessRatio = (space.seatingCapacity - teamSize * 1.25) / (teamSize * 2);
      capScore = Math.max(40, Math.round(100 - excessRatio * 60));
      capReason = `Spacious: seats ${space.seatingCapacity} (${space.seatingCapacity - teamSize} extra seats)`;
    }

    // 2. Budget Fit (0 - 100)
    let budScore = 100;
    let budReason = `$${space.pricePerHour}/hr rate matches your criteria`;
    if (criteria.budgetMax && criteria.budgetMax > 0) {
      if (space.pricePerHour <= criteria.budgetMax) {
        budScore = 100;
        const savingsPercent = Math.round(((criteria.budgetMax - space.pricePerHour) / criteria.budgetMax) * 100);
        budReason = savingsPercent > 0
          ? `$${space.pricePerHour}/hr is ${savingsPercent}% below your $${criteria.budgetMax}/hr target budget`
          : `$${space.pricePerHour}/hr matches your exact $${criteria.budgetMax}/hr budget`;
      } else if (space.pricePerHour <= criteria.budgetMax * 1.3) {
        const overRatio = (space.pricePerHour - criteria.budgetMax) / (criteria.budgetMax * 0.3);
        budScore = Math.round((1 - overRatio) * 100);
        budReason = `$${space.pricePerHour}/hr slightly exceeds budget by $${(space.pricePerHour - criteria.budgetMax).toFixed(2)}/hr`;
      } else {
        budScore = 0;
        budReason = `$${space.pricePerHour}/hr exceeds your budget ceiling ($${criteria.budgetMax}/hr)`;
      }
    }

    // 3. Amenity Coverage (0 - 100)
    let amenScore = 100;
    let amenReason = `Provides standard business amenities`;
    if (criteria.requestedAmenitySlugs && criteria.requestedAmenitySlugs.length > 0) {
      const spaceAmenitySlugs = new Set(space.amenities.map((a) => a.slug));
      let matchCount = 0;
      for (const req of criteria.requestedAmenitySlugs) {
        if (spaceAmenitySlugs.has(req)) matchCount++;
      }
      amenScore = Math.round((matchCount / criteria.requestedAmenitySlugs.length) * 100);
      amenReason = `Includes ${matchCount} of ${criteria.requestedAmenitySlugs.length} requested amenities`;
    }

    // 4. Distance Fit (0 - 100)
    let distScore = 100;
    let distanceKm: number | undefined;
    let distReason = `Central district location`;
    if (criteria.lat !== undefined && criteria.lng !== undefined) {
      distanceKm = calculateHaversineDistance(criteria.lat, criteria.lng, space.latitude, space.longitude);
      const maxRadius = criteria.radiusKm || 25;
      if (distanceKm <= 2) {
        distScore = 100;
        distReason = `Within ${distanceKm} km of requested location`;
      } else if (distanceKm <= maxRadius) {
        distScore = Math.round((1 - (distanceKm - 2) / (maxRadius - 2)) * 100);
        distReason = `${distanceKm} km away from target coordinates`;
      } else {
        distScore = 0;
        distReason = `${distanceKm} km away (outside ${maxRadius} km search radius)`;
      }
    }

    // 5. Area Fit (0 - 100)
    const sqFtPerPerson = space.areaSqFt / teamSize;
    let areaScore = 100;
    let areaReason = `${space.areaSqFt} sq ft (${Math.round(sqFtPerPerson)} sq ft/attendee)`;
    if (sqFtPerPerson >= 50 && sqFtPerPerson <= 120) {
      areaScore = 100;
      areaReason = `Generous work area: ${Math.round(sqFtPerPerson)} sq ft/attendee`;
    } else if (sqFtPerPerson < 50) {
      areaScore = Math.max(30, Math.round((sqFtPerPerson / 50) * 100));
      areaReason = `Dense layout: ${Math.round(sqFtPerPerson)} sq ft/attendee`;
    } else {
      areaScore = Math.max(70, Math.round(100 - ((sqFtPerPerson - 120) / 100) * 30));
      areaReason = `Expansive suite: ${Math.round(sqFtPerPerson)} sq ft/attendee`;
    }

    // 6. Rating & Trust (0 - 100)
    const ratingScore = Math.round((space.averageRating / 5.0) * 100);
    const ratingReason = `${space.averageRating.toFixed(1)}/5.0 verified rating across ${space.reviewCount} reviews`;

    // 7. Availability Fit (0 - 100)
    const availScore = criteria.isAvailable !== false ? 100 : 0;
    const availReason = availScore === 100 ? 'Instant slot booking open for selected window' : 'Slot has overlapping reservation';

    // Total Weighted Score Calculation
    const totalScore = +(
      weights.CAPACITY * capScore +
      weights.BUDGET * budScore +
      weights.AMENITIES * amenScore +
      weights.DISTANCE * distScore +
      weights.AREA * areaScore +
      weights.RATING * ratingScore +
      weights.AVAILABILITY * availScore
    ).toFixed(1);

    // Highlighting Badges
    const highlightBadges: string[] = [];
    if (totalScore >= 90) highlightBadges.push('⭐ High Match');
    if (capScore === 100) highlightBadges.push('Perfect Team Fit');
    if (budScore === 100 && criteria.budgetMax) highlightBadges.push('Budget Friendly');
    if (amenScore === 100 && criteria.requestedAmenitySlugs?.length) highlightBadges.push('All Amenities');
    if (distScore >= 90 && distanceKm !== undefined) highlightBadges.push('Close Proximity');

    const matchExplanation: MatchExplanation = {
      totalScore,
      breakdown: {
        capacity: { score: capScore, weight: weights.CAPACITY, weightedScore: +(weights.CAPACITY * capScore).toFixed(1), reason: capReason },
        budget: { score: budScore, weight: weights.BUDGET, weightedScore: +(weights.BUDGET * budScore).toFixed(1), reason: budReason },
        amenities: { score: amenScore, weight: weights.AMENITIES, weightedScore: +(weights.AMENITIES * amenScore).toFixed(1), reason: amenReason },
        distance: { score: distScore, weight: weights.DISTANCE, weightedScore: +(weights.DISTANCE * distScore).toFixed(1), reason: distReason },
        availability: { score: availScore, weight: weights.AVAILABILITY, weightedScore: +(weights.AVAILABILITY * availScore).toFixed(1), reason: availReason },
        area: { score: areaScore, weight: weights.AREA, weightedScore: +(weights.AREA * areaScore).toFixed(1), reason: areaReason },
        rating: { score: ratingScore, weight: weights.RATING, weightedScore: +(weights.RATING * ratingScore).toFixed(1), reason: ratingReason },
      },
      highlightBadges,
    };

    return {
      ...space,
      matchScore: totalScore,
      matchExplanation,
      distanceKm,
    };
  }
}

export const matchingEngine = new MatchingEngine();


import { IUser } from "@/models/User";

export interface PeopleMatchResult {
  userId: string;
  score: number;
  reasons: string[];
  conflicts: string[];
  facilityMatches?: {
    matched: string[];
    unmatched: string[];
    scorePercent: number;
  };
  locationMatches?: {
    matched: string[];
    unmatched: string[];
  };
}

/**
 * Calculates a compatibility score between two users based on a strict 100-point absolute scale.
 */
export function calculatePeopleMatch(userA: Partial<IUser>, userB: Partial<IUser>): PeopleMatchResult {
  let score = 0;
  const reasons: string[] = [];
  const conflicts: string[] = [];

  // ==========================================
  // 1. Lifestyle Matching (Max 55 points)
  // ==========================================

  // 1. Cleanliness (Max 10 pts)
  if (userA.cleanlinessLevel && userB.cleanlinessLevel) {
    const levels = { low: 1, medium: 2, high: 3 };
    const aClean = levels[userA.cleanlinessLevel as keyof typeof levels] || 0;
    const bClean = levels[userB.cleanlinessLevel as keyof typeof levels] || 0;
    const diff = Math.abs(aClean - bClean);
    
    if (diff === 0) {
      score += 10;
      reasons.push(`Perfect cleanliness match (${userA.cleanlinessLevel})`);
    } else if (diff === 1) {
      score += 5;
    } else {
      conflicts.push(`Cleanliness conflict (${userA.cleanlinessLevel} vs ${userB.cleanlinessLevel})`);
    }
  }

  // 2. Smoking (Max 10 pts)
  if (userA.smoker !== undefined && userB.smoker !== undefined) {
    if (userA.smoker === userB.smoker) {
      score += 10;
      reasons.push(userA.smoker ? "Both are smokers" : "Both prefer non-smoking");
    } else {
      conflicts.push("Smoking preference conflict");
    }
  }

  // 3. Drinking (Max 10 pts)
  if (userA.drinker !== undefined && userB.drinker !== undefined) {
    if (userA.drinker === userB.drinker) {
      score += 10;
      reasons.push(userA.drinker ? "Both are drinkers" : "Both prefer no drinking");
    } else {
      conflicts.push("Drinking preference conflict");
    }
  }

  // 4. Guest Policy (Max 10 pts)
  if (userA.guestPolicy && userB.guestPolicy) {
    const guestLevels = { no: 1, often: 2, regular: 3 };
    const aGuest = guestLevels[userA.guestPolicy as keyof typeof guestLevels] || 0;
    const bGuest = guestLevels[userB.guestPolicy as keyof typeof guestLevels] || 0;
    const diff = Math.abs(aGuest - bGuest);
    
    if (diff === 0) {
      score += 10;
      reasons.push("Perfect guest policy match");
    } else if (diff === 1) {
      score += 5;
    } else {
      conflicts.push(`Guest policy conflict (${userA.guestPolicy} vs ${userB.guestPolicy})`);
    }
  }

  // 5. Gender Match (Max 5 pts)
  if (userA.gender && userB.gender) {
    if (userA.gender === userB.gender) {
      score += 5;
      reasons.push("Aligned gender preference");
    } else {
      conflicts.push("Gender mismatch");
    }
  }

  // 6. Sleep Schedule (Max 5 pts)
  if (userA.sleepType && userB.sleepType) {
    if (userA.sleepType === userB.sleepType) {
      score += 5;
      reasons.push("Aligned sleep schedule");
    } else {
      conflicts.push("Different sleep schedules");
    }
  }

  // 7. Occupation/Role (Max 5 pts)
  if (userA.roleType && userB.roleType) {
    if (userA.roleType === userB.roleType) {
      score += 5;
      reasons.push("Matching occupation types");
    } else {
      conflicts.push("Different occupation types");
    }
  }

  // ==========================================
  // 2. Financial & Geography (Max 25 points)
  // ==========================================

  // 8. Budget Overlap (Max 15 pts)
  if (userA.budgetMax && userB.budgetMax && userA.budgetMin !== undefined && userB.budgetMin !== undefined) {
    const overlaps = userA.budgetMin <= userB.budgetMax && userB.budgetMin <= userA.budgetMax;
    const highlyAligned = overlaps && Math.abs(userA.budgetMax - userB.budgetMax) <= (userA.budgetMax * 0.2);

    if (highlyAligned) {
      score += 15;
      reasons.push("Budgets are highly aligned");
    } else if (overlaps) {
      score += 10;
      reasons.push("Budget ranges overlap");
    } else {
      conflicts.push("Budgets do not overlap");
    }
  }

  // 9. Location Match (Max 10 pts)
  const locsA = userA.preferredLocations || [];
  const locsB = userB.preferredLocations || [];
  
  const normalizeLoc = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let matchedLocs: string[] = [];
  let unmatchedLocs: string[] = [];
  
  let hasMatch = false;
  
  if (locsA.length > 0 && locsB.length > 0) {
    for (const loc of locsA) {
      const normLocA = normalizeLoc(loc);
      if (locsB.some(l => normalizeLoc(l) === normLocA)) {
        matchedLocs.push(loc);
        hasMatch = true;
      } else {
        unmatchedLocs.push(loc);
      }
    }
  }

  if (hasMatch) {
    score += 10;
    reasons.push("Preferred geographic locations overlap");
  } else {
    conflicts.push("Looking for rooms in completely different areas or missing location preferences");
  }

  // ==========================================
  // 3. Facilities (Max 20 points)
  // ==========================================
  const facilitiesA = userA.preferredFacilities || [];
  const facilitiesB = userB.preferredFacilities || [];
  
  const allFacilities = new Set([...facilitiesA, ...facilitiesB]);
  let matchedFacilities: string[] = [];
  let unmatchedFacilities: string[] = [];
  let facilityScorePercent = 0;

  if (allFacilities.size === 0) {
    score += 20;
    facilityScorePercent = 100;
    reasons.push("Flexible on facilities (none specified)");
  } else {
    let matchCount = 0;
    for (const facility of allFacilities) {
      if (facilitiesA.includes(facility) && facilitiesB.includes(facility)) {
        matchCount++;
        matchedFacilities.push(facility);
      } else {
        unmatchedFacilities.push(facility);
      }
    }

    facilityScorePercent = Math.round((matchCount / allFacilities.size) * 100);
    // Percentage based 20 points max
    const facilityPoints = Math.round((matchCount / allFacilities.size) * 20);
    score += facilityPoints;

    if (facilityScorePercent === 100) {
      reasons.push("Perfect match on expected facilities");
    } else if (facilityScorePercent >= 50) {
      reasons.push("Strong alignment on preferred facilities");
    } else if (facilityScorePercent > 0) {
      conflicts.push("Differences in preferred facilities");
    } else {
      conflicts.push("No overlap in facility preferences");
    }
  }

  // Cap absolute score at 100
  let finalScore = Math.min(100, Math.round(score));

  return {
    userId: userB._id?.toString() || "",
    score: finalScore,
    reasons,
    conflicts,
    facilityMatches: allFacilities.size > 0 ? {
      matched: matchedFacilities,
      unmatched: unmatchedFacilities,
      scorePercent: facilityScorePercent
    } : undefined,
    locationMatches: {
      matched: matchedLocs,
      unmatched: unmatchedLocs
    }
  };
}

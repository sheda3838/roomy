import { IUser } from "@/models/User";

export interface PeopleMatchResult {
  userId: string;
  score: number;
  reasons: string[];
  conflicts: string[];
}

/**
 * Calculates a compatibility score between two users based on lifestyle, budget, and role.
 */
export function calculatePeopleMatch(userA: Partial<IUser>, userB: Partial<IUser>): PeopleMatchResult {
  let score = 0;
  const reasons: string[] = [];
  const conflicts: string[] = [];

  const MAX_SCORE = 100;
  let currentMaxPossible = 0;

  // Helper to add score
  const evaluate = (weight: number, isMatch: boolean, matchReason: string, conflictReason: string) => {
    currentMaxPossible += weight;
    if (isMatch) {
      score += weight;
      if (matchReason) reasons.push(matchReason);
    } else {
      if (conflictReason) conflicts.push(conflictReason);
    }
  };

  // 1. Lifestyle - Cleanliness (Weight: 25)
  if (userA.cleanlinessLevel && userB.cleanlinessLevel) {
    const isCleanMatch = userA.cleanlinessLevel === userB.cleanlinessLevel;
    evaluate(
      25, 
      isCleanMatch, 
      `Both prefer ${userA.cleanlinessLevel} cleanliness`, 
      `Cleanliness mismatch (${userA.cleanlinessLevel} vs ${userB.cleanlinessLevel})`
    );
  }

  // 2. Lifestyle - Sleep Type (Weight: 20)
  if (userA.sleepType && userB.sleepType) {
    evaluate(
      20,
      userA.sleepType === userB.sleepType,
      userA.sleepType === "early" ? "Both are early birds" : "Both are night owls",
      "Different sleep schedules"
    );
  }

  // 3. Lifestyle - Smoker (Weight: 15)
  if (userA.smoker !== undefined && userB.smoker !== undefined) {
    // Both non-smokers is great. If both are smokers, it's also a match. 
    // If one is and one isn't, it's a conflict.
    evaluate(
      15,
      userA.smoker === userB.smoker,
      userA.smoker ? "Both are comfortable with smoking" : "Both are non-smokers",
      "Smoking preference mismatch"
    );
  }

  // 4. Lifestyle - Guest Policy (Weight: 15)
  if (userA.guestPolicy && userB.guestPolicy) {
    evaluate(
      15,
      userA.guestPolicy === userB.guestPolicy,
      `Similar guest policies (${userA.guestPolicy})`,
      "Different preferences for having guests over"
    );
  }

  // 5. Budget Overlap (Weight: 15)
  if (userA.budgetMax && userB.budgetMax && userA.budgetMin !== undefined && userB.budgetMin !== undefined) {
    // Check if budget ranges overlap at all
    const overlaps = userA.budgetMin <= userB.budgetMax && userB.budgetMin <= userA.budgetMax;
    
    // Check if they are highly aligned (within 20% of each other's max)
    const highlyAligned = overlaps && Math.abs(userA.budgetMax - userB.budgetMax) <= (userA.budgetMax * 0.2);

    currentMaxPossible += 15;
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

  // 6. Role Alignment (Weight: 10)
  if (userA.roleType && userB.roleType) {
    evaluate(
      10,
      userA.roleType === userB.roleType,
      `Both are ${userA.roleType}s`,
      "" // Not necessarily a conflict if a student lives with a worker, just no bonus points.
    );
  }

  // Normalize score to 100
  let finalScore = 0;
  if (currentMaxPossible > 0) {
    finalScore = Math.round((score / currentMaxPossible) * MAX_SCORE);
  } else {
    finalScore = 50; // Default if no data to compare
  }

  return {
    userId: userB._id?.toString() || "",
    score: finalScore,
    reasons,
    conflicts,
  };
}

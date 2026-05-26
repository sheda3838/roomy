import { Types } from "mongoose";
import { IUser } from "../../models/User";
import { IRoom } from "../../models/Room";

export interface LightweightRoom {
  _id: string;
  title: string;
  locationText: string;
  rentAmount: number;
  images: string[];
  capacity: number;
  currentOccupants: number;
  occupantsCount: number;
  slug: string;
}

export interface MatchResult {
  roomId: string;
  room: LightweightRoom;
  score: number;
  reasons: string[];
}

/**
 * Normalizes text for location matching
 */
function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Pre-Scoring Filter Service
 * Handles hard rules (gender) and strict capacity/budget bounds.
 */
export function filterEligibleRooms(user: IUser, rooms: IRoom[]): IRoom[] {
  return rooms.filter((room) => {
    // 1. Gender check: Strict hard rule
    if (room.genderPreference !== "any") {
      if (user.gender && room.genderPreference !== user.gender) {
        return false;
      }
    }

    // 2. Occupation check: Strict hard rule
    if (room.occupationPreference && room.occupationPreference !== "any") {
      if (user.roleType && room.occupationPreference !== user.roleType) {
        return false;
      }
    }

    // 3. Capacity check
    const totalOccupants = (room.currentOccupants || 0) + room.occupantsCount;
    if (totalOccupants >= room.capacity) {
      return false;
    }

    // 3. Extreme Budget Mismatch (Hard Bound)
    // Already filtered by DB (rentAmount <= user.budgetMax * 2), 
    // but we can enforce it here as well just in case.
    if (user.budgetMax && room.rentAmount > user.budgetMax * 2) {
      return false;
    }

    // 4. Activity check
    if (!room.isActive) {
      return false;
    }

    return true;
  });
}

/**
 * Core Matching Engine
 * Calculates a weighted match score (0-100) between a user and a room.
 */
export function calculateRoomMatch(user: IUser, room: IRoom): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  // ==========================================
  // 1. Lifestyle Matching (Max 50 points)
  // ==========================================
  
  // Cleanliness (Max 10 pts)
  if (user.cleanlinessLevel) {
    const levels = { low: 1, medium: 2, high: 3 };
    const userClean = levels[user.cleanlinessLevel];
    const roomClean = levels[room.cleanlinessExpectation];
    const diff = Math.abs(userClean - roomClean);
    
    if (diff === 0) {
      score += 10;
      reasons.push("Perfect cleanliness match");
    } else if (diff === 1) {
      score += 4;
    }
  } else {
    // Neutral fallback
    score += 4;
  }

  // Occupation (Max 5 pts)
  if (room.occupationPreference && room.occupationPreference !== "any") {
    if (user.roleType === room.occupationPreference) {
      score += 5;
      reasons.push(`Matches occupation requirement (${room.occupationPreference})`);
    }
  } else {
    // Room accepts any, so we grant the points by default
    score += 5;
  }

  // Smoker (Max 10 pts)
  if (user.smoker !== undefined) {
    if (user.smoker && !room.smokerAllowed) {
      // User smokes, room doesn't allow -> strong penalty (0 pts added)
    } else if (!user.smoker && !room.smokerAllowed) {
      score += 10;
      reasons.push("Both prefer non-smoking");
    } else {
      score += 10; // Neutral or smoker in allowed room
    }
  } else {
    score += 5;
  }

  // Drinker (Max 10 pts)
  if (user.drinker !== undefined) {
    if (user.drinker && !room.drinkerAllowed) {
      // Penalty
    } else if (!user.drinker && !room.drinkerAllowed) {
      score += 10;
      reasons.push("Both prefer no drinking");
    } else {
      score += 10;
    }
  } else {
    score += 5;
  }

  // Guest Policy (Max 10 pts)
  if (user.guestPolicy) {
    const guestLevels = { no: 1, often: 2, regular: 3 };
    const uGuest = guestLevels[user.guestPolicy];
    const rGuest = guestLevels[room.guestPolicy];
    
    if (uGuest === rGuest) {
      score += 10;
      reasons.push("Aligned on guest policies");
    } else if (Math.abs(uGuest - rGuest) === 1) {
      score += 5;
    }
  } else {
    score += 5;
  }

  // Sleep Type Bonus (Max 5 pts)
  // Just a bonus, no penalty for mismatch
  if (user.sleepType) {
    score += 5; // We don't have room sleep type directly, but if we did we'd match.
    // For now, we just give the points if they have a sleep type specified.
  }

  // ==========================================
  // 2. Budget Matching (Max 25 points)
  // ==========================================
  const bMin = user.budgetMin || 0;
  const bMax = user.budgetMax || 1000000; // Arbitrary high fallback

  if (room.rentAmount >= bMin && room.rentAmount <= bMax) {
    score += 25;
    reasons.push("Within your budget");
  } else if (room.rentAmount > bMax && room.rentAmount <= bMax * 1.15) {
    // Slightly over budget (15%)
    score += 10;
    reasons.push("Slightly over your budget max");
  } else if (room.rentAmount < bMin) {
    // Under budget min
    score += 15;
    reasons.push("Below your budget range");
  } else {
    // Way over budget (0 pts)
    reasons.push("Over your budget");
  }

  // ==========================================
  // 3. Location Matching (Max 20 points)
  // ==========================================
  if (user.preferredLocations && user.preferredLocations.length > 0) {
    const roomLocNorm = normalizeString(room.locationText);
    
    // Check for exact matches after normalization
    let locationMatched = false;
    for (const loc of user.preferredLocations) {
      const uLocNorm = normalizeString(loc);
      if (roomLocNorm === uLocNorm) {
        score += 20;
        reasons.push(`Matches preferred location: ${loc}`);
        locationMatched = true;
        break;
      }
    }
    
    if (!locationMatched) {
      // Fallback score for no location match
      score += 0;
    }
  } else {
    // Neutral fallback if user hasn't set preferred locations
    score += 10;
  }

  // ==========================================
  // 4. Bonus Signals (Max 5 points)
  // ==========================================
  // Freshness: created within last 7 days
  const now = new Date();
  const roomAgeDays = (now.getTime() - new Date(room.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  
  if (roomAgeDays <= 7) {
    score += 3; // Freshness boost
  }
  
  // Active listing boost (implicit since we only query active rooms, but let's give a small baseline boost)
  if (room.isActive) {
    score += 2;
  }

  // Cap score at 100
  score = Math.min(100, Math.round(score));

  const lightweightRoom: LightweightRoom = {
    _id: (room._id as Types.ObjectId).toString(),
    title: room.title,
    locationText: room.locationText,
    rentAmount: room.rentAmount,
    images: room.images || [],
    capacity: room.capacity,
    currentOccupants: room.currentOccupants || 0,
    occupantsCount: room.occupantsCount,
    slug: room.slug,
  };

  return {
    roomId: lightweightRoom._id,
    room: lightweightRoom,
    score,
    reasons
  };
}

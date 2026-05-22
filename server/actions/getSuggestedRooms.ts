"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import Room, { IRoom } from "@/models/Room";
import { calculateRoomMatch, filterEligibleRooms, MatchResult } from "../services/calculateRoomMatch";

export async function getSuggestedRooms(limit: number = 20): Promise<{ error: string } | { success: true, matches: MatchResult[] }> {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    // 2. Fetch the current user profile (with all lifestyle traits)
    const user = await User.findById(session.user.id).lean() as IUser;
    if (!user) {
      return { error: "User profile not found." };
    }

    // 3. Database pre-filtering (light filter to keep DB load low)
    // We only want active rooms where occupantsCount is less than capacity.
    // And optionally bound by an extreme budget upper bound.
    const budgetUpperBound = user.budgetMax ? user.budgetMax * 2 : 9999999;

    const roomsCursor = await Room.find({
      isActive: true,
      $expr: { $lt: ["$occupantsCount", "$capacity"] },
      rentAmount: { $lte: budgetUpperBound },
    }).lean() as IRoom[];

    // 4. Pre-filter service (exclude hard rules like gender mismatches)
    const eligibleRooms = filterEligibleRooms(user, roomsCursor);

    // 5. Calculate match scores
    const matchResults: MatchResult[] = [];
    
    for (const room of eligibleRooms) {
      const result = calculateRoomMatch(user, room);
      // Even after soft scoring, exclude anything that resulted in a score of 0
      if (result.score > 0) {
        matchResults.push(result);
      }
    }

    // 6. Sort by score descending and return top matches
    matchResults.sort((a, b) => b.score - a.score);
    
    const topMatches = matchResults.slice(0, limit);

    return {
      success: true,
      matches: topMatches,
    };
  } catch (error: any) {
    console.error("getSuggestedRooms Server Action error:", error);
    return { error: error.message || "Failed to fetch suggested rooms." };
  }
}

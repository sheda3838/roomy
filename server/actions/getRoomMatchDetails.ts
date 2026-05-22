"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";
import { calculateRoomMatch } from "@/server/services/calculateRoomMatch";

export async function getRoomMatchDetails(slug: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to view compatibility details." };
    }

    await dbConnect();

    const [user, room] = await Promise.all([
      User.findById(session.user.id),
      Room.findOne({ slug }).populate({
        path: "ownerId",
        select: "fullName profilePicture roleType gender",
        model: User,
      }),
    ]);

    if (!user) return { error: "User profile not found." };
    if (!room) return { error: "Room not found." };

    // Get the base score from existing service
    const baseMatch = calculateRoomMatch(user, room);

    // Structure granular data for the visual breakdown page
    
    // 1. Lifestyle Breakdown
    const lifestyle = {
      cleanliness: {
        user: user.cleanlinessLevel,
        room: room.cleanlinessExpectation,
        match: user.cleanlinessLevel === room.cleanlinessExpectation ? "perfect" 
             : (user.cleanlinessLevel && room.cleanlinessExpectation) ? "partial" : "neutral",
      },
      smoker: {
        user: user.smoker,
        roomAllowed: room.smokerAllowed,
        match: user.smoker && !room.smokerAllowed ? "conflict" : "perfect",
      },
      drinker: {
        user: user.drinker,
        roomAllowed: room.drinkerAllowed,
        match: user.drinker && !room.drinkerAllowed ? "conflict" : "perfect",
      },
      guestPolicy: {
        user: user.guestPolicy,
        room: room.guestPolicy,
        match: user.guestPolicy === room.guestPolicy ? "perfect" : "partial",
      },
      sleep: {
        user: user.sleepType,
        room: "Not specified", // room schema doesn't currently specify sleep type, but we can display user's
      }
    };

    // 2. Budget Breakdown
    const budget = {
      userMin: user.budgetMin || 0,
      userMax: user.budgetMax || 0,
      roomRent: room.rentAmount,
      isPerfect: room.rentAmount >= (user.budgetMin || 0) && room.rentAmount <= (user.budgetMax || Infinity),
      isSlightlyOver: user.budgetMax ? room.rentAmount > user.budgetMax && room.rentAmount <= user.budgetMax * 1.15 : false,
      isUnder: user.budgetMin ? room.rentAmount < user.budgetMin : false,
      isConflict: user.budgetMax ? room.rentAmount > user.budgetMax * 1.15 : false,
    };

    // 3. Location Breakdown
    const location = {
      userPreferred: user.preferredLocations || [],
      roomLocation: room.locationText,
      isMatched: (user.preferredLocations || []).some((loc: string) => 
        room.locationText.toLowerCase().includes(loc.toLowerCase()) || 
        loc.toLowerCase().includes(room.locationText.toLowerCase())
      ),
    };

    // 4. Generate positive and negative signals explicitly for UI
    const positiveSignals = [];
    const possibleConflicts = [];

    if (budget.isPerfect) positiveSignals.push("Perfect budget fit");
    if (budget.isUnder) positiveSignals.push("Priced below your minimum budget");
    if (budget.isConflict) possibleConflicts.push("Significantly over your budget");

    if (location.isMatched) positiveSignals.push("In your preferred location");
    else if (location.userPreferred.length > 0) possibleConflicts.push("Outside your preferred locations");

    if (lifestyle.cleanliness.match === "perfect") positiveSignals.push("Aligned on cleanliness expectations");
    if (lifestyle.smoker.match === "conflict") possibleConflicts.push("You smoke, but room does not allow smoking");
    if (lifestyle.drinker.match === "conflict") possibleConflicts.push("You drink, but room does not allow drinking");
    if (lifestyle.guestPolicy.match === "perfect") positiveSignals.push("Perfect guest policy alignment");

    let matchLabel = "Moderate Match";
    if (baseMatch.score >= 80) matchLabel = "Strong Match";
    if (baseMatch.score >= 95) matchLabel = "Excellent Match";
    if (baseMatch.score < 50) matchLabel = "Poor Match";

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room)),
      match: {
        score: baseMatch.score,
        label: matchLabel,
        lifestyle,
        budget,
        location,
        positiveSignals,
        possibleConflicts,
      }
    };
  } catch (error: any) {
    console.error("getRoomMatchDetails error:", error);
    return { error: error.message || "Failed to calculate match details." };
  }
}

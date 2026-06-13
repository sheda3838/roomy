"use server";
import { IUser, IRoom } from "@/types";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Connection from "@/models/Connection";
import { calculatePeopleMatch, PeopleMatchResult } from "./calculatePeopleMatch";

export interface SuggestedPerson {
  user: IUser; // Ideally the sanitized IUser
  matchDetails: PeopleMatchResult;
}

export async function getSuggestedPeople(filters?: unknown) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "You must be logged in to discover people." };
    }

    await dbConnect();
    const currentUserId = session.user.id;

    // 1. Fetch current user to get their preferences
    const currentUser = await User.findById(currentUserId).lean();
    if (!currentUser) {
      return { error: "User profile not found." };
    }

    // 2. Find all people we should EXCLUDE
    // - Self
    // - People we are already connected with
    const activeConnections = await Connection.find({
      users: currentUserId,
      isActive: true,
    }).lean();

    const connectedUserIds = activeConnections.map((conn) => 
      conn.users.find((id) => id.toString() !== currentUserId)?.toString()
    ).filter(Boolean);

    const excludeIds = [currentUserId, ...connectedUserIds].map(id => new mongoose.Types.ObjectId(id));

    // 3. Build query for active seekers with visible profiles
    const query: any = {
      _id: { $nin: excludeIds },
      isActiveSeeker: true,            // Only show people looking for roommates
      isOnboardingComplete: true,
    };

    // Apply optional UI filters
    if (filters) {
      if (filters.roleType) query.roleType = filters.roleType;
      if (filters.gender) query.gender = filters.gender;
      if (filters.smoker !== undefined) query.smoker = filters.smoker;
      if (filters.drinker !== undefined) query.drinker = filters.drinker;
      if (filters.sleepType) query.sleepType = filters.sleepType;
      if (filters.cleanlinessLevel) query.cleanlinessLevel = filters.cleanlinessLevel;
      if (filters.locationText) {
        query.preferredLocations = { $in: [filters.locationText] };
      }
    }

    console.log("[getSuggestedPeople] query:", JSON.stringify(query));

    // 4. Fetch potential roommates
    const potentialRoommates = await User.find(query)
      .select("fullName profilePicture roleType gender cleanlinessLevel sleepType smoker guestPolicy budgetMin budgetMax preferredLocations")
      .lean();

    console.log(`[getSuggestedPeople] found ${potentialRoommates.length} people:`, potentialRoommates.map((u: any) => `${u.fullName}`));

    // 5. Run Matching Algorithm and filter out low matches (optional threshold)
    const scoredPeople: SuggestedPerson[] = potentialRoommates.map(partner => {
      const matchDetails = calculatePeopleMatch(currentUser, partner);
      return {
        user: {
          _id: partner._id.toString(),
          fullName: partner.fullName,
          profilePicture: partner.profilePicture,
          roleType: partner.roleType,
          gender: partner.gender,
          budgetMin: partner.budgetMin,
          budgetMax: partner.budgetMax,
        },
        matchDetails
      };
    });

    // 6. Sort by highest compatibility score
    scoredPeople.sort((a, b) => b.matchDetails.score - a.matchDetails.score);

    return { success: true, people: JSON.parse(JSON.stringify(scoredPeople)) };

  } catch (error: any) {
    console.error("getSuggestedPeople error:", error);
    return { error: "Failed to fetch suggested people." };
  }
}

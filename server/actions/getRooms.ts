"use server";
import { IUser, IRoom } from "@/types";

import dbConnect from "@/lib/db";
import Room from "@/models/Room";

export interface GetRoomsFilters {
  locationText?: string;
  rentMin?: number;
  rentMax?: number;
  cleanlinessExpectation?: "low" | "medium" | "high";
  smokerAllowed?: boolean;
  drinkerAllowed?: boolean;
  guestPolicy?: "no" | "often" | "regular";
  genderPreference?: "male" | "female" | "any";
}

export interface GetRoomsOptions {
  page?: number;
  limit?: number;
  filters?: GetRoomsFilters;
  excludeOwnerId?: string;
  ownerId?: string;
}

export async function getRooms(options: GetRoomsOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const filters = options.filters || {};

  try {
    await dbConnect();

    // 1. Build the MongoDB query object dynamically
    const query: unknown = { isActive: true };

    if (options.ownerId) {
      // Fetch only these rooms (e.g. for "My Rooms")
      // Also bypass isActive: true if we want to show draft/inactive rooms to the owner?
      // For now, let's just query by ownerId
      query.ownerId = options.ownerId;
      delete query.isActive; // Allow the user to see their own inactive rooms
    } else if (options.excludeOwnerId) {
      query.ownerId = { $ne: options.excludeOwnerId };
    }

    if (filters.locationText) {
      query.locationText = { $regex: filters.locationText, $options: "i" };
    }

    if (filters.rentMin !== undefined || filters.rentMax !== undefined) {
      query.rentAmount = {};
      if (filters.rentMin !== undefined) {
        query.rentAmount.$gte = filters.rentMin;
      }
      if (filters.rentMax !== undefined) {
        query.rentAmount.$lte = filters.rentMax;
      }
    }

    if (filters.cleanlinessExpectation) {
      query.cleanlinessExpectation = filters.cleanlinessExpectation;
    }

    if (filters.smokerAllowed !== undefined) {
      query.smokerAllowed = filters.smokerAllowed;
    }

    if (filters.drinkerAllowed !== undefined) {
      query.drinkerAllowed = filters.drinkerAllowed;
    }

    if (filters.guestPolicy) {
      query.guestPolicy = filters.guestPolicy;
    }

    if (filters.genderPreference && filters.genderPreference !== "any") {
      query.genderPreference = filters.genderPreference;
    }

    // 2. Fetch lightweight metadata of matched listings
    const rooms = await Room.find(query)
      .select(
        "title slug locationText rentAmount deposit capacity images cleanlinessExpectation genderPreference isActive occupantsCount createdAt"
      )
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalRooms = await Room.countDocuments(query);

    return {
      success: true,
      rooms: JSON.parse(JSON.stringify(rooms)), // Serialize mongoose documents for client transition
      pagination: {
        page,
        limit,
        totalRooms,
        totalPages: Math.ceil(totalRooms / limit),
      },
    };
  } catch (error: unknown) {
    console.error("getRooms Server Action error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred while fetching rooms." };
  }
}

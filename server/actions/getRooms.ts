"use server";

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
}

export async function getRooms(options: GetRoomsOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.max(1, options.limit || 10);
  const filters = options.filters || {};

  try {
    await dbConnect();

    // 1. Build the MongoDB query object dynamically
    const query: any = { isActive: true };

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
  } catch (error: any) {
    console.error("getRooms Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while fetching rooms." };
  }
}

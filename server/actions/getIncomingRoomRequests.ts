"use server";
import { IUser, IRoom } from "@/types";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoomRequest from "@/models/RoomRequest";
import Room from "@/models/Room";
import User from "@/models/User";

/**
 * Returns all pending room join requests across ALL rooms owned by the current user.
 */
export async function getIncomingRoomRequests() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized." };

    await dbConnect();

    // Find all rooms owned by the user
    const ownedRooms = await Room.find({ ownerId: session.user.id, isActive: true })
      .select("_id title slug occupantsCount capacity")
      .lean();

    if (!ownedRooms.length) return { success: true, requests: [] };

    const roomIds = ownedRooms.map((r: unknown) => r._id);

    const requests = await RoomRequest.find({
      roomId: { $in: roomIds },
      status: "pending",
    })
      .populate({
        path: "fromUserId",
        select: "fullName profilePicture roleType gender",
        model: User,
      })
      .sort({ createdAt: -1 })
      .lean();

    // Attach room info to each request
    const roomMap = Object.fromEntries(ownedRooms.map((r: unknown) => [r._id.toString(), r]));

    const enriched = requests.map((req: unknown) => ({
      ...req,
      room: roomMap[req.roomId.toString()] ?? null,
    }));

    return { success: true, requests: JSON.parse(JSON.stringify(enriched)) };
  } catch (error: unknown) {
    console.error("getIncomingRoomRequests error:", error);
    return { error: "Failed to fetch room requests." };
  }
}

"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import RoomRequest from "@/models/RoomRequest";

export async function rejectRequest(requestId: string) {
  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
    return { error: "A valid Request ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to manage requests." };
    }

    // 2. Connect to database
    await dbConnect();

    // 3. Retrieve request
    const request = await RoomRequest.findById(requestId);
    if (!request) {
      return { error: "Join request could not be found." };
    }

    if (request.status !== "pending") {
      return { error: `This request is already resolved (${request.status}).` };
    }

    // 4. Retrieve associated room and verify ownership
    const room = await Room.findById(request.roomId);
    if (!room) {
      return { error: "Associated room listing could not be found." };
    }

    if (room.ownerId.toString() !== session.user.id) {
      return { error: "You are not authorized to reject requests for this room." };
    }

    // 5. Update request status
    request.status = "rejected";
    await request.save();

    return { success: "Join request rejected successfully." };
  } catch (error: any) {
    console.error("rejectRequest Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while resolving the request." };
  }
}

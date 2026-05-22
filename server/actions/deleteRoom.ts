"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import RoomRequest from "@/models/RoomRequest";

export async function deleteRoom(roomId: string) {
  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return { error: "A valid Room ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to delete listings." };
    }

    // 2. Connect to database
    await dbConnect();

    // 3. Retrieve room and verify ownership
    const room = await Room.findById(roomId);
    if (!room) {
      return { error: "Room listing could not be found." };
    }

    if (room.ownerId.toString() !== session.user.id) {
      return { error: "You do not have permission to delete this listing." };
    }

    // 4. Perform deletes
    // Delete the room document
    await Room.findByIdAndDelete(roomId);

    // Cascade delete any associated RoomRequests
    await RoomRequest.deleteMany({ roomId });

    return { success: "Room listing deleted successfully!" };
  } catch (error: any) {
    console.error("deleteRoom Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while deleting the room." };
  }
}

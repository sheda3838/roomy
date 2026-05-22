"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";

export async function joinRoom(roomId: string) {
  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return { error: "A valid Room ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to join a room." };
    }

    const userId = session.user.id;

    // 2. Connect to database
    await dbConnect();

    // 3. Retrieve room document
    const room = await Room.findById(roomId);
    if (!room) {
      return { error: "Room listing could not be found." };
    }

    if (!room.isActive) {
      return { error: "This room listing is currently inactive." };
    }

    // 4. Validate business rules
    // Owners shouldn't join as roommates to their own listings
    if (room.ownerId.toString() === userId) {
      return { error: "You cannot join a room that you own." };
    }

    // Check capacity limits
    if (room.occupantIds.length >= room.capacity) {
      return { error: "Room has reached its maximum occupant capacity." };
    }

    // Prevent duplicate entries
    const isAlreadyOccupant = room.occupantIds.some(
      (id) => id.toString() === userId
    );
    if (isAlreadyOccupant) {
      return { error: "You are already an occupant of this room." };
    }

    // 5. Update occupants and save
    room.occupantIds.push(new mongoose.Types.ObjectId(userId));
    await room.save(); // pre-save hook will update occupantsCount automatically

    return { success: "You have joined the room successfully!" };
  } catch (error: any) {
    console.error("joinRoom Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while joining the room." };
  }
}

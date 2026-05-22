"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import RoomRequest from "@/models/RoomRequest";

export async function sendJoinRequest(roomId: string) {
  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return { error: "A valid Room ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to send join requests." };
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

    // 4. Validate request constraints
    // Owners cannot request to join their own room
    if (room.ownerId.toString() === userId) {
      return { error: "You cannot request to join a room that you own." };
    }

    // Check capacity limits
    if (room.occupantIds.length >= room.capacity) {
      return { error: "Room has reached its maximum occupant capacity." };
    }

    // Check if user is already an occupant
    const isAlreadyOccupant = room.occupantIds.some(
      (id) => id.toString() === userId
    );
    if (isAlreadyOccupant) {
      return { error: "You are already an occupant of this room." };
    }

    // Check for any existing pending requests
    const existingRequest = await RoomRequest.findOne({
      fromUserId: userId,
      roomId,
      status: "pending",
    });

    if (existingRequest) {
      return { error: "You have already sent a pending request to join this room." };
    }

    // 5. Create RoomRequest document
    const newRequest = await RoomRequest.create({
      fromUserId: userId,
      roomId,
      type: "join_room",
      status: "pending",
    });

    return { 
      success: "Your request to join has been sent!", 
      request: {
        id: newRequest._id.toString(),
        status: newRequest.status,
      } 
    };
  } catch (error: any) {
    console.error("sendJoinRequest Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while sending the join request." };
  }
}

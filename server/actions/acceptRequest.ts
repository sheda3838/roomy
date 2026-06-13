"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import RoomRequest from "@/models/RoomRequest";
import { createNotification } from "@/server/services/notificationService";


export async function acceptRequest(requestId: string) {
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
      return { error: "You are not authorized to accept requests for this room." };
    }

    // 5. Apply joining validation checks
    if (room.occupantIds.length >= room.capacity) {
      return { error: "Cannot accept request: Room has reached its occupant capacity limit." };
    }

    const applicantId = request.fromUserId;
    const isAlreadyOccupant = room.occupantIds.some(
      (id) => id.toString() === applicantId.toString()
    );

    // 6. Complete transition
    if (!isAlreadyOccupant) {
      room.occupantIds.push(applicantId);
      await room.save(); // Automatically updates occupantsCount in pre-save hook
    }

    request.status = "accepted";
    await request.save();

    // Notify requester their request was accepted
    await createNotification({
      userId: request.fromUserId.toString(),
      type: "request_accepted",
      title: "Join Request Accepted! 🎉",
      message: `Your request to join "${room.title}" has been accepted.`,
      link: `/rooms/${room.slug}`,
    });

    return { success: "Join request accepted successfully! Applicant added as occupant." };
  } catch (error: unknown) {
    console.error("acceptRequest Server Action error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred while resolving the request." };
  }
}

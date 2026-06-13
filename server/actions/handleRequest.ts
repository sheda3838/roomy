"use server";
import { IUser, IRoom } from "@/types";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoomRequest from "@/models/RoomRequest";
import Room from "@/models/Room";
import Connection from "@/models/Connection";
import { pusherServer } from "@/lib/pusher";
import { createNotification } from "@/server/services/notificationService";

export async function handleRequest(requestId: string, action: "accept" | "reject") {
  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
    return { error: "A valid Request ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to perform this action." };
    }

    const userId = session.user.id;

    // 2. Connect to database
    await dbConnect();

    // 3. Find the pending request and ensure the user is the owner
    const request = await RoomRequest.findOne({ _id: requestId, status: "pending" }).populate("roomId");
    
    if (!request) {
      return { error: "Pending request not found. It may have already been handled or cancelled." };
    }

    const room = await Room.findById(request.roomId);
    if (!room) {
      return { error: "The associated room could not be found." };
    }

    const ownerIdStr = request.ownerId ? request.ownerId.toString() : room.ownerId.toString();
    if (ownerIdStr !== userId) {
      return { error: "You are not authorized to handle this request." };
    }

    const requesterIdStr = request.fromUserId.toString();

    // 4. Handle "Reject" Action
    if (action === "reject") {
      request.status = "rejected";
      await request.save();

      // Trigger pusher event for the requester
      await pusherServer.trigger(`private-user-${requesterIdStr}`, "request:update", {
        requestId: request._id,
        status: "rejected",
        roomId: room._id,
      });

      return { success: "Request rejected successfully." };
    }

    // 5. Handle "Accept" Action
    if (action === "accept") {
      // Re-check capacity to prevent race conditions
      if (room.occupantIds.length >= room.capacity) {
        return { error: "Cannot accept request. The room has reached its maximum occupant capacity." };
      }

      // Check if user is already an occupant
      const isAlreadyOccupant = room.occupantIds.some((id: any) => id.toString() === requesterIdStr);
      if (isAlreadyOccupant) {
        return { error: "User is already an occupant of this room." };
      }

      // a) Update request status
      request.status = "accepted";
      await request.save();

      // b) Create Connection Record
      let newConnection;
      try {
        newConnection = await Connection.create({
          users: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(requesterIdStr)],
          roomId: room._id,
        });
      } catch (err: any) {
        if (err.code === 11000) {
          newConnection = await Connection.findOne({
            roomId: room._id,
            users: { $all: [new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(requesterIdStr)] }
          });
          if (!newConnection) {
            throw err;
          }
        } else {
          throw err;
        }
      }

      // c) Update Room
      room.occupantIds.push(new mongoose.Types.ObjectId(requesterIdStr));
      room.occupantsCount = room.occupantIds.length;
      await room.save();

      // d) Trigger pusher events
      await pusherServer.trigger(`private-user-${requesterIdStr}`, "request:update", {
        requestId: request._id,
        status: "accepted",
        roomId: room._id,
      });

      await pusherServer.trigger(`private-user-${userId}`, "connection:created", {
        connectionId: newConnection._id,
        partnerId: requesterIdStr,
        roomId: room._id,
      });

      await pusherServer.trigger(`private-user-${requesterIdStr}`, "connection:created", {
        connectionId: newConnection._id,
        partnerId: userId,
        roomId: room._id,
      });

      // e) Create notification for requester
      await createNotification({
        userId: requesterIdStr,
        type: "request_accepted",
        title: "Join Request Accepted! 🎉",
        message: `Your request to join "${room.title}" has been accepted.`,
        link: `/chat/${newConnection._id.toString()}`,
      });

      return { 
        success: "Request accepted and connection established successfully.",
        connectionId: newConnection._id.toString()
      };
    }

    return { error: "Invalid action." };
  } catch (error: any) {
    console.error("handleRequest Server Action error:", error);
    
    // Catch unique constraint error on Connection (E11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern['users.0'] !== undefined) {
       return { error: "A connection already exists between you and this user for this room." };
    }
    
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred while handling the request." };
  }
}

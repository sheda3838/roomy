"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoommateRequest from "@/models/RoommateRequest";
import Connection from "@/models/Connection";
import User from "@/models/User";

export async function sendRoommateRequest(receiverId: string, message?: string) {
  if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return { error: "Invalid user ID." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized." };
    }

    const requesterId = session.user.id;
    if (requesterId === receiverId) {
      return { error: "You cannot send a request to yourself." };
    }

    await dbConnect();

    // Check if already connected
    const existingConnection = await Connection.findOne({
      users: { $all: [requesterId, receiverId] },
      isActive: true,
    });

    if (existingConnection) {
      return { error: "You are already connected with this person." };
    }

    // Check for existing pending request
    const existingRequest = await RoommateRequest.findOne({
      requesterId,
      receiverId,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return { error: "You already have an active request with this person." };
    }

    // Create new request
    const request = await RoommateRequest.create({
      requesterId,
      receiverId,
      status: "pending",
      message: message?.trim(),
    });

    return { success: true, request: JSON.parse(JSON.stringify(request)) };
  } catch (error: any) {
    console.error("sendRoommateRequest error:", error);
    return { error: "Failed to send roommate request." };
  }
}

export async function handleRoommateRequestAction(requestId: string, action: "accept" | "reject") {
  if (!requestId || !mongoose.Types.ObjectId.isValid(requestId)) {
    return { error: "Invalid request ID." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized." };
    }

    await dbConnect();

    // Find the request and ensure the current user is the receiver
    const request = await RoommateRequest.findOne({
      _id: requestId,
      receiverId: session.user.id,
      status: "pending"
    });

    if (!request) {
      return { error: "Request not found or already processed." };
    }

    if (action === "reject") {
      request.status = "rejected";
      await request.save();
      return { success: true, message: "Request rejected." };
    }

    if (action === "accept") {
      // Create Connection
      const newConnection = new Connection({
        users: [request.requesterId, request.receiverId],
        isActive: true,
        connectedAt: new Date()
      });
      await newConnection.save();

      // Update users' connection arrays
      await User.updateMany(
        { _id: { $in: [request.requesterId, request.receiverId] } },
        { $addToSet: { connectionIds: newConnection._id } }
      );

      // Update request status
      request.status = "accepted";
      await request.save();

      return { success: true, connectionId: newConnection._id.toString() };
    }

    return { error: "Invalid action." };
  } catch (error: any) {
    console.error("handleRoommateRequestAction error:", error);
    return { error: "Failed to process request." };
  }
}

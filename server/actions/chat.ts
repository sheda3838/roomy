"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Connection from "@/models/Connection";
import Message from "@/models/Message";
import User from "@/models/User";
import { pusherServer } from "@/lib/pusher";

/**
 * Validates if the current user has access to a specific connection chat.
 * Returns the connection and the partner's basic profile if valid.
 */
export async function validateChatAccess(connectionId: string) {
  if (!connectionId || !mongoose.Types.ObjectId.isValid(connectionId)) {
    return { error: "Invalid connection ID." };
  }

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized." };
    }

    await dbConnect();
    const userId = session.user.id;

    const connection = await Connection.findOne({
      _id: connectionId,
      users: userId,
      isActive: true,
    });

    if (!connection) {
      return { error: "Connection not found or you do not have access." };
    }

    // Identify the partner
    const partnerId = connection.users.find((id) => id.toString() !== userId);
    
    let partner = null;
    if (partnerId) {
      partner = await User.findById(partnerId).select("fullName profilePicture").lean();
    }

    return { 
      success: true, 
      connection: JSON.parse(JSON.stringify(connection)),
      partner: partner ? JSON.parse(JSON.stringify(partner)) : null,
      userId 
    };
  } catch (error: any) {
    console.error("validateChatAccess error:", error);
    return { error: "An unexpected error occurred validating chat access." };
  }
}

/**
 * Fetches message history for a connection
 */
export async function getMessages(connectionId: string) {
  const access = await validateChatAccess(connectionId);
  if (access.error) return access;

  try {
    const messages = await Message.find({ connectionId })
      .sort({ createdAt: 1 })
      .lean();

    return { success: true, messages: JSON.parse(JSON.stringify(messages)) };
  } catch (error: any) {
    console.error("getMessages error:", error);
    return { error: "Failed to fetch messages." };
  }
}

/**
 * Sends a message and triggers real-time delivery via Pusher
 */
export async function sendMessage(connectionId: string, content: string) {
  if (!content || !content.trim()) {
    return { error: "Message content cannot be empty." };
  }

  const access = await validateChatAccess(connectionId);
  if (access.error || !access.userId || !access.partner) {
    return { error: access.error || "Failed to validate chat access." };
  }

  try {
    const newMessage = await Message.create({
      connectionId,
      senderId: access.userId,
      receiverId: access.partner._id,
      content: content.trim(),
      messageType: "text",
    });

    const messageData = JSON.parse(JSON.stringify(newMessage));

    // Trigger Pusher event to the specific connection channel
    // We use a connection-specific channel rather than a user-specific one
    // so both parties in the UI can just subscribe to the connection channel.
    await pusherServer.trigger(`private-chat-${connectionId}`, "message:new", messageData);

    return { success: true, message: messageData };
  } catch (error: any) {
    console.error("sendMessage error:", error);
    return { error: "Failed to send message." };
  }
}

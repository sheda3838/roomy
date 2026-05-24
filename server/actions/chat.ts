"use server";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Connection from "@/models/Connection";
import Message from "@/models/Message";
import User from "@/models/User";
import Room from "@/models/Room";
import { pusherServer } from "@/lib/pusher";
import { createNotification } from "@/server/services/notificationService";


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
    }).lean();

    if (!connection) {
      return { error: "Connection not found or you do not have access." };
    }

    // Identify the partner
    const partnerId = connection.users.find(
      (id) => id && id.toString().toLowerCase() !== userId.toLowerCase()
    );
    
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

    return { 
      success: true, 
      messages: JSON.parse(JSON.stringify(messages)),
      partner: access.partner 
    };
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
    await pusherServer.trigger(`private-chat-${connectionId}`, "message:new", messageData);

    // Notify the receiver with a notification (non-blocking)
    const senderId = access.userId;
    const partnerId = access.partner?._id?.toString();
    if (partnerId) {
      const senderUser = await User.findById(senderId).select("fullName").lean();
      const senderName = (senderUser as any)?.fullName ?? "Someone";
      createNotification({
        userId: partnerId,
        type: "message_received",
        title: `New message from ${senderName}`,
        message: content.trim().slice(0, 80) + (content.length > 80 ? "…" : ""),
        link: `/chat/${connectionId}`,
      }).catch(() => {}); // fire-and-forget
    }

    return { success: true, message: messageData };
  } catch (error: any) {
    console.error("sendMessage error:", error);
    return { error: "Failed to send message." };
  }
}

/**
 * Fetch connections populated with their last message and unread count
 */
export async function getChatConnections() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to view your chats." };
    }

    const userId = session.user.id;
    await dbConnect();

    // 1. Fetch all connections
    const connections = await Connection.find({
      users: userId,
      isActive: true,
    })
      .populate({
        path: "roomId",
        select: "title slug locationText images",
        model: Room,
      })
      .lean();

    if (!connections || connections.length === 0) {
      return { success: true, connections: [] };
    }

    const connectionIds = connections.map((c) => c._id);

    // 2. Extract partner IDs and fetch users in a single batch query
    const partnerIds = connections
      .map((conn: any) => conn.users.find((id: any) => id && id.toString().toLowerCase() !== userId.toLowerCase()))
      .filter(Boolean);

    const partners = await User.find({ _id: { $in: partnerIds } })
      .select("fullName profilePicture roleType")
      .lean();

    const partnerMap = new Map(partners.map((p: any) => [p._id.toString(), p]));

    // 3. Fetch last messages in a single aggregation pipeline
    const lastMessages = await Message.aggregate([
      { $match: { connectionId: { $in: connectionIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$connectionId",
          lastMsg: { $first: "$$ROOT" },
        },
      },
    ]);

    const lastMessageMap = new Map(lastMessages.map((m: any) => [m._id.toString(), m.lastMsg]));

    // 4. Fetch unread counts in a single aggregation pipeline
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          connectionId: { $in: connectionIds },
          receiverId: new mongoose.Types.ObjectId(userId),
          readAt: { $exists: false },
        },
      },
      {
        $group: {
          _id: "$connectionId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadCountMap = new Map(unreadCounts.map((u: any) => [u._id.toString(), u.count]));

    // 5. Format the connections list
    const formatted = connections.map((conn: any) => {
      const partnerId = conn.users.find(
        (id: any) => id && id.toString().toLowerCase() !== userId.toLowerCase()
      );
      const partner = partnerId ? partnerMap.get(partnerId.toString()) : null;
      const lastMessage = lastMessageMap.get(conn._id.toString());
      const unreadCount = unreadCountMap.get(conn._id.toString()) || 0;

      const lastActiveTime = lastMessage ? lastMessage.createdAt : conn.connectedAt;

      return {
        _id: conn._id.toString(),
        roomId: conn.roomId?._id?.toString(),
        room: conn.roomId ? {
          title: conn.roomId.title,
          slug: conn.roomId.slug,
          locationText: conn.roomId.locationText,
          image: conn.roomId.images && conn.roomId.images.length > 0 ? conn.roomId.images[0] : null,
        } : null,
        partner: partner ? {
          _id: partner._id.toString(),
          fullName: partner.fullName,
          profilePicture: partner.profilePicture,
          roleType: partner.roleType,
        } : null,
        lastMessage: lastMessage ? {
          _id: lastMessage._id.toString(),
          content: lastMessage.content,
          senderId: lastMessage.senderId.toString(),
          createdAt: lastMessage.createdAt,
        } : null,
        unreadCount,
        lastActiveTime,
      };
    });

    // Sort by last active time descending (most recent first)
    formatted.sort((a: any, b: any) => {
      return new Date(b.lastActiveTime).getTime() - new Date(a.lastActiveTime).getTime();
    });

    return { 
      success: true, 
      connections: JSON.parse(JSON.stringify(formatted)) 
    };
  } catch (error: any) {
    console.error("getChatConnections error:", error);
    return { error: "Failed to fetch chat connections." };
  }
}

/**
 * Mark messages in a connection received by user as read
 */
export async function markAsRead(connectionId: string) {
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

    // Update all messages where receiver is current user and readAt is not set
    const result = await Message.updateMany(
      {
        connectionId,
        receiverId: userId,
        readAt: { $exists: false },
      },
      {
        $set: { readAt: new Date() },
      }
    );

    // Trigger Pusher event to notify the partner that messages are read
    if (result.modifiedCount > 0) {
      await pusherServer.trigger(`private-chat-${connectionId}`, "message:read", {
        connectionId,
        readerId: userId,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("markAsRead error:", error);
    return { error: "Failed to mark messages as read." };
  }
}

/**
 * Notify the partner that user is typing
 */
export async function sendTypingStatus(connectionId: string, isTyping: boolean) {
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

    await pusherServer.trigger(`private-chat-${connectionId}`, "client-typing", {
      userId,
      isTyping,
    });

    return { success: true };
  } catch (error: any) {
    console.error("sendTypingStatus error:", error);
    return { error: "Failed to trigger typing status event." };
  }
}


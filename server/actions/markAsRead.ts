"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

/**
 * Mark a single notification as read.
 * Validates that the notification belongs to the current user.
 */
export async function markAsRead(notificationId: string) {
  if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
    return { error: "Invalid notification ID." };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    await dbConnect();

    const result = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!result) return { error: "Notification not found." };

    return { success: true };
  } catch (error: unknown) {
    console.error("markAsRead error:", error);
    return { error: "Failed to mark notification as read." };
  }
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    await dbConnect();

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    return { success: true };
  } catch (error: unknown) {
    console.error("markAllAsRead error:", error);
    return { error: "Failed to mark notifications as read." };
  }
}

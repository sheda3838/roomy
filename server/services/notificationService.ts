"use server";
import dbConnect from "@/lib/db";
import Notification, { NotificationType } from "@/models/Notification";
import { pusherServer } from "@/lib/pusher";

interface CreateNotificationInput {
  userId: string;          // MongoDB ObjectId string of the recipient
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Central notification creator.
 * 1. Persists to MongoDB.
 * 2. Fires a real-time Pusher event on `private-user-{userId}`.
 *
 * This is intentionally a plain async function (not a Server Action)
 * so it can be imported inside other Server Actions without  * directive conflicts when called from within the same server context.
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    await dbConnect();

    const notification = await Notification.create({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    });

    const payload = {
      _id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      link: notification.link ?? null,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };

    // Fire real-time event (non-blocking — we don't await the trigger result)
    pusherServer
      .trigger(`private-user-${input.userId}`, "notification:new", payload)
      .catch((err) => console.error("[Pusher] Failed to trigger notification:", err));

    return { success: true, notification: payload };
  } catch (error: unknown) {
    console.error("[notificationService] createNotification error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "Failed to create notification." };
  }
}

"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

const PAGE_SIZE = 20;

/**
 * Fetch paginated notifications for the current user, newest first.
 * Optionally filter by type or isRead status.
 */
export async function getNotifications(options?: {
  page?: number;
  filter?: "unread" | "request_received" | "request_accepted" | "request_rejected" | "message_received" | "match_found";
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized." };

  try {
    await dbConnect();

    const page = Math.max(1, options?.page ?? 1);
    const skip = (page - 1) * PAGE_SIZE;

    // Build query
    const query: Record<string, unknown> = { userId: session.user.id };
    if (options?.filter === "unread") {
      query.isRead = false;
    } else if (options?.filter) {
      query.type = options.filter;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(PAGE_SIZE)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId: session.user.id, isRead: false }),
    ]);

    return {
      success: true,
      notifications: JSON.parse(JSON.stringify(notifications)),
      total,
      unreadCount,
      page,
      pageSize: PAGE_SIZE,
      hasMore: skip + notifications.length < total,
    };
  } catch (error: any) {
    console.error("getNotifications error:", error);
    return { error: "Failed to fetch notifications." };
  }
}

/**
 * Get the unread count only (lightweight, used for badge).
 */
export async function getUnreadCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    await dbConnect();
    return await Notification.countDocuments({
      userId: session.user.id,
      isRead: false,
    });
  } catch {
    return 0;
  }
}

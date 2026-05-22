"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import RoommateRequest from "@/models/RoommateRequest";

export async function getIncomingRoommateRequests() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized." };
    }

    await dbConnect();

    const requests = await RoommateRequest.find({
      receiverId: session.user.id,
      status: "pending"
    })
      .populate("requesterId", "fullName profilePicture roleType gender")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, requests: JSON.parse(JSON.stringify(requests)) };
  } catch (error: any) {
    console.error("getIncomingRoommateRequests error:", error);
    return { error: "Failed to fetch requests." };
  }
}

"use server";

import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User"; // Ensure model is compiled

export async function getRoomBySlug(slug: string) {
  if (!slug) {
    return { error: "Room slug is required." };
  }

  try {
    await dbConnect();

    // Fetch the room and populate owner and occupant profiles (excluding passwords/private fields)
    const room = await Room.findOne({ slug })
      .populate({
        path: "ownerId",
        select: "fullName email profilePicture gender roleType",
        model: User
      })
      .populate({
        path: "occupantIds",
        select: "fullName email profilePicture gender roleType",
        model: User
      });

    if (!room) {
      return { error: "Room listing could not be found." };
    }

    return {
      success: true,
      room: JSON.parse(JSON.stringify(room.toObject())),
    };
  } catch (error: unknown) {
    console.error("getRoomBySlug Server Action error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred while fetching the room details." };
  }
}

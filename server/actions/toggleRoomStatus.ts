"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { revalidatePath } from "next/cache";

export async function toggleRoomStatus(roomSlug: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "Unauthorized" };
    }

    await dbConnect();

    const room = await Room.findOne({ slug: roomSlug });
    if (!room) {
      return { error: "Room not found." };
    }

    if (room.ownerId.toString() !== session.user.id) {
      return { error: "You do not have permission to modify this room." };
    }

    room.isActive = !room.isActive;
    await room.save();

    revalidatePath("/discover");
    revalidatePath(`/rooms/${roomSlug}`);

    return { 
      success: true, 
      isActive: room.isActive 
    };
  } catch (error: any) {
    console.error("toggleRoomStatus Error:", error);
    return { error: error.message || "Failed to change room status." };
  }
}

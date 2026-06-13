"use server";
import { IUser, IRoom } from "@/types";

import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { editRoomSchema, type EditRoomInput } from "@/server/validations/room";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomSuffix}`;
}

export async function editRoom(roomId: string, data: EditRoomInput) {
  if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
    return { error: "A valid Room ID is required." };
  }

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to modify listings." };
    }

    // 2. Validate input schema
    const validation = editRoomSchema.safeParse(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((err) => err.message).join(", ");
      return { error: errorMsg };
    }

    const validatedData = validation.data;

    // 3. Connect to database
    await dbConnect();

    // 4. Retrieve room and verify ownership
    const room = await Room.findById(roomId);
    if (!room) {
      return { error: "Room listing could not be found." };
    }

    if (room.ownerId.toString() !== session.user.id) {
      return { error: "You do not have permission to edit this listing." };
    }

    // 5. Update fields
    const fieldsToUpdate: unknown = { ...validatedData };

    // Regenerate slug if title changes
    if (validatedData.title && validatedData.title !== room.title) {
      let slug = generateSlug(validatedData.title);
      let slugExists = await Room.findOne({ slug });
      let attempts = 0;
      while (slugExists && attempts < 5) {
        slug = generateSlug(validatedData.title);
        slugExists = await Room.findOne({ slug });
        attempts++;
      }
      fieldsToUpdate.slug = slug;
    }

    // Apply updates
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return { error: "Failed to apply updates to room listing." };
    }

    return { 
      success: "Room listing updated successfully!", 
      room: {
        id: updatedRoom._id.toString(),
        title: updatedRoom.title,
        slug: updatedRoom.slug,
      } 
    };
  } catch (error: unknown) {
    console.error("editRoom Server Action error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred while modifying the room." };
  }
}

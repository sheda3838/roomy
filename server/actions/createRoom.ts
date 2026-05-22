"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Room from "@/models/Room";
import { createRoomSchema, type CreateRoomInput } from "@/server/validations/room";

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

export async function createRoom(data: CreateRoomInput) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to list a room." };
    }

    // 2. Validate input schema
    const validation = createRoomSchema.safeParse(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((err) => err.message).join(", ");
      return { error: `Validation failed: ${errorMsg}` };
    }

    const validatedData = validation.data;

    // 3. Connect to database
    await dbConnect();

    // 4. Generate unique slug
    let slug = generateSlug(validatedData.title);
    let slugExists = await Room.findOne({ slug });
    
    // Safety check loop for slug collision
    let attempts = 0;
    while (slugExists && attempts < 5) {
      slug = generateSlug(validatedData.title);
      slugExists = await Room.findOne({ slug });
      attempts++;
    }

    // 5. Create new Room document
    const newRoom = await Room.create({
      ...validatedData,
      ownerId: session.user.id,
      occupantIds: [],
      occupantsCount: 0,
      isActive: true,
      slug,
    });

    return { 
      success: "Room listed successfully!", 
      room: {
        id: newRoom._id.toString(),
        title: newRoom.title,
        slug: newRoom.slug,
      }
    };
  } catch (error: any) {
    console.error("createRoom Server Action error:", error);
    return { error: error.message || "An unexpected error occurred while creating the room." };
  }
}

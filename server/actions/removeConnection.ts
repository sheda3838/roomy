"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Connection from "@/models/Connection";
import { revalidatePath } from "next/cache";

export async function removeConnection(connectionId: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to remove a connection." };
    }

    const userId = session.user.id;
    await dbConnect();

    // Verify the connection belongs to the user and is active
    const connection = await Connection.findOne({
      _id: connectionId,
      users: userId,
    });

    if (!connection) {
      return { error: "Connection not found or unauthorized." };
    }

    // Instead of deleting, mark it inactive or delete it entirely
    // We'll delete it to clean up
    await Connection.findByIdAndDelete(connectionId);

    revalidatePath("/dashboard");
    revalidatePath("/messages");

    return { success: true };
  } catch (error: unknown) {
    console.error("removeConnection error:", error);
    return { error: "Failed to remove connection." };
  }
}

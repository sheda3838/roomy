"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { editProfileSchema, type EditProfileInput } from "@/server/validations/profile";
import { revalidatePath } from "next/cache";

export async function editProfile(data: EditProfileInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Not authenticated" };
    }

    const validation = editProfileSchema.safeParse(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((err) => err.message).join(", ");
      return { error: errorMsg };
    }

    await dbConnect();
    const payload = { ...validation.data };

    // Clean budget variables if not a seeker
    if (!payload.isActiveSeeker) {
      payload.budgetMin = undefined;
      payload.budgetMax = undefined;
      payload.preferredLocations = [];
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return { error: "User not found or update failed." };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/edit");

    return { success: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("editProfile error:", error);
    return { error: error.message || "An unexpected error occurred" };
  }
}

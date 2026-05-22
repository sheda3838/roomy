"use server";

import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { onboardingSchema, type OnboardingInput } from "@/server/validations/onboarding";


export async function completeOnboarding(data: OnboardingInput) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return { error: "You must be logged in to complete onboarding." };
    }

    // 2. Validate input schema
    const validation = onboardingSchema.safeParse(data);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((err) => err.message).join(", ");
      return { error: `Validation failed: ${errorMsg}` };
    }

    const validatedData = validation.data;

    // 3. Connect to database
    await dbConnect();

    // 4. Update User document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        gender: validatedData.gender,
        roleType: validatedData.roleType,
        cleanlinessLevel: validatedData.cleanlinessLevel,
        sleepType: validatedData.sleepType,
        smoker: validatedData.smoker,
        drinker: validatedData.drinker,
        guestPolicy: validatedData.guestPolicy,
        isActiveSeeker: validatedData.isActiveSeeker,
        preferredLocations: validatedData.preferredLocations,
        budgetMin: validatedData.budgetMin,
        budgetMax: validatedData.budgetMax,
        isOnboardingComplete: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return { error: "User account could not be found." };
    }

    return { success: "Onboarding completed successfully!" };
  } catch (error: any) {
    console.error("completeOnboarding Server Action error:", error);
    return { error: error.message || "An unexpected error occurred during onboarding." };
  }
}

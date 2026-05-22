"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";

export async function verifyEmailToken(token: string) {
  if (!token) {
    return { error: "Verification token is missing." };
  }

  try {
    await dbConnect();

    // Locate the token document
    const existingToken = await VerificationToken.findOne({ token });

    if (!existingToken) {
      return { error: "Verification token is invalid or has expired." };
    }

    // Check expiration state
    const hasExpired = new Date() > new Date(existingToken.expires);

    if (hasExpired) {
      await VerificationToken.deleteOne({ token });
      return { error: "Verification token has expired." };
    }

    // Locate the associated user account
    const user = await User.findOne({ email: existingToken.email });

    if (!user) {
      return { error: "Associated user account could not be found." };
    }

    // Update verification flags on user document
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    // Delete the token since it has been consumed
    await VerificationToken.deleteOne({ token });

    return { success: "Email verified successfully!" };
  } catch (error: any) {
    console.error("verifyEmailToken Server Action error:", error);
    return { error: error.message || "An unexpected error occurred during verification." };
  }
}

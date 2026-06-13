"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateVerificationToken } from "@/server/services/verificationToken";
import { sendVerificationEmail } from "@/server/services/email";

export async function registerUser(formData: {
  fullName?: string;
  email?: string;
  password?: string;
}) {
  const { fullName, email, password } = formData;

  // Basic validation checks
  if (!fullName || !email || !password) {
    return { error: "Please enter your name, email, and password." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    await dbConnect();
    
    // Check if the user email is already registered
    const formattedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: formattedEmail });

    if (existingUser) {
      return { error: "An account with this email already exists." };
    }

    // Securely hash credentials password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the User record in MongoDB
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: formattedEmail,
      password: hashedPassword,
      authProvider: "credentials",
      emailVerified: false,
      isOnboardingComplete: false,
    });

    // Generate validation token
    const verificationToken = await generateVerificationToken(newUser.email);

    // Send confirmation link
    const emailResult = await sendVerificationEmail(newUser.email, verificationToken.token);

    if (!emailResult.success) {
      // Log error but proceed since user was successfully written
      console.error("Error sending verification email to new user:", emailResult.error);
      return { 
        error: `Account created successfully, but we encountered an issue sending the verification email: ${emailResult.error}. Note: Since we are using the Resend sandbox, you can only send emails to the verified sender address. Please verify your domain in Resend or use the verified email address.` 
      };
    }

    return { 
      success: "Registration successful! A verification email has been sent to your address." 
    };
  } catch (error: unknown) {
    console.error("Registration Server Action error:", error);
    return { error: (error instanceof Error ? error.message : String(error)) || "An unexpected error occurred during registration." };
  }
}

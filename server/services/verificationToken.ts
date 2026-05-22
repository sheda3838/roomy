import crypto from "crypto";
import dbConnect from "@/lib/db";
import VerificationToken from "@/models/VerificationToken";

export async function generateVerificationToken(email: string) {
  // Generate secure random 32-byte hex string
  const token = crypto.randomBytes(32).toString("hex");
  
  // Expire token in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await dbConnect();
  
  // Delete any existing tokens associated with this email address
  await VerificationToken.deleteOne({ email });

  // Create new token entry
  const verificationToken = await VerificationToken.create({
    email,
    token,
    expires,
  });

  return verificationToken;
}

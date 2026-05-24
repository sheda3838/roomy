import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import RoommateRequest from "../models/RoommateRequest";
import Connection from "../models/Connection";
import User from "../models/User";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    return;
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const requestId = "6a11ef23d6dcbcd5e75c990b";
  
  // Update request status back to pending
  await RoommateRequest.findByIdAndUpdate(requestId, { status: "pending" });
  console.log("Request status reset to pending");

  // Delete the roommate-to-roommate connection
  const delConnectionRes = await Connection.deleteMany({
    users: { $all: ["6a10c4a82775b6d9d1d9cd12", "6a10aecd88b49b632916d4cb"] },
    roomId: { $exists: false } // Only delete the roommate connection, not room ones
  });
  console.log("Deleted connections count:", delConnectionRes.deletedCount);

  // Pull the connection ID from users' connection arrays if we can find any
  // But since we deleted them, we can also just clear all connections from user lists or keep them clean
  // Let's print users' current connection IDs
  const users = await User.find({ _id: { $in: ["6a10c4a82775b6d9d1d9cd12", "6a10aecd88b49b632916d4cb"] } });
  for (const u of users) {
    console.log(`User ${u.fullName} connectionIds:`, u.connectionIds);
  }

  await mongoose.disconnect();
}

main().catch(console.error);

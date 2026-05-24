import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  const dbConnect = (await import("../lib/db")).default;
  const Connection = (await import("../models/Connection")).default;
  const User = (await import("../models/User")).default;

  await dbConnect();
  console.log("Connected to MongoDB");

  const connections = await Connection.find({ isActive: true }).lean();
  console.log(`Found ${connections.length} active connections:`);

  for (const conn of connections) {
    console.log(`\nConnection ID: ${conn._id}`);
    console.log(`Users array:`, conn.users);
    console.log(`Room ID:`, conn.roomId);

    for (const userId of conn.users) {
      const user = await User.findById(userId).lean();
      if (user) {
        console.log(` - User ID ${userId}: fullName="${user.fullName}", profilePicture="${user.profilePicture}"`);
      } else {
        console.log(` - User ID ${userId}: NOT FOUND IN USER DB!`);
      }
    }
  }
}

run().catch(console.error);

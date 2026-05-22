/**
 * Roomy Seed Script
 * Run with: npx ts-node --project tsconfig.json scripts/seed.ts
 * (Requires ts-node and dotenv to be installed or run via next/env loader)
 * 
 * Or compile first:
 *   npx tsx scripts/seed.ts
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import path from "path";

// Load .env.local environment variables
config({ path: path.resolve(process.cwd(), ".env.local") });

// ---------------------------------------------------------------------------
// Inline Mongoose models (to avoid Next.js-specific imports like @/ aliases)
// ---------------------------------------------------------------------------

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    profilePicture: { type: String },
    authProvider: { type: String, enum: ["google", "credentials"], required: true },
    emailVerified: { type: Boolean, default: false, required: true },
    emailVerifiedAt: { type: Date },
    gender: { type: String, enum: ["male", "female"] },
    roleType: { type: String, enum: ["student", "worker"] },
    cleanlinessLevel: { type: String, enum: ["low", "medium", "high"] },
    sleepType: { type: String, enum: ["early", "night_owl"] },
    smoker: { type: Boolean },
    drinker: { type: Boolean },
    guestPolicy: { type: String, enum: ["no", "often", "regular"] },
    isActiveSeeker: { type: Boolean, default: false, required: true },
    preferredLocations: { type: [String], default: [] },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    isOnboardingComplete: { type: Boolean, default: false, required: true },
    connectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    locationText: { type: String, required: true, trim: true },
    coordinates: { lat: { type: Number }, lng: { type: Number } },
    rentAmount: { type: Number, required: true, min: 0 },
    deposit: { type: Number, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    occupantIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    occupantsCount: { type: Number, default: 0, required: true },
    cleanlinessExpectation: { type: String, enum: ["low", "medium", "high"], required: true },
    smokerAllowed: { type: Boolean, required: true },
    drinkerAllowed: { type: Boolean, required: true },
    guestPolicy: { type: String, enum: ["no", "often", "regular"], required: true },
    curfewTime: { from: { type: String }, to: { type: String } },
    genderPreference: { type: String, enum: ["male", "female", "any"], default: "any", required: true },
    isActive: { type: Boolean, default: true, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSlug(title: string, suffix: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-" + suffix;
}

// ---------------------------------------------------------------------------
// Seed Data
// ---------------------------------------------------------------------------

const SEED_USERS = [
  {
    fullName: "Kavishka Perera",
    email: "kavishka@seed.roomy.lk",
    gender: "male",
    roleType: "student",
    cleanlinessLevel: "high",
    sleepType: "early",
    smoker: false,
    drinker: false,
    guestPolicy: "often",
    isActiveSeeker: true,
    preferredLocations: ["Colombo", "Colombo 07"],
    budgetMin: 10000,
    budgetMax: 20000,
  },
  {
    fullName: "Aisha Fernando",
    email: "aisha@seed.roomy.lk",
    gender: "female",
    roleType: "worker",
    cleanlinessLevel: "medium",
    sleepType: "night_owl",
    smoker: false,
    drinker: true,
    guestPolicy: "regular",
    isActiveSeeker: true,
    preferredLocations: ["Kandy", "Peradeniya"],
    budgetMin: 15000,
    budgetMax: 30000,
  },
  {
    fullName: "Roshan De Silva",
    email: "roshan@seed.roomy.lk",
    gender: "male",
    roleType: "worker",
    cleanlinessLevel: "low",
    sleepType: "night_owl",
    smoker: true,
    drinker: true,
    guestPolicy: "regular",
    isActiveSeeker: false,
    preferredLocations: ["Galle", "Matara"],
    budgetMin: 8000,
    budgetMax: 15000,
  },
  {
    fullName: "Dilini Jayawardena",
    email: "dilini@seed.roomy.lk",
    gender: "female",
    roleType: "student",
    cleanlinessLevel: "high",
    sleepType: "early",
    smoker: false,
    drinker: false,
    guestPolicy: "no",
    isActiveSeeker: true,
    preferredLocations: ["Nugegoda", "Maharagama"],
    budgetMin: 12000,
    budgetMax: 22000,
  },
  {
    fullName: "Tharindu Wickrama",
    email: "tharindu@seed.roomy.lk",
    gender: "male",
    roleType: "student",
    cleanlinessLevel: "medium",
    sleepType: "night_owl",
    smoker: false,
    drinker: false,
    guestPolicy: "often",
    isActiveSeeker: true,
    preferredLocations: ["Colombo 03", "Colombo 05"],
    budgetMin: 18000,
    budgetMax: 35000,
  },
];

const SEED_ROOMS = [
  {
    title: "Cozy Single Room in Colombo 07",
    description: "A quiet and clean single room in the heart of Colombo 07. Perfect for students or young professionals.",
    locationText: "Colombo 07",
    rentAmount: 18000,
    deposit: 36000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Shared Apartment Near University of Colombo",
    description: "Spacious shared flat with 3 rooms available. Close to all amenities and university campuses.",
    locationText: "Colombo 03",
    rentAmount: 12000,
    deposit: 24000,
    capacity: 3,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "often" as const,
    genderPreference: "male" as const,
  },
  {
    title: "Modern Studio in Kandy City Centre",
    description: "A newly renovated studio apartment with all furniture included. Walking distance to Kandy lake.",
    locationText: "Kandy",
    rentAmount: 22000,
    deposit: 44000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "female" as const,
  },
  {
    title: "Budget Room in Nugegoda",
    description: "Affordable, no-frills room available for a working professional. Close to bus route.",
    locationText: "Nugegoda",
    rentAmount: 9500,
    deposit: 19000,
    capacity: 1,
    cleanlinessExpectation: "low" as const,
    smokerAllowed: true,
    drinkerAllowed: true,
    guestPolicy: "regular" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Large Room in Galle Fort Area",
    description: "Spacious room in a colonial house near Galle Fort. Great views, ideal for remote workers.",
    locationText: "Galle",
    rentAmount: 14000,
    deposit: 28000,
    capacity: 2,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "often" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Premium Room in Rajagiriya",
    description: "Fully furnished premium room with AC, high-speed Wi-Fi and gym access.",
    locationText: "Rajagiriya",
    rentAmount: 35000,
    deposit: 70000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Room for Female Students - Peradeniya",
    description: "Safe and quiet room for female students near the University of Peradeniya.",
    locationText: "Peradeniya",
    rentAmount: 8000,
    deposit: 16000,
    capacity: 2,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "female" as const,
  },
  {
    title: "Shared House near Maharagama Junction",
    description: "4-bedroom shared house with a large common area and kitchen. Ideal for workers.",
    locationText: "Maharagama",
    rentAmount: 11000,
    deposit: 22000,
    capacity: 4,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "often" as const,
    genderPreference: "male" as const,
  },
  {
    title: "Quiet Room in Battaramulla",
    description: "Peaceful single room in a residential neighborhood. Suitable for a working professional.",
    locationText: "Battaramulla",
    rentAmount: 17500,
    deposit: 35000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "often" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Night Owl Friendly Flat in Colombo 05",
    description: "A laid-back flat popular with young professionals. Flexible lifestyle, no curfew.",
    locationText: "Colombo 05",
    rentAmount: 20000,
    deposit: 40000,
    capacity: 2,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "regular" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Affordable Room in Matara",
    description: "Clean and tidy room in a well-maintained house near Matara town center.",
    locationText: "Matara",
    rentAmount: 7500,
    deposit: 15000,
    capacity: 1,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Luxury Flat Share in Colombo 02",
    description: "Upscale 2-bedroom apartment with a rooftop pool and gym. One room available.",
    locationText: "Colombo 02",
    rentAmount: 55000,
    deposit: 110000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "often" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Worker-Friendly House in Negombo",
    description: "Practical shared house close to the industrial zone and airport. Good for daily commuters.",
    locationText: "Negombo",
    rentAmount: 10000,
    deposit: 20000,
    capacity: 3,
    cleanlinessExpectation: "low" as const,
    smokerAllowed: true,
    drinkerAllowed: true,
    guestPolicy: "regular" as const,
    genderPreference: "male" as const,
  },
  {
    title: "Single Room - Nawala",
    description: "Small but comfortable room in a family house. Meals can be arranged separately.",
    locationText: "Nawala",
    rentAmount: 13000,
    deposit: 26000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Shared Flat near Wijerama Junction",
    description: "2-bedroom flat with an open-plan kitchen and fast broadband. Perfect for remote workers.",
    locationText: "Wijerama",
    rentAmount: 25000,
    deposit: 50000,
    capacity: 2,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "often" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Room for Students - Kelaniya",
    description: "Affordable room near the University of Kelaniya. Popular with first-year students.",
    locationText: "Kelaniya",
    rentAmount: 7000,
    deposit: 14000,
    capacity: 2,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Modern Room in Mount Lavinia",
    description: "Beautifully furnished room near the beach. Great for anyone who loves the sea.",
    locationText: "Mount Lavinia",
    rentAmount: 21000,
    deposit: 42000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "often" as const,
    genderPreference: "any" as const,
  },
  {
    title: "Large Shared Room - Dehiwala",
    description: "Spacious room available in a shared house. Ideal for two friends sharing together.",
    locationText: "Dehiwala",
    rentAmount: 9000,
    deposit: 18000,
    capacity: 2,
    cleanlinessExpectation: "low" as const,
    smokerAllowed: true,
    drinkerAllowed: true,
    guestPolicy: "regular" as const,
    genderPreference: "male" as const,
  },
  {
    title: "Quiet Female-Only Room in Kotte",
    description: "Well-maintained room in a secure, quiet residential area. Female occupants only.",
    locationText: "Kotte",
    rentAmount: 16000,
    deposit: 32000,
    capacity: 1,
    cleanlinessExpectation: "high" as const,
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no" as const,
    genderPreference: "female" as const,
  },
  {
    title: "Vibrant Shared Apartment - Bambalapitiya",
    description: "Fun, social flat in a prime location. Great for outgoing young professionals.",
    locationText: "Colombo 04",
    rentAmount: 30000,
    deposit: 60000,
    capacity: 3,
    cleanlinessExpectation: "medium" as const,
    smokerAllowed: false,
    drinkerAllowed: true,
    guestPolicy: "regular" as const,
    genderPreference: "any" as const,
  },
];

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in .env.local");
  }

  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.");

  // Wipe existing seed data (identified by email ending in @seed.roomy.lk)
  await User.deleteMany({ email: /@seed\.roomy\.lk$/ });
  // Wipe all existing rooms (clean slate for seed)
  await Room.deleteMany({});

  console.log("🗑️  Cleared existing seed data.");

  // Create Users
  const hashedPassword = await bcrypt.hash("SeedPass123!", 10);
  const createdUsers: any[] = [];

  for (const u of SEED_USERS) {
    const user = await User.create({
      ...u,
      password: hashedPassword,
      authProvider: "credentials",
      emailVerified: true,
      emailVerifiedAt: new Date(),
      isOnboardingComplete: true,
    });
    createdUsers.push(user);
    console.log(`  👤 Created user: ${u.fullName} (${u.email})`);
  }

  // Create Rooms – rotate ownership among seed users
  for (let i = 0; i < SEED_ROOMS.length; i++) {
    const roomData = SEED_ROOMS[i];
    const owner = createdUsers[i % createdUsers.length];
    const slug = generateSlug(roomData.title, String(i).padStart(3, "0"));

    await Room.create({
      ...roomData,
      ownerId: owner._id,
      occupantIds: [],
      occupantsCount: 0,
      isActive: true,
      slug,
    });

    console.log(`  🏠 Created room: ${roomData.title} (${slug})`);
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log(`   Users created : ${createdUsers.length}`);
  console.log(`   Rooms created : ${SEED_ROOMS.length}`);

  await mongoose.disconnect();
  console.log("🔌 Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

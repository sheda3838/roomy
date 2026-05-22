import { calculateRoomMatch, filterEligibleRooms } from "../server/services/calculateRoomMatch";

const mockUser = {
  gender: "male",
  cleanlinessLevel: "medium",
  smoker: false,
  drinker: false,
  guestPolicy: "regular",
  preferredLocations: ["Colombo", "Kandy"],
  budgetMin: 10000,
  budgetMax: 20000,
} as any;

const mockRooms = [
  {
    _id: "room1",
    title: "Perfect Room",
    genderPreference: "any",
    occupantsCount: 1,
    capacity: 2,
    rentAmount: 15000,
    isActive: true,
    cleanlinessExpectation: "medium",
    smokerAllowed: true,
    drinkerAllowed: true,
    guestPolicy: "regular",
    locationText: "Colombo 07",
    createdAt: new Date(),
  },
  {
    _id: "room2",
    title: "Female Only Room",
    genderPreference: "female",
    occupantsCount: 0,
    capacity: 2,
    rentAmount: 18000,
    isActive: true,
    cleanlinessExpectation: "high",
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "no",
    locationText: "Colombo",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "room3",
    title: "Expensive Room",
    genderPreference: "any",
    occupantsCount: 1,
    capacity: 2,
    rentAmount: 50000,
    isActive: true,
    cleanlinessExpectation: "medium",
    smokerAllowed: false,
    drinkerAllowed: false,
    guestPolicy: "often",
    locationText: "Galle",
    createdAt: new Date(),
  }
] as any[];

async function runTest() {
  console.log("=== Matching Engine Verification ===");
  
  const eligible = filterEligibleRooms(mockUser, mockRooms);
  console.log(`Eligible Rooms count: ${eligible.length} (Expected 2, room2 is female only)`);
  
  for (const room of eligible) {
    const result = calculateRoomMatch(mockUser, room);
    console.log(`\nRoom: ${result.room.title}`);
    console.log(`Score: ${result.score}`);
    console.log(`Reasons:`);
    result.reasons.forEach(r => console.log(` - ${r}`));
  }
}

runTest();

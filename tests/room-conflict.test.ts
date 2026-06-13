import { describe, it, expect } from "vitest";
import { calculateRoomMatch } from "../server/services/calculateRoomMatch";

// Seeded Data: u10 (Hasini) and Room 3 ("Premium Men's Worker Hostel")
// Hasini: female, student, low clean, night owl, smoker, drinker, regular guests, Colombo 06, 30k-40k budget, [kitchen, laundry]
// Room 3: Colombo 05, 45k rent, high clean, no smoking/drinking, no guests, male, worker
const user10 = {
  _id: "u10_mock_id",
  fullName: "Hasini Dissanayake",
  gender: "female",
  roleType: "student",
  cleanlinessLevel: "low",
  sleepType: "night_owl",
  smoker: true,
  drinker: true,
  guestPolicy: "regular",
  preferredLocations: ["Colombo 06"],
  preferredFacilities: ["kitchen_access", "laundry"],
  budgetMin: 30000,
  budgetMax: 40000,
};

const room3 = {
  _id: "r3_mock_id",
  title: "Premium Men's Worker Hostel",
  locationText: "Colombo 05",
  rentAmount: 45000,
  capacity: 8,
  currentOccupants: 3,
  occupantsCount: 0,
  cleanlinessExpectation: "high",
  smokerAllowed: false,
  drinkerAllowed: false,
  guestPolicy: "no",
  genderPreference: "male",
  occupationPreference: "worker",
  providedFacilities: [
    "parking",
    "air_conditioning",
    "hot_water",
    "attached_washroom",
    "own_cupboard",
    "bed_provided",
  ],
  isActive: true,
  slug: "premium-mens-worker-colombo-05",
};

describe("Room Compatibility Engine - Conflict Match", () => {
  it("Should calculate a very low compatibility score for a completely mismatched room", () => {
    const result = calculateRoomMatch(user10 as any, room3 as any);

    // Score should be very low (below 40) because almost every metric is mismatched.
    // Over budget, wrong location, smoker in non-smoking room, drinker in non-drinking room, wrong gender, wrong occupation
    expect(result.score).toBeLessThan(40);

    expect(result.reasons).toContain("Gender mismatch");
    expect(result.reasons).toContain("Slightly over your budget max");
  });
});

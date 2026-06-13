import { describe, it, expect } from "vitest";
import { calculateRoomMatch } from "../server/services/calculateRoomMatch";

// Seeded Data: u5 (Nuwan) and Room 1 ("Cozy Shared Room for Students")
// Nuwan: student, high clean, non-smoker, non-drinker, no guest, male, colombo 03, 15k-25k budget, [study table, bed, ac]
// Room 1: Colombo 03, 20k rent, high clean, no smoking/drinking, no guests, male, student, [study table, bed, ac, washroom]
const user5 = {
  _id: "u5_mock_id",
  fullName: "Nuwan Jayasuriya",
  gender: "male",
  roleType: "student",
  cleanlinessLevel: "high",
  sleepType: "early",
  smoker: false,
  drinker: false,
  guestPolicy: "no",
  preferredLocations: ["Colombo 03", "Colombo 04"],
  preferredFacilities: ["study_table", "bed_provided", "air_conditioning"],
  budgetMin: 15000,
  budgetMax: 25000,
};

const room1 = {
  _id: "r1_mock_id",
  title: "Cozy Shared Room for Students",
  locationText: "Colombo 03",
  rentAmount: 20000,
  capacity: 2,
  currentOccupants: 1,
  occupantsCount: 0,
  cleanlinessExpectation: "high",
  smokerAllowed: false,
  drinkerAllowed: false,
  guestPolicy: "no",
  genderPreference: "male",
  occupationPreference: "student",
  providedFacilities: [
    "study_table",
    "bed_provided",
    "air_conditioning",
    "attached_washroom",
  ],
  isActive: true,
  slug: "cozy-shared-room-colombo-03",
};

describe("Room Compatibility Engine - Perfect Match", () => {
  it("Should calculate a very high compatibility score for a perfect room fit", () => {
    const result = calculateRoomMatch(user5 as any, room1 as any);

    // Score should be 100 because the room fulfills everything:
    // Location match, budget perfectly within bounds, exactly matching facilities, and identical strict lifestyle policies.
    expect(result.score).toBeGreaterThanOrEqual(95);

    expect(result.reasons).toContain("Perfect cleanliness match");
    expect(result.reasons).toContain("Both prefer non-smoking");
    expect(result.reasons).toContain("Both prefer no drinking");
    expect(result.reasons).toContain("Aligned on guest policies");
    expect(result.reasons).toContain("Within your budget");
    expect(result.reasons).toContain("Matches preferred location: Colombo 03");
  });
});

import { describe, it, expect } from "vitest";
import { calculatePeopleMatch } from "../server/actions/calculatePeopleMatch";

// Seeded Data: u1 (Kasun) and u7 (Thilina)
// Kasun: High clean, early bird, non-smoker, non-drinker, no guests, Colombo 03/04
// Thilina: Low clean, night owl, smoker, drinker, regular guests, Colombo 05/06
const user1 = {
  _id: "u1_mock_id",
  fullName: "Kasun Perera",
  gender: "male",
  roleType: "student",
  cleanlinessLevel: "high",
  sleepType: "early",
  smoker: false,
  drinker: false,
  guestPolicy: "no",
  preferredLocations: ["Colombo 03", "Colombo 04"],
  preferredFacilities: [
    "study_table",
    "bed_provided",
    "attached_washroom",
    "air_conditioning",
  ],
  budgetMin: 15000,
  budgetMax: 25000,
};

const user7 = {
  _id: "u7_mock_id",
  fullName: "Thilina Wijesinghe",
  gender: "male",
  roleType: "student",
  cleanlinessLevel: "low",
  sleepType: "night_owl",
  smoker: true,
  drinker: true,
  guestPolicy: "regular",
  preferredLocations: ["Colombo 05", "Colombo 06"],
  preferredFacilities: ["bed_provided", "meals_provided"],
  budgetMin: 10000,
  budgetMax: 20000,
};

describe("Roommate Compatibility Engine - Conflict Match", () => {
  it("Should calculate a very low compatibility score for completely mismatched profiles", () => {
    const result = calculatePeopleMatch(user1 as any, user7 as any);

    // Score should be very low (below 50) because they conflict on almost every lifestyle metric
    // Only gender, role, and a slight budget overlap keep it above 0.
    expect(result.score).toBeLessThan(50);

    // Verify it positively identified the conflicts
    expect(result.conflicts).toContain("Cleanliness conflict (high vs low)");
    expect(result.conflicts).toContain("Smoking preference conflict");
    expect(result.conflicts).toContain("Drinking preference conflict");
    expect(result.conflicts).toContain("Guest policy conflict (no vs regular)");
    expect(result.conflicts).toContain("Different sleep schedules");
    expect(result.conflicts).toContain(
      "Looking for rooms in completely different areas or missing location preferences",
    );
  });
});

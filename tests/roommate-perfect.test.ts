import { describe, it, expect } from "vitest";
import { calculatePeopleMatch } from "../server/actions/calculatePeopleMatch";

// Seeded Data: u1 (Kasun) and u5 (Nuwan)
// Both are male students looking for rooms in Colombo 03/04 with exactly identical lifestyle habits
// (high cleanliness, early sleep, non-smokers, non-drinkers, no guests) and identical budget bounds (15k-25k).
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

describe("Roommate Compatibility Engine - Perfect Match", () => {
  it("Should calculate an extremely high compatibility score for two identical profiles", () => {
    const result = calculatePeopleMatch(user1 as any, user5 as any);

    // Score should be near perfect (100) because they share exact budget, lifestyle, location and mostly identical facilities
    expect(result.score).toBeGreaterThan(90);

    // Verify no significant conflicts are generated
    expect(result.conflicts).toHaveLength(0);

    // Verify it positively identified lifestyle alignments
    expect(result.reasons).toContain("Perfect cleanliness match (high)");
    expect(result.reasons).toContain("Both prefer non-smoking");
    expect(result.reasons).toContain("Both prefer no drinking");
    expect(result.reasons).toContain("Budgets are highly aligned");
  });
});

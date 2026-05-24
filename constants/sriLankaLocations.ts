export interface ProvinceGroup {
  province: string;
  locations: string[];
}

export const SRI_LANKA_PROVINCES: ProvinceGroup[] = [
  {
    province: "Western Province",
    locations: [
      "Colombo 01",
      "Colombo 02",
      "Colombo 03",
      "Colombo 04",
      "Colombo 05",
      "Colombo 06",
      "Colombo 07",
      "Colombo 08",
      "Colombo 09",
      "Colombo 10",
      "Colombo 11",
      "Colombo 12",
      "Colombo 13",
      "Colombo 14",
      "Colombo 15",
      "Gampaha",
      "Kalutara",
    ],
  },
  {
    province: "Central Province",
    locations: ["Kandy", "Matale", "Nuwara Eliya"],
  },
  {
    province: "Southern Province",
    locations: ["Galle", "Hambantota", "Matara"],
  },
  {
    province: "Eastern Province",
    locations: ["Ampara", "Batticaloa", "Trincomalee"],
  },
  {
    province: "Northern Province",
    locations: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  },
  {
    province: "North Western Province",
    locations: ["Kurunegala", "Puttalam"],
  },
  {
    province: "North Central Province",
    locations: ["Anuradhapura", "Polonnaruwa"],
  },
  {
    province: "Uva Province",
    locations: ["Badulla", "Monaragala"],
  },
  {
    province: "Sabaragamuwa Province",
    locations: ["Kegalle", "Ratnapura"],
  },
];

// Flat array of all locations for quick lookups and validation
export const ALL_SRI_LANKA_LOCATIONS = SRI_LANKA_PROVINCES.flatMap((p) => p.locations);

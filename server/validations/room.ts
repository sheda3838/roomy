import { z } from "zod";

export const createRoomSchema = z.object({
  title: z
    .string({ message: "Title is required." })
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title is too long."),
  description: z
    .string({ message: "Description is required." })
    .min(10, "Description must be at least 10 characters."),
  images: z.array(z.string().url("Invalid image URL format.")).min(1, "Please upload at least one image."),
  locationText: z
    .string({ message: "Location text is required." })
    .min(1, "Location is required."),
  coordinates: z.object({
    lat: z.number({ message: "Please select a location on the map." }),
    lng: z.number({ message: "Please select a location on the map." }),
  }, { message: "Please select a location on the map." }),
  rentAmount: z.coerce
    .number({ message: "Rent amount is required." })
    .min(0, "Rent amount cannot be negative."),
  deposit: z.coerce.number().min(0, "Deposit cannot be negative.").optional(),
  capacity: z.coerce
    .number({ message: "Capacity is required." })
    .min(1, "Capacity must be at least 1 occupants."),
  cleanlinessExpectation: z.enum(["low", "medium", "high"], {
    message: "Please select cleanliness expectation.",
  }),
  smokerAllowed: z.boolean({
    message: "Please specify if smokers are allowed.",
  }),
  drinkerAllowed: z.boolean({
    message: "Please specify if drinkers are allowed.",
  }),
  guestPolicy: z.enum(["no", "often", "regular"], {
    message: "Please specify guest policy.",
  }),
  curfewTime: z
    .object({
      from: z.string().trim().optional(),
      to: z.string().trim().optional(),
    })
    .optional(),
  genderPreference: z.enum(["male", "female", "any"], {
    message: "Please select gender preference.",
  }),
  amenities: z.array(z.string()).default([]),
});

export const editRoomSchema = createRoomSchema.partial();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type EditRoomInput = z.infer<typeof editRoomSchema>;

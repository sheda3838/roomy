import { z } from "zod";
import { onboardingSchema } from "./onboarding";

export const editProfileSchema = onboardingSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(60, "Name is too long"),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;

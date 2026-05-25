import { z } from "zod";

export const onboardingSchema = z
  .object({
    gender: z.enum(["male", "female"], {
      message: "Please select your gender.",
    }),
    roleType: z.enum(["student", "worker"], {
      message: "Please select your current role.",
    }),
    cleanlinessLevel: z.enum(["low", "medium", "high"], {
      message: "Please select your cleanliness level.",
    }),
    sleepType: z.enum(["early", "night_owl"], {
      message: "Please select your sleep pattern.",
    }),
    smoker: z.boolean({
      message: "Please indicate if you smoke.",
    }),
    drinker: z.boolean({
      message: "Please indicate if you drink.",
    }),
    guestPolicy: z.enum(["no", "often", "regular"], {
      message: "Please select your guest policy.",
    }),
    isActiveSeeker: z.boolean({
      message: "Please indicate your seeker status.",
    }),
    preferredLocations: z
      .array(z.string().min(1, "Location name cannot be empty"))
      .default([]),
    budgetMin: z.coerce.number().min(0, "Budget cannot be negative").optional(),
    budgetMax: z.coerce.number().min(0, "Budget cannot be negative").optional(),
    profilePicture: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isActiveSeeker) {
        return data.budgetMin !== undefined && data.budgetMin !== null;
      }
      return true;
    },
    {
      message: "Minimum budget is required when actively seeking.",
      path: ["budgetMin"],
    }
  )
  .refine(
    (data) => {
      if (data.isActiveSeeker) {
        return data.budgetMax !== undefined && data.budgetMax !== null;
      }
      return true;
    },
    {
      message: "Maximum budget is required when actively seeking.",
      path: ["budgetMax"],
    }
  )
  .refine(
    (data) => {
      if (
        data.isActiveSeeker &&
        data.budgetMin !== undefined &&
        data.budgetMax !== undefined &&
        data.budgetMin !== null &&
        data.budgetMax !== null
      ) {
        return data.budgetMax >= data.budgetMin;
      }
      return true;
    },
    {
      message: "Maximum budget must be greater than or equal to minimum budget.",
      path: ["budgetMax"],
    }
  )
  .refine(
    (data) => {
      if (data.isActiveSeeker) {
        return data.preferredLocations.length > 0;
      }
      return true;
    },
    {
      message: "At least one preferred location is required when looking for a room.",
      path: ["preferredLocations"],
    }
  );

export type OnboardingInput = z.infer<typeof onboardingSchema>;

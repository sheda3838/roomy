import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  // Identity
  fullName: string;
  email: string;
  password?: string; // Nullable for Google OAuth users
  profilePicture?: string;

  
  // Authentication
  authProvider: "google" | "credentials";
  emailVerified: boolean;
  emailVerifiedAt?: Date;

  // Demographics
  gender?: "male" | "female";
  roleType?: "student" | "worker";

  // Lifestyle
  cleanlinessLevel?: "low" | "medium" | "high";
  sleepType?: "early" | "night_owl";
  smoker?: boolean;
  drinker?: boolean;
  guestPolicy?: "no" | "often" | "regular";

  // Preferences
  isActiveSeeker: boolean;
  preferredLocations: string[];
  preferredFacilities: string[];
  budgetMin?: number;
  budgetMax?: number;

  // System
  isOnboardingComplete: boolean;

  // Connections
  connectionIds: mongoose.Types.ObjectId[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // Identity
    fullName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String }, // optional for oauth
    profilePicture: { type: String },

    // Authentication
    authProvider: { 
      type: String, 
      enum: ["google", "credentials"], 
      required: true 
    },
    emailVerified: { type: Boolean, default: false, required: true },
    emailVerifiedAt: { type: Date },

    // Demographics
    gender: { type: String, enum: ["male", "female"] },
    roleType: { type: String, enum: ["student", "worker"] },

    // Lifestyle
    cleanlinessLevel: { type: String, enum: ["low", "medium", "high"] },
    sleepType: { type: String, enum: ["early", "night_owl"] },
    smoker: { type: Boolean },
    drinker: { type: Boolean },
    guestPolicy: { type: String, enum: ["no", "often", "regular"] },

    // Preferences
    isActiveSeeker: { type: Boolean, default: false, required: true },
    preferredLocations: { type: [String], default: [] },
    preferredFacilities: { type: [String], default: [] },
    budgetMin: { type: Number },
    budgetMax: { type: Number },

    // System
    isOnboardingComplete: { type: Boolean, default: false, required: true },

    // Connections
    connectionIds: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { 
    timestamps: true 
  }
);

// Prevent re-compilation of model in hot reloading development modes
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

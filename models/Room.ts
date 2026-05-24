import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoom extends Document {
  title: string;
  description: string;
  images: string[];
  ownerId: mongoose.Types.ObjectId;
  locationText: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  rentAmount: number;
  deposit?: number;
  capacity: number;
  occupantIds: mongoose.Types.ObjectId[];
  occupantsCount: number;
  
  // Room Rules / Matching Traits
  cleanlinessExpectation: "low" | "medium" | "high";
  smokerAllowed: boolean;
  drinkerAllowed: boolean;
  guestPolicy: "no" | "often" | "regular";
  curfewTime?: {
    from: string;
    to: string;
  };
  genderPreference: "male" | "female" | "any";
  amenities?: string[];

  // System Fields
  isActive: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}


const RoomSchema = new Schema<IRoom>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    locationText: { type: String, required: true, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    rentAmount: { type: Number, required: true, min: 0 },
    deposit: { type: Number, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    occupantIds: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    occupantsCount: { type: Number, default: 0, required: true },
    
    // Room Rules
    cleanlinessExpectation: { 
      type: String, 
      enum: ["low", "medium", "high"], 
      required: true 
    },
    smokerAllowed: { type: Boolean, required: true },
    drinkerAllowed: { type: Boolean, required: true },
    guestPolicy: { 
      type: String, 
      enum: ["no", "often", "regular"], 
      required: true 
    },
    curfewTime: {
      from: { type: String, trim: true },
      to: { type: String, trim: true },
    },
    genderPreference: { 
      type: String, 
      enum: ["male", "female", "any"], 
      default: "any", 
      required: true 
    },
    amenities: { type: [String], default: [] },

    // System Fields
    isActive: { type: Boolean, default: true, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { 
    timestamps: true 
  }
);

// Auto-sync occupantsCount when occupantIds modifications occur on document save
RoomSchema.pre("save", function (this: any) {
  if (this.isModified("occupantIds")) {
    this.occupantsCount = this.occupantIds.length;
  }
});

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);

export default Room;

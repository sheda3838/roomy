import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerificationToken extends Document {
  email: string;
  token: string;
  expires: Date;
  createdAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false } 
  }
);

// Create TTL Index for automatic cleanup of expired tokens
// MongoDB deletes documents when the current time is past 'expires'
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const VerificationToken: Model<IVerificationToken> = 
  mongoose.models.VerificationToken || 
  mongoose.model<IVerificationToken>("VerificationToken", VerificationTokenSchema);

export default VerificationToken;

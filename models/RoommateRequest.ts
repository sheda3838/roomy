import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoommateRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoommateRequestSchema = new Schema<IRoommateRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
      required: true,
    },
    message: { type: String, maxlength: 500 },
  },
  {
    timestamps: true,
  }
);

// Prevent spam requests - a user can only have one active/pending request to another user
RoommateRequestSchema.index(
  { requesterId: 1, receiverId: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["pending", "accepted"] } } }
);

const RoommateRequest: Model<IRoommateRequest> =
  mongoose.models.RoommateRequest || mongoose.model<IRoommateRequest>("RoommateRequest", RoommateRequestSchema);

export default RoommateRequest;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRoomRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  type: "join_room";
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const RoomRequestSchema = new Schema<IRoomRequest>(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    type: { 
      type: String, 
      enum: ["join_room"], 
      default: "join_room", 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending", 
      required: true 
    },
  },
  { 
    timestamps: true 
  }
);

// Optimize queries searching requests by user and room context
RoomRequestSchema.index({ roomId: 1 });
RoomRequestSchema.index({ fromUserId: 1 });
RoomRequestSchema.index({ fromUserId: 1, roomId: 1, status: 1 });

const RoomRequest: Model<IRoomRequest> = 
  mongoose.models.RoomRequest || mongoose.model<IRoomRequest>("RoomRequest", RoomRequestSchema);

export default RoomRequest;

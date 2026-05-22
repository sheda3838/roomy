import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConnection extends Document {
  users: mongoose.Types.ObjectId[];
  roomId: mongoose.Types.ObjectId;
  isActive: boolean;
  connectedAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    // A pair of users who are connected (the room owner and the accepted requester, or two roommates)
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for fast lookup of a user's connections
ConnectionSchema.index({ users: 1 });
ConnectionSchema.index({ roomId: 1 });

// Prevent duplicate connections for the exact same pair of users in the same room
// (Note: To strictly enforce this at the DB level regardless of array order, we'd sort before insert, 
// but this compound index will help enforce it if we maintain sorted insertion)
ConnectionSchema.index({ "users.0": 1, "users.1": 1, roomId: 1 }, { unique: true });

const Connection: Model<IConnection> =
  mongoose.models.Connection || mongoose.model<IConnection>("Connection", ConnectionSchema);

export default Connection;

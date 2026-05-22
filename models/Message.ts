import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  connectionId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  messageType: "text" | "system";
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    connectionId: {
      type: Schema.Types.ObjectId,
      ref: "Connection",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "system"],
      default: "text",
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Optimize queries for fetching a chat's message history chronologically
MessageSchema.index({ connectionId: 1, createdAt: 1 });

// Optimize queries for unread messages badge
MessageSchema.index({ receiverId: 1, readAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

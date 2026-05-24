import mongoose, { Schema, Document, Model } from "mongoose";

export type NotificationType =
  | "request_received"
  | "request_accepted"
  | "request_rejected"
  | "message_received"
  | "match_found";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;   // receiver
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "request_received",
        "request_accepted",
        "request_rejected",
        "message_received",
        "match_found",
      ],
      required: true,
    },
    title:   { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link:    { type: String, trim: true },
    isRead:  { type: Boolean, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound index for common query: fetch unread for user
NotificationSchema.index({ userId: 1, isRead: 1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;

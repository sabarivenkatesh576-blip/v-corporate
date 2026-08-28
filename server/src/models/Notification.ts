import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationModel extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotificationModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, default: 'system' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model<INotificationModel>('Notification', NotificationSchema);

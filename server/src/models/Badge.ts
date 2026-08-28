import mongoose, { Schema, Document } from 'mongoose';

export interface IBadgeDoc extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: Date;
}

const BadgeSchema = new Schema<IBadgeDoc>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  badgeId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

BadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const Badge = mongoose.model<IBadgeDoc>('Badge', BadgeSchema);

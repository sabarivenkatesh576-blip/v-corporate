import mongoose, { Schema, Document } from 'mongoose';

export interface IXPTransaction extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  amount: number;
  relatedActivity: string;
  metadata?: any;
  createdAt: Date;
}

const XPTransactionSchema = new Schema<IXPTransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true },
  amount: { type: Number, required: true },
  relatedActivity: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const XPTransaction = mongoose.model<IXPTransaction>('XPTransaction', XPTransactionSchema);

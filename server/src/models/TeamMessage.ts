import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamMessageModel extends Document {
  teamId: mongoose.Types.ObjectId;
  channel: string;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  text: string;
  attachments: string[];
  replyTo?: {
    messageId: string;
    senderName: string;
    text: string;
  };
}

const TeamMessageSchema = new Schema<ITeamMessageModel>({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
  channel: { type: String, enum: ['#general', '#project-discussion', '#technical', '#announcements'], default: '#general', index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  attachments: { type: [String], default: [] },
  replyTo: {
    messageId: String,
    senderName: String,
    text: String
  }
}, { timestamps: true });

export const TeamMessage = mongoose.model<ITeamMessageModel>('TeamMessage', TeamMessageSchema);

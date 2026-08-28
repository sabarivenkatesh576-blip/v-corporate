import mongoose, { Schema, Document } from 'mongoose';

export interface IMeetingModel extends Document {
  meetingId: string;
  title: string;
  teamId?: mongoose.Types.ObjectId;
  projectId?: string;
  hostId: mongoose.Types.ObjectId;
  hostName: string;
  date: string;
  time: string;
  durationMinutes: number;
  agenda: string;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    fullName: string;
    joined: boolean;
  }>;
  status: string;
  notes?: {
    summary: string;
    decisions: string[];
    actionItems: Array<{
      item: string;
      assignee: string;
      deadline?: string;
      status: string;
    }>;
    aiMinutes?: string;
  };
}

const MeetingSchema = new Schema<IMeetingModel>({
  meetingId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  projectId: String,
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  durationMinutes: { type: Number, default: 30 },
  agenda: { type: String, required: true },
  participants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: String,
    joined: { type: Boolean, default: false }
  }],
  status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
  notes: {
    summary: { type: String, default: '' },
    decisions: { type: [String], default: [] },
    actionItems: [{
      item: String,
      assignee: String,
      deadline: String,
      status: { type: String, default: 'pending' }
    }],
    aiMinutes: { type: String, default: '' }
  }
}, { timestamps: true });

export const Meeting = mongoose.model<IMeetingModel>('Meeting', MeetingSchema);

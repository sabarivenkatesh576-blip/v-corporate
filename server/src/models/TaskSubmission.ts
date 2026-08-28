import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskSubmissionModel extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: string;
  taskId: string;
  deliverableType: string;
  content?: string;
  fileUrl?: string;
  status: string;
  score?: number;
  rubricScores?: {
    accuracy: number;
    problemSolving: number;
    industryRelevance: number;
    presentation: number;
    technicalQuality: number;
  };
  feedback?: string;
  evaluatorNotes?: string;
  submittedAt: Date;
}

const TaskSubmissionSchema = new Schema<ITaskSubmissionModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  projectId: { type: String, required: true, index: true },
  taskId: { type: String, required: true },
  deliverableType: { type: String, default: 'document' },
  content: { type: String },
  fileUrl: { type: String },
  status: { type: String, enum: ['Under Review', 'Completed', 'Verified'], default: 'Under Review' },
  score: { type: Number },
  rubricScores: {
    accuracy: Number,
    problemSolving: Number,
    industryRelevance: Number,
    presentation: Number,
    technicalQuality: Number
  },
  feedback: { type: String },
  evaluatorNotes: { type: String },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const TaskSubmission = mongoose.model<ITaskSubmissionModel>('TaskSubmission', TaskSubmissionSchema);

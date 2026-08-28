import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunicationPractice extends Document {
  userId: mongoose.Types.ObjectId;
  category?: string;
  scenarioId?: string;
  scenarioTitle: string;
  coachingMode?: string;
  mode?: 'email' | 'workplace_chat' | 'meeting_prep' | 'ai_coach';
  coachRole?: string;
  prompt?: string;
  studentInput?: string;
  draftText?: string;
  enhancedDraft?: string;
  recipient?: string;
  clarityScore?: number;
  professionalismScore?: number;
  toneScore?: number;
  grammarScore?: number;
  overallScore: number;
  feedbackPoints?: string[];
  suggestions?: string[];
  xpAwarded?: number;
  feedback?: {
    overallScore: number;
    toneScore: number;
    clarityScore: number;
    grammarScore: number;
    professionalismScore: number;
    strengths: string[];
    improvements: string[];
    revisedDraftSuggestion: string;
  };
  createdAt: Date;
}

const CommunicationPracticeSchema = new Schema<ICommunicationPractice>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, default: 'email' },
  scenarioId: { type: String, default: 'custom' },
  scenarioTitle: { type: String, required: true },
  coachingMode: { type: String, default: 'executive' },
  mode: { type: String, default: 'email' },
  coachRole: { type: String },
  prompt: { type: String },
  studentInput: { type: String },
  draftText: { type: String },
  enhancedDraft: { type: String },
  recipient: { type: String, default: 'Corporate Stakeholder' },
  clarityScore: { type: Number, default: 75 },
  professionalismScore: { type: Number, default: 80 },
  toneScore: { type: Number, default: 80 },
  grammarScore: { type: Number, default: 85 },
  overallScore: { type: Number, required: true },
  feedbackPoints: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  xpAwarded: { type: Number, default: 50 },
  feedback: {
    overallScore: { type: Number, default: 75 },
    toneScore: { type: Number, default: 0 },
    clarityScore: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    professionalismScore: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    revisedDraftSuggestion: { type: String, default: '' }
  }
}, { timestamps: true });

export const CommunicationPractice = mongoose.model<ICommunicationPractice>('CommunicationPractice', CommunicationPracticeSchema);

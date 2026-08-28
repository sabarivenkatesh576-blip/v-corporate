import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewSessionModel extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  interviewType: string;
  difficulty: string;
  status: 'in-progress' | 'completed';
  overallScore?: number;
  conversation: Array<{
    sender: 'ai' | 'user';
    text: string;
    timestamp: Date;
    audioUrl?: string;
  }>;
  questionsAsked: string[];
  evaluation?: {
    overallScore: number;
    parameters: {
      communication: number;
      confidence: number;
      clarity: number;
      grammar: number;
      technicalKnowledge: number;
      problemSolving: number;
      relevance: number;
      domainKnowledge: number;
      answerQuality: number;
    };
    strengths: string[];
    weaknesses: string[];
    improvementPlan: string[];
    recommendedSkills: string[];
    detailedFeedback: string;
  };
}

const InterviewSessionSchema = new Schema<IInterviewSessionModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, required: true },
  interviewType: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'intermediate' },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  overallScore: { type: Number, default: 0 },
  conversation: [{
    sender: { type: String, enum: ['ai', 'user'] },
    text: String,
    timestamp: { type: Date, default: Date.now },
    audioUrl: String
  }],
  questionsAsked: [String],
  evaluation: {
    overallScore: Number,
    parameters: {
      communication: Number,
      confidence: Number,
      clarity: Number,
      grammar: Number,
      technicalKnowledge: Number,
      problemSolving: Number,
      relevance: Number,
      domainKnowledge: Number,
      answerQuality: Number
    },
    strengths: [String],
    weaknesses: [String],
    improvementPlan: [String],
    recommendedSkills: [String],
    detailedFeedback: String
  }
}, { timestamps: true });

export const InterviewSession = mongoose.model<IInterviewSessionModel>('InterviewSession', InterviewSessionSchema);

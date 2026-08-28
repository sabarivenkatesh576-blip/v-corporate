import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionModel extends Document {
  category: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  formula?: string;
  skill: string;
  timeRecommendationSeconds: number;
}

const QuestionSchema = new Schema<IQuestionModel>({
  category: { type: String, required: true, index: true },
  topic: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, required: true },
  formula: { type: String },
  skill: { type: String, default: 'General Problem Solving' },
  timeRecommendationSeconds: { type: Number, default: 60 }
}, { timestamps: true });

export const Question = mongoose.model<IQuestionModel>('Question', QuestionSchema);

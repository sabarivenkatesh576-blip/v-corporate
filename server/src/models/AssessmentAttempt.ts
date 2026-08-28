import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAttemptModel extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  mode: string;
  score?: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  questionResponses: Array<{
    questionId: mongoose.Types.ObjectId;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }>;
  topicPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  weakAreas: string[];
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttemptModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true },
  mode: { type: String, enum: ['practice', 'timed', 'mock', 'adaptive'], default: 'practice' },
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, default: 0 },
  unanswered: { type: Number, default: 0 },
  scorePercentage: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 },
  questionResponses: [{
    questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: Number,
    isCorrect: Boolean,
    timeSpentSeconds: Number
  }],
  topicPerformance: { type: Schema.Types.Mixed, default: {} },
  weakAreas: [String]
}, { timestamps: true });

export const AssessmentAttempt = mongoose.model<IAssessmentAttemptModel>('AssessmentAttempt', AssessmentAttemptSchema);

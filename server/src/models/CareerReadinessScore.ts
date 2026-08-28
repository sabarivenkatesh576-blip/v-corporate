import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerReadinessScoreModel extends Document {
  userId: mongoose.Types.ObjectId;
  overallScore: number;
  tier: string;
  isCalculated: boolean;
  components: {
    resume: number;
    skills: number;
    aptitude: number;
    logicalReasoning: number;
    verbalAbility: number;
    aiInterview: number;
    projects: number;
    communication: number;
    teamwork: number;
    problemSolving: number;
  };
  lastCalculated: Date;
  history: Array<{
    date: Date;
    score: number;
  }>;
}

const CareerReadinessScoreSchema = new Schema<ICareerReadinessScoreModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  overallScore: { type: Number, default: 0 },
  tier: { type: String, default: 'Not Calculated' },
  isCalculated: { type: Boolean, default: false },
  components: {
    resume: { type: Number, default: 0 },
    skills: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    logicalReasoning: { type: Number, default: 0 },
    verbalAbility: { type: Number, default: 0 },
    aiInterview: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    teamwork: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 }
  },
  lastCalculated: { type: Date, default: Date.now },
  history: [{
    date: { type: Date, default: Date.now },
    score: { type: Number, default: 0 }
  }]
}, { timestamps: true });

export const CareerReadinessScore = mongoose.model<ICareerReadinessScoreModel>('CareerReadinessScore', CareerReadinessScoreSchema);

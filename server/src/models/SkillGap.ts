import mongoose, { Schema, Document } from 'mongoose';

export interface ISkillGapModel extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  requiredSkills: Array<{
    skill: string;
    category: string;
    importance: string;
    studentProficiency: number;
    gapLevel: string;
  }>;
  matchScore: number;
  recommendedLearningModules: string[];
}

const SkillGapSchema = new Schema<ISkillGapModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  targetRole: { type: String, required: true },
  requiredSkills: [{
    skill: String,
    category: String,
    importance: { type: String, default: 'Important' },
    studentProficiency: { type: Number, default: 0 },
    gapLevel: { type: String, default: 'High Gap' }
  }],
  matchScore: { type: Number, default: 0 },
  recommendedLearningModules: [String]
}, { timestamps: true });

export const SkillGap = mongoose.model<ISkillGapModel>('SkillGap', SkillGapSchema);

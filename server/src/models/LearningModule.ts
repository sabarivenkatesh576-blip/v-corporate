import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningModuleModel extends Document {
  skill: string;
  title: string;
  description: string;
  role: string;
  difficulty: string;
  estimatedHours: number;
  topics: Array<{
    title: string;
    content: string;
    codeSnippet?: string;
    keyTakeaway: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  practiceProject: {
    title: string;
    instructions: string;
    starterCode?: string;
  };
}

const LearningModuleSchema = new Schema<ILearningModuleModel>({
  skill: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, required: true },
  difficulty: { type: String, default: 'intermediate' },
  estimatedHours: { type: Number, default: 4 },
  topics: [{
    title: String,
    content: String,
    codeSnippet: String,
    keyTakeaway: String
  }],
  quiz: [{
    question: String,
    options: [String],
    correctIndex: Number,
    explanation: String
  }],
  practiceProject: {
    title: String,
    instructions: String,
    starterCode: String
  }
}, { timestamps: true });

export const LearningModule = mongoose.model<ILearningModuleModel>('LearningModule', LearningModuleSchema);

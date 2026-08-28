import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectModel extends Document {
  projectId: string;
  title: string;
  role: string;
  difficulty: string;
  problemStatement: string;
  businessContext: string;
  objectives: string[];
  requiredSkills: string[];
  learningOutcomes: string[];
  datasetUrl?: string;
  datasetPreview?: any;
  datasetType?: string;
  tasks: Array<{
    taskId: string;
    title: string;
    description: string;
    deliverableType: string;
    expectedOutput: string;
    starterData?: any;
    status: string;
  }>;
  deadlineDays: number;
  evaluationRubric: {
    accuracy: number;
    problemSolving: number;
    industryRelevance: number;
    presentation: number;
    technicalQuality: number;
  };
  featured?: boolean;
}

const ProjectSchema = new Schema<IProjectModel>({
  projectId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, index: true },
  role: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate', index: true },
  problemStatement: { type: String, required: true },
  businessContext: { type: String, required: true },
  objectives: [String],
  requiredSkills: [String],
  learningOutcomes: [String],
  datasetUrl: String,
  datasetPreview: Schema.Types.Mixed,
  datasetType: { type: String, default: 'json' },
  tasks: [{
    taskId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    deliverableType: { type: String, default: 'document' },
    expectedOutput: { type: String, required: true },
    starterData: Schema.Types.Mixed,
    status: { type: String, default: 'To Do' }
  }],
  deadlineDays: { type: Number, default: 7 },
  evaluationRubric: {
    accuracy: { type: Number, default: 25 },
    problemSolving: { type: Number, default: 25 },
    industryRelevance: { type: Number, default: 20 },
    presentation: { type: Number, default: 15 },
    technicalQuality: { type: Number, default: 15 }
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export const Project = mongoose.model<IProjectModel>('Project', ProjectSchema);

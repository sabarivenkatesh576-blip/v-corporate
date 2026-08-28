import mongoose, { Schema, Document } from 'mongoose';

export interface IResumeModel extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl?: string;
  rawText: string;
  score?: number;
  parsedData: {
    name?: string;
    email?: string;
    phone?: string;
    education: any[];
    skills: string[];
    projects: any[];
    internships: any[];
    certifications: string[];
    experience: string[];
    achievements: string[];
  };
  analysis: {
    roleMatchPercentage: number;
    extractedSkills: string[];
    missingSkills: string[];
    weakAreas: string[];
    strengths: string[];
    recommendations: string[];
  };
}

const ResumeSchema = new Schema<IResumeModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String },
  rawText: { type: String, required: true },
  score: { type: Number, default: 0 },
  parsedData: {
    name: String,
    email: String,
    phone: String,
    education: [Schema.Types.Mixed],
    skills: [String],
    projects: [Schema.Types.Mixed],
    internships: [Schema.Types.Mixed],
    certifications: [String],
    experience: [String],
    achievements: [String]
  },
  analysis: {
    roleMatchPercentage: { type: Number, default: 0 },
    extractedSkills: [String],
    missingSkills: [String],
    weakAreas: [String],
    strengths: [String],
    recommendations: [String]
  }
}, { timestamps: true });

export const Resume = mongoose.model<IResumeModel>('Resume', ResumeSchema);

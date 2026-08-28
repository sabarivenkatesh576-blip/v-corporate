import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyModel extends Document {
  companyId: string;
  id?: string;
  name: string;
  shortName?: string;
  industry: string;
  headquarters?: string;
  culture: string;
  accentColor: string;
  bgGradient: string;
  icon: string;
  tagline: string;
  careerAreas?: string[];
  relevantRoles?: string[];
  requiredSkills?: string[];
  typicalRecruitmentStages?: Array<{
    stageNumber: number;
    title: string;
    description: string;
    format: string;
    durationMinutes: number;
  }>;
  assessmentAreas?: string[];
  technicalTopics?: string[];
  aptitudeTopics?: string[];
  communicationExpectations?: string;
  behavioralPreparation?: string;
  preparationRoadmap?: string[];
  disclaimer?: string;
}

const CompanySchema = new Schema<ICompanyModel>({
  companyId: { type: String, required: true, unique: true },
  id: { type: String },
  name: { type: String, required: true },
  shortName: { type: String },
  industry: { type: String, required: true },
  headquarters: { type: String },
  culture: { type: String, required: true },
  accentColor: { type: String, default: '#0284c7' },
  bgGradient: { type: String, default: 'from-blue-900 to-indigo-900' },
  icon: { type: String, default: 'Briefcase' },
  tagline: { type: String, default: 'Virtual Corporate Experience' },
  careerAreas: [{ type: String }],
  relevantRoles: [{ type: String }],
  requiredSkills: [{ type: String }],
  typicalRecruitmentStages: [{
    stageNumber: Number,
    title: String,
    description: String,
    format: String,
    durationMinutes: Number
  }],
  assessmentAreas: [{ type: String }],
  technicalTopics: [{ type: String }],
  aptitudeTopics: [{ type: String }],
  communicationExpectations: { type: String },
  behavioralPreparation: { type: String },
  preparationRoadmap: [{ type: String }],
  disclaimer: { type: String }
}, { timestamps: true });

export const Company = mongoose.model<ICompanyModel>('Company', CompanySchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IInternship extends Document {
  companyName: string;
  companyId: string;
  roleTitle: string;
  industry: string;
  stipend: string;
  duration: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-Site';
  requiredSkills: string[];
  preferredDegree: string[];
  preferredDepartment: string[];
  description: string;
  responsibilities: string[];
  learningOutcomes: string[];
  openingsCount: number;
  deadline: Date;
  verifiedSource: boolean;
  sourceAttribution: string;
  applicants: Array<{
    studentId: mongoose.Types.ObjectId;
    studentName: string;
    studentEmail: string;
    appliedAt: Date;
    status: string;
    matchScore: number;
  }>;
  createdAt: Date;
}

const InternshipSchema = new Schema<IInternship>({
  companyName: { type: String, required: true },
  companyId: { type: String, required: true },
  roleTitle: { type: String, required: true },
  industry: { type: String, required: true },
  stipend: { type: String, required: true },
  duration: { type: String, default: '3-6 Months' },
  location: { type: String, default: 'Bangalore / Remote' },
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'On-Site'], default: 'Remote' },
  requiredSkills: { type: [String], required: true },
  preferredDegree: { type: [String], default: ['B.Tech', 'B.E', 'B.Sc', 'BBA', 'B.Com', 'MCA', 'MBA'] },
  preferredDepartment: { type: [String], default: ['Computer Science', 'Information Technology', 'Data Science', 'Commerce', 'Management'] },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  learningOutcomes: { type: [String], default: [] },
  openingsCount: { type: Number, default: 5 },
  deadline: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  verifiedSource: { type: Boolean, default: true },
  sourceAttribution: { type: String, default: 'V-CORP Industry Partner Portal' },
  applicants: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String },
    studentEmail: { type: String },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Reviewing' },
    matchScore: { type: Number, default: 80 }
  }]
}, { timestamps: true });

export const Internship = mongoose.model<IInternship>('Internship', InternshipSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentProfileModel extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  college: string;
  degree: string;
  department: string;
  academicYear: string;
  graduationYear: number;
  targetRole: string;
  careerInterests: string[];
  bio?: string;
  skills: string[];
  verifiedSkills: Array<{
    skillName: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    verifiedVia: 'assessment' | 'project' | 'interview';
    verifiedAt: Date;
  }>;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: Date;
  careerReadinessScore: number;
  readinessTier: string;
  isAssessed: boolean;
}

const StudentProfileSchema = new Schema<IStudentProfileModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  college: { type: String, default: 'Engineering / Business College' },
  degree: { type: String, default: 'B.Tech' },
  department: { type: String, default: 'Computer Science and Engineering' },
  academicYear: { type: String, default: '3rd Year' },
  graduationYear: { type: Number, default: 2027 },
  targetRole: { type: String, default: 'Software Developer' },
  careerInterests: { type: [String], default: [] },
  bio: { type: String, default: 'Student building industry readiness on V-CORP.' },
  skills: { type: [String], default: [] },
  verifiedSkills: [{
    skillName: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Beginner' },
    verifiedVia: { type: String, enum: ['assessment', 'project', 'interview'], default: 'assessment' },
    verifiedAt: { type: Date, default: Date.now }
  }],
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streakDays: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  careerReadinessScore: { type: Number, default: 0 },
  readinessTier: { type: String, default: 'Not Calculated' },
  isAssessed: { type: Boolean, default: false }
}, { timestamps: true });

export const StudentProfile = mongoose.model<IStudentProfileModel>('StudentProfile', StudentProfileSchema);

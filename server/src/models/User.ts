import mongoose, { Schema, Document } from 'mongoose';

export interface IUserModel extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  college?: string;
  degree?: string;
  department?: string;
  academicYear?: string;
  graduationYear?: number;
  targetRole?: string;
  careerInterests: string[];
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserModel>({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  college: { type: String, default: 'National Institute of Technology' },
  degree: { type: String, default: 'B.Tech' },
  department: { type: String, default: 'Computer Science and Engineering' },
  academicYear: { type: String, default: '3rd Year' },
  graduationYear: { type: Number, default: 2027 },
  targetRole: { type: String, default: 'Software Developer' },
  careerInterests: { type: [String], default: ['Full-Stack Development', 'Cloud Architecture', 'AI Engineering'] },
  avatar: { type: String, default: '' }
}, { timestamps: true });

export const User = mongoose.model<IUserModel>('User', UserSchema);

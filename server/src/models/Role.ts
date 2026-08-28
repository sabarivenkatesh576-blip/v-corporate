import mongoose, { Schema, Document } from 'mongoose';

export interface IRoleModel extends Document {
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  recommendedProjectsCount: number;
  averageSalary: string;
}

const RoleSchema = new Schema<IRoleModel>({
  title: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  recommendedProjectsCount: { type: Number, default: 20 },
  averageSalary: { type: String, default: '₹6 - 12 LPA' }
}, { timestamps: true });

export const Role = mongoose.model<IRoleModel>('Role', RoleSchema);

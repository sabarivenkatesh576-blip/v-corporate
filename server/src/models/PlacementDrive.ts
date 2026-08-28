import mongoose, { Schema, Document } from 'mongoose';

export interface IPlacementDrive extends Document {
  companyName: string;
  companyId: string;
  roleTitle: string;
  driveDate: Date;
  registrationDeadline: Date;
  packageLPA: string;
  jobLocation: string;
  eligibilityCriteria: {
    minGpa: number;
    allowedDegrees: string[];
    allowedDepartments: string[];
    graduationYears: number[];
    requiredSkills: string[];
  };
  selectionRounds: Array<{
    roundNumber: number;
    name: string;
    description: string;
    date?: Date;
  }>;
  description: string;
  openingsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registeredStudents: Array<{
    studentId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    appliedAt: Date;
    status: 'applied' | 'shortlisted' | 'assessment_passed' | 'interview_scheduled' | 'selected' | 'rejected';
    readinessScoreAtApplication: number;
    notes?: string;
  }>;
  applications: Array<{
    studentId: mongoose.Types.ObjectId;
    studentName: string;
    studentEmail: string;
    appliedAt: Date;
    status: string;
    careerReadinessScore: number;
    currentRound: number;
  }>;
  createdAt: Date;
}

const PlacementDriveSchema = new Schema<IPlacementDrive>({
  companyName: { type: String, required: true },
  companyId: { type: String, required: true },
  roleTitle: { type: String, required: true },
  driveDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  packageLPA: { type: String, required: true },
  jobLocation: { type: String, default: 'Pan India / Hybrid' },
  eligibilityCriteria: {
    minGpa: { type: Number, default: 6.0 },
    allowedDegrees: { type: [String], default: ['B.Tech', 'B.E', 'M.Tech', 'MCA', 'B.Sc', 'BBA', 'B.Com', 'MBA'] },
    allowedDepartments: { type: [String], default: ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication', 'Data Science', 'Business Analytics', 'Finance', 'Commerce', 'Management'] },
    graduationYears: { type: [Number], default: [2024, 2025, 2026, 2027] },
    requiredSkills: { type: [String], default: [] }
  },
  selectionRounds: [{
    roundNumber: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date }
  }],
  description: { type: String, required: true },
  openingsCount: { type: Number, default: 10 },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  registeredStudents: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String },
    email: { type: String },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['applied', 'shortlisted', 'assessment_passed', 'interview_scheduled', 'selected', 'rejected'], default: 'applied' },
    readinessScoreAtApplication: { type: Number, default: 0 },
    notes: { type: String }
  }],
  applications: [{
    studentId: { type: Schema.Types.ObjectId, ref: 'User' },
    studentName: { type: String },
    studentEmail: { type: String },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Shortlisted' },
    careerReadinessScore: { type: Number, default: 0 },
    currentRound: { type: Number, default: 1 }
  }]
}, { timestamps: true });

export const PlacementDrive = mongoose.model<IPlacementDrive>('PlacementDrive', PlacementDriveSchema);

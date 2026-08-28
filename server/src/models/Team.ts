import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamModel extends Document {
  teamCode: string;
  name: string;
  description: string;
  projectId: string;
  projectTitle: string;
  role: string;
  leaderId: mongoose.Types.ObjectId;
  maxMembers: number;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    roleInTeam: string;
    assignedTasks: string[];
    joinedAt: Date;
  }>;
  progressPercentage: number;
  sharedWorkspaceData?: {
    codeSnippet?: string;
    notes?: string;
    spreadsheetData?: any[];
  };
}

const TeamSchema = new Schema<ITeamModel>({
  teamCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  projectId: { type: String, required: true },
  projectTitle: { type: String, required: true },
  role: { type: String, required: true },
  leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  maxMembers: { type: Number, default: 4 },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    roleInTeam: { type: String, default: 'Developer' },
    assignedTasks: [String],
    joinedAt: { type: Date, default: Date.now }
  }],
  progressPercentage: { type: Number, default: 0 },
  sharedWorkspaceData: {
    codeSnippet: { type: String, default: '// Shared Team Code Workspace\n' },
    notes: { type: String, default: '### Team Notes & Objectives\n' },
    spreadsheetData: { type: [Schema.Types.Mixed], default: [] }
  }
}, { timestamps: true });

export const Team = mongoose.model<ITeamModel>('Team', TeamSchema);

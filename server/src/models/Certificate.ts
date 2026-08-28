import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateModel extends Document {
  userId: mongoose.Types.ObjectId;
  certificateId: string;
  credentialId?: string;
  title: string;
  projectTitle: string;
  projectId?: string;
  role: string;
  companyName: string;
  issuedToName: string;
  skillsValidated: string[];
  score: number;
  issueDate: Date;
  qrCodeUrl: string;
  verificationUrl: string;
  status: 'valid' | 'revoked';
}

const CertificateSchema = new Schema<ICertificateModel>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  certificateId: { type: String, required: true, unique: true, index: true },
  credentialId: { type: String },
  title: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectId: { type: String },
  role: { type: String, required: true },
  companyName: { type: String, default: 'V-CORP Global Virtual Office' },
  issuedToName: { type: String, required: true },
  skillsValidated: { type: [String], default: [] },
  score: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  qrCodeUrl: { type: String, default: '' },
  verificationUrl: { type: String, required: true },
  status: { type: String, enum: ['valid', 'revoked'], default: 'valid' }
}, { timestamps: true });

export const Certificate = mongoose.model<ICertificateModel>('Certificate', CertificateSchema);

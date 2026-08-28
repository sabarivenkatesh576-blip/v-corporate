import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Certificate } from '../models/Certificate';
import { Badge } from '../models/Badge';

export const getUserCredentials = async (req: AuthRequest, res: Response) => {
  try {
    const certificates = await Certificate.find({ userId: req.user._id }).sort({ issuedDate: -1 });
    const badges = await Badge.find({ userId: req.user._id }).sort({ unlockedAt: -1 });

    res.json({
      success: true,
      certificates,
      badges
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyCredentialPublic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findOne({ credentialId: id.toUpperCase() }) || await Certificate.findById(id).catch(() => null);

    if (!cert) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Credential not found or invalid certificate ID.'
      });
    }

    res.json({
      success: true,
      valid: true,
      credential: {
        credentialId: cert.credentialId,
        studentName: cert.studentName,
        title: cert.title,
        role: cert.role,
        projectName: cert.projectName,
        taskTitle: cert.taskTitle,
        skills: cert.skills,
        score: cert.score,
        issuedDate: cert.issuedDate,
        issuer: 'V-CORP Virtual Corporate Experience Verification Engine',
        status: 'VERIFIED & AUTHENTIC'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

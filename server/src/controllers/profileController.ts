import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { StudentProfile } from '../models/StudentProfile';
import { CareerReadinessScore } from '../models/CareerReadinessScore';
import { ReadinessCalculator } from '../services/readinessCalculator';

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const readiness = await CareerReadinessScore.findOne({ userId: req.user._id });
    res.json({ success: true, profile, readiness });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { targetRole, bio, skills, careerInterests } = req.body;
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        ...(targetRole && { targetRole }),
        ...(bio && { bio }),
        ...(skills && { skills }),
        ...(careerInterests && { careerInterests }),
        lastActiveDate: new Date()
      },
      { new: true }
    );
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getReadinessScore = async (req: AuthRequest, res: Response) => {
  try {
    const readiness = await ReadinessCalculator.recalculate(req.user._id.toString());
    res.json({ success: true, readiness });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

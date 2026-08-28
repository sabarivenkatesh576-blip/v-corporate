import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { PlacementDrive } from '../models/PlacementDrive';
import { StudentProfile } from '../models/StudentProfile';

export const getPlacementDrives = async (req: AuthRequest, res: Response) => {
  try {
    const drives = await PlacementDrive.find().sort({ driveDate: 1 });
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    const enriched = drives.map(d => {
      let isEligible = true;
      const reasons: string[] = [];

      if (profile) {
        if (d.eligibilityCriteria.allowedDegrees && d.eligibilityCriteria.allowedDegrees.length > 0) {
          const matchDegree = d.eligibilityCriteria.allowedDegrees.some(deg =>
            profile.degree && profile.degree.toLowerCase().includes(deg.toLowerCase())
          );
          if (!matchDegree) {
            isEligible = false;
            reasons.push('Degree criteria: Requires ' + d.eligibilityCriteria.allowedDegrees.join(', '));
          }
        }

        if (d.eligibilityCriteria.graduationYears && d.eligibilityCriteria.graduationYears.length > 0) {
          if (!d.eligibilityCriteria.graduationYears.includes(profile.graduationYear)) {
            isEligible = false;
            reasons.push('Graduation batch: ' + profile.graduationYear + ' (Allowed: ' + d.eligibilityCriteria.graduationYears.join(', ') + ')');
          }
        }
      }

      const hasApplied = d.applications.some(app => app.studentId.toString() === req.user._id.toString());
      const applicationStatus = hasApplied
        ? d.applications.find(app => app.studentId.toString() === req.user._id.toString())?.status
        : null;

      return {
        ...d.toObject(),
        isEligible,
        ineligibilityReasons: reasons,
        hasApplied,
        applicationStatus
      };
    });

    res.json({
      success: true,
      drives: enriched
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const applyToPlacementDrive = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const drive = await PlacementDrive.findById(id);
    if (!drive) {
      return res.status(404).json({ error: 'Placement drive not found.' });
    }

    const alreadyApplied = drive.applications.some(app => app.studentId.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied to this placement drive.' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });

    drive.applications.push({
      studentId: req.user._id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      appliedAt: new Date(),
      status: 'Shortlisted',
      careerReadinessScore: profile?.careerReadinessScore || 0,
      currentRound: 1
    });

    await drive.save();

    res.json({
      success: true,
      message: 'Application submitted successfully to ' + drive.companyName,
      drive
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

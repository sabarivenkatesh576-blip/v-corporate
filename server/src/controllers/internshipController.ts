import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Internship } from '../models/Internship';
import { StudentProfile } from '../models/StudentProfile';

export const getInternships = async (req: AuthRequest, res: Response) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const userVerifiedSkills = profile?.verifiedSkills?.map(s => s.skillName.toLowerCase()) || [];

    const enriched = internships.map(item => {
      const required = item.requiredSkills || [];
      let matchedCount = 0;
      const missingSkills: string[] = [];

      required.forEach(skill => {
        if (userVerifiedSkills.some(vs => vs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(vs))) {
          matchedCount++;
        } else {
          missingSkills.push(skill);
        }
      });

      const matchPercentage = required.length > 0
        ? Math.round((matchedCount / required.length) * 100)
        : 85;

      const hasApplied = item.applicants.some(app => app.studentId.toString() === req.user._id.toString());
      const applicationStatus = hasApplied
        ? item.applicants.find(app => app.studentId.toString() === req.user._id.toString())?.status
        : null;

      return {
        ...item.toObject(),
        matchPercentage,
        matchedSkillsCount: matchedCount,
        totalRequiredSkills: required.length,
        missingSkills,
        hasApplied,
        applicationStatus
      };
    });

    res.json({
      success: true,
      internships: enriched
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const applyToInternship = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({ error: 'Internship opportunity not found.' });
    }

    const alreadyApplied = internship.applicants.some(app => app.studentId.toString() === req.user._id.toString());
    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied for this internship.' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });

    internship.applicants.push({
      studentId: req.user._id,
      studentName: req.user.fullName,
      studentEmail: req.user.email,
      appliedAt: new Date(),
      status: 'Reviewing',
      matchScore: 80
    });

    await internship.save();

    res.json({
      success: true,
      message: 'Application submitted successfully to ' + internship.companyName,
      internship
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

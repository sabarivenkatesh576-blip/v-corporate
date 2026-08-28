import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { SkillGap } from '../models/SkillGap';
import { StudentProfile } from '../models/StudentProfile';
import { LearningModule } from '../models/LearningModule';
import { CAREER_ROLES } from '../shared/constants';
import { CareerRole } from '../shared/types';
import { ReadinessCalculator } from '../services/readinessCalculator';

export const getSkillGap = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const targetRole = (req.query.role as CareerRole) || profile?.targetRole || 'Software Developer';
    const studentSkills = (profile?.skills || []).map(s => s.toLowerCase());

    const roleDef = CAREER_ROLES.find(r => r.title === targetRole) || CAREER_ROLES[0];
    const requiredSkillsList = roleDef.requiredSkills;

    const requiredSkills = requiredSkillsList.map((skill, idx) => {
      const hasSkill = studentSkills.includes(skill.toLowerCase());
      const importance: 'Critical' | 'Important' | 'Nice-to-Have' = idx < 3 ? 'Critical' : idx < 7 ? 'Important' : 'Nice-to-Have';
      const proficiency = hasSkill ? Math.floor(75 + Math.random() * 20) : Math.floor(20 + Math.random() * 25);
      
      let gapLevel: 'High Gap' | 'Medium Gap' | 'Low Gap' | 'Mastered' = 'High Gap';
      if (proficiency >= 80) gapLevel = 'Mastered';
      else if (proficiency >= 60) gapLevel = 'Low Gap';
      else if (proficiency >= 40) gapLevel = 'Medium Gap';

      return {
        skill,
        category: roleDef.category,
        importance,
        studentProficiency: proficiency,
        gapLevel
      };
    });

    const masteredCount = requiredSkills.filter(s => s.gapLevel === 'Mastered' || s.gapLevel === 'Low Gap').length;
    const matchScore = Math.round((masteredCount / requiredSkills.length) * 100);

    const modules = await LearningModule.find({ role: targetRole }).limit(6);
    const recommendedModules = modules.map(m => m.title);

    let gapDoc = await SkillGap.findOne({ userId: req.user._id });
    if (gapDoc) {
      gapDoc.targetRole = targetRole;
      gapDoc.requiredSkills = requiredSkills;
      gapDoc.matchScore = matchScore;
      gapDoc.recommendedLearningModules = recommendedModules;
      await gapDoc.save();
    } else {
      gapDoc = await SkillGap.create({
        userId: req.user._id,
        targetRole,
        requiredSkills,
        matchScore,
        recommendedLearningModules: recommendedModules
      });
    }

    // Update Skills Readiness component
    await ReadinessCalculator.updateComponent(req.user._id.toString(), {
      skills: Math.max(30, matchScore)
    });

    res.json({
      success: true,
      skillGap: gapDoc,
      learningModules: modules
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLearningModules = async (req: AuthRequest, res: Response) => {
  try {
    const { role, skill } = req.query;
    const filter: any = {};
    if (role) filter.role = role;
    if (skill) filter.skill = new RegExp(skill as string, 'i');

    const modules = await LearningModule.find(filter);
    res.json({ success: true, modules });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

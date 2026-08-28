import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Project } from '../models/Project';
import { TaskSubmission } from '../models/TaskSubmission';
import { Question } from '../models/Question';
import { InterviewSession } from '../models/InterviewSession';
import { Company } from '../models/Company';
import { Role } from '../models/Role';
import { CareerReadinessScore } from '../models/CareerReadinessScore';

export const getCohortStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalStudents = await StudentProfile.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalSubmissions = await TaskSubmission.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalInterviews = await InterviewSession.countDocuments({ status: 'completed' });

    // Aggregate readiness scores
    const readinessDocs = await CareerReadinessScore.find();
    let totalScoreSum = 0;
    let avgResume = 0;
    let avgAptitude = 0;
    let avgInterview = 0;
    let avgProjects = 0;

    const tierCounts: Record<string, number> = {
      'Beginner': 0,
      'Developing': 0,
      'Job Ready': 0,
      'Highly Job Ready': 0,
      'Industry Ready': 0
    };

    if (readinessDocs.length > 0) {
      readinessDocs.forEach(r => {
        totalScoreSum += r.overallScore || 0;
        tierCounts[r.tier] = (tierCounts[r.tier] || 0) + 1;
        avgResume += r.components.resume || 0;
        avgAptitude += r.components.aptitude || 0;
        avgInterview += r.components.aiInterview || 0;
        avgProjects += r.components.projects || 0;
      });

      avgResume = Math.round(avgResume / readinessDocs.length);
      avgAptitude = Math.round(avgAptitude / readinessDocs.length);
      avgInterview = Math.round(avgInterview / readinessDocs.length);
      avgProjects = Math.round(avgProjects / readinessDocs.length);
    }

    const averageReadinessScore = readinessDocs.length > 0
      ? Math.round(totalScoreSum / readinessDocs.length)
      : 65;

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalProjects,
        totalSubmissions,
        totalQuestions,
        totalInterviews,
        averageReadinessScore,
        tierDistribution: tierCounts,
        componentAverages: {
          resume: avgResume,
          aptitude: avgAptitude,
          aiInterview: avgInterview,
          projects: avgProjects
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentsList = async (req: AuthRequest, res: Response) => {
  try {
    const students = await StudentProfile.find().sort({ careerReadinessScore: -1 }).limit(100);
    res.json({ success: true, students });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, question });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

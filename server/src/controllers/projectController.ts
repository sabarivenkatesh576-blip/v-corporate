import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Project } from '../models/Project';
import { TaskSubmission } from '../models/TaskSubmission';
import { Team } from '../models/Team';
import { AIService } from '../services/aiService';
import { CredentialService } from '../services/credentialService';
import { ReadinessCalculator } from '../services/readinessCalculator';
import { SocketService } from '../services/socketService';

export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { role, difficulty, search, featured } = req.query;
    const filter: any = {};

    if (role && role !== 'All Roles') filter.role = role;
    if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;
    if (featured === 'true') filter.featured = true;
    if (search) {
      filter.$or = [
        { title: new RegExp(search as string, 'i') },
        { problemStatement: new RegExp(search as string, 'i') },
        { requiredSkills: new RegExp(search as string, 'i') }
      ];
    }

    const projects = await Project.find(filter).sort({ featured: -1, createdAt: 1 });
    const totalCount = await Project.countDocuments(filter);

    res.json({
      success: true,
      total: totalCount,
      projects
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findOne({ projectId: req.params.id }) || await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Get user's submissions for this project
    const submissions = await TaskSubmission.find({
      userId: req.user._id,
      projectId: project.projectId
    });

    res.json({
      success: true,
      project,
      submissions
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const submitTaskDeliverable = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, taskId, deliverableType = 'document', content } = req.body;
    let fileUrl = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    if (!projectId || !taskId) {
      return res.status(400).json({ error: 'Project ID and Task ID are required.' });
    }

    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const task = project.tasks.find(t => t.taskId === taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found in project.' });
    }

    // Run AI Evaluation
    const submissionText = content || `Submitted file: ${fileUrl}`;
    const evaluation = await AIService.evaluateProjectTask(
      project.title,
      task.title,
      task.expectedOutput,
      submissionText,
      deliverableType
    );

    const submission = await TaskSubmission.findOneAndUpdate(
      { userId: req.user._id, projectId, taskId },
      {
        deliverableType,
        content: submissionText,
        fileUrl,
        status: 'Verified',
        score: evaluation.totalScore,
        rubricScores: evaluation.rubricScores,
        feedback: evaluation.feedback,
        evaluatorNotes: evaluation.evaluatorNotes,
        submittedAt: new Date()
      },
      { upsert: true, new: true }
    );

    // Issue verified task credential
    await CredentialService.issueTaskCredential(
      req.user._id.toString(),
      req.user.fullName,
      project.role,
      project.title,
      task.title,
      evaluation.totalScore,
      project.requiredSkills
    );

    // Update Career Readiness projects score
    const allSubmissions = await TaskSubmission.find({ userId: req.user._id, status: 'Verified' });
    const projectScore = Math.min(100, Math.round(50 + allSubmissions.length * 10));
    await ReadinessCalculator.updateComponent(req.user._id.toString(), {
      projects: projectScore,
      problemSolving: Math.min(100, Math.round(55 + allSubmissions.length * 8))
    });

    // Check if entire project is completed
    const projectTaskCount = project.tasks.length;
    const completedProjectTasks = await TaskSubmission.countDocuments({
      userId: req.user._id,
      projectId,
      status: 'Verified'
    });

    let projectCertificate = null;
    if (completedProjectTasks >= projectTaskCount) {
      projectCertificate = await CredentialService.issueProjectCertificate(
        req.user._id.toString(),
        req.user.fullName,
        project.role,
        project.title,
        evaluation.totalScore,
        project.requiredSkills
      );
    }

    // Update team progress if user belongs to a team for this project
    const userTeam = await Team.findOne({
      projectId,
      'members.userId': req.user._id
    });

    if (userTeam) {
      const progress = Math.min(100, Math.round((completedProjectTasks / projectTaskCount) * 100));
      userTeam.progressPercentage = progress;
      await userTeam.save();

      SocketService.sendNotificationToUser(req.user._id.toString(), {
        type: 'task_assigned',
        title: `Task "${task.title}" Verified! ✅`,
        message: `Task successfully evaluated with score ${evaluation.totalScore}/100. Team progress: ${progress}%.`
      });
    }

    res.json({
      success: true,
      submission,
      evaluation,
      projectCompleted: completedProjectTasks >= projectTaskCount,
      certificate: projectCertificate
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { InterviewSession } from '../models/InterviewSession';
import { Resume } from '../models/Resume';
import { AIService } from '../services/aiService';
import { ReadinessCalculator } from '../services/readinessCalculator';
import { CredentialService } from '../services/credentialService';
import { CareerRole, QuestionDifficulty } from '../shared/types';

export const startInterviewSession = async (req: AuthRequest, res: Response) => {
  try {
    const { role = 'Software Developer', interviewType = 'Technical', difficulty = 'intermediate' } = req.body;

    const resume = await Resume.findOne({ userId: req.user._id });
    const resumeData = resume ? resume.parsedData : null;

    const firstQuestion = await AIService.generateNextInterviewQuestion(
      role as CareerRole,
      difficulty as QuestionDifficulty,
      resumeData,
      []
    );

    const session = await InterviewSession.create({
      userId: req.user._id,
      role,
      interviewType,
      difficulty,
      status: 'in-progress',
      conversation: [
        {
          sender: 'ai',
          text: firstQuestion,
          timestamp: new Date()
        }
      ],
      questionsAsked: [firstQuestion]
    });

    res.json({
      success: true,
      session
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, answerText } = req.body;
    if (!sessionId || !answerText) {
      return res.status(400).json({ error: 'Session ID and answer text are required.' });
    }

    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ error: 'This interview session is already completed.' });
    }

    // Add user answer
    session.conversation.push({
      sender: 'user',
      text: answerText,
      timestamp: new Date()
    });

    const userTurns = session.conversation.filter(c => c.sender === 'user').length;

    // Check if interview complete (4 turns)
    if (userTurns >= 4) {
      // Evaluate interview
      const evaluation = await AIService.evaluateInterview(
        session.role as CareerRole,
        session.difficulty as QuestionDifficulty,
        session.conversation as any
      );

      session.evaluation = evaluation;
      session.status = 'completed';
      await session.save();

      // Update AI interview component
      await ReadinessCalculator.updateComponent(req.user._id.toString(), {
        aiInterview: evaluation.overallScore,
        communication: evaluation.parameters.communication
      });

      if (evaluation.overallScore >= 85) {
        await CredentialService.unlockBadge(req.user._id.toString(), 'interview-ready');
      }

      return res.json({
        success: true,
        completed: true,
        session,
        evaluation
      });
    }

    // Generate dynamic follow up
    const resume = await Resume.findOne({ userId: req.user._id });
    const resumeData = resume ? resume.parsedData : null;

    const nextQuestion = await AIService.generateNextInterviewQuestion(
      session.role as CareerRole,
      session.difficulty as QuestionDifficulty,
      resumeData,
      session.conversation as any
    );

    session.conversation.push({
      sender: 'ai',
      text: nextQuestion,
      timestamp: new Date()
    });
    session.questionsAsked.push(nextQuestion);
    await session.save();

    res.json({
      success: true,
      completed: false,
      session,
      nextQuestion
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const completeInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findOne({ _id: sessionId, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }

    const evaluation = await AIService.evaluateInterview(
      session.role as CareerRole,
      session.difficulty as QuestionDifficulty,
      session.conversation as any
    );

    session.evaluation = evaluation;
    session.status = 'completed';
    await session.save();

    await ReadinessCalculator.updateComponent(req.user._id.toString(), {
      aiInterview: evaluation.overallScore,
      communication: evaluation.parameters.communication
    });

    if (evaluation.overallScore >= 85) {
      await CredentialService.unlockBadge(req.user._id.toString(), 'interview-ready');
    }

    res.json({
      success: true,
      session,
      evaluation
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getInterviewHistory = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, sessions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) {
      return res.status(404).json({ error: 'Interview session not found.' });
    }
    res.json({ success: true, session });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { CareerReadinessScore } from '../models/CareerReadinessScore';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (userId: string, role: string) => {
  const secret = process.env.JWT_SECRET || 'vcorp_sih_hackathon_super_secure_jwt_secret_key_2026';
  return jwt.sign({ userId, role }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      password,
      college,
      degree,
      department,
      academicYear,
      graduationYear,
      targetRole,
      careerInterests,
      role = 'student'
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      college: college || 'National Institute of Technology',
      degree: degree || 'B.Tech',
      department: department || 'Computer Science & Engineering',
      academicYear: academicYear || '3rd Year',
      graduationYear: graduationYear || 2027,
      targetRole: targetRole || 'Software Developer',
      careerInterests: careerInterests || ['Software Engineering', 'System Architecture']
    });

    // Create StudentProfile with clean slate
    const profile = await StudentProfile.create({
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      college: user.college,
      degree: user.degree,
      department: user.department,
      academicYear: user.academicYear,
      graduationYear: user.graduationYear,
      targetRole: user.targetRole,
      careerInterests: user.careerInterests || [],
      skills: [],
      verifiedSkills: [],
      xp: 0,
      level: 1,
      streakDays: 0,
      careerReadinessScore: 0,
      readinessTier: 'Not Calculated',
      isAssessed: false
    });

    // Create default clean CareerReadinessScore
    await CareerReadinessScore.create({
      userId: user._id,
      overallScore: 0,
      tier: 'Not Calculated',
      isCalculated: false,
      components: {
        resume: 0,
        skills: 0,
        aptitude: 0,
        logicalReasoning: 0,
        verbalAbility: 0,
        aiInterview: 0,
        projects: 0,
        communication: 0,
        teamwork: 0,
        problemSolving: 0
      },
      history: []
    });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        college: user.college,
        degree: user.degree,
        department: user.department
      },
      profile
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user._id.toString(), user.role);
    const profile = await StudentProfile.findOne({ userId: user._id });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        college: user.college,
        degree: user.degree,
        department: user.department
      },
      profile
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const profile = await StudentProfile.findOne({ userId: user._id });
    const readiness = await CareerReadinessScore.findOne({ userId: user._id });

    res.json({
      success: true,
      user,
      profile,
      readiness
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

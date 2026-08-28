import mongoose from 'mongoose';
import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { CareerReadinessScore } from '../models/CareerReadinessScore';
import { ReadinessCalculator } from '../services/readinessCalculator';
import { connectDB } from '../config/db';

async function testCleanSlateFlow() {
  await connectDB();
  const testEmail = 'fresh.student.' + Date.now() + '@vcorp.local';

  console.log('Testing Clean Slate Flow for new student:', testEmail);

  // 1. Create fresh user
  const user = await User.create({
    fullName: 'Ananya Sharma',
    email: testEmail,
    passwordHash: 'dummyHash',
    role: 'student',
    college: 'IIT Madras',
    degree: 'B.Tech',
    department: 'Computer Science and Engineering',
    graduationYear: 2026,
    targetRole: 'Software Developer'
  });

  // 2. Create clean profile
  const profile = await StudentProfile.create({
    userId: user._id,
    fullName: user.fullName,
    email: user.email,
    college: user.college,
    degree: user.degree,
    department: user.department,
    graduationYear: user.graduationYear,
    targetRole: user.targetRole,
    careerInterests: ['Distributed Systems'],
    skills: [],
    verifiedSkills: [],
    xp: 0,
    level: 1,
    streakDays: 0,
    careerReadinessScore: 0,
    readinessTier: 'Not Calculated',
    isAssessed: false
  });

  console.log('Initial State: XP:', profile.xp, '| Level:', profile.level, '| Readiness:', profile.careerReadinessScore, '| Tier:', profile.readinessTier);

  if (profile.xp !== 0 || profile.level !== 1 || profile.careerReadinessScore !== 0 || profile.readinessTier !== 'Not Calculated') {
    throw new Error('Clean slate violation!');
  }

  // 3. Recalculate readiness on clean user
  const initialReadiness = await ReadinessCalculator.recalculateFromDB(user._id.toString());
  console.log('Readiness before any activity: Overall:', initialReadiness.overallScore, '| Tier:', initialReadiness.tier, '| IsCalculated:', initialReadiness.isCalculated);

  if (initialReadiness.overallScore !== 0 || initialReadiness.tier !== 'Not Calculated') {
    throw new Error('Readiness calculation violation on clean account!');
  }

  // Cleanup test user
  await User.findByIdAndDelete(user._id);
  await StudentProfile.findByIdAndDelete(profile._id);
  await CareerReadinessScore.findOneAndDelete({ userId: user._id });

  console.log('CLEAN SLATE PRINCIPLE VERIFIED 100% SUCCESSFUL!');
  await mongoose.disconnect();
}

testCleanSlateFlow().catch((err) => {
  console.error('Clean slate test failed:', err);
  process.exit(1);
});

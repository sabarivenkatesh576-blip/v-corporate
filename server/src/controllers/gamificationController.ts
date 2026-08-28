import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { StudentProfile } from '../models/StudentProfile';
import { XPTransaction } from '../models/XPTransaction';
import { Badge } from '../models/Badge';
import { BADGES_CATALOG } from '../shared/constants';

export const getGamificationOverview = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const transactions = await XPTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    const unlockedBadges = await Badge.find({ userId: req.user._id });

    const totalXP = profile?.xp || 0;
    const currentLevel = Math.max(1, Math.floor(totalXP / 500) + 1);
    const xpInCurrentLevel = totalXP % 500;
    const nextLevelXP = 500;
    const progressPercent = Math.round((xpInCurrentLevel / nextLevelXP) * 100);

    const unlockedBadgeIds = new Set(unlockedBadges.map(b => b.badgeId));

    const badges = BADGES_CATALOG.map(b => ({
      ...b,
      isUnlocked: unlockedBadgeIds.has(b.id),
      unlockedAt: unlockedBadges.find(ub => ub.badgeId === b.id)?.unlockedAt || null
    }));

    res.json({
      success: true,
      xp: totalXP,
      level: currentLevel,
      xpInCurrentLevel,
      nextLevelXP,
      progressPercent,
      streakDays: profile?.streakDays || 0,
      badges,
      unlockedCount: unlockedBadges.length,
      totalBadgesCount: BADGES_CATALOG.length,
      recentTransactions: transactions
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const students = await StudentProfile.find({})
      .sort({ xp: -1, careerReadinessScore: -1 })
      .limit(50);

    const rankList = students.map((s, index) => ({
      rank: index + 1,
      userId: s.userId,
      fullName: s.fullName,
      targetRole: s.targetRole,
      college: s.college,
      xp: s.xp,
      level: s.level,
      careerReadinessScore: s.careerReadinessScore,
      readinessTier: s.readinessTier,
      verifiedSkillsCount: s.verifiedSkills?.length || 0,
      isCurrentUser: s.userId.toString() === req.user._id.toString()
    }));

    res.json({
      success: true,
      leaderboard: rankList
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

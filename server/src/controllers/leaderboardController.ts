import { Request, Response } from 'express';
import { StudentProfile } from '../models/StudentProfile';
import { Team } from '../models/Team';

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const { type = 'individual', role, timeframe = 'all' } = req.query;

    if (type === 'team') {
      const teams = await Team.find().sort({ progressPercentage: -1, createdAt: 1 }).limit(30);
      const teamRankings = teams.map((team, idx) => ({
        rank: idx + 1,
        teamId: team._id,
        teamCode: team.teamCode,
        teamName: team.name,
        projectTitle: team.projectTitle,
        role: team.role,
        memberCount: team.members.length,
        progressPercentage: team.progressPercentage,
        collaborationScore: Math.min(100, Math.round(75 + team.progressPercentage * 0.25))
      }));

      return res.json({ success: true, type: 'team', rankings: teamRankings });
    }

    // Individual Leaderboard
    const filter: any = {};
    if (role && role !== 'All Roles') {
      filter.targetRole = role;
    }

    const profiles = await StudentProfile.find(filter)
      .sort({ careerReadinessScore: -1, xp: -1 })
      .limit(50);

    const rankings = profiles.map((p, idx) => ({
      rank: idx + 1,
      userId: p.userId,
      fullName: p.fullName,
      email: p.email,
      college: p.college,
      targetRole: p.targetRole,
      xp: p.xp,
      level: p.level,
      streakDays: p.streakDays,
      readinessScore: p.careerReadinessScore,
      tier: p.readinessTier
    }));

    res.json({
      success: true,
      type: 'individual',
      total: rankings.length,
      rankings
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Team } from '../models/Team';
import { TeamMessage } from '../models/TeamMessage';
import { Project } from '../models/Project';
import { CredentialService } from '../services/credentialService';
import { ReadinessCalculator } from '../services/readinessCalculator';

export const getUserTeams = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await Team.find({ 'members.userId': req.user._id });
    res.json({ success: true, teams });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, projectId, description = '', roleInTeam = 'Team Leader' } = req.body;
    if (!name || !projectId) {
      return res.status(400).json({ error: 'Team name and project are required.' });
    }

    const project = await Project.findOne({ projectId }) || await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    // Generate unique code like VC-BA-4821
    const prefix = project.role.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const teamCode = `VC-${prefix}-${randomDigits}`;

    const team = await Team.create({
      teamCode,
      name,
      description,
      projectId: project.projectId,
      projectTitle: project.title,
      role: project.role,
      leaderId: req.user._id,
      maxMembers: 4,
      members: [
        {
          userId: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          roleInTeam,
          assignedTasks: project.tasks.slice(0, 2).map(t => t.taskId),
          joinedAt: new Date()
        }
      ],
      progressPercentage: 15
    });

    // Create initial announcement message
    await TeamMessage.create({
      teamId: team._id,
      channel: '#general',
      senderId: req.user._id,
      senderName: 'V-CORP System',
      text: `🎉 Team "${team.name}" has been created! Welcome to your project workspace. Invite members using join code: **${team.teamCode}**`
    });

    await CredentialService.unlockBadge(req.user._id.toString(), 'team-leader');
    await ReadinessCalculator.updateComponent(req.user._id.toString(), { teamwork: 70 });

    res.status(201).json({ success: true, team });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const joinTeamByCode = async (req: AuthRequest, res: Response) => {
  try {
    const { teamCode, roleInTeam = 'Developer' } = req.body;
    if (!teamCode) {
      return res.status(400).json({ error: 'Team code is required.' });
    }

    const team = await Team.findOne({ teamCode: teamCode.trim().toUpperCase() });
    if (!team) {
      return res.status(404).json({ error: 'Team not found with the provided code.' });
    }

    const isMember = team.members.some(m => m.userId.toString() === req.user._id.toString());
    if (isMember) {
      return res.json({ success: true, message: 'You are already a member of this team.', team });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: 'Team has reached maximum capacity (4 members).' });
    }

    team.members.push({
      userId: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      roleInTeam,
      assignedTasks: [],
      joinedAt: new Date()
    });

    await team.save();

    await TeamMessage.create({
      teamId: team._id,
      channel: '#general',
      senderId: req.user._id,
      senderName: 'V-CORP System',
      text: `👋 **${req.user.fullName}** joined the team as **${roleInTeam}**!`
    });

    await CredentialService.unlockBadge(req.user._id.toString(), 'team-player');
    await ReadinessCalculator.updateComponent(req.user._id.toString(), { teamwork: 75 });

    res.json({ success: true, team });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamDetails = async (req: AuthRequest, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }
    res.json({ success: true, team });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channel = '#general' } = req.query;
    const messages = await TeamMessage.find({
      teamId: req.params.id,
      channel
    }).sort({ createdAt: 1 }).limit(100);

    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSharedWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const { codeSnippet, notes, spreadsheetData } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found.' });
    }

    if (!team.sharedWorkspaceData) {
      team.sharedWorkspaceData = {};
    }

    if (codeSnippet !== undefined) team.sharedWorkspaceData.codeSnippet = codeSnippet;
    if (notes !== undefined) team.sharedWorkspaceData.notes = notes;
    if (spreadsheetData !== undefined) team.sharedWorkspaceData.spreadsheetData = spreadsheetData;

    await team.save();
    res.json({ success: true, sharedWorkspaceData: team.sharedWorkspaceData });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

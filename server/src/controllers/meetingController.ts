import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Meeting } from '../models/Meeting';
import { AIService } from '../services/aiService';
import { ReadinessCalculator } from '../services/readinessCalculator';

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const meetings = await Meeting.find({
      $or: [
        { hostId: req.user._id },
        { 'participants.userId': req.user._id }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, meetings });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getMeetingById = async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id }) || await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }
    res.json({ success: true, meeting });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const scheduleMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const { title, teamId, projectId, date, time, durationMinutes = 30, agenda } = req.body;
    if (!title || !agenda) {
      return res.status(400).json({ error: 'Meeting title and agenda are required.' });
    }

    const meetingId = `MEET-${Math.floor(100000 + Math.random() * 900000)}`;

    const meeting = await Meeting.create({
      meetingId,
      title,
      teamId,
      projectId,
      hostId: req.user._id,
      hostName: req.user.fullName,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '11:00 AM',
      durationMinutes,
      agenda,
      status: 'scheduled',
      participants: [
        {
          userId: req.user._id,
          fullName: req.user.fullName,
          joined: true
        }
      ],
      notes: {
        summary: `Sprint sync for ${title}.`,
        decisions: ['Align on task distribution.'],
        actionItems: [
          { item: 'Review specifications', assignee: req.user.fullName, status: 'pending' }
        ],
        aiMinutes: ''
      }
    });

    res.status(201).json({ success: true, meeting });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMeetingNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { summary, decisions, actionItems } = req.body;
    const meeting = await Meeting.findOne({ meetingId: req.params.id }) || await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    if (!meeting.notes) {
      meeting.notes = { summary: '', decisions: [], actionItems: [], aiMinutes: '' };
    }

    if (summary !== undefined) meeting.notes.summary = summary;
    if (decisions !== undefined) meeting.notes.decisions = decisions;
    if (actionItems !== undefined) meeting.notes.actionItems = actionItems;

    await meeting.save();
    res.json({ success: true, notes: meeting.notes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const generateAIMeetingMinutes = async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id }) || await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found.' });
    }

    const aiSummary = await AIService.summarizeMeeting(
      meeting.title,
      meeting.agenda,
      meeting.notes?.summary || ''
    );

    if (!meeting.notes) {
      meeting.notes = { summary: '', decisions: [], actionItems: [], aiMinutes: '' };
    }

    meeting.notes.summary = aiSummary.summary;
    meeting.notes.decisions = aiSummary.decisions;
    meeting.notes.actionItems = aiSummary.actionItems;
    meeting.notes.aiMinutes = aiSummary.aiMinutes;

    await meeting.save();

    await ReadinessCalculator.updateComponent(req.user._id.toString(), {
      communication: 80,
      teamwork: 80
    });

    res.json({
      success: true,
      notes: meeting.notes
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

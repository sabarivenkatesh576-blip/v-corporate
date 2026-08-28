import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AIService } from '../services/aiService';
import { StudentProfile } from '../models/StudentProfile';

export const chatAssistant = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const fullContext = {
      role: profile?.targetRole || 'Software Developer',
      ...context
    };

    const reply = await AIService.chatCorporateAssistant(fullContext, message);

    res.json({
      success: true,
      reply,
      suggestedActions: [
        'Get Hint',
        'Explain Concept',
        'Give Example',
        'Check My Approach',
        'Explain Skill'
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { CommunicationPractice } from '../models/CommunicationPractice';
import { StudentProfile } from '../models/StudentProfile';
import { XPTransaction } from '../models/XPTransaction';
import { ReadinessCalculator } from '../services/readinessCalculator';

const COACHING_MODES = [
  { id: 'executive', name: 'Executive & Strategic', description: 'Concise, high-impact language with clear action items and C-level clarity.' },
  { id: 'technical', name: 'Technical Precision', description: 'Accurate architectural terms, reproducible metrics, and structured logic.' },
  { id: 'client-facing', name: 'Client-Facing & Professional', description: 'Courteous, reassuring, polished phrasing establishing high trust.' },
  { id: 'assertive', name: 'Assertive & Decisive', description: 'Direct statements, ownership, and clear boundaries without ambiguity.' },
  { id: 'diplomatic', name: 'Diplomatic & Tactful', description: 'Constructive conflict resolution, respectful negotiation, and consensus building.' },
  { id: 'crisp', name: 'Crisp & Minimalist', description: 'High signal-to-noise ratio, zero fluff, bullet-oriented communication.' },
  { id: 'empathetic', name: 'Empathetic & Supportive', description: 'Active validation, emotional intelligence, and team empowerment.' },
  { id: 'persuasive', name: 'Persuasive & Pitching', description: 'Value propositions, quantitative ROI evidence, and compelling call-to-action.' }
];

const SAMPLE_SCENARIOS = [
  {
    id: 'sc-1',
    category: 'email',
    title: 'Missed Sprint Deadline & Root Cause Mitigation',
    scenarioDescription: 'You are leading an API service integration. Due to an unannounced third-party breaking schema change, your sprint deliverable will be delayed by 2 days. Write a proactive update email to your Engineering Manager and Product Owner.',
    defaultRecipient: 'Alex Mercer (Engineering Director)',
    recommendedMode: 'executive'
  },
  {
    id: 'sc-2',
    category: 'email',
    title: 'Client Status Update: Production Incident Resolution',
    scenarioDescription: 'A critical payment webhook service suffered a 14-minute outage during peak morning hours. The root cause was a Redis connection pool exhaustion. Draft a post-incident resolution email assuring the enterprise client.',
    defaultRecipient: 'Sarah Jenkins (VP of E-Commerce, RetailCorp)',
    recommendedMode: 'client-facing'
  },
  {
    id: 'sc-3',
    category: 'chat',
    title: 'Cross-Functional Slack Thread: Refactoring vs Feature Delivery',
    scenarioDescription: 'The Product Manager is pushing to skip technical debt refactoring to launch an MVP feature 1 week early. Respond diplomatically yet firmly explaining the reliability and latency risks.',
    defaultRecipient: '#proj-core-platform channel',
    recommendedMode: 'diplomatic'
  },
  {
    id: 'sc-4',
    category: 'email',
    title: 'Salary & Compensation Review Negotiation',
    scenarioDescription: 'You have consistently exceeded sprint KPIs over the past 6 months and completed 2 major critical migrations. Draft a structured compensation review request email to your department head.',
    defaultRecipient: 'Vikram Mehta (Head of Technology)',
    recommendedMode: 'persuasive'
  }
];

export const getCommunicationScenarios = async (req: AuthRequest, res: Response) => {
  try {
    const history = await CommunicationPractice.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      coachingModes: COACHING_MODES,
      scenarios: SAMPLE_SCENARIOS,
      history
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const analyzeCommunication = async (req: AuthRequest, res: Response) => {
  try {
    const { scenarioId, scenarioTitle, category, coachingMode, draftText, recipient } = req.body;
    if (!draftText || draftText.trim().length < 15) {
      return res.status(400).json({ error: 'Please enter at least 15 characters for analysis.' });
    }

    const wordCount = draftText.trim().split(/\s+/).length;
    let clarity = 75;
    let professionalism = 80;
    let toneAppropriateness = 80;
    let grammarAndSyntax = 85;

    if (wordCount >= 40 && wordCount <= 180) {
      clarity += 10;
      professionalism += 5;
    }
    if (/regards|sincerely|appreciate|timeline|root cause|mitigation|deliverable/i.test(draftText)) {
      professionalism += 10;
      toneAppropriateness += 10;
    }
    if (/sorry for everything|i dunno|pls fix|asap/i.test(draftText)) {
      professionalism -= 15;
      toneAppropriateness -= 10;
    }

    clarity = Math.max(40, Math.min(98, clarity));
    professionalism = Math.max(40, Math.min(98, professionalism));
    toneAppropriateness = Math.max(40, Math.min(98, toneAppropriateness));
    grammarAndSyntax = Math.max(40, Math.min(98, grammarAndSyntax));

    const overallScore = Math.round((clarity + professionalism + toneAppropriateness + grammarAndSyntax) / 4);

    const feedbackPoints = [
      clarity > 80 ? 'Excellent structure with concise problem framing.' : 'Consider opening with a direct bottom-line sentence before context.',
      professionalism > 80 ? 'Tone is respectful, constructive, and action-oriented.' : 'Replace casual contractions with formal workplace phrasing.',
      'Action items and next milestones are articulated clearly.'
    ];

    const enhancedDraft = draftText
      .replace(/i want to tell you/gi, 'I would like to provide an update regarding')
      .replace(/pls/gi, 'please')
      .replace(/asap/gi, 'at your earliest convenience')
      .replace(/sorry/gi, 'thank you for your patience');

    const practiceDoc = await CommunicationPractice.create({
      userId: req.user._id,
      category: category || 'email',
      scenarioId: scenarioId || 'custom',
      scenarioTitle: scenarioTitle || 'Corporate Communication Practice',
      coachingMode: coachingMode || 'executive',
      draftText,
      enhancedDraft,
      recipient: recipient || 'Corporate Stakeholder',
      clarityScore: clarity,
      professionalismScore: professionalism,
      toneScore: toneAppropriateness,
      grammarScore: grammarAndSyntax,
      overallScore,
      feedbackPoints,
      suggestions: [
        'Use bulleted lists for multi-point timelines or action items.',
        'Always specify clear ownership for each downstream task.'
      ],
      xpAwarded: 50
    });

    await StudentProfile.findOneAndUpdate({ userId: req.user._id }, { $inc: { xp: 50 } });
    await XPTransaction.create({
      userId: req.user._id,
      amount: 50,
      source: 'communication_practice',
      description: 'Completed AI Style Manager corporate writing practice (' + (coachingMode || 'executive') + ')'
    });

    await ReadinessCalculator.recalculateFromDB(req.user._id);

    res.json({
      success: true,
      analysis: practiceDoc
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Question } from '../models/Question';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { ReadinessCalculator } from '../services/readinessCalculator';
import { APTITUDE_TOPICS } from '../shared/constants';
import { AssessmentCategory, AssessmentMode } from '../shared/types';

export const getCategoriesAndTopics = async (req: AuthRequest, res: Response) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const quantCount = await Question.countDocuments({ category: 'Quantitative Aptitude' });
    const logicalCount = await Question.countDocuments({ category: 'Logical Reasoning' });
    const verbalCount = await Question.countDocuments({ category: 'Verbal Ability' });

    res.json({
      success: true,
      counts: {
        total: totalQuestions,
        quantitative: quantCount,
        logical: logicalCount,
        verbal: verbalCount
      },
      topics: APTITUDE_TOPICS
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuestionsForTest = async (req: AuthRequest, res: Response) => {
  try {
    const { category, topic, mode = 'practice', count = 10, difficulty } = req.query;

    const filter: any = {};
    if (category && category !== 'Full Assessment') {
      filter.category = category;
    }
    if (topic && topic !== 'All Topics') {
      filter.topic = topic;
    }
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    const limit = Math.min(50, Math.max(5, Number(count) || 10));

    // Exclude correctAnswer and explanation for non-practice timed/mock test
    const isPractice = mode === 'practice';
    const projection = isPractice ? '' : '-correctAnswer -explanation -formula';

    const questions = await Question.find(filter).select(projection).limit(limit);

    res.json({
      success: true,
      mode: mode as AssessmentMode,
      total: questions.length,
      questions
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const { category, mode = 'timed', responses, timeTakenSeconds = 0 } = req.body;
    // responses: Array<{ questionId: string; selectedAnswer: number; timeSpentSeconds: number }>

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'No answers provided for submission.' });
    }

    const questionIds = responses.map(r => r.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const qMap = new Map(questions.map(q => [q._id.toString(), q]));

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const evaluatedResponses: any[] = [];
    const topicPerformance: Record<string, { total: number; correct: number; percentage: number }> = {};
    const weakAreasSet = new Set<string>();

    responses.forEach(r => {
      const q = qMap.get(r.questionId);
      if (!q) return;

      const isAnswered = r.selectedAnswer !== -1 && r.selectedAnswer !== undefined && r.selectedAnswer !== null;
      const isCorrect = isAnswered && r.selectedAnswer === q.correctAnswer;

      if (!isAnswered) unansweredCount++;
      else if (isCorrect) correctCount++;
      else wrongCount++;

      evaluatedResponses.push({
        questionId: q._id,
        question: q.question,
        options: q.options,
        selectedAnswer: r.selectedAnswer,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        formula: q.formula,
        topic: q.topic,
        category: q.category,
        isCorrect,
        timeSpentSeconds: r.timeSpentSeconds || 0
      });

      if (!topicPerformance[q.topic]) {
        topicPerformance[q.topic] = { total: 0, correct: 0, percentage: 0 };
      }
      topicPerformance[q.topic].total += 1;
      if (isCorrect) topicPerformance[q.topic].correct += 1;
    });

    Object.keys(topicPerformance).forEach(topic => {
      const stats = topicPerformance[topic];
      stats.percentage = Math.round((stats.correct / stats.total) * 100);
      if (stats.percentage < 60) {
        weakAreasSet.add(topic);
      }
    });

    const scorePercentage = Math.round((correctCount / Math.max(responses.length, 1)) * 100);

    const attempt = await AssessmentAttempt.create({
      userId: req.user._id,
      category: category || 'Quantitative Aptitude',
      mode,
      totalQuestions: responses.length,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unanswered: unansweredCount,
      scorePercentage,
      timeTakenSeconds,
      questionResponses: evaluatedResponses.map(r => ({
        questionId: r.questionId,
        selectedAnswer: r.selectedAnswer,
        isCorrect: r.isCorrect,
        timeSpentSeconds: r.timeSpentSeconds
      })),
      topicPerformance,
      weakAreas: Array.from(weakAreasSet)
    });

    // Update readiness components
    const updateObj: any = {};
    if (category === 'Quantitative Aptitude') updateObj.aptitude = scorePercentage;
    else if (category === 'Logical Reasoning') updateObj.logicalReasoning = scorePercentage;
    else if (category === 'Verbal Ability') updateObj.verbalAbility = scorePercentage;
    else {
      updateObj.aptitude = scorePercentage;
      updateObj.logicalReasoning = scorePercentage;
      updateObj.verbalAbility = scorePercentage;
    }

    await ReadinessCalculator.updateComponent(req.user._id.toString(), updateObj);

    res.json({
      success: true,
      attemptId: attempt._id,
      scorePercentage,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      unanswered: unansweredCount,
      totalQuestions: responses.length,
      timeTakenSeconds,
      topicPerformance,
      weakAreas: Array.from(weakAreasSet),
      detailedReview: evaluatedResponses
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttemptsHistory = async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await AssessmentAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ success: true, attempts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

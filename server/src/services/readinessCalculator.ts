import { CareerReadinessScore } from '../models/CareerReadinessScore';
import { StudentProfile } from '../models/StudentProfile';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { InterviewSession } from '../models/InterviewSession';
import { Project } from '../models/Project';
import { TaskSubmission } from '../models/TaskSubmission';
import { CommunicationPractice } from '../models/CommunicationPractice';
import { Team } from '../models/Team';
import { Resume } from '../models/Resume';
import { READINESS_WEIGHTS } from '../shared/constants';
import { ReadinessTier } from '../shared/types';

export class ReadinessCalculator {
  static calculateTier(score: number, isCalculated: boolean): ReadinessTier {
    if (!isCalculated || score === 0) return 'Not Calculated';
    if (score >= 91) return 'Industry Ready';
    if (score >= 76) return 'Highly Job Ready';
    if (score >= 61) return 'Job Ready';
    if (score >= 41) return 'Developing';
    return 'Beginner';
  }

  static async recalculateFromDB(userId: string): Promise<any> {
    // 1. Check Resume
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const resumeScore = resume && resume.score ? resume.score : 0;

    // 2. Check Profile & Verified Skills
    const profile = await StudentProfile.findOne({ userId });
    const verifiedCount = profile?.verifiedSkills?.length || 0;
    const skillsScore = Math.min(100, verifiedCount * 20); // 5 verified skills = 100%

    // 3. Check Assessments by category
    const assessments = await AssessmentAttempt.find({ userId });
    let quantScore = 0;
    let logicalScore = 0;
    let verbalScore = 0;
    let quantCount = 0;
    let logicalCount = 0;
    let verbalCount = 0;

    for (const a of assessments) {
      if (a.category === 'Quantitative Aptitude') {
        quantScore += a.score;
        quantCount++;
      } else if (a.category === 'Logical Reasoning') {
        logicalScore += a.score;
        logicalCount++;
      } else if (a.category === 'Verbal Ability') {
        verbalScore += a.score;
        verbalCount++;
      }
    }

    const avgQuant = quantCount > 0 ? Math.round(quantScore / quantCount) : 0;
    const avgLogical = logicalCount > 0 ? Math.round(logicalScore / logicalCount) : 0;
    const avgVerbal = verbalCount > 0 ? Math.round(verbalScore / verbalCount) : 0;

    // 4. Check AI Mock Interviews
    const interviews = await InterviewSession.find({ userId, status: 'completed' });
    let interviewScore = 0;
    if (interviews.length > 0) {
      const sum = interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      interviewScore = Math.round(sum / interviews.length);
    }

    // 5. Check Projects & Task Submissions
    const submissions = await TaskSubmission.find({ userId });
    let projectsScore = 0;
    if (submissions.length > 0) {
      const completedSubmissions = submissions.filter(s => s.status === 'Completed' || s.status === 'Verified');
      projectsScore = Math.min(100, Math.round((completedSubmissions.length / 10) * 100));
    }

    // 6. Check Communication Practice
    const commPractices = await CommunicationPractice.find({ userId });
    let communicationScore = 0;
    if (commPractices.length > 0) {
      const sum = commPractices.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
      communicationScore = Math.round(sum / commPractices.length);
    }

    // 7. Check Teamwork & Squad collaboration
    const teams = await Team.find({ 'members.userId': userId });
    const teamworkScore = Math.min(100, teams.length * 50);

    // 8. Problem Solving composite (Aptitude + Projects)
    const problemSolvingScore = Math.round((avgQuant * 0.5) + (avgLogical * 0.5));

    const isCalculated = (
      assessments.length > 0 ||
      interviews.length > 0 ||
      submissions.length > 0 ||
      commPractices.length > 0 ||
      resumeScore > 0 ||
      verifiedCount > 0
    );

    const components = {
      resume: resumeScore,
      skills: skillsScore,
      aptitude: avgQuant,
      logicalReasoning: avgLogical,
      verbalAbility: avgVerbal,
      aiInterview: interviewScore,
      projects: projectsScore,
      communication: communicationScore,
      teamwork: teamworkScore,
      problemSolving: problemSolvingScore
    };

    let overall = 0;
    if (isCalculated) {
      overall = Math.round(
        components.resume * READINESS_WEIGHTS.resume +
        components.skills * READINESS_WEIGHTS.skills +
        components.aptitude * READINESS_WEIGHTS.aptitude +
        components.logicalReasoning * READINESS_WEIGHTS.logicalReasoning +
        components.verbalAbility * READINESS_WEIGHTS.verbalAbility +
        components.aiInterview * READINESS_WEIGHTS.aiInterview +
        components.projects * READINESS_WEIGHTS.projects +
        components.communication * READINESS_WEIGHTS.communication +
        components.teamwork * READINESS_WEIGHTS.teamwork +
        components.problemSolving * READINESS_WEIGHTS.problemSolving
      );
    }

    const tier = this.calculateTier(overall, isCalculated);

    let readiness = await CareerReadinessScore.findOne({ userId });
    if (!readiness) {
      readiness = new CareerReadinessScore({ userId });
    }

    readiness.overallScore = overall;
    readiness.tier = tier;
    readiness.isCalculated = isCalculated;
    readiness.components = components;
    readiness.lastCalculated = new Date();
    if (isCalculated) {
      readiness.history.push({ date: new Date(), score: overall });
    }
    await readiness.save();

    if (profile) {
      profile.careerReadinessScore = overall;
      profile.readinessTier = tier;
      profile.isAssessed = isCalculated;
      await profile.save();
    }

    return readiness;
  }

  static async updateComponent(userId: string, updates: any): Promise<any> {
    return this.recalculateFromDB(userId);
  }

  static async recalculate(userId: string): Promise<any> {
    return this.recalculateFromDB(userId);
  }
}

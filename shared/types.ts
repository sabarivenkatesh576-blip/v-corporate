export type CareerRole =
  | 'Software Developer'
  | 'Data Analyst'
  | 'Business Analyst'
  | 'Financial Analyst'
  | 'Accountant'
  | 'HR Executive'
  | 'Marketing Executive'
  | 'UI/UX Designer'
  | 'Digital Marketing Executive'
  | 'Consulting Analyst';

export type AssessmentCategory = 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability';

export type AssessmentMode = 'practice' | 'timed' | 'mock' | 'adaptive';

export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ReadinessTier = 'Beginner' | 'Developing' | 'Job Ready' | 'Highly Job Ready' | 'Industry Ready';

export type TaskStatus = 'To Do' | 'In Progress' | 'Under Review' | 'Completed' | 'Verified';

export type TeamRoleType =
  | 'Team Leader'
  | 'Developer'
  | 'Analyst'
  | 'Researcher'
  | 'Presenter'
  | 'Documentation Lead'
  | 'Designer';

export type OfficeZone =
  | 'reception'
  | 'desk'
  | 'projects'
  | 'conference'
  | 'teams'
  | 'learning'
  | 'hr'
  | 'performance'
  | 'credentials';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'admin';
  college?: string;
  degree?: string;
  department?: string;
  academicYear?: string;
  graduationYear?: number;
  targetRole?: CareerRole;
  careerInterests?: string[];
  avatar?: string;
  createdAt?: string;
}

export interface IStudentProfile {
  _id?: string;
  userId: string;
  fullName: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  academicYear: string;
  graduationYear: number;
  targetRole: CareerRole;
  careerInterests: string[];
  bio?: string;
  skills: string[];
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate?: string;
  careerReadinessScore: number;
  readinessTier: ReadinessTier;
}

export interface ICareerReadinessScore {
  userId: string;
  overallScore: number;
  tier: ReadinessTier;
  components: {
    resume: number;          // weight 10%
    skills: number;          // weight 15%
    aptitude: number;        // weight 10%
    logicalReasoning: number;// weight 10%
    verbalAbility: number;   // weight 10%
    aiInterview: number;     // weight 15%
    projects: number;        // weight 20%
    communication: number;   // weight 5%
    teamwork: number;        // weight 2.5%
    problemSolving: number;  // weight 2.5%
  };
  lastCalculated: string;
  history: Array<{
    date: string;
    score: number;
  }>;
}

export interface IParsedResume {
  _id?: string;
  userId: string;
  fileName: string;
  fileUrl?: string;
  rawText: string;
  parsedData: {
    name?: string;
    email?: string;
    phone?: string;
    education: Array<{
      degree?: string;
      institution?: string;
      year?: string;
      grade?: string;
    }>;
    skills: string[];
    projects: Array<{
      title: string;
      description?: string;
      technologies?: string[];
    }>;
    internships: Array<{
      company: string;
      role: string;
      duration?: string;
      responsibilities?: string[];
    }>;
    certifications: string[];
    experience: string[];
    achievements: string[];
  };
  analysis: {
    roleMatchPercentage: number;
    extractedSkills: string[];
    missingSkills: string[];
    weakAreas: string[];
    strengths: string[];
    recommendations: string[];
  };
  createdAt?: string;
}

export interface ISkillGap {
  userId: string;
  targetRole: CareerRole;
  requiredSkills: Array<{
    skill: string;
    category: string;
    importance: 'Critical' | 'Important' | 'Nice-to-Have';
    studentProficiency: number; // 0 to 100
    gapLevel: 'High Gap' | 'Medium Gap' | 'Low Gap' | 'Mastered';
  }>;
  matchScore: number;
  recommendedLearningModules: string[];
  updatedAt?: string;
}

export interface ILearningModule {
  _id: string;
  skill: string;
  title: string;
  description: string;
  role: CareerRole;
  difficulty: QuestionDifficulty;
  estimatedHours: number;
  topics: Array<{
    title: string;
    content: string;
    codeSnippet?: string;
    keyTakeaway: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
  practiceProject: {
    title: string;
    instructions: string;
    starterCode?: string;
  };
}

export interface IQuestion {
  _id: string;
  category: AssessmentCategory;
  topic: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  formula?: string;
  skill: string;
  timeRecommendationSeconds: number;
}

export interface IAssessmentAttempt {
  _id?: string;
  userId: string;
  category: AssessmentCategory | 'Full Assessment';
  mode: AssessmentMode;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unanswered: number;
  scorePercentage: number;
  timeTakenSeconds: number;
  questionResponses: Array<{
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpentSeconds: number;
  }>;
  topicPerformance: Record<string, { total: number; correct: number; percentage: number }>;
  weakAreas: string[];
  createdAt?: string;
}

export interface IInterviewMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export interface IInterviewSession {
  _id?: string;
  userId: string;
  role: CareerRole;
  interviewType: 'HR' | 'Technical' | 'Domain Specific' | 'Behavioral';
  difficulty: QuestionDifficulty;
  status: 'in-progress' | 'completed';
  conversation: IInterviewMessage[];
  questionsAsked: string[];
  evaluation?: {
    overallScore: number; // 0 - 100
    parameters: {
      communication: number;
      confidence: number;
      clarity: number;
      grammar: number;
      technicalKnowledge: number;
      problemSolving: number;
      relevance: number;
      domainKnowledge: number;
      answerQuality: number;
    };
    strengths: string[];
    weaknesses: string[];
    improvementPlan: string[];
    recommendedSkills: string[];
    detailedFeedback: string;
  };
  createdAt?: string;
}

export interface IProjectTask {
  taskId: string;
  title: string;
  description: string;
  deliverableType: 'code' | 'document' | 'spreadsheet' | 'quiz' | 'presentation' | 'file';
  expectedOutput: string;
  starterData?: any;
  status: TaskStatus;
  submission?: {
    content?: string;
    fileUrl?: string;
    submittedAt?: string;
    score?: number;
    feedback?: string;
    evaluatorNotes?: string;
  };
}

export interface IProject {
  _id: string;
  projectId: string;
  title: string;
  role: CareerRole;
  difficulty: QuestionDifficulty;
  problemStatement: string;
  businessContext: string;
  objectives: string[];
  requiredSkills: string[];
  learningOutcomes: string[];
  datasetUrl?: string;
  datasetPreview?: any;
  datasetType?: 'csv' | 'json' | 'excel' | 'api';
  tasks: IProjectTask[];
  deadlineDays: number;
  evaluationRubric: {
    accuracy: number;        // default 25
    problemSolving: number;  // default 25
    industryRelevance: number; // default 20
    presentation: number;    // default 15
    technicalQuality: number;// default 15
  };
  featured?: boolean;
}

export interface ITeamMember {
  userId: string;
  fullName: string;
  email: string;
  roleInTeam: TeamRoleType;
  assignedTasks: string[];
  joinedAt: string;
}

export interface ITeam {
  _id: string;
  teamCode: string; // e.g. VC-BA-4821
  name: string;
  description: string;
  projectId: string;
  projectTitle: string;
  role: CareerRole;
  leaderId: string;
  maxMembers: number;
  members: ITeamMember[];
  progressPercentage: number;
  sharedWorkspaceData?: {
    codeSnippet?: string;
    notes?: string;
    spreadsheetData?: any[];
  };
  createdAt?: string;
}

export interface ITeamMessage {
  _id?: string;
  teamId: string;
  channel: '#general' | '#project-discussion' | '#technical' | '#announcements';
  senderId: string;
  senderName: string;
  text: string;
  attachments?: string[];
  replyTo?: {
    messageId: string;
    senderName: string;
    text: string;
  };
  createdAt?: string;
}

export interface IMeetingNote {
  summary: string;
  decisions: string[];
  actionItems: Array<{
    item: string;
    assignee: string;
    deadline?: string;
    status: 'pending' | 'completed';
  }>;
  aiMinutes?: string;
}

export interface IMeeting {
  _id: string;
  meetingId: string;
  title: string;
  teamId?: string;
  projectId?: string;
  hostId: string;
  hostName: string;
  date: string;
  time: string;
  durationMinutes: number;
  agenda: string;
  participants: Array<{
    userId: string;
    fullName: string;
    joined: boolean;
  }>;
  status: 'scheduled' | 'live' | 'ended';
  notes?: IMeetingNote;
  createdAt?: string;
}

export interface ICredential {
  _id: string;
  credentialId: string; // e.g. VCORP-CERT-884920
  type: 'task_credential' | 'project_certificate' | 'team_certificate' | 'badge';
  userId: string;
  studentName: string;
  title: string;
  role: CareerRole;
  projectName?: string;
  taskTitle?: string;
  teamName?: string;
  skills: string[];
  score: number;
  issuedDate: string;
  verificationUrl: string;
  qrCodeUrl?: string;
  metadata?: Record<string, any>;
}

export interface IBadge {
  _id?: string;
  userId: string;
  badgeId: string;
  title: string;
  description: string;
  icon: string;
  category: 'project' | 'interview' | 'assessment' | 'team' | 'streak' | 'readiness';
  unlockedAt: string;
}

export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  college: string;
  targetRole: CareerRole;
  xp: number;
  level: number;
  projectsCompleted: number;
  readinessScore: number;
  tier: ReadinessTier;
}

export interface INotification {
  _id?: string;
  userId: string;
  type: 'team_invite' | 'task_assigned' | 'meeting_scheduled' | 'interview_result' | 'badge_unlocked' | 'certificate_issued' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export type CareerRole =
  | 'Software Developer'
  | 'Data Analyst'
  | 'Business Analyst'
  | 'Financial Analyst'
  | 'Accountant'
  | 'HR Executive'
  | 'Marketing Executive'
  | 'Digital Marketing Executive'
  | 'UI/UX Designer'
  | 'Consulting Analyst'
  | 'Operations Executive'
  | 'QA/Test Engineer'
  | 'Cloud Associate'
  | 'Cybersecurity Associate'
  | 'Support Engineer';

export type AssessmentCategory = 'Quantitative Aptitude' | 'Logical Reasoning' | 'Verbal Ability';
export type AssessmentMode = 'practice' | 'timed' | 'mock' | 'adaptive';
export type QuestionDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ReadinessTier = 'Not Calculated' | 'Beginner' | 'Developing' | 'Job Ready' | 'Highly Job Ready' | 'Industry Ready';
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
  phone?: string;
  college: string;
  degree: string;
  department: string;
  academicYear: string;
  graduationYear: number;
  targetRole: CareerRole;
  careerInterests: string[];
  bio?: string;
  skills: string[];
  verifiedSkills?: Array<{
    skillName: string;
    level: string;
    verifiedVia: string;
    verifiedAt: string;
  }>;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate?: string;
  careerReadinessScore: number;
  readinessTier: ReadinessTier;
  isAssessed: boolean;
}

export interface ICareerReadinessScore {
  userId: string;
  overallScore: number;
  tier: ReadinessTier;
  isCalculated: boolean;
  components: {
    resume: number;
    skills: number;
    aptitude: number;
    logicalReasoning: number;
    verbalAbility: number;
    aiInterview: number;
    projects: number;
    communication: number;
    teamwork: number;
    problemSolving: number;
  };
  lastCalculated: string;
  history: Array<{
    date: string;
    score: number;
  }>;
}
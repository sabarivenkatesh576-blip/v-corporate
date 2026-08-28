import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CompanyInfo {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  culture: string;
  accentColor: string;
}

export interface CareerRoleInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  keyKPIs: string[];
}

export interface HiringRound {
  id: string;
  roundNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  cutOffScore: number;
  completed: boolean;
  score?: number;
  feedback?: string;
}

export interface SkillGapItem {
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'Critical' | 'Medium' | 'Low';
}

export interface RoleLearningModule {
  id: string;
  skill: string;
  title: string;
  duration: string;
  description: string;
  stepsCount: number;
}

export interface InternshipState {
  status: 'In Progress' | 'Completed' | 'Offer Extended';
  currentWeek: number;
  totalWeeks: number;
  completedWeeks: number;
  weeklyTasks: Array<{
    week: number;
    title: string;
    description: string;
    completed: boolean;
  }>;
}

interface CareerContextType {
  selectedCompany: string;
  targetRole: string;
  setSelectedCompany: (c: string) => void;
  setTargetRole: (r: string) => void;
  companiesList: CompanyInfo[];
  careerRolesList: CareerRoleInfo[];
  currentCompanyInfo: CompanyInfo;
  currentRoleInfo: CareerRoleInfo;
  hiringRounds: HiringRound[];
  activeRound: number;
  setActiveRound: (r: number) => void;
  completeRound: (roundNum: number, score?: number, feedback?: string) => void;
  roleSkills: SkillGapItem[];
  roleLearningModules: RoleLearningModule[];
  activeLearningModuleId: string;
  setActiveLearningModuleId: (id: string) => void;
  activeProject: any;
  setActiveProject: (p: any) => void;
  completeProjectStep: (stepNum: number) => void;
  projectStepProgress: number;
  aiManagerMessages: Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>;
  sendAiManagerMessage: (msg: string) => void;
  internshipStatus: InternshipState;
  submitInternshipWeekTask: (weekNum: number) => void;
  credentials: Array<{ id: string; title: string; date: string }>;
  addBadge: (badge: { id: string; title: string }) => void;
}

const COMPANIES: CompanyInfo[] = [
  { id: 'deloitte', name: 'Deloitte', industry: 'Consulting & Advisory', tagline: 'Make an impact that matters', description: 'Global leader in audit, consulting, tax and advisory services.', culture: 'Collaborative, structured frameworks, high analytical rigor.', accentColor: '#86bc25' },
  { id: 'ey', name: 'EY', industry: 'Financial Advisory & Assurance', tagline: 'Building a better working world', description: 'Assurance, consulting, strategy and transactions, and tax services.', culture: 'Client centric, analytical depth, ethical leadership.', accentColor: '#ffe600' },
  { id: 'kpmg', name: 'KPMG', industry: 'Professional Services', tagline: 'Inspire Confidence. Empower Change.', description: 'Audit, Tax and Advisory services focused on integrity and innovation.', culture: 'Fact-based reasoning, agile problem solving.', accentColor: '#00338d' },
  { id: 'tcs', name: 'TCS', industry: 'Information Technology', tagline: 'Building on Belief', description: 'Global leader in IT services, consulting, and business solutions.', culture: 'Engineering excellence, large scale enterprise transformation.', accentColor: '#0070ad' },
  { id: 'infosys', name: 'Infosys', industry: 'Information Technology & Consulting', tagline: 'Navigate your next', description: 'Digital services and next-generation consulting leader.', culture: 'Continuous learning, structured engineering, digital fluency.', accentColor: '#007cc3' },
  { id: 'accenture', name: 'Accenture', industry: 'Strategy & Management Consulting', tagline: 'Let there be change', description: 'Delivering 360-degree value across cloud, AI, and enterprise tech.', culture: 'Outcome driven, cross-functional collaboration.', accentColor: '#a100ff' },
  { id: 'microsoft', name: 'Microsoft', industry: 'Big Tech & Cloud Platforms', tagline: 'Empower every person and organization', description: 'Worldwide leader in software, cloud computing, and AI systems.', culture: 'Growth mindset, customer obsession, scalable architecture.', accentColor: '#00a4ef' },
  { id: 'amazon', name: 'Amazon', industry: 'Cloud & E-Commerce', tagline: 'Earth’s most customer-centric company', description: 'Pioneering e-commerce, cloud infrastructure, and distributed systems.', culture: 'Customer obsession, bias for action, deep dive.', accentColor: '#ff9900' },
  { id: 'flipkart', name: 'Flipkart', industry: 'E-Commerce & Supply Chain', tagline: 'India ka fashion & commerce capital', description: 'India’s leading digital commerce ecosystem with hyper-scale logistics.', culture: 'Customer first, speed, frugality, innovation.', accentColor: '#2874f0' }
];

const ROLES: CareerRoleInfo[] = [
  { id: 'ba', title: 'Business Analyst', category: 'Analytics & Consulting', description: 'Bridges business requirements and technology solutions using data-driven insights.', techStack: ['Excel (VLOOKUP, Pivot)', 'Power BI', 'SQL', 'BRD/FRD Documentation', 'Process Flowcharting'], keyKPIs: ['Revenue Leakage Identification', 'ROI Analysis', 'Stakeholder Alignment', 'Requirements Traceability'] },
  { id: 'da', title: 'Data Analyst', category: 'Data & Business Intelligence', description: 'Extracts, cleans, analyzes, and visualizes complex data to drive business decisions.', techStack: ['SQL (Joins, CTEs, Window Fns)', 'Power BI / Tableau', 'Python / Pandas', 'Excel Analytics'], keyKPIs: ['Churn Rate Reduction', 'Customer Lifetime Value (CLV)', 'Query Optimization', 'Dashboard SLA'] },
  { id: 'fa', title: 'Financial Analyst', category: 'Finance & Accounting', description: 'Builds financial models, analyzes budgets, and conducts valuation for investment decisions.', techStack: ['Excel Financial Modeling', 'DCF Valuation', 'Tally Prime', '3-Statement Models'], keyKPIs: ['EBITDA Margin', 'WACC Sensitivity', 'Variance Analysis', 'Forecasting Accuracy'] },
  { id: 'sde', title: 'Software Developer', category: 'Technology & Engineering', description: 'Designs and builds robust, scalable backend services, databases, and client apps.', techStack: ['React', 'Node.js / Express', 'PostgreSQL / SQL', 'REST APIs', 'Data Structures & Algorithms'], keyKPIs: ['API Latency < 100ms', 'Code Test Coverage > 85%', 'Bug Resolution Time', 'System Uptime 99.9%'] },
  { id: 'hra', title: 'HR Analyst', category: 'Human Resources & Talent', description: 'Optimizes talent acquisition, retention, and employee performance using workforce analytics.', techStack: ['Excel Workforce Modeling', 'HR Metrics Dashboard', 'Survey Analytics', 'HRIS Systems'], keyKPIs: ['Attrition Rate', 'Time-to-Hire', 'Offer Acceptance Ratio', 'Employee Net Promoter Score (eNPS)'] },
  { id: 'mkt', title: 'Marketing Analyst', category: 'Marketing & Growth', description: 'Measures campaign ROI, customer acquisition cost, and digital marketing performance.', techStack: ['Google Analytics', 'SQL', 'Power BI Marketing Funnels', 'A/B Testing'], keyKPIs: ['Customer Acquisition Cost (CAC)', 'ROAS', 'Conversion Rate', 'Funnel Drop-off Rate'] },
  { id: 'fina', title: 'Finance Associate', category: 'Finance Operations', description: 'Handles journal entries, ledger reconciliation, working capital, and compliance.', techStack: ['Tally Prime', 'Excel VLOOKUP/INDEX-MATCH', 'GST Reconciliation', 'Working Capital Models'], keyKPIs: ['Reconciliation Accuracy 100%', 'DSO (Days Sales Outstanding)', 'Audit Readiness', 'Closing Cycle Time'] }
];

const DEFAULT_HIRING_ROUNDS: HiringRound[] = [
  { id: 'r1', roundNumber: 1, title: 'Eligibility & Profile Screening', description: 'Verification of academic criteria, CGPA eligibility, and target role prerequisites.', durationMinutes: 10, cutOffScore: 70, completed: true, score: 90, feedback: 'Profile verified and matched successfully.' },
  { id: 'r2', roundNumber: 2, title: 'Cognitive Aptitude & Logical Reasoning', description: 'Quantitative problem solving, pattern recognition, and data interpretation test.', durationMinutes: 30, cutOffScore: 75, completed: true, score: 85, feedback: 'Strong quantitative and reasoning performance.' },
  { id: 'r3', roundNumber: 3, title: 'Role Technical & Domain Assessment', description: 'Role-specific domain assessment covering Excel modeling, SQL, and practical problem solving.', durationMinutes: 45, cutOffScore: 75, completed: false },
  { id: 'r4', roundNumber: 4, title: 'Corporate Communication & Business Email', description: 'Workplace writing, stakeholder email drafting, and executive summary formulation.', durationMinutes: 25, cutOffScore: 70, completed: false },
  { id: 'r5', roundNumber: 5, title: 'Case Study & Problem Statement', description: 'Comprehensive enterprise business scenario requiring diagnosis, root-cause analysis, and presentation.', durationMinutes: 60, cutOffScore: 80, completed: false },
  { id: 'r6', roundNumber: 6, title: 'Behavioral & STAR Technical Viva', description: 'Multi-turn conversational interview testing leadership, situation handling, and culture fit.', durationMinutes: 30, cutOffScore: 75, completed: false },
  { id: 'r7', roundNumber: 7, title: 'Final Selection & Virtual Onboarding', description: 'Official corporate offer issuance, virtual company key handover, and workspace unlocking.', durationMinutes: 15, cutOffScore: 80, completed: false }
];

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCompany, setSelectedCompanyState] = useState<string>(() => {
    return localStorage.getItem('vcorp_selected_company') || 'Deloitte';
  });

  const [targetRole, setTargetRoleState] = useState<string>(() => {
    return localStorage.getItem('vcorp_target_role') || 'Business Analyst';
  });

  const setSelectedCompany = (c: string) => {
    setSelectedCompanyState(c);
    localStorage.setItem('vcorp_selected_company', c);
  };

  const setTargetRole = (r: string) => {
    setTargetRoleState(r);
    localStorage.setItem('vcorp_target_role', r);
  };

  const currentCompanyInfo = COMPANIES.find(c => c.name.toLowerCase() === selectedCompany.toLowerCase()) || COMPANIES[0];
  const currentRoleInfo = ROLES.find(r => r.title.toLowerCase() === targetRole.toLowerCase()) || ROLES[0];

  const [hiringRounds, setHiringRounds] = useState<HiringRound[]>(DEFAULT_HIRING_ROUNDS);
  const [activeRound, setActiveRound] = useState<number>(3);

  const completeRound = (roundNum: number, score: number = 90, feedback: string = 'Passed with distinction!') => {
    setHiringRounds(prev => prev.map(r => {
      if (r.roundNumber === roundNum) {
        return { ...r, completed: true, score, feedback };
      }
      return r;
    }));
  };

  const roleSkills: SkillGapItem[] = [
    { name: 'Advanced Excel & Modeling', category: 'Technical', currentLevel: 75, requiredLevel: 90, gap: 15, priority: 'Critical' },
    { name: 'SQL & Database Queries', category: 'Technical', currentLevel: 70, requiredLevel: 85, gap: 15, priority: 'Critical' },
    { name: 'Power BI / Visual Dashboarding', category: 'Analytics', currentLevel: 65, requiredLevel: 80, gap: 15, priority: 'Critical' },
    { name: 'Business Requirements (BRD/FRD)', category: 'Domain', currentLevel: 80, requiredLevel: 85, gap: 5, priority: 'Medium' },
    { name: 'Stakeholder Communication', category: 'Soft Skills', currentLevel: 82, requiredLevel: 90, gap: 8, priority: 'Medium' },
    { name: 'Financial & KPI Analysis', category: 'Finance', currentLevel: 60, requiredLevel: 80, gap: 20, priority: 'Critical' },
    { name: 'Tally Prime & Ledger Accounting', category: 'Finance Operations', currentLevel: 65, requiredLevel: 75, gap: 10, priority: 'Medium' }
  ];

  const roleLearningModules: RoleLearningModule[] = [
    { id: 'mod_excel', skill: 'Advanced Excel', title: 'Corporate Financial Modeling in Excel', duration: '4 Hours', description: 'VLOOKUP, INDEX-MATCH, XLOOKUP, Nested IFs, Dynamic Pivot Tables, and Sensitivity Analysis.', stepsCount: 8 },
    { id: 'mod_sql', skill: 'SQL & Database Queries', title: 'SQL for Business & Enterprise Analytics', duration: '5 Hours', description: 'Multi-table JOINs, GROUP BY, Aggregate KPIs, Window Functions, Subqueries, and CTEs.', stepsCount: 8 },
    { id: 'mod_powerbi', skill: 'Power BI', title: 'Executive Power BI Dashboard Engineering', duration: '4 Hours', description: 'DAX measures, star schema modeling, interactive slicers, drill-down KPIs, and UI styling.', stepsCount: 8 },
    { id: 'mod_brd', skill: 'BRD/FRD Documentation', title: 'End-to-End BRD & FRD Formulation', duration: '3 Hours', description: 'As-Is vs To-Be process mapping, user stories, acceptance criteria, and traceability matrix.', stepsCount: 8 },
    { id: 'mod_tally', skill: 'Tally Prime', title: 'Tally Prime Ledger & Voucher Accounting', duration: '3.5 Hours', description: 'Debit/Credit voucher entries, bank reconciliations, trial balance checks, and GST.', stepsCount: 8 }
  ];

  const [activeLearningModuleId, setActiveLearningModuleId] = useState<string>('mod_excel');

  const [activeProject, setActiveProject] = useState<any>({
    id: 'prj_capstone_1',
    role: targetRole,
    company: selectedCompany,
    title: `${selectedCompany} Enterprise Optimization & KPI Model`,
    description: `Analyze 50,000+ transaction rows, identify margin variance, build formulas, and submit leadership summaries for ${selectedCompany}.`,
    workspaceType: 'excel',
    datasetName: 'Omnichannel_Transactions.csv',
    stepsCount: 8
  });

  const [projectStepProgress, setProjectStepProgress] = useState<number>(2);

  const completeProjectStep = (stepNum: number) => {
    setProjectStepProgress(prev => Math.max(prev, stepNum));
  };

  const [aiManagerMessages, setAiManagerMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Senior Manager for ${targetRole} at ${selectedCompany}. I am here to review your workspace deliverables, guide you through Excel formulas, SQL queries, and prepare you for client presentations. What are you currently working on?`,
      timestamp: '10:00 AM'
    }
  ]);

  const sendAiManagerMessage = (msg: string) => {
    setAiManagerMessages(prev => [
      ...prev,
      { sender: 'user', text: msg, timestamp: 'Just now' }
    ]);

    setTimeout(() => {
      let reply = `Great question regarding your ${targetRole} work for ${selectedCompany}. Let's break this down systematically.`;
      const lower = msg.toLowerCase();
      if (lower.includes('excel') || lower.includes('formula') || lower.includes('sum')) {
        reply = `For your Excel model, use =SUM(B2:B4) for subtotaling revenue, and calculate Gross Margin using =(Revenue - COGS) / Revenue. Make sure to format cells as percentages and validate in the Interactive Workspace!`;
      } else if (lower.includes('sql') || lower.includes('query')) {
        reply = `In SQL, to group high-value customers, write: SELECT customer_id, SUM(amount) AS total_spend FROM transactions GROUP BY customer_id HAVING SUM(amount) > 10000 ORDER BY total_spend DESC; Run this in the Workspace Code Engine!`;
      } else if (lower.includes('tally') || lower.includes('ledger') || lower.includes('debit')) {
        reply = `For Tally voucher entry, record Debit against the incoming asset (e.g. Bank/Cash) and Credit against the income or capital ledger with clear narration. Check the Tally view in Workspace!`;
      } else {
        reply = `I have logged your update into ${selectedCompany} project tracking. Keep refining your deliverables in the Workspace and ensure your STAR structured presentation is ready for our standup!`;
      }

      setAiManagerMessages(prev => [
        ...prev,
        { sender: 'ai', text: reply, timestamp: 'Just now' }
      ]);
    }, 600);
  };

  const [internshipStatus, setInternshipStatus] = useState<InternshipState>({
    status: 'In Progress',
    currentWeek: 3,
    totalWeeks: 8,
    completedWeeks: 2,
    weeklyTasks: [
      { week: 1, title: 'Corporate Orientation & Environment Setup', description: 'Understand enterprise tools, compliance standards, and workflow architecture.', completed: true },
      { week: 2, title: 'Exploratory Data Cleaning & Baseline Analysis', description: 'Clean raw transaction dataset and validate data types in Excel and SQL.', completed: true },
      { week: 3, title: 'Core Modeling & KPI Formulation', description: 'Build mathematical and financial models to calculate profitability margins.', completed: false },
      { week: 4, title: 'Power BI Dashboard Visualizer', description: 'Build interactive dashboards for cross-regional executive reporting.', completed: false },
      { week: 5, title: 'Mid-Term Deliverable Review with Mentor', description: 'Present findings to AI Senior Manager and incorporate critical feedback.', completed: false },
      { week: 6, title: 'Cross-Functional Team Collaboration', description: 'Work alongside squad teammates to integrate multi-department metrics.', completed: false },
      { week: 7, title: 'STAR Viva & Stakeholder Presentation', description: 'Conduct mock presentation defending recommendations against leadership inquiries.', completed: false },
      { week: 8, title: 'Capstone Finalization & Credential Issuance', description: 'Publish final artifacts to Credential Vault and unlock certificate of completion.', completed: false }
    ]
  });

  const submitInternshipWeekTask = (weekNum: number) => {
    setInternshipStatus(prev => ({
      ...prev,
      completedWeeks: Math.max(prev.completedWeeks, weekNum),
      weeklyTasks: prev.weeklyTasks.map(w => w.week === weekNum ? { ...w, completed: true } : w)
    }));
  };

  const [credentials, setCredentials] = useState<Array<{ id: string; title: string; date: string }>>([
    { id: 'bdg_01', title: `${selectedCompany} Orientation Verified`, date: 'Aug 2026' },
    { id: 'bdg_02', title: `${targetRole} Advanced Excel Specialist`, date: 'Aug 2026' },
    { id: 'bdg_03', title: 'Corporate Cognitive Aptitude Honors', date: 'Aug 2026' },
    { id: 'bdg_04', title: 'Enterprise SQL Master', date: 'Aug 2026' }
  ]);

  const addBadge = (badge: { id: string; title: string }) => {
    if (!credentials.some(b => b.id === badge.id)) {
      setCredentials(prev => [...prev, { id: badge.id, title: badge.title, date: 'Aug 2026' }]);
    }
  };

  return (
    <CareerContext.Provider
      value={{
        selectedCompany,
        targetRole,
        setSelectedCompany,
        setTargetRole,
        companiesList: COMPANIES,
        careerRolesList: ROLES,
        currentCompanyInfo,
        currentRoleInfo,
        hiringRounds,
        activeRound,
        setActiveRound,
        completeRound,
        roleSkills,
        roleLearningModules,
        activeLearningModuleId,
        setActiveLearningModuleId,
        activeProject,
        setActiveProject,
        completeProjectStep,
        projectStepProgress,
        aiManagerMessages,
        sendAiManagerMessage,
        internshipStatus,
        submitInternshipWeekTask,
        credentials,
        addBadge
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = (): CareerContextType => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};

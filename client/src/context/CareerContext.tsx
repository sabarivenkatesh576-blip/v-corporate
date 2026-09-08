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
  { id: 'r1', roundNumber: 1, title: 'Eligibility & Profile Screening', description: 'Verification of academic criteria, CGPA eligibility, and target role prerequisites.', durationMinutes: 10, cutOffScore: 70, completed: false },
  { id: 'r2', roundNumber: 2, title: 'Cognitive Aptitude & Logical Reasoning', description: 'Quantitative problem solving, pattern recognition, and data interpretation test.', durationMinutes: 30, cutOffScore: 75, completed: false },
  { id: 'r3', roundNumber: 3, title: 'Role Technical & Domain Assessment', description: 'Role-specific domain assessment covering Excel modeling, SQL, and practical problem solving.', durationMinutes: 45, cutOffScore: 75, completed: false },
  { id: 'r4', roundNumber: 4, title: 'Corporate Communication & Business Email', description: 'Workplace writing, stakeholder email drafting, and executive summary formulation.', durationMinutes: 25, cutOffScore: 70, completed: false },
  { id: 'r5', roundNumber: 5, title: 'Case Study & Problem Statement', description: 'Comprehensive enterprise business scenario requiring diagnosis, root-cause analysis, and presentation.', durationMinutes: 60, cutOffScore: 80, completed: false },
  { id: 'r6', roundNumber: 6, title: 'Behavioral & STAR Technical Viva', description: 'Multi-turn conversational interview testing leadership, situation handling, and culture fit.', durationMinutes: 30, cutOffScore: 75, completed: false },
  { id: 'r7', roundNumber: 7, title: 'Final Selection & Virtual Onboarding', description: 'Official corporate offer issuance, virtual company key handover, and workspace unlocking.', durationMinutes: 15, cutOffScore: 80, completed: false }
];

const DEFAULT_CLEAN_INTERNSHIP: InternshipState = {
  status: 'In Progress',
  currentWeek: 1,
  totalWeeks: 4,
  completedWeeks: 0,
  weeklyTasks: [
    { week: 1, title: 'Enterprise SQL Pipeline & Account Analysis', description: 'Query corporate transaction records with GROUP BY and HAVING filters.', completed: false },
    { week: 2, title: 'Interactive Spreadsheet Modeling & Anomaly Diagnosis', description: 'Calculate portfolio Gross Margin and aggregate Revenue in Excel.', completed: false },
    { week: 3, title: 'Agile FRD & Anomaly Alert Specification', description: 'Draft user stories and define webhook alert latency for audit compliance.', completed: false },
    { week: 4, title: 'DCF Valuation, Profit Recovery & Capstone Sign-off', description: 'Compute discounted cash flow valuation, sensitivity rate, and cost savings.', completed: false }
  ]
};

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

  const [hiringRounds, setHiringRounds] = useState<HiringRound[]>(() => {
    try {
      const saved = localStorage.getItem('vcorp_hiring_rounds');
      if (saved) {
        const parsed: HiringRound[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed[0]?.score === 90 && parsed[1]?.score === 85 && !parsed[2]?.completed) {
          localStorage.setItem('vcorp_hiring_rounds', JSON.stringify(DEFAULT_HIRING_ROUNDS));
          return DEFAULT_HIRING_ROUNDS;
        }
        return parsed;
      }
      return DEFAULT_HIRING_ROUNDS;
    } catch {
      return DEFAULT_HIRING_ROUNDS;
    }
  });

  const [activeRound, setActiveRoundState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vcorp_active_round');
      if (saved === '3') {
        localStorage.setItem('vcorp_active_round', '1');
        return 1;
      }
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const setActiveRound = (r: number) => {
    setActiveRoundState(r);
    localStorage.setItem('vcorp_active_round', String(r));
  };

  const completeRound = (roundNum: number, score: number = 90, feedback: string = 'Passed with distinction!') => {
    setHiringRounds(prev => {
      const updated = prev.map(r => {
        if (r.roundNumber === roundNum) {
          return { ...r, completed: true, score, feedback };
        }
        return r;
      });
      localStorage.setItem('vcorp_hiring_rounds', JSON.stringify(updated));
      return updated;
    });
    setActiveRound(Math.min(7, roundNum + 1));
  };

  const roleSkills: SkillGapItem[] = [
    { name: 'Advanced Excel & Modeling', category: 'Technical', currentLevel: 50, requiredLevel: 90, gap: 40, priority: 'Critical' },
    { name: 'SQL & Database Queries', category: 'Technical', currentLevel: 45, requiredLevel: 85, gap: 40, priority: 'Critical' },
    { name: 'Power BI / Visual Dashboarding', category: 'Analytics', currentLevel: 40, requiredLevel: 80, gap: 40, priority: 'Critical' },
    { name: 'Business Requirements (BRD/FRD)', category: 'Domain', currentLevel: 55, requiredLevel: 85, gap: 30, priority: 'Medium' },
    { name: 'Stakeholder Communication', category: 'Soft Skills', currentLevel: 60, requiredLevel: 90, gap: 30, priority: 'Medium' },
    { name: 'Financial & KPI Analysis', category: 'Finance', currentLevel: 45, requiredLevel: 80, gap: 35, priority: 'Critical' },
    { name: 'Tally Prime & Ledger Accounting', category: 'Finance Operations', currentLevel: 40, requiredLevel: 75, gap: 35, priority: 'Medium' }
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

  const [projectStepProgress, setProjectStepProgress] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('vcorp_project_step');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  });

  const completeProjectStep = (stepNum: number) => {
    setProjectStepProgress(prev => {
      const next = Math.max(prev, stepNum);
      localStorage.setItem('vcorp_project_step', String(next));
      return next;
    });
  };

  const [aiManagerMessages, setAiManagerMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; timestamp: string }>>([
    {
      sender: 'ai',
      text: `Hello! I am your Senior Practice Director for ${targetRole} at ${selectedCompany}. I am here to review your workspace deliverables, guide you through Excel formulas, SQL queries, and prepare you for corporate readiness. What questions can I answer for you today?`,
      timestamp: 'Just now'
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
        reply = `For your Excel model, use =SUM(E2:E5) for subtotaling revenue, and calculate Gross Margin using =(Revenue - Cost) / Revenue. Validate this in the Interactive Workstation!`;
      } else if (lower.includes('sql') || lower.includes('query')) {
        reply = `In SQL, use the HAVING clause after GROUP BY to filter groups: SELECT customer_id, SUM(order_amount) FROM corporate_transactions GROUP BY customer_id HAVING SUM(order_amount) >= 250000; Run this in the PostgreSQL Terminal!`;
      } else if (lower.includes('tally') || lower.includes('ledger') || lower.includes('debit')) {
        reply = `For Tally voucher entry, record Debit against the incoming asset (e.g. Bank/Cash) and Credit against the revenue or capital ledger.`;
      } else {
        reply = `I have logged your question into ${selectedCompany} project tracking. Keep working through your active internship sprints and recruitment rounds!`;
      }

      setAiManagerMessages(prev => [
        ...prev,
        { sender: 'ai', text: reply, timestamp: 'Just now' }
      ]);
    }, 600);
  };

  const [internshipStatus, setInternshipStatus] = useState<InternshipState>(() => {
    try {
      const saved = localStorage.getItem('vcorp_internship_status');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedWeeks === 2 && (parsed.totalWeeks === 8 || parsed.weeklyTasks?.length === 8)) {
          localStorage.setItem('vcorp_internship_status', JSON.stringify(DEFAULT_CLEAN_INTERNSHIP));
          return DEFAULT_CLEAN_INTERNSHIP;
        }
        return parsed;
      }
      return DEFAULT_CLEAN_INTERNSHIP;
    } catch {
      return DEFAULT_CLEAN_INTERNSHIP;
    }
  });

  const submitInternshipWeekTask = (weekNum: number) => {
    setInternshipStatus(prev => {
      const updated = {
        ...prev,
        completedWeeks: Math.max(prev.completedWeeks, weekNum),
        currentWeek: Math.min(prev.totalWeeks, weekNum + 1),
        weeklyTasks: prev.weeklyTasks.map(w => w.week === weekNum ? { ...w, completed: true } : w)
      };
      localStorage.setItem('vcorp_internship_status', JSON.stringify(updated));
      return updated;
    });
  };

  const [credentials, setCredentials] = useState<Array<{ id: string; title: string; date: string }>>(() => {
    try {
      const saved = localStorage.getItem('vcorp_credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(b => b.id === 'bdg_01' || b.id === 'bdg_02')) {
          localStorage.setItem('vcorp_credentials', JSON.stringify([]));
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const addBadge = (badge: { id: string; title: string }) => {
    setCredentials(prev => {
      if (!prev.some(b => b.id === badge.id)) {
        const updated = [...prev, { id: badge.id, title: badge.title, date: 'Verified' }];
        localStorage.setItem('vcorp_credentials', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
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

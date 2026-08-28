import { CareerRole, AssessmentCategory } from './types';

export const CAREER_ROLES: Array<{
  title: CareerRole;
  category: 'Tech' | 'Data' | 'Business' | 'Finance' | 'Creative' | 'Management';
  description: string;
  requiredSkills: string[];
  recommendedProjectsCount: number;
  averageSalary: string;
}> = [
  {
    title: 'Software Developer',
    category: 'Tech',
    description: 'Designs, builds, and maintains robust scalable web services, APIs, and microservices.',
    requiredSkills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'SQL', 'Git', 'REST APIs', 'System Design', 'Testing'],
    recommendedProjectsCount: 20,
    averageSalary: '₹7.5 - 14 LPA'
  },
  {
    title: 'Data Analyst',
    category: 'Data',
    description: 'Extracts actionable business insights from raw structured and unstructured data using analytics pipelines.',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Data Cleaning', 'Exploratory Data Analysis', 'Pandas', 'Business Metrics'],
    recommendedProjectsCount: 20,
    averageSalary: '₹6.5 - 12 LPA'
  },
  {
    title: 'Business Analyst',
    category: 'Business',
    description: 'Bridges the gap between business stakeholders and technical teams with requirements modeling and workflow optimization.',
    requiredSkills: ['Requirement Analysis', 'User Stories', 'Process Mapping (BPMN)', 'Agile/Scrum', 'SQL', 'Excel', 'Wireframing', 'Stakeholder Management', 'Cost-Benefit Analysis', 'Documentation'],
    recommendedProjectsCount: 20,
    averageSalary: '₹7.0 - 13 LPA'
  },
  {
    title: 'Financial Analyst',
    category: 'Finance',
    description: 'Conducts quantitative financial modeling, valuation, portfolio analysis, and corporate budgeting.',
    requiredSkills: ['Financial Modeling', 'DCF Valuation', 'Ratio Analysis', 'Excel Advanced', 'Financial Statements', 'Budgeting', 'Risk Assessment', 'Corporate Finance', 'Forecasting', 'PowerPoint'],
    recommendedProjectsCount: 20,
    averageSalary: '₹7.0 - 14 LPA'
  },
  {
    title: 'Accountant',
    category: 'Finance',
    description: 'Manages ledger accounting, GST & tax calculations, bank reconciliation, and statutory financial reporting.',
    requiredSkills: ['Double Entry Bookkeeping', 'General Ledger', 'Trial Balance', 'GST & TDS Simulation', 'Tally/ERP', 'Financial Auditing', 'Bank Reconciliation', 'Payroll Processing', 'Tax Compliance', 'Balance Sheet Analysis'],
    recommendedProjectsCount: 20,
    averageSalary: '₹5.0 - 9.5 LPA'
  },
  {
    title: 'HR Executive',
    category: 'Management',
    description: 'Oversees talent acquisition, candidate screening, employee engagement, compensation planning, and HR analytics.',
    requiredSkills: ['Talent Sourcing', 'Interviewing Techniques', 'HR Analytics', 'Onboarding Workflows', 'Performance Management', 'Labor Law Basics', 'Conflict Resolution', 'Employee Engagement', 'HRIS Systems', 'Compensation & Benefits'],
    recommendedProjectsCount: 20,
    averageSalary: '₹5.5 - 10 LPA'
  },
  {
    title: 'Marketing Executive',
    category: 'Creative',
    description: 'Develops marketing campaigns, brand positioning strategies, consumer personas, and multi-channel acquisition funnels.',
    requiredSkills: ['Brand Strategy', 'Market Research', 'Campaign Planning', 'Content Marketing', 'Social Media Strategy', 'Copywriting', 'Consumer Psychology', 'Budget Allocation', 'Competitive Analysis', 'Marketing Funnel'],
    recommendedProjectsCount: 20,
    averageSalary: '₹5.5 - 11 LPA'
  },
  {
    title: 'UI/UX Designer',
    category: 'Creative',
    description: 'Creates user-centric digital experiences, interactive wireframes, design systems, and usability evaluation protocols.',
    requiredSkills: ['Figma', 'User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Accessibility (a11y)', 'Mobile-First UI', 'Design Thinking'],
    recommendedProjectsCount: 20,
    averageSalary: '₹6.5 - 13 LPA'
  },
  {
    title: 'Digital Marketing Executive',
    category: 'Creative',
    description: 'Executes high-ROI digital campaigns, search engine optimization (SEO), paid search/ads, and marketing automation.',
    requiredSkills: ['Search Engine Optimization (SEO)', 'Google Ads / PPC', 'Google Analytics (GA4)', 'Social Media Advertising', 'Email Marketing', 'Conversion Rate Optimization (CRO)', 'A/B Testing', 'Copywriting', 'Marketing Automation', 'Growth Hacking'],
    recommendedProjectsCount: 20,
    averageSalary: '₹5.5 - 10.5 LPA'
  },
  {
    title: 'Consulting Analyst',
    category: 'Business',
    description: 'Solves complex strategic enterprise challenges through rigorous hypothesis-driven problem solving and frameworks.',
    requiredSkills: ['MECE Framework', 'Root Cause Analysis', 'Market Entry Strategy', 'Operational Due Diligence', 'Cost Optimization', 'Executive Presentations', 'Pyramid Principle', 'Benchmarking', 'Financial Feasibility', 'Change Management'],
    recommendedProjectsCount: 20,
    averageSalary: '₹9.0 - 18 LPA'
  }
];

export const VIRTUAL_COMPANIES = [
  {
    id: 'tcs-workspace',
    name: 'TCS-Inspired Technology Workspace',
    industry: 'Enterprise IT & Global Digital Solutions',
    culture: 'Engineering excellence, delivery rigor, robust processes, and scalable enterprise architecture.',
    accentColor: '#1E40AF',
    bgGradient: 'from-blue-900 to-indigo-900',
    icon: 'Terminal',
    tagline: 'Experience enterprise scale agile software engineering.'
  },
  {
    id: 'deloitte-workspace',
    name: 'Deloitte-Inspired Consulting Workspace',
    industry: 'Strategy & Enterprise Transformation',
    culture: 'Strategic clarity, data-driven executive decks, change leadership, and hypothesis testing.',
    accentColor: '#047857',
    bgGradient: 'from-emerald-900 to-teal-900',
    icon: 'Briefcase',
    tagline: 'Drive impactful corporate strategy and high-stakes problem solving.'
  },
  {
    id: 'ey-workspace',
    name: 'EY-Inspired Professional Services Workspace',
    industry: 'Assurance, Tax & Advisory Services',
    culture: 'Audit precision, statutory compliance, risk modeling, and client advisory standards.',
    accentColor: '#B45309',
    bgGradient: 'from-amber-900 to-yellow-900',
    icon: 'ShieldCheck',
    tagline: 'Master precision financial advisory and corporate audit.'
  },
  {
    id: 'kpmg-workspace',
    name: 'KPMG-Inspired Advisory Workspace',
    industry: 'Financial Advisory & Enterprise Risk',
    culture: 'Analytical modeling, forensic scrutiny, transaction advisory, and corporate governance.',
    accentColor: '#1D4ED8',
    bgGradient: 'from-blue-950 to-slate-900',
    icon: 'TrendingUp',
    tagline: 'Analyze complex financial portfolios and corporate valuations.'
  },
  {
    id: 'tech-corp',
    name: 'Nexus Digital Technologies',
    industry: 'Cloud & AI Products',
    culture: 'Fast-paced innovation, continuous deployment, clean architecture, and modern product discovery.',
    accentColor: '#7C3AED',
    bgGradient: 'from-purple-900 to-violet-900',
    icon: 'Cpu',
    tagline: 'Build next-generation digital cloud products.'
  },
  {
    id: 'fin-corp',
    name: 'Apex Global Financial Partners',
    industry: 'Investment Banking & Capital Markets',
    culture: 'Rigorous valuation, market foresight, quantitative trading systems, and deal execution.',
    accentColor: '#0F766E',
    bgGradient: 'from-cyan-950 to-teal-900',
    icon: 'DollarSign',
    tagline: 'High-frequency financial analysis and investment strategies.'
  },
  {
    id: 'analytics-corp',
    name: 'DataPulse Analytics Lab',
    industry: 'Big Data & Business Intelligence',
    culture: 'Statistical discipline, predictive ML models, executive dashboards, and metric instrumentation.',
    accentColor: '#BE123C',
    bgGradient: 'from-rose-950 to-red-900',
    icon: 'BarChart3',
    tagline: 'Turn petabytes of enterprise data into growth intelligence.'
  },
  {
    id: 'consulting-corp',
    name: 'Vanguard Strategy Group',
    industry: 'Management & Operations Consulting',
    culture: 'First-principles business analysis, operational restructuring, and market disruption.',
    accentColor: '#374151',
    bgGradient: 'from-gray-900 to-slate-950',
    icon: 'Compass',
    tagline: 'Architect global business turnarounds and digital roadmaps.'
  },
  {
    id: 'marketing-corp',
    name: 'OmniSphere Creative & Growth Lab',
    industry: 'Global Digital Marketing & Growth',
    culture: 'Creative storytelling, multi-channel growth hacking, viral mechanics, and brand identity.',
    accentColor: '#C026D3',
    bgGradient: 'from-fuchsia-950 to-pink-900',
    icon: 'Sparkles',
    tagline: 'Craft high-converting global brand and digital campaigns.'
  }
];

export const APTITUDE_TOPICS = {
  'Quantitative Aptitude': [
    'Number System', 'Simplification', 'Average', 'Ratio and Proportion',
    'Percentage', 'Profit and Loss', 'Simple Interest', 'Compound Interest',
    'Time and Work', 'Time Speed and Distance', 'Problems on Ages', 'Probability',
    'Permutation and Combination', 'HCF and LCM', 'Algebra', 'Data Interpretation'
  ],
  'Logical Reasoning': [
    'Number Series', 'Alphabet Series', 'Coding and Decoding', 'Blood Relations',
    'Direction Sense', 'Seating Arrangement', 'Data Arrangement', 'Syllogism',
    'Statement and Conclusion', 'Analogy', 'Classification', 'Odd One Out',
    'Logical Puzzles', 'Pattern Recognition'
  ],
  'Verbal Ability': [
    'Parts of Speech', 'Articles', 'Prepositions', 'Tenses',
    'Subject-Verb Agreement', 'Synonyms', 'Antonyms', 'Vocabulary',
    'Sentence Correction', 'Error Detection', 'Fill in the Blanks', 'Sentence Completion',
    'Reading Comprehension', 'Para Jumbles'
  ]
};

export const BADGES_CATALOG = [
  {
    id: 'first-project',
    title: 'First Project Pioneer',
    description: 'Completed your very first industry project with distinction.',
    icon: '🚀',
    category: 'project'
  },
  {
    id: 'interview-ready',
    title: 'Interview Ready Pro',
    description: 'Scored 85%+ in an AI Mock Interview session.',
    icon: '🎙️',
    category: 'interview'
  },
  {
    id: 'problem-solver',
    title: 'Corporate Problem Solver',
    description: 'Solved a high-complexity business case or advanced coding task.',
    icon: '🧩',
    category: 'project'
  },
  {
    id: 'communication-pro',
    title: 'Executive Communicator',
    description: 'Achieved outstanding scores in verbal assessment and team presentations.',
    icon: '🗣️',
    category: 'assessment'
  },
  {
    id: 'team-player',
    title: 'Collaborative Squad Star',
    description: 'Successfully contributed to a 4-person cross-functional team project.',
    icon: '🤝',
    category: 'team'
  },
  {
    id: 'project-finisher',
    title: 'Project Finisher Elite',
    description: 'Delivered 5+ full-stack corporate deliverables ahead of schedule.',
    icon: '🏆',
    category: 'project'
  },
  {
    id: 'data-analyst-badge',
    title: 'Data Ninja',
    description: 'Mastered SQL, statistical modeling, and dashboard creation.',
    icon: '📊',
    category: 'readiness'
  },
  {
    id: 'coding-explorer',
    title: 'Clean Code Architect',
    description: 'Implemented clean scalable code with verified test submissions.',
    icon: '💻',
    category: 'project'
  },
  {
    id: 'team-leader',
    title: 'V-Corp Team Leader',
    description: 'Successfully led a virtual corporate team and coordinated deliverables.',
    icon: '👑',
    category: 'team'
  },
  {
    id: 'streak-master',
    title: 'Daily Corporate Streak',
    description: 'Maintained a 7-day continuous workplace activity streak.',
    icon: '🔥',
    category: 'streak'
  },
  {
    id: 'industry-ready',
    title: 'Industry Ready Champion',
    description: 'Achieved an overall Career Readiness Score of 90+.',
    icon: '🌟',
    category: 'readiness'
  }
];

export const READINESS_WEIGHTS = {
  resume: 0.10,
  skills: 0.15,
  aptitude: 0.10,
  logicalReasoning: 0.10,
  verbalAbility: 0.10,
  aiInterview: 0.15,
  projects: 0.20,
  communication: 0.05,
  teamwork: 0.025,
  problemSolving: 0.025
};

import os, json

os.makedirs('server/src/shared', exist_ok=True)
os.makedirs('client/src/shared', exist_ok=True)

companies_base = [
  {
    'id': 'tcs', 'name': 'Tata Consultancy Services (TCS)', 'shortName': 'TCS',
    'industry': 'IT Services & Consulting', 'headquarters': 'Mumbai, India',
    'accentColor': '#1E40AF', 'bgGradient': 'from-blue-900 to-indigo-900',
    'icon': 'Terminal', 'tagline': 'Experience certainty with global enterprise digital transformation.',
    'relevantRoles': ['Software Developer', 'Data Analyst', 'Cloud Associate', 'QA/Test Engineer', 'Business Analyst']
  },
  {
    'id': 'infosys', 'name': 'Infosys', 'shortName': 'Infosys',
    'industry': 'Digital Services & Consulting', 'headquarters': 'Bangalore, India',
    'accentColor': '#0284C7', 'bgGradient': 'from-sky-900 to-blue-900',
    'icon': 'Cpu', 'tagline': 'Navigate your next with global enterprise technology solutions.',
    'relevantRoles': ['Software Developer', 'Cloud Associate', 'Data Analyst', 'Cybersecurity Associate', 'Consulting Analyst']
  },
  {
    'id': 'wipro', 'name': 'Wipro', 'shortName': 'Wipro',
    'industry': 'Information Technology & Business Process', 'headquarters': 'Bangalore, India',
    'accentColor': '#7C3AED', 'bgGradient': 'from-purple-900 to-indigo-950',
    'icon': 'Network', 'tagline': 'Ambition realized through digital innovation and human ingenuity.',
    'relevantRoles': ['Software Developer', 'Data Analyst', 'QATest Engineer', 'Support Engineer', 'Cloud Associate']
  },
  {
    'id': 'accenture', 'name': 'Accenture', 'shortName': 'Accenture',
    'industry': 'Management Consulting & Technology Services', 'headquarters': 'Dublin / Global',
    'accentColor': '#9333EA', 'bgGradient': 'from-purple-950 to-violet-900',
    'icon': 'Sparkles', 'tagline': 'Let there be change. Innovate at the intersection of business and technology.',
    'relevantRoles': ['Software Developer', 'Business Analyst', 'Consulting Analyst', 'Data Analyst', 'UI/UX Designer']
  },
  {
    'id': 'cognizant', 'name': 'Cognizant (CTS)', 'shortName': 'Cognizant',
    'industry': 'Digital Business & Technology', 'headquarters': 'Teaneck, NJ / Chennai, India',
    'accentColor': '#2563EB', 'bgGradient': 'from-blue-950 to-cyan-950',
    'icon': 'Layers', 'tagline': 'Engineer modern businesses to improve everyday life.',
    'relevantRoles': ['Software Developer', 'QATest Engineer', 'Data Analyst', 'Cloud Associate', 'Support Engineer']
  },
  {
    'id': 'deloitte', 'name': 'Deloitte', 'shortName': 'Deloitte',
    'industry': 'Audit, Consulting, Advisory & Tax', 'headquarters': 'London / Global',
    'accentColor': '#047857', 'bgGradient': 'from-emerald-950 to-teal-900',
    'icon': 'Briefcase', 'tagline': 'Make an impact that matters with world-class strategy and risk advisory.',
    'relevantRoles': ['Business Analyst', 'Consulting Analyst', 'Financial Analyst', 'Software Developer', 'Data Analyst']
  },
  {
    'id': 'ey', 'name': 'Ernst & Young (EY')', 'shortName': 'EY',
    'industry': 'Assurance, Advisory, Strategy & Tax', 'headquarters': 'London / Global',
    'accentColor': '#D97706', 'bgGradient': 'from-amber-950 to-yellow-950',
    'icon': 'ShieldCheck', 'tagline': 'Building a better working world with insight and precision.',
    'relevantRoles': ['Financial Analyst', 'Accountant', 'Business Analyst', 'Consulting Analyst', 'Cybersecurity Associate']
  },
  {
    'id': 'kpmg', 'name': 'KPMG', 'shortName': 'KPMG',
    'industry': 'Audit, Tax & Advisory Services', 'headquarters': 'Amstelveen / Global',
    'accentColor': '#1D44DD8', 'bgGradient': 'from-blue-950 to-slate-900',
    'icon': 'TrendingUp', 'tagline': 'Cutting through complexity with trusted advisory and insight.',
    'relevantRoles': ['Financial Analyst', 'Consulting Analyst', 'Accountant', 'Business Analyst', 'Operations Executive']
  },
  {
    'id': 'pwc', 'name': 'PricewaterhouseCoopers (PwC)', 'shortName': 'PwC',
    'industry': 'Assurance, Tax, Advisory & Consulting', 'headquarters': 'London / Global',
    'accentColor': '#EA580C', 'bgGradient': 'from-orange-950 to-amber-950',
    'icon': 'Compass', 'tagline': 'Build trust and deliver sustained outcomes for global clients.',
    'relevantRoles': ['Consulting Analyst', 'Financial Analyst', 'Business Analyst', 'Software Developer', 'Accountant']
  },
  {
    'id': 'capgemini', 'name': 'Capgemini', 'shortName': 'Capgemini',
    'industry': 'Consulting, Technology Services & Digital Transformation', 'headquarters': 'Paris, France / Global',
    'accentColor': '#0284C7', 'bgGradient': 'from-cyan-950 to-blue-900',
    'icon': 'Globe', 'tagline': 'Get the future you want with world-class digital innovation.',
    'relevantRoles': ['Software Developer', 'Cloud Associate', 'QA/Test Engineer', 'Data Analyst', 'Support Engineer']
  },
  {
    'id': 'ibm', 'name': 'IBM', 'shortName': 'IBM',
    'industry': 'Hybrid Cloud, Enterprise IB & Consulting', 'headquarters': 'Armonk, NY / Global',
    'accentColor': '#1E3A8A', 'bgGradient': 'from-blue-950 to-indigo-950',
    'icon': 'Cpu', 'tagline': 'Let us create something that changes everything with enterprise hybrid cloud and AI.',
    'relevantRoles': ['Software Developer', 'Cloud Associate', 'Cybersecurity Associate', 'Data Analyst', 'Consulting Analyst']
  },
  {
    'id': 'hcltech', 'name': 'HCLTech', 'shortName': 'HCLTech',
    'industry': 'Engineering & R&D, Digital Consulting', 'headquarters': 'Noida, India',
    'accentColor': '#0369A1', 'bgGradient': 'from-sky-950 to-blue-950',
    'icon': 'Radio', 'tagline': 'Supercharging progress for global technology and digital enterprises.',
    'relevantRoles': ['Software Developer', 'Cloud Associate', 'Support Engineer', 'QATest Engineer', 'Data Analyst']
  },
  {
    'id': 'tech-mahindra', 'name': 'Tech Mahindra', 'shortName': 'Tech Mahindra',
    'industry': 'Digital Transformation, Consulting & Re-engineering', 'headquarters': 'Pune, India',
    'accentColor': '#DC2626', 'bgGradient': 'from-red-950 to-slate-900',
    'icon': 'Zap', 'tagline': 'Connected world. Connected experiences. Driving digital transformation.',
    'relevantRoles': ['Software Developer', 'Operations Executive', 'QATest Engineer', 'Data Analyst', 'Support Engineer']
  },
  {
    'id': 'ltimindtree', 'name': 'LTIMindtree', 'shortName': 'LTIMindtree',
    'industry': 'Technology Consulting & Digital Solutions', 'headquarters': 'Mumbai, India',
    'accentColor': '#0D9D88', 'bgGradient': 'from-teal-950 to-emerald-950',
    'icon': 'Layers', 'tagline': 'Getting to the future, faster. Together with enterprise digital scale.',
    'relevantRoles': ['Software Developer', 'Data Analyst', 'Cloud Associate', 'UI/UX Designer', 'Business Analyst']
  },
  {
    'id': 'genpact', 'name': 'Genpact', 'shortName': 'Genpact',
    'industry': 'Professional Services, Analytics & Digital Operations', 'headquarters': 'New York / Gurgaon, India',
    'accentColor': '#059669', 'bgGradient': 'from-emerald-950 to-slate-900',
    'icon': 'BarChart3', 'tagline': 'Transformation happens here. Powering intelligent operations with analytics.',
    'relevantRoles': ['Accountant', 'Financial Analyst', 'Data Analyst', 'Operations Executive', 'Business Analyst']
  }
]

mncs = []
for c in companies_base:
    mncs.append({
        'id': c['id']        'name': c['name'],
        'shortName': c['shortName'],
        'industry': c['industry'],
        'headquarters': c['headquarters'],
        'culture': f\"High performance, client delivery rigor, continuous learning, and scalable enterprise innovation at {c['name']}.\",
        'accentColor': c['accentColor'],
        'bgGradient': c['bgGradient'],
        'icon': c['icon'],
        'tagline': c['tagline'],
        'careerAreas': ['Digital Engineering', 'Enterprise Consulting', 'Cloud & AI', 'Operations'],
        'relevantRoles': c['relevantRoles'],
        'requiredSkills': ['Problem Solving', 'Communication', 'Domain Fundamentals', 'Agile Workflows'],
        'typicalRecruitmentStages': [
            {'stageNumber': 1, 'title': 'National Online Assessment', 'description': 'Quantitative Aptitude, Logical Reasoning, and Verbal Ability.', 'format': 'Online Test', 'durationMinutes': 90},
            {'stageNumber': 2, 'title': 'Domain / Technical Assessment', 'description': 'Hands-on coding, problem solving, or domain business case.', 'format': 'Technical Platform', 'durationMinutes': 60},
            {'stageNumber': 3, 'title': 'Technical & Project Viva', 'description': 'Deep dive into resume projects, CS/Domain fundamentals, and scenario solutions.', 'format': '1-on-1 Panel', 'durationMinutes': 45},
            {'stageNumber': 4, 'title': 'HR & Behavioral Interview', 'description': 'Values alignment, cultural adaptability, situational questions, and communication.', 'format': 'HR Round', 'durationMinutes': 25}
        ],
        'assessmentAreas': ['Aptitude & Logical Reasoning', 'Verbal Fluency', 'Technical/Domain Knowledge'],
        'technicalTopics': ['Core Domain Architecture', 'Database & SQL', 'Object-Oriented Design', 'Industry Standards'],
        'aptitudeTopics': ['Percentages & Ratios', 'Time & Work', 'Syllogisms & Series', 'Sentence Correction'],
        'communicationExpectations': 'Clear, professional, and structured communication with active listening and confidence.',
        'behavioralPreparation': 'STAR method for describing past academic/internship challenges, team conflicts, and ownership.',
        'preparationRoadmap': [
            'Complete V-CORP Aptitude Assessment (Quant, Logical, Verbal)',
            f\"Execute 2+ projects matching {c['name']} role requirements\",
            f\"Practice {c['name']} simulated recruitment journey & AI Mock Interview\"
        ],
        'disclaimer': 'Typical / publicly reported recruitment process'
    })

roles_base = [
  {
    'title': 'Software Developer',
    'category': 'Tech',
    'description': 'Designs, builds, and maintains robust scalable web services, APIs, microservices, and client applications.',
    'requiredSkills': ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'SQL', 'Git', 'REST APIs', 'System Design', 'Testing'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b97.5 - 14 LPA'
  },
  {
    'title': 'Data Analyst',
    'category': 'Data',
    'description': 'Extracts actionable business insights from raw structured and unstructured data using analytics pipelines and dashboards.',
    'requiredSkills': ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Data Cleaning', 'Exploratory Data Analysis', 'Pandas', 'Business Metrics'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b96.5 - 12 LPA'
  },
  {
    'title': 'Business Analyst',
    'category': 'Business',
    'description': 'Bridges the gap between business stakeholders and technical teams with requirements modeling, user stories, and workflow optimization.',
    'requiredSkills': ['Requirement Analysis', 'User Stories', 'Process Mapping (BPMN)', 'Agile/Scrum', 'SQL', 'Excel', 'Wireframing', 'Stakeholder Management', 'Cost-Benefit Analysis', 'Documentation'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b97.0 - 13 LOA'
  },
  {
    'title': 'Financial Analyst',
    'category': 'Finance',
    'description': 'Conducts quantitative financial modeling, DCF valuation, portfolio analysis, variance diagnosis, and corporate budgeting.',
    'requiredSkills': ['Financial Modeling', 'DCF Valuation', 'Ratio Analysis', 'Excel Advanced', 'Financial Statements', 'Budgeting', 'Risk Assessment', 'Corporate Finance', 'Forecasting', 'PowerPoint'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b97.0 - 14 LPA/
  },
  {
    'title': 'Accountant',
    'category': 'Finance',
    'description': 'Manages double-entry bookkeeping, general ledger, trial balance, GST & tax calculations, bank reconciliation, and statutory financial reporting.',
    'requiredSkills': ['Double Entry Bookkeeping', 'General Ledger', 'Trial Balance', 'GST & TDS Simulation', 'Tally/ERP', 'Financial Auditing', 'Bank Reconciliation', 'Payroll Processing', 'Tax Compliance', 'Balance Sheet Analysis'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.0 - 9.5 LOA'
  },
  {
    'title': 'HF Manager',
    'category': 'Management',
    'description': 'Oversees talent acquisition, candidate screening, employee engagement, onboarding, compensation planning, and HR analytics.',
    'requiredSkills': ['Talent Sourcing', 'Interviewing Techniques', 'HR Analytics', 'Onboarding Workflows', 'Performance Management', 'Labor Law Basics', 'Conflict Resolution', 'Employee Engagement', 'HRIS Systems', 'Compensation & Benefits'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.5 - 10 LPA'
  },
  {
    'title': 'Marketing Executive',
    'category': 'Creative',
    'description': 'Develops marketing campaigns, brand positioning strategies, consumer personas, multi-channel funnels, and market research.',
    'requiredSkills': ['Brand Strategy', 'Market Research', 'Campaign Planning', 'Content Marketing', 'Social Media Strategy', 'Copywriting', 'Consumer Psychology', 'Budget Allocation', 'Competitive Analysis', 'Marketing Funnel'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.5 - 11 LOA'
  },
  {
    'title': 'Digital Marketing Executive',
    'category': 'Creative',
    'description': 'Executes high-ROI digital campaigns, search engine optimization (SEO), paid search/ads, conversion rate optimization, and marketing automation.',
    'requiredSkills': ['Search Engine Optimization (SEO)', 'Google Ads / PPC', 'Google Analytics (GA4)', 'Social Media Advertising', 'Email Marketing', 'Conversion Rate Optimization (CRO)', 'A/B Testing', 'Copywriting', 'Marketing Automation', 'Growth Hacking'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.5 - 10.5 LPA/
  },
  {
    'title': 'UI/UX Designer',
    'category': 'Creative',
    'description': 'Creates user-centric digital experiences, interactive wireframes, design systems, user journeys, and usability evaluation protocols.',
    'requiredSkills': ['Figma', 'User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Accessibility (a11y)', 'Mobile-First UI', 'Design Thinking'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b96.5 - 13 LPA/
  },
  {
    'title': 'Consulting Analyst',
    'category': 'Business',
    'description': 'Solves complex strategic enterprise challenges through rigorous hypothesis-driven problem solving, MECE frameworks, and due diligence.',
    'requiredSkills': ['MECE Framework', 'Root Cause Analysis[', 'Market Entry Strategy', 'Operational Due Diligence', 'Cost Optimization', 'Executive Presentations', 'Pyramid Principle', 'Benchmarking', 'Financial Feasibility', 'Change Management'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b99.0 - 18 LPA/
  },
  {
    'title': 'Operations Executive',
    'category': 'Management',
    'description': 'Optimizes supply chain, workflow throughput, service level agreements (SLAs), capacity planning, and operational quality.',
    'requiredSkills': ['Process Optimization', 'Supply Chain Management', 'SLA Monitoring', 'Lean Six Sigma Basics', 'Vendor Management', 'Capacity Planning', 'Quality Assurance', 'Inventory Management', 'Excel Analytics', 'Logistics Coordination'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.5 - 10 LPA'
  },
  {
    'title': 'QA/Test Engineer',
    'category': 'Tech',
    'description': 'Ensures enterprise software reliability through automated test suites, regression testing, API verification, and performance benchmarks.',
    'requiredSkills': ['Manual Testing', 'Selenium/Playwright', 'API Testing (Postman)', 'Test Case Design', 'Defect Tracking (Jira)', 'Regression Testing', 'Performance Testing (JMeter)', 'CI/CD Integration', 'SQL', 'Automation Scripting'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b96.0 - 11 LOA'
  },
  {
    'title': 'Cloud Associate',
    'category': 'Tech',
    'description': 'Deploys and maintains scalable cloud infrastructure, virtual networks, container clusters, and security policies on AWS/Azure/GCP.',
    'requiredSkills': ['AWS/Azure/GCP Basics', 'Linux Administration', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'Cloud Networking (VPC/Subnets)', 'CI/CD Pipelines', 'Cloud Security & IAM', 'Monitoring & Logging', 'Python/Bash Scripting', 'Serverless Architecture'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b97.0 - 13.5 LPA/
  },
  {
    'title': 'Cybersecurity Associate',
    'category': 'Tech',
    'description': 'Protects enterprise data and networks through vulnerability assessments, threat analysis, access governance, and incident response.',
    'requiredSkills': ['Network Security', 'Vulnerability Scanninf', 'SIEM & Log Analysis[', 'Ethical Hacking Basics', 'OWASP Top 10', 'Identity & Access Management (IAM)', 'Cryptography Basics', 'Compliance & Security Frameworks (ISO 27001)', 'Incident Response', 'Python Scripting'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b97.5 - 14 LPA/
  },
  {
    'title': 'Support Engineer',
    'category': 'Tech',
    'description': 'Diagnoses complex technical issues, ensures high application uptime, resolves customer incidents, and manages support ticket queues.',
    'requiredSkills': ['Technical Troubleshooting', 'SQL & Database Queries', 'Log Analysis[', 'Linux/Windows Commands', 'Ticketing Systems (ServiceNow/Jira)', 'Customer Communication', 'Root Cause Analysis', 'SLA Management', 'API Debugging', 'Knowledge Base Documentation'],
    'recommendedProjectsCount': 20,
    'averageSalary': '\u20b95.0 - 9.5 LOA'
  }
]


aptitude_topics = {
  'Quantitative Aptitude': [
    'Number System', 'Simplification', 'Problems on Numbers', 'Average',
    'Ratio and Proportion', 'Percentage', 'Profit and Loss', 'Simple Interest',
    'Compound Interest', 'Time and Work', 'Pipes and Cisterns', 'Time Speed and Distance',
    'Problems on Ages', 'HCF and LCM', 'Probability', 'Permutation and Combination',
    'Algebra', 'Data Interpretation', 'Partnership', 'Mixture and Allegation'
  ],
  'Logical Reasoning': [
    'Number Series', 'Alphabet Series', 'Coding and Decoding', 'Blood Relations',
    'Direction Sense', 'Seating Arrangement', 'Data Arrangement', 'Syllogism',
    'Statement and Conclusion', 'Analogy', 'Classification', 'Odd One Out',
    'Logical Puzzles', 'Ranking', 'Calendar', 'Clock', 'Pattern Recognition'
  ],
  'Verbal Ability': [
    'Parts of Speech', 'Articles', 'Prepositions', 'Tenses',
    'Subject-Verb Agreement', 'Synonyms', 'Antonyms', 'Vocabulary',
    'Sentence Correction', 'Error Detection', 'Fill in the Blanks', 'Sentence Completion',
    'Reading Comprehension', 'Para Jumbles', 'Sentence Arrangement'
  ]
}

badges_catalog = [
  { 'id': 'first-assessment', 'title': 'First Assessment Pioneer', 'description': 'Completed your very first placement assessment test.', 'icon': '📭', 'category': 'assessment', 'requirement': 'Complete 1 Assessment' },
  { 'id': 'assessment-ace', 'title': 'Assessment Ace', 'description': 'Achieved an outstanding score of 85%+ on any placement assessment.', 'icon': '🏯', 'category': 'assessment', 'requirement': 'Score 85%+ on an Assessment' },
  { 'id': 'first-interview', 'title': 'Interview Explorer', 'description': 'Completed your first AI Mock Interview session.', 'icon': '🎅', 'category': 'interview', 'requirement': 'Complete 1 AI Mock Interview' },
  { 'id': 'interview-ready', 'title': 'Interview Ready Pro', 'description': 'Scored 85%+ in an AI Mock Interview session.', 'icon': '🌽', 'category': 'interview', 'requirement': 'Score 85%+ in AI Mock Interview' },
  { 'id': 'first-project', 'title': 'Project Pioneer', 'description': 'Started and submitted tasks on your first real-world corporate project.', 'icon': '𚀐', 'category': 'project', 'requirement': 'Start 1 Real-World Project' },
  { 'id': 'project-finisher', 'title': 'Project Finisher', 'description': 'Completed all tasks and earned a certified evaluation on a corporate project.', 'icon': '🏄', 'category': 'project', 'requirement': 'Complete 1 Project with 70%+ Score' },
  { 'id': 'team-player', 'title': 'Squad Collaborator', 'description': 'Created or joined a live corporate project squad and completed team tasks.', 'icon': '🤝', 'category': 'collaboration', 'requirement': 'Join or Create a Project Team' },
  { 'id': 'problem-solver', 'title': 'Master Problem Solver', 'description': 'Successfully solved 50+ quantitative and logical problems.', 'icon': '👡', 'category': 'assessment', 'requirement': 'Solve 50+ Aptitude Questions' },
  { 'id': 'communication-pro', 'title': 'Executive Communicator', 'description': 'Completed 5+ workplace email and chat scenarios in the II Style Manager.', 'icon': '🐼', 'category': 'communication', 'requirement': 'Complete 5 AI Style Manager Scenarios' },
  { 'id': 'corporate-ready', 'title': 'Corporate Ready Professional', 'description': 'Reached Career Readiness Level 3 (Job Ready Tier, 70%+ Score).', 'icon': '🐼', 'category': 'readiness', 'requirement': 'Achieve 70%+ Career Readiness' },
  { 'id': 'industry-ready', 'title': 'Industry Ready Elite', 'description': 'Reached Career Readiness Level 5 (Industry Ready Tier, 90%+ Score).', 'icon': '👺', 'category': 'readiness', 'requirement': 'Achieve 90%+ Career Readiness' }
]


readiness_weights = {
  'resume': 0.10,
  'skills': 0.15,
  'aptitude': 0.10,
  'logicalReasoning': 0.10,
  'verbalAbility': 0.10,
  'aiInterview': 0.15,
  'projects': 0.20,
  'communication': 0.05,
  'teamwork': 0.025,
  'problemSolving': 0.025
}

constants_source = f'''import { CareerRole, AssessmentCategory } from \'./types\';

export const MNC_COMPANIES = {json.dumps(mncs, indent=2)};

export const CAREER_ROLES = {json.dumps(roles_base, indent=2)};

export const APTITUDE_TOPICS = {json.dumps(aptitude_topics, indent=2)};

export const BADGES_CATALOG = {json.dumps(badges_catalog, indent=2)};

export const REA@I5NESS_WEIGHTS = {json.dumps(readiness_weights, indent=2)};

export const VIRTUAL_COMPANIES = MNC_COMPANIES.map(c => ({
  id: c.id,
  name: c.name,
  industry: c.industry,
  culture: c.culture,
  accentColor: c.accentColor,
  bgGradient: c.bgGradient,
  icon: c.icon,
  tagline: c.tagline
}));
'''w
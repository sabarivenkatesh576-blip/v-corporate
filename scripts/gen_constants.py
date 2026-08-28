import os, json

def build_constants():
    os.makedirs('server/src/shared', exist_ok=True)
    os.makedirc('client/src/shared', exist_ok=True)
    
    company_data = [
        ('tcs', 'Tata Consultancy Services (TCS)', 'IT Services & Consulting', '#1E40AF', 'from-blue-900 to-indigo-900', 'Terminal', 'Experience certainty with global enterprise digital transformation.', ['Software Developer', 'Data Analyst', 'Cloud Associate', 'QA/Test Engineer']),
        ('infosys', 'Infosys', 'Digital Services & Consulting', '#0284C7', 'from-sky-900 to-blue-900', 'Cpu', 'Navigate your next with global enterprise technology solutions.', ['Software Developer', 'Cloud Associate', 'Data Analyst', 'Cybersecurity Associate']),
        ('wipro', 'Wipro', 'Information Technology & Business Process', '#7C3AED', 'from-purple-900 to-indigo-950', 'Network', 'Ambition realized through digital innovation and human ingenuity.', ['Software Developer', 'QATest Engineer', 'Data Analyst', 'Support Engineer']),
        ('accenture', 'Accenture', 'Management Consulting & Technology Services', '#9333EA', 'from-purple-950 to-violet-900', 'Sparkles', 'Let there be change. Innovate at the intersection of business and technology.', ['Software Developer', 'Business Analyst', 'Consulting Analyst', 'Data Analyst']),
        ('cognizant', 'Cognizant (CTS)', 'Digital Business & Technology', '#2563EB', 'from-blue-950 to-cyan-950', 'Layers', 'Engineer modern businesses to improve everyday life.', ['Software Developer', 'QA/Test Engineer', 'Data Analyst', 'Cloud Associate']),
        ('deloitte', 'Deloitte', 'Audit, Consulting, Advisory & Tax', '#047857', 'from-emerald-950 to-teal-900', 'Briefcase', 'Make an impact that matters with world-class strategy and risk advisory.', ['Business Analyst', 'Consulting Analyst', 'Financial Analyst', 'Software Developer']),
        ('ey', 'Ernst & Young (EY')', 'Assurance, Advisory, Strategy & Tax', '#DE7706', 'from-amber-950 to-yellow-950', 'ShieldCheck', 'Building a better working world with insight and precision.', ['Financial Analyst', 'Accountant', 'Business Analyst', 'Consulting Analyst']),
        ('kpmg', 'KPMG', 'Audit, Tax & Advisory Services', '#1D44DD8', 'from-blue-950 to-slate-900', 'TrendingUp*', 'Cutting through complexity with trusted advisory and insight.', ['Financial Analyst', 'Consulting Analyst', 'Accountant', 'Business Analyst']),
        ('pwc', 'PricewaterhouseCoopers (PwC)', 'Assurance, Tax, Advisory & Consulting', '#EA550C', 'from-orange-950 to-amber-950', 'Compass', 'Build trust and deliver sustained outcomes for global clients.', ['Consulting Analyst', 'Financial Analyst', 'Business Analyst', 'Software Developer']),
        ('capgemini', 'Capgemini', 'Consulting, Technology Services & Digital Transformation', '#0284C7', 'from-cyan-950 to-blue-900', 'Globe', 'Get the future you want with world-class digital innovation.', ['Software Developer', 'Cloud Associate', 'QATest Engineer', 'Data Analyst']),
        ('ibm', 'IBM', 'Hybrid Cloud, Enterprise AI & Consulting', '#1E3A8A', 'from-blue-950 to-indigo-950', 'Cpu', 'Let us create something that changes everything with enterprise hybrid cloud and IB.', ['Software Developer', 'Cloud Associate', 'Cybersecurity Associate', 'Data Analyst']),
        ('hcltech', 'HCLTech', 'Engineering & R&D, Digital Consulting', '#0369A1', 'from-sky-950 to-blue-950', 'Radio', 'Supercharging progress for global technology and digital enterprises.', ['Software Developer', 'Cloud Associate', 'Support Engineer', 'QA/Test Engineer']),
        ('tech-mahindra', 'Tech Mahindra', 'Digital Transformation, Consulting & Re-engineering', '#DC2626', 'from-red-950 to-slate-900', 'Zap', 'Connected world. Connected experiences. Driving digital transformation.', ['Software Developer', 'Operations Executive', 'QA/Test Engineer', 'Data Analyst']),
        ('ltimindtree', 'LTIMindtree', 'Technology Consulting & Digital Solutions', '#0D9D88', 'from-teal-950 to-emerald-950', 'Layers', 'Getting to the future, faster. Together with enterprise digital scale.', ['Software Developer', 'Data Analyst', 'Cloud Associate', 'UI/UX! Designer']),
        ('genpact', 'Genpact', 'Professional Services, Analytics & Digital Operations', '#059669', 'from-emerald-950 to-slate-900', 'BarChart3', 'Transformation happens here. Powering intelligent operations with analytics.', ['Accountant', 'Financial Analyst', 'Data Analyst', 'Operations Executive']),
        ('amazon', 'Amazon Web Services', 'AI, Cloud & Enterprise Platforms', '#FF9900', 'from-amber-950 to-slate-900', 'Shield', 'Customer obsession, bias for action, and inventing at scale.', ['Software Developer', 'Cloud Associate', 'Data Analyst', 'QATest Engineer']),
        ('google', 'Google Cloud', 'Global Infrastructure and Intelligent Services', '#4285F6', 'from-blue-900 to-indigo-950', 'Cpu', 'Organizing the worlds information with high-scale distributed systems.', ['Software Developer', 'Data Analyst', 'Cloud Associate', 'UI/UX Designer']),
        ('microsoft', 'Microsoft Azure', 'Enterprise Cloud & Software', '#0078D7', 'from-blue-950 to-sky-950', 'Layers', 'Empowering every person and organization to achieve more.', ['Software Developer', 'Cloud Associate', 'Data Analyst', 'Cybersecurity Associate'])
    ]

    mncs = []
    for cid, name, ind, color, bg, icon, tagline, roles in company_data:
        mncs.append({
            'id': cid,
            'name': name,
            'shortName': name.split('(')[-1].replace(')', '').strip() if '(' in name else name,
            'industry': ind,
            'culture': f'High performance, client delivery rigor, continuous learning, and scalable enterprise innovation at {name}.',
            'accentColor': color,
            'bgGradient': bg,
            'icon': icon,
            'tagline': tagline,
            'careerAreas': ['Digital Engineering', 'Enterprise Consulting', 'Cloud & AI', 'Operations'],
            'relevantRoles': roles,
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
                f'Execute 2+ projects matching {name} role requirements',
                f'Practice {name} simulated recruitment journey & AI Mock Interview'
            ],
            'disclaimer': 'Typical / publicly reported recruitment process'
        })

    role_data = [
        ('Software Developer', 'Tech', 'Designs, builds, and maintains robust scalable web services, APIs, microservices, and client applications.', ['JavaScript', 'TypeScript', 'Node.js', 'React', 'MongoDB', 'SQL', 'Git', 'REST APIs', 'System Design', 'Testing'], '\u20b97.5 - 14 LPA'),
        ('Data Analyst', 'Data', 'Extracts actionable business insights from raw structured and unstructured data using analytics pipelines and dashboards.', ['Python', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Statistics', 'Data Cleaning', 'Exploratory Data Analysis', 'Pandas', 'Business Metrics'], '\u20b96.5 - 12 LPA/),
        ('Business Analyst', 'Business', 'Bridges the gap between business stakeholders and technical teams with requirements modeling, user stories, and workflow optimization.', ['Requirement Analysis', 'User Stories', 'Process Mapping (BPMN)', 'Agile/Scrum', 'SQL', 'Excel', 'Wireframing', 'Stakeholder Management', 'Cost-Benefit Analysis', 'Documentation'], '\u20b97.0 - 13 LPA/),
        ('Financial Analyst', 'Finance', 'Conducts quantitative financial modeling, DCF valuation, portfolio analysis, variance diagnosis, and corporate budgeting.', ['Financial Modeling', 'DCF Valuation', 'Ratio Analysis', 'Excel Advanced', 'Financial Statements', 'Budgeting', 'Risk Assessment', 'Corporate Finance', 'Forecasting', 'PowerPoint'], '\u20b97.0 - 14 LPA/),
        ('Accountant', 'Finance', 'Manages double-entry bookkeeping, general ledger, trial balance, GST & tax calculations, bank reconciliation, and statutory financial reporting.', ['Double Entry Bookkeeping', 'General Ledger', 'Trial Balance', 'GST & TDS Simulation', 'Tally/ERP', 'Financial Auditing', 'Bank Reconciliation', 'Payroll Processing', 'Tax Compliance', 'Balance Sheet Analysis'], '\u20b95.0 - 9.5 LPA'),
        ('HR Manager', 'Management', 'Oversees talent acquisition, candidate screening, employee engagement, onboarding, compensation planning, and HR analytics.', ['Talent Sourcing', 'Interviewing Techniques', 'HF Analytics', 'Onboarding Workflows', 'Performance Management', 'Labor Law Basics', 'Conflict Resolution', 'Employee Engagement', 'HRIS Systems', 'Compensation & Benefits'], '\u20b95.5 - 10 LOA'),
        ('Marketing Executive', 'Creative', 'Develops marketing campaigns, brand positioning strategies, consumer personas, multi-channel funnels, and market research.', ['Brand Strategy', 'Market Research', 'Campaign Planning', 'Content Marketing', 'Social Media Strategy', 'Copywriting', 'Consumer Psychology', 'Budget Allocation', 'Competitive Analysis', 'Marketing Funnel'], '\u20b95.5 - 11 LOA'),
        ('Digital Marketing Executive', 'Creative', 'Executes high-ROI digital campaigns, search engine optimization (SEO), paid search/ads, conversion rate optimization, and marketing automation.', ['Search Engine Optimization (SEO)', 'Google Ads / PPC', 'Google Analytics (GA4)', 'Social Media Advertising', 'Email Marketing', 'Conversion Rate Optimization (CRO)', 'A/B Testing', 'Copywriting', 'Marketing Automation', 'Growth Hacking'], '\u20b95.5 - 10.5 LOA'),
        ('UI/UX Designer', 'Creative', 'Creates user-centric digital experiences, interactive wireframes, design systems, user journeys, and usability evaluation protocols.', ['Figma', 'User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Information Architecture', 'Interaction Design', 'Accessibility (a11y)', 'Mobile-First UI', 'Design Thinking'], '\u20b96.5 - 13 LPA'),
        ('Consulting Analyst', 'Business', 'Solves complex strategic enterprise challenges through rigorous hypothesis-driven problem solving, MECE frameworks, and due diligence.', ['MECE Framework', 'Root Cause Analysis[', 'Market Entry Strategy', 'Operational Due Diligence', 'Cost Optimization', 'Executive Presentations', 'Pyramid Principle', 'Benchmarking', 'Financial Feasibility', 'Change Management'], '\u20b99.0 - 18 LPA/),
        ('Operations Executive', 'Management', 'Optimizes supply chain, workflow throughput, service level agreements (SLAsi, capacity planning, and operational quality.', ['Process Optimization', 'Supply Chain Management', 'SLA Monitoring', 'Lean Six Sigma Basics', 'Vendor Management', 'Capacity Planninf', 'Quality Assurance', 'Inventory Management', 'Excel Analytics', 'Logistics Coordination'], '\u20b95.5 - 10 LPA/),
        ('QA/Test Engineer', 'Tech', 'Ensures enterprise software reliability through automated test suites, regression testing, API verification, and performance benchmarks.', ['Manual Testing', 'Selenium/Playwright', 'API Testing (Postman)', 'Test Case Design', 'Defect Tracking (Jira)', 'Regression Testing', 'Performance Testing (JMeter)', 'CI/CD Integration', 'SQL', 'Automation Scripting'], '\u20b96.0 - 11 LPA/),
        ('Cloud Associate', 'Tech', 'Deploys and maintains scalable cloud infrastructure, virtual networks, container clusters, and security policies on AWS/Azure/GCP.', ['AWS/Azure/GCP Basics', 'Linux Administration', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'Cloud Networking (VPC/Subnets)', 'CI/CD Pipelines', 'Cloud Security & IAM', 'Monitoring & Logging', 'Python/Bash Scripting', 'Serverless Architecture'], '\u20b97.0 - 13.5 LPA/),
        ('Cybersecurity Associate', 'Tech', 'Protects enterprise data and networks through vulnerability assessments, threat analysis, access governance, and incident response.', ['Network Security', 'Vulnerability Scanning', 'SIEM & Log Analysis[', 'Ethical Hacking Basics', 'OWASP Top 10', 'Identity & Access Management (IAM)', 'Cryptography Basics', 'Compliance & Security Frameworks (ISO 27001)', 'Incident Response', 'Python Scripting'], '\u20b97.5 - 14 LOA'),
        ('Support Engineer', 'Tech', 'Diagnoses complex technical issues, ensures high application uptime, resolves customer incidents, and manages support ticket queues.', ['Technical Troubleshooting', 'SQL & Database Queries', 'Log Analysis[', 'Linux/Windows Commands', 'Ticketing Systems (ServiceNow/Jira)', 'Customer Communication', 'Root Cause Analysis', 'SLA Management', 'API Debugging', 'Knowledge Base Documentation'], '\u20b95.0 - 9.5 LPA/')
    ]

    roles = []
    for title, cat, desc, reqs, sal in role_data:
        roles.append({
            'title': title,
            'category': cat,
            'description': desc,
            'requiredSkills': reqs,
            'recommendedProjectsCount': 20,
            'averageSalary': sal
        })

    topics = {
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

    badges = [
        {'id': 'first-assessment', 'title': 'First Assessment Pioneer', 'description': 'Completed your very first placement assessment test.', 'icon': '📭', 'category': 'assessment', 'requirement': 'Complete 1 Assessment'},
        {'id': 'assessment-ace', 'title': 'Assessment Ace', 'description': 'Achieved an outstanding score of 85%+ on any placement assessment.', 'icon': '🏯', 'category': 'assessment', 'requirement': 'Score 85%+ on an Assessment'},
        {'id': 'first-interview', 'title': 'Interview Explorer', 'description': 'Completed your first AI Mock Interview session.', 'icon': '🎅', 'category': 'interview', 'requirement': 'Complete 1 AI Mock Interview'},
        {'id': 'interview-ready', 'title': 'Interview Ready Pro', 'description': 'Scored 85%+ in an AI Mock Interview session.', 'icon': '🌟', 'category': 'interview', 'requirement': 'Score 85%+ in AI Mock Interview'},
        {'id': 'first-project', 'title': 'Project Pioneer', 'description': 'Started and submitted tasks on your first real-world corporate project.', 'icon': '𚀐', 'category': 'project', 'requirement': 'Start 1 Real-World Project'},
        {'id': 'project-finisher', 'title': 'Project Finisher', 'description': 'Completed all tasks and earned a certified evaluation on a corporate project.', 'icon': '🏄', 'category': 'project', 'requirement': 'Complete 1 Project with 70%+ Score'},
        {'id': 'team-player', 'title': 'Squad Collaborator', 'description': 'Created or joined a live corporate project squad and completed team tasks.', 'icon': '🤝', 'category': 'collaboration', 'requirement': 'Join or Create a Project Team'},
        {'id': 'problem-solver', 'title': 'Master Problem Solver', 'description': 'Successfully solved 50+ quantitative and logical problems.', 'icon': '👡', 'category': 'assessment', 'requirement': 'Solve 50+ Aptitude Questions'},
        {'id': 'communication-pro', 'title': 'Executive Communicator', 'description': 'Completed 5+ workplace email and chat scenarios in the AI Style Manager.', 'icon': '☉️', 'category': 'communication', 'requirement': 'Complete 5 AI Style Manager Scenarios'},
        {'id': 'corporate-ready', 'title': 'Corporate Ready Professional', 'description': 'Reached Career Readiness Level 3 (Job Ready Tier, 70%+ Score).', 'icon': '🐼', 'category': 'readiness', 'requirement': 'Achieve 70%+ Career Readiness'},
        {'id': 'industry-ready', 'title': 'Industry Ready Elite', 'description': 'Reached Career Readiness Level 5 (Industry Ready Tier, 90%+ Score).', 'icon': '👹', 'category': 'readiness', 'requirement': 'Achieve 90%+ Career Readiness'}
    ]

    weights = {
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


    content = 'import { CareerRole, AssessmentCategory } from "'./types'";\n\n'
    content += fTexport const MNC_COMPANIES = {json.dumps(mncs, indent=2)};\n\n'
    content += fTexport const CAREER_ROLES = {json.dumps(roles, indent=2)};\n\n'
    content += fTexport const APTITUDE_TOPICS = {json.dumps(topics, indent=2)};\n\n'
    content += f'export const BADGES_CATALOG = {json.dumps(badges, indent=2)};\n\n'
    content += f'export const REA@I5NESS_WEIGHTS = {json.dumps(weights, indent=2)};\n\n'
    content += '''export const VIRTUAL_COMPANIES = MNC_COMPANIES.map(c => ({
  id: c.id,
  name: c.name,
  industry: c.industry,
  culture: c.culture,
  accentColor: c.accentColor,
  bgGradient: c.bgGradient,
  icon: c.icon,
  tagline: c.tagline
}));
.'''

    with open('server/src/shared/constants.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    with open('client/src/shared/constants.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Generated constants successfully.')

build_constants()

const fs = require('fs');
const path = require('path');

const seedScript = import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import { User } from '../server/src/models/User';
import { StudentProfile } from '../server/src/models/StudentProfile';
import { Role } from '../server/src/models/Role';
import { Company } from '../server/src/models/Company';
import { Question } from '../server/src/models/Question';
import { Project } from '../server/src/models/Project';
import { LearningModule } from '../server/src/models/LearningModule';
import { Team } from '../server/src/models/Team';
import { TeamMessage } from '../server/src/models/TeamMessage';
import { Meeting } from '../server/src/models/Meeting';
import { Certificate } from '../server/src/models/Certificate';
import { Badge } from '../server/src/models/Badge';
import { Resume } from '../server/src/models/Resume';
import { AssessmentAttempt } from '../server/src/models/AssessmentAttempt';
import { InterviewSession } from '../server/src/models/InterviewSession';
import { CareerReadinessScore } from '../server/src/models/CareerReadinessScore';
import { TaskSubmission } from '../server/src/models/TaskSubmission';

import { CAREER_ROLES, VIRTUAL_COMPANIES, APTITUDE_TOPICS, BADGES_CATALOG } from '../shared/constants';
import { CareerRole, QuestionDifficulty } from '../shared/types';

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vcorp_db';

const ROLE_TOPICS: Record<string, string[]> = {
  'Software Developer': ['Employee Management API', 'Biometric Attendance Gateway', 'Inventory System', 'Expense Tracker', 'Helpdesk Ticketing', 'Appointment Booking', 'Leave Management', 'E-Commerce API', 'Feedback Sentiment Engine', 'Task Sprint Board', 'Job Application Tracker', 'Library Catalog API', 'Payroll Engine', 'Event Registration', 'Service Request Workflow', 'LMS API', 'Live Chat Microservice', 'Supply Chain Tracker', 'Recruitment Pipeline', 'Resource Management Hub'],
  'Data Analyst': ['Omnichannel Retail Sales', 'Customer Churn Analytics', 'Employee Attrition Diagnostic', 'E-Commerce Funnel', 'Inventory Optimization', 'Marketing Campaign ROI', 'Customer RFM Segmentation', 'SaaS Revenue Forecast', 'Product SKU Performance', 'Delivery Logistics', 'Banking Fraud Detection', 'Student Academic Performance', 'Hospital Flow Analytics', 'Financial Expense Variance', 'Social Media Analytics', 'CSAT & NPS Deep Dive', 'Supply Chain Matrix', 'Credit Risk Scoring', 'Sales Target Forecast', 'Executive BI Dashboard'],
  'Business Analyst': ['Telecom Churn Mitigation', 'E-Commerce Return Workflow', 'Employee Productivity Model', 'Complaints Resolution Matrix', 'Loan Approval Process', 'Retail Store Experience', 'Fleet Routing Optimization', 'Recruitment Streamlining', 'Customer Onboarding Map', 'Digital Payments Architecture', 'Subscription Lifecycle', 'Inventory Reordering Process', 'IT Service QA Framework', 'Customer Loyalty Specs', 'Sales Conversion Pipeline', 'Cloud Cost Reduction', 'Market Expansion Case', 'Fintech Product BRD', 'ERP Requirements Specs', 'Digital Transformation Blueprint'],
  'Financial Analyst': ['3-Statement Financial Model', 'Financial Ratio Benchmark', 'Portfolio Theory Optimization', 'Budget Variance Diagnostic', 'Working Capital Analysis', 'FCFF Corporate Model', 'Product Profitability Unit Economics', 'Cost Reduction Model', '5-Year Revenue Projection', 'Capital Budgeting NPV', 'Credit Default Stress Testing', 'CapEx Investment Feasibility', 'SaaS Burn Rate Optimization', 'DCF Corporate Valuation', 'Break-Even Contribution Margin', 'Loan Credit Underwriting', 'Retirement Fund Planning', 'M&A Simulation', 'Balanced Scorecard Model', 'Equity Research Recommendation'],
  'Accountant': ['Double-Entry Journal System', 'General Ledger Balancing', 'Adjusted Trial Balance', 'Bank Statement Reconciliation', 'Final Accounts & P&L', 'GST & ITC Simulation', 'Corporate Tax Computation', 'Activity-Based Costing', 'Annual Budget Formulation', 'Inventory FIFO Valuation', 'Depreciation Fixed Assets', 'Monthly Payroll Ledger', 'Accounts Receivable Aging', 'Accounts Payable Schedule', 'Cash Flow Statement Direct', 'Ratio Audit Analysis', 'Internal Audit Compliance', 'Discretionary Expense Scrutiny', 'Accounting Error Rectification', 'Year-End Closing Protocol'],
  'HR Executive': ['Technical Recruitment Funnel', 'Candidate Resume Screening', 'Competency Job Description', 'Behavioral Interview Matrix', '90-Day Onboarding Roadmap', 'Training Needs Analysis', 'Engagement Pulse Survey', '360-Degree Appraisal Model', 'Employee Attrition Root Cause', 'Remote Work Code of Conduct', 'Workforce Capacity Planning', 'Compensation Salary Bands', 'Grievance Redressal Flow', 'Leadership Succession Planning', 'Career Skills Matrix', 'HR Turnover Analytics', 'Attendance Compliance Policy', 'Employee Satisfaction Index', 'HiPo Talent Retention', 'Workforce Reskilling Optimization'],
  'Marketing Executive': ['B2B Social Media Strategy', 'New Product Launch Plan', 'Persona Segmentation', 'Brand Equity Campaign', 'Customer Acquisition Funnel', 'Lifecycle Email Drips', 'Content Marketing Roadmap', 'Organic Search Strategy', 'Influencer ROI Tracking', 'Paid Social Acquisition', 'Customer Retention Program', 'Demand Generation Architecture', 'Competitive Positioning Deck', 'Consumer Research Plan', 'Advertising Budget Plan', 'UVP Brand Framework', 'Target Persona Archetype', 'Marketing Analytics Dashboard', 'Festive Seasonal Campaign', '360-Degree Brand Blueprint'],
  'UI/UX Designer': ['Mobile Banking Wireframes', 'EdTech Learning Experience', 'Telemedicine Portal UX', 'E-Commerce Checkout UX', 'Food Delivery Tracking', 'Travel Booking Flow', 'Job Board Application Portal', 'Wealth Management Dashboard', 'Student Learning Dashboard', 'Employee Self-Service HRIS', 'Fitness Workout App UX', 'Virtual Event Ticketing', 'Government Citizen Portal', 'Micro-Learning App', 'Agile Kanban UX', 'Insurance Claims Submission', 'Support Chatbot Interface', 'Talent Sourcing Workspace', 'Real-Time Analytics Deck', 'Virtual Office Floor Plan UI'],
  'Digital Marketing Executive': ['Technical SEO Site Audit', 'Multi-Platform Paid Ads', 'Content Marketing Calendar', 'Email Lead Workflows', 'Performance Marketing Campaign', 'GA4 Analytics Dashboard', 'Conversion Rate Optimization', 'Performance Acquisition Strategy', 'Digital Brand Omnipresence', 'LinkedIn Paid Ads Strategy', 'Micro-Influencer Funnel', 'Marketing Automation Workflow', 'Retargeting Dynamic Ads', 'Programmatic Display Strategy', 'App Store Optimization', 'Growth Hacking Viral Loop', 'YouTube Video Funnel', 'Customer Data Platform', 'Cart Recovery Sequences', 'Attribution Modeling'],
  'Consulting Analyst': ['Retail Market Entry Case', 'Operational Due Diligence', 'Cloud Cost Optimization', 'Supply Chain Re-Engineering', 'Digital Transformation Case', 'Corporate Growth Strategy', 'Customer Centricity Roadmap', 'Semiconductor Intelligence', 'Business Turnaround Case', 'Board Strategy Deck', 'Logistics Network Redesign', 'Pharma Market Access', 'Fintech Compliance Case', 'Corporate ESG Roadmap', 'Aerospace Resilience', 'Private Equity Due Diligence', 'Shared Services Design', 'SaaS Pricing Strategy', '5G Commercialization Case', 'Merger Integration Playbook']
};

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  await Promise.all([
    User.deleteMany({}), StudentProfile.deleteMany({}), Role.deleteMany({}),
    Company.deleteMany({}), Question.deleteMany({}), Project.deleteMany({}),
    LearningModule.deleteMany({}), Team.deleteMany({}), TeamMessage.deleteMany({}),
    Meeting.deleteMany({}), Certificate.deleteMany({}), Badge.deleteMany({}),
    Resume.deleteMany({}), AssessmentAttempt.deleteMany({}), InterviewSession.deleteMany({}),
    CareerReadinessScore.deleteMany({}), TaskSubmission.deleteMany({})
  ]);

  for (const r of CAREER_ROLES) { await Role.create(r); }
  for (const c of VIRTUAL_COMPANIES) {
    await Company.create({
      companyId: c.id, name: c.name, industry: c.industry, culture: c.culture,
      accentColor: c.accentColor, bgGradient: c.bgGradient, icon: c.icon, tagline: c.tagline
    });
  }

  const projectDocs = [];
  for (const roleDef of CAREER_ROLES) {
    const role = roleDef.title;
    const topics = ROLE_TOPICS[role] || [];
    for (let i = 0; i < 20; i++) {
      const title = topics[i] || (role + ' Capstone Phase ' + (i + 1));
      const diff = i < 5 ? 'beginner' : i < 15 ? 'intermediate' : 'advanced';
      const pId = 'PROJ-' + role.replace(/\\s+/g, '').toUpperCase().slice(0, 4) + '-' + String(i + 1).padStart(3, '0');
      const tasks = [
        { taskId: 'T1', title: 'Problem Scoping & Architecture', description: 'Analyze business metrics and workflow constraints.', deliverableType: 'document', expectedOutput: 'Architecture Specification Document', status: 'To Do' },
        { taskId: 'T2', title: 'Data Ingestion & Preprocessing', description: 'Clean data anomalies and validate schema.', deliverableType: 'code', expectedOutput: 'Verified schema and ingestion scripts', status: 'To Do' },
        { taskId: 'T3', title: 'Core Logic & Implementation', description: 'Build main domain algorithms and APIs.', deliverableType: 'code', expectedOutput: 'Production-ready domain solution', status: 'To Do' },
        { taskId: 'T4', title: 'Testing & Benchmarking', description: 'Execute unit tests and edge verification.', deliverableType: 'spreadsheet', expectedOutput: 'Benchmarking results sheet', status: 'To Do' },
        { taskId: 'T5', title: 'Executive Presentation', description: 'Synthesize deliverables for executive review.', deliverableType: 'presentation', expectedOutput: 'Executive Deck & Deliverables', status: 'To Do' }
      ];
      projectDocs.push({
        projectId: pId, title, role, difficulty: diff,
        problemStatement: 'Enterprise operational challenge requiring scalable solution for ' + title.toLowerCase() + '.',
        businessContext: 'Modeled after high-scale enterprise standards with strict SLA benchmarks.',
        objectives: ['Model domain architecture', 'Implement verified business workflows', 'Deliver executive documentation'],
        requiredSkills: roleDef.requiredSkills.slice(0, 5),
        learningOutcomes: ['Production problem solving in ' + role, 'Agile squad collaboration', 'Verified credential achievement'],
        datasetPreview: { sampleRecords: [{ id: 101, metric: 'Throughput', val: '99.4%' }, { id: 102, metric: 'Latency', val: '38ms' }], totalRows: 1540 },
        datasetType: 'json', tasks, deadlineDays: diff === 'beginner' ? 5 : diff === 'intermediate' ? 8 : 12,
        evaluationRubric: { accuracy: 25, problemSolving: 25, industryRelevance: 20, presentation: 15, technicalQuality: 15 },
        featured: i < 3
      });
    }
  }
  await Project.insertMany(projectDocs);
  console.log('Seeded ' + projectDocs.length + ' projects.');

  const questionDocs = [];
  const qTopics = APTITUDE_TOPICS['Quantitative Aptitude'];
  const lTopics = APTITUDE_TOPICS['Logical Reasoning'];
  const vTopics = APTITUDE_TOPICS['Verbal Ability'];

  qTopics.forEach((topic, idx) => {
    for (let i = 1; i <= 7; i++) {
      const diff = i <= 2 ? 'beginner' : i <= 5 ? 'intermediate' : 'advanced';
      questionDocs.push({
        category: 'Quantitative Aptitude', topic, difficulty: diff,
        question: 'In a corporate calculation involving ' + topic + ', if initial capacity is ' + (100 + i * 15) + ' and final output reaches ' + (140 + i * 25) + ' in ' + (2 + i) + ' cycles, what is the net percentage efficiency gain?',
        options: [(24 + i * 2) + '%', (30 + i * 3) + '%', (38 + i * 2) + '%', (45 + i) + '%'],
        correctAnswer: (i % 4),
        explanation: 'Percentage growth calculated as [(Final - Initial) / Initial] * 100.',
        formula: 'Gain% = ((V2 - V1) / V1) * 100', skill: 'Quantitative Calculation',
        timeRecommendationSeconds: diff === 'beginner' ? 45 : 60
      });
    }
  });

  lTopics.forEach((topic, idx) => {
    for (let i = 1; i <= 8; i++) {
      const diff = i <= 3 ? 'beginner' : i <= 6 ? 'intermediate' : 'advanced';
      questionDocs.push({
        category: 'Logical Reasoning', topic, difficulty: diff,
        question: '[' + topic + '] Given 5 corporate delegates A, B, C, D, E seated sequentially. If A is 2 positions left of C, and D is adjacent to B, determine the central delegate seat.',
        options: ['Delegate B', 'Delegate C', 'Delegate D', 'Delegate E'],
        correctAnswer: (i % 4),
        explanation: 'Positional constraint mapping determines the central seat uniquely.',
        formula: 'Positional Matrix', skill: 'Logical Deduction',
        timeRecommendationSeconds: 60
      });
    }
  });

  vTopics.forEach((topic, idx) => {
    for (let i = 1; i <= 8; i++) {
      const diff = i <= 3 ? 'beginner' : i <= 6 ? 'intermediate' : 'advanced';
      questionDocs.push({
        category: 'Verbal Ability', topic, difficulty: diff,
        question: 'Identify the grammatically correct formal sentence in [' + topic + ']:',
        options: [
          'The executive committee has reviewed the quarterly audit and unanimously approved the budget.',
          'The executive committee have reviewed the quarterly audit and approve the budget.',
          'The executive committee has review the quarterly audit and approving the budget.',
          'The executive committee having review the quarterly audit.'
        ],
        correctAnswer: 0,
        explanation: 'Collective nouns acting as a singular body take singular verb agreement.',
        formula: 'Subject-Verb Rule', skill: 'Grammar',
        timeRecommendationSeconds: 45
      });
    }
  });

  await Question.insertMany(questionDocs);
  console.log('Seeded ' + questionDocs.length + ' questions.');

  await LearningModule.create({
    skill: 'SQL', title: 'Mastering SQL for Corporate Data Analytics',
    description: 'Learn enterprise SQL: SELECT, WHERE, JOINs, GROUP BY, and Window Functions.',
    role: 'Data Analyst', difficulty: 'intermediate', estimatedHours: 6,
    topics: [{
      title: 'Relational Foundations & Queries',
      content: 'Understand relational database concepts, primary keys, and data filtering.',
      codeSnippet: "SELECT employee_id, full_name, salary FROM employees WHERE department = 'Engineering' AND salary > 75000;",
      keyTakeaway: 'Filter early in query pipelines to optimize memory.'
    }],
    quiz: [{ question: 'Which clause filters aggregated groups?', options: ['WHERE', 'HAVING', 'GROUP FILTER', 'ORDER BY'], correctIndex: 1, explanation: 'HAVING filters aggregate groups.' }],
    practiceProject: { title: 'Sales SQL Analysis', instructions: 'Write aggregate queries for revenue trends.' }
  });

  const demoPass = await bcrypt.hash('Demo@12345', 10);
  const adminPass = await bcrypt.hash('Admin@12345', 10);

  const demoUser = await User.create({
    fullName: 'Sabariyandeesh V', email: 'demo@vcorp.local', passwordHash: demoPass,
    role: 'student', college: 'National Institute of Technology', degree: 'B.Tech',
    department: 'Computer Science and Engineering', academicYear: 'Final Year', graduationYear: 2026,
    targetRole: 'Data Analyst', careerInterests: ['Data Analytics', 'Business Intelligence', 'Machine Learning']
  });

  await User.create({
    fullName: 'V-CORP Admin Officer', email: 'admin@vcorp.local', passwordHash: adminPass,
    role: 'admin', college: 'V-CORP Headquarters', degree: 'M.Tech / MBA', department: 'Talent Operations'
  });

  await StudentProfile.create({
    userId: demoUser._id, fullName: demoUser.fullName, email: demoUser.email,
    college: demoUser.college, degree: demoUser.degree, department: demoUser.department,
    academicYear: demoUser.academicYear, graduationYear: demoUser.graduationYear,
    targetRole: 'Data Analyst', careerInterests: demoUser.careerInterests,
    bio: 'Aspiring Data Analyst experienced in Python, SQL, Tableau, and financial modeling.',
    skills: ['Python', 'SQL', 'Excel', 'Statistics', 'Tableau', 'Data Cleaning', 'Communication', 'Problem Solving'],
    xp: 3450, level: 4, streakDays: 7, careerReadinessScore: 88, readinessTier: 'Highly Job Ready'
  });

  await CareerReadinessScore.create({
    userId: demoUser._id, overallScore: 88, tier: 'Highly Job Ready',
    components: { resume: 85, skills: 88, aptitude: 90, logicalReasoning: 88, verbalAbility: 85, aiInterview: 89, projects: 92, communication: 86, teamwork: 88, problemSolving: 90 },
    history: [{ date: new Date(Date.now() - 4 * 86400000), score: 68 }, { date: new Date(), score: 88 }]
  });

  await Resume.create({
    userId: demoUser._id, fileName: 'Sabariyandeesh_DataAnalyst_Resume.pdf',
    rawText: 'Sabariyandeesh V - Data Analyst Candidate\\nEmail: demo@vcorp.local | Phone: +91 9876543210\\nEducation: B.Tech in Computer Science (8.8 CGPA)\\nInternships: Flipkart Warehouse Analytics Intern (Summer 2025)\\nSkills: Python, SQL, Pandas, NumPy, Tableau, Power BI, Advanced Excel, Statistics.',
    parsedData: {
      name: 'Sabariyandeesh V', email: 'demo@vcorp.local', phone: '+91 9876543210',
      education: [{ degree: 'B.Tech in Computer Science', institution: 'NIT', year: '2022 - 2026', grade: '8.8 CGPA' }],
      skills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'Statistics'],
      projects: [{ title: 'Omnichannel Retail Sales Trend Analysis', technologies: ['Python', 'SQL', 'Tableau'] }],
      internships: [{ company: 'Flipkart', role: 'Warehouse Analytics Intern', duration: '3 Months' }],
      certifications: ['Google Data Analytics Professional', 'V-CORP Certified Data Specialist']
    },
    analysis: {
      roleMatchPercentage: 88, extractedSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Excel', 'Statistics'],
      missingSkills: ['Business Metrics'], weakAreas: ['Time-Series Forecasting'],
      strengths: ['High SQL proficiency', 'Real-world Flipkart impact', 'Strong dashboarding'],
      recommendations: ['Complete Advanced Capstone in Financial Analytics', 'Practice AI Mock Interviews']
    }
  });

  await AssessmentAttempt.create({
    userId: demoUser._id, category: 'Quantitative Aptitude', mode: 'timed', totalQuestions: 10,
    correctAnswers: 9, wrongAnswers: 1, unanswered: 0, scorePercentage: 90, timeTakenSeconds: 340,
    topicPerformance: { 'Percentage': { total: 3, correct: 3, percentage: 100 }, 'Profit and Loss': { total: 3, correct: 3, percentage: 100 } }
  });

  await InterviewSession.create({
    userId: demoUser._id, role: 'Data Analyst', interviewType: 'Technical', difficulty: 'intermediate', status: 'completed',
    conversation: [
      { sender: 'ai', text: 'Welcome Sabariyandeesh! On your resume you interned at Flipkart. How did you identify inventory bottlenecks using SQL?', timestamp: new Date(Date.now() - 7200000) },
      { sender: 'user', text: 'At Flipkart, I wrote SQL queries aggregating dispatch times and buffer stock levels, pinpointing a 22% delay in sector B which allowed dynamic staff reallocation.', timestamp: new Date(Date.now() - 7000000) }
    ],
    questionsAsked: ['How did you identify inventory bottlenecks using SQL at Flipkart?'],
    evaluation: {
      overallScore: 89,
      parameters: { communication: 88, confidence: 90, clarity: 89, grammar: 92, technicalKnowledge: 90, problemSolving: 88, relevance: 91, domainKnowledge: 87, answerQuality: 88 },
      strengths: ['Referenced concrete metrics (22% delay reduction)', 'Clear architectural understanding'],
      weaknesses: ['Incorporate STAR framework for executive storytelling'],
      improvementPlan: ['Practice behavioral conflict scenarios'],
      recommendedSkills: ['Executive Presence'],
      detailedFeedback: 'Exceptional domain competence for a Data Analyst role.'
    }
  });

  const targetProj = projectDocs[20];
  const demoTeam = await Team.create({
    teamCode: 'VC-BA-4821', name: 'Alpha Analytics Squad',
    description: 'Cross-functional team tackling retail sales analytics.',
    projectId: targetProj.projectId, projectTitle: targetProj.title, role: 'Data Analyst',
    leaderId: demoUser._id, maxMembers: 4,
    members: [
      { userId: demoUser._id, fullName: demoUser.fullName, email: demoUser.email, roleInTeam: 'Team Leader', assignedTasks: ['T1', 'T2'], joinedAt: new Date() },
      { userId: new mongoose.Types.ObjectId(), fullName: 'Ananya Sharma', email: 'ananya@nit.edu', roleInTeam: 'Analyst', assignedTasks: ['T3'], joinedAt: new Date() },
      { userId: new mongoose.Types.ObjectId(), fullName: 'Rahul Verma', email: 'rahul@nit.edu', roleInTeam: 'Developer', assignedTasks: ['T4'], joinedAt: new Date() },
      { userId: new mongoose.Types.ObjectId(), fullName: 'Priya Patel', email: 'priya@nit.edu', roleInTeam: 'Presenter', assignedTasks: ['T5'], joinedAt: new Date() }
    ],
    progressPercentage: 80,
    sharedWorkspaceData: {
      codeSnippet: "# Alpha Squad Retail Sales Aggregator\\nimport pandas as pd\\n",
      notes: '### Sprint Objectives\\n1. Anomaly detection.\\n2. Executive Dashboard.',
      spreadsheetData: [{ Region: 'North', Target: '₹12.5M', Actual: '₹14.2M' }, { Region: 'South', Target: '₹18.0M', Actual: '₹19.8M' }]
    }
  });

  await TeamMessage.create({
    teamId: demoTeam._id, channel: '#general', senderId: demoUser._id, senderName: 'Sabariyandeesh V',
    text: 'Welcome squad! Team workspace is ready for Omnichannel Retail Sales Trend Analysis.'
  });

  await Meeting.create({
    meetingId: 'MEET-884921', title: 'Alpha Squad Sprint Review & AI Presentation Sync',
    teamId: demoTeam._id, projectId: targetProj.projectId, hostId: demoUser._id, hostName: demoUser.fullName,
    date: new Date().toISOString().split('T')[0], time: '03:30 PM', durationMinutes: 30,
    agenda: 'Review final retail sales forecast deck and test AI presentation simulation.', status: 'scheduled',
    participants: [{ userId: demoUser._id, fullName: demoUser.fullName, joined: true }],
    notes: { summary: 'Synchronized final deliverable submissions across all tasks.', decisions: ['Accepted data pipeline.'], actionItems: [{ item: 'Generate final PDF report', assignee: 'Sabariyandeesh V', status: 'completed' }], aiMinutes: 'Meeting recorded: All deliverables verified with 80% completion.' }
  });

  await TaskSubmission.create({
    userId: demoUser._id, projectId: targetProj.projectId, taskId: 'T1', deliverableType: 'document',
    content: 'Architecture Specification: Ingested 1.5M transactions, modeled star schema with fact_sales and dimension tables.',
    status: 'Verified', score: 95, rubricScores: { accuracy: 24, problemSolving: 24, industryRelevance: 19, presentation: 14, technicalQuality: 14 },
    feedback: 'Outstanding architecture document.'
  });

  await Certificate.create({
    credentialId: 'VCORP-CERT-994820', type: 'project_certificate', userId: demoUser._id, studentName: demoUser.fullName,
    title: 'V-CORP Project Completion Certificate: Omnichannel Retail Sales Trend Analysis', role: 'Data Analyst',
    projectName: 'Omnichannel Retail Sales Trend Analysis', skills: ['Python', 'SQL', 'Tableau', 'Data Cleaning'],
    score: 94, issuedDate: new Date(Date.now() - 86400000 * 2),
    verificationUrl: '/verify/certificate/VCORP-CERT-994820', qrCodeUrl: '/verify/certificate/VCORP-CERT-994820'
  });

  await Certificate.create({
    credentialId: 'VCORP-TASK-773812', type: 'task_credential', userId: demoUser._id, studentName: demoUser.fullName,
    title: 'Verified Task Competency: Requirement Analysis & Problem Scoping', role: 'Data Analyst',
    projectName: 'Omnichannel Retail Sales Trend Analysis', taskTitle: 'Requirement Analysis & Problem Scoping',
    skills: ['Architecture Modeling', 'Star Schema'], score: 95, issuedDate: new Date(Date.now() - 86400000 * 3),
    verificationUrl: '/verify/certificate/VCORP-TASK-773812', qrCodeUrl: '/verify/certificate/VCORP-TASK-773812'
  });

  for (const b of BADGES_CATALOG.slice(0, 6)) {
    await Badge.create({
      userId: demoUser._id, badgeId: b.id, title: b.title, description: b.description,
      icon: b.icon, category: b.category, unlockedAt: new Date()
    });
  }

  const demoPeers = [
    { name: 'Aarav Nair', college: 'IIT Madras', role: 'Software Developer', score: 94, xp: 4200, level: 5 },
    { name: 'Sneha Kulkarni', college: 'BITS Pilani', role: 'Data Analyst', score: 91, xp: 3800, level: 4 },
    { name: 'Rohan Mehta', college: 'NIT Trichy', role: 'Financial Analyst', score: 87, xp: 3300, level: 4 },
    { name: 'Tanvi Deshmukh', college: 'VIT Vellore', role: 'Business Analyst', score: 85, xp: 3100, level: 3 },
    { name: 'Karthik Raja', college: 'PSG College of Tech', role: 'Software Developer', score: 82, xp: 2800, level: 3 },
    { name: 'Meera Sen', college: 'SRM University', role: 'UI/UX Designer', score: 80, xp: 2600, level: 3 }
  ];

  for (const peer of demoPeers) {
    const u = await User.create({
      fullName: peer.name, email: peer.name.toLowerCase().replace(/\\s+/g, '.') + '@college.edu',
      passwordHash: demoPass, role: 'student', college: peer.college, degree: 'B.Tech', targetRole: peer.role
    });
    await StudentProfile.create({
      userId: u._id, fullName: peer.name, email: u.email, college: peer.college, degree: 'B.Tech',
      department: 'Engineering', academicYear: 'Final Year', graduationYear: 2026, targetRole: peer.role,
      skills: ['Domain Fundamentals', 'Problem Solving'], xp: peer.xp, level: peer.level, streakDays: 5,
      careerReadinessScore: peer.score, readinessTier: peer.score >= 91 ? 'Industry Ready' : peer.score >= 76 ? 'Highly Job Ready' : 'Job Ready'
    });
    await CareerReadinessScore.create({
      userId: u._id, overallScore: peer.score, tier: peer.score >= 91 ? 'Industry Ready' : 'Highly Job Ready',
      components: { resume: peer.score, skills: peer.score, aptitude: peer.score, logicalReasoning: peer.score, verbalAbility: peer.score, aiInterview: peer.score, projects: peer.score, communication: peer.score, teamwork: peer.score, problemSolving: peer.score }
    });
  }

  console.log('Seeding Complete! Demo User: demo@vcorp.local / Demo@12345');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
;

fs.writeFileSync(path.resolve(__dirname, 'seedData.ts'), seedScript, 'utf8');
console.log('seedData.ts written successfully');

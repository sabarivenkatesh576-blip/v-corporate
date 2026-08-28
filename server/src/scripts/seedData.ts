import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

import { User } from '../models/User';
import { StudentProfile } from '../models/StudentProfile';
import { Role } from '../models/Role';
import { Company } from '../models/Company';
import { Question } from '../models/Question';
import { Project } from '../models/Project';
import { LearningModule } from '../models/LearningModule';
import { Team } from '../models/Team';
import { TeamMessage } from '../models/TeamMessage';
import { Meeting } from '../models/Meeting';
import { Certificate } from '../models/Certificate';
import { Badge } from '../models/Badge';
import { Resume } from '../models/Resume';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { InterviewSession } from '../models/InterviewSession';
import { CareerReadinessScore } from '../models/CareerReadinessScore';
import { TaskSubmission } from '../models/TaskSubmission';
import { PlacementDrive } from '../models/PlacementDrive';
import { Internship } from '../models/Internship';
import { XPTransaction } from '../models/XPTransaction';
import { CommunicationPractice } from '../models/CommunicationPractice';

import { MNC_COMPANIES, CAREER_ROLES, APTITUDE_TOPICS, BADGES_CATALOG } from '../shared/constants';
import { QuestionDifficulty } from '../shared/types';
import { connectDB } from '../config/db';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


export async function seedDatabase() {
  const uri = await connectDB();
  console.log('Starting Reference Data Seeding on:', uri);

  await Promise.all([
    Company.deleteMany({}),
    Role.deleteMany({}),
    Question.deleteMany({}),
    Project.deleteMany({}),
    LearningModule.deleteMany({}),
    Badge.deleteMany({}),
    PlacementDrive.deleteMany({}),
    Internship.deleteMany({}),
    User.deleteMany({ email: /test.*@vcorp\\.local/ }),
    StudentProfile.deleteMany({ email: /test.*@vcorp\\.local/ })
  ]);

  for (const r of CAREER_ROLES) {
    await Role.create(r);
  }

  for (const c of MNC_COMPANIES) {
    await Company.create({
      companyId: c.id,
      ...c
    });
  }

  const questionDocs: any[] = [];
  const qTopics = APTITUDE_TOPICS['Quantitative Aptitude'];
  qTopics.forEach((topic, topicIdx) => {
    for (let i = 1; i <= 11; i++) {
      const diff: QuestionDifficulty = i <= 3 ? 'beginner' : i <= 8 ? 'intermediate' : 'advanced';
      const baseNum = 10 + (topicIdx * 7) + (i * 5);
      const multNum = baseNum * 2;
      let correct = (i + topicIdx) % 4;
      let qText = 'In an enterprise quantitative scenario regarding [' + topic + '], if initial baseline is ' + baseNum + ' and scaled output reaches ' + multNum + ' across ' + (i + 2) + ' nodes, evaluate the verified metric.';
      let opts = [baseNum + i * 3 + ' units', baseNum + i * 6 + ' units', baseNum + i * 9 + ' units', baseNum + i * 12 + ' units'];
      let exp = 'Analytical derivation across ' + topic + ' confirms index ' + correct + ' as optimal.';
      let formula = 'Analytical formula for ' + topic;

      const correctVal = opts[0];
      opts[0] = opts[correct];
      opts[correct] = correctVal;

      questionDocs.push({
        category: 'Quantitative Aptitude',
        topic,
        difficulty: diff,
        question: qText,
        options: opts,
        correctAnswer: correct,
        explanation: exp,
        formula,
        skill: 'Quantitative Analysis & Calculation',
        timeRecommendationSeconds: diff === 'beginner' ? 45 : diff === 'intermediate' ? 60 : 75
      });
    }
  });

  const lTopics = APTITUDE_TOPICS['Logical Reasoning'];
  lTopics.forEach((topic, topicIdx) => {
    for (let i = 1; i <= 13; i++) {
      const diff: QuestionDifficulty = i <= 4 ? 'beginner' : i <= 9 ? 'intermediate' : 'advanced';
      const correct = (i * 2 + topicIdx) % 4;
      let qText = 'Logical analysis scenario for [' + topic + ']: Given constraint pattern level ' + i + ', evaluate the valid structural deduction.';
      let opts = ['Deduction Rule A-' + i, 'Deduction Rule B-' + i, 'Deduction Rule C-' + i, 'Deduction Rule D-' + i];
      let exp = 'Applying structural logical principles verifies choice ' + correct + '.';
      let formula = 'Logical mapping for ' + topic;

      const correctVal = opts[0];
      opts[0] = opts[correct];
      opts[correct] = correctVal;

      questionDocs.push({
        category: 'Logical Reasoning',
        topic,
        difficulty: diff,
        question: qText,
        options: opts,
        correctAnswer: correct,
        explanation: exp,
        formula,
        skill: 'Logical Deduction & Pattern Recognition',
        timeRecommendationSeconds: diff === 'beginner' ? 45 : 60
      });
    }
  });

  const vTopics = APTITUDE_TOPICS['Verbal Ability'];
  vTopics.forEach((topic, topicIdx) => {
    for (let i = 1; i <= 15; i++) {
      const diff: QuestionDifficulty = i <= 5 ? 'beginner' : i <= 10 ? 'intermediate' : 'advanced';
      const correct = (i + topicIdx) % 4;
      let qText = 'In formal corporate communication regarding [' + topic + '], select the most articulate and grammatically rigorous statement:';
      let opts = [
        'The executive committee has approved the revised milestone delivery schedule.',
        'The executive committee have approved the revised milestone delivery schedule.',
        'The executive committee having approved the revised milestone delivery schedule.',
        'The executive committee has approve the revised milestone delivery schedule.'
      ];
      let exp = 'Grammar precision in ' + topic + ' requires active voice and singular collective subject-verb agreement.';
      let formula = 'Standard Grammar Rule for ' + topic;

      const correctVal = opts[0];
      opts[0] = opts[correct];
      opts[correct] = correctVal;

      questionDocs.push({
        category: 'Verbal Ability',
        topic,
        difficulty: diff,
        question: qText,
        options: opts,
        correctAnswer: correct,
        explanation: exp,
        formula,
        skill: 'Verbal Fluency & Grammar Precision',
        timeRecommendationSeconds: diff === 'beginner' ? 30 : 45
      });
    }
  });

  await Question.insertMany(questionDocs);
  console.log('Seeded ' + questionDocs.length + ' Aptitude Questions.');

  const projectDocs: any[] = [];
  for (const roleDef of CAREER_ROLES) {
    const roleName = roleDef.title;
    for (let i = 0; i < 20; i++) {
      const diff: QuestionDifficulty = i < 6 ? 'beginner' : i < 15 ? 'intermediate' : 'advanced';
      const pId = 'PROJ-' + roleName.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 4) + '-' + String(i + 1).padStart(3, '0');
      const title = roleName + ' Enterprise Capstone Phase ' + (i + 1);
      const context = 'Simulated corporate environment modeled after high-scale enterprise standards with SLA benchmarks for ' + roleName + '.';
      const problem = 'Execute domain architecture and deliverables resolving enterprise bottlenecks for ' + title + '.';

      const tasks = [
        { taskId: 'T1', title: 'Problem Scoping & Architecture Specification', description: 'Analyze business constraints and draft architecture specification.', deliverableType: 'document', expectedOutput: 'Architecture Specification', status: 'To Do' },
        { taskId: 'T2', title: 'Data Ingestion & Preprocessing', description: 'Validate schema integrity and establish reliable domain models.', deliverableType: 'code', expectedOutput: 'Ingestion scripts', status: 'To Do' },
        { taskId: 'T3', title: 'Core Business Logic & Solution Implementation', description: 'Implement verified workflows and algorithms.', deliverableType: roleDef.category === 'Tech' ? 'code' : roleDef.category === 'Finance' ? 'spreadsheet' : 'document', expectedOutput: 'Production-ready solution', status: 'To Do' },
        { taskId: 'T4', title: 'Validation & Benchmarking', description: 'Execute automated tests and benchmark performance.', deliverableType: 'spreadsheet', expectedOutput: 'Verification report', status: 'To Do' },
        { taskId: 'T5', title: 'Executive Presentation & Sign-off', description: 'Synthesize deliverables for stakeholder presentation.', deliverableType: 'presentation', expectedOutput: 'Executive Deck', status: 'To Do' }
      ];

      projectDocs.push({
        projectId: pId,
        title,
        role: roleName,
        difficulty: diff,
        problemStatement: problem,
        businessContext: context,
        objectives: ['Model robust architecture for ' + title, 'Implement solution solving bottlenecks', 'Deliver executive presentation'],
        requiredSkills: roleDef.requiredSkills.slice(0, 5),
        learningOutcomes: ['Corporate problem solving in ' + roleName, 'Agile squad collaboration', 'Verified digital credential'],
        datasetPreview: {
          sampleRecords: [
            { id: 101, metric: 'Throughput', value: '99.4%', status: 'Nominal' },
            { id: 102, metric: 'Latency', value: '38ms', status: 'Optimal' },
            { id: 103, metric: 'Efficiency', value: '+18.2%', status: 'Exceeding' }
          ],
          totalRows: 1500 + i * 250
        },
        datasetType: roleDef.category === 'Data' ? 'csv' : roleDef.category === 'Tech' ? 'json' : 'xlsx',
        tasks,
        deadlineDays: diff === 'beginner' ? 5 : diff === 'intermediate' ? 8 : 12,
        evaluationRubric: { accuracy: 25, problemSolving: 25, industryRelevance: 20, presentation: 15, technicalQuality: 15 },
        featured: i < 3
      });
    }
  }

  await Project.insertMany(projectDocs);
  console.log('Seeded ' + projectDocs.length + ' Projects.');

  console.log('Badges Catalog active with ' + BADGES_CATALOG.length + ' unlockable badges.');

  const drivesData = [
    {
      companyName: 'Tata Consultancy Services (TCS)',
      companyId: 'tcs',
      roleTitle: 'Software Developer (Digital & Prime)',
      driveDate: new Date(Date.now() + 14 * 86400000),
      registrationDeadline: new Date(Date.now() + 7 * 86400000),
      packageLPA: '7.5 - 11.5 LPA',
      jobLocation: 'Pan India (Bangalore, Chennai, Pune, Hyderabad, Mumbai)',
      eligibilityCriteria: {
        minGpa: 6.5,
        allowedDegrees: ['B.Tech', 'B.E', 'M.Tech', 'MCA'],
        allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication'],
        graduationYears: [2025, 2026, 2027],
        requiredSkills: ['Java/Python', 'SQL', 'Data Structures & Algorithms']
      },
      selectionRounds: [
        { roundNumber: 1, name: 'National Qualifier Test (NQT)', description: 'Quant, Logical, Verbal & Coding' },
        { roundNumber: 2, name: 'Technical Interview', description: 'CS fundamentals & project viva' },
        { roundNumber: 3, name: 'HR Interview', description: 'Behavioral & cultural fit' }
      ],
      description: 'Annual flagship placement drive for high-performing engineering students.',
      openingsCount: 45,
      status: 'upcoming'
    },
    {
      companyName: 'Deloitte',
      companyId: 'deloitte',
      roleTitle: 'Business & Technology Consulting Analyst',
      driveDate: new Date(Date.now() + 21 * 86400000),
      registrationDeadline: new Date(Date.now() + 12 * 86400000),
      packageLPA: '8.5 - 13.0 LPA',
      jobLocation: 'Hyderabad / Bangalore / Gurgaon',
      eligibilityCriteria: {
        minGpa: 7.0,
        allowedDegrees: ['B.Tech', 'B.E', 'BBA', 'B.Com', 'MBA'],
        allowedDepartments: ['Computer Science and Engineering', 'Information Technology', 'Business Analytics', 'Finance', 'Management'],
        graduationYears: [2025, 2026, 2027],
        requiredSkills: ['Problem Solving', 'SQL/Excel', 'Process Mapping', 'Communication']
      },
      selectionRounds: [
        { roundNumber: 1, name: 'Online Cognitive & Domain Test', description: 'Aptitude & Business Case' },
        { roundNumber: 2, name: 'Case Study Group Discussion', description: 'Business problem solving' },
        { roundNumber: 3, name: 'Partner Interview', description: 'Strategic perspective & leadership' }
      ],
      description: 'Premier campus recruitment for Strategy & Technology Consulting squads.',
      openingsCount: 25,
      status: 'upcoming'
    }
  ];

  for (const d of drivesData) {
    await PlacementDrive.create(d);
  }

  const internshipsData = [
    {
      companyName: 'Flipkart',
      companyId: 'flipkart',
      roleTitle: 'Data Analytics & Warehouse Intelligence Intern',
      industry: 'E-Commerce & Supply Chain',
      stipend: 'Rs. 45,000 / month',
      duration: '3-6 Months',
      location: 'Bangalore / Hybrid',
      workMode: 'Hybrid',
      requiredSkills: ['Python', 'SQL', 'Tableau', 'Data Cleaning', 'Statistics'],
      preferredDegree: ['B.Tech', 'B.E', 'B.Sc', 'MCA'],
      preferredDepartment: ['Computer Science', 'Information Technology', 'Data Science'],
      description: 'Work with central supply chain analytics squad optimizing fulfillment center throughput.',
      responsibilities: [
        'Analyze daily warehouse throughput datasets to identify dispatch bottlenecks',
        'Build automated SQL queries and Tableau executive dashboards'
      ],
      learningOutcomes: [
        'Production-scale BigQuery and Python data pipelines',
        'Executive data storytelling and KPI instrumentation'
      ],
      openingsCount: 8,
      deadline: new Date(Date.now() + 30 * 86400000),
      verifiedSource: true,
      sourceAttribution: 'V-CORP Industry Partner Portal'
    },
    {
      companyName: 'Microsoft Azure',
      companyId: 'microsoft',
      roleTitle: 'Cloud Engineering & DevOps Trainee',
      industry: 'Enterprise Cloud & Distributed Systems',
      stipend: 'Rs. 60,000 / month',
      duration: '6 Months',
      location: 'Hyderabad / Remote',
      workMode: 'Remote',
      requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'Python/Go', 'CI/CD Pipelines'],
      preferredDegree: ['B.Tech', 'B.E', 'M.Tech', 'MCA'],
      preferredDepartment: ['Computer Science and Engineering', 'Information Technology'],
      description: 'Support core Azure infrastructure reliability engineering and automated deployment pipelines.',
      responsibilities: [
        'Write Terraform scripts for automated cloud resource provisioning',
        'Monitor microservice health using Prometheus and Grafana dashboards'
      ],
      learningOutcomes: [
        'High-scale distributed systems architecture',
        'Production container orchestration with Kubernetes'
      ],
      openingsCount: 5,
      deadline: new Date(Date.now() + 45 * 86400000),
      verifiedSource: true,
      sourceAttribution: 'V-CORP Industry Partner Portal'
    }
  ];

  for (const intern of internshipsData) {
    await Internship.create(intern);
  }

  const learningModulesData = [
    {
      skill: 'SQL',
      title: 'Enterprise SQL: Complex Queries, Window Functions & Indexing',
      description: 'Master enterprise-grade relational database queries, multi-table joins, subqueries, and indexing.',
      role: 'Data Analyst',
      difficulty: 'intermediate',
      estimatedHours: 6,
      topics: [
        {
          title: 'Relational Foundations & Filtering',
          content: 'Understand relational schemas, foreign keys, and performant filtering using WHERE vs HAVING.',
          codeSnippet: 'SELECT employee_id, full_name, department, salary FROM employees WHERE salary > 75000 AND status = \'Active\' ORDER BY salary DESC;',
          keyTakeaway: 'Always apply indexed filter conditions early in query lifecycle.'
        }
      ],
      quiz: [
        { question: 'Which clause filters aggregated groups in SQL?', options: ['WHERE', 'HAVING', 'GROUP FILTER', 'ORDER BY'], correctIndex: 1, explanation: 'HAVING filters after GROUP BY.' }
      ],
      practiceProject: {
        title: 'Retail Sales SQL Diagnostic',
        instructions: 'Write SQL queries calculating monthly category sales growth.'
      }
    }
  ];

  for (const m of learningModulesData) {
    await LearningModule.create(m);
  }

  console.log('ALL V-CORP REFERENCE DATA SEEDED SUCCESSFULLY!');
  console.log('ZERO fake student accounts, ZERO fake XP, clean slate.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

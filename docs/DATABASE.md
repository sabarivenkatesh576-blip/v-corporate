# 🗄️ V-CORP — Database Architecture & Schema Reference

Database: MongoDB (v6.0+)  
Object Data Modeling: Mongoose (v8.5+)  
Default Connection: `mongodb://127.0.0.1:27017/vcorp_db`

---

## 1. Core Data Models Summary

| Collection | Model Name | Primary Responsibility |
|---|---|---|
| `users` | `User` | User accounts, credentials, and global system roles (`student` vs `admin`). |
| `studentprofiles` | `StudentProfile` | College info, degree, target role, XP, Level, streaks, readiness score. |
| `careerreadinessscores` | `CareerReadinessScore` | 10-factor weighted component breakdown and historical progression. |
| `resumes` | `Resume` | Extracted competencies, work experience, role match % and suggestions. |
| `roles` | `Role` | 10 standard career roles with required skills and salary benchmarks. |
| `companies` | `Company` | 9 virtual enterprise workspaces and cultural profiles. |
| `questions` | `Question` | 336+ Quantitative, Logical, and Verbal assessment items. |
| `assessmentattempts` | `AssessmentAttempt` | Candidate test submissions, accuracy %, topic breakdown, and weak areas. |
| `interviewsessions` | `InterviewSession` | Multi-turn conversational transcripts and 9-dimension rubric evaluations. |
| `skillgaps` | `SkillGap` | Gap priority matrices (High, Medium, Low) vs role requirements. |
| `learningmodules` | `LearningModule` | Curated modules with code sandboxes, takeaways, and checkpoint quizzes. |
| `projects` | `Project` | 200+ scoped enterprise projects with tasks, datasets, and rubrics. |
| `tasksubmissions` | `TaskSubmission` | Student deliverables across IDE/Sheet/Doc with AI evaluation feedback. |
| `teams` | `Team` | Squad metadata, join codes (`VC-BA-4821`), and member role assignments. |
| `teammessages` | `TeamMessage` | Multi-channel chat messages across `#general`, `#technical`, etc. |
| `meetings` | `Meeting` | Conference schedule, participants, notes, and automated AI minutes. |
| `certificates` | `Certificate` | Cryptographic project certificates with QR code verification links. |
| `badges` | `Badge` | Unlocked achievements and verified competency badges. |
| `notifications` | `Notification` | Real-time system and squad milestone notification records. |

---

## 2. Relationships & Indexes

- **Index Optimization**:
  - `User.email` (Unique index)
  - `StudentProfile.userId` (Indexed reference)
  - `CareerReadinessScore.userId` (Indexed reference)
  - `Question.category`, `Question.topic`, `Question.difficulty` (Compound search indexes)
  - `Project.projectId`, `Project.role`, `Project.difficulty` (Lookup indexes)
  - `Team.teamCode` (Unique uppercase index)
  - `Certificate.credentialId` (Unique verification index)

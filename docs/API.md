# 📡 V-CORP — RESTful & WebSocket API Reference

Base URL: `http://localhost:5000/api`

---

## 1. Authentication & Profile APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new student profile | No |
| `POST` | `/auth/login` | Authenticate student or admin | No |
| `GET` | `/auth/me` | Retrieve current authenticated user & readiness | Yes |
| `GET` | `/profile` | Retrieve student profile and readiness score | Yes |
| `PUT` | `/profile` | Update profile information and target role | Yes |
| `GET` | `/profile/readiness` | Retrieve 10-factor score breakdown & history | Yes |

---

## 2. Resume & Skill Gap APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/resume/upload` | Upload PDF/DOCX or text resume for parsing | Yes |
| `GET` | `/resume` | Retrieve latest parsed resume data | Yes |
| `GET` | `/skill-gap` | Calculate skill gaps for target role | Yes |
| `GET` | `/skill-gap/modules` | Retrieve curated learning modules | Yes |

---

## 3. Assessment & Test Engine APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/assessment/meta` | Get all topics & counts across 3 categories | Yes |
| `GET` | `/assessment/questions` | Retrieve filtered questions for assessment | Yes |
| `POST` | `/assessment/submit` | Submit test responses & receive auto-grading | Yes |
| `GET` | `/assessment/history` | Retrieve student assessment attempts | Yes |

---

## 4. AI Mock Interview APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/interview/start` | Initialize AI interview session | Yes |
| `POST` | `/interview/answer` | Submit answer & receive dynamic follow-up | Yes |
| `GET` | `/interview/history` | Retrieve past mock interview sessions | Yes |

---

## 5. Enterprise Projects & Workspace APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/projects` | List projects (filter by role & difficulty) | Yes |
| `GET` | `/projects/:id` | Get detailed project brief, tasks & rubric | Yes |
| `POST` | `/projects/submit-task` | Submit task deliverable for AI evaluation | Yes |

---

## 6. Squads & Real-Time Collaboration APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/teams` | Get student squads | Yes |
| `POST` | `/teams/create` | Create new squad & generate join code | Yes |
| `POST` | `/teams/join` | Join squad using team code | Yes |
| `GET` | `/teams/:id/messages` | Retrieve channel messages | Yes |
| `POST` | `/teams/:id/messages` | Send message to channel | Yes |

---

## 7. Conference Meetings & AI Minutes APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/meetings` | List scheduled & active meetings | Yes |
| `POST` | `/meetings` | Schedule new conference meeting | Yes |
| `PUT` | `/meetings/:id/notes` | Save collaborative meeting notes | Yes |
| `POST` | `/meetings/:id/ai-minutes` | Generate automated AI meeting minutes | Yes |

---

## 8. Digital Credentials & Public Verification APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/credentials` | Get student certificates and badges | Yes |
| `GET` | `/credentials/verify/:id` | **Public** cryptographic credential verification | **No** |
| `GET` | `/leaderboard` | Get individual & squad rankings | Yes |

---

## 9. Administrator APIs

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/admin/stats` | Retrieve institutional cohort statistics | Yes (Admin) |
| `GET` | `/admin/students` | Get all student profiles & scores | Yes (Admin) |
| `POST` | `/admin/projects` | Create new project in library | Yes (Admin) |
| `POST` | `/admin/questions` | Add question to question bank | Yes (Admin) |

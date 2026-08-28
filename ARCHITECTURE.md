# V-CORP — System Architecture & Design

This document details the architectural blueprint, data flow, component decomposition, real-time protocols, and security model of **V-CORP (Virtual Corporate Experience Platform)**.

---

## 🏗️ High-Level System Architecture

```
                                  ┌────────────────────────────────┐
                                  │      V-CORP React Client       │
                                  │  (TypeScript + Vite + Tailwind)│
                                  └───────────────┬────────────────┘
                                                  │
                         HTTP REST API Requests   │   WebSocket (Socket.IO) & WebRTC
                                                  ▼
                        ┌───────────────────────────────────────────────────┐
                        │              Node.js + Express Backend            │
                        │                 (TypeScript Service)              │
                        └──────────────┬────────────────────┬───────────────┘
                                       │                    │
              ┌────────────────────────┴────────┐  ┌────────┴─────────────────────────┐
              │                                 │  │                                  │
              ▼                                 ▼  ▼                                  ▼
   ┌───────────────────────┐         ┌───────────────────────┐        ┌─────────────────────────┐
   │    MongoDB Database   │         │ Real-time Socket &    │        │ Dual-Engine AI Service  │
   │ (Mongoose Schemas &   │         │ Meeting Manager       │        │  - Cloud AI (Gemini)    │
   │ 20+ Domain Collections│         │ (WebRTC & Channels)   │        │  - Smart Fallback Engine│
   └───────────────────────┘         └───────────────────────┘        └─────────────────────────┘
```

---

## 🧩 Architectural Components

### 1. Frontend Client (`/client`)
- **State & Context Layer**:
  - `AuthContext`: Centralized JWT session handling, role state, and local persistence.
  - `SocketContext`: Global WebSocket connection manager for channel messaging, presence, and live task updates.
- **Service & API Layer (`/client/src/api`)**:
  - Axios instances with request/response interceptors for automatic JWT bearer header injection and graceful API error handling.
- **UI & Presentation (`/client/src/pages` & `/client/src/components`)**:
  - Modular, accessible components styled with Tailwind CSS, Recharts for analytics, Lucide icons, Canvas-Confetti for gamification rewards, and QRCode.react for credential verification.

### 2. Backend Server (`/server`)
- **Routing & Controllers (`/server/src/routes` & `/server/src/controllers`)**:
  - Strict separation of routing definitions and business logic handlers.
  - Role-based authorization middleware (`student`, `admin`) protecting sensitive endpoints.
- **Domain Services (`/server/src/services`)**:
  - `aiService.ts`: Contextual prompt orchestrator with resilient fallback handling for mock interviews, project feedback, and resume extraction.
  - `readinessCalculator.ts`: 10-component weighted scoring algorithm producing normalized scores (0–100) and tier categorizations.
  - `resumeParserService.ts`: Text extraction from multi-format files (PDF via `pdf-parse`, DOCX via `mammoth`) with skill & entity mapping.
  - `socketService.ts`: Real-time room multiplexing (`team_<id>`), broadcast notifications, live task status updates, and peer signaling.
  - `credentialService.ts`: Unique verifiable ID generation, SHA payload validation, and QR metadata formatting.

---

## ⚡ Real-Time Systems Architecture

### Socket.IO Event Lifecycle
1. **Connection & Authentication**:
   - Client sends token upon handshake. Server assigns user to socket session.
2. **Channel Multiplexing**:
   - `join_team_channel`: Client joins room `team_<teamId>_<channel>`.
   - `send_message`: Persists message in MongoDB and broadcasts `new_message` to room members with sender profile.
3. **Live Task Collaboration**:
   - `task_updated`: Dispatched whenever a student edits or submits a task. All team members receive instantaneous visual updates on the task board.

### WebRTC Video & Audio Conference Architecture
- **Signaling**: Sockets facilitate SDP exchange (offer, answer, ICE candidates) between connected team peers.
- **Media Stream Handling**: Native HTML5 `navigator.mediaDevices.getUserMedia` with fallback alerts when hardware media devices or STUN/TURN relays are constrained.
- **In-Meeting Collaboration**: Integrated real-time meeting chat, agenda timer, collaborative minute-taking (MoM), and post-meeting AI action item generator.

---

## 🧠 AI Integration & Smart Fallback Pipeline

```
  Student Request (Interview Answer / Resume / Project Submission)
                            │
                            ▼
               Is External AI API configured?
                 ┌──────────┴──────────┐
            YES  │                     │  NO (or network timeout)
                 ▼                     ▼
        Execute API Call       Trigger Local Heuristic AI Engine:
        (e.g., Gemini-1.5)     - STAR Framework Evaluator
                 │             - Semantic Role-Skill Matcher
                 │             - Rubric Scoring Matrix
                 └──────────┬──────────┘
                            ▼
              Standardized JSON Response
            (Score, Strengths, Weaknesses,
           Follow-up Questions, Next Skills)
```

---

## 🔒 Security Architecture

1. **Authentication & Authorization**:
   - Stateless JWT tokens signed with HMAC-SHA256.
   - Passwords hashed using bcrypt with salt rounds = 10.
2. **Input & Upload Validation**:
   - Multer middleware enforces file type whitelisting (`.pdf`, `.doc`, `.docx`, `.png`, `.jpg`, `.xlsx`, `.zip`) and file size boundaries (max 10MB).
3. **Error Boundaries & Defense in Depth**:
   - Centralized error handler sanitizes stack traces from production responses.
   - Public credential verification routes only expose non-sensitive public hashes and certificates.

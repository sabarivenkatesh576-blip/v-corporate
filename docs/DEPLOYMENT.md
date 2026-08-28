# 🚀 V-CORP — Production Deployment & Cloud Setup Guide

## 1. Local Development Execution

```bash
# Start MongoDB locally
# (Ensure mongod service is active on localhost:27017)

# Start Backend Server
cd server
npm install
npm run seed     # Seeds 200 projects, 336 questions, and demo student
npm run dev      # Server active on http://localhost:5000

# Start Frontend Client (in separate terminal)
cd client
npm install
npm run dev      # Client active on http://localhost:5173
```

---

## 2. Production Docker & Container Deployment

### Backend Dockerfile (`server/Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY ../shared ../shared
RUN npm run build
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### Frontend Dockerfile (`client/Dockerfile`):
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `PORT` | Backend HTTP & WebSocket Port | `5000` |
| `MONGODB_URI` | MongoDB Connection String | `mongodb://127.0.0.1:27017/vcorp_db` |
| `JWT_SECRET` | Secret token for signing candidate JWTs | `vcorp_production_jwt_secret_sih2026` |
| `CLIENT_URL` | Frontend origin for CORS policy | `http://localhost:5173` |
| `AI_PROVIDER` | AI Execution mode (`local` or `cloud`) | `local` |
| `STORAGE_PROVIDER` | Deliverable storage provider | `local` |
| `MEETING_PROVIDER` | Conference video provider | `webrtc` |

import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import resumeRoutes from './routes/resumeRoutes';
import skillGapRoutes from './routes/skillGapRoutes';
import assessmentRoutes from './routes/assessmentRoutes';
import interviewRoutes from './routes/interviewRoutes';
import projectRoutes from './routes/projectRoutes';
import teamRoutes from './routes/teamRoutes';
import meetingRoutes from './routes/meetingRoutes';
import credentialRoutes from './routes/credentialRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import aiAssistantRoutes from './routes/aiAssistantRoutes';
import adminRoutes from './routes/adminRoutes';
import companyRoutes from './routes/companyRoutes';
import placementRoutes from './routes/placementRoutes';
import internshipRoutes from './routes/internshipRoutes';
import communicationRoutes from './routes/communicationRoutes';
import gamificationRoutes from './routes/gamificationRoutes';

import { SocketService } from './services/socketService';
import { errorHandler } from './middleware/errorHandler';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Socket.IO Setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
SocketService.init(io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/credentials', credentialRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/assistant', aiAssistantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/gamification', gamificationRoutes);

// Static client build serving
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'V-CORP Virtual Corporate Experience Platform',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Single-page application fallback for client routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/socket.io')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Centralized error handling
app.use(errorHandler);

// Database Connection & Server Start
connectDB()
  .then((uri) => {
    console.log('MongoDB connected successfully on:', uri);
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log('V-CORP Backend Server running on http://0.0.0.0:' + PORT);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log('V-CORP Backend running in offline/degraded mode on http://0.0.0.0:' + PORT);
    });
  });

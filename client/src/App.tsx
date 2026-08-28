import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { VCorpAssistWidget } from './components/chatbot/VCorpAssistWidget';
import { DemoGuideModal } from './components/common/DemoGuideModal';

import { CareerProvider } from './context/CareerContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumePage } from './pages/ResumePage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPage } from './pages/LearningPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AssessmentRunPage } from './pages/AssessmentRunPage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { VirtualOfficePage } from './pages/VirtualOfficePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { TeamsPage } from './pages/TeamsPage';
import { MeetingRoomPage } from './pages/MeetingRoomPage';
import { CredentialWalletPage } from './pages/CredentialWalletPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { PlacementPage } from './pages/PlacementPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { AIStyleManagerPage } from './pages/AIStyleManagerPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-xs text-sky-400">
        <div className="flex items-center space-x-2">
          <span className="h-3 w-3 rounded-full bg-sky-400 animate-ping"></span>
          <span>Loading V-CORP Career Workspace...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <VCorpAssistWidget />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CareerProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify/:id" element={<PublicVerifyPage />} />
              <Route path="/verify/certificate/:id" element={<PublicVerifyPage />} />
              <Route path="/verify/badge/:id" element={<PublicVerifyPage />} />

              {/* Protected Career Routes */}
              <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
              <Route path="/companies" element={<ProtectedLayout><CompaniesPage /></ProtectedLayout>} />
              <Route path="/placement" element={<ProtectedLayout><PlacementPage /></ProtectedLayout>} />
              <Route path="/internships" element={<ProtectedLayout><InternshipsPage /></ProtectedLayout>} />
              <Route path="/style-manager" element={<ProtectedLayout><AIStyleManagerPage /></ProtectedLayout>} />
              <Route path="/ai-manager" element={<ProtectedLayout><AIStyleManagerPage /></ProtectedLayout>} />
              <Route path="/profile" element={<ProtectedLayout><ProfilePage /></ProtectedLayout>} />
              <Route path="/resume" element={<ProtectedLayout><ResumePage /></ProtectedLayout>} />
              <Route path="/skill-gap" element={<ProtectedLayout><SkillGapPage /></ProtectedLayout>} />
              <Route path="/learning" element={<ProtectedLayout><LearningPage /></ProtectedLayout>} />
              <Route path="/assessments" element={<ProtectedLayout><AssessmentsPage /></ProtectedLayout>} />
              <Route path="/assessments/run" element={<ProtectedLayout><AssessmentRunPage /></ProtectedLayout>} />
              <Route path="/interview" element={<ProtectedLayout><MockInterviewPage /></ProtectedLayout>} />
              <Route path="/ai-interview" element={<ProtectedLayout><MockInterviewPage /></ProtectedLayout>} />
              <Route path="/virtual-office" element={<ProtectedLayout><VirtualOfficePage /></ProtectedLayout>} />
              <Route path="/projects" element={<ProtectedLayout><ProjectsPage /></ProtectedLayout>} />
              <Route path="/projects/:id" element={<ProtectedLayout><ProjectDetailPage /></ProtectedLayout>} />
              <Route path="/workspace" element={<ProtectedLayout><WorkspacePage /></ProtectedLayout>} />
              <Route path="/project-workspace" element={<ProtectedLayout><WorkspacePage /></ProtectedLayout>} />
              <Route path="/teams" element={<ProtectedLayout><TeamsPage /></ProtectedLayout>} />
              <Route path="/squads" element={<ProtectedLayout><TeamsPage /></ProtectedLayout>} />
              <Route path="/meetings" element={<ProtectedLayout><MeetingRoomPage /></ProtectedLayout>} />
              <Route path="/conference" element={<ProtectedLayout><MeetingRoomPage /></ProtectedLayout>} />
              <Route path="/credentials" element={<ProtectedLayout><CredentialWalletPage /></ProtectedLayout>} />
              <Route path="/leaderboard" element={<ProtectedLayout><LeaderboardPage /></ProtectedLayout>} />
              <Route path="/admin" element={<ProtectedLayout><AdminDashboardPage /></ProtectedLayout>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </CareerProvider>
    </AuthProvider>
  );
}

const LandingRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />;
};

import React from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Code
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedCompany,
    targetRole,
    currentCompanyInfo,
    currentRoleInfo,
    activeProject,
    roleSkills,
    credentials
  } = useCareer();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold">
            Target: {selectedCompany} • {targetRole}
          </span>
          <h1 className="text-2xl font-extrabold text-white">
            Welcome back, {user?.fullName || 'Student'}
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your career ecosystem is fully customized for <strong className="text-sky-400">{targetRole}</strong> recruitment and experiential learning at <strong className="text-white">{selectedCompany}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/style-manager"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Manager Cabin
          </Link>
          <Link
            to="/workspace"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            Open Workspace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
        {[
          { label: 'Role Readiness Score', value: '86%', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Verified Badges', value: `${credentials.length} Badges`, icon: Award, color: 'text-sky-400' },
          { label: 'Active Capstone', value: activeProject?.title || 'In Progress', icon: Code, color: 'text-amber-400' },
          { label: 'Recruitment Drives', value: '4 Eligible', icon: Briefcase, color: 'text-indigo-400' }
        ].map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{m.label}</span>
              <m.icon className={`w-4.5 h-4.5 ${m.color}`} />
            </div>
            <div className={`text-xl font-extrabold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Matrix */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" /> Role Competency & Skill Gap Status
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculated for {targetRole} at {selectedCompany}</p>
            </div>
            <Link to="/skill-gap" className="text-xs text-sky-400 hover:underline font-semibold">
              View All Gaps &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {roleSkills.slice(0, 4).map(sk => (
              <div key={sk.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{sk.name}</div>
                  <div className="text-slate-400 text-[11px]">Required: {sk.requiredLevel}% · Current: {sk.currentLevel}%</div>
                </div>
                <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${sk.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                  {sk.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Navigator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white">Career Acceleration Zones</h3>
          <div className="space-y-2">
            {[
              { title: 'AI Mock Interview', path: '/interview', desc: 'STAR evaluation with score report' },
              { title: 'Resume Analyzer', path: '/resume', desc: 'ATS score vs target role' },
              { title: 'Virtual Internship', path: '/internships', desc: '8-week experiential roadmap' },
              { title: 'Conference Room', path: '/meetings', desc: 'Standup & client presentations' },
              { title: 'Project Squads', path: '/teams', desc: 'Collaborate with team members' }
            ].map((z, idx) => (
              <Link
                key={idx}
                to={z.path}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850 block transition space-y-0.5"
              >
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{z.title}</span>
                  <ArrowRight className="w-3 h-3 text-sky-400" />
                </div>
                <div className="text-[11px] text-slate-400">{z.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

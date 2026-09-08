import React, { useState, useEffect } from 'react';
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
  Code,
  Edit2,
  Check,
  X
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, profile, readiness, updateFullName } = useAuth();
  const {
    selectedCompany,
    targetRole,
    currentCompanyInfo,
    currentRoleInfo,
    activeProject,
    roleSkills,
    credentials,
    internshipStatus,
    hiringRounds
  } = useCareer();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.fullName || 'Candidate');

  useEffect(() => {
    if (user?.fullName) setEditedName(user.fullName);
  }, [user]);

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateFullName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const realScore = readiness?.overallScore ?? profile?.careerReadinessScore ?? 0;
  const completedRoundsCount = hiringRounds.filter(r => r.completed).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/50 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold">
            Target: {selectedCompany} • {targetRole}
          </span>
          <div className="flex items-center gap-3">
            {isEditingName ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="px-3 py-1 text-lg font-bold text-white bg-slate-950 border border-sky-500 rounded-lg focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                  title="Save Name"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditedName(user?.fullName || 'Candidate');
                    setIsEditingName(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
                <span>Welcome back, <span className="text-sky-400">{user?.fullName || 'Candidate'}</span></span>
                <button
                  onClick={() => {
                    setEditedName(user?.fullName || 'Candidate');
                    setIsEditingName(true);
                  }}
                  className="p-1 rounded-lg text-slate-500 hover:text-sky-400 hover:bg-slate-800/80 transition"
                  title="Click to edit your name"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </h1>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Your career ecosystem is configured for <strong className="text-sky-400">{targetRole}</strong> recruitment and experiential learning at <strong className="text-white">{selectedCompany}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/style-manager"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-purple-400" /> AI Mentor Cabin
          </Link>
          <Link
            to="/internships"
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            Internship Workstation <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
        {[
          {
            label: 'Career Readiness Score',
            value: realScore > 0 ? `${realScore}%` : '0% (Start Test)',
            icon: TrendingUp,
            color: realScore >= 70 ? 'text-emerald-400' : realScore > 0 ? 'text-sky-400' : 'text-slate-400'
          },
          {
            label: 'Earned Verified Badges',
            value: `${credentials.length} Badges`,
            icon: Award,
            color: credentials.length > 0 ? 'text-sky-400' : 'text-slate-400'
          },
          {
            label: 'Internship Sprint Slices',
            value: `${internshipStatus.completedWeeks} / ${internshipStatus.totalWeeks} Completed`,
            icon: Code,
            color: internshipStatus.completedWeeks > 0 ? 'text-emerald-400' : 'text-amber-400'
          },
          {
            label: 'Recruitment Selection',
            value: completedRoundsCount > 0 ? `${completedRoundsCount} / 7 Rounds Cleared` : 'Round 1 Open',
            icon: Briefcase,
            color: completedRoundsCount > 0 ? 'text-indigo-400' : 'text-slate-400'
          }
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
                  <div className="text-slate-400 text-[11px]">Required: {sk.requiredLevel}% · Current Baseline: {sk.currentLevel}%</div>
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
              { title: 'Virtual Internship', path: '/internships', desc: '4-Week live practical workstation sprints' },
              { title: 'AI Mock Interview', path: '/interview', desc: 'STAR evaluation with score report' },
              { title: 'Resume Analyzer', path: '/resume', desc: 'ATS score vs target role' },
              { title: 'Companies & Rounds', path: '/companies', desc: '7 hiring rounds with live tests' },
              { title: 'Placement Drive Center', path: '/placement', desc: 'Upcoming recruitment schedules' },
              { title: 'Credential Wallet', path: '/credentials', desc: 'Verifiable earned certificates & badges' }
            ].map((nav, i) => (
              <Link
                key={i}
                to={nav.path}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 flex items-center justify-between text-xs transition group"
              >
                <div>
                  <div className="font-semibold text-white group-hover:text-sky-400 transition">{nav.title}</div>
                  <div className="text-[11px] text-slate-400">{nav.desc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

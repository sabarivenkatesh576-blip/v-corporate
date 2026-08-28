import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Target,
  BookOpen,
  CheckCircle,
  Mic,
  Building2,
  FolderKanban,
  Code,
  Users,
  Video,
  Award,
  Trophy,
  Briefcase,
  Compass,
  Sparkles,
  User,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Companies (15+ MNCs)', path: '/companies', icon: Building2 },
    { label: 'Placement Cell', path: '/placement', icon: Briefcase },
    { label: 'Internships', path: '/internships', icon: Compass },
    { label: 'AI Manager & Mentor', path: '/style-manager', icon: Sparkles },
    { label: 'Resume Analyzer', path: '/resume', icon: FileText },
    { label: 'Skill Gap & Map', path: '/skill-gap', icon: Target },
    { label: 'Learning Paths', path: '/learning', icon: BookOpen },
    { label: 'Assessments (600+)', path: '/assessments', icon: CheckCircle },
    { label: 'AI Mock Interview', path: '/interview', icon: Mic },
    { label: 'Virtual Office (9 Zones)', path: '/virtual-office', icon: Building2 },
    { label: 'Projects (200+)', path: '/projects', icon: FolderKanban },
    { label: 'Project Workspace', path: '/workspace', icon: Code },
    { label: 'Squads & Teams', path: '/teams', icon: Users },
    { label: 'Conference Room', path: '/meetings', icon: Video },
    { label: 'Credential Wallet', path: '/credentials', icon: Award },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/95 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Student Journey
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}

        {user?.role === 'admin' && (
          <>
            <div className="pt-4 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Administration
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-sm font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`
              }
            >
              <ShieldAlert className="h-4 w-4 text-indigo-400" />
              <span>Admin Management</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Corporate Ecosystem Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
          <p className="text-[11px] font-semibold text-slate-300">V-CORP Career Ecosystem</p>
          <p className="text-[10px] text-slate-500 mt-0.5">From Classroom to Corporate</p>
          <div className="mt-2 flex items-center justify-center space-x-1 text-[10px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Virtual Systems Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

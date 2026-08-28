import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { useSocket } from '../../context/SocketContext';
import {
  Bell,
  Flame,
  Zap,
  ShieldCheck,
  LogOut,
  User,
  Building2,
  Briefcase,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenDemoTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { user, profile, readiness, logout } = useAuth();
  const { selectedCompany, targetRole, companiesList, careerRolesList, setSelectedCompany, setTargetRole } = useCareer();
  const { notifications, clearNotification, online } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  const score = readiness?.overallScore ?? profile?.careerReadinessScore ?? 0;
  const tier = readiness?.tier ?? profile?.readinessTier ?? (score === 0 ? 'Not Calculated' : 'Beginner');

  const getTierColor = (t: string) => {
    switch (t) {
      case 'Industry Ready': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Highly Job Ready': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'Job Ready': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'Developing': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Not Calculated': return 'bg-slate-800 text-slate-400 border-slate-700';
      default: return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur-md">
      {/* Brand & Target Context Selector */}
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20">
            <span className="font-extrabold tracking-wider text-white text-lg">V</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              V-CORP
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Virtual Corporate Career Ecosystem</span>
          </div>
        </Link>

        {/* Dynamic Target Company & Role Selector Badge */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center space-x-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-sky-500/20 transition"
          >
            <Building2 className="h-3.5 w-3.5 text-sky-400" />
            <span className="font-semibold text-white">{selectedCompany}</span>
            <span className="text-slate-500">•</span>
            <span className="text-sky-300 font-medium">{targetRole}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleSelector && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-700 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase">Target Role & Company</span>
                <p className="text-[10px] text-slate-400">Controls the entire simulation context</p>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => { setTargetRole(e.target.value); setShowRoleSelector(false); }}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {careerRolesList.map(r => (
                      <option key={r.id} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-semibold">Target Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => { setSelectedCompany(e.target.value); setShowRoleSelector(false); }}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {companiesList.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center / Right Quick Stats */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Career Readiness Score Badge */}
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 rounded-xl border border-slate-700/80 bg-slate-800/80 px-3 py-1.5 transition hover:border-sky-500/50"
        >
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Readiness Index</span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-sm font-extrabold text-white">{score > 0 ? `${score}/100` : '--'}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTierColor(tier)}`}>
                {tier}
              </span>
            </div>
          </div>
        </Link>

        {/* XP & Level */}
        <div className="hidden lg:flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300">
          <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>Lvl <strong className="text-white">{profile?.level || 1}</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 font-bold">{profile?.xp || 0} XP</span>
        </div>

        {/* Daily Streak */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-2.5 py-1.5 text-xs font-semibold text-orange-400">
          <Flame className="h-4 w-4 text-orange-400" />
          <span>{profile?.streakDays || 0} Days</span>
        </div>

        {/* Real-Time Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition hover:text-white hover:bg-slate-700"
          >
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications & Broadcasts</span>
                <span className="text-[10px] text-slate-400">{notifications.length} updates</span>
              </div>
              {notifications.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">No new notifications.</p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => clearNotification(n.id)}
                      className="cursor-pointer rounded-lg border border-slate-800 bg-slate-850 p-2.5 text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{n.title}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-xs text-slate-300 hover:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-bold text-white text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline font-medium text-slate-200">{user?.fullName?.split(' ')[0] || 'Student'}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] font-semibold text-sky-400 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Student'}
                </span>
              </div>
              <Link
                to="/credentials"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                <span>My Credentials Wallet</span>
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 text-xs text-indigo-300 hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Admin Management</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                  navigate('/login');
                }}
                className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

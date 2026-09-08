import React from 'react';
import { Link} from 'react-router-dom';
import { Building2, Briefcase, Target, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Nav */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-md shadow-sky-500/20">
            <span className="font-extrabold tracking-wider text-white text-xl">V</span>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">V-CORP</span>
            <span className="block text-[10px] text-slate-400 font-medium">Virtual Corporate Career Ecosystem</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition">
            Sign In
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition shadow-mg shadow-sky-500/20">
            Get Started
          </Link>
        </div>
      </header>


      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5l mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 rounded-full bg-sky-500/10 border border-sky-500/30 px-4 py-1.5 text-xs font-semibold text-sky-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Bridging the Gap Between Academic Learning & Real-World Corporate Experience</span>
        </div>


        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Transform From <span className="text-slate-400">Job Seeker</span> ‒ <span className="text-sky-400">Skilled Candidate</span> ‒ <span className="text-emerald-400">Job-Ready Professional</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Select your target company and job role, experience realistic recruitment rounds, work inside interactive corporate workspaces, chat with your AI Manager, and gain verified placement readiness.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-extrabold transition flex items-center gap-2 shadow-xl shadow-sky-500/30"
          >
            Start Your Career Journey <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition"
          >
            Student Login
          </Link>
        </div>


        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-12 w-full text-left">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">15+ MNC Hiring Roadmaps</h3>
            <p className="text-xs text-slate-400">TCS, Deloitte, EY, KPMG, Infosys simulated 7-round recruitment.</p>
          </div>


          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Interactive Workspaces</h3>
            <p className="text-xs text-slate-400">Excel formulas, Power BI dashboards, Tally ledgers, and code runners.</p>
          </div>


          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Role-Aware AI Manager</h3>
            <p className="text-xs text-slate-400">Conversational mentor who reviews work and guides deliverables.</p>
          </div>


          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Verified Credentials</h3>
            <p className="text-xs text-slate-400">Tamper-proof cryptographic certificates for recruiters.</p>
          </div>
        </div>
      </div>


      {/* Footer */}
      <footer className="px-6 py-5 border-t border-slate-800/80 text-center text-xs text-slate-500">
        © 2026 V-CORP • Virtual Corporate Career Ecosystem. All rights reserved.
      </footer>
    </div>
  );
};

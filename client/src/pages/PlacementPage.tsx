import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck
} from 'lucide-react';

export const PlacementPage: React.FC = () => {
  const { selectedCompany, targetRole, hiringRounds, currentCompanyInfo } = useCareer();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'drives' | 'eligibility' | 'roadmap' | 'schedule'>('drives');

  const upcomingDrives = [
    { company: selectedCompany, role: targetRole, package: '12 - 18 LPA', date: 'Sept 15, 2026', status: 'Registration Open' },
    { company: 'Deloitte', role: 'Business Analyst', package: '14 - 16 LPA', date: 'Sept 22, 2026', status: 'Eligible' },
    { company: 'KPMG', role: 'Data Analyst', package: '13 - 15 LPA', date: 'Oct 05, 2026', status: 'Eligible' },
    { company: 'TCS', role: 'Software Developer', package: '9 - 14 LPA', date: 'Oct 12, 2026', status: 'Eligible' }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-sky-400" />
          Campus Placement Cell & Recruitment Drives
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track hiring drives, test your eligibility criteria, and complete selection rounds for <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'drives', label: 'Upcoming Drives' },
          { id: 'eligibility', label: 'Eligibility Check' },
          { id: 'roadmap', label: 'Hiring Roadmap' },
          { id: 'schedule', label: 'Interview Schedule' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${activeTab === t.id ? 'bg-sky-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'drives' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          {upcomingDrives.map((d, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-semibold">
                    {d.status}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{d.package}</span>
                </div>
                <h3 className="text-base font-extrabold text-white">{d.company}</h3>
                <p className="text-xs text-slate-300">Target Role: <strong className="text-sky-300">{d.role}</strong></p>
                <p className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Drive Date: {d.date}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => navigate('/companies')}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  Enter Recruitment Process <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'eligibility' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">{selectedCompany} Eligibility Matrix</h3>
          <div className="space-y-3">
            {[
              { rule: 'Minimum CGPA: 7.0 or 65% aggregate in Bachelor degree', pass: true },
              { rule: 'No active backlogs at time of recruitment drive', pass: true },
              { rule: `Completed V-CORP ${targetRole} Foundation Assessments`, pass: true },
              { rule: `Verified Capstone Project Deliverables in Workspace`, pass: true }
            ].map((e, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-200">{e.rule}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Eligible
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">{selectedCompany} Sequential Recruitment Roadmap</h3>
          <div className="space-y-3">
            {hiringRounds.map(r => (
              <div key={r.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                    {r.roundNumber}
                  </div>
                  <div>
                    <div className="font-bold text-white">{r.title}</div>
                    <div className="text-[10px] text-slate-400">{r.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/companies')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Open Round
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-white">Upcoming Placement Interviews</h3>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">{selectedCompany} Technical Panel</span>
              <span className="text-slate-400">Sept 18, 2026 · 11:00 AM</span>
            </div>
            <p className="text-slate-300">Mock & Live Technical evaluation for {targetRole}.</p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/interview')}
                className="px-4 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                Launch Mock Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

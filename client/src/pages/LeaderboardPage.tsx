import React from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { selectedCompany, targetRole, credentials } = useCareer();

  const userXp = profile?.xp || 0;
  const userBadges = credentials.length;

  const cohortList = [
    { name: 'Ananya Sharma', role: targetRole, company: selectedCompany, xp: 2200, badges: 4, isUser: false },
    { name: 'Rohan Verma', role: targetRole, company: selectedCompany, xp: 1750, badges: 3, isUser: false },
    { name: 'Priya Patel', role: targetRole, company: selectedCompany, xp: 1200, badges: 2, isUser: false },
    { name: 'Vikram Mehta', role: targetRole, company: selectedCompany, xp: 850, badges: 1, isUser: false },
    { name: user?.fullName || 'You (Candidate)', role: targetRole, company: selectedCompany, xp: userXp, badges: userBadges, isUser: true }
  ];

  // Sort cohort by real XP
  const leaders = cohortList
    .sort((a, b) => b.xp - a.xp)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" />
          Cohort Career Readiness Leaderboard
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Top performers in <strong className="text-sky-400">{targetRole}</strong> recruitment simulations for <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3">Rank</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Target Role</th>
                <th className="p-3">Company</th>
                <th className="p-3">Verified Badges</th>
                <th className="p-3">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-white">
              {leaders.map(l => (
                <tr key={l.name} className={`hover:bg-slate-850/40 ${l.isUser ? 'bg-sky-500/10 font-bold border-l-2 border-sky-500' : ''}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      {l.rank === 1 && <Medal className="w-4 h-4 text-amber-400" />}
                      {l.rank === 2 && <Medal className="w-4 h-4 text-slate-300" />}
                      {l.rank === 3 && <Medal className="w-4 h-4 text-amber-600" />}
                      <span>#{l.rank}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <span>{l.name}</span>
                      {l.isUser && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white text-[9px] font-bold">YOU</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">{l.role}</td>
                  <td className="p-3 font-semibold text-sky-400">{l.company}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold flex items-center gap-1 w-fit">
                      <Award className="w-3 h-3 text-sky-400" /> {l.badges} Badges
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">{l.xp.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

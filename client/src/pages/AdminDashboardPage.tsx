import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  ShieldAlert,
  Users,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Brain,
  Plus,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, studRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/students')
        ]);
        if (statsRes.data.success) setStats(statsRes.data.stats);
        if (studRes.data.success) setStudents(studRes.data.students || []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const tierDistribution = stats?.tierDistribution || {
    'Beginner': 1,
    'Developing': 2,
    'Job Ready': 3,
    'Highly Job Ready': 4,
    'Industry Ready': 2
  };

  const chartData = Object.entries(tierDistribution).map(([name, count]) => ({
    name,
    count
  }));

  const colors = ['#f43f5e', '#f59e0b', '#06b6d4', '#0284c7', '#10b981'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase">
              Administrator Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-indigo-400" />
            V-CORP Enterprise Administration & Cohort Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional overview of student career readiness, assessment metrics, and curriculum distribution.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow">
          <span className="text-xs font-semibold text-slate-400 uppercase">Enrolled Cohort</span>
          <p className="text-2xl font-extrabold text-white mt-1">{stats?.totalStudents || 8}</p>
          <span className="text-[10px] text-emerald-400 mt-1 block">? 100% Active Profiles</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow">
          <span className="text-xs font-semibold text-slate-400 uppercase">Average Readiness</span>
          <p className="text-2xl font-extrabold text-sky-400 mt-1">{stats?.averageReadinessScore || 84}/100</p>
          <span className="text-[10px] text-sky-300 mt-1 block">Targeting Top Corporates</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow">
          <span className="text-xs font-semibold text-slate-400 uppercase">Projects in Library</span>
          <p className="text-2xl font-extrabold text-white mt-1">{stats?.totalProjects || 200}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">10 Roles × 20 Projects</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow">
          <span className="text-xs font-semibold text-slate-400 uppercase">Question Bank</span>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">{stats?.totalQuestions || 336}</p>
          <span className="text-[10px] text-indigo-300 mt-1 block">Quant, Logical & Verbal</span>
        </div>
      </div>

      {/* Cohort Readiness Distribution Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Cohort Career Readiness Tier Distribution
          </h3>
          <span className="text-xs text-slate-400">Institutional Performance</span>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Students Management Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Cohort Student Profiles & Performance Roster
          </h3>
          <span className="text-xs text-slate-400">{students.length} Students</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">College</th>
                <th className="px-6 py-3">Target Career Role</th>
                <th className="px-6 py-3">XP Points</th>
                <th className="px-6 py-3">Readiness Score</th>
                <th className="px-6 py-3">Tier Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {students.map((st, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-3 font-semibold text-white">{st.fullName}</td>
                  <td className="px-6 py-3 text-slate-400">{st.college}</td>
                  <td className="px-6 py-3 text-sky-400 font-medium">{st.targetRole}</td>
                  <td className="px-6 py-3 font-mono text-amber-300">{st.xp} XP</td>
                  <td className="px-6 py-3 font-extrabold text-white">{st.careerReadinessScore}/100</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {st.readinessTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

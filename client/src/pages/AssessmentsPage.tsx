import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Brain
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [meta, setMeta] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Quantitative Aptitude');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [selectedMode, setSelectedMode] = useState('timed');
  const [questionCount, setQuestionCount] = useState(10);

  useEffect(() => {
    const loadMetaAndHistory = async () => {
      try {
        const [metaRes, histRes] = await Promise.all([
          api.get('/assessment/meta'),
          api.get('/assessment/history')
        ]);
        if (metaRes.data.success) setMeta(metaRes.data);
        if (histRes.data.success) setHistory(histRes.data.attempts || []);
      } catch (err) {
        console.error('Error loading assessment meta:', err);
      }
    };
    loadMetaAndHistory();
  }, []);

  const handleStartTest = () => {
    const params = new URLSearchParams({
      category: selectedCategory,
      topic: selectedTopic,
      mode: selectedMode,
      count: String(questionCount)
    });
    navigate(`/assessments/run?${params.toString()}`);
  };

  const topicsList = meta?.topics?.[selectedCategory] || [];

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Brain className="h-6 w-6 text-sky-400" />
          Aptitude & Technical Assessment Engine (300+ Questions)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Master quantitative problem solving, logical deduction, and formal corporate verbal communication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Quantitative Aptitude', count: '100+ Questions', topics: '16 Core Topics', desc: 'Number System, Time & Work, Percentages, Probability, Data Interpretation' },
          { title: 'Logical Reasoning', count: '100+ Questions', topics: '14 Core Topics', desc: 'Number Series, Seating Arrangements, Syllogisms, Pattern Recognition' },
          { title: 'Verbal Ability', count: '100+ Questions', topics: '14 Core Topics', desc: 'Subject-Verb Agreement, Error Detection, Reading Comprehension, Vocabulary' }
        ].map((cat) => (
          <div
            key={cat.title}
            onClick={() => {
              setSelectedCategory(cat.title);
              setSelectedTopic('All Topics');
            }}
            className={`cursor-pointer rounded-2xl border p-5 transition flex flex-col justify-between shadow ${
              selectedCategory === cat.title
                ? 'border-sky-500 bg-sky-500/15 shadow-sky-500/10'
                : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">{cat.title}</span>
                <span className="text-[10px] bg-slate-800 text-sky-400 px-2 py-0.5 rounded font-semibold">
                  {cat.count}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 mt-3">{cat.topics}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          Configure Assessment Session
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Assessment Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="timed">?? Timed Test (Countdown Timer)</option>
              <option value="practice">?? Practice Mode (Instant Explanations)</option>
              <option value="mock">?? Corporate Screening Mock Test</option>
              <option value="adaptive">? Adaptive Difficulty Scaling</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Specific Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="All Topics">All Topics in Category</option>
              {topicsList.map((t: string) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Number of Questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
            >
              <option value={5}>5 Questions (Quick Check)</option>
              <option value={10}>10 Questions (Standard Sprint)</option>
              <option value={20}>20 Questions (Comprehensive Test)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={handleStartTest}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:from-sky-500 hover:to-indigo-500 transition shadow-lg shadow-sky-500/25"
          >
            <span>Launch Assessment</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Assessment Attempt History & Analytics
          </h3>
          <span className="text-xs text-slate-400">{history.length} Completed Sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Mode</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Accuracy (Correct / Total)</th>
                <th className="px-6 py-3">Time Spent</th>
                <th className="px-6 py-3">Weak Areas Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {history.map((att, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-3 font-semibold text-white">{att.category}</td>
                  <td className="px-6 py-3 capitalize">{att.mode}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      att.scorePercentage >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {att.scorePercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {att.correctAnswers} / {att.totalQuestions}
                  </td>
                  <td className="px-6 py-3 text-slate-400">
                    {Math.round(att.timeTakenSeconds / 60)}m {att.timeTakenSeconds % 60}s
                  </td>
                  <td className="px-6 py-3">
                    {att.weakAreas && att.weakAreas.length > 0 ? (
                      <span className="text-[10px] text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded">
                        {att.weakAreas.slice(0, 2).join(', ')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold">Optimal</span>
                    )}
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

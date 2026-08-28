import React from 'react';
import { useCareer } from '../context/CareerContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  Target,
  Building2,
  BookOpen,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const { selectedCompany, targetRole, roleSkills, setActiveLearningModuleId, roleLearningModules } = useCareer();
  const navigate = useNavigate();

  const handleStartLearning = (skillName: string) => {
    const matchingModule = roleLearningModules.find(m => m.skill.toLowerCase() === skillName.toLowerCase()) || roleLearningModules[0];
    if (matchingModule) {
      setActiveLearningModuleId(matchingModule.id);
    }
    navigate('/learning');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="w-7 h-7 text-sky-400" />
          Role-Based Skill Gap Matrix & Mapping
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generated from your target role (<strong className="text-sky-400">{targetRole}</strong>) at <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200">Current Analysis: <strong className="text-white">{targetRole}</strong> competencies for <strong className="text-sky-400">{selectedCompany}</strong></span>
        </div>
        <Link to="/companies" className="text-sky-400 hover:underline font-semibold">
          Switch Role / Company &rarr;
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Competency & Skill Gap Breakdown</h3>

        <div className="space-y-3.5">
          {roleSkills.map(sk => (
            <div
              key={sk.name}
              className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                  <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${sk.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                    {sk.priority} Priority
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">Current: <strong className="text-sky-400">{sk.currentLevel}%</strong></span>
                  <span className="text-slate-400">Required: <strong className="text-white">{sk.requiredLevel}%</strong></span>
                  <span className="text-slate-400">Gap: <strong className={sk.gap > 0 ? 'text-rose-400' : 'text-emerald-400'}>{sk.gap > 0 ? `+${sk.gap}%` : 'None'}</strong></span>
                </div>
              </div>

              <button
                onClick={() => handleStartLearning(sk.name)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <BookOpen className="w-3.5 h-3.5" /> Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

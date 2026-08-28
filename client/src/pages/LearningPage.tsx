import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Play,
  ArrowRight,
  Code,
  Sparkles,
  Building2
} from 'lucide-react';

export const LearningPage: React.FC = () => {
  const {
    selectedCompany,
    targetRole,
    roleLearningModules,
    activeLearningModuleId,
    setActiveLearningModuleId
  } = useCareer();
  const navigate = useNavigate();

  const activeModule = roleLearningModules.find(m => m.id === activeLearningModuleId) || roleLearningModules[0];
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2]);

  const handleStepComplete = (st: number) => {
    if (!completedSteps.includes(st)) {
      setCompletedSteps(prev => [...prev, st]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-sky-400" />
          Personalized Role Learning Path
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Targeted micro-learning modules mapped to <strong className="text-sky-400">{targetRole}</strong> competencies for <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {roleLearningModules.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveLearningModuleId(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap ${activeLearningModuleId === m.id ? 'bg-sky-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {activeModule && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Module Roadmap (8 Steps)</h3>
            {Array.from({ length: 8 }).map((_, idx) => {
              const stepNum = idx + 1;
              const isDone = completedSteps.includes(stepNum);
              const isCurrent = selectedStep === stepNum;
              return (
                <button
                  key={stepNum}
                  onClick={() => setSelectedStep(stepNum)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-center justify-between transition ${isCurrent ? 'bg-sky-500 text-white font-bold' : isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <span>Step {stepNum}: Practical Application {stepNum}</span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[11px] font-semibold text-sky-400 uppercase">{activeModule.skill} • Step {selectedStep}</span>
              <h2 className="text-lg font-extrabold text-white mt-1">
                {activeModule.title} — Corporate Workshop
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {activeModule.description}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-400" /> Key Concepts & Corporate Instructions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In this step, implement standard formulas and models expected by {selectedCompany}. Practice directly in the Interactive Workspace or review AI feedback.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => handleStepComplete(selectedStep)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Mark Step as Completed
              </button>

              <button
                onClick={() => navigate('/workspace')}
                className="px-4.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                Open in Workspace <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

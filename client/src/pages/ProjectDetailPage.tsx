import React from 'react';
import { useCareer } from '../context/CareerContext';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, ArrowLeft, ArrowRight, Code } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { activeProject, selectedCompany } = useCareer();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/projects')} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </button>
      </div>

      <div className="p-6 rounded-21l bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-sky-400 uppercase">{selectedCompany} • Capstone Project</span>
            <h1 className="text-xl font-extrabold text-white mt-0.5">{activeProject?.title || 'Corporate Project'}</h1>
            <p className="text-xs text-slate-300 mt-1">{activeProject?.description}</p>
          </div>


          <button onClick={() => navigate('/workspace')} className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-mg">
            <Code className="w-4 h-4" /> Launch Interactive Workspace <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  Code,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { selectedCompany, targetRole, activeProject, setActiveProject } = useCareer();
  const navigate = useNavigate();

  const roleProjects = [
    {
      id: 'prj_ba_1',
      role: 'Business Analyst',
      company: 'Deloitte',
      title: 'Enterprise Sales Optimization & FRD Preparation',
      description: 'Analyze a 50,000+ row omnichannel sales dataset, identify margin leakage, and craft a Functional Requirements Document (FRD).',
      difficulty: 'Intermediate',
      industry: 'Consulting',
      workspaceType: 'excel',
      datasetName: 'Sales_Opt.csv',
      stepsCount: 8
    },
    {
      id: 'prj_da_1',
      role: 'Data Analyst',
      company: 'KPMG',
      title: 'Customer Churn Prediction & KPI Dashboard',
      description: 'Conduct cohort analysis, compute CLV, and build interactive Power BI visualizations for senior leadership.',
      difficulty: 'Advanced',
      industry: 'Finance & Banking',
      workspaceType: 'powerbi',
      datasetName: 'Churn_Config.csv',
      stepsCount: 8
    },
    {
      id: 'prj_fa_1',
      role: 'Financial Analyst',
      company: 'EY',
      title: '3-Statement Corporate Financial Model & Valuation',
      description: 'Build financial statements, perform DCF valuation, and generate WACC sensitivity tables for M&A scenarios.',
      difficulty: 'Advanced',
      industry: 'Investment Banking',
      workspaceType: 'excel',
      datasetName: 'Financials_FM26.csv',
      stepsCount: 8
    },
    {
      id: 'prj_sde_1',
      role: 'Software Developer',
      company: 'TCS',
      title: 'Microservices Payment Gateway & API Engine',
      description: 'Design resilient REST APIs, implement JWT authentication, and optimize SQL queries for high-performance transactions.',
      difficulty: 'Advanced',
      industry: 'Information Technology',
      workspaceType: 'code',
      datasetName: 'Transactions_SQLPack.zip',
      stepsCount: 8
    }
  ];

  const handleSelectProject = (p: any) => {
    setActiveProject(p);
    navigate('/workspace');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-7 h-7 text-sky-400" />
            Real-World Capstone Projects (200+)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            End-to-end corporate projects with real datasets, Excel modeling, dashboards, and Mentor reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-semibold">
            Role: {targetRole}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {roleProjects.map(p => (
          <div
            key={p.id}
            className={`p-6 rounded-2xl border transition flex flex-col justify-between ${activeProject?.id === p.id ? 'bg-sky-500/10 border-sky-500 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                  {p.industry} • {p.difficulty}
                </span>
                <span className="text-[11px] font-bold text-sky-400">
                  {p.company}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-white">
                {p.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {p.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Dataset: {p.datasetName}
              </span>
              <button
                onClick={() => handleSelectProject(p)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                Open in Workspace <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

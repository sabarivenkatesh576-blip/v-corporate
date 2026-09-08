import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Sparkles,
  BookOpen,
  Code,
  Video,
  Briefcase,
  CheckCircle,
  Award,
  ArrowRight,
  Gamepad2,
  LayoutGrid
} from 'lucide-react';
import { CorporateCampus3D } from '../components/3d/CorporateCampus3D';

export const VirtualOfficePage: React.FC = () => {
  const { selectedCompany, targetRole } = useCareer();
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');

  const zones = [
    {
      id: 'placement',
      name: 'Placement Arena & Recruitment Hub',
      desc: 'Interactive 3D campus drive pavilions, company eligibility checks, and live offer drive challenges.',
      icon: Briefcase,
      path: '/placement',
      tag: 'Hiring Drives'
    },
    {
      id: 'internship',
      name: 'Virtual Internship Lab',
      desc: '4-Week corporate simulation sprints in SQL, Excel, and FRD studios with docked AI Co-Pilot.',
      icon: Award,
      path: '/internships',
      tag: 'Experiential Sprints'
    },
    {
      id: 'manager',
      name: 'AI Corporate Director Cabin',
      desc: 'Chat with your Senior Practice Director Dr. Alistair Vance for deliverables & reviews.',
      icon: Sparkles,
      path: '/style-manager',
      tag: 'Executive Mentoring'
    },
    {
      id: 'workspace',
      name: 'Project Workspace & Sandboxes',
      desc: 'Live Excel spreadsheets, PostgreSQL query runner, and financial modeling tools.',
      icon: Code,
      path: '/workspace',
      tag: 'Practical Work'
    },
    {
      id: 'interview',
      name: 'AI Spoken Mock Interview Pod',
      desc: 'Spoken mock interview with speech-to-text, audio playback, and CEFR grammar grading.',
      icon: Video,
      path: '/interview',
      tag: 'Voice AI'
    },
    {
      id: 'reception',
      name: 'Corporate Directory & Companies',
      desc: 'Company orientation guides, culture overviews, and hiring criteria for 9 top enterprises.',
      icon: Building2,
      path: '/companies',
      tag: 'Orientation'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
              🎮 WebGL Corporate Metaverse
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
              Host Enterprise: {selectedCompany}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-1">
            <Building2 className="w-7 h-7 text-sky-400" />
            3D Virtual Corporate Campus & Workplace Metaverse
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Navigate the interactive 3D enterprise towers of {selectedCompany}. Explore departments, enter recruitment arenas, and practice deliverables.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            🎮 3D Metaverse View
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            🏢 Directory Grid
          </button>
        </div>
      </div>

      {/* 3D Model or Classic Cards */}
      {viewMode === '3d' ? (
        <CorporateCampus3D />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <Link
                key={zone.id}
                to={zone.path}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {zone.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-sky-400 group-hover:text-sky-300 pt-2">
                  <span>Enter Sector</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

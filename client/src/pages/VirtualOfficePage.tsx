import React from 'react';
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
  ArrowRight
} from 'lucide-react';

export const VirtualOfficePage: React.FC = () => {
  const { selectedCompany, targetRole } = useCareer();

  const zones = [
    {
      id: 'reception',
      name: 'Corporate Reception',
      desc: 'Welcome desk, company profiles, and orientation guides.',
      icon: Building2,
      path: '/companies',
      tag: 'Orientation'
    },
    {
      id: 'manager',
      name: 'AI Manager Cabin',
      desc: 'Chat with your Senior Manager for deliverables & reviews.',
      icon: Sparkles,
      path: '/style-manager',
      tag: 'Mentoring'
    },
    {
      id: 'workspace',
      name: 'Project Workspace',
      desc: 'Live Excel spreadsheets, Power BI metrics, and Tally ledgers.',
      icon: Code,
      path: '/workspace',
      tag: 'Practical Work'
    },
    {
      id: 'training',
      name: 'Learning & Training Room',
      desc: 'Skill gap resolution, step-by-step guides, and videos.',
      icon: BookOpen,
      path: '/learning',
      tag: 'Skills'
    },
    {
      id: 'conference',
      name: 'Conference & Meeting Room',
      desc: 'Virtual standups, screen sharing, and client presentations.',
      icon: Video,
      path: '/meetings',
      tag: 'Collaboration'
    },
    {
      id: 'placement',
      name: 'Placement & HR Cell',
      desc: 'Campus drives, eligibility matrix, and offer letters.',
      icon: Briefcase,
      path: '/placement',
      tag: 'Recruitment'
    },
    {
      id: 'assessments',
      name: 'Assessment Lab (600+)',
      desc: 'Cognitive aptitude, domain technical, proctoring.',
      icon: CheckCircle,
      path: '/assessments',
      tag: 'Testing'
    },
    {
      id: 'credentials',
      name: 'Credential Vault',
      desc: 'Cryptographically signed badges and experience certificates.',
      icon: Award,
      path: '/credentials',
      tag: 'Wallet'
    },
    {
      id: 'break',
      name: 'Break Area & Squads',
      desc: 'Team chat, leaderboards, peer squads, and networking.',
      icon: Users,
      path: '/teams',
      tag: 'Networking'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Building2 className="w-7 h-7 text-sky-400" />
          Virtual Corporate Office (9 Zones)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore the fully interactive virtual corporate environment for <strong className="text-sky-400">{targetRole}</strong> at <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {zones.map(z => {
          const Icon = z.icon;
          return (
            <Link
              key={z.id}
              to={z.path}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-850 transition space-y-3.5 group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold">
                  {z.tag}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white group-hover:text-sky-300 transition">
                  {z.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {z.desc}
                </p>
              </div>

              <div className="flex items-center gap-1 text-xs font-semibold text-sky-400 pt-2">
                Enter Zone <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
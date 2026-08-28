import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Rocket,
  Award,
  BookOpen,
  Code,
  Mic,
  Building2,
  Users,
  Video,
  FileText
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to V-CORP (Smart India Hackathon)',
      subtitle: 'From Classroom Skills to Corporate Career Readiness',
      icon: Rocket,
      desc: 'V-CORP transforms college students into industry-ready professionals through an authentic full-stack virtual corporate ecosystem. Explore the end-to-end journey in 10 seamless phases.',
      route: '/dashboard',
      actionText: 'Go to Dashboard'
    },
    {
      title: 'Phase 1: Resume Extraction & AI Match Analysis',
      subtitle: 'Analyze PDF/DOCX resumes against target career roles',
      icon: FileText,
      desc: 'Upload a candidate resume or view the pre-parsed profile. The engine extracts education, skills, internships, computes role match %, detects missing competencies, and recommends targeted interventions.',
      route: '/resume',
      actionText: 'Open Resume Analyzer'
    },
    {
      title: 'Phase 2: Skill-Gap Matrix & Learning Paths',
      subtitle: 'Radar visualization and tailored curriculum',
      icon: BookOpen,
      desc: 'Compare candidate skills against target career role requirements. Inspect critical vs important gaps (High, Medium, Low) and generate tailored modular learning paths with interactive code challenges.',
      route: '/skill-gap',
      actionText: 'Explore Skill Gaps'
    },
    {
      title: 'Phase 3: Assessment Portal (300+ Questions)',
      subtitle: 'Quantitative Aptitude, Logical Reasoning & Verbal Ability',
      icon: CheckCircle,
      desc: 'Experience 4 assessment modes (Practice, Timed, Corporate Screening Mock, and Adaptive). Features question navigation palette, real-time timer, topic analytics, and full formula explanations.',
      route: '/assessments',
      actionText: 'Take an Assessment'
    },
    {
      title: 'Phase 4: Resume-Aware AI Mock Interview',
      subtitle: 'Voice & Text interactive interview with dynamic follow-ups',
      icon: Mic,
      desc: 'The AI analyzes the candidate\'s resume and generates authentic opening and contextual follow-up questions. Supports Speech Recognition and Text-to-Speech voice questions, producing a 9-dimension evaluation report.',
      route: '/interview',
      actionText: 'Start AI Mock Interview'
    },
    {
      title: 'Phase 5: Virtual Corporate Office (9 Zones)',
      subtitle: 'Interactive corporate floor plan & enterprise workspaces',
      icon: Building2,
      desc: 'Explore the 9 interactive functional zones (Reception, Desk, Project Room, Conference, Teams, Learning, HR, Performance, Credential Center) across TCS, Deloitte, EY, KPMG, and Tech company workspaces.',
      route: '/virtual-office',
      actionText: 'Enter Virtual Office'
    },
    {
      title: 'Phase 6: Project Library (200+ Projects) & Workspace',
      subtitle: '20 realistic projects per role across 10 career roles',
      icon: Code,
      desc: 'Browse 200 fully scoped enterprise projects with tasks, datasets, and rubrics. Work directly inside the in-portal multi-modal IDE (Code Editor, Spreadsheet Grid, and Markdown Editor) with AI evaluation.',
      route: '/projects',
      actionText: 'View Project Library'
    },
    {
      title: 'Phase 7: Real-Time Team Collaboration & Channels',
      subtitle: 'Squad formation, live chat channels & task broadcasts',
      icon: Users,
      desc: 'Join squads with join codes (e.g. VC-BA-4821), assign member roles (Team Leader, Developer, Analyst), chat across channels (#general, #technical), and receive live real-time task update broadcasts via WebSockets.',
      route: '/teams',
      actionText: 'Open Squad Hub'
    },
    {
      title: 'Phase 8: WebRTC Live Conference Meetings',
      subtitle: 'Video/Audio meetings, meeting notes & AI minutes summarizer',
      icon: Video,
      desc: 'Join scheduled team meetings with real-time video/audio controls, screen share, collaborative meeting notes with action items, and automated AI meeting minutes generation.',
      route: '/meetings',
      actionText: 'Join Conference Room'
    },
    {
      title: 'Phase 9: Verifiable Credentials & QR Verification',
      subtitle: 'Verified Task Credentials, Project Certificates & Public Verification',
      icon: Award,
      desc: 'Earn cryptographic certificates and verified skill badges with dynamic QR codes. Test the public verification system at /verify/certificate/:id and export LinkedIn-ready share achievements.',
      route: '/credentials',
      actionText: 'Open Credential Wallet'
    }
  ];

  const step = steps[currentStep];
  const Icon = step.icon;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">SIH 2026 Evaluation Tour</span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">{step.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 mb-6">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            {step.subtitle}
          </h4>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            {step.desc}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-1.5 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep ? 'w-6 bg-sky-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleNavigate(step.route)}
              className="flex items-center space-x-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-500 transition shadow"
            >
              <span>{step.actionText}</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-300"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

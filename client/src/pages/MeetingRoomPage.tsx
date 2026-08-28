import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  Share2
} from 'lucide-react';

export const MeetingRoomPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCompany, targetRole } = useCareer();

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const participants = [
    { name: `${user?.fullName || 'You'} (You)`, role: `Lead ${targetRole}`, bottomText: 'Camera On', active: true },
    { name: 'Raghav Menon (Senior Mentor)', role: 'Director of Analytics', bottomText: 'Demo Participant', active: false },
    { name: 'Pooja Rao', role: 'Corporate Project Lead', bottomText: 'Demo Participant', active: false }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Video className="w-7 h-7 text-sky-400" />
          Virtual Conference Room
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Attend daily standups, present your deliverables, and collaborate inside {selectedCompany} meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {participants.map((p, i) => (
          <div key={i} className="h-56 rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] py-0.5 px-2 rounded-md bg-slate-950/80 text-slate-300 font-semibold">
                {p.name}
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${p.active ? 'bg-emerald-400' : 'bg-sky-400'}`} />
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-white font-extrabold">
                {p.name[0]}
              </div>
              <div className="text-xs text-slate-400">{p.role}</div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{p.bottomText}</span>
              <span>1280 x 720</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${micOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}
        >
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          <span>{micOn ? 'Mic On' : 'Muted'}</span>
        </button>

        <button
          onClick={() => setCamOn(!camOn)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${camOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'}`}
        >
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
          <span>{camOn ? 'Camera On' : 'Camera Off'}</span>
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white">Meeting Agenda & Minutes</h3>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sprint Quick Sync: Dataset review for {selectedCompany} assignment.
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lead {targetRole} demonstrates Excel & Power BI indexes on shared screen.
          </li>
        </ul>
      </div>
    </div>
  );
};

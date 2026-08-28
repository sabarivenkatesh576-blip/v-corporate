import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { Users, Send, Sparkles } from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCompany, targetRole } = useCareer();

  const [joinCode, setJoinCode] = useState('');
  const [activeTeam, setActiveTeam] = useState<any>({
    id: 'tm_01a',
    name: `Acetech ${selectedCompany} Analytics Squad`,
    code: 'VC-8892',
    members: [
      { name: user?.fullName || 'You', role: `Lead ${targetRole}`, status: 'Active' },
      { name: 'Ananiya Sharma', role: 'Data Engineer', status: 'Online' },
      { name: 'Rohan Verma', role: 'Financial Modeler', status: 'Online' },
      { name: 'Priya Patel', role: 'QA & Reviewer', status: 'Away' }
    ]
  });

  const [teamMessages, setTeamMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Ananiya Sharma', text: "I've cleaned the Q3 dataset and uploaded it to the Workspace.", time: '10:30 AM' },
    { sender: 'Rohan Verma', text: "I'm validating the Gross Margin Excel formulas now.", time: '10:32 AM' }
  ]);

  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setTeamMessages(prev => [
      ...prev,
      { sender: user?.fullName || 'You', text: newMsg.trim(), time: 'Just now' }
    ]);
    setNewMsg('');
  };

  const handleJoinTeam = () => {
    if (!joinCode.trim()) return;
    setActiveTeam((prev: any) => ({
      ...prev,
      code: joinCode.trim().toUpperCase(),
      name: `Team ${joinCode.trim().toUpperCase()}`
    }));
    setJoinCode('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-400" />
            Corporate Project Squads & Teams
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Join or form collaborative project squads with role-based assignments for <strong className="text-white">{selectedCompany}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter Squad Code (e.g. VC-8892)"
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
          />
          <button
            onClick={handleJoinTeam}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md"
          >
            Join Squad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{activeTeam.name}</h3>
                <span className="text-[11px] text-sky-400 font-mono font-bold">Code: {activeTeam.code}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                {activeTeam.members.length} Members
              </span>
            </div>

            <div className="space-y-2">
              {activeTeam.members.map((m: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.role}</div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${m.status === 'Active' || m.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[500px] overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60">
            <h4 className="text-xs font-bold text-white">Squad Collaboration Feed</h4>
          </div>

          <div className="flex-1 p-5 overflow-y-auto space-y-3">
            {teamMessages.map((m, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-sky-400">{m.sender}</span>
                  <span className="text-slate-500">{m.time}</span>
                </div>
                <p className="text-xs text-slate-200">{m.text}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center gap-2.5">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Message your project squad..."
              className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="px-4.5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

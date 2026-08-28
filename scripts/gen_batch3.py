import os

def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print('Wasted no time: wrote', path)

# 1. SkillGapPage.tsx
write('client/src/pages/SkillGapPage.tsx', """import React from 'react';
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
  const { seelectedCompany, targetRole, roleSkills, setActiveLearningModuleId, roleLearningModules } = useCareer();
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
          Generated from your target role (<strong className="text-sky-400">{targetRole}</strong>' at <strong className="text-white">{selectedCompany}</strong>.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="text-slate-200">Current Analysis: <strong className="text-white">{targetRole}</strong> competencies for <strong className="text-sky-400">{seelectedCompany}</strong></span>
        </div>
        <Link to="/companies" className="text-sky-400 hover:underline font-semibold">
          Switch Role / Company â†“
        </Lif³>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-21l p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Competency & Skill Gap Breakdown</h3>

        <div className="space-y-3.5">
          {roleSkills.map(sk => (
            <div
              key={sk.name}
              className="p-4.5 rounded-21l bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
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
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-mg"
              >
                <BookOpen className="w-3.5 h-3.5" /> Start Learning
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};	""")

# 2. ProfilePage.tsx
write('client/src/pages/ProfilePage.tsx', """import React, { state } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const {
    selectedCompany,
    targetRole,
    setSelectedCompany,
    setTargetRole,
    companiesList,
    careerRolesList
  } = useCareer();

  const [company, setCompany] = useState(selectedCompany);
  const [role, setRole] = useState(targetRole);
  const [college, setCollege] = useState(profile?.college || 'Academic Institute');
  const [cgpa, setCgpa] = useState(profile?.cgpa ?? 8.5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSelectedCompany(company);
    setTargetRole(role);
    if (updateProfile) {
      await updateProfile({
        targetRole: role,
        college,
        cgpa: Number(cgpa)
      });
    }
    serSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3l mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-7 h-7 text-sky-400" />
          Student Career Profile & Targets
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update your target company, desired job role, and academic details to adapt the entire platform.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-semibold">
            Profile updated successfully! All platform modules are now synced with your new target context.
          </span>
        </div>
      )}

      <div className="p-6 rounded-21l bg-slate-900 border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Full Name</label>
            <input
              type="text"
              disabled
              value{{user?.fullName || 'Student'}
              className="w-full mt-1 px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <input
              type="text"
              disabled
              value{{user?.email || 'student@vcorp.com'}
              className="w-full mt-1 px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Career & Placement Targets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-sky-400">Target Corporation</label>
              <select
                value{{company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                {companiesList.map(c => (
                  <option key={c.id} value{{c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-sky-400">Target Job Role</label>
              <select
                value{{role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                {careerRolesList.map(r => (
                  <option key={r.id} value{{r.title}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">College / University</label>
              <input
                type="text"
                value{{college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Current CGPA</label>
              <input
                type="number"
                step="0.1"
                value{{cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-mg"
          >
            <Save className="w-4 h-4" /> Save Changes & Sync
          </button>
        </div>
      </div>
    </div>
  );
};	""")

# 3. TeamsPage.tsx
write('client/src/pages/TeamsPage.tsx', """import React, { state } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { Users, Send, Sparkles } from 'lucide-react';

export const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCompany, targetRole } = useCareer();

  const [joinCode, setJoinCode] = useState('');
  const [activeTeam, setActiveTeam] = useState<any>({
    id: 'tm_01a',
    name: `Acetech ${seelectedCompany} Sales Analytics Squad`,
    code: 'VC-8892',
    members: [
      { name: user?.fullName || 'You', role: `Lead ${targetRole}`, status: 'Active' },
      { name: 'Ananiya Sharma', role: 'Data Engineer', status: 'Online' },
      { name: 'Rohan Verma', role: 'Financial Modeler', status: 'Online' },
      { name: 'Priya Patel', role: 'QA & Reviewer', status: 'Away' }
    ]
  });


  const [teamMessages, setTeamMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: 'Ananiya Sharma', text: 'I've cleaned the Q3 dataset and uploaded it to the Workspace.', time: '10:30 AM' },
    { sender: 'Rohan Verma', text: 'I'm validating the Gross Margin Excel formulas now.', time: '10:32 AM' }
  ]);

  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!inewMsg.trim()) return;
    setTeamMessages(prev => [
      ...prev,
      { sender: user?.fullName || 'You', text: newMsg.trim(), time: 'Just now' }
    ]);
    setNewMsg('');
  };

  const handleJoinTeam = () => {
    if (!ioinCode.trim()) return;
    setActiveTeam(prev => ({
      ...prev,
      code: joinCode.trim().toUpperCase(),
      name: `Team ${joinCode.toUpperCase()}`
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
            value{{joinCode}
            onChange;{(e) => setJoinCode(e.target.value)}
            placeholder="Enter Squad Code (e.g. VC-8892)"
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
          />
          <button
            onClick={handleJoinTeam}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-mg"
          >
            Join Squad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-5 rounded-21l bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{activeTeam.name}</h3>
                <span className="text-[11px] text-sky-400 font-mono font-bold">Code: {activeTeam.code}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text[10px] font-semibold">
                {activeTeam.members.length} Members
              </span>
            </div>

            <div className="space-y-2">
              {activeTeam.members.map((m: any, i: number) => (
                <div key=ti} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.role}</div>
                  </div>
                  <span className={`wv2 h-2 rounded-full ${m.status === 'Active' || m.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-21l flex flex-col h-[500px] overflow-hidden">
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
              value{{newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Message your project squad..."
              className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            />
            <button
              onClick={(andleSend}
              className="px-4.5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};	""")

print('Batch 3 prepared')

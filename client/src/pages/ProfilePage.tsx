import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
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
  const [cgpa, setCgpa] = useState(8.5);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSelectedCompany(company);
    setTargetRole(role);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Full Name</label>
            <input
              type="text"
              disabled
              value={user?.fullName || 'Student'}
              className="w-full mt-1 px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <input
              type="text"
              disabled
              value={user?.email || 'student@vcorp.com'}
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
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                {companiesList.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-sky-400">Target Job Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                {careerRolesList.map(r => (
                  <option key={r.id} value={r.title}>{r.title}</option>
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
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Current CGPA</label>
              <input
                type="number"
                step="0.1"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-2 shadow-md"
          >
            <Save className="w-4 h-4" /> Save Changes & Sync
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, updateFullName, updateUserProfile, resetProgression } = useAuth();
  const {
    selectedCompany,
    targetRole,
    setSelectedCompany,
    setTargetRole,
    companiesList,
    careerRolesList
  } = useCareer();

  const [fullName, setFullName] = useState(user?.fullName || 'Candidate');
  const [email, setEmail] = useState(user?.email || 'student@vcorp.local');
  const [company, setCompany] = useState(selectedCompany);
  const [role, setRole] = useState(targetRole);
  const [college, setCollege] = useState(profile?.college || 'National Institute of Technology');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [department, setDepartment] = useState(profile?.department || 'Computer Science & Engineering');
  const [cgpa, setCgpa] = useState(8.5);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (user?.fullName) setFullName(user.fullName);
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSave = () => {
    const cleanName = fullName.trim() || 'Candidate';
    updateFullName(cleanName);
    updateUserProfile({
      fullName: cleanName,
      email: email.trim(),
      college: college.trim(),
      degree: degree.trim(),
      department: department.trim(),
      targetRole: role
    });
    setSelectedCompany(company);
    setTargetRole(role);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    resetProgression();
    setShowResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-7 h-7 text-sky-400" />
          Student Career Profile & Targets
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Customize your name, academic details, target corporation, and career track across the entire V-CORP platform.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold">
            Profile updated successfully! Your name and target context are now synced across all modules and certificates.
          </span>
        </div>
      )}

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center gap-2.5">
          <RotateCcw className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold">
            Progression reset! All modules (Readiness index, Internship sprints, Hiring rounds, and Badges) are now at clean starting baselines.
          </span>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white">Personal Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-sky-400">Full Name (Displayed Everywhere)</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@vcorp.local"
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Career Targets */}
        <div className="pt-3 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Career & Placement Targets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-sky-400">Target Corporation</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
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
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              >
                {careerRolesList.map(r => (
                  <option key={r.id} value={r.title}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="pt-3 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Degree & Branch</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Current CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress (Clean Slate)
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition"
          >
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Reset All Progress?</h4>
                <p className="text-xs text-slate-400">Avoid fake progression and start completely clean</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset your Career Readiness score, XP, completed internship weeks, recruitment rounds, and badges to <strong>0</strong> so you can earn real progress from scratch. Your name (<strong className="text-white">{fullName}</strong>) will be retained.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
              >
                Yes, Reset to Clean Slate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

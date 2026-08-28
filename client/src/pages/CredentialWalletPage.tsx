import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Copy,
  Building2
} from 'lucide-react';

export const CredentialWalletPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCompany, targetRole, credentials, addBadge } = useCareer();
  const [copied, setCopied] = useState(false);

  const verifyUrl = `${window.location.origin}/verify/cert-vc-2026-001`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-sky-400" />
          Cryptographic Credential Wallet
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verified milestone badges, internship certificates, and recruiter-verifiable credentials.
        </p>
      </div>

      {/* Certificate Highlight */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border border-sky-500/40 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[11px] font-semibold">
              Verified Experiential Certification
            </span>
            <h2 className="text-xl font-extrabold text-white mt-2">
              Corporate Career Readiness & Role Competency
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Issued to: <strong className="text-white">{user?.fullName || 'Student'}</strong> • Role: <strong className="text-sky-400">{targetRole}</strong> at <strong className="text-white">{selectedCompany}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy Verify Link'}
            </button>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Verify
            </a>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Earned Virtual Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {credentials.map(b => (
            <div key={b.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                  Verified
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{b.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">Institutional award for {selectedCompany} standards.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

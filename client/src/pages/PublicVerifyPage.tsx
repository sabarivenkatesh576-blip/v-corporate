import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const PublicVerifyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/api/credentials/verify/${id}`);
        if (res.data.success && res.data.valid) {
          setData(res.data.credential);
          setValid(true);
        } else {
          setValid(false);
        }
      } catch (err) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-xl mx-auto w-full z-10 space-y-6">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-xl mb-3">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            V-CORP Official Credential Verification
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cryptographic verification portal for recruiters, universities, and enterprise partners.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center text-xs text-slate-400">
            Validating cryptographic signature in V-CORP Ledger...
          </div>
        ) : valid && data ? (
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-slate-900/95 p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">VERIFIED & AUTHENTIC</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">{data.credentialId}</span>
            </div>

            <div className="space-y-4 text-center py-2">
              <span className="text-xs text-slate-400 uppercase tracking-widest block">Recipient</span>
              <h2 className="text-2xl font-extrabold text-white">{data.studentName}</h2>
              <p className="text-xs text-sky-400 font-semibold">{data.title}</p>
              <p className="text-xs text-slate-300">Track: <strong>{data.role}</strong> • Score: <strong className="text-emerald-400">{data.score}/100</strong></p>

              {data.skills && data.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  {data.skills.map((sk: string, i: number) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                <span className="block text-[10px] text-slate-500">Issued On:</span>
                <span className="font-semibold text-slate-200">{new Date(data.issuedDate).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-slate-500">Verified By:</span>
                <span className="font-semibold text-sky-400">V-CORP AI Evaluation Ledger</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-500/40 bg-slate-900/90 p-8 text-center space-y-3">
            <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Invalid or Unverified Credential ID</h3>
            <p className="text-xs text-slate-400">
              The credential ID "{id}" could not be validated against the V-CORP certification registry.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to V-CORP Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

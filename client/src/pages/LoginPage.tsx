import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  User,
  KeyRound,
  Check,
  Copy,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  // Initial Pre-filled Credentials
  const [email, setEmail] = useState('demo@vcorp.local');
  const [password, setPassword] = useState('Demo@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (type: 'student' | 'admin') => {
    if (type === 'student') {
      setEmail('demo@vcorp.local');
      setPassword('Demo@12345');
    } else {
      setEmail('admin@vcorp.local');
      setPassword('Admin@12345');
    }
  };

  const handleInstantLogin = async (type: 'student' | 'admin') => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(type);
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const copyCreds = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 shadow-xl shadow-sky-500/20 mb-4">
          <Briefcase className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sign in to V-CORP
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          Virtual Corporate Career Readiness & Workplace Portal
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 backdrop-blur-xl sm:px-10 space-y-6">

          {/* Initial Login Credentials Box */}
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-xs space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 text-xs">
                <KeyRound className="h-4 w-4 text-emerald-400" />
                <span>Initial Default Login Credentials</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Ready to Sign In
              </span>
            </div>

            {/* Candidate Credentials Card */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5 text-sky-400">
                  <User className="h-3.5 w-3.5" /> Candidate / Student Account:
                </span>
                <button
                  type="button"
                  onClick={() => handleAutofill('student')}
                  className="text-[10px] text-sky-400 hover:underline"
                >
                  Autofill Fields ↵
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div
                  onClick={() => copyCreds('demo@vcorp.local', 'student_email')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-sky-500 transition"
                  title="Click to copy email"
                >
                  <span className="truncate">demo@vcorp.local</span>
                  {copiedField === 'student_email' ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <Copy className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                </div>

                <div
                  onClick={() => copyCreds('Demo@12345', 'student_pass')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-sky-500 transition"
                  title="Click to copy password"
                >
                  <span>Demo@12345</span>
                  {copiedField === 'student_pass' ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <Copy className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInstantLogin('student')}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition mt-1"
              >
                <User className="h-3.5 w-3.5" />
                <span>1-Click Instant Student Login</span>
              </button>
            </div>

            {/* Admin Credentials Card */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Shield className="h-3.5 w-3.5" /> Admin / Placement Officer Account:
                </span>
                <button
                  type="button"
                  onClick={() => handleAutofill('admin')}
                  className="text-[10px] text-indigo-400 hover:underline"
                >
                  Autofill Fields ↵
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div
                  onClick={() => copyCreds('admin@vcorp.local', 'admin_email')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition"
                  title="Click to copy email"
                >
                  <span className="truncate">admin@vcorp.local</span>
                  {copiedField === 'admin_email' ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <Copy className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                </div>

                <div
                  onClick={() => copyCreds('Admin@12345', 'admin_pass')}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-indigo-500 transition"
                  title="Click to copy password"
                >
                  <span>Admin@12345</span>
                  {copiedField === 'admin_pass' ? <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> : <Copy className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleInstantLogin('admin')}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-indigo-600/40 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-200 hover:text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition mt-1"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>1-Click Instant Admin Login</span>
              </button>
            </div>
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-500 font-bold">Standard Sign In</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Corporate Email ID
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="demo@vcorp.local"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 py-3 px-4 text-xs font-bold text-white hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 transition shadow-lg shadow-sky-500/20 mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In with Entered Credentials'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">
              New to V-CORP?{' '}
              <Link to="/register" className="font-bold text-sky-400 hover:text-sky-300">
                Create Candidate Account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

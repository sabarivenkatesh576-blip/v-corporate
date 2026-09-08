import React, { useState } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Briefcase,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileCheck,
  Zap,
  Trophy,
  Award,
  Gamepad2,
  LayoutGrid,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  FileText,
  Code
} from 'lucide-react';
import { PlacementArena3D, COMPANIES_3D, CompanyDriveInfo } from '../components/3d/PlacementArena3D';

export const PlacementPage: React.FC = () => {
  const { selectedCompany, targetRole, hiringRounds } = useCareer();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');
  const [selectedCompanyData, setSelectedCompanyData] = useState<CompanyDriveInfo>(COMPANIES_3D[0]);
  const [activeTab, setActiveTab] = useState<'drives' | 'eligibility' | 'arena_rounds' | 'schedule'>('drives');

  // Gamified Boss Round Simulation State
  const [activeRoundStage, setActiveRoundStage] = useState<number>(1);
  const [round1Passed, setRound1Passed] = useState<boolean>(false);
  const [round2Passed, setRound2Passed] = useState<boolean>(false);
  const [round3Passed, setRound3Passed] = useState<boolean>(false);
  const [showOfferModal, setShowOfferModal] = useState<boolean>(false);

  // Aptitude simulation
  const [aptitudeAns, setAptitudeAns] = useState<string>('');
  const [aptitudeFeedback, setAptitudeFeedback] = useState<string>('');

  // Technical question simulation
  const [techAns, setTechAns] = useState<string>('');
  const [techFeedback, setTechFeedback] = useState<string>('');

  const candidateName = (user as any)?.name || (user as any)?.fullName || user?.email || 'Candidate';

  const handleSelectCompany = (comp: CompanyDriveInfo) => {
    setSelectedCompanyData(comp);
  };

  const handleRunAptitude = () => {
    if (aptitudeAns.trim() === 'B' || aptitudeAns.trim().toLowerCase().includes('margin')) {
      setRound1Passed(true);
      setAptitudeFeedback('✅ Correct! Cognitive reasoning verified (+250 XP). Round 1 Cleared!');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } else {
      setAptitudeFeedback('⚠️ Hint: Gross Margin is calculated as (Revenue - COGS) / Revenue. Option B is correct.');
    }
  };

  const handleRunTech = () => {
    if (techAns.toLowerCase().includes('join') || techAns.toLowerCase().includes('group by') || techAns.toLowerCase().includes('revenue')) {
      setRound2Passed(true);
      setTechFeedback('✅ Optimal SQL Query! Execution latency < 42ms (+350 XP). Round 2 Cleared!');
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.7 } });
    } else {
      setTechFeedback('⚠️ Hint: Use GROUP BY customer_id with SUM(amount) to aggregate revenue.');
    }
  };

  const handleClaimOffer = () => {
    setRound3Passed(true);
    setShowOfferModal(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                Placement Cell & 3D Recruitment Arena
              </h1>
              <p className="text-xs text-slate-400">
                Gamified corporate recruitment pavilions, eligibility scoring, and live offer drive challenges.
              </p>
            </div>
          </div>
        </div>

        {/* 3D vs Grid Toggle */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            🎮 3D Metaverse Arena
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            📋 Tactical Drives Grid
          </button>
        </div>
      </div>

      {/* Gamified Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Candidate Status</div>
          <div className="text-sm font-extrabold text-white mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Level 4 Corporate Fellow
          </div>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Campus Readiness</div>
          <div className="text-sm font-extrabold text-sky-400 mt-1 font-mono">92.4% Verified</div>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Earned Experience</div>
          <div className="text-sm font-extrabold text-amber-400 mt-1 font-mono">2,850 / 3,000 XP</div>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400 font-medium">Active Drive Pavilion</div>
          <div className="text-sm font-extrabold text-emerald-400 mt-1">{selectedCompanyData.name}</div>
        </div>
      </div>

      {/* Main 3D Model or Grid */}
      {viewMode === '3d' ? (
        <PlacementArena3D
          onSelectCompany={handleSelectCompany}
          selectedCompanyId={selectedCompanyData.id}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPANIES_3D.map((comp) => (
            <div
              key={comp.id}
              onClick={() => setSelectedCompanyData(comp)}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                selectedCompanyData.id === comp.id
                  ? 'bg-slate-900 border-sky-500 shadow-xl shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{
                    backgroundColor: `${comp.color}15`,
                    borderColor: `${comp.color}40`,
                    color: comp.color
                  }}
                >
                  {comp.status}
                </span>
                <span className="text-xs font-black text-emerald-400 font-mono">{comp.packageLPA}</span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-3">{comp.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{comp.role}</p>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{comp.description}</p>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">{comp.openings} Openings</span>
                <span className="text-sky-400 font-bold">{comp.eligibilityScore}% Eligible</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selection Rounds & Boss Battles */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Live Recruitment Stages
            </span>
            <h2 className="text-lg font-black text-white mt-0.5">
              {selectedCompanyData.name} Campus Drive — Selection Stages
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Package:</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {selectedCompanyData.packageLPA}
            </span>
          </div>
        </div>

        {/* 3 Stage Progress Stepper */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Round 1 */}
          <div
            onClick={() => setActiveRoundStage(1)}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              activeRoundStage === 1
                ? 'bg-slate-800/90 border-sky-500'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Stage 1</span>
              {round1Passed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Cleared ✓
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  Ready
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Cognitive & Business Logic</h4>
            <p className="text-[11px] text-slate-400 mt-1">Analytical reasoning & case estimation challenge.</p>
          </div>

          {/* Round 2 */}
          <div
            onClick={() => setActiveRoundStage(2)}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              activeRoundStage === 2
                ? 'bg-slate-800/90 border-sky-500'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Stage 2</span>
              {round2Passed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Cleared ✓
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                  Technical
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Technical SQL & Data Challenge</h4>
            <p className="text-[11px] text-slate-400 mt-1">Hands-on query execution & schema optimization.</p>
          </div>

          {/* Round 3 */}
          <div
            onClick={() => setActiveRoundStage(3)}
            className={`p-4 rounded-2xl cursor-pointer transition-all border ${
              activeRoundStage === 3
                ? 'bg-slate-800/90 border-sky-500'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Stage 3</span>
              {round3Passed ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Offer Unlocked 🏆
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                  Executive
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white mt-2">AI Executive Board Interview</h4>
            <p className="text-[11px] text-slate-400 mt-1">Spoken interview with real-time speech analytics.</p>
          </div>
        </div>

        {/* Stage 1 Content */}
        {activeRoundStage === 1 && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Stage 1 Question: Business Profitability Analysis</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If client annual revenue is ₹50,00,000 and cost of goods sold (COGS) is ₹30,00,000, which formula yields the correct Gross Profit Margin?
            </p>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="radio"
                  name="apt"
                  value="A"
                  checked={aptitudeAns === 'A'}
                  onChange={() => setAptitudeAns('A')}
                />
                <span>A) (₹50,00,000 / ₹30,00,000) = 166.6%</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="radio"
                  name="apt"
                  value="B"
                  checked={aptitudeAns === 'B'}
                  onChange={() => setAptitudeAns('B')}
                />
                <span>B) ((₹50,00,000 - ₹30,00,000) / ₹50,00,000) * 100 = <strong>40.0%</strong></span>
              </label>
            </div>

            {aptitudeFeedback && (
              <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/40 text-xs text-sky-300">
                {aptitudeFeedback}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunAptitude}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-2 shadow-md shadow-sky-500/20"
              >
                Submit Answer
              </button>
              {round1Passed && (
                <button
                  onClick={() => setActiveRoundStage(2)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
                >
                  Proceed to Stage 2 <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stage 2 Content */}
        {activeRoundStage === 2 && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Stage 2 Challenge: SQL Revenue Aggregation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Write the SQL query keyword needed to calculate total revenue per customer from table <code>orders</code>.
            </p>
            <input
              type="text"
              placeholder="e.g. SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id"
              value={techAns}
              onChange={(e) => setTechAns(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-sky-500"
            />

            {techFeedback && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-emerald-300">
                {techFeedback}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleRunTech}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-2 shadow-md"
              >
                Execute SQL Challenge
              </button>
              {round2Passed && (
                <button
                  onClick={() => setActiveRoundStage(3)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
                >
                  Proceed to Final Stage <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Stage 3 Content */}
        {activeRoundStage === 3 && (
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Final Round: Executive Boardroom Interview</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Complete your spoken technical interview with AI Practice Director Dr. Vance or finalize your verified credentials to claim your offer letter.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/interview')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 border border-slate-700"
              >
                Launch Mock Interview Arena
              </button>
              <button
                onClick={handleClaimOffer}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <Award className="w-4 h-4 text-amber-300" />
                Claim {selectedCompanyData.name} Offer Letter 🏆
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Offer Letter Celebration Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-emerald-500/40 rounded-3xl p-7 shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
              <Trophy className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                OFFICIAL CAMPUS OFFER EXTENDED
              </span>
              <h2 className="text-xl font-black text-white mt-2">
                Congratulations, {candidateName}!
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                You have successfully cleared all selection stages for <strong className="text-emerald-400">{selectedCompanyData.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Position:</span>
                <span className="text-white font-bold">{selectedCompanyData.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CTC Package:</span>
                <span className="text-emerald-400 font-extrabold font-mono text-sm">{selectedCompanyData.packageLPA}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification ID:</span>
                <span className="text-sky-400 font-mono font-bold">VCORP-OFFER-2026-9842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cryptoseal Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verifiable on Ledger
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowOfferModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  navigate('/credentials');
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-white flex items-center gap-2 shadow-lg"
              >
                View in Credential Wallet <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

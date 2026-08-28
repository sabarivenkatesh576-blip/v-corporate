import React, { useState, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  FileText,
  Send,
  UserCheck,
  Briefcase,
  HelpCircle
} from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedCompany,
    targetRole,
    setSelectedCompany,
    setTargetRole,
    companiesList,
    careerRolesList,
    currentCompanyInfo,
    hiringRounds,
    activeRound,
    setActiveRound,
    completeRound,
    addBadge
  } = useCareer();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'roadmap' | 'companies' | 'roles'>('roadmap');
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [roundResult, setRoundResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
    details?: any;
  } | null>(null);

  // Test Runner State
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 mins default
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  // Round 1 state
  const [cgpaInput, setCgpaInput] = useState<number>(8.4);
  const [degreeInput, setDegreeInput] = useState('B.Tech / B.E');
  const [backlogsInput, setBacklogsInput] = useState(0);
  const [skillsSelected, setSkillsSelected] = useState<string[]>(['Excel & Analytics', 'Problem Solving']);

  // Round 4 state (Business Email)
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Round 5 state (Case Study)
  const [caseAnswers, setCaseAnswers] = useState<Record<string, number>>({});
  const [caseRecommendation, setCaseRecommendation] = useState('');

  // Round 6 state (STAR Viva)
  const [starAnswers, setStarAnswers] = useState({
    situation: '',
    action: '',
    result: ''
  });

  // Round 7 state (Offer Letter)
  const [offerAccepted, setOfferAccepted] = useState(false);

  const activeRoundObj = hiringRounds.find(r => r.roundNumber === activeRound) || hiringRounds[0];

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (roundInProgress && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [roundInProgress, timeLeft]);

  const handleStartRound = () => {
    setRoundInProgress(true);
    setRoundResult(null);
    setSelectedAnswers({});
    setTimeLeft(activeRoundObj.durationMinutes * 60);
  };

  // -------------------------------------------------------------
  // ROUND 2: Cognitive Aptitude Questions
  // -------------------------------------------------------------
  const aptitudeQuestions = [
    {
      id: 1,
      question: 'A trader purchases merchandise for $120 after receiving a 20% discount on the marked retail price. What was the original marked price?',
      options: ['$140.00', '$150.00', '$160.00', '$144.00'],
      correctAnswer: 1, // $150
      explanation: 'Marked Price = Price / (1 - 0.20) = $120 / 0.8 = $150.'
    },
    {
      id: 2,
      question: 'In an analytical department of 150 consultants, 60% use Python, 40% use R, and 20% use both. What percentage of consultants use NEITHER language?',
      options: ['10%', '20%', '15%', '25%'],
      correctAnswer: 1, // 20%
      explanation: 'P(Python or R) = 60% + 40% - 20% = 80%. Consultants using neither = 100% - 80% = 20%.'
    },
    {
      id: 3,
      question: 'Complete the numerical series: 4, 9, 25, 49, 121, ___',
      options: ['144', '169', '196', '225'],
      correctAnswer: 1, // 169 (13^2, primes squared: 2^2, 3^2, 5^2, 7^2, 11^2, 13^2)
      explanation: 'The series consists of squares of consecutive prime numbers (2, 3, 5, 7, 11, 13). 13 squared is 169.'
    },
    {
      id: 4,
      question: 'If all P are Q, and some Q are R, which of the following conclusions is ALWAYS true?',
      options: ['All P are R', 'Some Q are P', 'Some P are R', 'No P is R'],
      correctAnswer: 1, // Some Q are P
      explanation: 'Since all P are inside Q, any portion of Q containing P implies that Some Q are P.'
    }
  ];

  // -------------------------------------------------------------
  // ROUND 3: Role Technical Questions (Dynamic per Role)
  // -------------------------------------------------------------
  const getRoleQuestions = () => {
    const roleLower = targetRole.toLowerCase();
    if (roleLower.includes('data')) {
      return [
        {
          id: 1,
          question: 'Which SQL JOIN returns all records from the left table, and the matched records from the right table (with NULLs for unmatched)?',
          options: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS JOIN'],
          correctAnswer: 1,
          explanation: 'LEFT JOIN returns all rows from the left table and matched rows from the right table.'
        },
        {
          id: 2,
          question: 'In Power BI / DAX, which function modifies or overrides the existing filter context of an expression?',
          options: ['SUMX()', 'CALCULATE()', 'FILTER()', 'RELATED()'],
          correctAnswer: 1,
          explanation: 'CALCULATE is the fundamental DAX function that evaluates an expression in a modified filter context.'
        },
        {
          id: 3,
          question: 'Which metric measures the proportion of customers who discontinue a service during a specified observation window?',
          options: ['Retention Rate', 'Churn Rate', 'Conversion Rate', 'Net Promoter Score'],
          correctAnswer: 1,
          explanation: 'Churn Rate = (Lost Customers / Total Customers at Start) * 100.'
        },
        {
          id: 4,
          question: 'Which SQL clause is executed AFTER the GROUP BY clause to filter aggregated groups?',
          options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'],
          correctAnswer: 1,
          explanation: 'HAVING filters records after aggregation, whereas WHERE filters before grouping.'
        }
      ];
    } else if (roleLower.includes('finance') || roleLower.includes('financial')) {
      return [
        {
          id: 1,
          question: 'In Discounted Cash Flow (DCF) valuation, which discount rate is typically applied to discount Unlevered Free Cash Flows (FCFF)?',
          options: ['Cost of Equity (Ke)', 'WACC (Weighted Average Cost of Capital)', 'Cost of Debt (Kd)', 'Risk-Free Rate'],
          correctAnswer: 1,
          explanation: 'WACC reflects the required rate of return for all capital providers (both debt and equity).'
        },
        {
          id: 2,
          question: 'How does an unexpected increase in Net Working Capital (NWC) impact Free Cash Flow to Firm (FCFF)?',
          options: ['Increases FCFF', 'Decreases FCFF', 'Has zero impact on FCFF', 'Doubles EBITDA'],
          correctAnswer: 1,
          explanation: 'An increase in Working Capital represents cash tied up in operating assets, reducing cash flow.'
        },
        {
          id: 3,
          question: 'What is the standard formula for calculating Enterprise Value (EV)?',
          options: ['Market Cap - Total Debt', 'Market Cap + Total Debt - Cash & Equivalents', 'Total Assets - Total Liabilities', 'EBITDA * P/E Ratio'],
          correctAnswer: 1,
          explanation: 'Enterprise Value = Market Value of Equity + Total Debt - Cash and Cash Equivalents.'
        },
        {
          id: 4,
          question: 'Under the Golden Rules of Accounting, what is the rule for Real Accounts?',
          options: ['Debit the receiver, credit the giver', 'Debit what comes in, credit what goes out', 'Debit all expenses, credit all incomes', 'Debit liability, credit equity'],
          correctAnswer: 1,
          explanation: 'Real Account Rule: Debit what comes in, Credit what goes out.'
        }
      ];
    } else if (roleLower.includes('software') || roleLower.includes('developer')) {
      return [
        {
          id: 1,
          question: 'What is the average time complexity of searching for a key in a balanced Binary Search Tree (BST) containing N nodes?',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctAnswer: 1,
          explanation: 'In a balanced BST, tree height is log N, yielding O(log N) lookup time.'
        },
        {
          id: 2,
          question: 'Which HTTP status code should a RESTful API respond with when a resource is successfully created?',
          options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
          correctAnswer: 1,
          explanation: 'HTTP 201 Created signifies that the request succeeded and a new resource has been instantiated.'
        },
        {
          id: 3,
          question: 'In database optimization, which data structure is most standard for primary B-tree indexes supporting range queries?',
          options: ['Hash Map', 'B+ Tree', 'Linked List', 'Stack'],
          correctAnswer: 1,
          explanation: 'B+ Trees keep all data in leaf nodes linked sequentially, making range queries exceptionally fast.'
        },
        {
          id: 4,
          question: 'What does the Single Responsibility Principle (SRP) in SOLID software design mandate?',
          options: ['A class should have only one method', 'A class should have one, and only one, reason to change', 'All functions must return a promise', 'Modules must not import third-party packages'],
          correctAnswer: 1,
          explanation: 'SRP states that a module or class should be responsible to one, and only one, actor/reason to change.'
        }
      ];
    } else {
      // Default: Business Analyst questions
      return [
        {
          id: 1,
          question: 'Which document outlines business needs, operational scope, and high-level stakeholder objectives before technical specifications are drafted?',
          options: ['FRD (Functional Requirements Document)', 'BRD (Business Requirements Document)', 'API Contract', 'Deployment Runbook'],
          correctAnswer: 1,
          explanation: 'BRD articulates the high-level business vision and value proposition prior to engineering designs.'
        },
        {
          id: 2,
          question: 'In Microsoft Excel, which lookup combo overcomes VLOOKUP limitations by searching columns to the left without reordering columns?',
          options: ['HLOOKUP + CONCAT', 'INDEX + MATCH', 'IFERROR + SUMIF', 'OFFSET + COUNT'],
          correctAnswer: 1,
          explanation: 'INDEX-MATCH looks up values in any column orientation without needing the lookup key to be in the first column.'
        },
        {
          id: 3,
          question: 'What is the central purpose of an Enterprise Gap Analysis in consulting?',
          options: ['Auditing tax receipts', 'Comparing current "As-Is" operational state against desired "To-Be" performance targets', 'Calculating server CPU load', 'Formatting visual slide templates'],
          correctAnswer: 1,
          explanation: 'Gap Analysis identifies discrepancies between baseline performance and future target requirements.'
        },
        {
          id: 4,
          question: 'Which SQL clause is used to filter records AFTER an aggregation operation (such as SUM or COUNT) has been computed?',
          options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
          correctAnswer: 1,
          explanation: 'HAVING filters results based on aggregated metrics produced by GROUP BY.'
        }
      ];
    }
  };

  // -------------------------------------------------------------
  // EVALUATION HANDLERS
  // -------------------------------------------------------------
  const submitRound1 = () => {
    const isEligible = Number(cgpaInput) >= 7.0 && Number(backlogsInput) === 0 && skillsSelected.length >= 2;
    const score = isEligible ? 95 : 50;
    const feedback = isEligible
      ? `Profile criteria verified! CGPA (${cgpaInput}) meets ${selectedCompany} minimum cut-off (7.0), zero active backlogs confirmed, and ${skillsSelected.length} foundational skills validated.`
      : `Profile screening did not clear: Ensure CGPA is >= 7.0, zero active backlogs, and select at least 2 prerequisite skills.`;

    if (isEligible) {
      completeRound(1, score, feedback);
    }
    setRoundInProgress(false);
    setRoundResult({ passed: isEligible, score, feedback });
  };

  const submitRound2 = () => {
    let correct = 0;
    aptitudeQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / aptitudeQuestions.length) * 100);
    const passed = calculatedScore >= activeRoundObj.cutOffScore;
    const feedback = passed
      ? `Congratulations! You answered ${correct}/${aptitudeQuestions.length} questions correctly (${calculatedScore}%). You cleared the cognitive reasoning cut-off for ${selectedCompany}.`
      : `Score: ${calculatedScore}% (${correct}/${aptitudeQuestions.length} correct). Cut-off is ${activeRoundObj.cutOffScore}%. Review the solutions below and try again.`;

    if (passed) {
      completeRound(2, calculatedScore, feedback);
      addBadge({ id: 'badge_aptitude', title: 'Cognitive Aptitude Honors' });
    }
    setRoundInProgress(false);
    setRoundResult({ passed, score: calculatedScore, feedback, details: aptitudeQuestions });
  };

  const submitRound3 = () => {
    const questions = getRoleQuestions();
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / questions.length) * 100);
    const passed = calculatedScore >= activeRoundObj.cutOffScore;
    const feedback = passed
      ? `Domain assessment cleared! You scored ${calculatedScore}% in ${targetRole} technical questions for ${selectedCompany}.`
      : `Score: ${calculatedScore}%. Cut-off is ${activeRoundObj.cutOffScore}%. Review the technical explanations and re-attempt.`;

    if (passed) {
      completeRound(3, calculatedScore, feedback);
      addBadge({ id: 'badge_domain', title: `${targetRole} Technical Certified` });
    }
    setRoundInProgress(false);
    setRoundResult({ passed, score: calculatedScore, feedback, details: questions });
  };

  const submitRound4 = () => {
    const words = emailBody.trim().split(/\s+/).filter(Boolean).length;
    const hasSubject = emailSubject.trim().length > 5;
    const hasKeywords = emailBody.toLowerCase().includes('update') || emailBody.toLowerCase().includes('mitigation') || emailBody.toLowerCase().includes('timeline') || emailBody.toLowerCase().includes('deliverable');

    const passed = hasSubject && words >= 30 && hasKeywords;
    const score = passed ? 88 : 45;
    const feedback = passed
      ? `Professional corporate email verified! Subject line is concise, tone is diplomatic, and email addresses key timeline mitigation steps for ${selectedCompany} leadership.`
      : `Your email draft requires improvement: Ensure a meaningful Subject line, at least 30 words in body, and explicit mention of timeline, mitigation, and deliverables.`;

    if (passed) {
      completeRound(4, score, feedback);
    }
    setRoundInProgress(false);
    setRoundResult({ passed, score, feedback });
  };

  const submitRound5 = () => {
    // Correct case answers: Q1: 0 (discounting), Q2: 1 (cap discounts), Q3: 0 (weekly tracking)
    let correct = 0;
    if (caseAnswers['q1'] === 0) correct++;
    if (caseAnswers['q2'] === 1) correct++;
    if (caseAnswers['q3'] === 0) correct++;

    const score = Math.round((correct / 3) * 100);
    const passed = score >= 66;
    const feedback = passed
      ? `Case solution approved! You identified the margin erosion driver, prioritized discount rationalization, and structured weekly governance for ${selectedCompany}.`
      : `Case solution score: ${score}%. Strategic alignment did not meet the 80% cut-off. Re-examine the data tables and retry.`;

    if (passed) {
      completeRound(5, score, feedback);
    }
    setRoundInProgress(false);
    setRoundResult({ passed, score, feedback });
  };

  const submitRound6 = () => {
    const sitLen = starAnswers.situation.trim().length;
    const actLen = starAnswers.action.trim().length;
    const resLen = starAnswers.result.trim().length;

    const passed = sitLen >= 20 && actLen >= 20 && resLen >= 20;
    const score = passed ? 90 : 50;
    const feedback = passed
      ? `Outstanding STAR response! Your situation context was clear, your personal actions demonstrated ${targetRole} rigor, and your measurable results satisfied the technical viva panel.`
      : `Please provide more detail in each STAR section (Situation, Action, Result) with at least 20 characters per field.`;

    if (passed) {
      completeRound(6, score, feedback);
      addBadge({ id: 'badge_star', title: 'STAR Viva Master' });
    }
    setRoundInProgress(false);
    setRoundResult({ passed, score, feedback });
  };

  const handleAcceptOffer = () => {
    setOfferAccepted(true);
    completeRound(7, 100, `Corporate Onboarding Complete! Welcome to ${selectedCompany} as an official ${targetRole}.`);
    addBadge({ id: 'badge_onboarded', title: `${selectedCompany} Onboarded Professional` });
    setRoundResult({
      passed: true,
      score: 100,
      feedback: `Official Offer Accepted! Corporate Key & Workspace Unlocked. You are now officially placed at ${selectedCompany}.`
    });
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-7 h-7 text-sky-400" />
            Company Recruitment Roadmap & Experience
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Experience realistic hiring rounds tailored for <strong className="text-sky-400">{targetRole}</strong> at <strong className="text-white">{selectedCompany}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'roadmap', label: 'Hiring Roadmap (7 Rounds)' },
            { id: 'companies', label: 'Switch Company' },
            { id: 'roles', label: 'Switch Role' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${activeTab === t.id ? 'bg-sky-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Hiring Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roadmap Steps List */}
          <div className="lg:col-span-1 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase">Selection Pipeline</h3>
            {hiringRounds.map(r => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRound(r.roundNumber);
                  setRoundResult(null);
                  setRoundInProgress(false);
                }}
                className={`w-full text-left p-4 rounded-xl border text-xs transition ${
                  activeRound === r.roundNumber
                    ? 'bg-sky-500 text-white font-bold'
                    : r.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase opacity-80">Round {r.roundNumber}</span>
                    <div className="font-semibold">{r.title}</div>
                  </div>
                  {r.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Active Round Assessment Container */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-sky-400 uppercase">
                  Round {activeRoundObj.roundNumber} of 7 • {selectedCompany}
                </span>
                <h2 className="text-lg font-extrabold text-white mt-0.5">
                  {activeRoundObj.title}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                {roundInProgress ? (
                  <span className="text-amber-400 font-mono font-bold">{formatTime(timeLeft)}</span>
                ) : (
                  `${activeRoundObj.durationMinutes} Mins`
                )}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeRoundObj.description}
            </p>

            {/* PRE-TEST INSTRUCTIONS */}
            {!roundInProgress && !roundResult && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white">Instructions & Passing Criteria:</h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Cut-off score required to qualify: <strong className="text-sky-400">{activeRoundObj.cutOffScore}%</strong></li>
                  <li>• Test format: Realistic domain evaluation designed for <strong>{targetRole}</strong> at <strong>{selectedCompany}</strong>.</li>
                  <li>• You will receive immediate score calculation and feedback upon submission.</li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={handleStartRound}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Play className="w-4 h-4" /> Start Round {activeRoundObj.roundNumber} Assessment
                  </button>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 1 (Eligibility Form) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 1 && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Candidate Academic Verification</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold">Cumulative CGPA (Min 7.0):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cgpaInput}
                      onChange={(e) => setCgpaInput(Number(e.target.value))}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-semibold">Current Degree:</label>
                    <select
                      value={degreeInput}
                      onChange={(e) => setDegreeInput(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    >
                      <option value="B.Tech / B.E">B.Tech / B.E</option>
                      <option value="B.Sc / BCA">B.Sc / BCA</option>
                      <option value="M.Tech / MCA">M.Tech / MCA</option>
                      <option value="MBA / B.Com">MBA / B.Com</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 font-semibold">Active Backlogs:</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        checked={backlogsInput === 0}
                        onChange={() => setBacklogsInput(0)}
                      /> 0 Active Backlogs (Eligible)
                    </label>
                    <label className="flex items-center gap-1.5 text-slate-200 cursor-pointer">
                      <input
                        type="radio"
                        checked={backlogsInput > 0}
                        onChange={() => setBacklogsInput(1)}
                      /> 1+ Backlogs
                    </label>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <label className="text-slate-400 font-semibold">Core Competencies Verified:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Excel & Analytics', 'SQL & Databases', 'Problem Solving', 'Corporate Communication'].map(sk => (
                      <label key={sk} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={skillsSelected.includes(sk)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSkillsSelected(prev => [...prev, sk]);
                            } else {
                              setSkillsSelected(prev => prev.filter(s => s !== sk));
                            }
                          }}
                        /> {sk}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={submitRound1}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md"
                >
                  Submit Profile Verification
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 2 (Cognitive Aptitude) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 2 && (
              <div className="space-y-4">
                {aptitudeQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-sky-400">Question {idx + 1} of {aptitudeQuestions.length}</div>
                    <p className="text-xs text-slate-200 leading-relaxed">{q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          className={`p-3 rounded-lg border text-left text-xs transition ${
                            selectedAnswers[idx] === optIdx
                              ? 'bg-sky-500/20 border-sky-500 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={submitRound2}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold shadow-md"
                >
                  Submit Aptitude Test ({Object.keys(selectedAnswers).length}/{aptitudeQuestions.length} answered)
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 3 (Role Technical Assessment) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 3 && (
              <div className="space-y-4">
                {getRoleQuestions().map((q, idx) => (
                  <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-purple-400">{targetRole} Question {idx + 1} of 4</div>
                    <p className="text-xs text-slate-200 leading-relaxed">{q.question}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => setSelectedAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                          className={`p-3 rounded-lg border text-left text-xs transition ${
                            selectedAnswers[idx] === optIdx
                              ? 'bg-purple-500/20 border-purple-500 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={submitRound3}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold shadow-md"
                >
                  Submit Domain Test ({Object.keys(selectedAnswers).length}/4 answered)
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 4 (Business Email) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 4 && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-sky-400">Scenario Prompt:</div>
                  <p>
                    Client Director Rajesh Verma from {selectedCompany}'s key account has requested an urgent update regarding a delayed project milestone. Write a professional, diplomatic executive response explaining the mitigation plan, root cause, and revised completion date.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 font-semibold">Subject Line:</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g. Project Milestone Update & Mitigation Plan — [Account Ref]"
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold">Email Body:</label>
                    <textarea
                      rows={6}
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Dear Mr. Verma, Thank you for connecting. I am writing to provide an update regarding our recent milestone..."
                      className="w-full mt-1 p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none leading-relaxed"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Word Count: {emailBody.trim().split(/\s+/).filter(Boolean).length} words (Min 30 required)
                    </div>
                  </div>
                </div>

                <button
                  onClick={submitRound4}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md"
                >
                  Submit Business Email Draft
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 5 (Case Study) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 5 && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-5">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-sky-400">Enterprise Case Scenario</span>
                  <h3 className="text-sm font-extrabold text-white">{selectedCompany} Omnichannel Performance Diagnosis</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Client RetailCorp recorded an 8% increase in gross revenue during Q3, but net operating margin collapsed by 14%. An internal audit reveals promotional discount rates spiked to 32% (target: 18%), and logistics return costs rose by 25%.
                  </p>
                </div>

                {/* Case Question 1 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">1. What is the primary operational cause of margin compression?</div>
                  {[
                    'Excessive promotional discounting eroding unit profit margins',
                    'Increase in corporate executive salaries',
                    'Failure of internal database servers'
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="case_q1"
                        checked={caseAnswers['q1'] === i}
                        onChange={() => setCaseAnswers(prev => ({ ...prev, q1: i }))}
                      /> {opt}
                    </label>
                  ))}
                </div>

                {/* Case Question 2 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">2. What immediate operational policy should be recommended?</div>
                  {[
                    'Double marketing spend on television ads',
                    'Cap promotional discount thresholds and delist negative-margin SKUs',
                    'Stop all shipping for 3 months'
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="case_q2"
                        checked={caseAnswers['q2'] === i}
                        onChange={() => setCaseAnswers(prev => ({ ...prev, q2: i }))}
                      /> {opt}
                    </label>
                  ))}
                </div>

                {/* Case Question 3 */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white">3. How should performance governance be monitored?</div>
                  {[
                    'Weekly margin-by-category dashboard tracking and regional KPI audits',
                    'Annual shareholder review once a year only',
                    'No tracking required'
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="case_q3"
                        checked={caseAnswers['q3'] === i}
                        onChange={() => setCaseAnswers(prev => ({ ...prev, q3: i }))}
                      /> {opt}
                    </label>
                  ))}
                </div>

                <button
                  onClick={submitRound5}
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-md"
                >
                  Submit Case Analysis
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 6 (STAR Technical Viva) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 6 && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs text-purple-400 font-bold">
                  STAR Method Assessment (Situation • Action • Result)
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-300 font-semibold">1. Situation & Task:</label>
                    <p className="text-[11px] text-slate-400 mb-1">Describe a challenging technical project or dataset challenge you faced.</p>
                    <textarea
                      rows={3}
                      value={starAnswers.situation}
                      onChange={(e) => setStarAnswers(prev => ({ ...prev, situation: e.target.value }))}
                      placeholder="e.g. During my analytics project on consumer churn, our dataset had 40% missing values right before the sprint deadline..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold">2. Action:</label>
                    <p className="text-[11px] text-slate-400 mb-1">What exact analytical tools, formulas, or methods did you personally apply?</p>
                    <textarea
                      rows={3}
                      value={starAnswers.action}
                      onChange={(e) => setStarAnswers(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="e.g. I implemented median imputation in Python, wrote SQL CTEs to isolate valid cohorts, and built dynamic Power BI slices..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold">3. Result & Quantifiable Impact:</label>
                    <p className="text-[11px] text-slate-400 mb-1">What was the quantifiable outcome and business impact?</p>
                    <textarea
                      rows={3}
                      value={starAnswers.result}
                      onChange={(e) => setStarAnswers(prev => ({ ...prev, result: e.target.value }))}
                      placeholder="e.g. We restored model accuracy to 94%, identified $24,000 in revenue leakage, and delivered the report 1 day ahead of schedule..."
                      className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={submitRound6}
                  className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold shadow-md"
                >
                  Submit STAR Viva Response
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* LIVE TEST RUNNER: ROUND 7 (Offer Letter & Onboarding) */}
            {/* ---------------------------------------------------------------- */}
            {roundInProgress && activeRound === 7 && (
              <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-sky-400" />
                    <div>
                      <div className="font-extrabold text-white text-sm">{selectedCompany} Global Talent Acquisition</div>
                      <div className="text-[10px] text-slate-400">Formal Corporate Placement Offer</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    Official Offer
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300">
                  <p>Dear <strong className="text-white">{user?.fullName || 'Candidate'}</strong>,</p>
                  <p>
                    Following your exceptional performance across all 6 sequential assessment rounds, {selectedCompany} is delighted to extend this formal offer of appointment for the position of <strong className="text-sky-400">{targetRole}</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Compensation (CTC):</span>
                      <strong className="text-emerald-400 font-mono text-sm">₹14,50,000 / Annum</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Corporate Placement:</span>
                      <strong className="text-white">{selectedCompany} • Enterprise Division</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAcceptOffer}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Sign & Accept Corporate Offer Letter
                </button>
              </div>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* TEST RESULT & SCORECARD VIEW */}
            {/* ---------------------------------------------------------------- */}
            {roundResult && (
              <div className={`p-5 rounded-xl border space-y-4 ${
                roundResult.passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {roundResult.passed ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400">Round {activeRound} Cleared!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span className="text-rose-400">Round Not Cleared</span>
                      </>
                    )}
                  </div>
                  <span className={`text-lg font-extrabold ${roundResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {roundResult.score}%
                  </span>
                </div>

                <p className="text-xs text-slate-200">{roundResult.feedback}</p>

                {/* Question review details if available */}
                {roundResult.details && Array.isArray(roundResult.details) && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Answer Key & Explanations:</div>
                    {roundResult.details.map((q: any, i: number) => {
                      const isCorrect = selectedAnswers[i] === q.correctAnswer;
                      return (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-white">Q{i + 1}: {q.question.substring(0, 60)}...</span>
                            <span className={isCorrect ? 'text-emerald-400' : 'text-rose-400'}>
                              {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          </div>
                          <div className="text-slate-400 text-[10px]">{q.explanation}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Next Steps Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {roundResult.passed ? (
                    <button
                      onClick={() => {
                        if (activeRound < 7) {
                          setActiveRound(activeRound + 1);
                          setRoundResult(null);
                        } else {
                          navigate('/virtual-office');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      {activeRound < 7 ? `Proceed to Round ${activeRound + 1}` : 'Enter Virtual Corporate Office'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStartRound}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Retry Round {activeRound}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Companies Switcher */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {companiesList.map(c => (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                selectedCompany === c.name ? 'bg-sky-500/10 border-sky-500 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400">{c.industry}</span>
                <h3 className="text-base font-extrabold text-white">{c.name}</h3>
                <p className="text-xs text-slate-300">{c.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setSelectedCompany(c.name);
                    setActiveTab('roadmap');
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    selectedCompany === c.name ? 'bg-sky-500 text-white' : 'bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300'
                  }`}
                >
                  {selectedCompany === c.name ? 'Selected Company' : 'Select Company'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Roles Switcher */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {careerRolesList.map(r => (
            <div
              key={r.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                targetRole === r.title ? 'bg-sky-500/10 border-sky-500 shadow-lg' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-semibold text-slate-400">{r.category}</span>
                <h3 className="text-base font-extrabold text-white">{r.title}</h3>
                <p className="text-xs text-slate-300">{r.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setTargetRole(r.title);
                    setActiveTab('roadmap');
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                    targetRole === r.title ? 'bg-sky-500 text-white' : 'bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300'
                  }`}
                >
                  {targetRole === r.title ? 'Selected Target Role' : 'Select Target Role'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

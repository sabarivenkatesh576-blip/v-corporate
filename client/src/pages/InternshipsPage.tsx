import React, { useState, useRef, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Play,
  Award,
  Sparkles,
  Code,
  Table,
  BarChart3,
  FileText,
  DollarSign,
  Briefcase,
  Users,
  Target,
  FileCheck,
  Zap,
  RotateCcw,
  AlertTriangle,
  Bot,
  ChevronRight,
  TrendingUp,
  Sliders,
  Send,
  Calculator,
  Terminal,
  Copy,
  Gamepad2,
  LayoutGrid
} from 'lucide-react';
import { InternshipQuestMap3D } from '../components/3d/InternshipQuestMap3D';

interface InternshipSprintChallenge {
  week: number;
  category: string;
  title: string;
  problemStatement: string;
  dataContext: string;
  workstationType: 'sql_code' | 'excel_grid' | 'frd_studio' | 'dcf_calculator';
  fieldsToAnswer: Array<{
    key: string;
    label: string;
    placeholder: string;
    expectedAnswer: string;
    weightage: number;
  }>;
  aiSuggestedFormula: string;
  aiSuggestedCode: string;
  hint: string;
  idealSolution: string;
  idealWorking: string;
}

interface EvaluationBreakdown {
  totalScore: number;
  maxScore: number;
  xpAwarded: number;
  grade: 'A+ (Distinction)' | 'A (Excellence)' | 'B (Proficient)' | 'Needs Revision';
  fieldResults: Array<{
    label: string;
    yourAnswer: string;
    expectedAnswer: string;
    isCorrect: boolean;
    marksEarned: number;
    maxMarks: number;
    explanation: string;
  }>;
  managerComments: string;
}

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  formulaSnippet?: string;
  codeSnippet?: string;
  timestamp: string;
}

export const InternshipsPage: React.FC = () => {
  const { user, addXp, updateReadinessComponent } = useAuth();
  const {
    selectedCompany,
    targetRole,
    internshipStatus,
    submitInternshipWeekTask,
    addBadge
  } = useCareer();
  const navigate = useNavigate();

  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<Record<number, EvaluationBreakdown>>({});
  const [questViewMode, setQuestViewMode] = useState<'3d' | 'roadmap'>('3d');

  // 1. Live Excel Grid State
  const [excelGrid, setExcelGrid] = useState<string[][]>([
    ['Product Line', 'Quarterly Units', 'Unit Selling Price ($)', 'Unit Direct Cost ($)', 'Revenue ($)', 'Gross Margin ($)', 'Margin %'],
    ['Enterprise SaaS Suite', '1250', '2400', '1320', '3000000', '1350000', '45.0%'],
    ['AI Data Pipeline', '850', '3800', '1900', '3230000', '1615000', '50.0%'],
    ['Cloud Migration Core', '620', '4500', '2925', '2790000', '976500', '35.0%'],
    ['Security Token Gateway', '940', '1800', '990', '1692000', '761400', '45.0%'],
    ['Total Portfolio Summary', '3660', '-', '-', '10712000', '4702900', '43.9%']
  ]);
  const [activeFormulaInput, setActiveFormulaInput] = useState('=SUM(E2:E5)');

  // 2. SQL Sandbox State
  const [sqlCode, setSqlCode] = useState(
    `SELECT customer_id, region, SUM(order_amount) AS total_revenue,\n       ROUND(AVG(margin_pct), 2) AS avg_margin\nFROM corporate_transactions\nWHERE transaction_status = 'SETTLED'\nGROUP BY customer_id, region\nHAVING SUM(order_amount) >= 250000 AND AVG(margin_pct) >= 40.0\nORDER BY total_revenue DESC\nLIMIT 5;`
  );
  const [sqlOutput, setSqlOutput] = useState<any[] | null>(null);

  // 3. Business FRD State
  const [userStoryActor, setUserStoryActor] = useState('Senior Enterprise Risk Officer');
  const [userStoryAction, setUserStoryAction] = useState('automatically flag real-time margin anomalies exceeding 15% variance');
  const [userStoryValue, setUserStoryValue] = useState('prevent quarterly revenue leakage and ensure audited financial compliance');
  const [acceptanceRule1, setAcceptanceRule1] = useState('System triggers webhook alert to audit queue within 250ms of variance detection.');

  // 4. DCF Valuation State
  const [waccRate, setWaccRate] = useState('9.2');
  const [terminalGrowth, setTerminalGrowth] = useState('2.5');
  const [calculatedEnterpriseValue, setCalculatedEnterpriseValue] = useState<number | null>(null);

  // -------------------------------------------------------------
  // DOCKED AI CHATBOT (FORMULA & CODE CO-PILOT) STATE
  // -------------------------------------------------------------
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Welcome to your ${selectedCompany} Internship! I am your AI Formula & Code Co-Pilot. I'm here to assist you with exact Excel formulas, SQL query templates, and analytical logic for each weekly sprint. Click a prompt below or ask for guidance!`,
      formulaSnippet: '=SUM(E2:E5)',
      codeSnippet: `SELECT customer_id, SUM(order_amount) FROM corporate_transactions GROUP BY customer_id HAVING SUM(order_amount) >= 250000;`,
      timestamp: 'Just now'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // 4 Structured Internship Practical Sprints
  const INTERNSHIP_SPRINTS: InternshipSprintChallenge[] = [
    {
      week: 1,
      category: 'Data Engineering & Account Segmentation',
      title: 'Week 1 Practical: Enterprise SQL Pipeline & Account Analysis',
      problemStatement: `Welcome to your first week at ${selectedCompany}! As our ${targetRole} intern, the Practice Lead has assigned you to query our corporate transaction records. Query the dataset to identify top enterprise accounts generating at least $250,000 in revenue with at least 40% margin. Execute the query in the live workstation below and submit: (1) What is the Top Customer ID? (2) What is the Top Customer Revenue ($)? (3) Which SQL clause was used to filter the aggregated group metrics?`,
      dataContext: `PostgreSQL database table 'corporate_transactions' with customer_id, region, order_amount, and margin_pct.`,
      workstationType: 'sql_code',
      fieldsToAnswer: [
        { key: 'top_customer', label: '1. Top Customer ID', placeholder: 'e.g. CORP-9021', expectedAnswer: 'CORP-9021', weightage: 35 },
        { key: 'top_revenue', label: '2. Top Customer Revenue ($)', placeholder: 'e.g. 890000', expectedAnswer: '890000', weightage: 35 },
        { key: 'sql_clause', label: '3. SQL Aggregation Filter Clause Used', placeholder: 'e.g. HAVING', expectedAnswer: 'HAVING', weightage: 30 }
      ],
      aiSuggestedFormula: 'Use HAVING SUM(order_amount) >= 250000 to filter aggregate metric conditions in SQL.',
      aiSuggestedCode: `SELECT customer_id, region, SUM(order_amount) AS total_revenue,\n       ROUND(AVG(margin_pct), 2) AS avg_margin\nFROM corporate_transactions\nWHERE transaction_status = 'SETTLED'\nGROUP BY customer_id, region\nHAVING SUM(order_amount) >= 250000 AND AVG(margin_pct) >= 40.0\nORDER BY total_revenue DESC\nLIMIT 5;`,
      hint: 'Run the SQL query in the terminal below. Top record is CORP-9021 with $890,000 revenue. Aggregation filter clause is HAVING.',
      idealSolution: 'Top Customer = CORP-9021 | Revenue = $890,000 | Clause = HAVING',
      idealWorking: 'Query execution returns CORP-9021 in North America with 42 orders totaling $890,000 at 49.5% average margin. The HAVING clause correctly filters group aggregations.'
    },
    {
      week: 2,
      category: 'Financial Modeling & Margin Optimization',
      title: 'Week 2 Practical: Interactive Spreadsheet Modeling & Anomaly Diagnosis',
      problemStatement: `The Practice Director at ${selectedCompany} noted that our quarterly portfolio Gross Margin dropped to 43.9%, missing the 45.0% target. Review the live interactive spreadsheet. Calculate: (1) What is the total combined Gross Margin ($) across all 4 product lines? (2) Which product line has the lowest margin percentage? (3) What Excel formula should be used in cell E6 to aggregate total Revenue?`,
      dataContext: `Interactive financial spreadsheet with quarterly volumes, selling prices, and direct costs.`,
      workstationType: 'excel_grid',
      fieldsToAnswer: [
        { key: 'total_margin', label: '1. Total Gross Margin ($)', placeholder: 'e.g. 4702900', expectedAnswer: '4702900', weightage: 35 },
        { key: 'lowest_product', label: '2. Product Line with Lowest Margin %', placeholder: 'e.g. Cloud Migration Core', expectedAnswer: 'Cloud Migration Core', weightage: 35 },
        { key: 'excel_formula', label: '3. Excel Formula for Total Revenue in cell E6', placeholder: 'e.g. =SUM(E2:E5)', expectedAnswer: '=SUM(E2:E5)', weightage: 30 }
      ],
      aiSuggestedFormula: '=SUM(E2:E5) for Total Revenue, and =(Revenue - Cost) / Revenue for Margin %',
      aiSuggestedCode: `-- Excel Formula: =SUM(E2:E5)\n-- Margin Dollar: =E2 - (B2 * D2)`,
      hint: 'Sum the margin column: $1.35M + $1.615M + $976.5k + $761.4k = $4,702,900. Cloud Migration Core has 35.0% margin. Formula is =SUM(E2:E5).',
      idealSolution: 'Total Margin = $4,702,900 | Lowest Margin = Cloud Migration Core (35.0%) | Formula = =SUM(E2:E5)',
      idealWorking: 'Summing Gross Margins: $1,350,000 + $1,615,000 + $976,500 + $761,400 = $4,702,900. Cloud Migration Core margin is ($976,500 / $2,790,000) = 35.0%.'
    },
    {
      week: 3,
      category: 'Agile Business Requirements & Architecture',
      title: 'Week 3 Practical: Agile FRD & Anomaly Alert Specification',
      problemStatement: `To prevent future margin leakage, ${selectedCompany} requires a formal Functional Requirements Document (FRD) for automated anomaly detection. Specify: (1) What is the Actor role in your User Story? (2) What is the automated action? (3) What is the required webhook alert latency in milliseconds?`,
      dataContext: `Agile User Story format (As a... I want to... So that...) with strict Given-When-Then rules.`,
      workstationType: 'frd_studio',
      fieldsToAnswer: [
        { key: 'frd_actor', label: '1. User Story Actor', placeholder: 'e.g. Senior Enterprise Risk Officer', expectedAnswer: 'Senior Enterprise Risk Officer', weightage: 35 },
        { key: 'frd_action', label: '2. Automated Anomaly Action', placeholder: 'e.g. automatically flag real-time margin anomalies exceeding 15% variance', expectedAnswer: 'flag real-time margin anomalies', weightage: 35 },
        { key: 'frd_latency', label: '3. Max Allowed Webhook Latency (ms)', placeholder: 'e.g. 250 or 250ms', expectedAnswer: '250', weightage: 30 }
      ],
      aiSuggestedFormula: 'User Story Syntax: As a [Actor], I want to [Action], So that [Value]. Latency SLA: <= 250ms.',
      aiSuggestedCode: `// Example Webhook Payload Schema:\n{\n  "event": "MARGIN_VARIANCE_TRIGGER",\n  "threshold_pct": 15.0,\n  "max_latency_ms": 250\n}`,
      hint: 'Actor is Senior Enterprise Risk Officer, action is automated margin anomaly flagging, and alert threshold latency is 250ms.',
      idealSolution: 'Actor = Senior Enterprise Risk Officer | Action = Flag margin anomalies | Latency = 250ms',
      idealWorking: 'FRD enforces strict real-time audit trailing with <= 250ms latency for compliance.'
    },
    {
      week: 4,
      category: 'Strategic Valuation & Final Capstone Sign-off',
      title: 'Week 4 Practical: DCF Valuation, Profit Recovery & Capstone Sign-off',
      problemStatement: `For your final capstone sprint at ${selectedCompany}, direct unit costs for Cloud Migration Core have been renegotiated to $2,475 (saving $450/unit) across 620 units. Calculate: (1) What will be the new Gross Margin ($) for Cloud Migration Core? (2) What will be its new Margin %? (3) What is the total annual cost savings ($)?`,
      dataContext: `Cloud Migration Core: 620 Units, Selling Price = $4,500, New Cost = $2,475 ($450 savings per unit).`,
      workstationType: 'dcf_calculator',
      fieldsToAnswer: [
        { key: 'new_margin_dollar', label: '1. New Cloud Migration Gross Margin ($)', placeholder: 'e.g. 1255500', expectedAnswer: '1255500', weightage: 35 },
        { key: 'new_margin_pct', label: '2. New Margin Percentage (%)', placeholder: 'e.g. 45.0% or 45', expectedAnswer: '45', weightage: 35 },
        { key: 'total_savings', label: '3. Total Annual Cost Savings ($)', placeholder: 'e.g. 279000', expectedAnswer: '279000', weightage: 30 }
      ],
      aiSuggestedFormula: 'New Gross Margin = 620 * ($4,500 - $2,475) = $1,255,500 | Savings = 620 * $450 = $279,000',
      aiSuggestedCode: `-- Excel Formula: =620 * (4500 - 2475)\n-- Margin % Formula: =1255500 / (620 * 4500) = 45.0%`,
      hint: 'New Margin = 620 * ($4,500 - $2,475) = $1,255,500. Margin % = $1,255,500 / $2,790,000 = 45.0%. Savings = 620 * $450 = $279,000.',
      idealSolution: 'New Margin = $1,255,500 | New Margin % = 45.0% | Annual Savings = $279,000',
      idealWorking: 'Cost reduction of $450/unit * 620 units = $279,000 direct addition to Gross Profit. Margin rises from 35.0% to 45.0%.'
    }
  ];

  const currentSprint = INTERNSHIP_SPRINTS.find(s => s.week === selectedWeek) || INTERNSHIP_SPRINTS[0];

  const handleInputChange = (fieldKey: string, val: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${selectedWeek}_${fieldKey}`]: val
    }));
  };

  const handleExcelCellChange = (rIdx: number, cIdx: number, val: string) => {
    const next = excelGrid.map(row => [...row]);
    next[rIdx][cIdx] = val;

    if (rIdx >= 1 && rIdx <= 4 && (cIdx === 1 || cIdx === 2 || cIdx === 3)) {
      const units = parseFloat(next[rIdx][1]) || 0;
      const price = parseFloat(next[rIdx][2]) || 0;
      const cost = parseFloat(next[rIdx][3]) || 0;
      const rev = units * price;
      const marginDollar = rev - (units * cost);
      const marginPct = rev > 0 ? ((marginDollar / rev) * 100).toFixed(1) + '%' : '0%';

      next[rIdx][4] = rev.toString();
      next[rIdx][5] = marginDollar.toString();
      next[rIdx][6] = marginPct;
    }

    setExcelGrid(next);
  };

  const handleRunSql = () => {
    setSqlOutput([
      { customer_id: 'CORP-9021', region: 'North America', total_orders: 42, total_revenue: '$890,000', avg_margin: '49.5%' },
      { customer_id: 'CORP-4819', region: 'EMEA', total_orders: 38, total_revenue: '$745,000', avg_margin: '46.2%' },
      { customer_id: 'CORP-3312', region: 'Asia-Pacific', total_orders: 31, total_revenue: '$620,000', avg_margin: '48.0%' }
    ]);
  };

  const handleComputeDcf = () => {
    const wacc = parseFloat(waccRate) / 100 || 0.092;
    const g = parseFloat(terminalGrowth) / 100 || 0.025;
    const cf = [120, 145, 175, 210, 250];

    let pvSum = 0;
    cf.forEach((val, i) => {
      pvSum += val / Math.pow(1 + wacc, i + 1);
    });

    const terminalVal = (cf[cf.length - 1] * (1 + g)) / (wacc - g);
    const pvTerminal = terminalVal / Math.pow(1 + wacc, cf.length);
    const ev = Math.round(pvSum + pvTerminal);
    setCalculatedEnterpriseValue(ev);
  };

  // AI Chatbot Messaging Handler
  const handleSendChat = (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, newMsg]);
    if (!customText) setChatInput('');

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let replyText = `Here is the corporate internship guidance for Week ${selectedWeek} at ${selectedCompany}:`;
      let formula: string | undefined;
      let code: string | undefined;

      if (lower.includes('formula') || lower.includes('excel') || lower.includes('margin') || lower.includes('sum')) {
        replyText = `For Week ${selectedWeek} Sprint:\n1. Use '=SUM(E2:E5)' to aggregate column E in Excel.\n2. Gross Margin is calculated as Revenue minus Direct Cost.\n3. Margin % = Gross Margin / Total Revenue.`;
        formula = currentSprint.aiSuggestedFormula;
      } else if (lower.includes('sql') || lower.includes('query') || lower.includes('having')) {
        replyText = `In SQL, use the HAVING clause to filter groups after GROUP BY:`;
        code = currentSprint.aiSuggestedCode;
      } else if (lower.includes('hint') || lower.includes('help')) {
        replyText = `💡 Sprint Hint for Week ${selectedWeek}:\n${currentSprint.hint}`;
        formula = currentSprint.aiSuggestedFormula;
      } else {
        replyText = `For Week ${selectedWeek}, execute your calculations in the workstation on the left, enter your calculated answers in the 3 boxes, and submit for grading!`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          formulaSnippet: formula,
          codeSnippet: code,
          timestamp: 'Just now'
        }
      ]);
    }, 700);
  };

  // -------------------------------------------------------------
  // AI REAL-TIME EVALUATION & MARKING ENGINE
  // -------------------------------------------------------------
  const handleEvaluateInternshipWork = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);

      let totalEarnedMarks = 0;
      let totalMaxMarks = 0;

      const fieldResults = currentSprint.fieldsToAnswer.map(field => {
        const rawUserVal = (userAnswers[`${selectedWeek}_${field.key}`] || '').trim();
        const cleanUser = rawUserVal.replace(/[$,%]/g, '').toLowerCase();
        const cleanExpected = field.expectedAnswer.replace(/[$,%]/g, '').toLowerCase();

        const isCorrect = cleanUser === cleanExpected || cleanUser.includes(cleanExpected) || cleanExpected.includes(cleanUser);
        const marksEarned = isCorrect ? field.weightage : 0;

        totalEarnedMarks += marksEarned;
        totalMaxMarks += field.weightage;

        return {
          label: field.label,
          yourAnswer: rawUserVal || '(No Answer Entered)',
          expectedAnswer: field.expectedAnswer,
          isCorrect,
          marksEarned,
          maxMarks: field.weightage,
          explanation: isCorrect
            ? `Correct! Accurately matches ${selectedCompany} enterprise ground truth.`
            : `Incorrect. Expected ${field.expectedAnswer}, but received ${rawUserVal || 'empty'}.`
        };
      });

      const totalScore = Math.round((totalEarnedMarks / totalMaxMarks) * 100);
      const xpAwarded = Math.round(totalScore * 3);

      let grade: EvaluationBreakdown['grade'] = 'A+ (Distinction)';
      if (totalScore >= 90) grade = 'A+ (Distinction)';
      else if (totalScore >= 75) grade = 'A (Excellence)';
      else if (totalScore >= 50) grade = 'B (Proficient)';
      else grade = 'Needs Revision';

      const breakdown: EvaluationBreakdown = {
        totalScore,
        maxScore: 100,
        xpAwarded,
        grade,
        fieldResults,
        managerComments: `“Intern completed ${currentSprint.title} with an official evaluation score of ${totalScore}%. ${
          totalScore >= 90
            ? 'Demonstrated exceptional technical rigor, formula precision, and corporate readiness.'
            : 'Good fundamental understanding with minor numerical variances.'
        }” — Dr. Alistair Vance, Practice Director at ${selectedCompany}`
      };

      setEvaluationResults(prev => ({
        ...prev,
        [selectedWeek]: breakdown
      }));

      addXp(xpAwarded);
      if (selectedWeek === 1) {
        updateReadinessComponent('skills', totalScore);
        updateReadinessComponent('problemSolving', totalScore);
      } else if (selectedWeek === 2) {
        updateReadinessComponent('problemSolving', totalScore);
        updateReadinessComponent('projects', totalScore);
      } else if (selectedWeek === 3) {
        updateReadinessComponent('communication', totalScore);
        updateReadinessComponent('teamwork', totalScore);
      } else if (selectedWeek === 4) {
        updateReadinessComponent('projects', totalScore);
        updateReadinessComponent('problemSolving', totalScore);
      }

      submitInternshipWeekTask(selectedWeek);

      addBadge({
        id: `bdg_intern_wk_${selectedWeek}`,
        title: `${selectedCompany} Week ${selectedWeek} Certified: ${currentSprint.title} (${totalScore}% Marks)`
      });
    }, 1000);
  };

  const currentEvaluation = evaluationResults[selectedWeek];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" /> Unified Practical Internship Workplace
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Formula & Code Co-Pilot Docked
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Compass className="w-7 h-7 text-sky-400" />
            Virtual Corporate Internship & Practical Workplace Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Work through live AI-assigned sprint challenges in interactive workstations (SQL terminals, Excel grids, FRD builders, and DCF models) for <strong className="text-white">{selectedCompany}</strong>. Use the docked AI Co-Pilot for instant code and formula assistance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/style-manager')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Manager Standup
          </button>
          <button
            onClick={() => navigate('/credentials')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" /> Credential Vault
          </button>
        </div>
      </div>

      {/* Internship Corporate Cohort Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
            Active Experiential Corporate Track
          </span>
          <h2 className="text-xl font-extrabold text-white">
            {selectedCompany} • <span className="text-sky-400">{targetRole} Corporate Internship</span>
          </h2>
          <p className="text-xs text-slate-300">
            Assigned Mentor: <strong className="text-purple-400">Dr. Alistair Vance (Senior Director of Practice)</strong> · Live Evaluation: <strong className="text-emerald-400">Active</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 uppercase block">Practical Completion</span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              {internshipStatus.completedWeeks} / {INTERNSHIP_SPRINTS.length} Weeks Verified
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-extrabold text-sm">
            {Math.round((internshipStatus.completedWeeks / INTERNSHIP_SPRINTS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* 3D Gamified Quest Map & View Mode Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              🎮 3D Gamified Internship Sprint Map
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setQuestViewMode('3d')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                questViewMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" /> 🎮 3D Quest World
            </button>
            <button
              onClick={() => setQuestViewMode('roadmap')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                questViewMode === 'roadmap'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> 📋 Quick Selector
            </button>
          </div>
        </div>

        {questViewMode === '3d' && (
          <InternshipQuestMap3D
            currentWeek={selectedWeek}
            completedWeeks={internshipStatus.completedWeeks}
            onSelectStation={(weekNum) => setSelectedWeek(weekNum)}
          />
        )}
      </div>

      {/* Week Selector Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {INTERNSHIP_SPRINTS.map(s => {
          const isCompleted = internshipStatus.completedWeeks >= s.week;
          const isSelected = selectedWeek === s.week;
          const score = evaluationResults[s.week]?.totalScore;

          return (
            <button
              key={s.week}
              onClick={() => setSelectedWeek(s.week)}
              className={`p-4 rounded-2xl border text-left transition shadow-md flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-400 ring-2 ring-sky-400/20'
                  : isCompleted
                  ? 'bg-slate-900 border-emerald-500/30 text-slate-200 hover:border-emerald-500/50'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-mono font-bold ${isSelected ? 'text-sky-100' : 'text-sky-400'}`}>
                  WEEK {s.week}
                </span>
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3" /> {score ? `${score}% Marks` : 'VERIFIED'}
                  </span>
                ) : (
                  <span className="text-[10px] opacity-70 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Sprint Active
                  </span>
                )}
              </div>

              <div className="font-extrabold text-xs leading-snug">
                {s.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN 2-PANE WORKSPACE: LEFT WORKSTATION (8 COLS) + RIGHT AI CO-PILOT (4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE: QUESTIONS + WORKSTATION TOOLS (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          {/* AI Manager Question Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Bot className="w-4 h-4" />
                <span>AI Practice Director • Week {currentSprint.week} Sprint Question</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                {currentSprint.category}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-white">
                {currentSprint.title}
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                {currentSprint.problemStatement}
              </p>
            </div>
          </div>

          {/* DYNAMIC INTERACTIVE WORKSTATION TOOLS */}

          {/* 1. SQL Code Editor (Week 1) */}
          {currentSprint.workstationType === 'sql_code' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-sky-400" /> PostgreSQL 16 Query Terminal ({selectedCompany})
                </span>
                <button
                  onClick={handleRunSql}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Play className="w-3.5 h-3.5" /> Execute Query
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                <textarea
                  rows={7}
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  className="w-full p-3 bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {sqlOutput && (
                <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800 font-mono">
                      <tr>
                        <th className="p-2.5">Customer ID</th>
                        <th className="p-2.5">Region</th>
                        <th className="p-2.5">Orders</th>
                        <th className="p-2.5">Total Revenue</th>
                        <th className="p-2.5">Avg Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sqlOutput.map((r, i) => (
                        <tr key={i} className="border-b border-slate-800/50">
                          <td className="p-2.5 font-mono text-sky-400 font-bold">{r.customer_id}</td>
                          <td className="p-2.5">{r.region}</td>
                          <td className="p-2.5 font-mono">{r.total_orders}</td>
                          <td className="p-2.5 font-mono text-emerald-400 font-bold">{r.total_revenue}</td>
                          <td className="p-2.5 font-mono">{r.avg_margin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 2. Interactive Excel Grid (Week 2) */}
          {currentSprint.workstationType === 'excel_grid' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-emerald-400" /> Interactive Financial Spreadsheet Grid
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Live Formula Recalculations</span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800 font-mono">
                    <tr>
                      {excelGrid[0].map((h, i) => (
                        <th key={i} className="p-2.5">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelGrid.slice(1).map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`border-b border-slate-800/50 ${
                          rIdx === excelGrid.length - 2 ? 'bg-slate-900 font-bold text-white' : ''
                        }`}
                      >
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 font-mono">
                            {rIdx === excelGrid.length - 2 ? (
                              <span className={cIdx >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-200'}>{cell}</span>
                            ) : (
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => handleExcelCellChange(rIdx + 1, cIdx, e.target.value)}
                                className="w-full bg-transparent px-1 py-0.5 rounded text-xs text-slate-200 focus:bg-slate-900 focus:outline-none"
                              />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Agile FRD Studio (Week 3) */}
          {currentSprint.workstationType === 'frd_studio' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" /> Agile FRD Specification Studio
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold">1. As a [Actor]:</label>
                    <input
                      type="text"
                      value={userStoryActor}
                      onChange={(e) => setUserStoryActor(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-sky-300 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold">2. I want to [Action]:</label>
                    <input
                      type="text"
                      value={userStoryAction}
                      onChange={(e) => setUserStoryAction(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-emerald-300 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400 font-bold">3. So that [Value]:</label>
                    <input
                      type="text"
                      value={userStoryValue}
                      onChange={(e) => setUserStoryValue(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-purple-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. DCF Valuation Model (Week 4) */}
          {currentSprint.workstationType === 'dcf_calculator' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> DCF Valuation & Sensitivity Studio
                </span>
                <button
                  onClick={handleComputeDcf}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-md"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Compute Valuation
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">WACC Discount Rate (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waccRate}
                    onChange={(e) => setWaccRate(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Terminal Growth Rate (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={terminalGrowth}
                    onChange={(e) => setTerminalGrowth(e.target.value)}
                    className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CANDIDATE ANSWER INPUT FORM */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-400" /> Enter Your Calculated Answers for AI Evaluation:
              </span>
              <span className="text-[11px] text-slate-400">Total Marks: 100 Points</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentSprint.fieldsToAnswer.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-300">{field.label}</label>
                    <span className="text-[10px] text-sky-400 font-mono">{field.weightage} Marks</span>
                  </div>
                  <input
                    type="text"
                    value={userAnswers[`${selectedWeek}_${field.key}`] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Evaluation Engine: <strong className="text-emerald-400">Instant AI Grading & Marks Scoring</strong>
              </div>

              <button
                onClick={handleEvaluateInternshipWork}
                disabled={isEvaluating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI Manager is Grading Your Sprint Work...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4 text-slate-950" />
                    <span>Submit Answers for AI Evaluation & Marks</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI EVALUATION REPORT & MARKS SCORECARD */}
          {currentEvaluation && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/60 space-y-6 shadow-2xl">
              {/* Marks Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex flex-col items-center justify-center font-extrabold">
                    <span className="text-lg leading-none">{currentEvaluation.totalScore}</span>
                    <span className="text-[9px] uppercase tracking-tighter opacity-70">/ 100</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                      Official AI Internship Evaluation Report
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Intern Score: <span className="text-emerald-400">{currentEvaluation.totalScore} / 100 Marks</span> • {currentEvaluation.grade}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs border border-emerald-500/40">
                    +{currentEvaluation.xpAwarded} XP Earned
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/40">
                    Week {selectedWeek} Approved
                  </span>
                </div>
              </div>

              {/* Field-by-Field Breakdown */}
              <div className="space-y-3">
                {currentEvaluation.fieldResults.map((f, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      f.isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {f.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        <span>{f.label}</span>
                      </span>
                      <span className={`font-mono ${f.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {f.marksEarned} / {f.maxMarks} Marks
                      </span>
                    </div>

                    <div className="text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      <div>Your Submitted Answer: <strong className="font-mono text-white">{f.yourAnswer}</strong></div>
                      <div>Expected Ground Truth: <strong className="font-mono text-emerald-400">{f.expectedAnswer}</strong></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs italic text-slate-300">
                {currentEvaluation.managerComments}
              </div>

              {selectedWeek < INTERNSHIP_SPRINTS.length && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedWeek(selectedWeek + 1);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                  >
                    <span>Proceed to Week {selectedWeek + 1} Sprint</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANE: DOCKED AI FORMULA & CODE CO-PILOT (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[750px] shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Formula & Code Co-Pilot</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[10px] text-slate-400">Assisting Week {selectedWeek} Sprint</p>
                </div>
              </div>
            </div>

            <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap gap-1.5 text-[10px]">
              <button
                onClick={() => handleSendChat('What formula or query should I use for this week?')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Calculator className="w-3 h-3 text-emerald-400" /> Suggest Formula
              </button>
              <button
                onClick={() => handleSendChat('Show me the SQL query code for this week')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Terminal className="w-3 h-3 text-sky-400" /> SQL Code
              </button>
              <button
                onClick={() => handleSendChat('Give me a hint for this sprint')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3 text-purple-400" /> Give Hint
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[90%] ${
                      m.sender === 'user'
                        ? 'bg-sky-500 text-white rounded-2xl rounded-tr-sm p-3.5 shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm p-4 space-y-2.5 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold border-b border-slate-800/40 pb-1">
                      <span className={m.sender === 'user' ? 'text-sky-100' : 'text-purple-400'}>
                        {m.sender === 'user' ? 'You' : 'AI Co-Pilot'}
                      </span>
                      <span className="text-slate-400 opacity-60 font-mono">{m.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                    {m.formulaSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
                        <span className="text-emerald-400 text-[10px] font-bold block">Formula / Logic:</span>
                        <code className="text-white block bg-slate-900 p-1.5 rounded">{m.formulaSnippet}</code>
                      </div>
                    )}

                    {m.codeSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-[10px]">
                        <span className="text-sky-400 text-[10px] font-bold block">SQL Code:</span>
                        <pre className="text-emerald-300 bg-slate-900 p-2 rounded overflow-x-auto leading-tight">{m.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat(); }}
                placeholder="Ask Co-Pilot for formulas, queries, syntax..."
                className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={!chatInput.trim()}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl shadow-md transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

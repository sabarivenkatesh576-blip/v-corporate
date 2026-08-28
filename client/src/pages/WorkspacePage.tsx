import React, { useState, useRef, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Code,
  Table,
  BarChart3,
  FileText,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Zap,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Building2,
  DollarSign,
  TrendingUp,
  HelpCircle,
  Check,
  ChevronRight,
  Bot,
  User,
  Sliders,
  Send,
  Mic,
  MicOff,
  Copy,
  Terminal,
  Calculator,
  MessageSquareCode
} from 'lucide-react';

interface QuestionChallenge {
  id: number;
  category: string;
  title: string;
  problemStatement: string;
  dataContext: string;
  defaultTool: 'excel' | 'sql' | 'frd' | 'dcf';
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

export const WorkspacePage: React.FC = () => {
  const { user } = useAuth();
  const { selectedCompany, targetRole, activeProject, completeProjectStep, addBadge } = useCareer();
  const navigate = useNavigate();

  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const [activeToolTab, setActiveToolTab] = useState<'excel' | 'sql' | 'frd' | 'dcf'>('excel');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState<Record<number, EvaluationBreakdown>>({});
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);

  // 1. Live Excel State
  const [excelGrid, setExcelGrid] = useState<string[][]>([
    ['Product Line', 'Quarterly Units', 'Unit Selling Price ($)', 'Unit Direct Cost ($)', 'Revenue ($)', 'Gross Margin ($)', 'Margin %'],
    ['Enterprise SaaS Suite', '1250', '2400', '1320', '3000000', '1350000', '45.0%'],
    ['AI Data Pipeline', '850', '3800', '1900', '3230000', '1615000', '50.0%'],
    ['Cloud Migration Core', '620', '4500', '2925', '2790000', '976500', '35.0%'],
    ['Security Token Gateway', '940', '1800', '990', '1692000', '761400', '45.0%'],
    ['Total Portfolio Summary', '3660', '-', '-', '10712000', '4702900', '43.9%']
  ]);
  const [activeFormulaInput, setActiveFormulaInput] = useState('=SUM(E2:E5)');

  // 2. Live SQL Sandbox State
  const [sqlCode, setSqlCode] = useState(
    `-- Corporate SQL Sprint: High-Value Account Segmentation\nSELECT customer_id, region, SUM(order_amount) AS total_revenue,\n       ROUND(AVG(margin_pct), 2) AS avg_margin\nFROM corporate_transactions\nWHERE transaction_status = 'SETTLED'\nGROUP BY customer_id, region\nHAVING SUM(order_amount) >= 250000 AND AVG(margin_pct) >= 40.0\nORDER BY total_revenue DESC\nLIMIT 5;`
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
  const [isCopilotListening, setIsCopilotListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: `Hello ${user?.fullName?.split(' ')[0] || 'there'}! I am your AI Formula & Code Co-Pilot at ${selectedCompany}. As you work on the questions on the left, I can explain exact Excel formulas, write SQL queries, and review your calculations. Click a prompt below or ask me anything!`,
      formulaSnippet: '=SUM(E2:E5)',
      codeSnippet: `SELECT customer_id, SUM(order_amount) FROM corporate_transactions GROUP BY customer_id HAVING SUM(order_amount) >= 250000;`,
      timestamp: 'Just now'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Corporate Questions Assigned by AI Manager
  const CORPORATE_CHALLENGES: QuestionChallenge[] = [
    {
      id: 0,
      category: 'Financial Modeling & Margin Optimization',
      title: 'Question 1: Product Line Revenue & Margin Variance Diagnosis',
      problemStatement: `The Practice Director at ${selectedCompany} noticed that overall portfolio Gross Margin fell to 43.9%, missing our target of 45.0%. Review the interactive spreadsheet below. Calculate: (1) What is the total combined Gross Margin ($) across all 4 product lines? (2) Which specific product line has the lowest margin percentage? (3) What Excel formula should be used in cell E6 to calculate total Revenue?`,
      dataContext: `Interactive Financial Grid provided with units, selling prices, and direct costs.`,
      defaultTool: 'excel',
      fieldsToAnswer: [
        { key: 'total_margin', label: '1. Total Gross Margin ($)', placeholder: 'e.g. 4702900', expectedAnswer: '4702900', weightage: 35 },
        { key: 'lowest_product', label: '2. Product Line with Lowest Margin %', placeholder: 'e.g. Cloud Migration Core', expectedAnswer: 'Cloud Migration Core', weightage: 35 },
        { key: 'excel_formula', label: '3. Excel Formula for Total Revenue in cell E6', placeholder: 'e.g. =SUM(E2:E5)', expectedAnswer: '=SUM(E2:E5)', weightage: 30 }
      ],
      aiSuggestedFormula: '=SUM(E2:E5) for Total Revenue, and =(Revenue - Direct_Cost) / Revenue for Margin %',
      aiSuggestedCode: `-- SQL Equivalent for Revenue Aggregation:\nSELECT SUM(units_sold * unit_price) AS total_revenue,\n       SUM((unit_price - unit_cost) * units_sold) AS total_gross_margin\nFROM product_sales;`,
      hint: 'Sum the margin column: $1.35M + $1.615M + $976.5k + $761.4k = $4,702,900. Cloud Migration Core has 35.0% margin. Formula is =SUM(E2:E5).',
      idealSolution: 'Total Gross Margin = $4,702,900 | Leaking Product = Cloud Migration Core (35.0%) | Formula = =SUM(E2:E5)',
      idealWorking: 'Summing Gross Margins: $1,350,000 + $1,615,000 + $976,500 + $761,400 = $4,702,900. Cloud Migration Core margin is ($976,500 / $2,790,000) = 35.0%.'
    },
    {
      id: 1,
      category: 'Database SQL Querying & Account Segmentation',
      title: 'Question 2: Enterprise High-Value Account Segmentation',
      problemStatement: `Our client at ${selectedCompany} needs to identify high-performing enterprise clients. Use the SQL editor to query the transactions database. Find accounts with at least $250,000 in revenue and at least 40% margin. Answer: (1) What is the Top Customer ID? (2) What is the Top Customer Revenue ($)? (3) Which SQL clause was used to filter the aggregated group metrics?`,
      dataContext: `PostgreSQL database table 'corporate_transactions' with customer_id, region, order_amount, and margin_pct.`,
      defaultTool: 'sql',
      fieldsToAnswer: [
        { key: 'top_customer', label: '1. Top Customer ID', placeholder: 'e.g. CORP-9021', expectedAnswer: 'CORP-9021', weightage: 35 },
        { key: 'top_revenue', label: '2. Top Customer Revenue ($)', placeholder: 'e.g. 890000', expectedAnswer: '890000', weightage: 35 },
        { key: 'sql_clause', label: '3. SQL Aggregation Filter Clause Used', placeholder: 'e.g. HAVING', expectedAnswer: 'HAVING', weightage: 30 }
      ],
      aiSuggestedFormula: 'In SQL: Use HAVING SUM(order_amount) >= 250000 to filter aggregated sums.',
      aiSuggestedCode: `SELECT customer_id, region, SUM(order_amount) AS total_revenue,\n       ROUND(AVG(margin_pct), 2) AS avg_margin\nFROM corporate_transactions\nWHERE transaction_status = 'SETTLED'\nGROUP BY customer_id, region\nHAVING SUM(order_amount) >= 250000 AND AVG(margin_pct) >= 40.0\nORDER BY total_revenue DESC\nLIMIT 5;`,
      hint: 'Run the SQL query in the terminal. Top record is CORP-9021 with $890,000 revenue. Aggregation filter clause is HAVING.',
      idealSolution: 'Top Customer = CORP-9021 | Revenue = $890,000 | Clause = HAVING',
      idealWorking: 'Query execution returns CORP-9021 in North America with 42 orders totaling $890,000 at 49.5% average margin. The HAVING clause correctly filters group aggregations.'
    },
    {
      id: 2,
      category: 'Business Strategy & Margin Optimization',
      title: 'Question 3: Profit Recovery & Price Optimization Calculation',
      problemStatement: `To recover our target portfolio margin to 46.0%, ${selectedCompany} plans to renegotiate Cloud Migration Core direct costs to $2,475 (saving $450/unit) across all 620 units. Calculate: (1) What will be the new Gross Margin ($) for Cloud Migration Core? (2) What will be its new Margin %? (3) What is the total annual cost savings ($)?`,
      dataContext: `Cloud Migration Core: 620 Units, Price = $4,500, New Cost = $2,475 ($450 savings per unit).`,
      defaultTool: 'excel',
      fieldsToAnswer: [
        { key: 'new_margin_dollar', label: '1. New Cloud Migration Gross Margin ($)', placeholder: 'e.g. 1255500', expectedAnswer: '1255500', weightage: 35 },
        { key: 'new_margin_pct', label: '2. New Margin Percentage (%)', placeholder: 'e.g. 45.0% or 45', expectedAnswer: '45', weightage: 35 },
        { key: 'total_savings', label: '3. Total Annual Cost Savings ($)', placeholder: 'e.g. 279000', expectedAnswer: '279000', weightage: 30 }
      ],
      aiSuggestedFormula: 'New Gross Margin = Units * (Price - New_Cost) = 620 * ($4,500 - $2,475) | Savings = Units * Cost_Reduction',
      aiSuggestedCode: `-- Excel Formula: =620 * (4500 - 2475)\n-- Margin % Formula: =1255500 / (620 * 4500) = 45.0%`,
      hint: 'New Margin = 620 * ($4,500 - $2,475) = $1,255,500. Margin % = 45.0%. Annual savings = 620 * $450 = $279,000.',
      idealSolution: 'New Margin = $1,255,500 | New Margin % = 45.0% | Annual Savings = $279,000',
      idealWorking: 'Cost reduction of $450/unit * 620 units = $279,000 direct addition to Gross Profit. Margin rises from 35.0% to 45.0%.'
    }
  ];

  const currentChallenge = CORPORATE_CHALLENGES[activeChallengeIdx];

  const handleInputChange = (fieldKey: string, val: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [`${activeChallengeIdx}_${fieldKey}`]: val
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
      let replyText = `Here is the corporate guidance for ${currentChallenge.title} at ${selectedCompany}:`;
      let formula: string | undefined;
      let code: string | undefined;

      if (lower.includes('formula') || lower.includes('excel') || lower.includes('margin') || lower.includes('sum')) {
        replyText = `For Question ${activeChallengeIdx + 1}:\n1. To calculate Total Revenue, use the Excel formula '=SUM(E2:E5)' in cell E6.\n2. To calculate Gross Margin $, subtract Total Direct Cost from Revenue: '=(Units * Unit_Price) - (Units * Unit_Cost)'.\n3. To calculate Margin %, use '=Gross_Margin / Total_Revenue' and format as percentage.`;
        formula = activeChallengeIdx === 0 ? '=SUM(E2:E5)' : '=620 * (4500 - 2475)';
      } else if (lower.includes('sql') || lower.includes('query') || lower.includes('having') || lower.includes('group by')) {
        replyText = `In SQL, when you need to filter aggregated calculations (such as total revenue >= $250,000 or average margin >= 40%), you MUST use the 'HAVING' clause after 'GROUP BY', because 'WHERE' only filters raw rows before aggregation!`;
        code = `SELECT customer_id, region, SUM(order_amount) AS total_revenue,\n       ROUND(AVG(margin_pct), 2) AS avg_margin\nFROM corporate_transactions\nGROUP BY customer_id, region\nHAVING SUM(order_amount) >= 250000 AND AVG(margin_pct) >= 40.0\nORDER BY total_revenue DESC;`;
      } else if (lower.includes('hint') || lower.includes('help') || lower.includes('answer')) {
        replyText = `💡 Strategic Hint for ${currentChallenge.title}:\n- Check the parameters in the data grid on the left.\n- ${currentChallenge.hint}`;
        formula = currentChallenge.aiSuggestedFormula;
      } else if (lower.includes('dcf') || lower.includes('valuation') || lower.includes('wacc')) {
        replyText = `In corporate DCF valuation:\n- Enterprise Value = PV of Explicit Forecast Cash Flows + PV of Terminal Value.\n- Terminal Value = [Final Year FCF * (1 + g)] / (WACC - g).\n- Discount factor for Year t = 1 / (1 + WACC)^t.`;
        formula = 'EV = Sum[FCF_t / (1+WACC)^t] + [TV / (1+WACC)^T]';
      } else {
        replyText = `For ${currentChallenge.title}, make sure to verify your math in the interactive workspace tools above. Input your calculated numbers into the answer boxes and click 'Submit Answers for AI Evaluation' when ready!`;
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

  // Insert formula/code into workspace
  const handleApplyFormula = (f: string) => {
    setActiveFormulaInput(f);
    setActiveToolTab('excel');
  };

  const handleApplyCode = (c: string) => {
    setSqlCode(c);
    setActiveToolTab('sql');
  };

  // -------------------------------------------------------------
  // AI OUTPUT EVALUATION & MARKING ENGINE
  // -------------------------------------------------------------
  const handleEvaluateChallenge = () => {
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);

      let totalEarnedMarks = 0;
      let totalMaxMarks = 0;

      const fieldResults = currentChallenge.fieldsToAnswer.map(field => {
        const rawUserVal = (userAnswers[`${activeChallengeIdx}_${field.key}`] || '').trim();
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
            ? `Correct! Matches ${selectedCompany} enterprise ground truth.`
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
        managerComments: `“Candidate completed ${currentChallenge.title} with an accuracy score of ${totalScore}%. ${
          totalScore >= 90
            ? 'Flawless mathematical precision and analytical acumen.'
            : 'Good fundamental understanding with minor numerical variances to review.'
        }” — Dr. Alistair Vance, Practice Director at ${selectedCompany}`
      };

      setEvaluationResults(prev => ({
        ...prev,
        [activeChallengeIdx]: breakdown
      }));

      if (!completedChallenges.includes(activeChallengeIdx)) {
        setCompletedChallenges(prev => [...prev, activeChallengeIdx]);
      }

      completeProjectStep(activeChallengeIdx + 1);

      if (totalScore >= 75) {
        addBadge({
          id: `bdg_ws_ch_${activeChallengeIdx}`,
          title: `${selectedCompany} Challenge ${activeChallengeIdx + 1} Certified (${totalScore}% Marks)`
        });
      }
    }, 1000);
  };

  const currentEvaluation = evaluationResults[activeChallengeIdx];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" /> Interactive Problem Workspace
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Formula & Code Co-Pilot Docked
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Code className="w-7 h-7 text-sky-400" />
            Corporate Project & Internship Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Solve real company questions for <strong className="text-sky-400">{targetRole}</strong> at <strong className="text-white">{selectedCompany}</strong>. Use the live spreadsheet, SQL compiler, and docked AI Formula Co-Pilot to assist your work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/internships')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" /> View Roadmap
          </button>
        </div>
      </div>

      {/* Question Challenge Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CORPORATE_CHALLENGES.map((ch, idx) => {
          const isSelected = activeChallengeIdx === idx;
          const isDone = completedChallenges.includes(idx);
          const score = evaluationResults[idx]?.totalScore;

          return (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChallengeIdx(idx);
                setActiveToolTab(ch.defaultTool);
              }}
              className={`p-4 rounded-2xl border text-left transition shadow-md flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-sky-500 text-white border-sky-400 ring-2 ring-sky-400/20'
                  : isDone
                  ? 'bg-slate-900 border-emerald-500/40 text-slate-200 hover:border-emerald-500/60'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-mono font-bold ${isSelected ? 'text-sky-100' : 'text-sky-400'}`}>
                  QUESTION {idx + 1}
                </span>
                {isDone ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 font-bold text-[10px] border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {score}% Marks
                  </span>
                ) : (
                  <span className="text-[10px] opacity-70">Active Question</span>
                )}
              </div>
              <div className="font-extrabold text-xs leading-snug">
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN 2-PANE WORKSPACE: LEFT WORKSTATION (2/3) + RIGHT AI CO-PILOT (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE: QUESTIONS + WORKSTATION TOOLS (8 COLS) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Question Prompt Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Building2 className="w-4 h-4" />
                <span>{selectedCompany} Problem Order • {currentChallenge.category}</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                100 Marks Sprint
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-extrabold text-white">
                {currentChallenge.title}
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-800">
                {currentChallenge.problemStatement}
              </p>
            </div>
          </div>

          {/* Tool Tabs Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'excel', label: 'Financial Excel Spreadsheet', icon: Table },
              { id: 'sql', label: 'PostgreSQL Code Terminal', icon: Code },
              { id: 'frd', label: 'Agile FRD Builder', icon: FileText },
              { id: 'dcf', label: 'DCF Valuation Model', icon: DollarSign }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveToolTab(t.id as any)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeToolTab === t.id
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* WORKSTATION VIEW 1: EXCEL */}
          {activeToolTab === 'excel' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Interactive Financial Spreadsheet Grid</span>
                    <span className="text-[11px] text-slate-400">Click any cell to edit unit pricing, volumes, or costs.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono font-bold text-slate-400">Formula Bar:</span>
                  <input
                    type="text"
                    value={activeFormulaInput}
                    onChange={(e) => setActiveFormulaInput(e.target.value)}
                    className="bg-transparent text-emerald-400 font-mono text-xs focus:outline-none w-36"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800 font-mono">
                    <tr>
                      {excelGrid[0].map((h, i) => (
                        <th key={i} className="p-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelGrid.slice(1).map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={`border-b border-slate-800/50 ${
                          rIdx === excelGrid.length - 2 ? 'bg-slate-900 font-bold text-white' : 'hover:bg-slate-900/40'
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
                                className="w-full bg-transparent px-2 py-1 rounded text-xs text-slate-200 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
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

          {/* WORKSTATION VIEW 2: SQL */}
          {activeToolTab === 'sql' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-sky-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">PostgreSQL 16 Interactive Terminal</span>
                    <span className="text-[11px] text-slate-400">Database: PROD_CORPORATE_TRANSACTIONS</span>
                  </div>
                </div>

                <button
                  onClick={handleRunSql}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Play className="w-3.5 h-3.5" /> Execute Query
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
                <textarea
                  rows={8}
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  className="w-full p-4 bg-transparent text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed"
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

          {/* WORKSTATION VIEW 3: FRD */}
          {activeToolTab === 'frd' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Agile FRD & Business Rule Specification Studio</span>
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

          {/* WORKSTATION VIEW 4: DCF */}
          {activeToolTab === 'dcf' && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>DCF Valuation & Sensitivity Calculator</span>
                </div>
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
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold">Terminal Growth Rate (%):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={terminalGrowth}
                    onChange={(e) => setTerminalGrowth(e.target.value)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CANDIDATE ANSWER SUBMISSION FORM */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-4 h-4 text-sky-400" /> Enter Your Answers for AI Evaluation:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">100 Total Marks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentChallenge.fieldsToAnswer.map(field => (
                <div key={field.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-300">{field.label}</label>
                    <span className="text-[10px] text-sky-400 font-mono">{field.weightage} Marks</span>
                  </div>
                  <input
                    type="text"
                    value={userAnswers[`${activeChallengeIdx}_${field.key}`] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Evaluation: <strong className="text-emerald-400">Instant AI Grading & Marks Scoring</strong>
              </div>

              <button
                onClick={handleEvaluateChallenge}
                disabled={isEvaluating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Grading Your Deliverables...</span>
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

          {/* AI EVALUATION SCORECARD */}
          {currentEvaluation && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/60 space-y-6 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex flex-col items-center justify-center font-extrabold">
                    <span className="text-lg leading-none">{currentEvaluation.totalScore}</span>
                    <span className="text-[9px] uppercase tracking-tighter opacity-70">/ 100</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                      AI Evaluation Result
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      Score: <span className="text-emerald-400">{currentEvaluation.totalScore} / 100 Marks</span> • {currentEvaluation.grade}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs border border-emerald-500/40">
                    +{currentEvaluation.xpAwarded} XP Earned
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {currentEvaluation.fieldResults.map((f, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      f.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        {f.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                        <span>{f.label}</span>
                      </span>
                      <span className="font-mono">{f.marksEarned} / {f.maxMarks} Marks</span>
                    </div>
                    <div className="text-[11px] grid grid-cols-2 gap-2 pt-0.5">
                      <div>Your Answer: <strong className="font-mono text-white">{f.yourAnswer}</strong></div>
                      <div>Expected: <strong className="font-mono text-emerald-400">{f.expectedAnswer}</strong></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs italic text-slate-300">
                {currentEvaluation.managerComments}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE: DOCKED AI FORMULA & CODE CO-PILOT (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[750px] shadow-2xl overflow-hidden">
            {/* Co-Pilot Header */}
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
                  <p className="text-[10px] text-slate-400">Assisting {targetRole} ({selectedCompany})</p>
                </div>
              </div>
            </div>

            {/* Quick Prompt Buttons */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap gap-1.5 text-[10px]">
              <button
                onClick={() => handleSendChat('What Excel formula should I use for this question?')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Calculator className="w-3 h-3 text-emerald-400" /> Suggest Formula
              </button>
              <button
                onClick={() => handleSendChat('Show me the SQL query syntax for this question')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Terminal className="w-3 h-3 text-sky-400" /> SQL Syntax
              </button>
              <button
                onClick={() => handleSendChat('Give me a hint for this question')}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                <Sparkles className="w-3 h-3 text-purple-400" /> Give Hint
              </button>
            </div>

            {/* Chat Messages Stream */}
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

                    {/* Formula Snippet with 1-Click Inserter */}
                    {m.formulaSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between text-emerald-400 text-[10px] font-bold">
                          <span>Excel Formula:</span>
                          <button
                            onClick={() => handleApplyFormula(m.formulaSnippet!)}
                            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[9px] font-sans flex items-center gap-1"
                          >
                            <Copy className="w-2.5 h-2.5" /> Insert into Sheet
                          </button>
                        </div>
                        <code className="text-white block bg-slate-900 p-1.5 rounded">{m.formulaSnippet}</code>
                      </div>
                    )}

                    {/* Code Snippet with 1-Click Inserter */}
                    {m.codeSnippet && (
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[10px]">
                        <div className="flex items-center justify-between text-sky-400 text-[10px] font-bold">
                          <span>SQL Query Template:</span>
                          <button
                            onClick={() => handleApplyCode(m.codeSnippet!)}
                            className="px-2 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[9px] font-sans flex items-center gap-1"
                          >
                            <Play className="w-2.5 h-2.5" /> Insert into Terminal
                          </button>
                        </div>
                        <pre className="text-emerald-300 bg-slate-900 p-2 rounded overflow-x-auto leading-tight">{m.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
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

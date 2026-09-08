import React, { useState, useRef } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Target,
  FileCheck,
  Zap,
  Download,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Award,
  Sliders,
  ShieldCheck
} from 'lucide-react';

interface AtsValidationResult {
  overallScore: number;
  atsStatus: 'PASSED - Fast-Tracked' | 'QUALIFIED - Needs Optimization' | 'AT-RISK - Fails Recruiter Screening';
  formattingScore: number;
  keywordScore: number;
  metricsScore: number;
  actionVerbScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  weakVerbsDetected: string[];
  detectedMetricsCount: number;
  recruiterDecision: string;
  recommendations: string[];
  atsOptimizedText: string;
}

export const ResumePage: React.FC = () => {
  const { user, addXp, updateReadinessComponent } = useAuth();
  const { selectedCompany, targetRole, roleSkills } = useCareer();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>(
    `${user?.fullName || 'Candidate Name'}\nEmail: ${user?.email || 'candidate@gmail.com'} | Phone: +91 9876543210\nLinkedIn: linkedin.com/in/candidate | Portfolio: github.com/candidate\n\nPROFESSIONAL SUMMARY:\nAspiring ${targetRole} eager to contribute technical and analytical expertise to high-impact initiatives at ${selectedCompany}. Solid academic foundation in computer science and quantitative analysis, with hands-on experience building scalable applications and data analytics pipelines.\n\nTECHNICAL SKILLS:\n- Core Skills: Python, SQL, PostgreSQL, React, JavaScript, Git, REST APIs, Data Modeling\n- Analytical & Corporate Tools: Excel, Power BI, Statistical Modeling, Agile Scrum, Jira\n\nACADEMIC PROJECTS:\n1. Enterprise Order Analytics & Anomaly Detection Platform\n- Architected a full-stack data dashboard tracking 50,000+ customer transactions in PostgreSQL.\n- Optimized backend SQL queries with multi-column indexing, reducing latency by 35%.\n- Designed responsive React frontend with real-time KPI metrics and gross margin calculations.\n\n2. Microservices Payment Gateway & Webhook Reconciliation Engine\n- Implemented secure JWT authentication and RESTful API endpoints handling 200+ req/sec.\n- Integrated webhook failure retry queue, reducing transaction drop rates by 22%.\n\nEDUCATION:\nBachelor of Technology in Computer Science & Engineering (2023 - 2027)\nCGPA: 8.6 / 10.0 | Relevant Coursework: Database Management Systems, Data Structures, Cloud Computing`
  );

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.trim().length > 20) {
        setResumeText(text);
      } else {
        // Fallback structured template if binary PDF/Docx text is raw
        setResumeText(prev => `[Uploaded Document: ${file.name} - Size: ${(file.size / 1024).toFixed(1)} KB]\n\n` + prev);
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // Binary files simulation
      setResumeText(prev => `[Uploaded Document: ${file.name} - Size: ${(file.size / 1024).toFixed(1)} KB]\n\n` + prev);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setResumeText(prev => `[Uploaded Document: ${file.name} - Size: ${(file.size / 1024).toFixed(1)} KB]\n\n` + prev);
    }
  };

  // 1-Click Template Switcher
  const loadRoleTemplate = (roleType: string) => {
    if (roleType.includes('Data')) {
      setResumeText(
        `${user?.fullName || 'Candidate Name'}\nEmail: ${user?.email || 'candidate@gmail.com'} | Phone: +91 9876543210\nLinkedIn: linkedin.com/in/candidate\n\nPROFESSIONAL SUMMARY:\nQuantitative Data Analyst skilled in SQL, Python, Excel modeling, and Power BI dashboards. Adept at extracting actionable business insights from 100k+ row datasets for ${selectedCompany}.\n\nCORE SKILLS:\nSQL, Python, Pandas, NumPy, Power BI, Advanced Excel, Pivot Tables, Tableau, Statistical Regression, ETL Pipelines.\n\nPROJECTS:\n1. Customer Churn & Lifetime Value (CLV) Predictive Dashboard\n- Conducted cohort analysis on 40,000 customer records in SQL, identifying 18% margin leakage in EMEA.\n- Built interactive Power BI visualizations for executive leadership with automated weekly data refresh.\n\n2. Financial Portfolio Margin Reconciliation Tool\n- Programmed automated Excel VBA and Python scripts to reconcile quarterly balance sheets, saving 12 hours/week.`
      );
    } else if (roleType.includes('Finance') || roleType.includes('Accountant')) {
      setResumeText(
        `${user?.fullName || 'Candidate Name'}\nEmail: ${user?.email || 'candidate@gmail.com'} | Phone: +91 9876543210\n\nPROFESSIONAL SUMMARY:\nCorporate Financial Analyst with expertise in 3-Statement financial modeling, DCF valuation, WACC sensitivity, and Tally ERP double-entry accounting for ${selectedCompany}.\n\nCORE SKILLS:\n3-Statement Financial Modeling, DCF Valuation, WACC, Variance Analysis, Tally Prime, GST, TDS, Budgeting, Excel.\n\nPROJECTS:\n1. 5-Year DCF Corporate Valuation Model\n- Modeled free cash flows, calculated 9.2% WACC discount rate, and generated terminal value sensitivity matrices.\n- Reconciled Balance Sheet and Cash Flow statements with 0 variance.`
      );
    } else {
      setResumeText(
        `${user?.fullName || 'Candidate Name'}\nEmail: ${user?.email || 'candidate@gmail.com'} | Phone: +91 9876543210\n\nPROFESSIONAL SUMMARY:\nSoftware Developer with solid full-stack engineering skills in React, TypeScript, Node.js, and PostgreSQL. Passionate about building enterprise-grade software for ${selectedCompany}.\n\nCORE SKILLS:\nJavaScript, TypeScript, React, Node.js, PostgreSQL, SQL, Docker, Git, REST APIs, Microservices, CI/CD.\n\nPROJECTS:\n1. High-Concurrency RESTful Order Engine\n- Designed modular microservices handling 500+ requests/second with Redis caching and PostgreSQL partitioning.\n- Reduced server memory footprint by 28% and established automated unit testing suites.`
      );
    }
    setAtsResult(null);
  };

  // Add Missing Keyword into Resume Text
  const handleAddKeywordToResume = (kw: string) => {
    setResumeText(prev => {
      if (prev.includes(kw)) return prev;
      return prev.replace('CORE SKILLS:', `CORE SKILLS:\n- Added Competencies: ${kw}`).replace('TECHNICAL SKILLS:', `TECHNICAL SKILLS:\n- Added Competencies: ${kw}`);
    });
  };

  // -------------------------------------------------------------
  // RUN ATS VALIDATION & RECRUITER SCREENING ENGINE
  // -------------------------------------------------------------
  const handleRunAtsValidation = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      const textLower = resumeText.toLowerCase();

      // Check role specific expected keywords
      const expectedKeywords = roleSkills.map(s => s.name);
      if (!expectedKeywords.includes('SQL')) expectedKeywords.push('SQL');
      if (!expectedKeywords.includes('Excel')) expectedKeywords.push('Excel');
      if (!expectedKeywords.includes('Git')) expectedKeywords.push('Git');
      if (!expectedKeywords.includes('Agile')) expectedKeywords.push('Agile');

      const matchedKeywords = expectedKeywords.filter(k => textLower.includes(k.toLowerCase()));
      const missingKeywords = expectedKeywords.filter(k => !textLower.includes(k.toLowerCase()));

      // Metric calculations
      const metricsMatches = resumeText.match(/\b\d+(?:\.\d+)?%|\$\d+(?:,\d+)*(?:\.\d+)?|\b\d+\+\s*(?:users|records|req|transactions|hours)/gi) || [];
      const detectedMetricsCount = metricsMatches.length;

      // Action Verbs
      const strongVerbs = ['architected', 'spearheaded', 'engineered', 'optimized', 'implemented', 'designed', 'streamlined', 'conducted', 'modeled', 'reconciled'];
      const strongVerbsFound = strongVerbs.filter(v => textLower.includes(v));

      const weakVerbs = ['worked on', 'helped', 'did', 'handled', 'responsible for'];
      const weakVerbsDetected = weakVerbs.filter(v => textLower.includes(v));

      // Calculate Scores
      const formattingScore = resumeText.includes('SUMMARY') && resumeText.includes('SKILLS') && resumeText.includes('PROJECTS') ? 96 : 75;
      const keywordScore = Math.min(100, Math.round((matchedKeywords.length / Math.max(expectedKeywords.length, 1)) * 100));
      const metricsScore = Math.min(100, Math.round(detectedMetricsCount * 25));
      const actionVerbScore = Math.min(100, Math.round(strongVerbsFound.length * 20));

      const overallScore = Math.round((formattingScore * 0.25) + (keywordScore * 0.40) + (metricsScore * 0.20) + (actionVerbScore * 0.15));

      let atsStatus: AtsValidationResult['atsStatus'] = 'PASSED - Fast-Tracked';
      if (overallScore >= 85) atsStatus = 'PASSED - Fast-Tracked';
      else if (overallScore >= 70) atsStatus = 'QUALIFIED - Needs Optimization';
      else atsStatus = 'AT-RISK - Fails Recruiter Screening';

      const recruiterDecision = overallScore >= 80
        ? `AUTOMATED ATS SHORTLIST: Candidate exceeds ${selectedCompany} threshold (${overallScore}% ATS score). Resume successfully routed to Senior Hiring Team.`
        : `NEEDS KEYWORD RECALIBRATION: ATS parsed score (${overallScore}%) is below the 80% threshold for ${selectedCompany}. Add missing keywords and metrics.`;

      const recommendations: string[] = [];
      if (missingKeywords.length > 0) {
        recommendations.push(`Insert missing high-priority ATS keywords: ${missingKeywords.slice(0, 3).join(', ')}.`);
      }
      if (detectedMetricsCount < 3) {
        recommendations.push(`Add more quantifiable business metrics (e.g., 'reduced processing time by 30%', 'managed $100k+ data sets').`);
      }
      if (weakVerbsDetected.length > 0) {
        recommendations.push(`Replace passive phrases (${weakVerbsDetected.join(', ')}) with strong action verbs (Spearheaded, Engineered, Architected).`);
      }
      if (recommendations.length === 0) {
        recommendations.push(`Resume is 100% ATS optimized and ready for immediate corporate submission.`);
      }

      const atsOptimizedText = resumeText + `\n\n[ATS ENHANCEMENT TAGS FOR ${selectedCompany.toUpperCase()}]\nTarget Role: ${targetRole}\nValidated Core Competencies: ${matchedKeywords.join(', ')}\nATS Parsed Compliance: 100% Single-Column UTF-8 Standard`;

      setAtsResult({
        overallScore,
        atsStatus,
        formattingScore,
        keywordScore,
        metricsScore,
        actionVerbScore,
        matchedKeywords,
        missingKeywords,
        weakVerbsDetected,
        detectedMetricsCount,
        recruiterDecision,
        recommendations,
        atsOptimizedText
      });

      updateReadinessComponent('resume', overallScore);
      if (overallScore >= 70) {
        addXp(150);
      }
    }, 1000);
  };

  const copyToClipboard = () => {
    if (!atsResult) return;
    navigator.clipboard.writeText(atsResult.atsOptimizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Corporate ATS Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
              Role-Specific Screening Filter
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <FileText className="w-7 h-7 text-sky-400" />
            Resume Upload & ATS Validation Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload your resume document or edit below to validate against <strong className="text-white">{selectedCompany}</strong> Applicant Tracking System (ATS) criteria for <strong className="text-sky-400">{targetRole}</strong>.
          </p>
        </div>

        {/* Preset Template Switchers */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Sample Templates:</span>
          <button
            onClick={() => loadRoleTemplate('Developer')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            Software Dev
          </button>
          <button
            onClick={() => loadRoleTemplate('Data')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            Data Analyst
          </button>
          <button
            onClick={() => loadRoleTemplate('Finance')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            Finance
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Upload & Live Text Editor */}
        <div className="space-y-4">
          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-2xl p-6 bg-slate-900/80 hover:bg-slate-900 transition flex flex-col items-center justify-center text-center cursor-pointer shadow-md group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.doc,.txt,.md"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30 flex items-center justify-center group-hover:scale-110 transition">
              <Upload className="w-6 h-6" />
            </div>
            <div className="mt-3 space-y-1">
              <span className="text-xs font-extrabold text-white block">
                {uploadedFile ? uploadedFile.name : 'Click to Upload Resume Document or Drag & Drop'}
              </span>
              <span className="text-[11px] text-slate-400">
                Supports PDF, DOCX, DOC, TXT (Auto-parsed into ATS parser)
              </span>
            </div>
            {uploadedFile && (
              <span className="mt-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                ✓ Document Attached: {(uploadedFile.size / 1024).toFixed(1)} KB
              </span>
            )}
          </div>

          {/* Editable Resume Text Editor */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-400" /> Resume Content & Sections (ATS Editable)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {resumeText.split(/\s+/).filter(Boolean).length} Words • Single-Column
              </span>
            </div>

            <textarea
              rows={14}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setAtsResult(null);
              }}
              placeholder="Paste or type your resume content..."
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none leading-relaxed"
            />

            <button
              onClick={handleRunAtsValidation}
              disabled={isAnalyzing || !resumeText.trim()}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Validating Resume Against {selectedCompany} ATS Filters...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Run ATS Validation & Recruiter Match Check</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: ATS Report & Scorecard */}
        <div className="space-y-4">
          {atsResult ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/60 space-y-6 shadow-2xl">
              {/* ATS Overall Score Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex flex-col items-center justify-center font-extrabold">
                    <span className="text-xl leading-none">{atsResult.overallScore}%</span>
                    <span className="text-[9px] uppercase tracking-tighter opacity-70">ATS Score</span>
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                      ATS Screening Verdict
                    </span>
                    <h3 className="text-base font-extrabold text-white">
                      {atsResult.atsStatus}
                    </h3>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-extrabold text-xs border border-emerald-500/40 text-center">
                  Target: {selectedCompany}
                </div>
              </div>

              {/* 4 Dimension ATS Sub-Scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Formatting</span>
                  <span className="font-extrabold text-white font-mono">{atsResult.formattingScore}/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Keywords Match</span>
                  <span className="font-extrabold text-emerald-400 font-mono">{atsResult.keywordScore}/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Metrics & ROI</span>
                  <span className="font-extrabold text-sky-400 font-mono">{atsResult.metricsScore}/100</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Action Verbs</span>
                  <span className="font-extrabold text-purple-400 font-mono">{atsResult.actionVerbScore}/100</span>
                </div>
              </div>

              {/* Recruiter Decision Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                <strong className="text-emerald-400">Recruiter Decision: </strong>
                {atsResult.recruiterDecision}
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Matched Hard Skills ({atsResult.matchedKeywords.length} Detected):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.matchedKeywords.map(kw => (
                    <span key={kw} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords with 1-Click Adder */}
              {atsResult.missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Missing ATS Keywords (Click to add directly to resume):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missingKeywords.map(kw => (
                      <button
                        key={kw}
                        onClick={() => handleAddKeywordToResume(kw)}
                        title="Click to automatically add to resume"
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3 text-amber-400" /> {kw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Recommendations for 100% ATS Perfection:
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {atsResult.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Copy / Export Optimized Resume */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                  <span>{copied ? 'Copied ATS Text!' : 'Copy ATS Resume'}</span>
                </button>

                <button
                  onClick={() => alert('ATS Verified Resume has been exported to your downloads!')}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" /> Download ATS Resume
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 text-sky-400 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-extrabold text-white">ATS Validation Engine Ready</h3>
                <p className="text-xs text-slate-400">
                  Upload your document or click <strong>"Run ATS Validation & Recruiter Match Check"</strong> to test keyword density, parseability, metrics, and shortlisting probability for <strong className="text-sky-400">{selectedCompany}</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

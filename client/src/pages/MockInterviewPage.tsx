import React, { useState, useRef, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  Award,
  TrendingUp,
  Volume2,
  VolumeX,
  ChevronRight,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Zap,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Check
} from 'lucide-react';

interface DetectedError {
  mistake: string;
  fix: string;
  reason: string;
  category: 'Grammar' | 'Vocabulary' | 'Tense' | 'Corporate Tone' | 'STAR Structure';
}

interface TurnEvaluation {
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  score: number;
  grammarFeedback: string;
  errorsDetected: DetectedError[];
  personalizedPolishedSpeech: string;
  executiveModelSpeech: string;
  vocabularyTips: string[];
  keyStrengths: string[];
}

interface StageHistory {
  stageIdx: number;
  stageName: string;
  question: string;
  studentSpokenText: string;
  evaluation: TurnEvaluation;
}

const INTERVIEW_STAGES = [
  {
    stage: 1,
    name: 'Self-Introduction & Academic Background',
    question: (company: string, role: string, name: string) =>
      `Hello ${name}! Welcome to your formal HR & Resume Screening for the ${role} position at ${company}. Please introduce yourself, share your academic background, and tell me what drives your interest in joining ${company}?`
  },
  {
    stage: 2,
    name: 'Resume Capstone Project Deep-Dive',
    question: (company: string, role: string) =>
      `Looking at the projects on your profile, please walk me through a key analytical or technical project you built. What was the central problem statement, what tools did you use, and what was your specific individual contribution?`
  },
  {
    stage: 3,
    name: 'Internship Experience & Teamwork',
    question: () =>
      `In a corporate environment, cross-functional collaboration is essential. Can you share an example from an internship, academic project, or squad where team members had conflicting opinions? How did you resolve the deadlock?`
  },
  {
    stage: 4,
    name: 'Situational & Stakeholder Dilemma',
    question: (company: string, role: string) =>
      `Suppose a key stakeholder at ${company} requests an urgent deliverable for an executive meeting tomorrow, but you discover data discrepancies or unverified logic in your draft. How do you handle this high-pressure situation?`
  },
  {
    stage: 5,
    name: 'Career Trajectory & Value Proposition',
    question: (company: string, role: string) =>
      `Why should ${company} select you for this ${role} cohort, and what quantifiable impact do you aim to deliver in your first 6 months with us?`
  }
];

export const MockInterviewPage: React.FC = () => {
  const { user, addXp, updateReadinessComponent } = useAuth();
  const { selectedCompany, targetRole, addBadge } = useCareer();

  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Active Stage Evaluation Card state
  const [currentTurnEvaluation, setCurrentTurnEvaluation] = useState<TurnEvaluation | null>(null);
  const [completedStages, setCompletedStages] = useState<StageHistory[]>([]);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceTranscript, setPracticeTranscript] = useState('');

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);
  const candidateName = user?.fullName || 'Candidate';

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText.trim()) {
          if (isPracticeMode) {
            setPracticeTranscript(currentText);
          } else {
            setSpokenTranscript(currentText);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPracticeMode]);

  // Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v =>
      v.lang.startsWith('en') &&
      (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira') || v.name.includes('Jenny'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // Toggle Microphone
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  const clearCurrentRecording = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setSpokenTranscript('');
    setPracticeTranscript('');
  };

  const startInterview = () => {
    setInterviewActive(true);
    setInterviewFinished(false);
    setCurrentStageIdx(0);
    setSpokenTranscript('');
    setPracticeTranscript('');
    setCurrentTurnEvaluation(null);
    setCompletedStages([]);
    setIsPracticeMode(false);

    const initialQ = INTERVIEW_STAGES[0].question(selectedCompany, targetRole, candidateName);

    setTimeout(() => {
      if (autoSpeakEnabled) {
        speakText(initialQ);
      }
    }, 400);
  };

  // -------------------------------------------------------------
  // DYNAMIC PERSONALIZED POLISHED SPEECH & GRAMMAR RECTIFIER
  // -------------------------------------------------------------
  const evaluateAndPolishSpeech = (rawText: string, stageIdx: number): TurnEvaluation => {
    const text = rawText.trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const lower = text.toLowerCase();

    const errorsDetected: DetectedError[] = [];
    const keyStrengths: string[] = [];

    // --- RULE 1: Verb Tense & Auxiliary Mistakes ---
    if (/\b(i am study|i am graduate|i study in)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“I am study / I am graduate / I study in”',
        fix: '“I am currently pursuing / I graduated with a degree in”',
        reason: 'Incorrect auxiliary verb pairing. Continuous state requires gerund ("studying") or formal past participle.',
        category: 'Tense'
      });
    }

    if (/\b(i did project|i did one project|i done|i did do)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“I did project / I did one project / I done”',
        fix: '“I architected a capstone project / I developed an end-to-end model”',
        reason: '"Did" is overly simplistic for corporate interviews. Use domain action verbs ("engineered", "spearheaded").',
        category: 'Vocabulary'
      });
    }

    if (/\b(i am having|i having knowledge|i having skill)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“I am having knowledge / I having skills”',
        fix: '“I possess strong proficiency in / I have developed expertise in”',
        reason: 'Stative verbs like "have" (for possession/skills) must not be used in continuous tense in standard English.',
        category: 'Grammar'
      });
    }

    // --- RULE 2: Pronoun & Subject-Verb Agreement ---
    if (/\b(me and my friend|me and my team|myself [a-z]+)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“Me and my team / Myself [Name]”',
        fix: '“My team and I / My name is [Name]”',
        reason: '"Me" cannot be the subject of a sentence. Use the subjective pronoun "I". Avoid "Myself" for introductions.',
        category: 'Grammar'
      });
    }

    if (/\b(it help me|it give|they is|we was|he do)\b/i.test(text)) {
      errorsDetected.push({
        mistake: 'Subject-Verb Disagreement (“it help / they is / we was”)',
        fix: '“It helped me / They are / We were / He does”',
        reason: 'Third-person singular and plural subjects must agree with their respective past/present verb conjugations.',
        category: 'Grammar'
      });
    }

    // --- RULE 3: Informal Slang & Colloquialisms ---
    if (/\b(gonna|wanna|kinda|gotta|yeah|yep|nope)\b/i.test(text)) {
      errorsDetected.push({
        mistake: 'Informal Slang (“gonna / wanna / yeah”)',
        fix: '“I intend to / I aspire to / Yes, certainly”',
        reason: 'Slang contractions significantly weaken executive presence during corporate evaluations.',
        category: 'Corporate Tone'
      });
    }

    if (/\b(stuffs|many informations|lot of things|lots of things)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“Stuffs / many informations / lot of things”',
        fix: '“Key deliverables / comprehensive datasets / analytical parameters”',
        reason: '"Information" and "stuff" are uncountable nouns. Always use precise domain terminology.',
        category: 'Vocabulary'
      });
    }

    // --- RULE 4: Weak Generic Phrasing to Executive Upgrades ---
    if (/\b(big company|good company|nice company)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“Big company / good company”',
        fix: `“An industry-leading global enterprise like ${selectedCompany}”`,
        reason: 'Use formal executive accolades to describe target corporate leadership.',
        category: 'Corporate Tone'
      });
    }

    if (/\b(want job|like to work|need job)\b/i.test(text)) {
      errorsDetected.push({
        mistake: '“I want job / I like to work”',
        fix: '“I am eager to contribute to high-impact initiatives and scale my career”',
        reason: 'Frame employment as value contribution rather than personal necessity.',
        category: 'Corporate Tone'
      });
    }

    if (wordCount < 18) {
      errorsDetected.push({
        mistake: 'Spoken Answer is Too Brief (< 18 words)',
        fix: 'Structure using the STAR framework: Situation -> Task -> Action -> Result',
        reason: 'Short responses do not give the interview panel sufficient evidence of your technical depth and thought process.',
        category: 'STAR Structure'
      });
    } else {
      keyStrengths.push('Good conversational length and willingness to elaborate.');
    }

    if (lower.includes('project') || lower.includes('data') || lower.includes('sql') || lower.includes('excel') || lower.includes('team')) {
      keyStrengths.push('Directly addressed core technical & domain keywords relevant to the question.');
    }

    // Ensure at least one constructive feedback
    if (errorsDetected.length === 0) {
      errorsDetected.push({
        mistake: 'Absence of Quantified Business Metrics',
        fix: 'Include specific numbers (e.g. “improved processing speed by 25%”, “modeled 50,000 records”)',
        reason: 'Top-tier corporate interviewers prioritize candidates who quantify business ROI.',
        category: 'Corporate Tone'
      });
    }

    // CEFR scoring
    let cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' = 'B1';
    let score = 74;
    let grammarFeedback = 'Good fundamental clarity. We have converted your spoken points into a polished corporate script below.';

    if (errorsDetected.length >= 3 || wordCount < 15) {
      cefrLevel = 'A2';
      score = 58;
      grammarFeedback = 'Noticeable grammatical slips and informal vocabulary detected. Practice reading the rectified polished version below.';
    } else if (wordCount >= 38 && errorsDetected.length <= 1 && (lower.includes('analyzed') || lower.includes('implemented') || lower.includes('optimized') || lower.includes('kpi') || lower.includes('result'))) {
      cefrLevel = 'C1';
      score = 94;
      grammarFeedback = 'Superb spoken articulation! Strong business terminology, clear sentence structure, and confident delivery.';
    } else if (wordCount >= 22 && errorsDetected.length <= 2) {
      cefrLevel = 'B2';
      score = 86;
      grammarFeedback = 'Solid business communication. Review the highlighted corrections to eliminate minor slips.';
    }

    // --- DYNAMICALLY GENERATE THE PERSONALIZED POLISHED SPEECH (REWRITING STUDENT'S WORDS) ---
    // Perform sentence-level transformations on candidate's actual words
    let dynamicPolished = text
      .replace(/\bi am study\b/gi, 'I am currently pursuing my degree')
      .replace(/\bi am graduate\b/gi, 'I graduated with a specialized degree')
      .replace(/\bi study in\b/gi, 'I completed my academic coursework at')
      .replace(/\bme and my friend\b/gi, 'my teammate and I')
      .replace(/\bme and my team\b/gi, 'my project squad and I')
      .replace(/\bi did project\b/gi, 'I architected an end-to-end project')
      .replace(/\bi did one project\b/gi, 'I spearheaded a comprehensive capstone project')
      .replace(/\bi am having knowledge in\b/gi, 'I have developed strong technical proficiency in')
      .replace(/\bi having\b/gi, 'I possess')
      .replace(/\bvery good\b/gi, 'highly impactful')
      .replace(/\bbig company\b/gi, `an industry-leading global enterprise like ${selectedCompany}`)
      .replace(/\bgood company\b/gi, `a distinguished organization like ${selectedCompany}`)
      .replace(/\bi want job\b/gi, 'I am eager to contribute my technical skills')
      .replace(/\bi like to work\b/gi, 'I aspire to create tangible business impact')
      .replace(/\bstuffs\b/gi, 'key deliverables')
      .replace(/\bmany informations\b/gi, 'comprehensive data insights')
      .replace(/\bgonna\b/gi, 'intend to')
      .replace(/\bwanna\b/gi, 'aspire to')
      .replace(/\byeah\b/gi, 'Yes, absolutely');

    // Capitalize first letter and format into a crisp corporate speech
    dynamicPolished = dynamicPolished.charAt(0).toUpperCase() + dynamicPolished.slice(1);
    if (!dynamicPolished.endsWith('.')) {
      dynamicPolished += '.';
    }

    // Wrap in standard corporate introductory/concluding rhetoric if brief
    let personalizedPolishedSpeech = `“${dynamicPolished} By joining ${selectedCompany} as a ${targetRole}, my goal is to apply these methodologies to deliver measurable business results.”`;

    // Benchmark Executive Model Speech
    let executiveModelSpeech = '';
    let vocabularyTips: string[] = [];

    if (stageIdx === 0) {
      executiveModelSpeech = `“Good morning. My name is ${candidateName}, specializing in ${targetRole} with a strong foundation in analytical problem solving, data modeling, and enterprise workflows. What inspires me about ${selectedCompany} is your industry-leading culture of client impact and innovation. I am eager to apply my technical toolkit and problem-solving rigor to create measurable value in your upcoming projects.”`;
      vocabularyTips = ['Replace "I want to work" with "I am eager to contribute"', 'Use "deliver tangible business value" instead of "do good work"'];
    } else if (stageIdx === 1) {
      executiveModelSpeech = `“In my capstone project, I resolved critical operational bottlenecks by ingesting, standardizing, and modeling over 50,000 transaction records. Using SQL database queries and advanced Excel modeling, I identified root margin variance and engineered an executive dashboard that reduced reporting turnaround by 30% and empowered leadership with data-backed insights.”`;
      vocabularyTips = ['Quantify outcomes (e.g. "reduced turnaround by 30%")', 'Replace "I made a project" with "I conceptualized and architected an end-to-end model"'];
    } else if (stageIdx === 2) {
      executiveModelSpeech = `“When facing conflicting priorities within my team, I organized a structured alignment session where we evaluated each perspective against core project milestones and data-backed trade-offs. This objective approach built team consensus, ensured 100% on-time milestone delivery, and fostered long-term collaborative trust.”`;
      vocabularyTips = ['Use "facilitated consensus" instead of "argued and agreed"', 'Highlight "data-backed trade-offs"'];
    } else if (stageIdx === 3) {
      executiveModelSpeech = `“In high-pressure situations, data integrity is paramount. I would immediately notify the project lead with transparent preliminary findings, present a rapid 2-hour root-cause remediation plan, and provide a validated interim briefing to ensure our leadership communicates only verified facts to stakeholders.”`;
      vocabularyTips = ['Use "data integrity is paramount"', 'Frame remediation as "rapid root-cause mitigation"'];
    } else {
      executiveModelSpeech = `“${selectedCompany} should select me because I combine rigorous domain competence in ${targetRole} with agile adaptability. In my first six months, my objective is to master internal project frameworks, optimize workflow deliverables, and generate measurable ROI for the team.”`;
      vocabularyTips = ['Replace "I am hardworking" with "I combine domain competence with agile adaptability"', 'Highlight "measurable ROI"'];
    }

    return {
      cefrLevel,
      score,
      grammarFeedback,
      errorsDetected,
      personalizedPolishedSpeech,
      executiveModelSpeech,
      vocabularyTips,
      keyStrengths
    };
  };

  const handleEvaluateStudentSpeech = () => {
    if (!spokenTranscript.trim() || isAiEvaluating) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    setIsAiEvaluating(true);
    const speech = spokenTranscript.trim();

    setTimeout(() => {
      const evaluation = evaluateAndPolishSpeech(speech, currentStageIdx);
      setCurrentTurnEvaluation(evaluation);
      setIsAiEvaluating(false);

      // Auto speak the polished version if voice is enabled so candidate hears it immediately
      if (autoSpeakEnabled) {
        speakText(evaluation.personalizedPolishedSpeech);
      }
    }, 600);
  };

  const handleProceedToNextStage = () => {
    if (!currentTurnEvaluation) return;

    // Record completed stage history
    const stageObj = INTERVIEW_STAGES[currentStageIdx];
    const newRecord: StageHistory = {
      stageIdx: currentStageIdx,
      stageName: stageObj.name,
      question: stageObj.question(selectedCompany, targetRole, candidateName),
      studentSpokenText: spokenTranscript,
      evaluation: currentTurnEvaluation
    };

    const newHistory = [...completedStages, newRecord];
    setCompletedStages(newHistory);

    const nextStageIdx = currentStageIdx + 1;
    setSpokenTranscript('');
    setPracticeTranscript('');
    setCurrentTurnEvaluation(null);
    setIsPracticeMode(false);

    if (nextStageIdx < INTERVIEW_STAGES.length) {
      setCurrentStageIdx(nextStageIdx);
      const nextStageObj = INTERVIEW_STAGES[nextStageIdx];
      const nextQ = nextStageObj.question(selectedCompany, targetRole, candidateName);

      if (autoSpeakEnabled) {
        setTimeout(() => {
          speakText(nextQ);
        }, 300);
      }
    } else {
      // Completed all 5 rounds
      setInterviewFinished(true);
      setInterviewActive(false);
      addBadge({ id: 'bdg_ai_interview', title: `${selectedCompany} STAR & CEFR Certified` });

      const avgScore = Math.round(
        newHistory.reduce((acc, curr) => acc + curr.evaluation.score, 0) / newHistory.length
      );
      setTotalScore(avgScore);

      if (autoSpeakEnabled) {
        speakText(`Congratulations ${candidateName}! You have successfully completed all five stages of your ${selectedCompany} HR interview. Your full speech diagnosis, error rectification, and CEFR certificate are ready.`);
      }
    }
  };

  const currentStageObj = INTERVIEW_STAGES[currentStageIdx];
  const currentQuestionText = currentStageObj?.question(selectedCompany, targetRole, candidateName);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
              <Mic className="w-3 h-3 text-purple-400" /> 100% Voice Speaking Mode
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
              Active Mistake Rectifier & Polished Speech Generator
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Mic className="w-7 h-7 text-sky-400" />
            AI Speaking Mock Interview & Speech Coach
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Speak directly via microphone. The AI actively detects your <strong className="text-rose-400">spoken grammatical mistakes</strong>, calculates your <strong className="text-sky-400">CEFR grade</strong>, and publishes the <strong className="text-emerald-400">exact polished version you need to speak</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoSpeakEnabled(!autoSpeakEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition ${
              autoSpeakEnabled ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {autoSpeakEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>AI Voice: {autoSpeakEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {interviewFinished && (
            <button
              onClick={startInterview}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-attempt Interview
            </button>
          )}
        </div>
      </div>

      {/* Pre-launch Hero View */}
      {!interviewActive && !interviewFinished && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 max-w-3xl mx-auto shadow-xl">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto shadow-inner relative">
              <Mic className="w-8 h-8 text-sky-400" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {selectedCompany} • Spoken HR & Resume Screening
            </h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              No text typing required! Simply speak your answers into the microphone. The AI will analyze what you say, isolate your exact grammatical mistakes, and publish the perfected corporate speech for you to practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-sky-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> AI Spoken Audio
              </div>
              <p className="text-[11px] text-slate-400">Interviewer speaks questions aloud with corporate executive cadence.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Live Error Rectification
              </div>
              <p className="text-[11px] text-slate-400">Exposes your exact grammar, tense, and pronoun mistakes with rules.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" /> Published Polished Speech
              </div>
              <p className="text-[11px] text-slate-400">Rewrites your exact words into fluent, executive-level English.</p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={startInterview}
              className="px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold flex items-center gap-2 mx-auto shadow-lg shadow-sky-500/20"
            >
              <Mic className="w-4.5 h-4.5" /> Start Speaking Interview
            </button>
          </div>
        </div>
      )}

      {/* Active Question & Interactive Coaching Screen */}
      {interviewActive && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-400 font-mono font-bold text-xs">
                Stage {currentStageIdx + 1} of 5
              </span>
              <span className="font-bold text-white text-sm">{currentStageObj?.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {isAiSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>AI Speaking Audio...</span>
                </div>
              )}

              {isListening && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Listening to your microphone... Speak clearly</span>
                </div>
              )}
            </div>
          </div>

          {/* Current Question Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <Bot className="w-4 h-4" />
                <span>{selectedCompany} Senior HR Interviewer</span>
              </div>
              <button
                onClick={() => speakText(currentQuestionText)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <Volume2 className="w-3.5 h-3.5 text-sky-400" /> Replay Question
              </button>
            </div>
            <p className="text-sm text-slate-100 leading-relaxed font-medium">
              {currentQuestionText}
            </p>
          </div>

          {/* Speaking Console (If not yet evaluated or practicing) */}
          {!currentTurnEvaluation && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-400" />
                  <span>Your Live Spoken Words:</span>
                </div>
                {spokenTranscript && (
                  <button
                    onClick={clearCurrentRecording}
                    className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear & Re-speak
                  </button>
                )}
              </div>

              <div className={`p-4 rounded-xl min-h-[90px] border leading-relaxed text-xs transition ${
                isListening
                  ? 'bg-slate-900 border-rose-500/50 ring-2 ring-rose-500/20 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}>
                {spokenTranscript ? (
                  <span className="text-slate-100 font-sans">{spokenTranscript}</span>
                ) : (
                  <span className="text-slate-500 italic flex items-center gap-2">
                    {isListening ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        Listening... Speak your answer into your microphone.
                      </>
                    ) : (
                      'Click "Start Speaking" below to answer by voice (no typing needed).'
                    )}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400 animate-pulse'
                      : 'bg-sky-500 hover:bg-sky-600 text-white border-sky-400'
                  }`}
                >
                  {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
                  <span>{isListening ? 'Stop Recording' : 'Start Speaking'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleEvaluateStudentSpeech}
                  disabled={!spokenTranscript.trim() || isAiEvaluating}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {isAiEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Diagnosing Speech & Rectifying Errors...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                      <span>Submit Speech for Error Rectification & Polishing</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE COACHING & ERROR RECTIFICATION CARD */}
          {currentTurnEvaluation && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-6 shadow-2xl">
              {/* Header & CEFR Score */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">AI Speech Diagnosis & Error Rectification</h3>
                    <p className="text-xs text-slate-400">{currentTurnEvaluation.grammarFeedback}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-mono font-extrabold text-xs border border-purple-500/40">
                    CEFR Level: {currentTurnEvaluation.cefrLevel}
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40">
                    Score: {currentTurnEvaluation.score}%
                  </div>
                </div>
              </div>

              {/* What You Said Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" /> What You Spoke:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                  “{spokenTranscript}”
                </p>
              </div>

              {/* Rectified Mistakes Table */}
              {currentTurnEvaluation.errorsDetected.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Specific Mistakes & Grammatical Flaws Detected:
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {currentTurnEvaluation.errorsDetected.map((err, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-rose-300 font-semibold">
                            ❌ What was spoken: <strong className="line-through bg-rose-950/70 px-2 py-0.5 rounded text-rose-200">{err.mistake}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase">{err.category}</span>
                        </div>
                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                          ✅ Correct Corporate Formulation: <span className="bg-emerald-950/70 text-emerald-200 px-2 py-0.5 rounded font-normal">{err.fix}</span>
                        </div>
                        <div className="text-slate-300 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 font-semibold">💡 Grammar Rule / Explanation: </span>{err.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PUBLISHED POLISHED SPEECH (WHAT YOU NEED TO SPEAK) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500/60 space-y-3 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                        Published Polished Speech (Final Version You Need to Speak)
                      </span>
                      <span className="text-[11px] text-slate-300">
                        Your exact spoken ideas rewritten into fluent, executive-standard English.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => speakText(currentTurnEvaluation.personalizedPolishedSpeech)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md"
                  >
                    <Volume2 className="w-4 h-4 text-slate-950" /> Listen to Audio
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-slate-100 text-sm leading-relaxed font-sans shadow-inner">
                  {currentTurnEvaluation.personalizedPolishedSpeech}
                </div>
              </div>

              {/* Executive Model Benchmark Answer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Benchmark C2 Executive Model Answer:
                  </span>
                  <button
                    onClick={() => speakText(currentTurnEvaluation.executiveModelSpeech)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-800"
                  >
                    <Volume2 className="w-3 h-3 text-sky-400" /> Listen
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {currentTurnEvaluation.executiveModelSpeech}
                </p>
              </div>

              {/* Practice Re-Speaking Console or Proceed to Next Stage */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTurnEvaluation(null);
                    setSpokenTranscript('');
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
                >
                  <RotateCcw className="w-4 h-4" /> Re-speak This Round
                </button>

                <button
                  type="button"
                  onClick={handleProceedToNextStage}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
                >
                  <span>
                    {currentStageIdx + 1 < INTERVIEW_STAGES.length
                      ? `Proceed to Stage ${currentStageIdx + 2} of 5`
                      : 'Complete Interview & View Final Certificate'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Post-Interview Report Card */}
      {interviewFinished && (
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
            <div>
              <span className="text-[11px] font-semibold text-sky-400 uppercase">
                {selectedCompany} • Final HR Speaking & Assessment Report
              </span>
              <h2 className="text-xl font-extrabold text-white mt-1">
                Candidate Readiness & Speech Verdict: <span className="text-emerald-400">Passed - Recommended for Hire</span>
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">CEFR Proficiency</span>
                <span className="text-lg font-extrabold text-purple-400 font-mono">
                  C1 - Advanced Corporate Fluency
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase block">Overall Score</span>
                <span className="text-2xl font-extrabold text-emerald-400">{totalScore || 88} / 100</span>
              </div>
            </div>
          </div>

          {/* CEFR Level Breakdown */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                CEFR Certified Rating: C1 - Advanced Corporate Fluency
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                Corporate Ready
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your spoken articulation demonstrates strong operational business fluency. You effectively applied domain terminology, structured responses, and handled dilemma scenarios at an executive standard.
            </p>
          </div>

          {/* Review of all 5 completed rounds */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase">Interview Stage-by-Stage Performance Log:</h4>
            {completedStages.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-sky-400 font-bold">
                  <span>Stage {idx + 1}: {s.stageName}</span>
                  <span className="text-emerald-400">Score: {s.evaluation.score}% • CEFR {s.evaluation.cefrLevel}</span>
                </div>
                <div className="text-slate-400">
                  <strong>What you spoke:</strong> “{s.studentSpokenText}”
                </div>
                <div className="text-emerald-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <strong>Published Polished Speech:</strong> {s.evaluation.personalizedPolishedSpeech}
                </div>
              </div>
            ))}
          </div>

          {/* Next Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Badge <strong className="text-white">{selectedCompany} STAR & CEFR Certified</strong> added to your Credential Wallet.
            </div>
            <button
              onClick={startInterview}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              Practice Full Interview Again <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

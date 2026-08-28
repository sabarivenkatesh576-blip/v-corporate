import React, { useState, useRef, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
  Compass,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Building2,
  Target,
  FileText,
  Briefcase,
  HelpCircle,
  Award,
  Zap,
  BookOpen,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIStyleManagerPage: React.FC = () => {
  const { user } = useAuth();
  const {
    selectedCompany,
    targetRole,
    aiManagerMessages,
    sendAiManagerMessage,
    internshipStatus,
    hiringRounds,
    activeRound
  } = useCareer();
  const navigate = useNavigate();

  const [inputMsg, setInputMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiManagerMessages]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Microphone speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeakingVoice(true);
    utterance.onend = () => setIsSpeakingVoice(false);
    utterance.onerror = () => setIsSpeakingVoice(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    sendAiManagerMessage(inputMsg.trim());
    setInputMsg('');
  };

  const handleQuickPrompt = (promptText: string) => {
    sendAiManagerMessage(promptText);
  };

  // Quick guidance topics
  const QUICK_TOPICS = [
    {
      id: 'roadmap',
      icon: Compass,
      label: 'Guide Me: How to Use V-CORP Portal',
      prompt: `Please guide me on how the V-CORP portal works from start to finish. What are the key stages I need to complete to become career-ready at ${selectedCompany}?`
    },
    {
      id: 'interview',
      icon: Mic,
      label: 'How to Clear Spoken Mock Interview',
      prompt: `How does the AI Spoken Mock Interview work, and how can I achieve a C2 Executive English level? What questions should I expect for ${targetRole}?`
    },
    {
      id: 'internship',
      icon: Briefcase,
      label: 'How to Complete Internship Sprints',
      prompt: `Guide me through the practical internship sprints. How do I execute the SQL queries and Excel financial models to earn 100% marks?`
    },
    {
      id: 'selection',
      icon: Target,
      label: `Explain ${selectedCompany}'s Selection Rounds`,
      prompt: `Explain the 5 recruitment and selection rounds for ${targetRole} at ${selectedCompany}. What criteria do recruiters look for?`
    },
    {
      id: 'resume',
      icon: FileText,
      label: 'Optimize My Resume for ATS Screening',
      prompt: `What key technical skills and corporate keywords should I include on my resume for ${targetRole} at ${selectedCompany} to get a 95%+ ATS score?`
    },
    {
      id: 'placement',
      icon: Award,
      label: 'Placement Cell & Campus Drive Readiness',
      prompt: `How do I unlock campus drive eligibility, interview scheduling, and offer letters in the Placement Cell?`
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> Official AI Corporate Mentor
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
              Portal Guide & Career Assistant
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <Sparkles className="w-7 h-7 text-purple-400" />
            AI Corporate Mentor & Portal Guide Cabin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Your personal Senior Practice Mentor at <strong className="text-white">{selectedCompany}</strong>. Ask for step-by-step portal guidance, task assistance, interview strategies, formulas, and corporate readiness coaching.
          </p>
        </div>

        {/* Quick Navigation Gateway */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/internships')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" /> Internship Workstation
          </button>
          <button
            onClick={() => navigate('/interview')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 shadow-md"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" /> Mock Interview
          </button>
        </div>
      </div>

      {/* Senior Mentor Profile Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center text-purple-300 font-extrabold text-xl shadow-inner">
            👨‍💼
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-white">Dr. Alistair Vance</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online & Mentoring
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Senior Practice Director & Corporate Career Coach • <strong className="text-sky-400">{selectedCompany}</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Target Mentee: <strong className="text-white">{user?.fullName || 'Candidate'}</strong> ({targetRole} Track)
            </p>
          </div>
        </div>

        {/* Current Candidate Stats Badge */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Internship Progress</span>
            <span className="font-extrabold text-emerald-400 font-mono text-sm">
              {internshipStatus.completedWeeks} / 4 Sprints
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase block">Current Track</span>
            <span className="font-bold text-sky-300">{targetRole}</span>
          </div>
        </div>
      </div>

      {/* Main Mentor Cabin: Left Quick Guidance Panel, Right Conversational Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Guidance Topics */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>Instant Portal & Career Guidance:</span>
          </div>

          <div className="space-y-2">
            {QUICK_TOPICS.map(topic => {
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleQuickPrompt(topic.prompt)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition flex items-start gap-3 group shadow-md"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <div className="text-xs font-bold text-slate-200 group-hover:text-white transition">
                      {topic.label}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">
                      Click to ask mentor for step-by-step assistance
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition flex-shrink-0 mt-1" />
                </button>
              );
            })}
          </div>

          {/* Quick Portal Navigation Links */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5 text-xs text-slate-300">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Direct Portal Shortcuts:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                onClick={() => navigate('/companies')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-200 text-left font-semibold"
              >
                1. Company Select →
              </button>
              <button
                onClick={() => navigate('/interview')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-200 text-left font-semibold"
              >
                2. Voice Interview →
              </button>
              <button
                onClick={() => navigate('/internships')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-200 text-left font-semibold"
              >
                3. Internship Work →
              </button>
              <button
                onClick={() => navigate('/placement')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500 text-slate-200 text-left font-semibold"
              >
                4. Placement Cell →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Conversational AI Mentor Chat Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[580px] overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-white">Live Mentoring Stream with Dr. Alistair Vance</span>
                <span className="text-slate-400">({selectedCompany})</span>
              </div>

              {isSpeakingVoice && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold animate-pulse flex items-center gap-1">
                  <Volume2 className="w-3 h-3" /> Audio Playing...
                </span>
              )}
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40">
              {aiManagerMessages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xl ${
                      m.sender === 'user'
                        ? 'bg-sky-500 text-white rounded-2xl rounded-tr-sm p-4 shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm p-5 space-y-3 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold border-b border-slate-800/40 pb-1.5">
                      <span className={`flex items-center gap-1.5 ${m.sender === 'user' ? 'text-sky-100' : 'text-purple-400'}`}>
                        {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        <span>{m.sender === 'user' ? (user?.fullName || 'You') : `Dr. Alistair Vance (${selectedCompany})`}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 opacity-70 font-mono">{m.timestamp}</span>
                        {m.sender === 'ai' && (
                          <button
                            onClick={() => speakText(m.text)}
                            title="Listen to advice aloud"
                            className="p-1 rounded bg-slate-800 hover:bg-purple-500 hover:text-white text-slate-300 transition"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-xs leading-relaxed font-sans whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with Voice Recognition and Send */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
              <button
                onClick={toggleMic}
                title={isListening ? 'Stop listening' : 'Speak your question'}
                className={`p-3 rounded-xl border transition flex items-center justify-center ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder={isListening ? 'Listening to your voice...' : `Ask Dr. Alistair Vance for portal guidance, task help, interview coaching...`}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans"
              />

              <button
                onClick={handleSend}
                disabled={!inputMsg.trim()}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

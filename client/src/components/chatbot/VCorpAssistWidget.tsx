import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export const VCorpAssistWidget: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hi! Welcome to your Virtual Corporate Office 👋\nI'm **V-CORP Assist**.\nI can help you with your projects, tasks, interviews, skills and workplace activities.\nWhat would you like to do today?",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Derive current page context
  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/workspace')) return 'Project Workspace';
    if (path.includes('/interview')) return 'AI Mock Interview';
    if (path.includes('/skill-gap')) return 'Skill Gap Analysis';
    if (path.includes('/assessments')) return 'Assessment Portal';
    if (path.includes('/virtual-office')) return 'Virtual Corporate Office';
    if (path.includes('/teams')) return 'Team Collaboration Area';
    return 'Corporate Dashboard';
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', {
        message: textToSend,
        context: {
          page: getPageContext(),
          role: profile?.targetRole || 'Software Developer'
        }
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'ai',
            text: res.data.reply,
            timestamp: new Date()
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: `I'm operating in High-Fidelity Local Guidance Mode. You are currently in the **${getPageContext()}**. Complete your milestones and submit deliverables for evaluation!`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Get Hint', query: 'Can you give me a strategic hint on what to focus on right now?', icon: Lightbulb },
    { label: 'Explain Concept', query: 'Please explain the core concepts and industry best practices for my target role.', icon: BookOpen },
    { label: 'Check My Approach', query: 'What is the optimal systematic approach to deliver this task with high quality?', icon: CheckCircle2 }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2.5 rounded-full bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 p-3.5 text-white shadow-xl shadow-sky-500/25 transition-all hover:scale-105 hover:shadow-sky-500/40"
        >
          <div className="relative">
            <Bot className="h-6 w-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
          </div>
          <span className="text-xs font-bold tracking-wide pr-1">V-CORP Assist</span>
        </button>
      )}

      {isOpen && (
        <div className={`flex flex-col rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
          isMinimized ? 'h-14 w-80' : 'h-[520px] w-96 max-w-[calc(100vw-2rem)]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 p-3.5 bg-slate-850 rounded-t-2xl">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  V-CORP Assist <Sparkles className="h-3 w-3 text-amber-400" />
                </h3>
                <span className="text-[10px] text-sky-400 font-medium">{getPageContext()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line">{m.text}</div>
                      <span className="mt-1 block text-[9px] text-slate-400 text-right">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center space-x-2 text-xs text-sky-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40 w-fit">
                    <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping"></span>
                    <span>V-CORP AI is reasoning...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Context Action Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-t border-slate-800/80 bg-slate-950/40">
                {quickPrompts.map((chip, idx) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip.query)}
                      disabled={loading}
                      className="flex flex-shrink-0 items-center space-x-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-300 hover:border-sky-500 hover:text-white transition"
                    >
                      <Icon className="h-3 w-3 text-sky-400" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask V-CORP Assist about ${profile?.targetRole || 'projects'}...`}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50 transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

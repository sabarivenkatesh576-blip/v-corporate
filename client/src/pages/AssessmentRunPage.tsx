import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  Clock,
  Flag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AssessmentRunPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get('category') || 'Quantitative Aptitude';
  const topic = searchParams.get('topic') || 'All Topics';
  const mode = searchParams.get('mode') || 'timed';
  const count = Number(searchParams.get('count')) || 10;

  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(count * 60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [resultSummary, setResultSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/assessment/questions?category=${encodeURIComponent(category)}&topic=${encodeURIComponent(topic)}&mode=${mode}&count=${count}`);
        if (res.data.success) {
          setQuestions(res.data.questions || []);
          setTimeRemaining((res.data.questions.length || 10) * 60);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, topic, mode, count]);

  useEffect(() => {
    if (submitted || mode === 'practice') return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [submitted, mode]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: optIdx
    }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion._id)) {
        next.delete(currentQuestion._id);
      } else {
        next.add(currentQuestion._id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (submitted) return;
    try {
      const payloadResponses = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] !== undefined ? answers[q._id] : -1,
        timeSpentSeconds: Math.round(timeSpent / Math.max(questions.length, 1))
      }));

      const res = await api.post('/assessment/submit', {
        category,
        mode,
        responses: payloadResponses,
        timeTakenSeconds: timeSpent
      });

      if (res.data.success) {
        setResultSummary(res.data);
        setSubmitted(true);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error('Error submitting assessment:', err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Preparing assessment environment...
      </div>
    );
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
            {category} • {mode.toUpperCase()} MODE
          </span>
          <h1 className="text-base font-bold text-white mt-1">
            Question {currentIndex + 1} of {questions.length}
          </h1>
        </div>

        {mode !== 'practice' && !submitted && (
          <div className="flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-mono font-bold text-white">
              {formatTimer(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {currentQuestion && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Topic: <strong className="text-white">{currentQuestion.topic}</strong>
                  </span>
                  <button
                    onClick={toggleMarkForReview}
                    className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                      markedForReview.has(currentQuestion._id)
                        ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Flag className="h-3 w-3" />
                    <span>{markedForReview.has(currentQuestion._id) ? 'Marked' : 'Mark for Review'}</span>
                  </button>
                </div>

                <p className="text-sm font-semibold text-white leading-relaxed">
                  {currentQuestion.question}
                </p>

                <div className="space-y-2 pt-2">
                  {currentQuestion.options?.map((opt: string, optIdx: number) => {
                    const isSelected = answers[currentQuestion._id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'border-sky-500 bg-sky-500/20 text-white shadow'
                            : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-sky-400" />}
                      </button>
                    );
                  })}
                </div>

                {mode === 'practice' && currentQuestion.explanation && answers[currentQuestion._id] !== undefined && (
                  <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300">
                    <p>?? <strong>Formula & Explanation:</strong> {currentQuestion.explanation}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="flex items-center space-x-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  setAnswers((prev) => {
                    const next = { ...prev };
                    delete next[currentQuestion._id];
                    return next;
                  });
                }}
                className="text-xs text-slate-500 hover:text-slate-400"
              >
                Clear Choice
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="flex items-center space-x-1 rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-500 transition shadow"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Assessment</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Question Palette
              </h3>

              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((q, idx) => {
                  const isAnswered = answers[q._id] !== undefined;
                  const isMarked = markedForReview.has(q._id);
                  const isCurrent = currentIndex === idx;

                  let style = 'bg-slate-950 text-slate-500 border-slate-800';
                  if (isCurrent) style = 'border-sky-400 bg-sky-500 text-white font-bold ring-2 ring-sky-500/40';
                  else if (isMarked) style = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                  else if (isAnswered) style = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 rounded-lg border text-xs font-bold transition flex items-center justify-center ${style}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded bg-emerald-500/40 border border-emerald-500"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded bg-amber-500/40 border border-amber-500"></span>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded bg-slate-950 border border-slate-800"></span>
                  <span>Unvisited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl text-center space-y-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mb-1">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Assessment Completed!
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="block text-slate-500">Score</span>
                <span className="text-xl font-bold text-sky-400">{resultSummary?.scorePercentage}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="block text-slate-500">Correct Answers</span>
                <span className="text-xl font-bold text-emerald-400">{resultSummary?.correctAnswers} / {resultSummary?.totalQuestions}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="block text-slate-500">Time Taken</span>
                <span className="text-xl font-bold text-slate-200">{Math.round((resultSummary?.timeTakenSeconds || 0) / 60)}m {(resultSummary?.timeTakenSeconds || 0) % 60}s</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => navigate('/assessments')}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Back to Assessments
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl bg-sky-600 px-5 py-2 text-xs font-bold text-white hover:bg-sky-500 transition shadow"
              >
                View Updated Readiness
              </button>
            </div>
          </div>

          {resultSummary?.detailedReview && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Detailed Solutions & Formulas Review
              </h3>
              {resultSummary.detailedReview.map((rev: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Q{idx + 1}: {rev.question}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rev.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {rev.isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Correct Answer:</strong> {rev.options[rev.correctAnswer]}
                  </p>
                  <p className="text-xs text-sky-300 bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/20">
                    ?? <strong>Solution & Formula:</strong> {rev.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

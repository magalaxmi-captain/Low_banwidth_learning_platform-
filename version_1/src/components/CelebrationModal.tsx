import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Zap, Award, ArrowRight, RotateCcw, Star, CheckCircle2 } from 'lucide-react';
import { TactileButton } from './TactileButton.tsx';

interface CelebrationModalProps {
  lessonTitle: string;
  stats: {
    scorePercent: number;
    accuracyRate: number;
    xpEarned: number;
    mistakesCount: number;
    durationSeconds: number;
  };
  streakDays: number;
  onContinue: () => void;
  onReview: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  lessonTitle,
  stats,
  streakDays,
  onContinue,
  onReview,
}) => {
  const [displayedXp, setDisplayedXp] = useState(0);
  const [radialProgress, setRadialProgress] = useState(0);

  // Dynamic ticking up counter effect
  useEffect(() => {
    let start = 0;
    const targetXp = stats.xpEarned;
    const step = Math.max(1, Math.floor(targetXp / 20));
    const timer = setInterval(() => {
      start += step;
      if (start >= targetXp) {
        setDisplayedXp(targetXp);
        clearInterval(timer);
      } else {
        setDisplayedXp(start);
      }
    }, 40);

    const radialTimer = setTimeout(() => {
      setRadialProgress(stats.accuracyRate);
    }, 150);

    return () => {
      clearInterval(timer);
      clearTimeout(radialTimer);
    };
  }, [stats.xpEarned, stats.accuracyRate]);

  // Radial dial calculation (SVG strokeDashoffset)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (radialProgress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-3xl border-2 border-slate-200 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 overflow-hidden relative">
        {/* Background festive rays */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Celebratory Vector Badge */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 transform hover:rotate-6 transition-transform">
            <Trophy className="w-10 h-10 text-amber-300 fill-amber-300 animate-pulse" />
          </div>
          {/* Floating Stars */}
          <Star className="absolute -top-1 -right-1 w-6 h-6 fill-amber-400 text-amber-400 animate-bounce" />
          <Star className="absolute bottom-1 -left-2 w-5 h-5 fill-amber-400 text-amber-400 animate-bounce delay-150" />
        </div>

        {/* Title */}
        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
          Lesson Mastered!
        </span>
        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
          {lessonTitle}
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Progress and quiz telemetry synced to rural student portfolio.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 my-5">
          {/* Metric 1: XP Gained with tick-up */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5 fill-emerald-500" />
              <span>XP</span>
            </div>
            <div className="text-xl font-black text-emerald-700">+{displayedXp}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Knowledge</div>
          </div>

          {/* Metric 2: Radial Accuracy Gauge */}
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center relative">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">
                {stats.accuracyRate}%
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-bold mt-1">Accuracy</div>
          </div>

          {/* Metric 3: Streak Increment */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-600 text-xs font-bold mb-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500" />
              <span>Streak</span>
            </div>
            <div className="text-xl font-black text-amber-700">{streakDays}</div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Days Strong!</div>
          </div>
        </div>

        {/* Rural Offline Sync Assurance Box */}
        <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[11px] text-slate-600 leading-tight">
            Saved to local device cache. Synced with school attendance log.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <TactileButton variant="primary" size="lg" fullWidth onClick={onContinue}>
            KEEP GOING <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>

          <TactileButton variant="outline" size="md" fullWidth onClick={onReview}>
            <RotateCcw className="w-4 h-4 mr-2" /> Review Mistakes ({stats.mistakesCount})
          </TactileButton>
        </div>
      </div>
    </div>
  );
};

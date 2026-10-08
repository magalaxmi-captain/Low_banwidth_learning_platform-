import React, { useState } from 'react';
import {
  Target,
  Gift,
  Zap,
  Check,
  Flame,
  Trophy,
  Sparkles,
  Clock,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { DailyQuest } from '../types.ts';
import { TactileButton } from './TactileButton.tsx';

interface QuestsViewProps {
  onClaimReward: (xp: number, gems: number) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({ onClaimReward }) => {
  const [activeCategory, setActiveCategory] = useState<'daily' | 'weekly' | 'milestone'>('daily');
  const [claimedNotice, setClaimedNotice] = useState<{ xp: number; gems: number; title: string } | null>(
    null
  );

  const [quests, setQuests] = useState<
    Array<DailyQuest & { category: 'daily' | 'weekly' | 'milestone'; icon: string }>
  >([
    {
      id: 'q1',
      title: 'Complete 3 STEM Lessons Today',
      description: 'Finish any 3 interactive micro-lessons in Math, Science, or Literacy.',
      rewardXp: 50,
      rewardGems: 25,
      progress: 2,
      total: 3,
      isClaimed: false,
      category: 'daily',
      icon: '📚',
    },
    {
      id: 'q2',
      title: 'Achieve 90%+ Accuracy on a Quiz',
      description: 'Score 90% or higher with zero or 1 mistake on any curriculum node.',
      rewardXp: 35,
      rewardGems: 20,
      progress: 1,
      total: 1,
      isClaimed: false,
      category: 'daily',
      icon: '🎯',
    },
    {
      id: 'q3',
      title: 'Maintain 5-Day Learning Streak',
      description: 'Log in and check your daily attendance five consecutive days.',
      rewardXp: 40,
      rewardGems: 30,
      progress: 5,
      total: 5,
      isClaimed: false,
      category: 'daily',
      icon: '🔥',
    },
    {
      id: 'q4',
      title: 'Match 5 Pairs in Under 60 Seconds',
      description: 'Fast-track mental math in the Visual Fractions tap-to-pair challenge.',
      rewardXp: 30,
      rewardGems: 15,
      progress: 5,
      total: 5,
      isClaimed: true,
      category: 'daily',
      icon: '⚡',
    },
    {
      id: 'q5',
      title: 'Master Unit 1 Boss Challenge',
      description: 'Conquer the Halves & Quarters checkpoint boss assessment.',
      rewardXp: 120,
      rewardGems: 60,
      progress: 0,
      total: 1,
      isClaimed: false,
      category: 'weekly',
      icon: '👑',
    },
    {
      id: 'q6',
      title: 'Offline Sync Pioneer',
      description: 'Batch-sync at least 4 completed lessons without using mobile cellular data.',
      rewardXp: 80,
      rewardGems: 40,
      progress: 3,
      total: 4,
      isClaimed: false,
      category: 'weekly',
      icon: '📶',
    },
    {
      id: 'q7',
      title: 'District Scholar Milestone',
      description: 'Earn a total of 500 lifetime academic XP across all subjects.',
      rewardXp: 200,
      rewardGems: 100,
      progress: 450,
      total: 500,
      isClaimed: false,
      category: 'milestone',
      icon: '🏆',
    },
    {
      id: 'q8',
      title: 'Avatar Creator Pioneer',
      description: 'Design and customize your personal rural scholar mascot.',
      rewardXp: 50,
      rewardGems: 25,
      progress: 1,
      total: 1,
      isClaimed: false,
      category: 'milestone',
      icon: '🎨',
    },
  ]);

  const handleClaim = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.isClaimed || quest.progress < quest.total) return;

    onClaimReward(quest.rewardXp, quest.rewardGems);
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    setClaimedNotice({
      xp: quest.rewardXp,
      gems: quest.rewardGems,
      title: quest.title,
    });

    setTimeout(() => {
      setClaimedNotice(null);
    }, 3500);
  };

  const filteredQuests = quests.filter((q) => q.category === activeCategory);
  const readyToClaimCount = quests.filter((q) => q.progress >= q.total && !q.isClaimed).length;

  return (
    <div className="w-full max-w-md mx-auto pb-28 pt-4 px-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-5 text-slate-950 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-950/80 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Academic Objectives</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">
              Quests & Daily Goals
            </h2>
            <p className="text-xs text-amber-950/90 font-semibold mt-0.5">
              Complete short-term objectives to claim bonus XP & gems!
            </p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-white/30 backdrop-blur-xs flex items-center justify-center shrink-0 text-3xl shadow-inner">
            🎯
          </div>
        </div>

        {/* Reset Countdown Timer */}
        <div className="mt-3.5 pt-2.5 border-t border-amber-400/50 flex items-center justify-between text-xs font-bold text-amber-950">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Resets in: 06h 45m</span>
          </div>
          {readyToClaimCount > 0 && (
            <span className="bg-white text-orange-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-bounce shadow-xs">
              {readyToClaimCount} Ready to Claim!
            </span>
          )}
        </div>
      </div>

      {/* Floating Reward Claim Toast Notification */}
      {claimedNotice && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">
              ✨
            </div>
            <div>
              <div className="text-xs font-black">Reward Claimed!</div>
              <div className="text-[11px] text-emerald-100">{claimedNotice.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-black">
              +{claimedNotice.xp} XP
            </span>
            <span className="px-2 py-1 bg-amber-400 text-amber-950 rounded-lg text-xs font-black">
              +{claimedNotice.gems} 💎
            </span>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { id: 'daily', label: 'Daily Goals', count: quests.filter((q) => q.category === 'daily' && !q.isClaimed).length },
          { id: 'weekly', label: 'Weekly', count: quests.filter((q) => q.category === 'weekly' && !q.isClaimed).length },
          { id: 'milestone', label: 'Milestones', count: quests.filter((q) => q.category === 'milestone' && !q.isClaimed).length },
        ].map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {filteredQuests.map((quest) => {
          const isComplete = quest.progress >= quest.total;
          const percentage = Math.min(100, Math.round((quest.progress / quest.total) * 100));

          return (
            <div
              key={quest.id}
              className={`p-4 rounded-3xl border-2 transition-all relative overflow-hidden ${
                quest.isClaimed
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : isComplete
                  ? 'bg-gradient-to-r from-amber-50/90 to-yellow-50/90 border-amber-300 shadow-sm ring-2 ring-amber-300/30'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                      quest.isClaimed
                        ? 'bg-slate-200 text-slate-400'
                        : isComplete
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {quest.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight leading-tight">
                      {quest.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                      {quest.description}
                    </p>

                    {/* Progress Bar & Numerical Visual Cue */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={isComplete ? 'text-amber-700 font-extrabold' : 'text-slate-500'}>
                          {quest.isClaimed ? 'Objective completed' : `${quest.progress} of ${quest.total} completed`}
                        </span>
                        <span className="text-slate-400">{percentage}%</span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            quest.isClaimed
                              ? 'bg-slate-400'
                              : isComplete
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Rewards & Claim Button */}
                <div className="shrink-0 flex flex-col items-end justify-between self-stretch">
                  <div className="flex items-center gap-1.5 text-xs font-black">
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                      +{quest.rewardXp} XP
                    </span>
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                      +{quest.rewardGems} 💎
                    </span>
                  </div>

                  <div className="mt-4">
                    {quest.isClaimed ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-slate-400" />
                        <span>Claimed</span>
                      </div>
                    ) : isComplete ? (
                      <TactileButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleClaim(quest.id)}
                        className="animate-pulse"
                      >
                        <Gift className="w-3.5 h-3.5 mr-1" /> Claim!
                      </TactileButton>
                    ) : (
                      <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-xl">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivation Tip Card */}
      <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 text-slate-600">
        <Award className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-xs font-medium leading-relaxed">
          <strong>Tip for rural students:</strong> Daily quest rewards are stored locally on your device and will safely synchronize to your school server when connected!
        </p>
      </div>
    </div>
  );
};

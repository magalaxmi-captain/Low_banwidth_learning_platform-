import React, { useState } from 'react';
import { Flame, Diamond, Zap, ChevronDown, Check, Wifi, WifiOff, Calculator, Sprout, BookOpen, Layers } from 'lucide-react';
import { SubjectMeta, SUBJECTS } from '../data/curriculumData.ts';

interface TopAppBarProps {
  currentSubject: SubjectMeta;
  onSelectSubject: (subject: SubjectMeta) => void;
  streakDays: number;
  gems: number;
  totalXp: number;
  isOnline: boolean;
  onOpenSyncModal: () => void;
  onOpenStreakDetails?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentSubject,
  onSelectSubject,
  streakDays,
  gems,
  totalXp,
  isOnline,
  onOpenSyncModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-4 h-4 text-emerald-600" />;
      case 'Sprout':
        return <Sprout className="w-4 h-4 text-cyan-600" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs px-3 py-2.5 sm:px-4">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Subject Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-95 text-left"
          >
            {getSubjectIcon(currentSubject.iconName)}
            <span className="text-xs font-bold text-slate-800 tracking-tight max-w-[110px] sm:max-w-[140px] truncate">
              {currentSubject.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Academic Curriculum
                </div>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      onSelectSubject(sub);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      sub.id === currentSubject.id
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getSubjectIcon(sub.iconName)}
                      <div className="text-left">
                        <div className="text-slate-800">{sub.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{sub.levelTitle}</div>
                      </div>
                    </div>
                    {sub.id === currentSubject.id && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Gamification Stats: Streaks, Gems, XP & Offline Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Streak Counter */}
          <div
            title="Daily Learning Streak"
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-extrabold text-amber-700 shadow-2xs"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse relative" />
            </span>
            <span>{streakDays}</span>
          </div>

          {/* Gems */}
          <div
            title="Gems earned from lessons"
            className="flex items-center gap-1 px-2.5 py-1 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-bold text-cyan-700"
          >
            <Diamond className="w-3.5 h-3.5 text-cyan-500 fill-cyan-400" />
            <span>{gems}</span>
          </div>

          {/* XP */}
          <div
            title="Total Knowledge XP"
            className="hidden xs:flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
            <span>{totalXp}</span>
          </div>

          {/* Connectivity Pill */}
          <button
            type="button"
            onClick={onOpenSyncModal}
            title="Rural Offline-First Engine: Tap for sync metrics"
            className="flex items-center gap-1 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-full text-[11px] font-bold text-emerald-800 transition-transform active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Offline Ready</span>
            <span className="sm:hidden">Ready</span>
          </button>
        </div>
      </div>
    </header>
  );
};

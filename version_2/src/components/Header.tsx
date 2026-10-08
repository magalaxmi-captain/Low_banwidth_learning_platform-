import React, { useState } from 'react';
import { Flame, Sparkles, WifiOff, Volume2, VolumeX, Sun, CloudCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { soundEngine } from '../audio';

interface HeaderProps {
  profile: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  outdoorMode: boolean;
  onToggleOutdoorMode: () => void;
  onOpenSync: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  soundEnabled,
  onToggleSound,
  outdoorMode,
  onToggleOutdoorMode,
  onOpenSync,
  onOpenProfile,
}) => {
  const [showOfflineTip, setShowOfflineTip] = useState(false);

  return (
    <header className="relative z-30 bg-[#0f1f38] border-b-2 border-[#1e3456] px-3.5 py-2.5 shadow-md">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between gap-2">
        {/* User Avatar & Level */}
        <button
          onClick={() => {
            soundEngine.playTap();
            onOpenProfile();
          }}
          className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
          aria-label="View Student Profile"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-[0_3px_0_#b45309] group-hover:scale-105 transition-transform">
              {profile.avatar}
            </div>
            {/* Level badge pip */}
            <span className="absolute -bottom-1 -right-1 bg-[#10b981] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#047857] shadow-sm">
              L{profile.level}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
              {profile.levelTitle}
            </span>
            <span className="text-sm font-black text-white leading-tight">
              {profile.name}
            </span>
          </div>
        </button>

        {/* Right Gamification Meters & Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Daily Streak Flame */}
          <div
            className="flex items-center gap-1 bg-[#162744] border border-amber-500/40 rounded-xl px-2.5 py-1.5 shadow-inner"
            title="Daily Learning Streak"
          >
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-xs font-black text-amber-300">{profile.streakDays}d</span>
          </div>

          {/* Gems / Coins */}
          <div
            className="flex items-center gap-1 bg-[#162744] border border-amber-400/40 rounded-xl px-2.5 py-1.5 shadow-inner"
            title="Gems Earned"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-amber-300">{profile.gems}</span>
          </div>

          {/* Offline Sync Status Badge */}
          <button
            onClick={() => {
              soundEngine.playTap();
              setShowOfflineTip(!showOfflineTip);
              onOpenSync();
            }}
            className={`flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-bold border transition-all active:scale-95 ${
              profile.offlineLessonsPending > 0
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Offline Mode Active"
            aria-label="Offline Mode Status"
          >
            <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-extrabold hidden xs:inline">OFFLINE</span>
          </button>

          {/* Quick Audio & Outdoor toggle */}
          <button
            onClick={() => {
              soundEngine.playTap();
              onToggleSound();
            }}
            className="p-1.5 rounded-xl bg-[#162744] border border-[#233d66] text-slate-300 hover:text-white active:scale-90"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              onToggleOutdoorMode();
            }}
            className={`p-1.5 rounded-xl border transition-colors active:scale-90 ${
              outdoorMode
                ? 'bg-amber-400 border-amber-300 text-slate-950'
                : 'bg-[#162744] border-[#233d66] text-slate-300'
            }`}
            title="Outdoor Sunlight High-Contrast Mode"
            aria-label="Toggle Outdoor Sunlight Mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Offline sync alert pill / banner */}
      <div className="mt-2 flex items-center justify-between bg-[#14233c] border border-emerald-500/30 rounded-lg px-2.5 py-1 text-[11px] text-emerald-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold">Offline Mode</span>
          <span className="text-emerald-400/80">• All lessons saved locally</span>
        </div>
        <button
          onClick={() => {
            soundEngine.playTap();
            onOpenSync();
          }}
          className="text-amber-300 font-extrabold text-[10px] underline hover:text-amber-200"
        >
          {profile.offlineLessonsPending} pending sync
        </button>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Award, Sparkles, Flame, Shield, Database, Smartphone, Check, Lock } from 'lucide-react';
import { Badge, UserProfile } from '../types';
import { soundEngine } from '../audio';

interface ProfileSyncScreenProps {
  profile: UserProfile;
  badges: Badge[];
  onSyncComplete: () => void;
  outdoorMode: boolean;
}

export const ProfileSyncScreen: React.FC<ProfileSyncScreenProps> = ({
  profile,
  badges,
  onSyncComplete,
  outdoorMode,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [syncStatusText, setSyncStatusText] = useState<string>('');
  const [justSynced, setJustSynced] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const handleSyncNow = () => {
    if (isSyncing) return;
    soundEngine.playTap();
    setIsSyncing(true);
    setJustSynced(false);
    setSyncProgress(10);
    setSyncStatusText('Packing offline lesson logs (4.2 KB)...');

    // Simulate realistic rural low-bandwidth sync steps
    setTimeout(() => {
      setSyncProgress(45);
      setSyncStatusText('Connecting to Village School Hub / Cloud...');
    }, 700);

    setTimeout(() => {
      setSyncProgress(85);
      setSyncStatusText('Uploading 4 completed quests & verifying streak...');
    }, 1400);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncStatusText('All records synchronized!');
      setIsSyncing(false);
      setJustSynced(true);
      soundEngine.playSyncDone();
      onSyncComplete();
    }, 2100);
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto pb-24 bg-[#0a1424] select-none text-white">
      {/* 1. HEADER: Large Avatar & Total XP */}
      <div className="bg-gradient-to-b from-[#112340] to-[#0d1a2d] border-b-2 border-[#1c355c] px-4 pt-6 pb-5 shadow-lg">
        <div className="flex flex-col items-center text-center">
          {/* Large Tactile Avatar */}
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 border-4 border-white flex items-center justify-center text-5xl shadow-[0_6px_0_#b45309]">
              {profile.avatar}
            </div>
            {/* Level Badge Pin */}
            <div className="absolute -bottom-2 -right-1 bg-emerald-500 text-white font-black text-xs px-2.5 py-1 rounded-full border-2 border-white shadow-md flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 fill-white" />
              <span>Level {profile.level}</span>
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-wide">
            {profile.name}
          </h2>
          <p className="text-xs font-bold text-amber-300 mb-1">
            {profile.grade} • {profile.school}
          </p>
          <div className="inline-flex items-center gap-2 bg-[#172c4e] px-3 py-1 rounded-full border border-slate-700 text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Device ID: ANDROID-LITE-SAVANNAH-42</span>
          </div>

          {/* Total XP & Next Level Progress */}
          <div className="w-full max-w-sm mt-4 bg-[#142540] border-2 border-[#22406e] rounded-2xl p-3.5 shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black uppercase text-slate-300">
                  Total Experience
                </span>
              </div>
              <span className="text-base font-black text-amber-300 font-display">
                {profile.xp.toLocaleString()} XP
              </span>
            </div>

            {/* Thick Progress bar */}
            <div className="w-full bg-[#0b1626] h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                style={{
                  width: `${Math.min(100, (profile.xp / profile.nextLevelXp) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1.5">
              <span>Level {profile.level}: {profile.levelTitle}</span>
              <span>
                {profile.nextLevelXp - profile.xp} XP to Level {profile.level + 1}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-3">
            <div className="bg-[#122238] border border-slate-700 rounded-xl p-2 text-center">
              <span className="text-[10px] font-bold text-slate-400 block">STREAK</span>
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-sm">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.streakDays} Days</span>
              </div>
            </div>

            <div className="bg-[#122238] border border-slate-700 rounded-xl p-2 text-center">
              <span className="text-[10px] font-bold text-slate-400 block">GEMS</span>
              <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-sm">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.gems}</span>
              </div>
            </div>

            <div className="bg-[#122238] border border-slate-700 rounded-xl p-2 text-center">
              <span className="text-[10px] font-bold text-slate-400 block">BADGES</span>
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-sm">
                <Award className="w-3.5 h-3.5" />
                <span>{unlockedCount}/{badges.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        {/* 2. BADGES SECTION: Grid Layout Displaying Unlocked Visual Badges & Silhouettes */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Earned Badges & Medals
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-[#162744] px-2.5 py-0.5 rounded-full border border-slate-700">
              {unlockedCount} Unlocked
            </span>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              return (
                <button
                  key={badge.id}
                  onClick={() => {
                    soundEngine.playTap();
                    setSelectedBadge(badge);
                  }}
                  className={`p-3 rounded-2xl flex flex-col items-start text-left transition-all btn-chunky-card ${
                    badge.unlocked
                      ? 'bg-[#13243d] hover:bg-[#182d4d] border-2 border-[#24436e] shadow-[0_4px_0_#0d192b]'
                      : 'bg-[#0e1726]/80 border-2 border-slate-800 shadow-[0_4px_0_#070c14] opacity-65'
                  }`}
                  aria-label={`Badge ${badge.title}: ${badge.unlocked ? 'Unlocked' : 'Locked'}`}
                >
                  <div className="w-full flex items-center justify-between mb-2">
                    {/* Badge Icon (Full color or Silhouette) */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        badge.unlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-white shadow-[0_3px_0_#b45309]'
                          : 'bg-slate-800 border-2 border-slate-700 text-slate-600 grayscale brightness-50'
                      }`}
                    >
                      {badge.unlocked ? badge.icon : '🔒'}
                    </div>

                    {/* Status Pill */}
                    {badge.unlocked ? (
                      <span className="bg-emerald-950 text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-black text-white leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">
                    {badge.description}
                  </p>

                  {badge.progressText && !badge.unlocked && (
                    <span className="text-[9px] font-bold text-amber-400 mt-1.5 bg-[#172438] px-1.5 py-0.5 rounded">
                      Req: {badge.progressText}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. NETWORK SYNC CARD: Distinct Card at the Bottom with Offline-First Controls */}
        <section className="bg-gradient-to-br from-[#12233f] to-[#0c182b] border-2 border-amber-400/60 rounded-3xl p-4 shadow-[0_6px_0_#070f1c]">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  OFFLINE STORAGE & MESH SYNC
                </span>
                <h4 className="text-sm font-black text-white">
                  {justSynced ? 'Last Synced: Just now' : `Last Synced: ${profile.lastSyncedAgo}`}
                </h4>
              </div>
            </div>

            {/* Offline badge */}
            <span className="bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-xl">
              100% Offline Ready
            </span>
          </div>

          {/* Sync Stats Info Box */}
          <div className="bg-[#0b1626] border border-[#1b3152] rounded-2xl p-3 mb-4 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Offline Lessons Queued:</span>
              <span className="font-black text-white">
                {justSynced ? 0 : profile.offlineLessonsPending} completed lessons
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Monthly Data Used:</span>
              <span className="font-black text-emerald-400">
                {profile.dataUsedMb} MB (99% less data)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Sync Destination:</span>
              <span className="font-bold text-slate-300">
                School Local Hub / Wi-Fi Mesh
              </span>
            </div>
          </div>

          {/* Syncing Progress Feedback Bar (if active) */}
          {isSyncing && (
            <div className="mb-4 bg-[#09111c] p-3 rounded-2xl border border-amber-400/40">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {syncStatusText}
                </span>
                <span className="font-black text-white">{syncProgress}%</span>
              </div>
              <div className="w-full bg-[#162744] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                  style={{ width: `${syncProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Prominent Chunky "Sync Progress Now" Button */}
          <button
            onClick={handleSyncNow}
            disabled={isSyncing}
            className={`w-full py-3.5 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              isSyncing
                ? 'bg-slate-700 text-slate-400 cursor-wait'
                : justSynced
                ? 'btn-chunky-emerald'
                : 'btn-chunky-amber'
            }`}
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>SYNCING WITH SCHOOL HUB...</span>
              </>
            ) : justSynced ? (
              <>
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>SYNC COMPLETE • ALL SAVED!</span>
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5 stroke-[2.5]" />
                <span>SYNC PROGRESS NOW</span>
              </>
            )}
          </button>
        </section>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#0f1f38] border-2 border-amber-400 rounded-3xl p-5 w-full max-w-sm shadow-2xl text-center">
            <div
              className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-3 ${
                selectedBadge.unlocked
                  ? 'bg-amber-400 border-4 border-white shadow-[0_5px_0_#b45309]'
                  : 'bg-slate-800 border-4 border-slate-700 grayscale'
              }`}
            >
              {selectedBadge.unlocked ? selectedBadge.icon : '🔒'}
            </div>

            <h3 className="text-lg font-black text-white">{selectedBadge.title}</h3>
            <p className="text-xs text-amber-300 font-bold mb-2">
              Category: {selectedBadge.category.toUpperCase()}
            </p>
            <p className="text-xs text-slate-300 mb-4">{selectedBadge.description}</p>

            <div className="bg-[#14233c] p-2.5 rounded-xl text-xs mb-4 text-slate-300">
              {selectedBadge.unlocked ? (
                <span className="text-emerald-300 font-bold">
                  ✓ Unlocked {selectedBadge.unlockedAt}
                </span>
              ) : (
                <span className="text-amber-300 font-bold">
                  Requirement: {selectedBadge.progressText || 'Complete more lessons'}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full btn-chunky-amber py-3 rounded-xl font-black text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

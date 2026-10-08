import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Sun,
  Volume2,
  VolumeX,
  Palette,
  Wifi,
  WifiOff,
  BatteryCharging,
  Signal,
  Sparkles,
} from 'lucide-react';
import { ScreenType, QuestNode, UserProfile } from './types';
import { initialProfile, questNodes as defaultQuestNodes, sampleQuizQuestions, badgesList, peerStudents } from './data/mockData';
import { soundEngine } from './audio';
import { Header } from './components/Header';
import { QuestMap } from './components/QuestMap';
import { QuizScreen } from './components/QuizScreen';
import { ProfileSyncScreen } from './components/ProfileSyncScreen';
import { ChallengesScreen } from './components/ChallengesScreen';
import { BottomNav } from './components/BottomNav';
import { DesignSystemModal } from './components/DesignSystemModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('quest');
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [nodes, setNodes] = useState<QuestNode[]>(defaultQuestNodes);
  const [selectedNode, setSelectedNode] = useState<QuestNode>(defaultQuestNodes[4]); // Level 5: Mango Harvest
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [outdoorMode, setOutdoorMode] = useState<boolean>(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [showDesignModal, setShowDesignModal] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('09:42');

  // Keep clock updated for realistic Android status bar
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours().toString().padStart(2, '0');
      const mins = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const updated = soundEngine.toggleSound();
    setSoundEnabled(updated);
  };

  const handleToggleOutdoorMode = () => {
    setOutdoorMode(!outdoorMode);
  };

  const handleStartNodeLesson = (node: QuestNode) => {
    setSelectedNode(node);
    setActiveScreen('quiz');
  };

  const handleCompleteQuiz = (xpGained: number, gemsGained: number) => {
    // Update user profile
    setProfile((prev) => ({
      ...prev,
      xp: prev.xp + xpGained,
      gems: prev.gems + gemsGained,
      offlineLessonsPending: prev.offlineLessonsPending + 1,
    }));

    // Unlock next node in quest map
    setNodes((prevNodes) => {
      return prevNodes.map((n) => {
        if (n.id === selectedNode.id) {
          return { ...n, status: 'completed' as const, stars: 3 };
        }
        if (n.id === selectedNode.id + 1) {
          return { ...n, status: 'active' as const };
        }
        return n;
      });
    });

    // Return to quest map
    setActiveScreen('quest');
  };

  const handleSyncComplete = () => {
    setProfile((prev) => ({
      ...prev,
      offlineLessonsPending: 0,
      lastSyncedAgo: 'Just now',
    }));
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-200 flex flex-col items-center justify-start ${
        outdoorMode ? 'bg-[#030712]' : 'bg-[#070e1b]'
      } text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans`}
    >
      {/* TOP DESIGNER CONTROLS & SCREEN QUICK-SWITCHER */}
      <nav
        aria-label="Platform Toolbar"
        className="w-full bg-[#0d1726] border-b border-[#1b2f4c] px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md z-50 text-xs"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-[0_2px_0_#b45309]">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-white tracking-wide">
                SAVANNAH QUEST
              </span>
              <span className="bg-amber-400/20 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-amber-400/40">
                LOW-BANDWIDTH EDTECH
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Accessible Offline-First Mobile Design System for Rural Students
            </p>
          </div>
        </div>

        {/* Quick Screen Switcher Tabs for direct review */}
        <div className="flex items-center bg-[#09111c] p-1 rounded-2xl border border-[#1b2f4c] gap-1">
          <button
            onClick={() => {
              soundEngine.playTap();
              setActiveScreen('quest');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeScreen === 'quest'
                ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            1. Quest Map
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              setActiveScreen('quiz');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeScreen === 'quiz'
                ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            2. Micro-Quiz
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              setActiveScreen('profile');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeScreen === 'profile'
                ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            3. Rewards & Sync
          </button>

          <button
            onClick={() => {
              soundEngine.playTap();
              setActiveScreen('challenges');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
              activeScreen === 'challenges'
                ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            4. P2P Duel
          </button>
        </div>

        {/* Action Toggles: Phone Chassis, Outdoor Mode, Design System Specs */}
        <div className="flex items-center gap-1.5">
          {/* Outdoor Sunlight Mode */}
          <button
            onClick={handleToggleOutdoorMode}
            className={`px-2.5 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
              outdoorMode
                ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-[0_2px_0_#b45309]'
                : 'bg-[#14233c] border-slate-700 text-slate-300 hover:text-white'
            }`}
            title="Outdoor Sunlight High-Contrast Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">
              {outdoorMode ? 'Outdoor Contrast ON' : 'Outdoor Mode'}
            </span>
          </button>

          {/* Sound Synthesizer toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-[#14233c] border-amber-500/50 text-amber-300'
                : 'bg-[#14233c] border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Zero-Asset Sound FX Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Phone Frame Toggle (9:16 vs Full Responsive) */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className={`p-2 rounded-xl border transition-all active:scale-95 ${
              isPhoneFrame
                ? 'bg-amber-400 border-amber-300 text-slate-950'
                : 'bg-[#14233c] border-slate-700 text-slate-300'
            }`}
            title={isPhoneFrame ? 'Phone Frame 9:16 Active' : 'Full Screen View'}
          >
            <Smartphone className="w-4 h-4" />
          </button>

          {/* Design Specs Modal */}
          <button
            onClick={() => setShowDesignModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold flex items-center gap-1.5 hover:bg-emerald-900 transition-all active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Design Specs</span>
          </button>
        </div>
      </nav>

      {/* MAIN VIEW CONTAINER */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        {/* Device Chassis (Standard 9:16 mobile aspect ratio) */}
        <div
          className={`relative transition-all duration-300 flex flex-col ${
            isPhoneFrame
              ? 'w-full max-w-[410px] h-[100dvh] sm:h-[860px] sm:rounded-[44px] sm:border-[10px] sm:border-[#1a283e] sm:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_0_2px_#2a3e5e] overflow-hidden bg-[#0a1424]'
              : 'w-full max-w-xl h-[100dvh] bg-[#0a1424] overflow-hidden'
          } ${outdoorMode ? 'ring-4 ring-amber-400' : ''}`}
        >
          {/* Android Status Bar (Signal, Battery, Camera Notch) */}
          <div className="bg-[#0f1f38] px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-extrabold text-slate-300 border-b border-[#182a46] shrink-0 select-none z-40">
            {/* Clock */}
            <span className="tracking-tight">{currentTime}</span>

            {/* Front Camera Punch-hole cutout */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-[#1a283e] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-slate-800"></span>
            </div>

            {/* Signal & Battery */}
            <div className="flex items-center gap-2">
              {/* Mesh Icon */}
              <div className="flex items-center gap-0.5 text-emerald-400" title="Bluetooth Mesh Connected">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black">LOCAL</span>
              </div>
              <Signal className="w-3.5 h-3.5 text-slate-300" />
              <div className="flex items-center gap-0.5">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px]">85%</span>
              </div>
            </div>
          </div>

          {/* Active Screen Rendering */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* Header (rendered for Quest, Profile, Challenges) */}
            {activeScreen !== 'quiz' && (
              <Header
                profile={profile}
                soundEnabled={soundEnabled}
                onToggleSound={handleToggleSound}
                outdoorMode={outdoorMode}
                onToggleOutdoorMode={handleToggleOutdoorMode}
                onOpenSync={() => setActiveScreen('profile')}
                onOpenProfile={() => setActiveScreen('profile')}
              />
            )}

            {/* SCREEN 1: Learning Quest Dashboard */}
            {activeScreen === 'quest' && (
              <QuestMap
                nodes={nodes}
                onSelectNode={handleStartNodeLesson}
                outdoorMode={outdoorMode}
              />
            )}

            {/* SCREEN 2: Micro-Quiz & Lesson Screen */}
            {activeScreen === 'quiz' && (
              <QuizScreen
                activeNode={selectedNode}
                questions={sampleQuizQuestions}
                onExit={() => setActiveScreen('quest')}
                onCompleteQuiz={handleCompleteQuiz}
                outdoorMode={outdoorMode}
              />
            )}

            {/* SCREEN 3: Rewards & Offline Sync Profile */}
            {activeScreen === 'profile' && (
              <ProfileSyncScreen
                profile={profile}
                badges={badgesList}
                onSyncComplete={handleSyncComplete}
                outdoorMode={outdoorMode}
              />
            )}

            {/* SCREEN 4: P2P Classroom Challenges */}
            {activeScreen === 'challenges' && (
              <ChallengesScreen
                peers={peerStudents}
                outdoorMode={outdoorMode}
                onAwardRewards={(xp, gems) => {
                  setProfile((prev) => ({
                    ...prev,
                    xp: prev.xp + xp,
                    gems: prev.gems + gems,
                    offlineLessonsPending: prev.offlineLessonsPending + 1,
                  }));
                }}
              />
            )}

            {/* Persistent Chunky Bottom Navigation Bar (Hidden during active quiz for maximum focus) */}
            {activeScreen !== 'quiz' && (
              <BottomNav
                activeScreen={activeScreen}
                onChangeScreen={(screen) => setActiveScreen(screen)}
                outdoorMode={outdoorMode}
              />
            )}
          </div>

          {/* Android Home Indicator Pill */}
          <div className="bg-[#0d1a2d] pb-1 pt-0.5 flex justify-center shrink-0 z-40">
            <div className="w-28 h-1 bg-slate-600/60 rounded-full"></div>
          </div>
        </div>
      </main>

      {/* Design System & Accessibility Modal */}
      <DesignSystemModal
        isOpen={showDesignModal}
        onClose={() => setShowDesignModal(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  Users,
  Radio,
  Zap,
  Shield,
  Trophy,
  Play,
  CheckCircle2,
  RefreshCw,
  Send,
  Volume2,
  Clock,
  Sparkles,
  Award,
  AlertCircle,
  HelpCircle,
  Filter,
  UserPlus,
  ArrowRight,
  WifiOff,
} from 'lucide-react';
import {
  PeerStudent,
  AvailableChallenge,
  ChallengeResultRecord,
  QuizQuestion,
} from '../types';
import {
  availableChallengesList,
  initialChallengeResults,
  peerStudents as defaultPeers,
} from '../data/mockData';
import { soundEngine } from '../audio';
import { ChallengePlayModal } from './challenges/ChallengePlayModal';
import { SendChallengeModal } from './challenges/SendChallengeModal';
import { ChallengeBreakdownModal } from './challenges/ChallengeBreakdownModal';

interface ChallengesScreenProps {
  peers?: PeerStudent[];
  outdoorMode: boolean;
  onAwardRewards?: (xp: number, gems: number) => void;
}

type TabType = 'available' | 'friends' | 'results' | 'leaderboard';

export const ChallengesScreen: React.FC<ChallengesScreenProps> = ({
  peers = defaultPeers,
  outdoorMode,
  onAwardRewards,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [classList, setClassList] = useState<PeerStudent[]>(peers);
  const [resultsList, setResultsList] = useState<ChallengeResultRecord[]>(
    initialChallengeResults
  );
  const [isSyncingMesh, setIsSyncingMesh] = useState(false);
  const [syncStatusNotice, setSyncStatusNotice] = useState<string | null>(null);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [resultsFilter, setResultsFilter] = useState<string>('all');

  // Modal states
  const [playModalConfig, setPlayModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    category: string;
    opponent?: {
      name: string;
      avatar: string;
      score?: number;
      timeSeconds?: number;
    };
    questions: QuizQuestion[];
    timeSeconds: number;
    xpReward: number;
    gemsReward: number;
    originatingRecordId?: string; // If playing an incoming challenge request
  }>({
    isOpen: false,
    title: '',
    category: '',
    questions: [],
    timeSeconds: 60,
    xpReward: 50,
    gemsReward: 10,
  });

  const [sendModalConfig, setSendModalConfig] = useState<{
    isOpen: boolean;
    friend: PeerStudent | null;
    challenge: AvailableChallenge | null;
  }>({
    isOpen: false,
    friend: null,
    challenge: null,
  });

  const [selectedBreakdown, setSelectedBreakdown] =
    useState<ChallengeResultRecord | null>(null);

  // Simulate Mesh Exchange / Asynchronous sync
  const handleMeshSync = () => {
    soundEngine.playTap();
    setIsSyncingMesh(true);
    setSyncStatusNotice('Scanning for classmate Bluetooth packets...');

    setTimeout(() => {
      // Find any 'waiting_opponent' challenge and simulate peer completion
      setResultsList((prev) => {
        let updatedCount = 0;
        const newRecords = prev.map((rec) => {
          if (rec.status === 'waiting_opponent') {
            updatedCount++;
            // Zahra finished her turn!
            const oppScore = 75; // Less than user's 90 pts
            return {
              ...rec,
              status: 'completed' as const,
              opponentScore: oppScore,
              opponentTimeSeconds: 44,
              result: 'victory' as const,
              xpEarned: 80,
              gemsEarned: 20,
              lastUpdated: 'Just now (Mesh Packet Synced)',
              opponentAnswers: {
                201: 'opt-b',
                202: 'opt-a',
                203: 'opt-b',
              },
            };
          }
          return rec;
        });

        if (updatedCount > 0 && onAwardRewards) {
          onAwardRewards(80, 20);
        }

        return newRecords;
      });

      setIsSyncingMesh(false);
      soundEngine.playSyncDone();
      setSyncStatusNotice('Synced 1 duel packet with Zahra O. (Victory! 🏆)');
      setTimeout(() => setSyncStatusNotice(null), 4000);
    }, 1500);
  };

  // Launch Solo Play
  const handleStartSoloChallenge = (challenge: AvailableChallenge) => {
    soundEngine.playTap();
    setPlayModalConfig({
      isOpen: true,
      title: challenge.title,
      category: challenge.category,
      questions: challenge.questions,
      timeSeconds: challenge.timeSeconds,
      xpReward: challenge.xpReward,
      gemsReward: challenge.gemsReward,
    });
  };

  // Accept and Play Incoming Challenge
  const handleAcceptIncomingChallenge = (record: ChallengeResultRecord) => {
    soundEngine.playTap();
    setPlayModalConfig({
      isOpen: true,
      title: record.challengeTitle,
      category: record.category,
      opponent: {
        name: record.opponent.name,
        avatar: record.opponent.avatar,
        score: record.opponentScore,
        timeSeconds: record.opponentTimeSeconds,
      },
      questions: record.questions,
      timeSeconds: 60,
      xpReward: 60,
      gemsReward: 15,
      originatingRecordId: record.id,
    });
  };

  // Callback when student completes a challenge in the modal
  const handleChallengeFinished = (res: {
    score: number;
    timeSeconds: number;
    answers: { [qId: number]: string };
    xpEarned: number;
    gemsEarned: number;
    outcome?: 'victory' | 'defeat' | 'tie';
  }) => {
    // If this was an incoming challenge from a friend, resolve it
    if (playModalConfig.originatingRecordId) {
      setResultsList((prev) =>
        prev.map((rec) => {
          if (rec.id === playModalConfig.originatingRecordId) {
            return {
              ...rec,
              status: 'completed',
              myScore: res.score,
              myTimeSeconds: res.timeSeconds,
              result: res.outcome || 'victory',
              xpEarned: res.xpEarned,
              gemsEarned: res.gemsEarned,
              myAnswers: res.answers,
              lastUpdated: 'Just now (Completed Offline)',
            };
          }
          return rec;
        })
      );
    } else if (playModalConfig.opponent) {
      // Offline duel with opponent
      const newRec: ChallengeResultRecord = {
        id: `res-${Date.now()}`,
        challengeTitle: playModalConfig.title,
        category: playModalConfig.category,
        opponent: {
          name: playModalConfig.opponent.name,
          avatar: playModalConfig.opponent.avatar,
          school: 'Savannah Sunbeam Primary',
        },
        status: 'completed',
        myScore: res.score,
        myTimeSeconds: res.timeSeconds,
        opponentScore: playModalConfig.opponent.score,
        opponentTimeSeconds: playModalConfig.opponent.timeSeconds,
        result: res.outcome,
        xpEarned: res.xpEarned,
        gemsEarned: res.gemsEarned,
        packetId: `MESH-PKT-${Math.floor(1000 + Math.random() * 9000)}`,
        lastUpdated: 'Just now (Completed Offline)',
        questions: playModalConfig.questions,
        myAnswers: res.answers,
      };
      setResultsList((prev) => [newRec, ...prev]);
    } else {
      // Solo challenge completion
      const newRec: ChallengeResultRecord = {
        id: `res-solo-${Date.now()}`,
        challengeTitle: playModalConfig.title,
        category: playModalConfig.category,
        opponent: {
          name: 'Village Solo Run',
          avatar: '🎯',
          school: 'Local Offline Record',
        },
        status: 'completed',
        myScore: res.score,
        myTimeSeconds: res.timeSeconds,
        result: 'victory',
        xpEarned: res.xpEarned,
        gemsEarned: res.gemsEarned,
        packetId: `LOCAL-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        lastUpdated: 'Just now (Saved to Flash)',
        questions: playModalConfig.questions,
        myAnswers: res.answers,
      };
      setResultsList((prev) => [newRec, ...prev]);
    }

    if (onAwardRewards) {
      onAwardRewards(res.xpEarned, res.gemsEarned);
    }

    setPlayModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Open Send Challenge Modal
  const handleOpenSendModal = (
    friend?: PeerStudent,
    challenge?: AvailableChallenge
  ) => {
    soundEngine.playTap();
    setSendModalConfig({
      isOpen: true,
      friend: friend || classList[0],
      challenge: challenge || availableChallengesList[0],
    });
  };

  // Transmit Challenge request
  const handleSendChallengeComplete = (data: {
    peer: PeerStudent;
    challenge: AvailableChallenge;
    message: string;
    packetId: string;
  }) => {
    // Student creates an asynchronous challenge!
    // They can play right away or wait. Let's auto-generate a record in 'waiting_opponent'
    const newRecord: ChallengeResultRecord = {
      id: `duel-${Date.now()}`,
      challengeTitle: data.challenge.title,
      category: data.challenge.category,
      opponent: {
        name: data.peer.name,
        avatar: data.peer.avatarSeed,
        school: 'Savannah Sunbeam Primary',
      },
      status: 'waiting_opponent',
      myScore: 85,
      myTimeSeconds: 32,
      packetId: data.packetId,
      lastUpdated: 'Just now (Pending Peer Sync)',
      questions: data.challenge.questions,
      myAnswers: {
        [data.challenge.questions[0].id]: 'opt-b',
        [data.challenge.questions[1].id]: 'opt-a',
        [data.challenge.questions[2].id]: 'opt-a',
      },
    };

    setResultsList((prev) => [newRecord, ...prev]);
    setActiveTab('results');
  };

  // Toggle friend status
  const handleToggleFriend = (peerId: string) => {
    soundEngine.playTap();
    setClassList((prev) =>
      prev.map((p) => (p.id === peerId ? { ...p, isFriend: !p.isFriend } : p))
    );
  };

  // Audio speech for challenge overview
  const handleSpeakOverview = (text: string) => {
    soundEngine.speakText(text);
  };

  // Filtered lists
  const filteredChallenges =
    categoryFilter === 'All'
      ? availableChallengesList
      : availableChallengesList.filter(
          (c) =>
            c.category.toLowerCase().includes(categoryFilter.toLowerCase()) ||
            c.title.toLowerCase().includes(categoryFilter.toLowerCase())
        );

  const incomingCount = resultsList.filter((r) => r.status === 'incoming').length;
  const pendingCount = resultsList.filter(
    (r) => r.status === 'waiting_opponent'
  ).length;

  const filteredResults = resultsList.filter((r) => {
    if (resultsFilter === 'incoming') return r.status === 'incoming';
    if (resultsFilter === 'waiting') return r.status === 'waiting_opponent';
    if (resultsFilter === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div
      className={`flex-1 flex flex-col overflow-y-auto pb-24 select-none ${
        outdoorMode ? 'bg-black text-white' : 'bg-[#0a1424] text-white'
      } p-3 sm:p-4`}
    >
      {/* 1. TOP MESH STATUS & ASYNC PACKET QUEUE BANNER */}
      <div
        className={`rounded-3xl p-3.5 sm:p-4 border-2 shadow-[0_5px_0_#0c182b] mb-4 ${
          outdoorMode
            ? 'bg-black border-amber-400'
            : 'bg-gradient-to-r from-[#12233f] to-[#162c4e] border-[#22406d]'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-[0_3px_0_#b45309]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <span>OFFLINE BLUETOOTH MESH</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white">
                Classroom P2P Duel Network
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-full">
              0 MB Data
            </span>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 mb-3 leading-snug">
          Play rapid offline math challenges. Send duel invitations to classmates
          that sync asynchronously over Bluetooth without internet!
        </p>

        {/* Sync Status feedback notice */}
        {syncStatusNotice && (
          <div className="mb-2 bg-emerald-950/80 border border-emerald-400/80 text-emerald-200 text-xs font-bold rounded-xl p-2 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatusNotice}</span>
          </div>
        )}

        {/* Action: Simulate Mesh Exchange / Refresh Packets */}
        <button
          onClick={handleMeshSync}
          disabled={isSyncingMesh}
          className="w-full btn-chunky-slate py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncingMesh ? 'animate-spin' : ''}`}
          />
          <span>
            {isSyncingMesh
              ? 'Exchanging Bluetooth Packets...'
              : pendingCount > 0
              ? `Sync Mesh Packets (${pendingCount} Pending Opponents)`
              : 'Scan & Sync Nearby Classmate Packets'}
          </span>
        </button>
      </div>

      {/* 2. CHUNKY 4-TAB NAVIGATION */}
      <div className="grid grid-cols-4 gap-1.5 bg-[#0e1b30] p-1.5 rounded-2xl border border-[#1e385e] mb-4">
        {/* Tab 1: Available */}
        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('available');
          }}
          className={`py-2 px-1 rounded-xl text-center font-black text-[11px] transition-all relative flex flex-col items-center justify-center ${
            activeTab === 'available'
              ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>🎯 Duels</span>
          <span className="text-[9px] font-bold opacity-85">
            ({availableChallengesList.length})
          </span>
        </button>

        {/* Tab 2: Friends */}
        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('friends');
          }}
          className={`py-2 px-1 rounded-xl text-center font-black text-[11px] transition-all relative flex flex-col items-center justify-center ${
            activeTab === 'friends'
              ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>🤝 Friends</span>
          <span className="text-[9px] font-bold opacity-85">
            ({classList.length})
          </span>
        </button>

        {/* Tab 3: Results */}
        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('results');
          }}
          className={`py-2 px-1 rounded-xl text-center font-black text-[11px] transition-all relative flex flex-col items-center justify-center ${
            activeTab === 'results'
              ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1">
            <span>📜 Results</span>
            {incomingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </div>
          <span className="text-[9px] font-bold opacity-85">
            {incomingCount > 0 ? `${incomingCount} New!` : `(${resultsList.length})`}
          </span>
        </button>

        {/* Tab 4: Leaderboard */}
        <button
          onClick={() => {
            soundEngine.playTap();
            setActiveTab('leaderboard');
          }}
          className={`py-2 px-1 rounded-xl text-center font-black text-[11px] transition-all relative flex flex-col items-center justify-center ${
            activeTab === 'leaderboard'
              ? 'bg-amber-400 text-slate-950 shadow-[0_2px_0_#b45309]'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>🏆 Village</span>
          <span className="text-[9px] font-bold opacity-85">Ranks</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: AVAILABLE CHALLENGES */}
      {activeTab === 'available' && (
        <div className="space-y-3 animate-in fade-in">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'Multiplication', 'Fractions', 'Geometry', 'Science'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    soundEngine.playTap();
                    setCategoryFilter(cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap border transition-all ${
                    categoryFilter === cat
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-[#122238] text-slate-300 border-[#223d64]'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* List of Available Challenges */}
          <div className="space-y-3">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-[#122238] border-2 border-[#1f3a61] rounded-3xl p-4 shadow-[0_5px_0_#0a1320] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1b3459] border border-amber-400/40 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {challenge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-white leading-tight">
                          {challenge.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-amber-300 font-bold mt-0.5">
                        {challenge.category} • {challenge.questionsCount} Questions
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      100% Offline
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-emerald-900/60 text-emerald-200'
                          : challenge.difficulty === 'Medium'
                          ? 'bg-amber-900/60 text-amber-200'
                          : 'bg-rose-900/60 text-rose-200'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Challenge Specs & Rewards */}
                <div className="bg-[#0c1828] border border-[#1b3152] rounded-2xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold">
                      {challenge.timeSeconds}s timer
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                      <span>⚡</span>
                      <span>+{challenge.xpReward} XP</span>
                    </span>
                    <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                      <span>💎</span>
                      <span>+{challenge.gemsReward}</span>
                    </span>
                  </div>

                  {/* Audio read-aloud button for challenge */}
                  <button
                    onClick={() =>
                      handleSpeakOverview(
                        `${challenge.title}. ${challenge.description}. ${challenge.timeSeconds} seconds time limit.`
                      )
                    }
                    className="p-1.5 rounded-xl bg-[#172c49] text-amber-300 hover:text-white border border-amber-400/30 active:scale-95"
                    title="Listen to challenge rules"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Chunky Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleStartSoloChallenge(challenge)}
                    className="btn-chunky-slate py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Solo</span>
                  </button>

                  <button
                    onClick={() => handleOpenSendModal(undefined, challenge)}
                    className="btn-chunky-amber py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Challenge Friend</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FRIENDS & DUELS */}
      {activeTab === 'friends' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Savannah Classmates ({classList.length})</span>
            </h4>
            <span className="text-[10px] text-emerald-400 font-bold">
              Bluetooth Mesh Discovery
            </span>
          </div>

          <div className="space-y-2.5">
            {classList.map((peer) => (
              <div
                key={peer.id}
                className="bg-[#122238] border-2 border-[#1f375c] rounded-2xl p-3 flex items-center justify-between shadow-[0_4px_0_#0a131f]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl shrink-0">
                    {peer.avatarSeed}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-black text-white">{peer.name}</h5>
                      {peer.isFriend && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Friend
                        </span>
                      )}
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      {peer.grade || 'Grade 5'} • {peer.distance}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-300 mt-0.5">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      <span>{peer.score} pts</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 text-[10px]">
                        {peer.connectionType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenSendModal(peer)}
                    className="btn-chunky-amber px-3 py-2 rounded-xl font-black text-xs flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>DUEL</span>
                  </button>

                  <button
                    onClick={() => handleToggleFriend(peer.id)}
                    className="text-[10px] font-bold text-slate-400 hover:text-amber-300 underline"
                  >
                    {peer.isFriend ? 'Friend Added' : '+ Add Friend'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* P2P Mesh Explanation Card */}
          <div className="bg-[#0d1a2c] rounded-2xl p-3 border border-[#1b3252] text-xs text-slate-300 space-y-1">
            <span className="text-amber-400 font-black text-[11px] flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              <span>How Classmate Duels Work Offline</span>
            </span>
            <p className="text-[11px] text-slate-400 leading-snug">
              Devices exchange challenges over short-range Bluetooth without any cell towers or data costs. When you walk past a friend's desk, packets sync automatically in under 1 second.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: RESULTS & MATCH HISTORY */}
      {activeTab === 'results' && (
        <div className="space-y-3 animate-in fade-in">
          {/* Subfilter chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => {
                soundEngine.playTap();
                setResultsFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                resultsFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#122238] text-slate-300 border-[#223d64]'
              }`}
            >
              All ({resultsList.length})
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setResultsFilter('incoming');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1 ${
                resultsFilter === 'incoming'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#122238] text-slate-300 border-[#223d64]'
              }`}
            >
              <span>Incoming</span>
              {incomingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setResultsFilter('waiting');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                resultsFilter === 'waiting'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#122238] text-slate-300 border-[#223d64]'
              }`}
            >
              Pending ({pendingCount})
            </button>

            <button
              onClick={() => {
                soundEngine.playTap();
                setResultsFilter('completed');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                resultsFilter === 'completed'
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-[#122238] text-slate-300 border-[#223d64]'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {filteredResults.map((rec) => {
              // 1. Incoming Challenge Card
              if (rec.status === 'incoming') {
                return (
                  <div
                    key={rec.id}
                    className="bg-[#142642] border-2 border-amber-400 rounded-3xl p-4 shadow-[0_5px_0_#b45309] space-y-3 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Incoming Duel Challenge!</span>
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {rec.lastUpdated}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl shrink-0">
                        {rec.opponent.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">
                          {rec.opponent.name} challenged you!
                        </h4>
                        <p className="text-xs text-amber-300 font-bold">
                          {rec.challengeTitle}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Opponent Score: {rec.opponentScore} pts ({rec.opponentTimeSeconds}s)
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">
                      Take this challenge offline now! Beat {rec.opponent.name}'s score to earn +60 XP and +15 Gems.
                    </p>

                    <button
                      onClick={() => handleAcceptIncomingChallenge(rec)}
                      className="w-full btn-chunky-amber py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>Accept & Play Offline</span>
                    </button>
                  </div>
                );
              }

              // 2. Pending Asynchronous Mesh Sync Card
              if (rec.status === 'waiting_opponent') {
                return (
                  <div
                    key={rec.id}
                    className="bg-[#101e33] border-2 border-[#203c62] rounded-3xl p-4 shadow-[0_4px_0_#0a1320] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Pending Peer Mesh Sync</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rec.packetId}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white">
                          {rec.challengeTitle}
                        </h4>
                        <p className="text-xs text-slate-300">
                          Sent to {rec.opponent.name} • {rec.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-amber-400">
                          Your Score: {rec.myScore} pts
                        </span>
                        <p className="text-[10px] text-slate-400">
                          in {rec.myTimeSeconds}s
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#0b1524] rounded-xl p-2.5 text-[11px] text-slate-300 flex items-center justify-between border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Waiting for {rec.opponent.name}'s phone to sync</span>
                      </div>
                      <button
                        onClick={handleMeshSync}
                        className="text-[10px] font-black text-amber-400 hover:underline"
                      >
                        Simulate Encounter
                      </button>
                    </div>
                  </div>
                );
              }

              // 3. Completed Challenge Card
              const isWin = rec.result === 'victory';
              const isDraw = rec.result === 'tie';

              return (
                <div
                  key={rec.id}
                  className="bg-[#122238] border-2 border-[#1f375c] rounded-3xl p-4 shadow-[0_4px_0_#0a1320] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isWin
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                          : isDraw
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : 'bg-slate-800 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {isWin ? '🏆 VICTORY' : isDraw ? '🤝 DRAW' : '🥈 CLOSE MATCH'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {rec.lastUpdated}
                    </span>
                  </div>

                  {/* Head to head match score */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-white">
                        {rec.challengeTitle}
                      </h4>
                      <p className="text-xs text-slate-300">
                        vs {rec.opponent.name} • {rec.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#0a1424] px-3 py-1.5 rounded-2xl border border-[#1d3557]">
                      <div className="text-center">
                        <span className="text-[9px] font-bold text-slate-400 block">
                          You
                        </span>
                        <span className="text-sm font-black text-amber-300">
                          {rec.myScore || 0}
                        </span>
                      </div>
                      <span className="text-xs text-slate-600 font-bold">-</span>
                      <div className="text-center">
                        <span className="text-[9px] font-bold text-slate-400 block">
                          {rec.opponent.name.split(' ')[0]}
                        </span>
                        <span className="text-sm font-black text-slate-300">
                          {rec.opponentScore || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rewards and Breakdown button */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                      <span>+{rec.xpEarned || 30} XP</span>
                      <span>•</span>
                      <span>+{rec.gemsEarned || 5} Gems</span>
                    </div>

                    <button
                      onClick={() => {
                        soundEngine.playTap();
                        setSelectedBreakdown(rec);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1a3152] border border-amber-400/40 text-amber-300 hover:text-white font-black text-xs flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Review Answers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: VILLAGE LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-3 gap-2 pt-4 items-end text-center">
            {/* 2nd Place: Tariq */}
            <div className="bg-[#122238] border-2 border-slate-600 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-lg">🥈</span>
              <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-500 flex items-center justify-center text-xl my-1">
                🦊
              </div>
              <p className="text-xs font-black text-white truncate w-full">Tariq M.</p>
              <span className="text-[11px] font-black text-amber-300">180 pts</span>
              <span className="text-[9px] text-slate-400">Grade 5B</span>
            </div>

            {/* 1st Place: Zahra */}
            <div className="bg-gradient-to-b from-[#1c355e] to-[#122238] border-2 border-amber-400 rounded-2xl p-3 flex flex-col items-center shadow-[0_5px_0_#b45309] -translate-y-2">
              <span className="text-2xl">🥇</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-2xl my-1">
                🐘
              </div>
              <p className="text-xs font-black text-white truncate w-full">Zahra O.</p>
              <span className="text-xs font-black text-amber-400">210 pts</span>
              <span className="text-[9px] text-amber-300 font-bold">Class Star</span>
            </div>

            {/* 3rd Place: You (Amina) */}
            <div className="bg-[#122238] border-2 border-amber-400/50 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-lg">🥉</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-xl my-1">
                🦁
              </div>
              <p className="text-xs font-black text-amber-300 truncate w-full">
                Amina (You)
              </p>
              <span className="text-[11px] font-black text-white">175 pts</span>
              <span className="text-[9px] text-emerald-400 font-bold">3d Streak</span>
            </div>
          </div>

          {/* Full Board Table */}
          <div className="bg-[#0f1d31] border border-[#1d3557] rounded-3xl p-4 shadow-inner space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-black text-slate-300 uppercase text-[10px]">
                Student & Class
              </span>
              <span className="font-black text-slate-300 uppercase text-[10px]">
                Mesh Synced Score
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/40 font-bold text-amber-200">
                <span className="flex items-center gap-2">
                  <span>1. 🐘</span>
                  <span>Zahra O. (Savannah Sunbeam)</span>
                </span>
                <span>210 pts</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#14233c] text-slate-200 font-bold">
                <span className="flex items-center gap-2">
                  <span>2. 🦊</span>
                  <span>Tariq M. (Grade 5B)</span>
                </span>
                <span>180 pts</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#182c4b] border border-amber-400/50 text-amber-300 font-black">
                <span className="flex items-center gap-2">
                  <span>3. 🦁</span>
                  <span>Amina K. (You • Grade 5)</span>
                </span>
                <span>175 pts</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#14233c] text-slate-300">
                <span className="flex items-center gap-2">
                  <span>4. 🦒</span>
                  <span>Fatima S. (Grade 5A)</span>
                </span>
                <span>195 pts</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#14233c] text-slate-300">
                <span className="flex items-center gap-2">
                  <span>5. 🦉</span>
                  <span>Kofi B. (Grade 5B)</span>
                </span>
                <span>160 pts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALS */}
      {/* Active Offline Challenge Gameplay Player */}
      <ChallengePlayModal
        isOpen={playModalConfig.isOpen}
        onClose={() =>
          setPlayModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        title={playModalConfig.title}
        category={playModalConfig.category}
        opponent={playModalConfig.opponent}
        questions={playModalConfig.questions}
        timeLimitSeconds={playModalConfig.timeSeconds}
        xpReward={playModalConfig.xpReward}
        gemsReward={playModalConfig.gemsReward}
        onFinish={handleChallengeFinished}
        outdoorMode={outdoorMode}
      />

      {/* Send Challenge to Friend Sheet */}
      <SendChallengeModal
        isOpen={sendModalConfig.isOpen}
        onClose={() =>
          setSendModalConfig((prev) => ({ ...prev, isOpen: false }))
        }
        friends={classList}
        challenges={availableChallengesList}
        initialSelectedFriend={sendModalConfig.friend}
        initialSelectedChallenge={sendModalConfig.challenge}
        onSendChallenge={handleSendChallengeComplete}
        outdoorMode={outdoorMode}
      />

      {/* Question by Question Match Breakdown Modal */}
      <ChallengeBreakdownModal
        record={selectedBreakdown}
        isOpen={!!selectedBreakdown}
        onClose={() => setSelectedBreakdown(null)}
        outdoorMode={outdoorMode}
      />
    </div>
  );
};

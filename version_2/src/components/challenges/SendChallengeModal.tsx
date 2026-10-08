import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Award,
} from 'lucide-react';
import { PeerStudent, AvailableChallenge } from '../../types';
import { soundEngine } from '../../audio';

interface SendChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: PeerStudent[];
  challenges: AvailableChallenge[];
  initialSelectedFriend?: PeerStudent | null;
  initialSelectedChallenge?: AvailableChallenge | null;
  onSendChallenge: (data: {
    peer: PeerStudent;
    challenge: AvailableChallenge;
    message: string;
    packetId: string;
  }) => void;
  outdoorMode: boolean;
}

export const SendChallengeModal: React.FC<SendChallengeModalProps> = ({
  isOpen,
  onClose,
  friends,
  challenges,
  initialSelectedFriend,
  initialSelectedChallenge,
  onSendChallenge,
  outdoorMode,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<PeerStudent>(
    initialSelectedFriend || friends[0]
  );
  const [selectedChallenge, setSelectedChallenge] = useState<AvailableChallenge>(
    initialSelectedChallenge || challenges[0]
  );
  const [wagerMessage, setWagerMessage] = useState<string>('Ready for a fast math duel? ⚡');
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedPacketId, setGeneratedPacketId] = useState('');

  if (!isOpen) return null;

  const quickMessages = [
    'Ready for a fast math duel? ⚡',
    'Let us see who solves fastest! 🥭',
    'Classroom champion showdown! 🏆',
    'Village friendship challenge! 🤝',
  ];

  const handleTransmit = () => {
    soundEngine.playTap();
    setIsTransmitting(true);

    const packetId = `MESH-DUEL-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedPacketId(packetId);

    setTimeout(() => {
      setIsTransmitting(false);
      setIsSuccess(true);
      soundEngine.playSyncDone();

      setTimeout(() => {
        onSendChallenge({
          peer: selectedFriend,
          challenge: selectedChallenge,
          message: wagerMessage,
          packetId,
        });
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border-3 ${
          outdoorMode
            ? 'bg-black border-amber-400 text-white'
            : 'bg-[#0f1d32] border-[#223e66] text-slate-100 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="bg-[#142642] px-4 py-3 border-b border-[#223e66] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              <Send className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">
                Send Offline Duel Request
              </h3>
              <p className="text-[10px] text-slate-300">
                Transmitted via Local Bluetooth Mesh (0 MB Data)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-[#1b3152] border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-[0_5px_0_#065f46]">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-base font-black text-white">
                Duel Request Queued to Mesh!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Encrypted payload <code className="text-amber-300 font-mono text-[11px]">{generatedPacketId}</code> (186 bytes) will sync when {selectedFriend.name} is nearby.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Choose Friend / Classmate */}
              <div>
                <label className="text-[11px] font-black uppercase text-amber-400 flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>1. Choose Classmate ({friends.length} nearby)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Mesh Ready</span>
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {friends.map((friend) => {
                    const isSelected = selectedFriend.id === friend.id;
                    return (
                      <button
                        key={friend.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedFriend(friend);
                        }}
                        className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2.5 active:scale-95 ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-white shadow-[0_3px_0_#b45309]'
                            : 'bg-[#14233c] border-[#223d64] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-lg shrink-0">
                          {friend.avatarSeed}
                        </span>
                        <div className="truncate">
                          <p className="text-xs font-black truncate">{friend.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {friend.grade || 'Grade 5'} • {friend.distance}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Challenge Subject */}
              <div>
                <label className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5 mb-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>2. Select Duel Subject</span>
                </label>

                <div className="space-y-2">
                  {challenges.map((c) => {
                    const isSelected = selectedChallenge.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playTap();
                          setSelectedChallenge(c);
                        }}
                        className={`w-full p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between active:scale-95 ${
                          isSelected
                            ? 'bg-amber-400/15 border-amber-400 text-white shadow-[0_3px_0_#b45309]'
                            : 'bg-[#14233c] border-[#203a60] text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-[#1d3558] flex items-center justify-center text-base">
                            {c.icon}
                          </span>
                          <div>
                            <p className="text-xs font-black text-white leading-tight">
                              {c.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {c.category} • {c.timeSeconds}s time limit
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-extrabold text-amber-300 block">
                            +{c.xpReward} XP
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#1f375a] text-slate-300 border border-slate-600">
                            {c.difficulty}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Friendly Note / Encouragement */}
              <div>
                <label className="text-[11px] font-black uppercase text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3. Friendly Encouragement</span>
                </label>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickMessages.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setWagerMessage(msg);
                      }}
                      className={`text-[10px] font-bold px-2 py-1 rounded-xl border transition-all ${
                        wagerMessage === msg
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-[#15253e] text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {msg}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={wagerMessage}
                  onChange={(e) => setWagerMessage(e.target.value)}
                  maxLength={60}
                  className="w-full bg-[#0d1828] border-2 border-[#203759] rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-amber-400 placeholder-slate-500"
                  placeholder="Type an encouraging note..."
                />
              </div>

              {/* Low Bandwidth Packet Specs Banner */}
              <div className="bg-[#0b1524] rounded-2xl p-3 border border-[#1b3252] text-[11px] text-slate-400 space-y-1.5">
                <div className="flex items-center justify-between text-emerald-400 font-black">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>P2P Protocol: Store-and-Forward Mesh</span>
                  </div>
                  <span>~186 Bytes</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  This challenge will be saved in your offline outbox. When {selectedFriend.name}'s phone passes within 15 meters, the duel packet exchanges asynchronously without internet.
                </p>
              </div>

              {/* Transmit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleTransmit}
                  disabled={isTransmitting}
                  className="w-full btn-chunky-amber py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <Send className={`w-4 h-4 ${isTransmitting ? 'animate-bounce' : ''}`} />
                  <span>
                    {isTransmitting
                      ? 'Transmitting via Local Mesh...'
                      : `Send Challenge to ${selectedFriend.name}`}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

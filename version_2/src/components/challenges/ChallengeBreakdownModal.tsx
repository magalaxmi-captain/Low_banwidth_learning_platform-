import React from 'react';
import {
  X,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Clock,
  Zap,
  Sparkles,
  Award,
} from 'lucide-react';
import { ChallengeResultRecord } from '../../types';
import { soundEngine } from '../../audio';

interface ChallengeBreakdownModalProps {
  record: ChallengeResultRecord | null;
  isOpen: boolean;
  onClose: () => void;
  outdoorMode: boolean;
}

export const ChallengeBreakdownModal: React.FC<ChallengeBreakdownModalProps> = ({
  record,
  isOpen,
  onClose,
  outdoorMode,
}) => {
  if (!isOpen || !record) return null;

  const isWin = record.result === 'victory';
  const isDraw = record.result === 'tie';

  const handleSpeak = (text: string) => {
    soundEngine.speakText(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border-3 ${
          outdoorMode
            ? 'bg-black border-amber-400 text-white'
            : 'bg-[#0e1c31] border-[#223f68] text-slate-100 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div className="bg-[#142642] px-4 py-3 border-b border-[#223e66] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-xs ${
                isWin
                  ? 'bg-emerald-400 text-slate-950'
                  : isDraw
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {isWin ? '🏆' : isDraw ? '🤝' : '🥈'}
            </span>
            <div>
              <h3 className="text-sm font-black text-white leading-tight">
                Duel Match Breakdown
              </h3>
              <p className="text-[10px] text-slate-300">
                vs {record.opponent.name} • {record.category}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              soundEngine.stopSpeech();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-[#1c3358] border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Head to head comparison scoreboard */}
          <div className="bg-[#122238] border-2 border-[#203c62] rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              {/* You */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-xl mb-1">
                  🦁
                </div>
                <p className="text-xs font-black text-amber-300">Amina (You)</p>
                <p className="text-2xl font-black text-white">{record.myScore || 0}</p>
                <span className="text-[10px] text-slate-400">
                  {record.myTimeSeconds || 35}s
                </span>
              </div>

              {/* VS Pill */}
              <div className="flex flex-col items-center px-3">
                <span className="bg-[#1e3455] px-2 py-0.5 rounded-full text-[10px] font-black text-slate-300 border border-slate-600">
                  VS
                </span>
                <span
                  className={`text-[10px] font-black mt-2 uppercase px-2 py-0.5 rounded-md ${
                    isWin
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                      : isDraw
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 border border-slate-600'
                  }`}
                >
                  {isWin ? 'VICTORY' : isDraw ? 'DRAW' : 'DEFEAT'}
                </span>
              </div>

              {/* Opponent */}
              <div className="text-center flex-1">
                <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center text-xl mb-1">
                  {record.opponent.avatar}
                </div>
                <p className="text-xs font-black text-slate-300">
                  {record.opponent.name}
                </p>
                <p className="text-2xl font-black text-slate-300">
                  {record.opponentScore || 0}
                </p>
                <span className="text-[10px] text-slate-400">
                  {record.opponentTimeSeconds || 40}s
                </span>
              </div>
            </div>

            {/* Packet Metadata */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
              <span>Handshake: {record.packetId}</span>
              <span className="text-emerald-400 font-bold">Mesh Verified</span>
            </div>
          </div>

          {/* Question by Question Review */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Questions & Answers ({record.questions.length})</span>
            </h4>

            {record.questions.map((q, idx) => {
              const mySelectedOptId = record.myAnswers?.[q.id];
              const oppSelectedOptId = record.opponentAnswers?.[q.id];

              const correctOpt = q.options.find((o) => o.isCorrect);
              const myOpt = q.options.find((o) => o.id === mySelectedOptId);
              const oppOpt = q.options.find((o) => o.id === oppSelectedOptId);

              const iWasCorrect = myOpt?.isCorrect ?? false;
              const oppWasCorrect = oppOpt?.isCorrect ?? false;

              return (
                <div
                  key={q.id}
                  className="bg-[#122238] border border-[#213c63] rounded-2xl p-3.5 space-y-2.5 text-xs shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black text-amber-300">
                      Q{idx + 1}. {q.category}
                    </span>

                    <button
                      onClick={() => handleSpeak(q.audioText || q.prompt)}
                      className="p-1 rounded-lg bg-[#1a3152] text-amber-300 hover:text-white border border-amber-400/30"
                      title="Listen to question"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-bold text-white leading-tight">{q.prompt}</p>

                  {/* Answers Comparison */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div
                      className={`p-2 rounded-xl border ${
                        iWasCorrect
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <span className="text-[9px] font-black block uppercase text-slate-400">
                        Your Pick:
                      </span>
                      <p className="font-extrabold truncate">
                        {myOpt ? myOpt.label : 'No answer'}
                      </p>
                      <span className="text-[9px] font-bold">
                        {iWasCorrect ? '✓ Correct' : '✗ Missed'}
                      </span>
                    </div>

                    <div
                      className={`p-2 rounded-xl border ${
                        oppWasCorrect
                          ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                      }`}
                    >
                      <span className="text-[9px] font-black block uppercase text-slate-400">
                        {record.opponent.name}:
                      </span>
                      <p className="font-extrabold truncate">
                        {oppOpt ? oppOpt.label : 'Pending'}
                      </p>
                      <span className="text-[9px] font-bold">
                        {oppWasCorrect ? '✓ Correct' : '✗ Missed'}
                      </span>
                    </div>
                  </div>

                  {/* Pedagogical Explanation */}
                  <div className="bg-[#0b1626] rounded-xl p-2 text-[11px] text-slate-300 border border-slate-800">
                    <span className="text-amber-400 font-black block text-[10px]">
                      Key Takeaway:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Close button */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundEngine.playTap();
                onClose();
              }}
              className="w-full btn-chunky-slate py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>Close Breakdown</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

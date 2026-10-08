import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Clock,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Radio,
  Zap,
} from 'lucide-react';
import { QuizQuestion, PeerStudent } from '../../types';
import { soundEngine } from '../../audio';

interface ChallengePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  opponent?: {
    name: string;
    avatar: string;
    score?: number;
    timeSeconds?: number;
  };
  questions: QuizQuestion[];
  timeLimitSeconds: number;
  xpReward: number;
  gemsReward: number;
  onFinish: (result: {
    score: number;
    timeSeconds: number;
    answers: { [qId: number]: string };
    xpEarned: number;
    gemsEarned: number;
    outcome?: 'victory' | 'defeat' | 'tie';
  }) => void;
  outdoorMode: boolean;
}

export const ChallengePlayModal: React.FC<ChallengePlayModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  opponent,
  questions,
  timeLimitSeconds,
  xpReward,
  gemsReward,
  onFinish,
  outdoorMode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: string }>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  // Reset states when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setSelectedOption(null);
      setHasAnswered(false);
      setUserAnswers({});
      setScore(0);
      setTimeLeft(timeLimitSeconds);
      setIsCompleted(false);
    }
  }, [isOpen, timeLimitSeconds]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isCompleted) return;

    if (timeLeft <= 0) {
      handleCompleteDuel();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCompleteDuel();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, timeLeft]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex] || questions[0];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const handleSpeakQuestion = () => {
    if (isReadingSpeech) {
      soundEngine.stopSpeech();
      setIsReadingSpeech(false);
    } else {
      setIsReadingSpeech(true);
      soundEngine.speakText(currentQ.audioText || currentQ.prompt, () => {
        setIsReadingSpeech(false);
      });
    }
  };

  const handleSelectOption = (optId: string) => {
    if (hasAnswered) return;
    soundEngine.playTap();
    setSelectedOption(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || hasAnswered) return;

    const opt = currentQ.options.find((o) => o.id === selectedOption);
    const isCorrect = opt?.isCorrect ?? false;

    setHasAnswered(true);
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: selectedOption }));

    if (isCorrect) {
      soundEngine.playCorrect();
      // Calculate score based on accuracy and speed
      const questionPoints = Math.round(100 / questions.length);
      setScore((prev) => prev + questionPoints);
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNext = () => {
    soundEngine.playTap();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      handleCompleteDuel();
    }
  };

  const handleCompleteDuel = () => {
    setIsCompleted(true);
    soundEngine.stopSpeech();

    const elapsed = timeLimitSeconds - timeLeft;
    let outcome: 'victory' | 'defeat' | 'tie' | undefined = undefined;
    let earnedXp = xpReward;
    let earnedGems = gemsReward;

    if (opponent && opponent.score !== undefined) {
      if (score > opponent.score) {
        outcome = 'victory';
        earnedXp = xpReward + 25;
        earnedGems = gemsReward + 5;
        soundEngine.playCorrect();
        setTimeout(() => soundEngine.playGem(), 300);
      } else if (score < opponent.score) {
        outcome = 'defeat';
        earnedXp = Math.round(xpReward * 0.4);
        earnedGems = 2;
        soundEngine.playTap();
      } else {
        outcome = 'tie';
        earnedXp = Math.round(xpReward * 0.8);
        earnedGems = Math.round(gemsReward * 0.8);
        soundEngine.playGem();
      }
    } else {
      soundEngine.playCorrect();
      setTimeout(() => soundEngine.playGem(), 300);
    }
  };

  const handleFinalClaim = () => {
    soundEngine.playTap();
    const elapsed = timeLimitSeconds - timeLeft;
    let outcome: 'victory' | 'defeat' | 'tie' | undefined = undefined;
    let earnedXp = xpReward;
    let earnedGems = gemsReward;

    if (opponent && opponent.score !== undefined) {
      if (score > opponent.score) {
        outcome = 'victory';
        earnedXp = xpReward + 25;
        earnedGems = gemsReward + 5;
      } else if (score < opponent.score) {
        outcome = 'defeat';
        earnedXp = Math.round(xpReward * 0.4);
        earnedGems = 2;
      } else {
        outcome = 'tie';
        earnedXp = Math.round(xpReward * 0.8);
        earnedGems = Math.round(gemsReward * 0.8);
      }
    }

    onFinish({
      score,
      timeSeconds: elapsed,
      answers: userAnswers,
      xpEarned: earnedXp,
      gemsEarned: earnedGems,
      outcome,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md max-h-[95vh] flex flex-col rounded-3xl overflow-hidden border-3 ${
          outdoorMode
            ? 'bg-black border-amber-400 text-white'
            : 'bg-[#0e1b30] border-[#223f68] text-slate-100 shadow-2xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="bg-[#142642] px-4 py-3 border-b border-[#223e66] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
              ⚡
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white leading-tight truncate max-w-[200px]">
                  {title}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  OFFLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {opponent ? `Duel vs ${opponent.name}` : category}
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
            aria-label="Exit Challenge"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Challenge State: Active gameplay vs Final Results */}
        {!isCompleted ? (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {/* Status Bar with Timer and Progress */}
            <div className="grid grid-cols-2 gap-2">
              {/* Question progress */}
              <div className="bg-[#122238] border border-[#23416a] rounded-2xl p-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    Question
                  </span>
                  <p className="text-sm font-black text-amber-300">
                    {currentIndex + 1} / {questions.length}
                  </p>
                </div>
                <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Timer Pill */}
              <div
                className={`border rounded-2xl p-2.5 flex items-center justify-between transition-colors ${
                  timeLeft <= 10
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-[#122238] border-[#23416a] text-slate-200'
                }`}
              >
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    Time Left
                  </span>
                  <p className="text-sm font-black flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft}s</span>
                  </p>
                </div>
                <span className="text-[11px] font-black text-amber-400">
                  {score} pts
                </span>
              </div>
            </div>

            {/* If Opponent present: Peer comparison card */}
            {opponent && (
              <div className="bg-[#142642]/80 border border-[#274875] rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-lg">
                    {opponent.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{opponent.name}</p>
                    <p className="text-[10px] text-slate-300">
                      {opponent.score !== undefined
                        ? `Target: ${opponent.score} pts (${opponent.timeSeconds}s)`
                        : 'Asynchronous Duel • Pending Score'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {opponent.score !== undefined ? 'Target Score Set' : 'Async Match'}
                </span>
              </div>
            )}

            {/* Question Card */}
            <div className="bg-[#122238] border-2 border-[#244572] rounded-3xl p-4 shadow-[0_4px_0_#0a131f]">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                  {currentQ.category}
                </span>

                {/* Read Aloud voice button */}
                <button
                  onClick={handleSpeakQuestion}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 border transition-all active:scale-95 ${
                    isReadingSpeech
                      ? 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
                      : 'bg-[#1a3152] text-amber-300 border-amber-400/30 hover:border-amber-400'
                  }`}
                  aria-label="Read Question Aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">
                    {isReadingSpeech ? 'Reading...' : 'Listen'}
                  </span>
                </button>
              </div>

              {/* Prompt Text */}
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {currentQ.prompt}
              </h4>

              {/* Visual Aid (Low-Bandwidth SVG/CSS representations) */}
              {currentQ.visualType === 'mango_multiplication' && (
                <div className="mt-3 bg-[#0a1424] border border-[#1d375d] rounded-2xl p-3 flex flex-wrap justify-center items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-[#14233c] px-2.5 py-1.5 rounded-xl border border-amber-500/40">
                    <span className="text-xl">🥭🥭🥭🥭</span>
                  </div>
                  <span className="text-amber-400 font-black text-sm">×</span>
                  <div className="flex items-center gap-1 bg-[#14233c] px-2.5 py-1.5 rounded-xl border border-amber-500/40">
                    <span className="text-xs font-black text-white">3 Baskets</span>
                  </div>
                </div>
              )}

              {currentQ.visualType === 'fractions' && (
                <div className="mt-3 bg-[#0a1424] border border-[#1d375d] rounded-2xl p-3 flex justify-center items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-amber-400 overflow-hidden flex flex-wrap bg-[#14233c] relative">
                    <div className="w-1/2 h-full bg-amber-400/90 border-r-2 border-slate-900 flex items-center justify-center font-black text-slate-950 text-xs">
                      ½
                    </div>
                    <div className="w-1/2 h-full bg-[#14233c] flex items-center justify-center font-bold text-slate-400 text-xs">
                      ½
                    </div>
                  </div>
                  <span className="text-xs text-slate-300 font-bold max-w-[170px]">
                    Village Honey Flatbread (Shared equally)
                  </span>
                </div>
              )}

              {currentQ.visualType === 'geometry_shapes' && (
                <div className="mt-3 bg-[#0a1424] border border-[#1d375d] rounded-2xl p-2.5 flex items-center justify-center gap-3 text-xl">
                  <span>🔴</span>
                  <span>🟡</span>
                  <span>🟡</span>
                  <span>🔴</span>
                  <span>🟡</span>
                  <span className="w-7 h-7 rounded-lg border-2 border-dashed border-amber-400 flex items-center justify-center text-xs text-amber-300 font-black">
                    ?
                  </span>
                </div>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle =
                  'bg-[#14253e] border-2 border-[#24446f] text-slate-100 hover:border-amber-400/60 shadow-[0_4px_0_#0a131f]';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    optionStyle =
                      'bg-emerald-950 border-2 border-emerald-400 text-emerald-100 shadow-[0_4px_0_#064e3b]';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle =
                      'bg-rose-950 border-2 border-rose-400 text-rose-100 shadow-[0_4px_0_#4c0519]';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-amber-400/20 border-2 border-amber-400 text-amber-200 shadow-[0_4px_0_#b45309]';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={hasAnswered}
                    className={`w-full min-h-[52px] p-3 rounded-2xl font-black text-xs sm:text-sm text-left flex items-center justify-between transition-all active:scale-[0.98] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black border ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 border-amber-300'
                            : 'bg-[#1b3152] text-slate-300 border-[#2d4e7d]'
                        }`}
                      >
                        {opt.id.slice(-1).toUpperCase()}
                      </span>
                      <span>{opt.label}</span>
                    </div>

                    {hasAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !opt.isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on answered */}
            {hasAnswered && (
              <div className="bg-[#12233c] border border-amber-400/40 rounded-2xl p-3 text-xs text-slate-200 animate-in fade-in">
                <span className="font-black text-amber-400 block mb-1">
                  Explanation:
                </span>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Action Chunky Buttons */}
            <div className="pt-2">
              {!hasAnswered ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption}
                  className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 ${
                    selectedOption
                      ? 'btn-chunky-amber'
                      : 'bg-slate-700/60 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Submit Answer</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full btn-chunky-emerald py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                >
                  <span>
                    {currentIndex + 1 < questions.length
                      ? 'Next Question'
                      : 'See Match Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Challenge Completed Screen */
          <div className="flex-1 flex flex-col overflow-y-auto p-5 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl shadow-[0_5px_0_#b45309]">
              {opponent && opponent.score !== undefined ? (
                score > opponent.score ? (
                  '🏆'
                ) : score < opponent.score ? (
                  '🥈'
                ) : (
                  '🤝'
                )
              ) : (
                '📦'
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {opponent && opponent.score !== undefined
                  ? score > opponent.score
                    ? 'Victory! Match Won!'
                    : score < opponent.score
                    ? 'Good Effort!'
                    : 'Exciting Draw!'
                  : 'Challenge Completed Offline!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {opponent && opponent.score !== undefined
                  ? `Against ${opponent.name} from ${category}`
                  : 'Packet stored locally. Will sync asynchronously to classroom mesh.'}
              </p>
            </div>

            {/* Comparison Cards if Peer Duel */}
            {opponent && opponent.score !== undefined ? (
              <div className="grid grid-cols-2 gap-3 bg-[#122238] border-2 border-[#244572] rounded-2xl p-3.5">
                <div className="bg-[#162a45] rounded-xl p-2.5 text-center border border-amber-400/40">
                  <span className="text-[10px] font-black uppercase text-amber-300">
                    You (Amina)
                  </span>
                  <p className="text-xl font-black text-white mt-0.5">{score} pts</p>
                  <span className="text-[10px] text-slate-300">
                    {timeLimitSeconds - timeLeft}s taken
                  </span>
                </div>

                <div className="bg-[#162a45] rounded-xl p-2.5 text-center border border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-400">
                    {opponent.name}
                  </span>
                  <p className="text-xl font-black text-slate-200 mt-0.5">
                    {opponent.score} pts
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {opponent.timeSeconds || 45}s taken
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-[#122238] border-2 border-[#244572] rounded-2xl p-3.5 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black">
                  <Radio className="w-4 h-4" />
                  <span>Local Mesh Packet Created</span>
                </div>
                <p className="text-2xl font-black text-amber-400">{score} Points</p>
                <p className="text-[10px] text-slate-300">
                  Finished in {timeLimitSeconds - timeLeft}s • 0 MB Cellular Data Used
                </p>
              </div>
            )}

            {/* Rewards Pill */}
            <div className="bg-[#152844] border border-[#23426e] rounded-2xl p-3 flex items-center justify-around">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-black text-sm">⚡</span>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    XP Gained
                  </span>
                  <span className="text-sm font-black text-white">
                    +{xpReward} XP
                  </span>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-slate-700" />

              <div className="flex items-center gap-2">
                <span className="text-amber-300 font-black text-sm">💎</span>
                <div className="text-left">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    Gems Won
                  </span>
                  <span className="text-sm font-black text-white">
                    +{gemsReward} Gems
                  </span>
                </div>
              </div>
            </div>

            {/* Asynchronous Note */}
            <div className="bg-[#0b1626] rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 text-left">
              <Radio className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Offline Results saved. When nearby classmates enter Bluetooth range,
                scores update automatically without internet.
              </span>
            </div>

            {/* Claim and finish button */}
            <button
              onClick={handleFinalClaim}
              className="w-full btn-chunky-amber py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Collect Rewards & Return</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

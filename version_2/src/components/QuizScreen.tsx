import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Check, Star, Sparkles, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, QuestNode } from '../types';
import { soundEngine, speakText, stopSpeaking } from '../audio';

interface QuizScreenProps {
  activeNode: QuestNode;
  questions: QuizQuestion[];
  onExit: () => void;
  onCompleteQuiz: (xpGained: number, gemsGained: number) => void;
  outdoorMode: boolean;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  activeNode,
  questions,
  onExit,
  onCompleteQuiz,
  outdoorMode,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [feedbackForceState, setFeedbackForceState] = useState<boolean>(true); // initially preview requested feedback state

  const question = questions[currentQIndex] || questions[0];
  const progressPercent = ((currentQIndex + 1) / questions.length) * 100;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // When feedbackForceState is active on first render, preset Option B ("12 Mangoes") in Correct Answer state
  useEffect(() => {
    if (feedbackForceState && !selectedOptionId) {
      // Find correct option
      const correct = question.options.find((o) => o.isCorrect);
      if (correct) {
        setSelectedOptionId(correct.id);
        setIsSubmitted(true);
      }
    }
  }, [feedbackForceState, question]);

  const handlePlayAudio = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    soundEngine.playTap();
    setIsSpeaking(true);
    speakText(
      question.audioText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmitted) return;
    soundEngine.playTap();
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    const chosen = question.options.find((o) => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      soundEngine.playCorrect();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playTap();
    stopSpeaking();
    setIsSpeaking(false);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setFeedbackForceState(false);
    } else {
      // Completed quiz!
      soundEngine.playGem();
      onCompleteQuiz(activeNode.xpReward, activeNode.gemsReward);
    }
  };

  // Reset to interactive mode if user wants to play fresh
  const handleResetQuestion = () => {
    soundEngine.playTap();
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setFeedbackForceState(false);
    stopSpeaking();
    setIsSpeaking(false);
  };

  const chosenOption = question.options.find((o) => o.id === selectedOptionId);
  const isCorrect = chosenOption?.isCorrect ?? false;

  return (
    <div className="relative flex-1 flex flex-col justify-between bg-[#0b1626] text-white select-none overflow-y-auto">
      {/* 1. TOP BAR */}
      <div className="bg-[#0f1f38] border-b-2 border-[#1e3456] px-4 py-3 shrink-0 shadow-md">
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Exit / Pause Button */}
          <button
            onClick={() => {
              soundEngine.playTap();
              setShowExitConfirm(true);
            }}
            className="w-10 h-10 rounded-xl bg-[#162744] border border-[#274673] flex items-center justify-center text-slate-300 hover:text-white active:scale-90"
            aria-label="Exit Lesson"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Lesson Title & Step */}
          <div className="flex-1 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              {activeNode.topic}
            </span>
            <div className="text-xs font-black text-slate-200">
              Question {currentQIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Heart / Energy Indicator */}
          <div className="flex items-center gap-1 bg-[#1a2d4b] px-2.5 py-1 rounded-xl border border-red-500/30">
            <span className="text-red-400 text-sm">❤️</span>
            <span className="text-xs font-black text-red-300">3</span>
          </div>
        </div>

        {/* Thick Horizontal Progress Bar */}
        <div className="w-full bg-[#162842] h-3.5 rounded-full p-0.5 border border-[#25426c] relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300 relative shadow-inner"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Gloss highlight */}
            <div className="absolute inset-0 bg-white/20 rounded-full h-1/2"></div>
          </div>
        </div>

        {/* State preview toggle pill for testing */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Offline Micro-Quiz Engine
          </span>
          <button
            onClick={() => {
              if (feedbackForceState) {
                handleResetQuestion();
              } else {
                const correct = question.options.find((o) => o.isCorrect);
                if (correct) {
                  setSelectedOptionId(correct.id);
                  setIsSubmitted(true);
                  setFeedbackForceState(true);
                }
              }
            }}
            className="text-amber-300 font-bold hover:underline"
          >
            {feedbackForceState ? 'Switch to interactive' : 'Preview feedback state'}
          </button>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-start max-w-md mx-auto w-full">
        {/* Large Readable Question Card */}
        <div className="bg-[#12223a] border-2 border-[#1e3b66] rounded-3xl p-4 shadow-[0_6px_0_#0a1424] mb-4">
          <div className="flex items-start gap-3">
            {/* Audio Play Button for Text-To-Speech Accessibility */}
            <button
              onClick={handlePlayAudio}
              className={`w-13 h-13 shrink-0 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isSpeaking
                  ? 'bg-amber-400 text-slate-950 shadow-[0_3px_0_#b45309] ring-4 ring-amber-400/40 animate-pulse'
                  : 'bg-gradient-to-b from-[#25416c] to-[#1a2f50] border-2 border-amber-400/50 text-amber-300 shadow-[0_4px_0_#0d192b] hover:border-amber-400'
              }`}
              title="Listen to question (Text to Speech)"
              aria-label="Listen to question aloud"
            >
              <Volume2 className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[9px] font-black mt-0.5">AUDIO</span>
            </button>

            {/* Question Text */}
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block mb-1">
                READ OR LISTEN CAREFULLY
              </span>
              <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                {question.prompt}
              </h2>
            </div>
          </div>
        </div>

        {/* Lightweight SVG Visual Learning Aid (Zero Bandwidth) */}
        <div className="bg-[#0f1d31] border border-[#1e3456] rounded-2xl p-3 mb-4 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2 px-1">
            <span>VISUAL AID</span>
            <span className="text-amber-300">Tap to count</span>
          </div>

          {/* Multiplication Baskets SVG */}
          {question.visualType === 'mango_multiplication' && (
            <div className="grid grid-cols-3 gap-2 py-2">
              {[1, 2, 3].map((basketNum) => (
                <div
                  key={basketNum}
                  className="bg-[#162744] border-2 border-amber-500/40 rounded-2xl p-2 flex flex-col items-center shadow-sm"
                >
                  <span className="text-[10px] font-black text-amber-300 mb-1">
                    Basket {basketNum}
                  </span>
                  {/* 4 Mangoes grid inside each basket */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#101c30] rounded-xl border border-slate-700">
                    {[1, 2, 3, 4].map((mango) => (
                      <div
                        key={mango}
                        className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border border-amber-300 flex items-center justify-center text-[9px] font-black text-slate-900 shadow-xs"
                      >
                        🥭
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1">
                    4 mangoes
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Fractions Visual SVG */}
          {question.visualType === 'fractions' && (
            <div className="flex justify-center items-center py-3">
              <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden relative shadow-md bg-[#162744]">
                <div className="w-1/2 h-full bg-emerald-500 border-r-2 border-amber-400 float-left flex items-center justify-center text-xs font-black text-white">
                  1/2
                </div>
                <div className="w-1/2 h-full bg-[#162744] float-right flex items-center justify-center text-xs font-black text-slate-400">
                  1/2
                </div>
              </div>
            </div>
          )}

          {/* Geometry Shapes Visual */}
          {question.visualType === 'geometry_shapes' && (
            <div className="flex items-center justify-center gap-2 py-2 overflow-x-auto">
              <div className="w-9 h-9 rounded-full bg-amber-400 border border-white flex items-center justify-center text-slate-950 font-black text-xs">
                ●
              </div>
              <div className="text-slate-500">→</div>
              <div className="w-9 h-9 bg-emerald-500 border border-white rotate-45 flex items-center justify-center text-white font-black text-xs">
                ◆
              </div>
              <div className="text-slate-500">→</div>
              <div className="w-9 h-9 rounded-md bg-blue-500 border border-white flex items-center justify-center text-white font-black text-xs">
                ■
              </div>
              <div className="text-slate-500">→</div>
              <div className="w-9 h-9 rounded-full bg-amber-400 border border-white flex items-center justify-center text-slate-950 font-black text-xs">
                ●
              </div>
              <div className="text-slate-500">→</div>
              <div className="w-9 h-9 bg-emerald-500 border border-white rotate-45 flex items-center justify-center text-white font-black text-xs">
                ◆
              </div>
              <div className="text-slate-500">→</div>
              <div className="w-9 h-9 rounded-md bg-amber-400/20 border-2 border-dashed border-amber-400 flex items-center justify-center text-amber-300 font-black text-base animate-pulse">
                ?
              </div>
            </div>
          )}
        </div>

        {/* 3. ACTION AREA: 4 Chunky Rounded Answer Cards */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, index) => {
            const isSelected = selectedOptionId === opt.id;
            const isThisOptionCorrect = opt.isCorrect;

            // Feedback state styles
            let cardBg = 'bg-[#14253e] hover:bg-[#192e4d] text-white border-2 border-[#24426e] shadow-[0_5px_0_#0d192b]';
            let iconColor = 'bg-[#1b3457] text-amber-300';
            let badgeText = String.fromCharCode(65 + index); // A, B, C, D

            if (isSubmitted) {
              if (isThisOptionCorrect) {
                // Correct Answer State requested: Glowing Emerald Green with star burst or checkmark icon!
                cardBg =
                  'bg-emerald-600 text-white border-3 border-white ring-4 ring-emerald-400/50 shadow-[0_6px_0_#047857] scale-[1.02]';
                iconColor = 'bg-white text-emerald-700';
              } else if (isSelected && !isThisOptionCorrect) {
                // Selected wrong answer
                cardBg =
                  'bg-red-900/80 text-red-200 border-2 border-red-500 shadow-[0_5px_0_#501313] opacity-80';
                iconColor = 'bg-red-800 text-red-200';
              } else {
                // Inactive others
                cardBg = 'bg-[#101c30] text-slate-500 border border-slate-700/50 opacity-40 shadow-none';
              }
            } else if (isSelected) {
              // Active chosen before submit
              cardBg =
                'bg-amber-500 text-slate-950 border-3 border-white shadow-[0_5px_0_#b45309] scale-[1.02]';
              iconColor = 'bg-slate-950 text-amber-300';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isSubmitted}
                className={`relative p-3.5 rounded-2xl flex flex-col items-start justify-between min-h-[92px] transition-all btn-chunky-card ${cardBg}`}
                aria-label={`Option ${badgeText}: ${opt.label}`}
              >
                {/* Option Header Pip */}
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center ${iconColor}`}
                    >
                      {isSubmitted && isThisOptionCorrect ? (
                        <Check className="w-5 h-5 stroke-[3.5] animate-bounce" />
                      ) : (
                        badgeText
                      )}
                    </span>
                  </div>

                  {/* Feedback icon: Star burst or checkmark */}
                  {isSubmitted && isThisOptionCorrect && (
                    <span className="flex items-center gap-0.5 bg-amber-300 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                      <Sparkles className="w-3 h-3 fill-slate-950" />
                      CORRECT
                    </span>
                  )}
                </div>

                {/* Option text */}
                <span className="text-base font-black leading-tight mt-2 text-left">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. BOTTOM FEEDBACK BAR / ACTION BUTTON */}
      <div className="sticky bottom-0 z-20 bg-[#0d1a2d] border-t-2 border-[#1c3252] p-4 shadow-2xl">
        {!isSubmitted ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId}
            className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
              selectedOptionId
                ? 'btn-chunky-amber'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>CHECK ANSWER</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          /* Celebratory Feedback Drawer */
          <div
            className={`p-3.5 rounded-2xl border-2 transition-all animate-in slide-in-from-bottom duration-200 ${
              isCorrect
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                : 'bg-red-950/90 border-red-500 text-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                    isCorrect
                      ? 'bg-emerald-500 text-white shadow-[0_3px_0_#047857]'
                      : 'bg-red-500 text-white shadow-[0_3px_0_#7f1d1d]'
                  }`}
                >
                  {isCorrect ? (
                    <Check className="w-6 h-6 stroke-[3]" />
                  ) : (
                    <X className="w-6 h-6 stroke-[3]" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-tight">
                    {isCorrect ? 'Outstanding! That is correct!' : 'Good try! Here is a tip:'}
                  </h4>
                  <p className="text-xs text-slate-200 leading-snug">
                    {question.explanation}
                  </p>
                </div>
              </div>

              {isCorrect && (
                <div className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm shrink-0">
                  <Award className="w-3.5 h-3.5" />
                  <span>+20 XP</span>
                </div>
              )}
            </div>

            {/* Chunky Continue Button */}
            <button
              onClick={handleNextQuestion}
              className={`w-full py-3.5 rounded-xl font-black text-base flex items-center justify-center gap-2 ${
                isCorrect ? 'btn-chunky-emerald' : 'btn-chunky-amber'
              }`}
            >
              <span>{currentQIndex < questions.length - 1 ? 'CONTINUE NEXT QUESTION' : 'CLAIM QUEST REWARD'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#0f1f38] border-2 border-amber-400 rounded-3xl p-5 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-black text-white mb-2">Leave Current Lesson?</h3>
            <p className="text-xs text-slate-300 mb-5 leading-relaxed">
              Don&apos;t worry! Your offline progress and daily streak are safely stored on this phone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setShowExitConfirm(false);
                }}
                className="flex-1 btn-chunky-slate py-3 rounded-xl font-bold text-sm"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  soundEngine.playTap();
                  setShowExitConfirm(false);
                  stopSpeaking();
                  onExit();
                }}
                className="flex-1 btn-chunky-amber py-3 rounded-xl font-bold text-sm"
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

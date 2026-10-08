import React, { useState, useEffect } from 'react';
import { X, Heart, Check, AlertTriangle, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { LessonNode, Exercise, PairItem } from '../types.ts';
import { TactileButton } from './TactileButton.tsx';

interface MicroLessonModalProps {
  lesson: LessonNode;
  hearts: number;
  onClose: () => void;
  onFinishLesson: (stats: {
    scorePercent: number;
    accuracyRate: number;
    xpEarned: number;
    mistakesCount: number;
    durationSeconds: number;
  }) => void;
}

export const MicroLessonModal: React.FC<MicroLessonModalProps> = ({
  lesson,
  hearts,
  onClose,
  onFinishLesson,
}) => {
  const exercises: Exercise[] = lesson.exercises.length > 0 ? lesson.exercises : [
    // Fallback interactive exercise if empty
    {
      id: 'fallback_01',
      type: 'tap_to_pair',
      instruction: 'Tap to pair fractions with their visual meaning:',
      pairData: {
        pairs: [
          { id: 'fb1', left: '1/2', right: 'Half of a harvest grain sack', leftVisual: '½', rightVisual: '🌾' },
          { id: 'fb2', left: '1/4', right: 'Quarter share of pond water', leftVisual: '¼', rightVisual: '💧' },
          { id: 'fb3', left: '3/4', right: 'Three parts of four equal plots', leftVisual: '¾', rightVisual: '🌱' },
        ],
      },
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [currentHearts, setCurrentHearts] = useState(hearts);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [startTime] = useState(Date.now());

  // Interaction State for Tap-to-Pair
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [pairError, setPairError] = useState(false);

  // Interaction State for Fill-in-the-Blank
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // Interaction State for Multiple Choice
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  // Bottom feedback sheet state: 'idle' | 'correct' | 'incorrect'
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentExercise = exercises[currentStep];

  // Reset exercise state when step changes
  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setSelectedWord(null);
    setSelectedChoice(null);
    setFeedbackState('idle');
    setFeedbackMessage('');
    setPairError(false);
  }, [currentStep]);

  // Handle Tap-to-Pair logic
  const handleLeftTap = (pairId: string) => {
    if (matchedPairs.includes(pairId) || feedbackState !== 'idle') return;
    setSelectedLeft(pairId);
    setPairError(false);

    if (selectedRight) {
      checkPairMatch(pairId, selectedRight);
    }
  };

  const handleRightTap = (pairId: string) => {
    if (matchedPairs.includes(pairId) || feedbackState !== 'idle') return;
    setSelectedRight(pairId);
    setPairError(false);

    if (selectedLeft) {
      checkPairMatch(selectedLeft, pairId);
    }
  };

  const checkPairMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct pair!
      const newMatched = [...matchedPairs, leftId];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all pairs are completed
      if (currentExercise.pairData && newMatched.length === currentExercise.pairData.pairs.length) {
        setFeedbackState('correct');
        setFeedbackMessage('Awesome match! You paired all concepts accurately.');
      }
    } else {
      // Mismatch
      setPairError(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setPairError(false);
      }, 700);
    }
  };

  // Check Answer Handler
  const handleCheckAnswer = () => {
    if (feedbackState !== 'idle') return;

    if (currentExercise.type === 'tap_to_pair') {
      if (currentExercise.pairData && matchedPairs.length === currentExercise.pairData.pairs.length) {
        setFeedbackState('correct');
        setFeedbackMessage('Awesome match! You paired every concept correctly.');
      } else {
        triggerIncorrect('Please match all pairs before checking.');
      }
    } else if (currentExercise.type === 'fill_in_blank') {
      if (!selectedWord) return;
      if (selectedWord.toLowerCase() === currentExercise.fillBlankData?.correctWord.toLowerCase()) {
        setFeedbackState('correct');
        setFeedbackMessage('Spot on! That correctly completes the concept.');
      } else {
        triggerIncorrect(
          `Correct answer was "${currentExercise.fillBlankData?.correctWord}". Look at the sentence relationship.`
        );
      }
    } else if (currentExercise.type === 'multiple_choice') {
      if (selectedChoice === null) return;
      if (selectedChoice === currentExercise.choiceData?.correctIndex) {
        setFeedbackState('correct');
        setFeedbackMessage(currentExercise.choiceData?.explanation || 'Brilliant deduction!');
      } else {
        triggerIncorrect(
          currentExercise.choiceData?.explanation || 'Not quite. Check the problem reasoning again.'
        );
      }
    }
  };

  const triggerIncorrect = (explanation: string) => {
    setFeedbackState('incorrect');
    setFeedbackMessage(explanation);
    setMistakesCount((prev) => prev + 1);
    setCurrentHearts((prev) => Math.max(1, prev - 1));
  };

  const handleNextStep = () => {
    if (currentStep < exercises.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finished all exercises in this micro-lesson!
      const durationSeconds = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      const totalQuestions = exercises.length;
      const accuracyRate = Math.max(
        60,
        Math.round(((totalQuestions) / (totalQuestions + mistakesCount)) * 100)
      );
      const scorePercent = accuracyRate >= 90 ? 100 : accuracyRate;
      const xpEarned = lesson.xpReward + (accuracyRate >= 90 ? 10 : 0);

      onFinishLesson({
        scorePercent,
        accuracyRate,
        xpEarned,
        mistakesCount,
        durationSeconds,
      });
    }
  };

  // Determine if check answer button is enabled
  const isCheckEnabled = () => {
    if (feedbackState !== 'idle') return true;
    if (currentExercise.type === 'tap_to_pair') {
      return (
        currentExercise.pairData &&
        matchedPairs.length === currentExercise.pairData.pairs.length
      );
    }
    if (currentExercise.type === 'fill_in_blank') {
      return selectedWord !== null;
    }
    if (currentExercise.type === 'multiple_choice') {
      return selectedChoice !== null;
    }
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden animate-in fade-in duration-200">
      {/* Header with Exit, Segmented Progress Bar, Hearts */}
      <header className="px-4 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 max-w-lg mx-auto w-full">
        {/* Exit Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Segmented Progress Bar */}
        <div className="flex-1 flex items-center gap-1.5 h-3">
          {exercises.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-emerald-500'
                    : idx === currentStep
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1 text-rose-500 font-extrabold text-sm pl-1">
          <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
          <span>{currentHearts}</span>
        </div>
      </header>

      {/* Main Exercise Card Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full flex flex-col justify-center">
        {/* Instruction Label */}
        <div className="mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Exercise {currentStep + 1} of {exercises.length}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2 leading-tight">
            {currentExercise.instruction}
          </h2>
        </div>

        {/* INTERACTION TYPE 1: Tap to Pair */}
        {currentExercise.type === 'tap_to_pair' && currentExercise.pairData && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium mb-2">
              Tap an item on the left, then tap its matching pair on the right:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Left Column */}
              <div className="space-y-2.5">
                {currentExercise.pairData.pairs.map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedLeft === pair.id;

                  return (
                    <button
                      key={`left-${pair.id}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleLeftTap(pair.id)}
                      className={`w-full p-3 text-left rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all select-none min-h-[56px] flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 opacity-80'
                          : isSelected
                          ? 'bg-emerald-100 border-emerald-600 text-emerald-900 shadow-md translate-y-0.5'
                          : pairError && isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs active:translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {pair.leftVisual && (
                          <span className="text-base font-extrabold text-emerald-600">
                            {pair.leftVisual}
                          </span>
                        )}
                        <span>{pair.left}</span>
                      </div>
                      {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column (shuffled order) */}
              <div className="space-y-2.5">
                {[...currentExercise.pairData.pairs].reverse().map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedRight === pair.id;

                  return (
                    <button
                      key={`right-${pair.id}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleRightTap(pair.id)}
                      className={`w-full p-3 text-left rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all select-none min-h-[56px] flex items-center justify-between ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 opacity-80'
                          : isSelected
                          ? 'bg-emerald-100 border-emerald-600 text-emerald-900 shadow-md translate-y-0.5'
                          : pairError && isSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-800 animate-shake'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs active:translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {pair.rightVisual && (
                          <span className="text-base font-extrabold text-emerald-600">
                            {pair.rightVisual}
                          </span>
                        )}
                        <span className="text-[11px] sm:text-xs leading-snug">{pair.right}</span>
                      </div>
                      {isMatched && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* INTERACTION TYPE 2: Fill-in-the-Blank */}
        {currentExercise.type === 'fill_in_blank' && currentExercise.fillBlankData && (
          <div className="space-y-6">
            {/* Sentence with Blank Slot */}
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl text-sm sm:text-base text-slate-800 font-semibold leading-relaxed">
              <span>{currentExercise.fillBlankData.sentencePrefix} </span>
              {/* Blank Slot */}
              <button
                type="button"
                onClick={() => setSelectedWord(null)}
                className={`inline-flex items-center justify-center px-4 py-1.5 min-w-[90px] border-b-4 rounded-xl font-extrabold transition-all align-middle mx-1.5 ${
                  selectedWord
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-white border-slate-400 border-dashed text-slate-400'
                }`}
              >
                {selectedWord || '____'}
              </button>
              <span> {currentExercise.fillBlankData.sentenceSuffix}</span>
            </div>

            {/* Word Tiles Below */}
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2.5">
                Available Word Tiles:
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {currentExercise.fillBlankData.options.map((word) => {
                  const isUsed = selectedWord === word;
                  return (
                    <button
                      key={word}
                      type="button"
                      disabled={isUsed || feedbackState !== 'idle'}
                      onClick={() => setSelectedWord(word)}
                      className={`px-4 py-2.5 text-sm font-extrabold rounded-2xl border-2 transition-all select-none ${
                        isUsed
                          ? 'opacity-25 bg-slate-100 border-slate-200 text-slate-400 pointer-events-none'
                          : 'bg-white border-slate-200 border-b-4 border-b-slate-300 hover:bg-slate-50 text-slate-800 active:translate-y-0.5 active:border-b-2 shadow-sm'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* INTERACTION TYPE 3: Multiple Choice */}
        {currentExercise.type === 'multiple_choice' && currentExercise.choiceData && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-3xl font-bold text-slate-800 text-sm sm:text-base">
              {currentExercise.choiceData.question}
            </div>
            <div className="space-y-2.5">
              {currentExercise.choiceData.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => setSelectedChoice(optIdx)}
                  className={`w-full p-4 text-left rounded-2xl border-2 font-bold text-sm transition-all select-none flex items-center justify-between ${
                    selectedChoice === optIdx
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedChoice === optIdx
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {selectedChoice === optIdx && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Sticky Action Drawer & Feedback Sheet */}
      <footer className="w-full border-t border-slate-200 bg-white">
        {/* Correct/Incorrect Bottom Sheet Banner */}
        {feedbackState !== 'idle' && (
          <div
            className={`px-4 py-4 border-b transition-all duration-300 animate-in slide-in-from-bottom-6 ${
              feedbackState === 'correct'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="max-w-lg mx-auto flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                  feedbackState === 'correct'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {feedbackState === 'correct' ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-black text-sm">
                  {feedbackState === 'correct' ? 'Awesome!' : 'Needs Revision'}
                </div>
                <div className="text-xs mt-0.5 leading-relaxed font-medium">
                  {feedbackMessage}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Button container */}
        <div className="p-4 max-w-lg mx-auto w-full">
          {feedbackState === 'idle' ? (
            <TactileButton
              variant="primary"
              size="lg"
              fullWidth
              disabled={!isCheckEnabled()}
              onClick={handleCheckAnswer}
            >
              CHECK ANSWER
            </TactileButton>
          ) : (
            <TactileButton
              variant={feedbackState === 'correct' ? 'primary' : 'slate'}
              size="lg"
              fullWidth
              onClick={handleNextStep}
            >
              CONTINUE <ArrowRight className="w-4 h-4 ml-2" />
            </TactileButton>
          )}
        </div>
      </footer>
    </div>
  );
};

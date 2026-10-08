import React from 'react';
import { Check, Lock, Star, Trophy, Sparkles, BookOpen, ChevronRight, Play, Palette } from 'lucide-react';
import { LessonNode, Student } from '../types.ts';
import { SubjectMeta } from '../data/curriculumData.ts';
import { AvatarSVG } from './AvatarSVG.tsx';

interface LearningPathProps {
  currentSubject: SubjectMeta;
  nodes: LessonNode[];
  currentStudent?: Student;
  onSelectNode: (node: LessonNode) => void;
  onOpenUnitGuide?: () => void;
  onOpenCharacterCreator?: () => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  currentSubject,
  nodes,
  currentStudent,
  onSelectNode,
  onOpenCharacterCreator,
}) => {
  // S-curve lateral X-offsets for the stepped path (percentages or px)
  const getLateralOffset = (index: number) => {
    const pattern = [0, 48, -48, 40, -40, 0];
    return pattern[index % pattern.length];
  };

  const completedCount = nodes.filter((n) => n.status === 'completed').length;
  const activeNodeIndex = nodes.findIndex((n) => n.status === 'active');

  return (
    <div className="w-full max-w-md mx-auto pb-28 pt-3 px-4">
      {/* Unit Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 rounded-3xl p-4 text-white mb-6 shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSubject.levelTitle}</span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug">
              {currentSubject.unitTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Master real-world STEM concepts with interactive micro-challenges
            </p>
          </div>

          <div className="shrink-0 bg-slate-800/80 border border-slate-600 rounded-2xl p-2.5 text-center min-w-[64px]">
            <div className="text-xs text-slate-400 font-bold">Progress</div>
            <div className="text-sm font-black text-emerald-400">
              {completedCount} / {nodes.length}
            </div>
          </div>
        </div>

        {/* Unit Progress Bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.round((completedCount / nodes.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* S-Curving Vertical Progression Path */}
      <div className="relative flex flex-col items-center py-4">
        {/* SVG Connecting Path Line */}
        <svg
          className="absolute top-8 left-0 w-full h-[calc(100%-60px)] pointer-events-none z-0"
          preserveAspectRatio="none"
        >
          {nodes.map((node, i) => {
            if (i === nodes.length - 1) return null;
            const currentX = 50 + (getLateralOffset(i) / 200) * 50;
            const nextX = 50 + (getLateralOffset(i + 1) / 200) * 50;
            const startY = (i / (nodes.length - 1)) * 90 + 5;
            const endY = ((i + 1) / (nodes.length - 1)) * 90 + 5;
            const isFinished = node.status === 'completed';

            return (
              <line
                key={`line-${node.id}`}
                x1={`${currentX}%`}
                y1={`${startY}%`}
                x2={`${nextX}%`}
                y2={`${endY}%`}
                stroke={isFinished ? '#10B981' : '#CBD5E1'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={isFinished ? 'none' : '10 8'}
                className="transition-colors duration-500"
              />
            );
          })}
        </svg>

        {/* Stepped Nodes */}
        {nodes.map((node, index) => {
          const lateralOffset = getLateralOffset(index);
          const isCompleted = node.status === 'completed';
          const isActive = node.status === 'active';
          const isLocked = node.status === 'locked';
          const isBoss = node.nodeType === 'checkpoint_boss';

          return (
            <div
              key={node.id}
              className="relative my-7 flex flex-col items-center z-10"
              style={{ transform: `translateX(${lateralOffset}px)` }}
            >
              {/* Floating START Banner Tooltip for Active Node */}
              {isActive && (
                <div className="absolute -top-12 z-20 flex flex-col items-center animate-bounce">
                  <div className="bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-lg border-b-2 border-emerald-800 flex items-center gap-1 whitespace-nowrap">
                    <Play className="w-3 h-3 fill-white" />
                    <span>START: {node.title}</span>
                  </div>
                  {/* Tooltip triangle */}
                  <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-emerald-800" />
                </div>
              )}

              {/* Node Button with 3D tactile bevel */}
              <div className="relative">
                {/* Pulsating outer halo for active node */}
                {isActive && (
                  <div className="absolute -inset-2.5 rounded-full bg-emerald-400 opacity-75 animate-ping pointer-events-none" />
                )}

                <button
                  type="button"
                  onClick={() => onSelectNode(node)}
                  title={`${node.title} (${node.status})`}
                  className={`relative flex items-center justify-center transition-all select-none ${
                    isBoss
                      ? 'w-20 h-20 rounded-3xl'
                      : 'w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full'
                  } ${
                    isCompleted
                      ? 'bg-emerald-500 border-b-4 border-emerald-700 hover:bg-emerald-400 active:border-b-0 active:translate-y-1 shadow-md text-white'
                      : isActive
                      ? 'bg-emerald-500 border-4 border-white border-b-6 border-b-emerald-700 ring-4 ring-emerald-300 hover:bg-emerald-400 active:border-b-2 active:translate-y-1 shadow-lg text-white'
                      : 'bg-slate-200 border-b-4 border-slate-300 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <div className="flex flex-col items-center">
                      <Check className="w-7 h-7 stroke-[3.5] text-white" />
                      {/* Golden Stars badge */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3 h-3 ${
                              starIdx <= node.starsEarned
                                ? 'fill-amber-300 text-amber-300'
                                : 'fill-emerald-700/50 text-emerald-700/50'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : isActive ? (
                    <div className="flex flex-col items-center">
                      <Play className="w-7 h-7 fill-white stroke-white ml-0.5" />
                      <span className="text-[10px] font-black tracking-tight uppercase mt-0.5">
                        GO
                      </span>
                    </div>
                  ) : isBoss ? (
                    <Trophy className="w-8 h-8 text-slate-400" />
                  ) : (
                    <Lock className="w-6 h-6 text-slate-400" />
                  )}
                </button>
              </div>

              {/* Node Title & Subtitle Below */}
              <div className="mt-2 text-center max-w-[150px]">
                <div
                  className={`text-xs font-bold leading-tight ${
                    isActive
                      ? 'text-emerald-700 font-extrabold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {node.title}
                </div>
                {isBoss && (
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Boss Challenge
                  </span>
                )}
              </div>

              {/* Floating Avatar Guide placed beside the active node */}
              {isActive && (
                <div className="absolute -left-14 sm:-left-28 top-0 z-30 pointer-events-auto flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={onOpenCharacterCreator}>
                    <AvatarSVG config={currentStudent?.avatarConfig} size="md" animate />
                    {onOpenCharacterCreator && (
                      <span className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full text-emerald-600 shadow-xs border border-slate-200">
                        <Palette className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  {/* Cheerful Guide speech bubble */}
                  <div className="mt-1 bg-white/95 backdrop-blur-xs border border-emerald-300 text-slate-800 text-[9px] font-black py-0.5 px-2 rounded-lg shadow-sm whitespace-nowrap hidden sm:block">
                    Let's solve this! 🚀
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

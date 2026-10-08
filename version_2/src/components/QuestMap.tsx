import React, { useState } from 'react';
import { Check, Lock, Play, Star, Sparkles, BookOpen, Compass, TreePine, MapPin, Award } from 'lucide-react';
import { QuestNode } from '../types';
import { soundEngine } from '../audio';

interface QuestMapProps {
  nodes: QuestNode[];
  onSelectNode: (node: QuestNode) => void;
  outdoorMode: boolean;
}

export const QuestMap: React.FC<QuestMapProps> = ({
  nodes,
  onSelectNode,
  outdoorMode,
}) => {
  const [selectedNodeForModal, setSelectedNodeForModal] = useState<QuestNode | null>(null);

  const activeNode = nodes.find((n) => n.status === 'active') || nodes[4];

  // Helper to handle node clicks
  const handleNodeClick = (node: QuestNode) => {
    soundEngine.playTap();
    if (node.status === 'locked') {
      setSelectedNodeForModal(node);
      return;
    }
    setSelectedNodeForModal(node);
  };

  return (
    <div className="relative flex-1 flex flex-col overflow-y-auto pb-24 bg-[#0a1424] select-none">
      {/* Chapter Banner */}
      <div className="sticky top-0 z-20 bg-[#0d1a2d]/95 backdrop-blur-sm border-b border-[#1b3152] px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-300">
              Chapter 2: The Math Forest
            </h2>
            <p className="text-[11px] text-slate-300">
              Multiplication Trails & Equal Sharing
            </p>
          </div>
        </div>
        <div className="bg-[#162744] border border-[#2b4b7c] rounded-xl px-2.5 py-1 text-right">
          <span className="text-[10px] font-bold text-slate-400 block leading-none">PROGRESS</span>
          <span className="text-xs font-black text-emerald-400">4 / 7 Quest Nodes</span>
        </div>
      </div>

      {/* Quest Winding Map Container */}
      <div className="relative w-full max-w-md mx-auto py-8 px-4 flex flex-col items-center">
        {/* SVG Curved Board Game Path Behind Nodes */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* Connect node to node with smooth bezier curves */}
          {nodes.map((node, index) => {
            if (index === nodes.length - 1) return null;
            const nextNode = nodes[index + 1];

            // Approximate vertical coordinates for each node
            const y1 = 40 + index * 105 + 40;
            const y2 = 40 + (index + 1) * 105 + 40;
            const x1Pct = node.xOffset;
            const x2Pct = nextNode.xOffset;

            return (
              <g key={`path-${node.id}`}>
                {/* Outer road border */}
                <path
                  d={`M ${x1Pct}% ${y1} C ${x1Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${y2}`}
                  fill="none"
                  stroke="#162b49"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Inner colored track */}
                <path
                  d={`M ${x1Pct}% ${y1} C ${x1Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${(y1 + y2) / 2}, ${x2Pct}% ${y2}`}
                  fill="none"
                  stroke={
                    node.status === 'completed' && nextNode.status === 'completed'
                      ? '#059669'
                      : node.status === 'completed' && nextNode.status === 'active'
                      ? '#d97706'
                      : '#334155'
                  }
                  strokeWidth="8"
                  strokeDasharray={nextNode.status === 'locked' ? '8 6' : 'none'}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {/* Ambient Flat-Vector SVG Landmarks Along the Trail */}
        <div className="absolute top-16 left-3 opacity-40 pointer-events-none flex flex-col items-center">
          <TreePine className="w-8 h-8 text-emerald-600" />
          <span className="text-[9px] font-bold text-emerald-400">Green Grove</span>
        </div>

        <div className="absolute top-[260px] right-3 opacity-40 pointer-events-none flex flex-col items-center">
          <Compass className="w-7 h-7 text-amber-500" />
          <span className="text-[9px] font-bold text-amber-300">Mango Orchard</span>
        </div>

        <div className="absolute top-[480px] left-3 opacity-30 pointer-events-none flex flex-col items-center">
          <MapPin className="w-7 h-7 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400">Ancient Shrine</span>
        </div>

        {/* Map Nodes */}
        <div className="relative z-10 w-full flex flex-col gap-10">
          {nodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLocked = node.status === 'locked';

            return (
              <div
                key={node.id}
                className="relative flex flex-col items-center"
                style={{
                  alignSelf:
                    node.xOffset === 50
                      ? 'center'
                      : node.xOffset < 50
                      ? 'flex-start'
                      : 'flex-end',
                  marginLeft: node.xOffset < 50 ? `${node.xOffset - 10}%` : undefined,
                  marginRight: node.xOffset > 50 ? `${100 - node.xOffset - 10}%` : undefined,
                }}
              >
                {/* Active Node Pulse Ring & Floating "START" Tag */}
                {isActive && (
                  <div className="absolute -top-7 z-20 flex flex-col items-center animate-bounce">
                    <div className="bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full border-2 border-white shadow-[0_3px_0_#b45309] flex items-center gap-1">
                      <Play className="w-3 h-3 fill-slate-950" />
                      <span>START QUEST</span>
                    </div>
                    <div className="w-2 h-2 bg-amber-400 rotate-45 -mt-1 border-r border-b border-amber-600"></div>
                  </div>
                )}

                {/* Node Button */}
                <div className="relative group">
                  {/* Glowing halo for active */}
                  {isActive && (
                    <span className="absolute -inset-2.5 rounded-full bg-amber-400/30 blur-sm animate-pulse"></span>
                  )}

                  <button
                    onClick={() => handleNodeClick(node)}
                    aria-label={`Quest Node ${node.level}: ${node.title} (${node.status})`}
                    className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-transform active:scale-90 ${
                      isCompleted
                        ? 'bg-gradient-to-b from-[#10b981] to-[#059669] border-4 border-[#34d399] shadow-[0_6px_0_#047857] text-white'
                        : isActive
                        ? 'bg-gradient-to-b from-[#fbbf24] to-[#f59e0b] border-4 border-white shadow-[0_6px_0_#b45309] text-slate-950'
                        : 'bg-[#1e293b] border-4 border-[#334155] shadow-[0_6px_0_#0f172a] text-slate-500'
                    }`}
                  >
                    {isCompleted && (
                      <div className="flex flex-col items-center">
                        <Check className="w-8 h-8 stroke-[3.5] drop-shadow" />
                        {/* 3-star rating */}
                        <div className="flex gap-0.5 -mt-1">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                (node.stars || 3) >= star
                                  ? 'fill-amber-300 text-amber-300'
                                  : 'text-emerald-700 fill-emerald-800'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {isActive && (
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-black font-display leading-none">
                          {node.level}
                        </span>
                        <Play className="w-5 h-5 fill-slate-950 mt-0.5" />
                      </div>
                    )}

                    {isLocked && (
                      <div className="flex flex-col items-center">
                        <Lock className="w-7 h-7 text-slate-500 stroke-[2.5]" />
                        <span className="text-[11px] font-bold text-slate-500 -mt-0.5">
                          {node.level}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Node Title Pill */}
                <div
                  className={`mt-2 px-3 py-1 rounded-xl text-center shadow-md max-w-[140px] border ${
                    isCompleted
                      ? 'bg-[#102a24] border-emerald-500/40 text-emerald-200'
                      : isActive
                      ? 'bg-[#2a220d] border-amber-400 text-amber-200 ring-2 ring-amber-400/20'
                      : 'bg-[#141b27] border-slate-700/50 text-slate-400'
                  }`}
                >
                  <p className="text-[11px] font-black leading-tight truncate">
                    {node.title}
                  </p>
                  <p className="text-[9px] font-semibold text-slate-300/80 truncate">
                    {node.topic}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Banner to continue Next Action */}
      <div className="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-4 pointer-events-none z-30">
        <div className="bg-[#0f1f38]/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl p-3 shadow-[0_8px_20px_rgba(0,0,0,0.5)] pointer-events-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-[0_3px_0_#b45309]">
              5
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                RECOMMENDED NEXT STEP
              </span>
              <h3 className="text-sm font-black text-white leading-tight">
                {activeNode.title}
              </h3>
              <p className="text-[10px] text-slate-300">
                +80 XP • +20 Gems • 3 min lesson
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playTap();
              onSelectNode(activeNode);
            }}
            className="btn-chunky-amber font-black text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>PLAY</span>
          </button>
        </div>
      </div>

      {/* Node Detail Modal / Preview Bottom Sheet */}
      {selectedNodeForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-0 backdrop-blur-xs">
          <div className="bg-[#0f1f38] border-t-4 border-amber-400 rounded-t-3xl p-5 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-4" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                    selectedNodeForModal.status === 'completed'
                      ? 'bg-emerald-500 text-white shadow-[0_4px_0_#047857]'
                      : selectedNodeForModal.status === 'active'
                      ? 'bg-amber-400 text-slate-950 shadow-[0_4px_0_#b45309]'
                      : 'bg-slate-700 text-slate-400 shadow-[0_4px_0_#1e293b]'
                  }`}
                >
                  {selectedNodeForModal.status === 'completed' ? (
                    <Check className="w-8 h-8 stroke-[3]" />
                  ) : selectedNodeForModal.status === 'active' ? (
                    <Play className="w-7 h-7 fill-slate-950" />
                  ) : (
                    <Lock className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    Level {selectedNodeForModal.level} • {selectedNodeForModal.topic}
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {selectedNodeForModal.title}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedNodeForModal.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Rewards info */}
            <div className="grid grid-cols-2 gap-3 my-4 bg-[#14233c] p-3 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">REWARD XP</span>
                  <span className="text-sm font-black text-white">
                    +{selectedNodeForModal.xpReward} XP
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">REWARD GEMS</span>
                  <span className="text-sm font-black text-amber-300">
                    +{selectedNodeForModal.gemsReward} Gems
                  </span>
                </div>
              </div>
            </div>

            {/* Offline notice */}
            <div className="mb-4 flex items-center gap-2 text-[11px] text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
              <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Available offline. No internet needed to complete this micro-quiz!</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedNodeForModal(null)}
                className="flex-1 btn-chunky-slate py-3 rounded-2xl font-black text-sm"
              >
                Close
              </button>
              {selectedNodeForModal.status !== 'locked' ? (
                <button
                  onClick={() => {
                    const target = selectedNodeForModal;
                    setSelectedNodeForModal(null);
                    onSelectNode(target);
                  }}
                  className="flex-1 btn-chunky-amber py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{selectedNodeForModal.status === 'completed' ? 'Replay (+Bonus)' : 'Start Lesson'}</span>
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-slate-800 text-slate-500 py-3 rounded-2xl font-black text-sm cursor-not-allowed border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-4 h-4" />
                  <span>Locked Node</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

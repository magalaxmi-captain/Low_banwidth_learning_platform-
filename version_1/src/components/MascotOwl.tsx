import React, { useState } from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface MascotOwlProps {
  speechText?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onTap?: () => void;
}

const DEFAULT_TIPS = [
  'Namaste! Tap the glowing green node to start today’s lesson!',
  'Did you know? Farmers use fractions to divide canal irrigation water fairly!',
  '12-day streak! You are among the top learners in Sundarpur!',
  'Your progress is saved locally. Even with zero Wi-Fi, keep learning!',
  'Practice makes perfect. Review completed lessons to master every concept!',
];

export const MascotOwl: React.FC<MascotOwlProps> = ({
  speechText,
  size = 'md',
  className = '',
  onTap,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const currentSpeech = speechText || DEFAULT_TIPS[tipIndex];

  const handleMascotClick = () => {
    setIsBouncing(true);
    setTipIndex((prev) => (prev + 1) % DEFAULT_TIPS.length);
    setTimeout(() => setIsBouncing(false), 600);
    if (onTap) onTap();
  };

  const scale = size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20';

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* Speech Bubble */}
      <div
        onClick={handleMascotClick}
        className="cursor-pointer relative bg-white border-2 border-slate-200 shadow-md rounded-2xl p-3 text-xs md:text-sm text-slate-800 max-w-[210px] sm:max-w-[240px] font-medium leading-relaxed transition-transform hover:scale-[1.02]"
      >
        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Veera's Guide</span>
        </div>
        <p>{currentSpeech}</p>
        {/* Triangle pointer to owl */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-slate-200"></div>
        <div className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[7px] border-l-white"></div>
      </div>

      {/* SVG Owl Mascot */}
      <button
        type="button"
        onClick={handleMascotClick}
        title="Veera the Learning Owl (Tap for tips!)"
        className={`${scale} relative shrink-0 transition-transform active:scale-90 ${
          isBouncing ? 'animate-bounce' : 'hover:scale-105'
        }`}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          {/* Owl Body */}
          <ellipse cx="50" cy="56" rx="36" ry="38" fill="#10B981" />
          <ellipse cx="50" cy="58" rx="26" ry="28" fill="#ECFDF5" />
          
          {/* Belly Feather Feathers */}
          <path d="M44 54C46 56 50 56 52 54" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M47 62C49 64 53 64 55 62" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M42 68C45 71 50 71 53 68" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

          {/* Wings */}
          <path d="M14 46C12 56 16 68 22 74C24 66 22 52 14 46Z" fill="#059669" />
          <path d="M86 46C88 56 84 68 78 74C76 66 78 52 86 46Z" fill="#059669" />

          {/* Owl Ear Tufts */}
          <polygon points="26,30 35,16 42,32" fill="#047857" />
          <polygon points="74,30 65,16 58,32" fill="#047857" />

          {/* Eyes Background */}
          <circle cx="37" cy="40" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="63" cy="40" r="14" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          
          {/* Pupils */}
          <circle cx="39" cy="40" r="7" fill="#0F172A" />
          <circle cx="61" cy="40" r="7" fill="#0F172A" />

          {/* Eye Sparkles */}
          <circle cx="37" cy="37" r="2.5" fill="#FFFFFF" />
          <circle cx="59" cy="37" r="2.5" fill="#FFFFFF" />

          {/* Beak */}
          <polygon points="50,45 44,52 56,52" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Graduation Cap */}
          <polygon points="50,14 26,22 50,30 74,22" fill="#0F172A" />
          <rect x="42" y="27" width="16" height="5" rx="1" fill="#1E293B" />
          <circle cx="50" cy="22" r="2.5" fill="#F59E0B" />
          <path d="M50 22C60 22 68 27 68 35" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <rect x="66" y="35" width="4" height="6" rx="1" fill="#F59E0B" />

          {/* Feet */}
          <ellipse cx="40" cy="92" rx="6" ry="3.5" fill="#F59E0B" />
          <ellipse cx="60" cy="92" rx="6" ry="3.5" fill="#F59E0B" />
        </svg>
      </button>
    </div>
  );
};

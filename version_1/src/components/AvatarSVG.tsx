import React from 'react';
import { AvatarConfig } from '../types.ts';

export interface AvatarSVGProps {
  config?: AvatarConfig;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skinTone: '#E5B887',
  hairStyle: 'twin_braids',
  hairColor: '#1E1B18',
  clothing: 'school_uniform_blue',
  clothingColor: '#2563EB',
  expression: 'happy_smile',
  accessory: 'flower_jasmine',
  backgroundTheme: 'emerald_meadow',
};

export const AvatarSVG: React.FC<AvatarSVGProps> = ({
  config = DEFAULT_AVATAR_CONFIG,
  size = 'md',
  className = '',
  animate = false,
}) => {
  const cfg = { ...DEFAULT_AVATAR_CONFIG, ...config };

  const sizeDimensions = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44',
  };

  const backgroundColors = {
    emerald_meadow: { start: '#D1FAE5', end: '#A7F3D0', border: '#6EE7B7' },
    amber_sunrise: { start: '#FEF3C7', end: '#FDE68A', border: '#FCD34D' },
    twilight_sky: { start: '#E0E7FF', end: '#C7D2FE', border: '#A5B4FC' },
    indigo_district: { start: '#DDD6FE', end: '#C4B5FD', border: '#A78BFA' },
  }[cfg.backgroundTheme] || { start: '#D1FAE5', end: '#A7F3D0', border: '#6EE7B7' };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${
        sizeDimensions[size]
      } ${animate ? 'hover:scale-105 transition-transform' : ''} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full rounded-full shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bgGrad-${cfg.backgroundTheme}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={backgroundColors.start} />
            <stop offset="100%" stopColor={backgroundColors.end} />
          </linearGradient>
          <clipPath id="avatarCircleClip">
            <circle cx="50" cy="50" r="48" />
          </clipPath>
        </defs>

        {/* Circular Background Container */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={`url(#bgGrad-${cfg.backgroundTheme})`}
          stroke={backgroundColors.border}
          strokeWidth="3"
        />

        {/* Clipped character body and head */}
        <g clipPath="url(#avatarCircleClip)">
          {/* Hair back layer (for twin braids or long hair) */}
          {cfg.hairStyle === 'twin_braids' && (
            <g fill={cfg.hairColor}>
              {/* Left Braid */}
              <ellipse cx="22" cy="62" rx="7" ry="12" transform="rotate(-15 22 62)" />
              <ellipse cx="20" cy="74" rx="5.5" ry="9" transform="rotate(-10 20 74)" />
              <circle cx="19" cy="83" r="4" />
              <circle cx="21" cy="71" r="3.5" fill="#EC4899" /> {/* Hair tie pink */}
              {/* Right Braid */}
              <ellipse cx="78" cy="62" rx="7" ry="12" transform="rotate(15 78 62)" />
              <ellipse cx="80" cy="74" rx="5.5" ry="9" transform="rotate(10 80 74)" />
              <circle cx="81" cy="83" r="4" />
              <circle cx="79" cy="71" r="3.5" fill="#EC4899" />
            </g>
          )}

          {cfg.hairStyle === 'flowing_waves' && (
            <g fill={cfg.hairColor}>
              <path d="M 24 45 Q 16 65 22 88 Q 28 92 36 90 Q 28 65 30 45 Z" />
              <path d="M 76 45 Q 84 65 78 88 Q 72 92 64 90 Q 72 65 70 45 Z" />
            </g>
          )}

          {cfg.hairStyle === 'curly_afro' && (
            <g fill={cfg.hairColor}>
              <circle cx="30" cy="40" r="16" />
              <circle cx="50" cy="28" r="17" />
              <circle cx="70" cy="40" r="16" />
              <circle cx="24" cy="52" r="12" />
              <circle cx="76" cy="52" r="12" />
            </g>
          )}

          {/* Neck */}
          <rect x="44" y="60" width="12" height="15" rx="3" fill={cfg.skinTone} />
          {/* Subtle Neck shadow */}
          <path d="M 44 63 Q 50 67 56 63 L 56 67 Q 50 71 44 67 Z" fill="#00000018" />

          {/* Torso & Clothing Layer */}
          <g>
            {cfg.clothing === 'school_uniform_blue' && (
              <g>
                {/* Main Blue Shirt */}
                <path d="M 18 100 L 26 73 Q 50 70 74 73 L 82 100 Z" fill="#2563EB" />
                {/* White Inner Collar */}
                <path d="M 37 72 L 50 86 L 63 72 Z" fill="#FFFFFF" />
                {/* Blue Tie */}
                <path d="M 47 77 L 53 77 L 55 92 L 50 96 L 45 92 Z" fill="#1E3A8A" />
                <circle cx="50" cy="79" r="2.5" fill="#F59E0B" />
              </g>
            )}

            {cfg.clothing === 'school_uniform_maroon' && (
              <g>
                {/* Govt Primary School Maroon Shirt */}
                <path d="M 18 100 L 26 73 Q 50 70 74 73 L 82 100 Z" fill="#991B1B" />
                {/* Golden Collar Triangles */}
                <path d="M 36 72 L 50 82 L 44 72 Z" fill="#FEF08A" />
                <path d="M 64 72 L 50 82 L 56 72 Z" fill="#FEF08A" />
                {/* Buttons */}
                <circle cx="50" cy="87" r="1.8" fill="#FDE047" />
                <circle cx="50" cy="94" r="1.8" fill="#FDE047" />
              </g>
            )}

            {cfg.clothing === 'kurta_saffron' && (
              <g>
                {/* Traditional Saffron Kurta */}
                <path d="M 18 100 L 26 73 Q 50 70 74 73 L 82 100 Z" fill="#F59E0B" />
                {/* Mandarin collar band */}
                <path d="M 42 71 Q 50 74 58 71 L 58 75 Q 50 78 42 75 Z" fill="#D97706" />
                <line x1="50" y1="75" x2="50" y2="96" stroke="#B45309" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="50" cy="82" r="2" fill="#FEF3C7" />
                <circle cx="50" cy="89" r="2" fill="#FEF3C7" />
              </g>
            )}

            {cfg.clothing === 'kurta_emerald' && (
              <g>
                {/* Vibrant Emerald Festive Kurta */}
                <path d="M 18 100 L 26 73 Q 50 70 74 73 L 82 100 Z" fill="#059669" />
                <path d="M 42 71 Q 50 74 58 71 L 58 75 Q 50 78 42 75 Z" fill="#047857" />
                <path d="M 46 75 L 50 84 L 54 75 Z" fill="#FDE047" />
                <circle cx="50" cy="88" r="2" fill="#FDE047" />
              </g>
            )}

            {cfg.clothing === 'scholar_vest' && (
              <g>
                {/* White Shirt base */}
                <path d="M 18 100 L 26 73 Q 50 70 74 73 L 82 100 Z" fill="#F8FAFC" />
                {/* Scholar Forest Vest */}
                <path d="M 23 100 L 29 74 L 43 83 L 41 100 Z" fill="#14532D" />
                <path d="M 77 100 L 71 74 L 57 83 L 59 100 Z" fill="#14532D" />
                <path d="M 48 76 L 50 81 L 52 76 Z" fill="#DC2626" /> {/* Little bow */}
              </g>
            )}
          </g>

          {/* School Satchel Accessory (under head, over shoulder) */}
          {cfg.accessory === 'school_satchel' && (
            <g>
              <line x1="28" y1="74" x2="72" y2="100" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
              <line x1="28" y1="74" x2="72" y2="100" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
              {/* Attached bright yellow pencil */}
              <line x1="42" y1="80" x2="49" y2="85" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="49.5" cy="85.5" r="1.5" fill="#EF4444" /> {/* eraser */}
            </g>
          )}

          {/* Head Base Silhouette */}
          <ellipse cx="50" cy="46" rx="20" ry="22" fill={cfg.skinTone} />

          {/* Ears */}
          <circle cx="29" cy="48" r="4.5" fill={cfg.skinTone} />
          <circle cx="71" cy="48" r="4.5" fill={cfg.skinTone} />
          <circle cx="29" cy="48" r="2.5" fill="#00000015" />
          <circle cx="71" cy="48" r="2.5" fill="#00000015" />

          {/* Rosy Cheeks */}
          <ellipse cx="37" cy="52" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.25" />
          <ellipse cx="63" cy="52" rx="4.5" ry="2.5" fill="#F43F5E" opacity="0.25" />

          {/* Eyes & Expressions */}
          {cfg.expression === 'happy_smile' && (
            <g>
              {/* Twinkling Curved Happy Eyes */}
              <path d="M 37 42 Q 41 38 45 42" stroke="#1E1B18" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 55 42 Q 59 38 63 42" stroke="#1E1B18" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              {/* Cheerful Open Smile */}
              <path d="M 42 54 Q 50 63 58 54" stroke="#1E1B18" strokeWidth="2" fill="#BE123C" />
              <path d="M 45 55 Q 50 58 55 55" fill="#FFFFFF" />
            </g>
          )}

          {cfg.expression === 'curious_wink' && (
            <g>
              {/* Left Eye Open Curious */}
              <circle cx="41" cy="41" r="3.2" fill="#1E1B18" />
              <circle cx="42.2" cy="40" r="1.2" fill="#FFFFFF" />
              {/* Right Eye Winking */}
              <path d="M 56 42 Q 60 37 64 42" stroke="#1E1B18" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              {/* Playful Smirk */}
              <path d="M 44 54 Q 52 61 58 52" stroke="#1E1B18" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </g>
          )}

          {cfg.expression === 'star_eyes' && (
            <g>
              {/* Left Star Eye */}
              <path d="M 41 37 L 42.5 40.5 L 46 41.5 L 42.5 42.5 L 41 46 L 39.5 42.5 L 36 41.5 L 39.5 40.5 Z" fill="#F59E0B" />
              {/* Right Star Eye */}
              <path d="M 59 37 L 60.5 40.5 L 64 41.5 L 60.5 42.5 L 59 46 L 57.5 42.5 L 54 41.5 L 57.5 40.5 Z" fill="#F59E0B" />
              {/* Excited Open Smile */}
              <path d="M 41 53 Q 50 64 59 53 Z" fill="#BE123C" stroke="#1E1B18" strokeWidth="1.5" />
              <path d="M 44 54 Q 50 57 56 54" fill="#FFFFFF" />
            </g>
          )}

          {cfg.expression === 'focused_smile' && (
            <g>
              {/* Eyebrows */}
              <path d="M 36 37 L 45 39" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />
              <path d="M 64 37 L 55 39" stroke="#1E1B18" strokeWidth="2" strokeLinecap="round" />
              {/* Focused Round Eyes */}
              <circle cx="41" cy="42" r="3.2" fill="#1E1B18" />
              <circle cx="42.2" cy="41" r="1.2" fill="#FFFFFF" />
              <circle cx="59" cy="42" r="3.2" fill="#1E1B18" />
              <circle cx="60.2" cy="41" r="1.2" fill="#FFFFFF" />
              {/* Confident Smile */}
              <path d="M 43 54 Q 50 59 57 54" stroke="#1E1B18" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Glasses Accessory (Placed right over the eyes) */}
          {cfg.accessory === 'glasses_round' && (
            <g stroke="#92400E" strokeWidth="2.2" fill="none">
              <circle cx="41" cy="41" r="7.5" fill="#FFFFFF25" />
              <circle cx="59" cy="41" r="7.5" fill="#FFFFFF25" />
              <path d="M 48.5 41 Q 50 39 51.5 41" strokeLinecap="round" />
              <line x1="33.5" y1="41" x2="28" y2="44" strokeLinecap="round" />
              <line x1="66.5" y1="41" x2="72" y2="44" strokeLinecap="round" />
            </g>
          )}

          {/* Hair Top / Front Layer */}
          <g fill={cfg.hairColor}>
            {cfg.hairStyle === 'short_crops' && (
              <path d="M 28 42 C 28 26 40 22 50 22 C 60 22 72 26 72 42 C 72 43 70 38 65 37 C 58 35 52 38 48 36 C 42 34 35 38 28 42 Z" />
            )}

            {cfg.hairStyle === 'twin_braids' && (
              <path d="M 28 43 C 28 26 42 22 50 22 C 58 22 72 26 72 43 C 68 37 62 35 50 37 C 38 35 32 37 28 43 Z" />
            )}

            {cfg.hairStyle === 'side_part' && (
              <path d="M 27 42 C 27 25 42 21 52 21 C 65 21 73 28 73 42 C 70 34 60 33 46 33 C 34 33 30 38 27 42 Z" />
            )}

            {cfg.hairStyle === 'top_knot' && (
              <g>
                {/* Base hair */}
                <path d="M 28 43 C 28 27 42 23 50 23 C 58 23 72 27 72 43 C 68 37 62 36 50 37 C 38 36 32 37 28 43 Z" />
                {/* Top Bun Knot */}
                <circle cx="50" cy="18" r="9" />
                <circle cx="50" cy="22" r="3" fill="#EC4899" /> {/* Bun ribbon */}
              </g>
            )}

            {cfg.hairStyle === 'curly_afro' && (
              <path d="M 28 36 C 35 28 45 28 50 28 C 55 28 65 28 72 36 C 68 33 60 33 50 34 C 40 33 32 33 28 36 Z" />
            )}

            {cfg.hairStyle === 'flowing_waves' && (
              <path d="M 28 44 C 28 26 42 22 50 22 C 58 22 72 26 72 44 C 67 36 61 34 50 36 C 39 34 33 36 28 44 Z" />
            )}
          </g>

          {/* Jasmine / Marigold Flower Accessory */}
          {cfg.accessory === 'flower_jasmine' && (
            <g transform="translate(67, 30)">
              {/* Petals */}
              <circle cx="0" cy="-4" r="3.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
              <circle cx="4" cy="0" r="3.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
              <circle cx="0" cy="4" r="3.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
              <circle cx="-4" cy="0" r="3.2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="0.8" />
              {/* Center */}
              <circle cx="0" cy="0" r="2.8" fill="#F97316" />
            </g>
          )}

          {/* Scholar Mortarboard Cap Accessory */}
          {cfg.accessory === 'scholar_cap' && (
            <g transform="translate(50, 24)">
              {/* Diamond board */}
              <polygon points="0,-12 28,-3 0,6 -28,-3" fill="#0F172A" stroke="#334155" strokeWidth="1.2" />
              {/* Skull cap band */}
              <path d="M -15 -2 C -15 8 15 8 15 -2 Z" fill="#1E293B" />
              {/* Button & Golden Tassel */}
              <circle cx="0" cy="-3" r="2.2" fill="#F59E0B" />
              <path d="M 0 -3 Q 12 -4 18 6 L 19 12" stroke="#F59E0B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <circle cx="19" cy="13" r="1.5" fill="#D97706" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

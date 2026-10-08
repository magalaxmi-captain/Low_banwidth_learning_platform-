import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  RotateCcw,
  Palette,
  Smile,
  Scissors,
  Shirt,
  Glasses,
  Save,
  Compass,
} from 'lucide-react';
import { AvatarConfig, Student } from '../types.ts';
import { AvatarSVG, DEFAULT_AVATAR_CONFIG } from './AvatarSVG.tsx';
import { TactileButton } from './TactileButton.tsx';

interface CharacterCreatorProps {
  currentStudent: Student;
  onSaveAvatar: (newConfig: AvatarConfig) => void;
  onClose?: () => void;
}

type TabCategory = 'hair' | 'face' | 'clothing' | 'accessories' | 'backdrop';

export const CharacterCreator: React.FC<CharacterCreatorProps> = ({
  currentStudent,
  onSaveAvatar,
  onClose,
}) => {
  const [avatar, setAvatar] = useState<AvatarConfig>(
    currentStudent.avatarConfig || DEFAULT_AVATAR_CONFIG
  );
  const [activeTab, setActiveTab] = useState<TabCategory>('hair');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Available customization options
  const skinTones = [
    { id: '#F8D9B4', label: 'Warm Peach', color: '#F8D9B4' },
    { id: '#E5B887', label: 'Golden Honey', color: '#E5B887' },
    { id: '#C68642', label: 'Warm Bronze', color: '#C68642' },
    { id: '#8D5524', label: 'Deep Amber', color: '#8D5524' },
    { id: '#5C3818', label: 'Rich Espresso', color: '#5C3818' },
  ];

  const hairColors = [
    { id: '#1E1B18', label: 'Jet Black', color: '#1E1B18' },
    { id: '#3D2314', label: 'Dark Chestnut', color: '#3D2314' },
    { id: '#5A3825', label: 'Auburn Copper', color: '#5A3825' },
    { id: '#8B4513', label: 'Warm Cinnamon', color: '#8B4513' },
  ];

  const hairStyles: Array<{ id: AvatarConfig['hairStyle']; label: string; desc: string }> = [
    { id: 'short_crops', label: 'Neat Crop', desc: 'Short school style' },
    { id: 'twin_braids', label: 'Twin Braids', desc: 'Tied with ribbons' },
    { id: 'top_knot', label: 'Top Bun Knot', desc: 'Traditional student knot' },
    { id: 'curly_afro', label: 'Bouncy Curls', desc: 'Soft voluminous curls' },
    { id: 'side_part', label: 'Side Part', desc: 'Sleek brushed side' },
    { id: 'flowing_waves', label: 'Flowing Waves', desc: 'Shoulder-length waves' },
  ];

  const expressions: Array<{ id: AvatarConfig['expression']; label: string; emoji: string }> = [
    { id: 'happy_smile', label: 'Cheerful Grin', emoji: '😊' },
    { id: 'curious_wink', label: 'Curious Wink', emoji: '😉' },
    { id: 'star_eyes', label: 'Excited Stars', emoji: '🤩' },
    { id: 'focused_smile', label: 'Focused Scholar', emoji: '🤓' },
  ];

  const clothingStyles: Array<{
    id: AvatarConfig['clothing'];
    label: string;
    badge: string;
    color: string;
  }> = [
    {
      id: 'school_uniform_blue',
      label: 'Primary School Uniform',
      badge: 'Blue & Tie',
      color: '#2563EB',
    },
    {
      id: 'school_uniform_maroon',
      label: 'Govt School Maroon',
      badge: 'Gold Collars',
      color: '#991B1B',
    },
    {
      id: 'kurta_saffron',
      label: 'Traditional Saffron Kurta',
      badge: 'Village Festive',
      color: '#F59E0B',
    },
    {
      id: 'kurta_emerald',
      label: 'Emerald Green Kurta',
      badge: 'Celebration',
      color: '#059669',
    },
    {
      id: 'scholar_vest',
      label: 'STEM Scholar Vest',
      badge: 'Explorer Vest',
      color: '#14532D',
    },
  ];

  const accessories: Array<{ id: AvatarConfig['accessory']; label: string; icon: string }> = [
    { id: 'none', label: 'None', icon: '✨' },
    { id: 'glasses_round', label: 'Scholar Glasses', icon: '👓' },
    { id: 'flower_jasmine', label: 'Jasmine Bloom', icon: '🌼' },
    { id: 'scholar_cap', label: 'Graduation Cap', icon: '🎓' },
    { id: 'school_satchel', label: 'School Satchel', icon: '🎒' },
  ];

  const backgroundThemes: Array<{
    id: AvatarConfig['backgroundTheme'];
    label: string;
    from: string;
    to: string;
  }> = [
    { id: 'emerald_meadow', label: 'Sundarpur Meadow', from: '#D1FAE5', to: '#A7F3D0' },
    { id: 'amber_sunrise', label: 'Village Sunrise', from: '#FEF3C7', to: '#FDE68A' },
    { id: 'twilight_sky', label: 'Twilight River', from: '#E0E7FF', to: '#C7D2FE' },
    { id: 'indigo_district', label: 'District Night', from: '#DDD6FE', to: '#C4B5FD' },
  ];

  const handleRandomize = () => {
    const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const newCfg: AvatarConfig = {
      skinTone: randomItem(skinTones).id,
      hairStyle: randomItem(hairStyles).id,
      hairColor: randomItem(hairColors).id,
      clothing: randomItem(clothingStyles).id,
      clothingColor: '#2563EB',
      expression: randomItem(expressions).id,
      accessory: randomItem(accessories).id,
      backgroundTheme: randomItem(backgroundThemes).id,
    };
    setAvatar(newCfg);
  };

  const handleSave = () => {
    onSaveAvatar(avatar);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto pb-28 pt-3 px-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 mb-0.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Character Studio</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Design Your Avatar</h2>
          <p className="text-xs text-slate-500 font-medium">
            Your personal mascot in lessons, profile & village rankings
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 shadow-xs transition-all active:scale-95"
          title="Randomize avatar"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
          <span>Surprise Me</span>
        </button>
      </div>

      {/* Main Avatar Showcase Podium */}
      <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-5 border-2 border-slate-200/90 shadow-sm relative flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100/50 rounded-full blur-2xl -z-0" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-100/50 rounded-full blur-2xl -z-0" />

        {/* Floating Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 shadow-xs text-xs font-bold text-slate-700 mb-3 z-10">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{currentStudent.name} ({currentStudent.village})</span>
        </div>

        {/* Big Avatar SVG Render */}
        <div className="z-10 my-1 drop-shadow-md">
          <AvatarSVG config={avatar} size="2xl" animate />
        </div>

        {/* Active features quick chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 z-10 text-[11px] font-semibold text-slate-600">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            {hairStyles.find((h) => h.id === avatar.hairStyle)?.label}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
            {clothingStyles.find((c) => c.id === avatar.clothing)?.badge}
          </span>
          {avatar.accessory !== 'none' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {accessories.find((a) => a.id === avatar.accessory)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
        {[
          { id: 'hair', label: 'Hair', icon: Scissors },
          { id: 'face', label: 'Face', icon: Smile },
          { id: 'clothing', label: 'Outfit', icon: Shirt },
          { id: 'accessories', label: 'Gear', icon: Glasses },
          { id: 'backdrop', label: 'Glow', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabCategory)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Customization Options Panels */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-xs space-y-4 min-h-[220px]">
        {/* TAB 1: HAIR & HAIR COLOR */}
        {activeTab === 'hair' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Hairstyle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {hairStyles.map((style) => {
                  const isSelected = avatar.hairStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, hairStyle: style.id })}
                      className={`p-2.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{style.label}</div>
                        <div className="text-[10px] text-slate-500">{style.desc}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Hair Color
              </label>
              <div className="flex items-center gap-3">
                {hairColors.map((color) => {
                  const isSelected = avatar.hairColor === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, hairColor: color.id })}
                      className={`relative w-10 h-10 rounded-full border-2 transition-transform active:scale-95 flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 scale-110 shadow-sm' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FACE & SKIN TONE & EXPRESSION */}
        {activeTab === 'face' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Skin Tone
              </label>
              <div className="flex items-center gap-3">
                {skinTones.map((tone) => {
                  const isSelected = avatar.skinTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, skinTone: tone.id })}
                      className={`relative w-10 h-10 rounded-full border-2 transition-transform active:scale-95 flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 scale-110 shadow-sm' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: tone.color }}
                      title={tone.label}
                    >
                      {isSelected && <Check className="w-4 h-4 text-slate-800 drop-shadow-xs" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                Expression
              </label>
              <div className="grid grid-cols-2 gap-2">
                {expressions.map((exp) => {
                  const isSelected = avatar.expression === exp.id;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setAvatar({ ...avatar, expression: exp.id })}
                      className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-xl">{exp.emoji}</span>
                      <div className="text-xs font-bold text-slate-800">{exp.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OUTFIT & CLOTHING */}
        {activeTab === 'clothing' && (
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              School & Traditional Clothing
            </label>
            <div className="space-y-2">
              {clothingStyles.map((item) => {
                const isSelected = avatar.clothing === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, clothing: item.id })}
                    className={`w-full p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-black/20"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.badge}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ACCESSORIES */}
        {activeTab === 'accessories' && (
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Academic & Village Accessories
            </label>
            <div className="grid grid-cols-2 gap-2">
              {accessories.map((acc) => {
                const isSelected = avatar.accessory === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, accessory: acc.id })}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xl">{acc.icon}</span>
                    <span className="text-xs font-bold text-slate-800">{acc.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: BACKDROP THEME */}
        {activeTab === 'backdrop' && (
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
              Badge Atmosphere & Aura
            </label>
            <div className="grid grid-cols-2 gap-2">
              {backgroundThemes.map((bg) => {
                const isSelected = avatar.backgroundTheme === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setAvatar({ ...avatar, backgroundTheme: bg.id })}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${bg.from}, ${bg.to})`,
                    }}
                  >
                    <span className="text-xs font-bold text-slate-900">{bg.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-800 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Button: Save Avatar */}
      <div className="pt-2">
        <TactileButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
          icon={isSavedNotice ? Check : Save}
        >
          {isSavedNotice ? 'Avatar Saved Successfully!' : 'Save & Wear Avatar'}
        </TactileButton>
      </div>
    </div>
  );
};

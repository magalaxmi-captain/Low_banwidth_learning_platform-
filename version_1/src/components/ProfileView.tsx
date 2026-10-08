import React, { useState } from 'react';
import {
  User,
  Award,
  Flame,
  Calendar,
  BookOpen,
  HardDrive,
  LogIn,
  CheckCircle2,
  ChevronRight,
  School,
  Sparkles,
  Palette,
} from 'lucide-react';
import { Student } from '../types.ts';
import { TactileButton } from './TactileButton.tsx';
import { AvatarSVG } from './AvatarSVG.tsx';

interface ProfileViewProps {
  currentStudent: Student;
  allStudents: Student[];
  onSwitchStudent: (studentId: string) => void;
  onTriggerCheckIn: () => void;
  onOpenSyncModal: () => void;
  onOpenCharacterCreator?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentStudent,
  allStudents,
  onSwitchStudent,
  onTriggerCheckIn,
  onOpenSyncModal,
  onOpenCharacterCreator,
}) => {
  const [checkedInMessage, setCheckedInMessage] = useState<string | null>(null);

  const handleCheckIn = () => {
    onTriggerCheckIn();
    setCheckedInMessage(`Attendance marked for today (${new Date().toLocaleDateString()})!`);
    setTimeout(() => setCheckedInMessage(null), 3000);
  };

  const badges = [
    { id: 'b1', name: 'Fraction Pioneer', icon: '🍰', desc: 'Mastered halves and quarters', earned: true },
    { id: 'b2', name: 'Monsoon Scientist', icon: '🌧️', desc: 'Completed water cycle unit', earned: true },
    { id: 'b3', name: 'Zero-Data Scholar', icon: '⚡', desc: 'Completed 10 lessons fully offline', earned: true },
    { id: 'b4', name: 'Village Champion', icon: '🏆', desc: 'Reached Top 3 on Sundarpur Leaderboard', earned: true },
    { id: 'b5', name: 'Boss Slayer', icon: '⚔️', desc: 'Conquer Unit 1 Mastery Challenge', earned: false },
  ];

  return (
    <div className="w-full max-w-md mx-auto pb-28 pt-4 px-4 space-y-5">
      {/* Student ID Card */}
      <div className="p-5 bg-white border-2 border-slate-200 rounded-3xl shadow-sm text-slate-800 relative overflow-hidden">
        {/* Top ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            <School className="w-3.5 h-3.5" />
            <span>{currentStudent.school}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">
            {currentStudent.studentCode}
          </span>
        </div>

        {/* Profile Info with Custom Avatar */}
        <div className="flex items-center gap-4 my-4">
          <div className="relative shrink-0 group">
            <AvatarSVG config={currentStudent.avatarConfig} size="lg" animate />
            {onOpenCharacterCreator && (
              <button
                type="button"
                onClick={onOpenCharacterCreator}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 text-white border-2 border-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
                title="Customize Character Avatar"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight truncate">
              {currentStudent.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Grade {currentStudent.gradeLevel} • Village {currentStudent.village}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                <Flame className="w-3 h-3 fill-amber-500" /> {currentStudent.streakDays} Day Streak
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                {currentStudent.totalXp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Character Creator Quick Button */}
        {onOpenCharacterCreator && (
          <div className="mb-3">
            <button
              type="button"
              onClick={onOpenCharacterCreator}
              className="w-full py-2 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Customize Mascot & Scholar Avatar</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Check-In Button */}
        <div className="pt-1">
          {checkedInMessage ? (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{checkedInMessage}</span>
            </div>
          ) : (
            <TactileButton variant="primary" size="md" fullWidth onClick={handleCheckIn}>
              <LogIn className="w-4 h-4 mr-2" /> Log Daily Attendance Check-In
            </TactileButton>
          )}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Badges & Credentials</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">4 / 5 Earned</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 ${
                badge.earned
                  ? 'bg-white border-slate-200 shadow-2xs'
                  : 'bg-slate-50 border-slate-200 opacity-50'
              }`}
            >
              <div className="text-2xl shrink-0">{badge.icon}</div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-800 truncate">{badge.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Switch Student (Village Tablet Sharing) */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
          Switch Student Profile (Shared Rural Device)
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Rural schools often share 1 tablet between multiple siblings or classmates:
        </p>

        <div className="space-y-1.5">
          {allStudents.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSwitchStudent(s.id)}
              className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-colors text-xs font-bold ${
                s.id === currentStudent.id
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{s.name}</span>
                <span className="text-[10px] font-normal text-slate-500">
                  (Grade {s.gradeLevel}, {s.village})
                </span>
              </div>
              {s.id === currentStudent.id && (
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

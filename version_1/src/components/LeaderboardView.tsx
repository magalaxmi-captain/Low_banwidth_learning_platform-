import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  MapPin,
  Medal,
  Sparkles,
  Users,
  Calendar,
  School,
  ArrowUp,
  RefreshCw,
} from 'lucide-react';
import { Student, AvatarConfig } from '../types.ts';
import { AvatarSVG } from './AvatarSVG.tsx';

interface LeaderboardStudent {
  id: string;
  name: string;
  village: string;
  school: string;
  gradeLevel: number;
  streak: number;
  xp: number;
  totalXp: number;
  avatar: string;
  avatarConfig?: AvatarConfig;
  rank: number;
  isCurrent?: boolean;
}

interface LeaderboardViewProps {
  currentStudent?: Student;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentStudent }) => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all_time'>('weekly');
  const [scope, setScope] = useState<'classroom' | 'sundarpur' | 'rampur' | 'pipariya' | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<LeaderboardStudent[]>([]);

  // Efficient fetch from REST API with fallback
  useEffect(() => {
    let isMounted = true;
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const villageParam = ['sundarpur', 'rampur', 'pipariya'].includes(scope) ? scope : 'all';
        const classroomParam = scope === 'classroom' ? `grade ${currentStudent?.gradeLevel || 4}` : 'all';

        const res = await fetch(
          `/api/leaderboard?period=${period}&village=${villageParam}&classroom=${classroomParam}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setStudents(data.leaderboard || []);
          }
        } else {
          fallbackMock();
        }
      } catch (e) {
        fallbackMock();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fallbackMock = () => {
      const mockList: LeaderboardStudent[] = [
        {
          id: 'std_04',
          name: 'Vikram Singh',
          village: 'Pipariya',
          school: 'Pipariya Middle School',
          gradeLevel: 5,
          streak: 15,
          xp: period === 'weekly' ? 245 : period === 'monthly' ? 440 : 540,
          totalXp: 540,
          avatar: 'elephant_gajraj',
          rank: 1,
          avatarConfig: {
            skinTone: '#8D5524',
            hairStyle: 'side_part',
            hairColor: '#1E1B18',
            clothing: 'scholar_vest',
            expression: 'focused_smile',
            accessory: 'scholar_cap',
            backgroundTheme: 'indigo_district',
          },
        },
        {
          id: 'std_01',
          name: 'Priya Sharma',
          village: 'Sundarpur',
          school: 'Govt Primary School Sundarpur',
          gradeLevel: 4,
          streak: 12,
          xp: period === 'weekly' ? 205 : period === 'monthly' ? 370 : 450,
          totalXp: 450,
          avatar: 'owl_veera',
          rank: 2,
          isCurrent: true,
          avatarConfig: currentStudent?.avatarConfig || {
            skinTone: '#E5B887',
            hairStyle: 'twin_braids',
            hairColor: '#1E1B18',
            clothing: 'school_uniform_blue',
            expression: 'happy_smile',
            accessory: 'flower_jasmine',
            backgroundTheme: 'emerald_meadow',
          },
        },
        {
          id: 'std_02',
          name: 'Aarav Patel',
          village: 'Rampur',
          school: 'Rampur Adarsh Vidyalaya',
          gradeLevel: 4,
          streak: 10,
          xp: period === 'weekly' ? 185 : period === 'monthly' ? 335 : 410,
          totalXp: 410,
          avatar: 'tiger_shaan',
          rank: 3,
          avatarConfig: {
            skinTone: '#C68642',
            hairStyle: 'short_crops',
            hairColor: '#1E1B18',
            clothing: 'kurta_saffron',
            expression: 'curious_wink',
            accessory: 'glasses_round',
            backgroundTheme: 'amber_sunrise',
          },
        },
        {
          id: 'std_03',
          name: 'Meera Das',
          village: 'Sundarpur',
          school: 'Govt Primary School Sundarpur',
          gradeLevel: 4,
          streak: 8,
          xp: period === 'weekly' ? 170 : period === 'monthly' ? 310 : 380,
          totalXp: 380,
          avatar: 'sparrow_chiki',
          rank: 4,
          avatarConfig: {
            skinTone: '#F8D9B4',
            hairStyle: 'top_knot',
            hairColor: '#3D2314',
            clothing: 'school_uniform_maroon',
            expression: 'star_eyes',
            accessory: 'none',
            backgroundTheme: 'twilight_sky',
          },
        },
        {
          id: 'std_05',
          name: 'Ananya Rao',
          village: 'Pipariya',
          school: 'Pipariya Middle School',
          gradeLevel: 4,
          streak: 6,
          xp: period === 'weekly' ? 130 : period === 'monthly' ? 240 : 290,
          totalXp: 290,
          avatar: 'deer_harini',
          rank: 5,
          avatarConfig: {
            skinTone: '#C68642',
            hairStyle: 'flowing_waves',
            hairColor: '#1E1B18',
            clothing: 'kurta_emerald',
            expression: 'happy_smile',
            accessory: 'school_satchel',
            backgroundTheme: 'emerald_meadow',
          },
        },
      ];

      let filtered = mockList;
      if (['sundarpur', 'rampur', 'pipariya'].includes(scope)) {
        filtered = mockList.filter((s) => s.village.toLowerCase() === scope);
      } else if (scope === 'classroom') {
        filtered = mockList.filter((s) => s.gradeLevel === 4);
      }

      setStudents(
        filtered.map((s, idx) => ({
          ...s,
          rank: idx + 1,
          isCurrent: s.id === (currentStudent?.id || 'std_01'),
        }))
      );
    };

    fetchLeaderboard();
    return () => {
      isMounted = false;
    };
  }, [period, scope, currentStudent]);

  // Podium (top 3)
  const top1 = students[0];
  const top2 = students[1];
  const top3 = students[2];

  // Find current student in list
  const currentRankInfo = students.find(
    (s) => s.isCurrent || s.id === (currentStudent?.id || 'std_01')
  );
  const nextStudentAhead =
    currentRankInfo && currentRankInfo.rank > 1
      ? students.find((s) => s.rank === currentRankInfo.rank - 1)
      : null;

  return (
    <div className="w-full max-w-md mx-auto pb-28 pt-4 px-4 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-400 mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Village & District League</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">Academic Leaderboard</h2>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Ranked by verified offline & online STEM XP
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
        </div>

        {/* Timeframe Tabs: Weekly / Monthly / All-Time */}
        <div className="grid grid-cols-3 gap-1 mt-4 p-1 bg-white/10 rounded-2xl border border-white/15 text-center">
          {[
            { id: 'weekly', label: 'This Week' },
            { id: 'monthly', label: 'This Month' },
            { id: 'all_time', label: 'All-Time' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setPeriod(t.id as any)}
              className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                period === t.id
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Scope Filter (Classroom / Village / District) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase px-1">
          <span>Filter Community</span>
          {loading && (
            <span className="flex items-center gap-1 text-emerald-600 lowercase font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" /> refreshing...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Villages' },
            { id: 'classroom', label: '🏫 Grade 4-A' },
            { id: 'sundarpur', label: 'Sundarpur' },
            { id: 'rampur', label: 'Rampur' },
            { id: 'pipariya', label: 'Pipariya' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScope(tab.id as any)}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                scope === tab.id
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Student Position Banner */}
      {currentRankInfo && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
              #{currentRankInfo.rank}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">
                You are Ranked #{currentRankInfo.rank} in {scope === 'all' ? 'District' : scope.toUpperCase()}
              </div>
              <div className="text-[11px] text-emerald-800 font-medium">
                {nextStudentAhead
                  ? `+${nextStudentAhead.xp - currentRankInfo.xp + 10} XP to surpass ${nextStudentAhead.name}!`
                  : '🌟 Leading the podium! Keep your streak strong.'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs block">
              {currentRankInfo.xp} XP
            </span>
          </div>
        </div>
      )}

      {/* Top 3 Visual Podium */}
      {students.length >= 3 && (
        <div className="flex items-end justify-center gap-2 pt-2 pb-1">
          {/* Rank 2 (Silver) */}
          {top2 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1">
                <AvatarSVG config={top2.avatarConfig} size="md" />
                <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-slate-200 border border-slate-400 text-slate-700 font-black text-[10px] flex items-center justify-center shadow-xs">
                  2
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate max-w-[90px] text-center">
                {top2.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{top2.xp} XP</div>
              <div className="w-full h-16 bg-slate-200 rounded-t-2xl border-t-4 border-slate-300 flex items-center justify-center text-slate-500 font-black text-sm mt-1">
                🥈
              </div>
            </div>
          )}

          {/* Rank 1 (Gold - Taller Center) */}
          {top1 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="text-base animate-bounce mb-0.5">👑</div>
              <div className="relative mb-1">
                <AvatarSVG config={top1.avatarConfig} size="lg" animate />
                <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-400 border border-amber-600 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
                  1
                </span>
              </div>
              <div className="text-xs font-black text-slate-900 truncate max-w-[100px] text-center">
                {top1.name.split(' ')[0]}
              </div>
              <div className="text-[11px] text-amber-800 font-black">{top1.xp} XP</div>
              <div className="w-full h-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl border-t-4 border-amber-400 flex items-center justify-center text-amber-900 font-black text-lg mt-1 shadow-sm">
                🥇
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {top3 && (
            <div className="flex-1 flex flex-col items-center">
              <div className="relative mb-1">
                <AvatarSVG config={top3.avatarConfig} size="md" />
                <span className="absolute -top-2 -right-1 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-black text-[10px] flex items-center justify-center shadow-xs">
                  3
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 truncate max-w-[90px] text-center">
                {top3.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">{top3.xp} XP</div>
              <div className="w-full h-12 bg-amber-100 rounded-t-2xl border-t-4 border-amber-200 flex items-center justify-center text-amber-700 font-black text-sm mt-1">
                🥉
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ranked Students List */}
      <div className="space-y-2">
        {students.map((student) => {
          const isMe = student.isCurrent || student.id === (currentStudent?.id || 'std_01');
          return (
            <div
              key={student.id}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between ${
                isMe
                  ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-2 ring-emerald-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank Number */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    student.rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : student.rank === 2
                      ? 'bg-slate-200 text-slate-800'
                      : student.rank === 3
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  #{student.rank}
                </div>

                {/* Avatar SVG */}
                <AvatarSVG config={student.avatarConfig} size="sm" />

                {/* Name & Village */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 truncate">
                      {student.name}
                    </span>
                    {isMe && (
                      <span className="px-1.5 py-0.2 bg-emerald-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{student.village}</span>
                    <span>•</span>
                    <span>Grade {student.gradeLevel}</span>
                  </div>
                </div>
              </div>

              {/* XP & Streak Stats */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{student.streak}</span>
                </div>
                <div className="text-right min-w-[65px]">
                  <div className="text-xs font-black text-slate-900">{student.xp} XP</div>
                  <div className="text-[9px] text-slate-400 font-semibold">
                    {period === 'weekly' ? 'this week' : period === 'monthly' ? 'this month' : 'total'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Challenge Incentive Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-4 text-white shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-200">
            <School className="w-3.5 h-3.5" />
            <span>Village Pride League</span>
          </div>
          <div className="text-xs font-bold text-white">
            Sundarpur is leading District STEM Mastery!
          </div>
          <div className="text-[11px] text-emerald-100">
            Complete your next lesson to defend Sundarpur's #1 spot.
          </div>
        </div>
        <div className="text-2xl shrink-0 ml-2">🌾</div>
      </div>
    </div>
  );
};

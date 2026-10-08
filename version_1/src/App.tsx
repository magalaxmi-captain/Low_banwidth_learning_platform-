import React, { useState, useEffect } from 'react';
import {
  Compass,
  Target,
  Trophy,
  User,
  Palette,
  LineChart,
  Wifi,
  Sparkles,
  Award,
  Flame,
  Diamond,
  Zap,
} from 'lucide-react';
import { Student, LessonNode, AvatarConfig } from './types.ts';
import {
  SUBJECTS,
  SubjectMeta,
  MATH_LESSON_NODES,
  SCIENCE_LESSON_NODES,
  LITERACY_LESSON_NODES,
} from './data/curriculumData.ts';

import { TopAppBar } from './components/TopAppBar.tsx';
import { LearningPath } from './components/LearningPath.tsx';
import { QuestsView } from './components/QuestsView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { CharacterCreator } from './components/CharacterCreator.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { TeacherAnalyticsView } from './components/TeacherAnalyticsView.tsx';
import { MicroLessonModal } from './components/MicroLessonModal.tsx';
import { CelebrationModal } from './components/CelebrationModal.tsx';
import { OfflineSyncModal } from './components/OfflineSyncModal.tsx';
import { AvatarSVG, DEFAULT_AVATAR_CONFIG } from './components/AvatarSVG.tsx';

type NavigationTab = 'learn' | 'quests' | 'leaderboard' | 'character' | 'profile' | 'teacher';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('learn');
  const [currentSubject, setCurrentSubject] = useState<SubjectMeta>(SUBJECTS[0]);

  // Initial student state
  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: 'std_01',
    studentCode: 'SDP-G4-001',
    name: 'Priya Sharma',
    village: 'Sundarpur',
    school: 'Govt Primary School Sundarpur',
    gradeLevel: 4,
    avatar: 'owl_veera',
    avatarConfig: DEFAULT_AVATAR_CONFIG,
    streakDays: 12,
    totalXp: 450,
    gems: 620,
    hearts: 5,
    maxHearts: 5,
    lastActiveAt: new Date().toISOString(),
    currentSubject: 'math',
  });

  const [allStudents, setAllStudents] = useState<Student[]>([currentStudent]);
  const [isOnline, setIsOnline] = useState(true);

  // Lesson nodes per subject
  const [mathNodes, setMathNodes] = useState<LessonNode[]>(MATH_LESSON_NODES);
  const [scienceNodes, setScienceNodes] = useState<LessonNode[]>(SCIENCE_LESSON_NODES);
  const [literacyNodes, setLiteracyNodes] = useState<LessonNode[]>(LITERACY_LESSON_NODES);

  // Modals state
  const [activeLesson, setActiveLesson] = useState<LessonNode | null>(null);
  const [celebrationData, setCelebrationData] = useState<{
    lessonTitle: string;
    stats: {
      scorePercent: number;
      accuracyRate: number;
      xpEarned: number;
      mistakesCount: number;
      durationSeconds: number;
    };
  } | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Fetch initial student list from API
  useEffect(() => {
    fetch('/api/students')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.students && data.students.length > 0) {
          setAllStudents(data.students);
          const found = data.students.find((s: Student) => s.id === currentStudent.id);
          if (found) {
            setCurrentStudent(found);
          }
        }
      })
      .catch(() => {
        // Fallback to local state
      });
  }, []);

  // Save Avatar configuration
  const handleSaveAvatar = async (newConfig: AvatarConfig) => {
    const updatedStudent = { ...currentStudent, avatarConfig: newConfig };
    setCurrentStudent(updatedStudent);
    setAllStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? updatedStudent : s))
    );

    try {
      await fetch(`/api/students/${currentStudent.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarConfig: newConfig }),
      });
    } catch (e) {
      // Offline fallback: saved in local student state
    }
  };

  // Switch Active Student
  const handleSwitchStudent = (studentId: string) => {
    const s = allStudents.find((student) => student.id === studentId);
    if (s) {
      setCurrentStudent(s);
    }
  };

  // Trigger Check-in / Attendance
  const handleTriggerCheckIn = async () => {
    try {
      const res = await fetch('/api/students/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          networkMode: isOnline ? 'broadband' : 'offline',
          durationMinutes: 30,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.student) {
          setCurrentStudent(data.student);
        }
      } else {
        setCurrentStudent((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
      }
    } catch {
      setCurrentStudent((prev) => ({ ...prev, streakDays: prev.streakDays + 1 }));
    }
  };

  // Claim Quest / Goal Reward
  const handleClaimReward = (xp: number, gems: number) => {
    setCurrentStudent((prev) => ({
      ...prev,
      totalXp: prev.totalXp + xp,
      gems: prev.gems + gems,
    }));
  };

  // Current Subject Nodes
  const getCurrentNodes = () => {
    switch (currentSubject.id) {
      case 'science':
        return scienceNodes;
      case 'literacy':
        return literacyNodes;
      default:
        return mathNodes;
    }
  };

  // Lesson Finished
  const handleFinishLesson = async (stats: {
    scorePercent: number;
    accuracyRate: number;
    xpEarned: number;
    mistakesCount: number;
    durationSeconds: number;
  }) => {
    if (!activeLesson) return;

    // Update student XP & gems
    setCurrentStudent((prev) => ({
      ...prev,
      totalXp: prev.totalXp + stats.xpEarned,
      gems: prev.gems + Math.floor(stats.xpEarned / 2),
    }));

    // Mark node completed and unlock next node
    const updateNodes = (nodes: LessonNode[]) => {
      const idx = nodes.findIndex((n) => n.id === activeLesson.id);
      return nodes.map((node, i) => {
        if (i === idx) {
          return {
            ...node,
            status: 'completed' as const,
            starsEarned: stats.accuracyRate >= 95 ? 3 : stats.accuracyRate >= 80 ? 2 : 1,
            bestScore: stats.scorePercent,
          };
        }
        if (i === idx + 1 && node.status === 'locked') {
          return { ...node, status: 'active' as const };
        }
        return node;
      });
    };

    if (currentSubject.id === 'science') {
      setScienceNodes((prev) => updateNodes(prev));
    } else if (currentSubject.id === 'literacy') {
      setLiteracyNodes((prev) => updateNodes(prev));
    } else {
      setMathNodes((prev) => updateNodes(prev));
    }

    // Persist to server API
    try {
      await fetch('/api/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentStudent.id,
          subjectId: currentSubject.id,
          nodeId: activeLesson.id,
          nodeTitle: activeLesson.title,
          ...stats,
          offlineSynced: isOnline,
        }),
      });
    } catch {
      // Local state already updated
    }

    const lessonName = activeLesson.title;
    setActiveLesson(null);
    setCelebrationData({ lessonTitle: lessonName, stats });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Application Bar with Subject Switcher & Gamified Header Stats */}
      <TopAppBar
        currentSubject={currentSubject}
        onSelectSubject={(subj) => setCurrentSubject(subj)}
        streakDays={currentStudent.streakDays}
        gems={currentStudent.gems}
        totalXp={currentStudent.totalXp}
        isOnline={isOnline}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 w-full max-w-md mx-auto relative overflow-x-hidden">
        {activeTab === 'learn' && (
          <LearningPath
            currentSubject={currentSubject}
            nodes={getCurrentNodes()}
            currentStudent={currentStudent}
            onSelectNode={(node) => {
              if (node.status !== 'locked') {
                setActiveLesson(node);
              }
            }}
            onOpenCharacterCreator={() => setActiveTab('character')}
          />
        )}

        {activeTab === 'quests' && (
          <QuestsView onClaimReward={handleClaimReward} />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView currentStudent={currentStudent} />
        )}

        {activeTab === 'character' && (
          <CharacterCreator
            currentStudent={currentStudent}
            onSaveAvatar={handleSaveAvatar}
            onClose={() => setActiveTab('profile')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentStudent={currentStudent}
            allStudents={allStudents}
            onSwitchStudent={handleSwitchStudent}
            onTriggerCheckIn={handleTriggerCheckIn}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onOpenCharacterCreator={() => setActiveTab('character')}
          />
        )}

        {activeTab === 'teacher' && (
          <div className="pb-28 pt-3 px-3">
            <TeacherAnalyticsView />
          </div>
        )}
      </main>

      {/* Persistent Tactile Bottom Navigation Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t-2 border-slate-200 shadow-lg"
      >
        <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 px-1 py-1.5">
          {/* 1. Learn Path */}
          <button
            type="button"
            onClick={() => setActiveTab('learn')}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'learn'
                ? 'bg-emerald-50 text-emerald-700 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'learn' ? 'text-emerald-600' : ''}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5">Learn</span>
          </button>

          {/* 2. Quests / Daily Goals */}
          <button
            type="button"
            onClick={() => setActiveTab('quests')}
            className={`min-h-[48px] relative flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'quests'
                ? 'bg-amber-50 text-amber-800 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className={`w-5 h-5 ${activeTab === 'quests' ? 'text-amber-600' : ''}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5">Quests</span>
            {/* Pulsing Quest Ready dot */}
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
          </button>

          {/* 3. Leaderboard */}
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'leaderboard'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className={`w-5 h-5 ${activeTab === 'leaderboard' ? 'text-indigo-600' : ''}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5">Ranks</span>
          </button>

          {/* 4. Character Creator */}
          <button
            type="button"
            onClick={() => setActiveTab('character')}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'character'
                ? 'bg-emerald-50 text-emerald-700 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <AvatarSVG config={currentStudent.avatarConfig} size="xs" />
            </div>
            <span className="text-[10px] font-black tracking-tight mt-0.5">Avatar</span>
          </button>

          {/* 5. Student Profile */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'profile'
                ? 'bg-slate-100 text-slate-900 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-slate-900' : ''}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5">Profile</span>
          </button>

          {/* 6. Teacher / School Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab('teacher')}
            className={`min-h-[48px] flex flex-col items-center justify-center rounded-2xl transition-all select-none ${
              activeTab === 'teacher'
                ? 'bg-purple-50 text-purple-700 font-extrabold shadow-inner'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Rural School Teacher Analytics"
          >
            <LineChart className={`w-5 h-5 ${activeTab === 'teacher' ? 'text-purple-600' : ''}`} />
            <span className="text-[10px] font-black tracking-tight mt-0.5">School</span>
          </button>
        </div>
      </nav>

      {/* Micro-Lesson Interactive Exercise Modal */}
      {activeLesson && (
        <MicroLessonModal
          lesson={activeLesson}
          hearts={currentStudent.hearts}
          onClose={() => setActiveLesson(null)}
          onFinishLesson={handleFinishLesson}
        />
      )}

      {/* Post-Lesson Celebration Modal */}
      {celebrationData && (
        <CelebrationModal
          lessonTitle={celebrationData.lessonTitle}
          stats={celebrationData.stats}
          streakDays={currentStudent.streakDays}
          onContinue={() => setCelebrationData(null)}
          onReview={() => setCelebrationData(null)}
        />
      )}

      {/* Offline Sync & P2P Mesh Connectivity Modal */}
      {isSyncModalOpen && (
        <OfflineSyncModal
          studentId={currentStudent.id}
          studentName={currentStudent.name}
          onClose={() => setIsSyncModalOpen(false)}
          onSyncComplete={() => {
            setIsOnline(true);
          }}
        />
      )}
    </div>
  );
}

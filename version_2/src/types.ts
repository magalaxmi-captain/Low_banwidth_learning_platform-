export type ScreenType = 'quest' | 'quiz' | 'profile' | 'challenges';

export interface QuestNode {
  id: number;
  title: string;
  topic: string;
  level: number;
  status: 'completed' | 'active' | 'locked';
  stars?: number; // 1 to 3
  xpReward: number;
  gemsReward: number;
  iconType: 'math' | 'geometry' | 'fractions' | 'pattern' | 'boss';
  description: string;
  xOffset: number; // percentage from left to create the winding snake path (e.g. 50, 25, 75, etc.)
}

export interface QuizOption {
  id: string;
  label: string;
  iconName: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  audioText: string;
  category: string;
  visualType: 'fractions' | 'mango_multiplication' | 'geometry_shapes' | 'counting_grid';
  options: QuizOption[];
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'mastery' | 'offline' | 'speed';
  unlocked: boolean;
  unlockedAt?: string;
  icon: string;
  progressText?: string;
}

export interface PeerStudent {
  id: string;
  name: string;
  avatarSeed: string;
  distance: string;
  connectionType: 'Bluetooth Mesh' | 'Wi-Fi Direct' | 'Local School Hub';
  score: number;
  isReady: boolean;
  isFriend?: boolean;
  grade?: string;
}

export interface AvailableChallenge {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionsCount: number;
  timeSeconds: number;
  xpReward: number;
  gemsReward: number;
  icon: string;
  questions: QuizQuestion[];
}

export interface ChallengeResultRecord {
  id: string;
  challengeTitle: string;
  category: string;
  opponent: {
    name: string;
    avatar: string;
    school: string;
  };
  status: 'incoming' | 'waiting_opponent' | 'completed';
  myScore?: number;
  opponentScore?: number;
  myTimeSeconds?: number;
  opponentTimeSeconds?: number;
  result?: 'victory' | 'defeat' | 'tie';
  xpEarned?: number;
  gemsEarned?: number;
  packetId: string;
  lastUpdated: string;
  questions: QuizQuestion[];
  myAnswers?: { [questionId: number]: string };
  opponentAnswers?: { [questionId: number]: string };
}

export interface UserProfile {
  name: string;
  school: string;
  grade: string;
  avatar: string;
  level: number;
  levelTitle: string;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  gems: number;
  offlineLessonsPending: number;
  lastSyncedAgo: string;
  dataUsedMb: number;
}

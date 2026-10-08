export interface AvatarConfig {
  skinTone: string;
  hairStyle: 'short_crops' | 'twin_braids' | 'curly_afro' | 'side_part' | 'top_knot' | 'flowing_waves';
  hairColor: string;
  clothing: 'school_uniform_blue' | 'school_uniform_maroon' | 'kurta_saffron' | 'kurta_emerald' | 'scholar_vest';
  clothingColor?: string;
  expression: 'happy_smile' | 'curious_wink' | 'star_eyes' | 'focused_smile';
  accessory: 'none' | 'glasses_round' | 'flower_jasmine' | 'scholar_cap' | 'school_satchel';
  backgroundTheme: 'emerald_meadow' | 'amber_sunrise' | 'twilight_sky' | 'indigo_district';
}

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  village: string;
  school: string;
  gradeLevel: number;
  avatar: string;
  avatarConfig?: AvatarConfig;
  streakDays: number;
  totalXp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  lastActiveAt: string;
  currentSubject: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  checkInTime: string;
  durationMinutes: number;
  synced: boolean;
  deviceId: string;
  networkMode: 'offline' | '2g_edge' | 'mesh_p2p' | 'broadband';
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  nodeId: string;
  nodeTitle: string;
  scorePercent: number;
  accuracyRate: number;
  xpEarned: number;
  mistakesCount: number;
  durationSeconds: number;
  completedAt: string;
  offlineSynced: boolean;
}

export type ExerciseType = 'tap_to_pair' | 'fill_in_blank' | 'multiple_choice';

export interface PairItem {
  id: string;
  left: string;
  right: string;
  leftVisual?: string; // SVG icon identifier or math fraction
  rightVisual?: string;
}

export interface FillBlankItem {
  sentencePrefix: string;
  sentenceSuffix: string;
  correctWord: string;
  options: string[];
}

export interface ChoiceItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  pairData?: {
    pairs: PairItem[];
  };
  fillBlankData?: FillBlankItem;
  choiceData?: ChoiceItem;
}

export interface LessonNode {
  id: string;
  unitId: string;
  unitTitle: string;
  subjectId: 'math' | 'science' | 'literacy';
  index: number;
  title: string;
  subtitle: string;
  nodeType: 'standard' | 'milestone' | 'checkpoint_boss';
  status: 'locked' | 'active' | 'completed';
  starsEarned: number; // 0 to 3
  bestScore?: number;
  xpReward: number;
  exercises: Exercise[];
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardGems: number;
  progress: number;
  total: number;
  isClaimed: boolean;
  category: 'daily' | 'weekly' | 'streak';
}

export interface SyncStats {
  storedOfflineMb: number;
  cachedLessonsCount: number;
  pendingSyncRecords: number;
  lastSyncTimestamp: string;
  meshPeersAvailable: number;
}

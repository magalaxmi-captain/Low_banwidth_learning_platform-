import { LessonNode, DailyQuest } from '../types.ts';

export interface SubjectMeta {
  id: 'math' | 'science' | 'literacy';
  name: string;
  levelTitle: string;
  iconName: string;
  themeColor: string;
  accentColor: string;
  unitTitle: string;
}

export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'math',
    name: 'Mathematics',
    levelTitle: 'Math: Level 3 (Grades 3-4)',
    iconName: 'Calculator',
    themeColor: '#10B981', // Emerald
    accentColor: '#059669',
    unitTitle: 'Unit 1: Fractions & Rural Geometry',
  },
  {
    id: 'science',
    name: 'Natural Sciences',
    levelTitle: 'Science: Level 2 (Grades 4-5)',
    iconName: 'Sprout',
    themeColor: '#06B6D4', // Sky Cyan
    accentColor: '#0891B2',
    unitTitle: 'Unit 1: Water Cycles & Local Ecology',
  },
  {
    id: 'literacy',
    name: 'Language & Literacy',
    levelTitle: 'Literacy: Grade 3',
    iconName: 'BookOpen',
    themeColor: '#6366F1', // Electric Indigo
    accentColor: '#4F46E5',
    unitTitle: 'Unit 1: Word Construction & Comprehension',
  },
];

export const MATH_LESSON_NODES: LessonNode[] = [
  {
    id: 'm_fractions_intro',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 0,
    title: 'Halves & Quarters',
    subtitle: 'Learn to split bread and circles into equal parts',
    nodeType: 'standard',
    status: 'completed',
    starsEarned: 3,
    bestScore: 100,
    xpReward: 25,
    exercises: [
      {
        id: 'ex_m01_pair',
        type: 'tap_to_pair',
        instruction: 'Tap a fraction on the left to pair with its visual meaning on the right:',
        pairData: {
          pairs: [
            { id: 'p1', left: '1/2', right: 'Two equal halves of a Roti', leftVisual: '½', rightVisual: '🌓' },
            { id: 'p2', left: '1/4', right: 'One of four equal field plots', leftVisual: '¼', rightVisual: '◰' },
            { id: 'p3', left: '3/4', right: 'Three quarters of a water pot', leftVisual: '¾', rightVisual: '◕' },
            { id: 'p4', left: '4/4', right: 'One complete whole unit', leftVisual: '4/4', rightVisual: '⬤' },
          ],
        },
      },
      {
        id: 'ex_m01_fill',
        type: 'fill_in_blank',
        instruction: 'Tap word tiles to fill in the blank:',
        fillBlankData: {
          sentencePrefix: 'When two children divide an apple equally, each child receives exactly one',
          sentenceSuffix: 'of the apple.',
          correctWord: 'half',
          options: ['quarter', 'half', 'double', 'third'],
        },
      },
    ],
  },
  {
    id: 'm_fractions_market',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 1,
    title: 'Market Fractions',
    subtitle: 'Measuring kilograms of lentils and grains in local haats',
    nodeType: 'standard',
    status: 'completed',
    starsEarned: 2,
    bestScore: 92,
    xpReward: 25,
    exercises: [
      {
        id: 'ex_m02_pair',
        type: 'tap_to_pair',
        instruction: 'Pair the market measurement to its decimal equivalent:',
        pairData: {
          pairs: [
            { id: 'p21', left: '1/2 kg', right: '500 grams of seeds', leftVisual: '½ kg', rightVisual: '⚖️' },
            { id: 'p22', left: '1/4 kg', right: '250 grams of turmeric', leftVisual: '¼ kg', rightVisual: '🌿' },
            { id: 'p23', left: '3/4 kg', right: '750 grams of rice', leftVisual: '¾ kg', rightVisual: '🌾' },
          ],
        },
      },
    ],
  },
  {
    id: 'm_fractions_compare',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 2,
    title: 'Comparing Fractions',
    subtitle: 'Which plot gets more irrigation water?',
    nodeType: 'standard',
    status: 'active', // Active starting node!
    starsEarned: 0,
    xpReward: 30,
    exercises: [
      {
        id: 'ex_m03_pair',
        type: 'tap_to_pair',
        instruction: 'Tap to pair each fraction comparison with its mathematical fact:',
        pairData: {
          pairs: [
            { id: 'p31', left: '1/2 vs 1/4', right: '1/2 is GREATER than 1/4', leftVisual: '½ > ¼', rightVisual: '🟢' },
            { id: 'p32', left: '2/4 vs 1/2', right: 'They are EXACTLY EQUAL', leftVisual: '2/4 = ½', rightVisual: '⚖️' },
            { id: 'p33', left: '3/4 vs 1/2', right: '3/4 is GREATER than 1/2', leftVisual: '¾ > ½', rightVisual: '📈' },
            { id: 'p34', left: '1/8 vs 1/4', right: '1/8 is SMALLER than 1/4', leftVisual: '⅛ < ¼', rightVisual: '🔹' },
          ],
        },
      },
      {
        id: 'ex_m03_fill',
        type: 'fill_in_blank',
        instruction: 'Tap the correct word tile to complete the fraction rule:',
        fillBlankData: {
          sentencePrefix: 'As the denominator grows larger with the same numerator 1, each slice becomes',
          sentenceSuffix: 'in size.',
          correctWord: 'smaller',
          options: ['larger', 'smaller', 'infinite', 'identical'],
        },
      },
      {
        id: 'ex_m03_choice',
        type: 'multiple_choice',
        instruction: 'Select the best real-world answer:',
        choiceData: {
          question: 'Farmer Ramesh has 4 equal farming strips. He waters 3 strips with solar pump. What fraction of his land is watered?',
          options: ['1/4 of land', '2/4 of land', '3/4 of land', '4/3 of land'],
          correctIndex: 2,
          explanation: '3 out of 4 equal parts is expressed as 3/4 (three-quarters).',
        },
      },
    ],
  },
  {
    id: 'm_fractions_addition',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 3,
    title: 'Adding Like Fractions',
    subtitle: 'Combine equal portions like 1/5 + 2/5',
    nodeType: 'standard',
    status: 'locked',
    starsEarned: 0,
    xpReward: 25,
    exercises: [],
  },
  {
    id: 'm_geometry_shapes',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 4,
    title: 'Shapes in Village Architecture',
    subtitle: 'Triangles in roof trusses and bricks',
    nodeType: 'milestone',
    status: 'locked',
    starsEarned: 0,
    xpReward: 35,
    exercises: [],
  },
  {
    id: 'm_unit_boss_mastery',
    unitId: 'u1_math',
    unitTitle: 'Unit 1: Visual Fractions & Equal Parts',
    subjectId: 'math',
    index: 5,
    title: 'Unit 1 Mastery Challenge',
    subtitle: 'Village Haat Math Boss Battle: Earn Golden Trophy & 50 XP',
    nodeType: 'checkpoint_boss',
    status: 'locked',
    starsEarned: 0,
    xpReward: 60,
    exercises: [],
  },
];

export const SCIENCE_LESSON_NODES: LessonNode[] = [
  {
    id: 's_water_cycle',
    unitId: 'u1_sci',
    unitTitle: 'Unit 1: Water Cycles & Local Ecology',
    subjectId: 'science',
    index: 0,
    title: 'Rain & Groundwater',
    subtitle: 'How monsoon clouds form and replenish village wells',
    nodeType: 'standard',
    status: 'completed',
    starsEarned: 3,
    bestScore: 96,
    xpReward: 25,
    exercises: [
      {
        id: 'ex_s01_pair',
        type: 'tap_to_pair',
        instruction: 'Match the water cycle stage to what happens in nature:',
        pairData: {
          pairs: [
            { id: 'sp1', left: 'Evaporation', right: 'Sun heats water into invisible vapor', leftVisual: '☀️💧', rightVisual: '☁️' },
            { id: 'sp2', left: 'Condensation', right: 'Vapor cools down into clouds', leftVisual: '❄️🌫️', rightVisual: '🌧️' },
            { id: 'sp3', left: 'Precipitation', right: 'Rain drops fall over fields and hills', leftVisual: '🌧️🌱', rightVisual: '💧' },
            { id: 'sp4', left: 'Infiltration', right: 'Rain water soaks deep into soil', leftVisual: '🌍💧', rightVisual: '🚰' },
          ],
        },
      },
    ],
  },
  {
    id: 's_plant_parts',
    unitId: 'u1_sci',
    unitTitle: 'Unit 1: Water Cycles & Local Ecology',
    subjectId: 'science',
    index: 1,
    title: 'Leaves & Sunlight',
    subtitle: 'Photosynthesis in neem, banyan, and crop leaves',
    nodeType: 'standard',
    status: 'active',
    starsEarned: 0,
    xpReward: 30,
    exercises: [
      {
        id: 'ex_s02_fill',
        type: 'fill_in_blank',
        instruction: 'Complete the biological fact by tapping the word tile:',
        fillBlankData: {
          sentencePrefix: 'Green leaves absorb sunlight and carbon dioxide to produce oxygen and',
          sentenceSuffix: 'for plant growth.',
          correctWord: 'glucose',
          options: ['sand', 'glucose', 'plastic', 'salt'],
        },
      },
      {
        id: 'ex_s02_pair',
        type: 'tap_to_pair',
        instruction: 'Match the plant part to its essential job:',
        pairData: {
          pairs: [
            { id: 'sp21', left: 'Roots', right: 'Anchors plant and drinks water from soil', leftVisual: '🌱', rightVisual: '💧' },
            { id: 'sp22', left: 'Stem', right: 'Carries water like a pipeline to leaves', leftVisual: '🌿', rightVisual: '🚚' },
            { id: 'sp23', left: 'Flower', right: 'Helps in pollination and making seeds', leftVisual: '🌸', rightVisual: '🐝' },
          ],
        },
      },
    ],
  },
  {
    id: 's_soil_fertility',
    unitId: 'u1_sci',
    unitTitle: 'Unit 1: Water Cycles & Local Ecology',
    subjectId: 'science',
    index: 2,
    title: 'Soil & Earthworms',
    subtitle: 'Nature’s silent soil farmers',
    nodeType: 'standard',
    status: 'locked',
    starsEarned: 0,
    xpReward: 25,
    exercises: [],
  },
  {
    id: 's_boss_nature',
    unitId: 'u1_sci',
    unitTitle: 'Unit 1: Water Cycles & Local Ecology',
    subjectId: 'science',
    index: 3,
    title: 'Ecology Boss Challenge',
    subtitle: 'Test your understanding of village ecosystems',
    nodeType: 'checkpoint_boss',
    status: 'locked',
    starsEarned: 0,
    xpReward: 60,
    exercises: [],
  },
];

export const LITERACY_LESSON_NODES: LessonNode[] = [
  {
    id: 'lit_prefixes',
    unitId: 'u1_lit',
    unitTitle: 'Unit 1: Word Construction & Comprehension',
    subjectId: 'literacy',
    index: 0,
    title: 'Prefixes & Opposites',
    subtitle: 'Un-, Dis-, and Im- to transform word meanings',
    nodeType: 'standard',
    status: 'active',
    starsEarned: 0,
    xpReward: 25,
    exercises: [
      {
        id: 'ex_lit01_pair',
        type: 'tap_to_pair',
        instruction: 'Pair each root word with its opposite prefix:',
        pairData: {
          pairs: [
            { id: 'lp1', left: 'Happy', right: 'Unhappy (sad)', leftVisual: '😊', rightVisual: '😢' },
            { id: 'lp2', left: 'Agree', right: 'Disagree (differ)', leftVisual: '🤝', rightVisual: '🙅' },
            { id: 'lp3', left: 'Possible', right: 'Impossible (cannot be done)', leftVisual: '✨', rightVisual: '🚫' },
            { id: 'lp4', left: 'Lock', right: 'Unlock (open)', leftVisual: '🔒', rightVisual: '🔓' },
          ],
        },
      },
    ],
  },
  {
    id: 'lit_synonyms',
    unitId: 'u1_lit',
    unitTitle: 'Unit 1: Word Construction & Comprehension',
    subjectId: 'literacy',
    index: 1,
    title: 'Vivid Adjectives',
    subtitle: 'Describing landscapes, animals, and weather',
    nodeType: 'standard',
    status: 'locked',
    starsEarned: 0,
    xpReward: 25,
    exercises: [],
  },
];

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'q1',
    title: 'STEM Pathfinder',
    description: 'Complete 2 micro-lessons in Math or Science',
    rewardXp: 40,
    rewardGems: 15,
    progress: 1,
    total: 2,
    isClaimed: false,
    category: 'daily',
  },
  {
    id: 'q2',
    title: 'Sharp Mind (90%+ Accuracy)',
    description: 'Score 90% or higher on your next quiz',
    rewardXp: 30,
    rewardGems: 10,
    progress: 1,
    total: 1,
    isClaimed: true,
    category: 'daily',
  },
  {
    id: 'q3',
    title: 'Offline Sync Master',
    description: 'Sync your local lessons to peer device or school hub',
    rewardXp: 20,
    rewardGems: 25,
    progress: 0,
    total: 1,
    isClaimed: false,
    category: 'daily',
  },
  {
    id: 'q4',
    title: '14-Day Streak Champion',
    description: 'Log in and learn for 14 consecutive school days',
    rewardXp: 100,
    rewardGems: 50,
    progress: 12,
    total: 14,
    isClaimed: false,
    category: 'streak',
  },
];

export const LEADERBOARD_STUDENTS = [
  { rank: 1, name: 'Vikram Singh', village: 'Pipariya', xp: 540, streak: 15, badge: '🥇', avatar: '🐘' },
  { rank: 2, name: 'Priya Sharma (You)', village: 'Sundarpur', xp: 450, streak: 12, badge: '🥈', avatar: '🦉', isCurrent: true },
  { rank: 3, name: 'Aarav Patel', village: 'Rampur', xp: 410, streak: 10, badge: '🥉', avatar: '🐅' },
  { rank: 4, name: 'Meera Das', village: 'Sundarpur', xp: 380, streak: 8, badge: '⭐', avatar: '🐦' },
  { rank: 5, name: 'Ananya Rao', village: 'Pipariya', xp: 290, streak: 6, badge: '⭐', avatar: '🦌' },
  { rank: 6, name: 'Rohan Verma', village: 'Rampur', xp: 260, streak: 5, badge: '⭐', avatar: '🐒' },
  { rank: 7, name: 'Kavita Joshi', village: 'Sundarpur', xp: 210, streak: 4, badge: '⭐', avatar: '🦊' },
];

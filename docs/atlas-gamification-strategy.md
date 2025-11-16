# ATLAS Gamification Strategy

## Philosophy: **Unified System with Context-Aware Rewards**

### Core Principle
**One XP pool, one level, context-aware achievements** - User progresses as a whole person, not fragmented between work and life.

### Why Unified?

1. **Holistic Progress**: User sees themselves improving across all areas of life
2. **Simplified Mental Model**: One level to track, not "Work Level 5" + "Personal Level 8"
3. **Cross-Pollination**: Work success motivates personal growth and vice versa
4. **Realistic**: Real life doesn't have separate "XP bars" for work vs personal

### How Context is Preserved

While XP is unified, we track:
- **XP Sources**: Work XP vs Personal XP (for insights)
- **Context Tags**: Achievements marked as "Work", "Personal", or "Life Balance"
- **Separate Streaks**: Testing streak vs Gym streak (both contribute to overall progress)

---

## 1. XP System Design

### XP Sources & Values

```typescript
const XP_VALUES = {
  // Work (ATLAS Testing)
  TESTING_SESSION_BASE: 50,
  BUG_FOUND: 25,
  BUG_FOUND_CRITICAL: 50,
  TICKET_COMPLETED: 30,
  CLEAN_TESTING_SESSION: 40, // No bugs found (quality work)
  TESTING_STREAK_BONUS: 10, // Per day of streak

  // Personal Tasks
  TASK_COMPLETED: 20,
  TASK_COMPLETED_HIGH_PRIORITY: 35,
  PERSONAL_PROJECT_MILESTONE: 100,

  // Habits
  HABIT_COMPLETED: 15,
  HABIT_STREAK_MILESTONE: 50, // Every 7 days
  HABIT_WEEKLY_TARGET: 40, // Met weekly frequency

  // Life Balance (Unified Activities)
  BALANCED_DAY: 60, // Completed both work + personal tasks
  MOOD_LOGGED: 5,
  JOURNAL_ENTRY: 10,
  SELF_CARE_TASK: 25,

  // Daily Challenges
  CHALLENGE_EASY: 50,
  CHALLENGE_MEDIUM: 100,
  CHALLENGE_HARD: 150,
  CHALLENGE_STREAK_BONUS: 25, // Per day of consecutive challenges

  // Learning & Improvement
  PATTERN_LEARNED: 30, // AI learned new testing pattern
  ROOT_CAUSE_INVESTIGATION: 75, // Addressed repetitive bug
  WORKFLOW_OPTIMIZATION: 50, // Improved testing process

  // Social/Sharing (Future)
  SHARED_ACHIEVEMENT: 10,
  HELPED_TEAMMATE: 40
};

// XP calculation example
function calculateTestingSessionXP(session: TestingSession): number {
  let xp = XP_VALUES.TESTING_SESSION_BASE;

  // Bug bonuses
  xp += session.bugs_found * XP_VALUES.BUG_FOUND;
  xp += session.critical_bugs_found * XP_VALUES.BUG_FOUND_CRITICAL;

  // Streak bonus
  if (session.current_streak >= 7) {
    xp += XP_VALUES.TESTING_STREAK_BONUS * Math.floor(session.current_streak / 7);
  }

  // Quality bonus (thorough testing, no bugs = quality work)
  if (session.bugs_found === 0 && session.scenarios.length >= 5) {
    xp += XP_VALUES.CLEAN_TESTING_SESSION;
  }

  // First session of day bonus
  if (session.is_first_session_today) {
    xp += 20;
  }

  return xp;
}

function calculateBalancedDayBonus(userId: string, date: Date): number {
  const workTasksCompleted = countWorkTasks(userId, date);
  const personalTasksCompleted = countPersonalTasks(userId, date);

  // Minimum 1 work + 2 personal (or vice versa)
  if (workTasksCompleted >= 1 && personalTasksCompleted >= 2) {
    return XP_VALUES.BALANCED_DAY;
  }

  return 0;
}
```

### Leveling Curve

```typescript
// Formula: XP required = 100 * level^2
function getXPForLevel(level: number): number {
  return 100 * Math.pow(level, 2);
}

function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// Example progression:
const LEVEL_PROGRESSION = {
  1: { xp_required: 100, total_xp: 0 },
  2: { xp_required: 400, total_xp: 100 },
  3: { xp_required: 900, total_xp: 500 },
  5: { xp_required: 2500, total_xp: 3000 },
  10: { xp_required: 10000, total_xp: 28500 },
  20: { xp_required: 40000, total_xp: 258000 },
  50: { xp_required: 250000, total_xp: 4117500 }
};

// Roughly:
// - Level 5: ~1 week of active use
// - Level 10: ~1 month
// - Level 20: ~6 months
// - Level 50: ~2 years (endgame grind)
```

### XP Breakdown UI

```
┌───────────────────────────────────────┐
│  📊 XP BREAKDOWN (This Week)          │
├───────────────────────────────────────┤
│                                       │
│  Total XP Earned: +630                │
│                                       │
│  💼 Work: 420 XP (67%)                │
│  ├─ 8 testing sessions: 400 XP        │
│  ├─ 3 bugs found: 75 XP               │
│  └─ 7-day streak bonus: 45 XP         │
│                                       │
│  ✅ Personal: 150 XP (24%)            │
│  ├─ 15 tasks completed: 300 XP        │
│  ├─ 5 journal entries: 50 XP          │
│  └─ 3-day gym streak: 50 XP           │
│                                       │
│  🎯 Challenges: 60 XP (9%)            │
│  └─ 2 daily challenges: 200 XP        │
│                                       │
│  💡 INSIGHT: You earn 2.8x more XP    │
│     from work than personal tasks.    │
│     Balance your week for bonus XP!   │
└───────────────────────────────────────┘
```

---

## 2. Achievement System

### Achievement Categories

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'testing' | 'productivity' | 'consistency' | 'life_balance' | 'mastery';
  context: 'work' | 'personal' | 'unified'; // For display purposes

  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  criteria: AchievementCriteria;
  xp_reward: number;
  badge_icon: string;

  unlocked_at?: Date;
  progress?: number; // 0-100 for multi-step achievements
}

type AchievementCriteria =
  | { type: 'count', metric: string, threshold: number }
  | { type: 'streak', days: number, activity: string }
  | { type: 'milestone', event: string }
  | { type: 'composite', conditions: AchievementCriteria[] };
```

### Core Achievements

#### Testing Category (Work Context)

```typescript
const TESTING_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-test',
    name: 'First Test',
    description: 'Complete your first testing session',
    category: 'testing',
    context: 'work',
    rarity: 'common',
    criteria: { type: 'count', metric: 'testing_sessions', threshold: 1 },
    xp_reward: 50,
    badge_icon: '🧪'
  },
  {
    id: 'bug-hunter-i',
    name: 'Bug Hunter I',
    description: 'Find 10 bugs',
    category: 'testing',
    context: 'work',
    rarity: 'common',
    criteria: { type: 'count', metric: 'bugs_found', threshold: 10 },
    xp_reward: 100,
    badge_icon: '🐛'
  },
  {
    id: 'bug-hunter-ii',
    name: 'Bug Hunter II',
    description: 'Find 50 bugs',
    category: 'testing',
    context: 'work',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'bugs_found', threshold: 50 },
    xp_reward: 250,
    badge_icon: '🐝'
  },
  {
    id: 'bug-hunter-iii',
    name: 'Bug Hunter III',
    description: 'Find 200 bugs',
    category: 'testing',
    context: 'work',
    rarity: 'epic',
    criteria: { type: 'count', metric: 'bugs_found', threshold: 200 },
    xp_reward: 500,
    badge_icon: '🦟'
  },
  {
    id: 'speed-tester',
    name: 'Speed Tester',
    description: 'Complete 3 testing sessions in one day',
    category: 'testing',
    context: 'work',
    rarity: 'rare',
    criteria: {
      type: 'composite',
      conditions: [
        { type: 'count', metric: 'sessions_today', threshold: 3 },
        { type: 'milestone', event: 'day_end' }
      ]
    },
    xp_reward: 150,
    badge_icon: '⚡'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Test for 7 consecutive days',
    category: 'testing',
    context: 'work',
    rarity: 'rare',
    criteria: { type: 'streak', days: 7, activity: 'testing' },
    xp_reward: 200,
    badge_icon: '🔥'
  },
  {
    id: 'testing-marathon',
    name: 'Testing Marathon',
    description: 'Test for 30 consecutive days',
    category: 'testing',
    context: 'work',
    rarity: 'epic',
    criteria: { type: 'streak', days: 30, activity: 'testing' },
    xp_reward: 750,
    badge_icon: '🏃'
  },
  {
    id: 'perfect-session',
    name: 'Perfect Session',
    description: 'Complete a testing session with no bugs found',
    category: 'testing',
    context: 'work',
    rarity: 'common',
    criteria: { type: 'milestone', event: 'clean_testing_session' },
    xp_reward: 75,
    badge_icon: '✨'
  },
  {
    id: 'thorough-tester',
    name: 'Thorough Tester',
    description: 'Spend 2+ hours on a single testing session',
    category: 'testing',
    context: 'work',
    rarity: 'rare',
    criteria: { type: 'milestone', event: 'long_session_2h' },
    xp_reward: 180,
    badge_icon: '🔍'
  },
  {
    id: 'pattern-master',
    name: 'Pattern Master',
    description: 'AI learned 20 effective testing patterns from your sessions',
    category: 'mastery',
    context: 'work',
    rarity: 'epic',
    criteria: { type: 'count', metric: 'patterns_learned', threshold: 20 },
    xp_reward: 400,
    badge_icon: '🧠'
  }
];
```

#### Productivity Category (Personal + Work)

```typescript
const PRODUCTIVITY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'task-master-i',
    name: 'Task Master I',
    description: 'Complete 50 tasks',
    category: 'productivity',
    context: 'unified',
    rarity: 'common',
    criteria: { type: 'count', metric: 'tasks_completed', threshold: 50 },
    xp_reward: 100,
    badge_icon: '✅'
  },
  {
    id: 'task-master-ii',
    name: 'Task Master II',
    description: 'Complete 200 tasks',
    category: 'productivity',
    context: 'unified',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'tasks_completed', threshold: 200 },
    xp_reward: 300,
    badge_icon: '📋'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 5 tasks before 9 AM in one week',
    category: 'productivity',
    context: 'unified',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'early_tasks_this_week', threshold: 5 },
    xp_reward: 150,
    badge_icon: '🌅'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 5 tasks after 8 PM in one week',
    category: 'productivity',
    context: 'unified',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'late_tasks_this_week', threshold: 5 },
    xp_reward: 150,
    badge_icon: '🦉'
  }
];
```

#### Life Balance Category (Unified Context)

```typescript
const LIFE_BALANCE_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'balanced-day',
    name: 'Balanced Day',
    description: 'Complete work tasks AND personal tasks in the same day',
    category: 'life_balance',
    context: 'unified',
    rarity: 'common',
    criteria: { type: 'milestone', event: 'balanced_day' },
    xp_reward: 80,
    badge_icon: '⚖️'
  },
  {
    id: 'balanced-week',
    name: 'Balanced Week',
    description: 'Achieve balanced days 5 out of 7 days',
    category: 'life_balance',
    context: 'unified',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'balanced_days_this_week', threshold: 5 },
    xp_reward: 250,
    badge_icon: '🌈'
  },
  {
    id: 'self-care-champion',
    name: 'Self-Care Champion',
    description: 'Complete 10 self-care tasks',
    category: 'life_balance',
    context: 'personal',
    rarity: 'rare',
    criteria: { type: 'count', metric: 'self_care_tasks', threshold: 10 },
    xp_reward: 200,
    badge_icon: '💙'
  },
  {
    id: 'stress-manager',
    name: 'Stress Manager',
    description: 'Log mood and take break after 3 consecutive work sessions',
    category: 'life_balance',
    context: 'unified',
    rarity: 'epic',
    criteria: {
      type: 'composite',
      conditions: [
        { type: 'milestone', event: 'stress_detected' },
        { type: 'milestone', event: 'break_taken' }
      ]
    },
    xp_reward: 300,
    badge_icon: '🧘'
  }
];
```

#### Consistency Category (Streaks)

```typescript
const CONSISTENCY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'habit-hero-7',
    name: 'Habit Hero',
    description: 'Maintain any habit streak for 7 days',
    category: 'consistency',
    context: 'unified',
    rarity: 'common',
    criteria: { type: 'streak', days: 7, activity: 'any_habit' },
    xp_reward: 150,
    badge_icon: '🔥'
  },
  {
    id: 'habit-legend-30',
    name: 'Habit Legend',
    description: 'Maintain any habit streak for 30 days',
    category: 'consistency',
    context: 'unified',
    rarity: 'epic',
    criteria: { type: 'streak', days: 30, activity: 'any_habit' },
    xp_reward: 500,
    badge_icon: '🏆'
  },
  {
    id: 'challenge-streak-7',
    name: 'Challenge Crusher',
    description: 'Complete daily challenges for 7 consecutive days',
    category: 'consistency',
    context: 'unified',
    rarity: 'rare',
    criteria: { type: 'streak', days: 7, activity: 'daily_challenge' },
    xp_reward: 250,
    badge_icon: '💪'
  }
];
```

#### Mastery Category (Advanced)

```typescript
const MASTERY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'root-cause-detective',
    name: 'Root Cause Detective',
    description: 'Investigate and document root cause of a repetitive bug',
    category: 'mastery',
    context: 'work',
    rarity: 'epic',
    criteria: { type: 'milestone', event: 'root_cause_investigation' },
    xp_reward: 400,
    badge_icon: '🔬'
  },
  {
    id: 'workflow-optimizer',
    name: 'Workflow Optimizer',
    description: 'Optimize your testing process based on AI insights',
    category: 'mastery',
    context: 'work',
    rarity: 'rare',
    criteria: { type: 'milestone', event: 'workflow_optimization' },
    xp_reward: 300,
    badge_icon: '⚙️'
  },
  {
    id: 'level-10',
    name: 'Rising Star',
    description: 'Reach Level 10',
    category: 'mastery',
    context: 'unified',
    rarity: 'common',
    criteria: { type: 'milestone', event: 'level_10' },
    xp_reward: 500,
    badge_icon: '⭐'
  },
  {
    id: 'level-50',
    name: 'Legendary Achiever',
    description: 'Reach Level 50',
    category: 'mastery',
    context: 'unified',
    rarity: 'legendary',
    criteria: { type: 'milestone', event: 'level_50' },
    xp_reward: 5000,
    badge_icon: '👑'
  }
];
```

### Achievement Notification UI

```
┌────────────────────────────────────────┐
│  🎉 ACHIEVEMENT UNLOCKED!              │
├────────────────────────────────────────┤
│                                        │
│         🐝 BUG HUNTER II               │
│                                        │
│     You found 50 bugs!                 │
│                                        │
│     +250 XP                            │
│     Rarity: 💎 Rare                    │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│  🏆 ACHIEVEMENT PROGRESS               │
│  Bug Hunter III: 50/200 bugs (25%)     │
│                                        │
│  [Share] [View All Achievements]       │
└────────────────────────────────────────┘
```

---

## 3. Streak System

### Streak Types

```typescript
interface Streak {
  id: string;
  user_id: string;
  habit_id: string;

  name: string; // "Testing", "Gym", "Journal"
  category: 'work' | 'personal' | 'health' | 'learning';

  current_streak: number;
  longest_streak: number;
  total_completions: number;

  last_completed: Date;

  // Streak bonuses
  milestone_rewards: {
    days: number; // 7, 14, 30, 60, 100
    xp: number;
    unlocked: boolean;
  }[];
}

// Streak milestones
const STREAK_MILESTONES = [
  { days: 7, xp: 100, badge: '🔥 Week Streak' },
  { days: 14, xp: 200, badge: '🔥🔥 Two Weeks' },
  { days: 30, xp: 500, badge: '🌟 Month Streak' },
  { days: 60, xp: 1000, badge: '💪 Two Months' },
  { days: 100, xp: 2000, badge: '👑 Centurion' },
  { days: 365, xp: 10000, badge: '🏆 Year Legend' }
];
```

### Separate Streaks with Unified Display

```
┌────────────────────────────────────────┐
│  🔥 YOUR STREAKS                       │
├────────────────────────────────────────┤
│                                        │
│  💼 WORK                               │
│  🧪 Testing      7 days  🔥            │
│                  Longest: 14 days      │
│                                        │
│  ✅ PERSONAL                           │
│  📚 Reading     12 days  🔥🔥          │
│                  Longest: 20 days      │
│  💪 Gym          3 days  🔥            │
│                  Longest: 10 days      │
│  📝 Journal      5 days  🔥            │
│                  Longest: 8 days       │
│                                        │
│  💡 Next Milestone: 14-day Testing     │
│     (7 more days → +200 XP)            │
└────────────────────────────────────────┘
```

### Streak Protection

```typescript
// Grace period: 1 missed day = streak freeze (1x per month)
interface StreakFreeze {
  user_id: string;
  habit_id: string;
  used_at: Date;
  cooldown_ends: Date; // 30 days after use
}

// User can "freeze" a streak if they miss a day
function freezeStreak(userId: string, habitId: string): Result {
  const lastFreeze = getLastFreeze(userId, habitId);

  if (lastFreeze && lastFreeze.cooldown_ends > new Date()) {
    return { error: 'Streak freeze on cooldown (30 days)' };
  }

  // Preserve streak for 1 day
  markStreakFrozen(userId, habitId);

  return {
    success: true,
    message: 'Streak frozen! You have 24 hours to complete this habit without losing your streak.'
  };
}
```

---

## 4. Daily Challenges

### Challenge Pool

```typescript
const DAILY_CHALLENGES = {
  // Work challenges
  work: [
    {
      id: 'testing-trio',
      name: 'Testing Trio',
      description: 'Complete 3 JIRA tickets',
      difficulty: 'medium',
      xp_reward: 100,
      requirements: { tickets_completed: 3 }
    },
    {
      id: 'bug-bounty',
      name: 'Bug Bounty',
      description: 'Find 5 bugs',
      difficulty: 'hard',
      xp_reward: 150,
      requirements: { bugs_found: 5 }
    },
    {
      id: 'speed-run',
      name: 'Speed Run',
      description: 'Complete a testing session in under 30 minutes',
      difficulty: 'medium',
      xp_reward: 120,
      requirements: { session_duration_max: 1800 }
    },
    {
      id: 'early-tester',
      name: 'Early Tester',
      description: 'Complete a testing session before 10 AM',
      difficulty: 'easy',
      xp_reward: 75,
      requirements: { session_before: '10:00' }
    }
  ],

  // Personal challenges
  personal: [
    {
      id: 'task-tornado',
      name: 'Task Tornado',
      description: 'Complete 5 personal tasks',
      difficulty: 'medium',
      xp_reward: 100,
      requirements: { tasks_completed: 5 }
    },
    {
      id: 'self-care-sunday',
      name: 'Self-Care Sunday',
      description: 'Complete 2 self-care tasks',
      difficulty: 'easy',
      xp_reward: 80,
      requirements: { self_care_tasks: 2 }
    },
    {
      id: 'journaling-master',
      name: 'Journaling Master',
      description: 'Write a journal entry with at least 200 words',
      difficulty: 'medium',
      xp_reward: 90,
      requirements: { journal_word_count: 200 }
    }
  ],

  // Unified challenges
  unified: [
    {
      id: 'balanced-day',
      name: 'Balanced Day',
      description: 'Complete 2 work tasks + 3 personal tasks',
      difficulty: 'medium',
      xp_reward: 120,
      requirements: { work_tasks: 2, personal_tasks: 3 }
    },
    {
      id: 'full-spectrum',
      name: 'Full Spectrum',
      description: 'Complete work task, personal task, habit, and mood log',
      difficulty: 'hard',
      xp_reward: 180,
      requirements: {
        work_tasks: 1,
        personal_tasks: 1,
        habits: 1,
        mood_logs: 1
      }
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Maintain all active streaks today',
      difficulty: 'hard',
      xp_reward: 200,
      requirements: { all_streaks_maintained: true }
    }
  ]
};

// Smart challenge assignment
function assignDailyChallenge(userId: string): Challenge {
  const userContext = getUserContext(userId);

  // Analyze user's current workload
  const jiraTicketsToday = userContext.jira_tickets_count;
  const personalTasksToday = userContext.personal_tasks_count;
  const dayOfWeek = new Date().getDay();

  // Weekday with JIRA tickets → Work challenge
  if (dayOfWeek >= 1 && dayOfWeek <= 5 && jiraTicketsToday >= 3) {
    return selectFromPool('work', userContext.skill_level);
  }

  // Weekend → Personal challenge
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return selectFromPool('personal', userContext.skill_level);
  }

  // Balanced workload → Unified challenge
  if (jiraTicketsToday >= 2 && personalTasksToday >= 2) {
    return selectFromPool('unified', userContext.skill_level);
  }

  // Default: Random weighted by difficulty
  return selectRandom(userContext.skill_level);
}
```

### Challenge UI

```
┌────────────────────────────────────────┐
│  🎯 TODAY'S CHALLENGE                  │
│                                        │
│  🧪 "Testing Trio"                     │
│  Complete 3 JIRA tickets               │
│                                        │
│  Progress: ██████░░░░ 2/3              │
│  Reward: +100 XP                       │
│  Difficulty: ⭐⭐ Medium                │
│                                        │
│  🔥 Challenge Streak: 3 days           │
│  (Complete today for +25 bonus XP!)    │
│                                        │
│  [View Eligible Tickets]               │
└────────────────────────────────────────┘
```

---

## 5. Leaderboards (Future: Social Features)

### Personal Leaderboards (Solo Dev Priority)

```
┌────────────────────────────────────────┐
│  📊 YOUR WEEKLY STATS vs BEST WEEK     │
├────────────────────────────────────────┤
│                                        │
│  This Week    vs    Best Week (Oct 2)  │
│                                        │
│  630 XP              890 XP            │
│  ██████████░░        ██████████████    │
│                                        │
│  8 tests             12 tests          │
│  3 bugs              8 bugs            │
│  15 tasks            22 tasks          │
│                                        │
│  💡 You're 71% of your best week!      │
│     Let's beat that record!            │
└────────────────────────────────────────┘
```

### Optional: Team Leaderboard (If Sharing with Colleagues)

```
┌────────────────────────────────────────┐
│  🏆 TEAM LEADERBOARD (This Week)       │
├────────────────────────────────────────┤
│                                        │
│  1. 🥇 Alex (You)        630 XP        │
│  2. 🥈 Jamie             580 XP        │
│  3. 🥉 Taylor            520 XP        │
│  4.    Jordan            490 XP        │
│  5.    Sam               410 XP        │
│                                        │
│  [Invite Teammate]                     │
└────────────────────────────────────────┘
```

---

## 6. Coach Personality System

### Personality Types

```typescript
type CoachPersonality = 'encouraging' | 'motivating' | 'casual' | 'professional';

const COACH_MESSAGES = {
  encouraging: {
    session_start: [
      "Let's find those bugs! You've got this! 💪",
      "Time to test! Remember, every bug you find makes the product better 🐛",
      "Testing time! I believe in you ✨"
    ],
    session_end_success: [
      "Amazing work! You found {bugs} bugs 🎉",
      "Great session! {bugs} bugs squashed 🐝",
      "You're making a real difference! Well done 💙"
    ],
    session_end_no_bugs: [
      "Clean test! Quality work pays off ✨",
      "No bugs found - that's thoroughness! 🌟"
    ],
    streak_milestone: [
      "🔥 {days}-day testing streak! You're unstoppable!",
      "Wow! {days} days in a row! I'm so proud 🎉"
    ],
    mood_frustrated: [
      "Tough session, huh? You're doing great despite the challenges 💙",
      "It's okay to feel frustrated. Take a break if you need! 🧘"
    ]
  },

  motivating: {
    session_start: [
      "Time to dominate this ticket! 💪",
      "Let's crush some bugs! Go get 'em! 🎯",
      "Another day, another victory. Let's do this! 🚀"
    ],
    session_end_success: [
      "BOOM! {bugs} bugs destroyed! 💥",
      "Exceptional work! You're a bug-hunting machine! 🔥"
    ],
    streak_milestone: [
      "🔥 {days} DAYS! You're building an empire of excellence!",
      "Unstoppable! {days}-day streak and climbing! 🚀"
    ]
  },

  casual: {
    session_start: [
      "Alright, let's see what bugs we can find 🐛",
      "Testing time! Let's get this done 👍"
    ],
    session_end_success: [
      "Nice! Found {bugs} bugs 👏",
      "Solid work today 🎉"
    ]
  },

  professional: {
    session_start: [
      "Beginning testing session for {ticket_key}.",
      "Test scenarios ready. Proceed when ready."
    ],
    session_end_success: [
      "Session completed. {bugs} issues identified.",
      "Testing concluded successfully. {bugs} defects logged."
    ]
  }
};

// Context-aware coach messages
function getCoachMessage(
  event: string,
  personality: CoachPersonality,
  context: any
): string {
  const messages = COACH_MESSAGES[personality][event];
  const template = messages[Math.floor(Math.random() * messages.length)];

  // Replace placeholders
  return template
    .replace('{bugs}', context.bugs_found)
    .replace('{days}', context.streak_days)
    .replace('{ticket_key}', context.ticket_key);
}
```

### Coach UI

```
┌────────────────────────────────────────┐
│  🤖 COACH                              │
├────────────────────────────────────────┤
│                                        │
│  💪 "Amazing work! You found 2 bugs!"  │
│                                        │
│  [Change Personality: Encouraging ▼]   │
└────────────────────────────────────────┘
```

---

## Summary: Why This Gamification Strategy Works

✅ **Unified XP**: Simplifies progress, treats user as whole person
✅ **Context Tags**: Preserves work/personal distinction for insights
✅ **Balanced Incentives**: Rewards both work productivity AND life balance
✅ **Smart Challenges**: Adapts to user's actual workload
✅ **Streak Protection**: Reduces guilt from missed days
✅ **Coach Personality**: Customizable motivation style
✅ **Achievements**: Mix of easy wins and long-term goals
✅ **Personal Leaderboards**: Solo dev priority (compare to self, not others)

**Result**: ATLAS feels integrated into daily life, not a separate grind. Work success and personal growth reinforce each other through shared progression system.

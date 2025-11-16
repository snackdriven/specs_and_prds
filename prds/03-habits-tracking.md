# PRD: Habits Tracking

## Overview

**Feature Name:** Habits Tracking
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Habits Tracking system empowers users to build and maintain positive routines through consistent tracking, streak motivation, and insightful analytics. It supports daily, weekly, and monthly habit frequencies with flexible target settings, enabling users to create sustainable behavioral change across health, productivity, and personal development domains.

## Problem Statement

Users struggle with:
- Building and maintaining consistent positive habits
- Losing motivation when streaks break
- Tracking multiple habits across different frequencies
- Understanding habit completion patterns over time
- Remembering to perform habits daily/weekly/monthly
- Balancing ambitious goals with realistic targets
- Recovering from missed habit days without giving up entirely

## Goals & Success Metrics

### Goals
1. Enable effortless daily habit logging (< 5 seconds per habit)
2. Motivate consistency through streak tracking and visual progress
3. Support flexible habit frequencies and targets
4. Provide insights into habit patterns and success rates
5. Reduce habit abandonment through encouraging design

### Success Metrics
- **Habit Completion Rate:** % of habit targets met per period
- **Active Streaks:** Average streak length per habit
- **Habit Retention:** % of created habits still active after 30 days
- **Daily Logging Rate:** % of users who log habits daily
- **Multi-Habit Users:** % of users tracking 3+ habits simultaneously
- **Recovery Rate:** % of broken streaks that are restarted within 7 days
- **Long-term Success:** % of habits maintained for 66+ days (habit formation threshold)

## User Personas

### Primary: The Health Optimizer
- **Demographics:** 25-45 years old, health-conscious professional
- **Needs:** Track exercise, meditation, water intake, sleep quality
- **Pain Points:** Inconsistent routines, motivation lapses, tracking friction
- **Usage Pattern:** Morning and evening check-ins, weekly reviews

### Secondary: The Skill Builder
- **Demographics:** 20-40 years old, lifelong learner
- **Needs:** Track learning activities, practice sessions, reading goals
- **Pain Points:** Procrastination, forgetting to practice, losing momentum
- **Usage Pattern:** Daily practice logs, monthly progress reviews

### Tertiary: The Wellness Enthusiast
- **Demographics:** 30-60 years old, mental health focused
- **Needs:** Track gratitude journaling, social connections, self-care activities
- **Pain Points:** Life chaos disrupting routines, guilt from missed days
- **Usage Pattern:** Flexible logging throughout day, compassionate tracking

## Functional Requirements

### 1. Habit Creation

#### 1.1 Create Habit Dialog
**Priority:** P0 (Critical)
- **Input Fields:**
  - Name (required, max 100 characters)
  - Description (optional, max 500 characters)
  - Frequency (required): daily, weekly, monthly
  - Target (required): number of completions per frequency period
  - Space (optional, dropdown)
  - Tags (optional, multi-select)
- **Validation:**
  - Name cannot be empty
  - Target must be positive integer
  - For weekly: target ≤ 7
  - For monthly: target ≤ 31
- **Examples & Guidance:**
  - Show example habits for inspiration
  - Suggest realistic targets based on frequency
  - Provide frequency explanations

#### 1.2 Habit Templates
**Priority:** P2 (Nice to Have)
- Pre-built habit templates:
  - Exercise (daily, 1x)
  - Meditation (daily, 1x)
  - Reading (daily, 1x)
  - Drink Water (daily, 8x)
  - Gratitude Journal (daily, 1x)
  - Weekly Review (weekly, 1x)
- One-click creation from template
- Customize after template selection

### 2. Habit Properties

#### 2.1 Frequency Types
**Priority:** P0 (Critical)
- **Daily:** Reset every day at midnight
  - Display: "Daily goal: X times per day"
  - Progress bar shows daily completion
- **Weekly:** Reset every Monday (configurable start day in future)
  - Display: "Weekly goal: X times per week"
  - Progress bar shows weekly completion
- **Monthly:** Reset on 1st of month
  - Display: "Monthly goal: X times per month"
  - Progress bar shows monthly completion

#### 2.2 Target Settings
**Priority:** P0 (Critical)
- Numeric target (1-100)
- Display as completion ratio: "3/5 completed"
- Percentage completion: "60% complete"
- Visual progress bar
- Color coding:
  - Red: 0-33% complete
  - Yellow: 34-66% complete
  - Green: 67-99% complete
  - Cyan glow: 100% complete

#### 2.3 Streaks
**Priority:** P0 (Critical)
- **Streak Calculation:**
  - Current streak: consecutive periods where target was met
  - Best streak: longest streak ever achieved
  - Streak at risk: today's target not yet met (for daily habits)
- **Display:**
  - Flame icon with streak number
  - "X day streak" or "X week streak"
  - Best streak badge on habit card
  - Streak at risk warning indicator

#### 2.4 Habit Status
**Priority:** P1 (High)
- **Active:** Currently tracking (default)
- **Paused:** Temporarily not tracking (preserves data)
- **Archived:** No longer tracking (hidden from main view)
- Status toggle in habit settings
- Paused habits don't affect streak calculations

### 3. Habit Logging

#### 3.1 Quick Log Interface
**Priority:** P0 (Critical)
- **From Habits View:**
  - Plus button on each habit card
  - Increments completion count for today
  - Instant optimistic update
  - Success animation (ripple effect, color change)
  - Updated progress bar immediately
- **Single-Click Logging:**
  - For habits with target = 1, clicking logs full completion
  - For habits with target > 1, shows count increment

#### 3.2 Detailed Log Entry
**Priority:** P1 (High)
- Click habit card to open detail view
- **Entry Properties:**
  - Date (defaults to today, can backfill past dates)
  - Count (how many times completed)
  - Note (optional context, max 200 characters)
  - Timestamp (auto-recorded)
- **Multi-day Backfilling:**
  - Calendar view for selecting past dates
  - Bulk log for multiple days
  - Visual indication of logged vs unlogged days

#### 3.3 Undo Logging
**Priority:** P1 (High)
- Undo button appears after logging
- 5-second window for undo
- Decrements count or removes entry
- Toast notification with undo action

### 4. Habit Display

#### 4.1 Habit Card Layout
**Priority:** P0 (Critical)
```
┌─────────────────────────────────────────┐
│ 🔥 12  Exercise                         │
│ Daily • 1x per day                       │
│ ▓▓▓▓▓▓▓▓░░ 80% (4/5 this week)         │
│ 💧 Personal | #health #fitness          │
│ Last completed: 2 hours ago        [+]  │
└─────────────────────────────────────────┘
```
- Streak indicator (flame icon + count)
- Habit name (bold, large)
- Frequency and target subtitle
- Progress bar with percentage
- Weekly/monthly summary
- Space and tag badges
- Last completed timestamp
- Quick log button

#### 4.2 Progress Visualization
**Priority:** P0 (Critical)
- **Progress Bar:**
  - Filled portion shows completion percentage
  - Gradient fill (purple to cyan)
  - Glow effect when 100% complete
- **Completion Count:**
  - "3/5 today" or "4/7 this week"
  - Large, readable numbers
- **Calendar Heatmap (Detail View):**
  - Month view with color-coded days
  - Green intensity based on completion %
  - Hover shows exact count and notes
  - Click day to view/edit entry

### 5. Habit Organization

#### 5.1 List View
**Priority:** P0 (Critical)
- **Default Sort:**
  - Active habits first
  - Streaks at risk highlighted at top
  - Then by creation date (newest first)
- **Alternative Sorts:**
  - By streak length (longest first)
  - By completion rate (highest first)
  - By name (A-Z)
  - By last completed (most recent first)

#### 5.2 Filtering
**Priority:** P1 (High)
- Filter by status (active, paused, archived)
- Filter by frequency (daily, weekly, monthly)
- Filter by space
- Filter by tags
- Filter by completion status:
  - Completed today/this week/this month
  - Not yet completed today/this week/this month
  - Streaks at risk

#### 5.3 Grouping
**Priority:** P2 (Nice to Have)
- Group by space
- Group by frequency
- Group by completion status
- Collapsible group headers

### 6. Habit Analytics

#### 6.1 Individual Habit Stats
**Priority:** P1 (High)
- **Streak Information:**
  - Current streak with start date
  - Best streak with date range
  - Total streaks broken count
- **Completion Metrics:**
  - Overall completion rate (% of periods target was met)
  - Last 7/30/90 days completion rate
  - Total completions (all-time count)
- **Time Analysis:**
  - Average completion time of day
  - Most productive day of week
  - Completion consistency score

#### 6.2 Calendar Heatmap
**Priority:** P1 (High)
- GitHub-style contribution graph
- Past 365 days (scrollable)
- Color intensity based on completion %
- Hover tooltips with exact data
- Click to view/edit entry
- Visual streak identification

#### 6.3 Trend Charts
**Priority:** P2 (Nice to Have)
- Line graph of completions over time
- Weekly/monthly aggregation views
- Trend line (improving/declining/stable)
- Comparison to target line
- Export chart as image

### 7. Habit Management

#### 7.1 Edit Habit
**Priority:** P0 (Critical)
- All properties editable except frequency (future: allow with warning)
- Update target (affects future periods only, not historical streaks)
- Change name, description, space, tags
- Save/cancel actions
- Confirmation for destructive changes

#### 7.2 Pause/Resume Habit
**Priority:** P1 (High)
- Pause action in habit menu
- Paused habits shown in separate section
- Pause reason note (optional)
- Resume action restores to active
- Streaks preserved during pause

#### 7.3 Archive Habit
**Priority:** P1 (High)
- Archive action in habit menu
- Confirmation dialog
- Archived habits hidden from main view
- "View archived" toggle to show
- Unarchive action available
- Data preserved for analytics

#### 7.4 Delete Habit
**Priority:** P0 (Critical)
- Delete action in habit menu
- Strong confirmation dialog (destructive action)
- Permanent deletion of habit and all entries
- Cannot undo (emphasize in UI)
- Option to archive instead

## Non-Functional Requirements

### Performance
- Habit list render: < 100ms for 50 habits
- Log entry creation: < 300ms round-trip
- Calendar heatmap render: < 500ms for 365 days
- Optimistic updates for instant feedback
- Efficient streak calculations

### Accessibility
- Full keyboard navigation
- Screen reader support for streak counts and progress
- High contrast mode for progress bars
- Focus indicators on all interactive elements
- Accessible date pickers

### Scalability
- Support 100+ habits per user
- Support 10,000+ habit entries per habit (multiple years)
- Efficient date range queries
- Indexed lookups for streak calculations

### Data Integrity
- Prevent duplicate entries for same day
- Atomic increment operations
- Transaction support for streak calculations
- Accurate timezone handling for day boundaries

### Psychology & Motivation
- Positive language (avoid "failed", use "not yet complete")
- Celebration animations for milestones
- Encouraging messages for streak breaks
- Progress emphasis over perfection

## User Experience

### Information Architecture
```
Habits View
├── Header
│   ├── Page Title
│   ├── Create Habit Button
│   └── Filter/Sort Controls
├── Streaks at Risk Section (if any)
│   └── Urgent Habit Cards
├── Active Habits
│   ├── Habit Card 1
│   │   ├── Streak Info
│   │   ├── Progress Bar
│   │   ├── Quick Log Button
│   │   └── Last Completed Info
│   ├── Habit Card 2
│   └── ... Habit Card N
├── Paused Habits (collapsible)
└── View Archived Link

Habit Detail View
├── Header
│   ├── Habit Name
│   ├── Edit/Pause/Archive Actions
│   └── Close Button
├── Current Stats
│   ├── Today's Progress
│   ├── Current Streak
│   └── Best Streak
├── Calendar Heatmap
│   └── Past 365 Days
├── Analytics Charts
│   ├── Completion Rate Trend
│   └── Time-of-Day Distribution
└── Recent Entries
    ├── Entry 1 (date, count, note)
    ├── Entry 2
    └── View All Link
```

### User Flows

#### Flow 1: Create and Track a New Habit
1. User clicks "Create Habit" button
2. Modal dialog opens
3. User enters habit name "Morning Meditation"
4. User selects frequency: Daily
5. User sets target: 1 per day
6. User assigns to "Wellness" space
7. User adds tag #mindfulness
8. User clicks "Create Habit"
9. Habit appears in active habits list
10. User clicks [+] button to log first completion
11. Progress bar fills to 100%
12. Success animation plays
13. Streak counter shows "1 day streak 🔥"

#### Flow 2: Morning Habit Check-In
1. User opens Habits view
2. Sees 3 habits with "at risk" indicator
3. Reviews each habit
4. Clicks [+] on "Exercise" → 1/1 complete, green glow
5. Clicks [+] on "Drink Water" → 1/8 complete, progress bar fills 12.5%
6. Clicks [+] on "Journal" → 1/1 complete, streak extends to 15 days
7. All at-risk indicators clear
8. Success toast: "3 habits completed! 🎉"

#### Flow 3: Review Habit Performance
1. User clicks on "Exercise" habit card
2. Detail view opens
3. User sees current streak: 28 days
4. User sees best streak: 45 days
5. User reviews calendar heatmap
6. Notices a gap last month (vacation)
7. User sees overall completion rate: 87%
8. User feels motivated to maintain streak

#### Flow 4: Backfill Missed Days
1. User forgot to log yesterday's habit
2. User clicks habit card to open detail
3. User clicks on yesterday's date in calendar
4. Entry dialog opens with date pre-filled
5. User sets count to 1
6. User adds note: "Completed but forgot to log"
7. User saves entry
8. Calendar updates with green color for yesterday
9. Streak remains intact

### Visual Design

#### Progress States
- **0% Complete:** Empty gray bar
- **1-33% Complete:** Red gradient fill
- **34-66% Complete:** Yellow gradient fill
- **67-99% Complete:** Green gradient fill
- **100% Complete:** Cyan glow effect with animation

#### Streak Indicators
- **🔥 1-6 days:** White flame
- **🔥 7-29 days:** Yellow flame (1 week milestone)
- **🔥 30-65 days:** Orange flame (1 month milestone)
- **🔥 66+ days:** Rainbow gradient flame (habit formation threshold)

#### Frequency Badges
- **Daily:** Blue pill badge
- **Weekly:** Purple pill badge
- **Monthly:** Indigo pill badge

## Technical Specifications

### Frontend Components
```typescript
<HabitsView>
  <HabitsHeader>
    <h1>Habits</h1>
    <CreateHabitButton />
    <FilterSortControls />
  </HabitsHeader>

  {streaksAtRisk.length > 0 && (
    <StreaksAtRiskSection>
      <h2>⚠️ Streaks at Risk</h2>
      {streaksAtRisk.map(habit => (
        <HabitCard key={habit.id} habit={habit} urgent />
      ))}
    </StreaksAtRiskSection>
  )}

  <ActiveHabits>
    {activeHabits.map(habit => (
      <HabitCard
        key={habit.id}
        habit={habit}
        onQuickLog={handleQuickLog}
        onClick={() => openHabitDetail(habit.id)}
      />
    ))}
  </ActiveHabits>

  <CreateHabitDialog />
  <HabitDetailModal />
</HabitsView>
```

### Data Models
```typescript
interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  target: number; // completions per frequency period
  status: 'active' | 'paused' | 'archived';
  space_id?: string;
  created_at: string;
  updated_at: string;
}

interface HabitEntry {
  id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  count: number; // how many times completed
  note?: string;
  created_at: string;
}

interface HabitStats {
  habit_id: string;
  current_streak: number;
  best_streak: number;
  total_completions: number;
  completion_rate: number; // percentage
  last_completed_at?: string;
  streak_start_date?: string;
  best_streak_dates?: { start: string; end: string };
}
```

### API Endpoints
```
POST   /habits                           Create habit
GET    /users/:user_id/habits             List habits (active by default)
GET    /habits/:id                        Get habit details
PUT    /habits/:id                        Update habit
DELETE /habits/:id                        Delete habit
POST   /habits/:id/pause                  Pause habit
POST   /habits/:id/resume                 Resume habit
POST   /habits/:id/archive                Archive habit

POST   /habit-entries                     Create entry (log completion)
GET    /habits/:id/entries                Get entries for date range
GET    /habits/:id/entries/:date          Get entry for specific date
PUT    /habit-entries/:id                 Update entry
DELETE /habit-entries/:id                 Delete entry

GET    /habits/:id/stats                  Get calculated statistics
GET    /habits/:id/calendar/:year/:month  Get calendar data
```

### Streak Calculation Logic
```typescript
function calculateStreak(habit: Habit, entries: HabitEntry[]): StreakInfo {
  const sortedEntries = entries.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let streakStartDate: string | null = null;

  const today = new Date();
  let checkDate = today;

  // For daily habits
  if (habit.frequency === 'daily') {
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date);
      const daysDiff = differenceInDays(checkDate, entryDate);

      if (daysDiff === 0 && entry.count >= habit.target) {
        // Entry for expected day and target met
        currentStreak++;
        tempStreak++;
        if (!streakStartDate) streakStartDate = entry.date;
        checkDate = subDays(checkDate, 1);
      } else if (daysDiff === 1 && currentStreak === 0) {
        // Allow one day grace period if not completed today yet
        currentStreak++;
        tempStreak++;
        streakStartDate = entry.date;
        checkDate = subDays(checkDate, 1);
      } else {
        // Streak broken
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
  }

  // Similar logic for weekly and monthly habits

  return {
    current: currentStreak,
    best: Math.max(bestStreak, tempStreak),
    startDate: streakStartDate,
  };
}
```

## Dependencies

### Internal
- Spaces system (habit organization)
- Tags system (habit categorization)
- Dashboard (habit summaries)
- Analytics (habit performance metrics)

### External
- React Query (data fetching)
- date-fns (date calculations, streak logic)
- Recharts or Chart.js (analytics visualizations)
- Radix UI (dialogs, progress bars)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users feel demotivated by broken streaks | High | High | Use encouraging language, show recovery stats, emphasize progress over perfection |
| Streak calculations become slow with large datasets | Medium | Medium | Cache calculated streaks, update incrementally, index by date |
| Users set unrealistic targets and abandon habits | High | Medium | Suggest realistic targets, allow easy target adjustments, show completion rate |
| Timezone issues cause incorrect streak calculations | High | Low | Use user's local timezone consistently, clear day boundary logic |
| Habit fatigue from tracking too many habits | Medium | Medium | Suggest limiting active habits to 3-5, pause feature for breaks |

## Future Enhancements

### Phase 2
- Habit reminders and notifications
- Customizable week start day (for weekly habits)
- Habit sharing and accountability partners
- Habit rewards/gamification system
- Habit insights powered by AI

### Phase 3
- Habit dependencies (e.g., "Meditate" after "Wake up early")
- Time-of-day tracking for habits
- Location-based habit triggers
- Integration with fitness trackers (Apple Health, Google Fit)
- Social features (public streaks, leaderboards)

### Phase 4
- Habit bundles (morning routine = meditation + exercise + journal)
- Smart habit suggestions based on completed habits
- Predictive analytics for habit success
- Voice logging ("Alexa, log my meditation habit")
- Wearable device integration

## Open Questions

1. Should we allow users to "freeze" streaks during planned breaks (vacations)?
2. What's the right balance between streak pressure and compassionate tracking?
3. Should archived habits count toward all-time completion statistics?
4. How should we handle habits that change frequency (daily → weekly)?
5. Should there be a maximum number of active habits to prevent overload?
6. What constitutes a "streak at risk" - only daily habits, or weekly/monthly too?

## Appendix

### A. Habit Formation Science
- **66-Day Rule:** Research shows it takes an average of 66 days to form a new habit
- **Consistency > Intensity:** Missing one day doesn't break formation if overall consistency is high
- **Identity-Based Habits:** Framing habits as identity ("I am a runner") vs behavior ("I run") increases adherence

### B. Keyboard Shortcuts
- `Cmd/Ctrl + H` - Create new habit
- `L` - Quick log focused habit
- `E` - Edit focused habit
- `P` - Pause/Resume focused habit
- `Space` - Quick log focused habit
- `Enter` - Open habit detail view
- `Escape` - Close dialogs

### C. Analytics Events
```
- habit_created
- habit_logged
- habit_entry_backfilled
- habit_edited
- habit_paused
- habit_resumed
- habit_archived
- habit_deleted
- streak_milestone_reached (7, 30, 66, 100, 365 days)
- habit_detail_viewed
- completion_rate_improved
```

### D. Motivational Messaging
- Streak milestone (7 days): "🎉 One week streak! You're building momentum!"
- Streak milestone (30 days): "🌟 30 days! This is becoming a real habit!"
- Streak milestone (66 days): "💎 Habit formed! Science says this is now part of you."
- Broken streak: "No worries! Even 1% progress is progress. Start again today? 💪"
- First completion: "Great start! The first step is always the hardest. 🎯"
- 100% day: "Perfect day! All habits completed! ✨"

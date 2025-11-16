# Habit Tracking - Product Requirements Document

**Feature Area:** Habit Tracking System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Habit Tracking system helps users build sustainable routines through streak tracking, progress visualization, and calendar integration. Designed specifically for ADHD users who struggle with consistency but benefit greatly from visual progress indicators and dopamine rewards.

## Problem Statement

ADHD users face unique challenges with habit formation:
- **Inconsistent motivation** - Hard to maintain momentum without immediate rewards
- **Out of sight = out of mind** - Habits forgotten without visual reminders
- **All-or-nothing thinking** - Missing one day feels like total failure
- **Complex tracking is abandoned** - Overly detailed systems become burdensome

## Goals

### Primary Goals
1. Make habit tracking effortless and rewarding
2. Provide visual streak tracking for dopamine reinforcement
3. Support flexible frequency (daily, weekly, custom)
4. Integrate with calendar for visibility
5. Celebrate progress without punishing lapses

### Secondary Goals
1. Analyze habit completion patterns
2. Support habit stacking/chaining
3. Provide gentle reminders without nagging
4. Export habit data for insights

## User Stories

### Epic: Basic Habit Tracking
- As a user, I can create habits with name and frequency
- As a user, I can mark habits as completed for today
- As a user, I can see my current streak
- As a user, I can view habit history
- As a user, I can edit or archive habits

### Epic: Streaks & Progress
- As a user, I can see my current streak count
- As a user, I can see my longest streak
- As a user, I see celebration animations when completing habits
- As a user, I can see completion percentage over time
- As a user, I get encouraging messages about progress

### Epic: Flexible Scheduling
- As a user, I can set daily habits (every day)
- As a user, I can set weekly habits (X times per week)
- As a user, I can set custom frequency habits
- As a user, I can pause habits without losing streak history
- As a user, I can set rest days that don't break streaks

### Epic: Calendar Integration
- As a user, I can see habits on my calendar
- As a user, I can complete habits from calendar view
- As a user, I can see habit patterns on calendar
- As a user, I can view habit history by month

### Epic: Analytics & Insights
- As a user, I can see completion rate per habit
- As a user, I can identify patterns (best/worst days)
- As a user, I can compare multiple habits
- As a user, I can export habit data

## Functional Requirements

### FR1: Habit CRUD Operations
**Priority:** P0 (Critical)

**Create Habit:**
```typescript
interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency_type: 'daily' | 'weekly' | 'custom';
  frequency_data?: {
    times_per_week?: number;
    specific_days?: number[]; // 0=Sunday
    custom_interval?: number;
  };
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**Read Habits:**
- Fetch all active habits
- Include computed streak data
- Filter by active/archived
- Sort by name, created date, streak

**Update Habit:**
- Edit name, description, frequency
- Archive/unarchive
- Pause temporarily (future)

**Delete Habit:**
- Soft delete (archive)
- Keep completion history
- Hard delete removes all data

### FR2: Habit Completions
**Priority:** P0 (Critical)

**Completion Tracking:**
```typescript
interface HabitCompletion {
  id: string;
  user_id: string;
  habit_id: string;
  completed_at: Date;
  notes?: string;
}
```

**Mark Complete:**
- Add completion record with timestamp
- Auto-calculate streak
- Show celebration animation
- Optional notes field

**Undo Completion:**
- Delete completion record
- Recalculate streak
- Allow undo within 24 hours

**Completion History:**
- Time-series query for visualization
- Group by day/week/month
- Calculate completion rate

### FR3: Streak Calculation
**Priority:** P1 (High)

**Current Streak:**
- Count consecutive days with completions
- Respects frequency type (daily vs weekly)
- Grace period for flexible habits
- Breaks on missed required day

**Longest Streak:**
- Historical maximum streak
- Stored or calculated on demand
- Achievement milestone

**Algorithm:**
```typescript
function calculateStreak(completions: Date[], frequency: FrequencyType): number {
  // Sort completions by date descending
  // For each day going backward from today:
  //   - If completion exists: increment streak
  //   - If no completion and required: break
  //   - If no completion and not required (rest day): continue
  // Return streak count
}
```

**Implementation:**
- `hooks/habits/useHabitStreaks.ts`
- Server-side calculation for accuracy
- Cached for performance

### FR4: Progress Visualization
**Priority:** P1 (High)

**Habit Cards:**
- Component: `HabitProgressCard.tsx`
- Show current streak prominently
- Progress bar for completion rate
- Calendar heatmap (mini)
- Quick complete button

**Calendar Integration:**
- Habit completions appear on calendar
- Color-coded by habit
- Click to complete from calendar
- Monthly view shows patterns

**Analytics:**
- Completion rate over time (line chart)
- Best day of week (bar chart)
- Streak history (area chart)
- Comparison across habits

### FR5: Frequency Types
**Priority:** P1 (High)

**Daily Habits:**
- Must be completed every day
- Streak breaks if missed
- Simple and clear

**Weekly Habits:**
- Complete X times per week (e.g., 3/week)
- Flexible which days
- Streak continues if weekly goal met
- Resets each week

**Custom Habits:**
- Every N days (e.g., every 3 days)
- Specific days of week (e.g., Mon/Wed/Fri)
- Monthly frequency (e.g., 1st of month)
- Most flexible option

**Frequency Data Storage:**
```typescript
// Daily
{ frequency_type: 'daily' }

// Weekly (3 times per week)
{
  frequency_type: 'weekly',
  frequency_data: { times_per_week: 3 }
}

// Custom (Mon/Wed/Fri)
{
  frequency_type: 'custom',
  frequency_data: { specific_days: [1, 3, 5] }
}

// Custom (every 3 days)
{
  frequency_type: 'custom',
  frequency_data: { custom_interval: 3 }
}
```

### FR6: Celebration & Motivation
**Priority:** P2 (Medium)

**Celebration Triggers:**
- Habit completion (confetti animation)
- Streak milestones (1, 7, 30, 100, 365 days)
- Perfect week (all habits completed)
- Return after lapse (encouraging message)

**Visual Feedback:**
- Confetti animation on complete
- Streak flame icon
- Progress bar fills
- Sound effects (optional, user preference)

**Encouraging Messages:**
- "Great job! 7 day streak!"
- "Welcome back! Every day is a fresh start."
- "Consistency is key - you're doing amazing!"
- Rotate based on context

### FR7: Calendar Integration
**Priority:** P1 (High)

**Habit Events:**
- Create calendar entries for habit completions
- Color-coded by habit
- Link to habit detail
- Show on unified calendar view

**Completion from Calendar:**
- Click habit on calendar to mark complete
- Visual indicator (checkmark, filled circle)
- Syncs back to habit tracking system

**Pattern Visualization:**
- Heatmap overlay on month view
- Identify completion patterns
- Spot gaps easily

## Database Schema

```sql
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency_type TEXT CHECK (frequency_type IN ('daily', 'weekly', 'custom')) DEFAULT 'daily',
  frequency_data JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_habits_active ON habits(user_id, active);
CREATE INDEX idx_habit_completions_habit ON habit_completions(habit_id);
CREATE INDEX idx_habit_completions_date ON habit_completions(user_id, completed_at);
CREATE INDEX idx_habit_completions_user_date ON habit_completions(user_id, DATE(completed_at));
```

## Components

**Main Views:**
- `/components/habits/HabitsContentOrchestrator.tsx` - Pane integration
- `/components/habits/HabitProgressCard.tsx` - Progress visualization

**Forms & Modals:**
- `/components/modals/HabitModal.tsx` - Create/edit habit (implied)
- Habit frequency editor (within modal)

**Widgets:**
- Habit completion widgets for dashboard
- Quick complete buttons
- Streak displays

## Hooks

**Data Management:**
- `/hooks/habits/useHabits.ts` - CRUD operations
- `/hooks/habits/useHabitStreaks.ts` - Streak calculation

**Query Keys:**
```typescript
['habits', userId]
['habit-completions', userId, habitId]
['habit-streaks', userId]
```

## Success Metrics

### Usage Metrics
- Average habits per user
- Daily completion rate
- Average streak length
- Habit abandonment rate (inactive >30 days)

### Engagement Metrics
- Completion interaction time
- Calendar integration usage
- Analytics view frequency

### Behavior Metrics
- Habit consistency improvement over time
- Streak recovery rate after breaks
- Long-term habit retention (>90 days active)

## Future Enhancements

### v1.1
- Habit stacking (link habits together)
- Reminders/notifications
- Habit categories/tags
- Social accountability (shared habits)

### v1.2
- Habit templates
- AI-powered habit suggestions
- Advanced analytics (correlation with mood, tasks)
- Gamification (badges, achievements)

### v2.0
- Habit challenges
- Community habits
- Wearable integration (Fitbit, Apple Health)
- Voice completion ("Alexa, I did my morning routine")

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Calendar PRD](./06-calendar-prd.md) - Integration details
- [Mood Logging PRD](./04-mood-logging-prd.md) - Cross-analysis potential

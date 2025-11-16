# PRD: Habit Tracking System

## Product Overview

The Habit Tracking System helps users with ADHD and executive dysfunction build and maintain positive habits through daily/weekly tracking, streak visualization, and mood correlation analytics. The system emphasizes dopamine-friendly feedback, flexible frequency options, and low-friction completion logging.

## Problem Statement

Users with ADHD struggle with habit formation due to:
- **Inconsistent Routines**: Difficulty maintaining daily/weekly patterns
- **Motivation Loss**: Lack of visible progress demotivates continuation
- **All-or-Nothing Thinking**: Missing one day feels like complete failure
- **Context Blindness**: Not connecting habits to mood/energy patterns
- **Tracking Friction**: Complex logging processes lead to abandonment

## Target Users

- **Primary**: Adults with ADHD building new habits or maintaining existing ones
- **Secondary**: Users tracking multiple habits simultaneously
- **Tertiary**: Users interested in habit-mood correlation analysis

## Goals & Success Metrics

### User Goals
1. Build sustainable habits through consistent tracking
2. Visualize progress through streak mechanics
3. Understand habit completion patterns over time
4. Correlate habits with mood and energy levels
5. Maintain motivation through visible progress

### Success Metrics
- **Habit Completion Rate**: Percentage of target completions met
- **Streak Length**: Average current streak across all habits
- **Long-term Retention**: Users still tracking habits after 30/60/90 days
- **Daily Active Habit Users**: Users logging at least one completion per day
- **Habit Survival Rate**: Percentage of habits still active after 30 days

## Core Features

### 1. Habit CRUD Operations

**Description**: Create, read, update, and manage habits

**User Stories**:
- As a user, I want to create a new habit with a name and description
- As a user, I want to set the frequency (daily, weekly, custom)
- As a user, I want to edit habit details at any time
- As a user, I want to archive (deactivate) habits I no longer track

**Technical Implementation**:
- Database: `habits` table (supabase/schema.sql:147-157)
- Hooks: `useHabits()`, `useActiveHabits()`
- Components: `HabitCardRenderer.tsx`, `HabitProgressCard.tsx`
- Real-time: Supabase subscriptions for live updates

**Fields**:
- `name` (required): Habit name (e.g., "Morning Meditation")
- `description` (optional): Why this habit matters
- `frequency_type` (enum): daily | weekly | custom
- `frequency_value` (integer): Target completions per period
- `is_active` (boolean): Whether habit is currently tracked

**Frequency Examples**:
- **Daily**: frequency_type='daily', frequency_value=1 (once per day)
- **Weekly**: frequency_type='weekly', frequency_value=3 (3 times per week)
- **Custom**: frequency_type='custom', frequency_value=10 (10 times per month)

### 2. Habit Completion Logging

**Description**: Quick, frictionless way to log habit completions

**User Stories**:
- As a user, I want to mark a habit as complete for today with one click
- As a user, I want to log a completion with optional notes
- As a user, I want to undo today's completion if I logged by mistake
- As a user, I want to see completion history in a calendar view

**Technical Implementation**:
- Database: `habit_completions` table (supabase/schema.sql:160-166)
- Hooks: `useCompleteHabit()`, `useDecrementHabitCompletion()`, `useHabitCompletions()`
- Components: Completion button on habit cards
- Index: `idx_habit_completions_time` for fast time-series queries

**Completion Fields**:
- `habit_id` (foreign key): Reference to parent habit
- `completed_at` (timestamp): When habit was completed
- `notes` (optional): Contextual notes about completion

**Completion Behavior**:
- One-click completion for current datetime
- Optional notes dialog for additional context
- Undo button visible for recent completions (last 24 hours)
- Completion updates current streak in real-time

### 3. Streak Tracking & Analytics

**Description**: Calculate and display current and best streaks for motivation

**User Stories**:
- As a user, I want to see my current streak for each habit
- As a user, I want to see my personal best streak
- As a user, I want to see a visual streak calendar (like GitHub contributions)
- As a user, I want encouragement when I reach streak milestones

**Technical Implementation**:
- Hook: `useHabitStreaks()`
- Algorithm: Calculate streak from completion history
- Components: Streak display in habit cards
- Caching: Memoized streak calculations

**Streak Calculation**:
```typescript
calculateStreak(completions: Completion[], frequencyType: string): {
  currentStreak: number
  bestStreak: number
  lastCompletionDate: Date
}

// For daily habits:
// - Streak = consecutive days with at least one completion
// - Breaks if 1+ days missed

// For weekly habits:
// - Streak = consecutive weeks meeting target frequency
// - Week starts on user's preferred day (default: Monday)

// For custom habits:
// - Streak = consecutive periods meeting target frequency
```

**Streak Visualization**:
- Numeric badge showing current streak (e.g., "🔥 12 days")
- Progress bar showing completion rate (last 30 days)
- Calendar heatmap showing completion density
- Best streak display for motivation ("Personal Best: 45 days")

### 4. Habit Statistics & Insights

**Description**: Aggregate statistics to show habit patterns over time

**User Stories**:
- As a user, I want to see my overall completion rate
- As a user, I want to see which days I'm most consistent
- As a user, I want to see how many total completions I have
- As a user, I want to compare this month vs last month

**Technical Implementation**:
- Hook: `useHabitStats()`
- Analytics: Time-series aggregation
- Components: Statistics dashboard in habits pane

**Statistics Provided**:
- **Completion Rate**: (completions / target completions) over last 30 days
- **Total Completions**: All-time completion count
- **Best Day of Week**: Day with highest completion rate
- **Average Completions Per Week**: Rolling average
- **Longest Streak**: Personal best streak length
- **Current Streak**: Active streak length

### 5. Mood-Habit Correlation

**Description**: Connect habit completions to mood entries for pattern discovery

**User Stories**:
- As a user, I want to see if my meditation habit correlates with better mood
- As a user, I want to see if exercise improves my energy levels
- As a user, I want to discover which habits have the most mood impact

**Technical Implementation**:
- Integration: Cross-reference `habit_completions` with `mood_entries` by date
- Analytics: Calculate correlation coefficients
- Components: Correlation visualization in habit analytics

**Correlation Metrics**:
```typescript
interface HabitMoodCorrelation {
  habitId: string
  habitName: string
  averageMoodOnCompletionDays: number
  averageMoodOnNonCompletionDays: number
  moodDifference: number // positive = habit improves mood
  energyDifference: number // positive = habit improves energy
  stressDifference: number // negative = habit reduces stress
}
```

**Correlation Display**:
- Visual chart showing mood on completion vs non-completion days
- Text insight: "Your mood is 15% higher on days you exercise"
- Energy/stress impact visualization

### 6. Energy Level Tracking

**Description**: Log energy level on habit completion for pattern analysis

**User Stories**:
- As a user, I want to log my energy level when completing a habit
- As a user, I want to see if certain habits drain or boost energy
- As a user, I want to schedule habits during high-energy times

**Technical Implementation**:
- Field: `energy_level` in mood context (linked to completion)
- UI: Quick 1-5 scale on completion dialog
- Analytics: Energy pattern analysis

**Energy Levels**:
- 1: Exhausted
- 2: Low
- 3: Moderate
- 4: Good
- 5: Energized

### 7. Habit Templates & Recommendations

**Description**: Pre-built habits and smart suggestions

**User Stories**:
- As a user, I want to choose from common habits (exercise, meditation, etc.)
- As a user, I want suggested frequency based on best practices
- As a user, I want to see popular habits other users track

**Technical Implementation**:
- Static data: Habit template library
- Component: Template selector on habit creation

**Template Categories**:
- **Health**: Exercise, drink water, take vitamins, stretch
- **Mental Health**: Meditate, journal, therapy, gratitude
- **Productivity**: Deep work session, inbox zero, weekly review
- **Social**: Call friend/family, date night, social activity
- **Learning**: Read, language practice, skill development
- **Self-Care**: Sleep 8 hours, skincare routine, hobby time

### 8. Habit Calendar View

**Description**: Calendar visualization of habit completions

**User Stories**:
- As a user, I want to see a monthly calendar of habit completions
- As a user, I want to see multiple habits on one calendar
- As a user, I want to see completion density (1x, 2x, 3x per day)

**Technical Implementation**:
- Component: Calendar widget in habits pane
- Library: Custom calendar using date-fns
- Visualization: Heatmap-style shading for frequency

**Calendar Features**:
- Month/year navigation
- Color coding per habit
- Hover tooltips showing details
- Click to see all habits completed that day

### 9. Habit Reminders

**Description**: Optional calendar event reminders for habit completion

**User Stories**:
- As a user, I want daily reminders to complete my habits
- As a user, I want reminders at specific times (e.g., 7am for morning routine)
- As a user, I want to snooze reminders

**Technical Implementation**:
- Integration: `calendar_events` table with `habit_id` foreign key
- Sync: Create calendar events for habit reminders
- Google Calendar: Push reminders to user's Google Calendar

**Reminder Options**:
- **Frequency**: Match habit frequency (daily, weekly, etc.)
- **Time**: User-specified time of day
- **Advance Notice**: Reminder X minutes before target time
- **Snooze**: Delay reminder by 15/30/60 minutes

## User Workflows

### Workflow 1: Creating a New Habit
1. User clicks "Add Habit" button in habits pane
2. User enters habit name (e.g., "Morning Meditation")
3. User selects frequency type (daily)
4. User sets target frequency (1 per day)
5. User optionally adds description
6. User saves habit
7. Habit appears in active habits list
8. User sees "0 day streak" initially

### Workflow 2: Completing a Habit
1. User sees habit card with completion button
2. User clicks completion button (checkmark icon)
3. System logs completion with current timestamp
4. System updates current streak (+1 if daily, or based on frequency)
5. System shows celebration animation if milestone reached
6. Habit card shows updated streak count
7. Optional: User adds notes about completion

### Workflow 3: Reviewing Habit Progress
1. User opens habit details/stats view
2. User sees:
   - Current streak: 12 days 🔥
   - Best streak: 30 days
   - Completion rate: 85% (last 30 days)
   - Total completions: 127
   - Calendar heatmap of completions
3. User sees mood correlation: "Your mood is 18% better on days you complete this habit"
4. User feels motivated to continue

### Workflow 4: Undoing a Completion
1. User accidentally marks habit complete
2. User clicks "Undo" button (visible for 24 hours)
3. System removes completion record
4. System recalculates streak (decrements if needed)
5. Habit card shows updated state

### Workflow 5: Discovering Habit-Mood Patterns
1. User has been tracking meditation habit for 30 days
2. User has also been logging mood daily
3. User opens habit analytics
4. System calculates:
   - Average mood on meditation days: 7.2/10
   - Average mood on non-meditation days: 5.4/10
   - Mood improvement: +33%
5. User sees insight: "Meditation boosts your mood by 33%"
6. User feels encouraged to maintain habit

## Technical Architecture

### Database Schema
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency_type TEXT CHECK (frequency_type IN ('daily', 'weekly', 'custom')),
  frequency_value INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
)
```

### Component Hierarchy
```
HabitsContentOrchestrator (state management)
├── HabitsContentRenderer (presentation)
│   ├── HabitProgressCard (individual habit display)
│   │   ├── Streak display
│   │   ├── Completion button
│   │   └── Statistics summary
│   ├── HabitCardRenderer (habit card UI)
│   ├── HabitCalendarWidget (calendar visualization)
│   └── HabitAnalytics (statistics & insights)
└── HabitModal (create/edit dialog)
```

### Key Hooks
- `useHabits()`: CRUD operations with real-time sync
- `useHabitCompletions(habitId)`: Fetch completion history
- `useCompleteHabit()`: Log a completion
- `useDecrementHabitCompletion()`: Undo completion
- `useHabitStreaks()`: Calculate current and best streaks
- `useActiveHabits()`: Filter only active habits
- `useHabitStats()`: Aggregate statistics

### State Management
- **TanStack Query**: Server state with `['habits']` and `['habit-completions', habitId]` keys
- **Real-time**: Supabase subscriptions for live completion updates
- **Caching**: 5-minute stale time for habit list, fresh for completions

## ADHD-Friendly Design Patterns

### 1. One-Click Completion
- No multi-step forms for logging
- Single button press to complete
- Visual feedback immediate (animation + streak update)

### 2. Streak Visualization
- Fire emoji (🔥) next to streak count for dopamine hit
- Celebration animations at milestones (7, 30, 100 days)
- Personal best displayed for motivation

### 3. Forgiveness Mechanics
- Easy undo for accidental completions
- Grace period for daily habits (complete until 3am next day counts as previous day)
- No shaming for broken streaks (encouragement to restart)

### 4. Progress Over Perfection
- Show completion rate % instead of "success/failure"
- "85% completion rate" feels better than "missed 5 days"
- Visual progress bars emphasize what WAS done

### 5. Contextual Insights
- Show mood correlation without user requesting it
- Proactive insights: "You've completed this 12 days in a row!"
- Celebrate small wins: "3 day streak!" notification

## Accessibility

- Keyboard shortcuts: Space bar to complete habit
- Screen reader: ARIA labels on completion buttons
- Color blind friendly: Patterns + colors in visualizations
- High contrast mode: Clear streak indicators without relying on color

## Performance Considerations

- **Completion Query Optimization**: Index on `habit_id, completed_at` for fast streak calculation
- **Streak Caching**: Memoize streak calculations to avoid recalculation on every render
- **Lazy Load Completions**: Load only last 90 days of completions by default
- **Real-time Throttling**: Batch real-time updates to avoid too frequent re-renders

## Future Enhancements

1. **Habit Chains**: Suggest habit stacking (do X, then Y)
2. **Social Features**: Share streaks, challenge friends
3. **Habit Pause**: Pause habit without losing streak (e.g., for vacation)
4. **Smart Scheduling**: AI suggests best time of day for habit based on completion patterns
5. **Habit Dependencies**: Require Habit A before allowing Habit B completion
6. **Negative Habits**: Track habits to reduce/eliminate (smoking, junk food, etc.)
7. **Habit Journal**: Rich-text notes per completion
8. **Photo Logging**: Add before/after photos for visual progress
9. **Export Data**: CSV export of all completions for external analysis
10. **Integration**: Import from Apple Health, Fitbit, etc.

## Open Questions

1. Should we allow retroactive logging (completing habit for past dates)?
2. How do we handle time zones for "daily" habits (midnight cutoff)?
3. Should weekly habits have a specific start day (Monday) or rolling 7-day windows?
4. Should we gamify more (levels, achievements, badges)?
5. Should we support habit categories/tags?

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Users abandon after initial excitement | High | High | Engagement features (streaks, insights), push notifications |
| Streak pressure causes anxiety | Medium | Medium | Emphasize progress over perfection, easy streak restart |
| Correlation analysis misleading | Medium | Low | Show statistical significance, disclaimer about causation |
| Calendar clutter from reminders | Low | Medium | Allow reminder customization, easy disable |
| Data loss breaks streaks | High | Low | Robust backup, completion immutability |

## Success Criteria for Launch

1. ✅ Habit CRUD operations functional
2. ✅ One-click completion logging working
3. ✅ Streak calculation accurate for all frequency types
4. ✅ Calendar visualization of completions
5. ✅ Undo completion functionality
6. ✅ Basic statistics (completion rate, total completions)
7. ✅ Mood correlation analytics (if mood feature enabled)
8. ✅ Mobile-responsive design
9. ✅ Real-time updates across tabs
10. ✅ Performance: <200ms for completion logging

## References

- File: `components/panes/content/HabitsContentOrchestrator.tsx`
- File: `components/habits/HabitCardRenderer.tsx`
- File: `hooks/habits/useHabits.ts`
- File: `hooks/habits/useHabitStreaks.ts`
- Schema: `supabase/schema.sql:147-181`
- README: `components/habits/README.md`

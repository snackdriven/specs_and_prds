# PRD: Mood Logging & Insights

## Product Overview

The Mood Logging system helps users with ADHD track their emotional state, energy levels, and stress throughout the day. It provides correlation analytics with habits, tasks, and other activities to help users understand patterns and triggers.

## Problem Statement

Users with ADHD often experience:
- **Mood Variability**: Rapid mood shifts that feel unpredictable
- **Pattern Blindness**: Not recognizing what affects their mood
- **Energy Management**: Difficulty identifying high/low energy times
- **Stress Accumulation**: Stress building without awareness
- **Treatment Tracking**: Need to monitor mood for medication/therapy adjustments

## Target Users

- **Primary**: Users tracking mood for ADHD management
- **Secondary**: Users in therapy wanting mood data
- **Tertiary**: Users seeking general wellness insights

## Core Features

### 1. Quick Mood Logging

**User Stories**:
- As a user, I want to log my mood with one tap
- As a user, I want to add optional notes about why I feel this way
- As a user, I want to log energy and stress levels separately
- As a user, I want context tags (work, home, social, etc.)

**Technical Implementation**:
- Database: `mood_entries` table (supabase/schema.sql:196-208)
- Hook: `useMood()`, `useQuickMoodLogger()`
- Components: `MoodContentRenderer.tsx`

**Mood Entry Fields**:
- `mood_option_id` (FK): Reference to user's mood scale
- `custom_level` (1-10): Numeric mood level
- `notes` (text): Optional context
- `energy_level` (1-5): Low to high energy
- `stress_level` (1-5): Low to high stress
- `context` (JSONB): Tags like 'work', 'home', 'exercise'
- `recorded_at` (timestamp): When mood was logged

### 2. Custom Mood Options

**User Stories**:
- As a user, I want to define my own mood labels
- As a user, I want to assign colors to moods
- As a user, I want to use emojis for quick recognition
- As a user, I want default moods provided

**Technical Implementation**:
- Database: `mood_options` table (supabase/schema.sql:184-193)
- Components: Mood option manager in settings

**Mood Option Fields**:
- `label` (text): Mood name (e.g., "Energetic", "Anxious")
- `value` (1-10): Numeric scale position
- `color` (hex): Visual color for charts
- `emoji` (text): Optional emoji (😊, 😔, 😤)
- `is_default` (boolean): System-provided vs user-created

**Default Moods**:
- 😊 Great (10)
- 🙂 Good (8)
- 😐 Neutral (5)
- 😔 Low (3)
- 😤 Stressed (2)

### 3. Mood Trends & Visualization

**User Stories**:
- As a user, I want to see my mood over the past week/month
- As a user, I want a line graph of mood trends
- As a user, I want to see average mood by day of week
- As a user, I want to identify patterns

**Visualizations**:
- **Line Chart**: Mood level over time
- **Bar Chart**: Average mood by day of week
- **Heatmap**: Mood density calendar
- **Distribution**: Mood frequency histogram

### 4. Mood-Habit Correlation

**User Stories**:
- As a user, I want to see if exercise improves my mood
- As a user, I want to see if meditation affects my stress levels
- As a user, I want insights like "Your mood is 20% better on days you exercise"

**Technical Implementation**:
- Query: Join `mood_entries` with `habit_completions` by date
- Algorithm: Calculate average mood on completion days vs non-completion days
- Component: Correlation insights in habit analytics

**Correlation Display**:
```
🏃 Exercise
📊 Average mood on exercise days: 7.8/10
📊 Average mood on rest days: 6.2/10
💡 Insight: Your mood is 26% higher on days you exercise!
```

### 5. Energy Level Tracking

**User Stories**:
- As a user, I want to log my energy level separate from mood
- As a user, I want to see my energy patterns throughout the day
- As a user, I want to schedule tasks during high-energy times

**Energy Scale**:
- 1: Exhausted
- 2: Low
- 3: Moderate
- 4: Good
- 5: Energized

**Energy Insights**:
- Best energy time of day
- Average energy by day of week
- Energy-task correlation

### 6. Stress Level Tracking

**User Stories**:
- As a user, I want to track stress separately from mood
- As a user, I want to identify stress triggers
- As a user, I want to see stress reduction from coping activities

**Stress Scale**:
- 1: Relaxed
- 2: Calm
- 3: Moderate
- 4: High
- 5: Overwhelming

**Stress Insights**:
- Average stress by context (work, home, social)
- Stress trends over time
- Activities that reduce stress

## Technical Architecture

### Database Schema
```sql
CREATE TABLE mood_options (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  label TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value BETWEEN 1 AND 10),
  color TEXT DEFAULT '#6366f1',
  emoji TEXT,
  is_default BOOLEAN DEFAULT FALSE
)

CREATE TABLE mood_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mood_option_id UUID REFERENCES mood_options(id) ON DELETE SET NULL,
  custom_level INTEGER CHECK (custom_level BETWEEN 1 AND 10),
  notes TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  context JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Key Hooks
- `useMood()`: CRUD operations for mood entries
- `useMoodLoggerState()`: Form state management
- `useQuickMoodLogger()`: One-tap mood logging

### Component Hierarchy
```
MoodContentOrchestrator
├── MoodContentRenderer
│   ├── QuickMoodLogger (one-tap buttons)
│   ├── MoodChart (trends visualization)
│   ├── MoodInsights (patterns & correlations)
│   └── MoodHistory (past entries list)
└── MoodEntryModal (detailed logging form)
```

## ADHD-Friendly Design

### 1. One-Tap Logging
- Big, colorful mood buttons
- No required fields except mood
- Optional details (notes, energy, stress)

### 2. Visual Feedback
- Emoji-based mood display
- Color-coded charts
- Animated mood transitions

### 3. Contextual Prompts
- "How are you feeling?" at scheduled times
- Prompt after completing habits
- Prompt after stressful task completion

## Future Enhancements

1. **Medication Tracking**: Log medications and correlate with mood
2. **Weather Correlation**: See if weather affects mood
3. **Sleep Correlation**: Import sleep data and correlate
4. **Mood Predictions**: ML model to predict mood based on patterns
5. **Mood Sharing**: Share mood data with therapist
6. **Voice Logging**: Voice input for mood notes
7. **Photo Diary**: Attach photos to mood entries
8. **Mood Reminders**: Scheduled prompts to log mood

## Success Criteria

1. ✅ Quick mood logging functional (< 5 seconds to log)
2. ✅ Custom mood options working
3. ✅ Energy and stress tracking
4. ✅ Basic trend visualization (line chart)
5. ✅ Mood-habit correlation analytics
6. ✅ Mobile-responsive design

## References

- File: `components/panes/content/MoodContentOrchestrator.tsx`
- File: `components/panes/content/MoodContentRenderer.tsx`
- Hook: `hooks/mood/useMood.ts`
- Schema: `supabase/schema.sql:184-227`
- README: `hooks/mood/README.md`

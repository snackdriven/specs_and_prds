# Mood Logging - Product Requirements Document

**Feature Area:** Mood Tracking & Mental Health Monitoring
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Mood Logging system enables users to track emotional states, energy levels, and stress over time. Designed for ADHD individuals who benefit from understanding patterns between mood, productivity, and life events.

## Problem Statement

Mental health tracking for ADHD users requires:
- **Quick logging** - Can't be time-consuming or it won't be used
- **Contextual data** - Mood alone isn't enough; need energy and stress
- **Pattern recognition** - Manual analysis is overwhelming
- **Privacy** - Sensitive data must feel safe
- **Integration** - Mood affects tasks, habits, and journal entries

## Goals

### Primary Goals
1. Enable effortless mood logging (one-click preferred)
2. Track mood, energy, and stress levels
3. Visualize patterns over time
4. Integrate mood context into other features
5. Provide insights without requiring manual analysis

### Secondary Goals
1. Correlate mood with tasks/habits completion
2. Identify triggers and patterns
3. Export for healthcare providers
4. Support custom mood options

## User Stories

### Epic: Basic Mood Logging
- As a user, I can log my current mood quickly
- As a user, I can rate my energy level (1-5)
- As a user, I can rate my stress level (1-5)
- As a user, I can add contextual notes
- As a user, I can log multiple times per day

### Epic: Custom Mood Options
- As a user, I can customize the 1-10 mood scale
- As a user, I can assign emojis to mood levels
- As a user, I can set colors for each level
- As a user, I can create mood descriptors

### Epic: Mood Visualization
- As a user, I can see mood trends over time
- As a user, I can view mood calendar heatmap
- As a user, I can compare mood with energy/stress
- As a user, I can filter by date range

### Epic: Pattern Analysis
- As a user, I can see my average mood by day of week
- As a user, I can identify mood patterns
- As a user, I can correlate mood with task completion
- As a user, I can spot stress triggers

### Epic: Integration
- As a user, I can reference mood in journal entries
- As a user, I can see mood context in task history
- As a user, I can filter tasks/habits by mood periods
- As a user, I can share mood data with therapist (export)

## Functional Requirements

### FR1: Mood Entry CRUD
**Priority:** P0 (Critical)

**Create Entry:**
```typescript
interface MoodEntry {
  id: string;
  user_id: string;
  mood_level: number; // 1-10 scale
  energy_level: number; // 1-5 scale
  stress_level: number; // 1-5 scale
  context: {
    notes?: string;
    weather?: string;
    sleep_quality?: number;
    [key: string]: any; // Extensible
  };
  logged_at: Date;
  created_at: Date;
  updated_at: Date;
}
```

**Quick Log:**
- Minimal UI (mood + submit)
- Optional expansion for energy/stress
- Modal or inline widget

**Detailed Log:**
- Full form with all fields
- Context notes
- Optional metadata (weather, sleep, etc.)

**Read Entries:**
- Fetch by date range
- Aggregate statistics
- Time-series data for charts

**Update Entry:**
- Edit within 24 hours
- Update mood level, energy, stress, notes

**Delete Entry:**
- Soft delete (mark inactive)
- Keep for historical analysis
- Hard delete option for privacy

### FR2: Custom Mood Options
**Priority:** P1 (High)

**Mood Option Customization:**
```typescript
interface MoodOption {
  id: string;
  user_id: string;
  mood_level: number; // 1-10
  label: string; // "Terrible", "Great", etc.
  emoji: string; // "😢", "😊", etc.
  color: string; // Hex color for visualization
  description?: string;
  active: boolean;
}
```

**Default Options:**
- Pre-populated 1-10 scale
- Standard emojis and labels
- User can customize or keep defaults

**Customization UI:**
- Component: `MoodOptionsManager.tsx` (in settings)
- Edit labels, emojis, colors
- Preview visualization
- Reset to defaults option

**Database:**
```sql
CREATE TABLE mood_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 10) NOT NULL,
  label TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mood_level)
);
```

### FR3: Energy & Stress Tracking
**Priority:** P0 (Critical)

**Energy Level (1-5):**
- 1: Exhausted, can barely function
- 2: Low energy, tired
- 3: Moderate, normal
- 4: Good energy, productive
- 5: High energy, peak performance

**Stress Level (1-5):**
- 1: Completely calm, relaxed
- 2: Slightly stressed
- 3: Moderate stress
- 4: High stress, anxious
- 5: Overwhelming stress, panic

**Why Track Both:**
- Mood alone doesn't show full picture
- Energy affects productivity
- Stress affects mood and energy
- Correlations provide insights

**UI:**
- Slider controls
- Visual indicators (battery for energy, thermometer for stress)
- Optional field (can log mood only)

### FR4: Context & Notes
**Priority:** P2 (Medium)

**Context Field (JSONB):**
- Flexible structure for extensibility
- Standard fields: notes, weather, sleep_quality
- Custom fields added via UI

**Notes:**
- Free-form text
- Private by default
- Searchable
- Optional

**Contextual Metadata:**
- Time of day (auto-captured)
- Location (optional, future)
- Current task context (auto-linked)
- Current habit status (auto-linked)

### FR5: Visualization & Analytics
**Priority:** P1 (High)

**Mood Timeline:**
- Line chart showing mood over time
- Color-coded by mood level
- Hover for details
- Zoom/pan for long periods

**Mood Calendar:**
- Heatmap view
- Color intensity by mood level
- Click for details
- Monthly/yearly view

**Energy vs Stress:**
- Scatter plot or dual-axis chart
- Identify relationships
- Highlight outliers

**Pattern Analysis:**
- Average mood by day of week
- Best/worst time of day
- Mood trends (improving/declining)
- Stress triggers identification

**Components:**
- `MoodContentOrchestrator.tsx` / `MoodContentRenderer.tsx`
- Chart.js or Recharts integration
- Responsive and accessible

### FR6: Quick Mood Logger
**Priority:** P1 (High)

**Purpose:**
Reduce friction to increase logging frequency

**UI Options:**
1. **Dashboard Widget:**
   - "How are you feeling?" prompt
   - 1-10 mood buttons
   - Optional expand for energy/stress
   - One-click submit

2. **Modal Popup:**
   - Triggered by user action
   - Quick entry form
   - Optional detailed mode

3. **Inline in Pane:**
   - Always visible in mood pane
   - Quick log at top
   - History below

**Hook:**
- `hooks/mood/useQuickMoodLogger.ts`
- Handles state and submission
- Optimistic updates

### FR7: Integration with Other Features
**Priority:** P2 (Medium)

**Journal Integration:**
- Mood context auto-added to journal entries
- Journal entry can create mood log
- View journal entries by mood period

**Task Integration:**
- See average mood during task completion
- Filter tasks by mood context
- "Worked on task X while feeling Y"

**Habit Integration:**
- Correlate habit completion with mood
- Identify if habits improve mood
- Mood trends on habit completion days

**Calendar Integration:**
- Mood indicators on calendar
- Click to log mood for past days
- Mood patterns on calendar view

## Database Schema

```sql
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 10) NOT NULL,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5),
  context JSONB,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_mood_entries_logged_at ON mood_entries(user_id, logged_at);
CREATE INDEX idx_mood_entries_date ON mood_entries(user_id, DATE(logged_at));
```

## Components

**Main Views:**
- `/components/mood/MoodContentOrchestrator.tsx` - Main orchestrator
- `/components/mood/MoodContentRenderer.tsx` - Rendering logic

**Forms:**
- `/components/forms/MoodLoggerModal.tsx` - Logging modal
- Quick mood logger widget (dashboard)

**Settings:**
- `/components/settings/MoodOptionsManager.tsx` - Customize mood options

**Visualizations:**
- Mood timeline chart
- Mood calendar heatmap
- Energy/stress correlation charts

## Hooks

**Data Management:**
- `/hooks/mood/useMood.ts` - CRUD operations
- `/hooks/mood/useMoodLoggerState.ts` - Logger UI state
- `/hooks/mood/useQuickMoodLogger.ts` - Quick logging

**Query Keys:**
```typescript
['mood-entries', userId, dateRange]
['mood-options', userId]
['mood-stats', userId]
```

## Success Metrics

### Usage Metrics
- Mood logs per user per week
- Average energy/stress completion rate
- Quick logger vs detailed logger usage
- Custom mood option adoption

### Engagement Metrics
- Consecutive logging days
- Analytics view frequency
- Integration with journal/tasks

### Health Metrics
- Mood trend direction (improving/stable/declining)
- Stress level averages
- Energy level correlations

## Future Enhancements

### v1.1
- Mood predictions based on patterns
- Automated mood logging via wearables
- Voice mood logging
- Photo mood logging (facial recognition)

### v1.2
- Therapist sharing portal
- Advanced correlations (weather, moon phase, caffeine)
- Mood-based task suggestions
- Wellness recommendations

### v2.0
- AI mood coach
- Community mood trends (anonymized)
- Integration with meditation apps
- Medication tracking correlation

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Journal PRD](./05-journal-prd.md) - Mood context integration
- [Habit Tracking PRD](./03-habit-tracking-prd.md) - Correlation analysis

# Dashboard & Widgets - Product Requirements Document

**Feature Area:** Dashboard Home & Widget System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Dashboard serves as the primary landing page, providing at-a-glance overview of all EDC features. Designed for quick context loading and immediate action, addressing ADHD needs for instant engagement and clear priorities.

## Problem Statement

ADHD users need quick context on opening the app:
- **Decision fatigue** - Too many choices causes paralysis
- **Lost in details** - Easy to get derailed from primary intent
- **Forgetting what matters** - Without overview, priorities unclear
- **Lack of momentum** - No immediate "hook" to start working

## Goals

1. Provide comprehensive overview in < 2 seconds
2. Enable quick actions without navigating away
3. Show most relevant information contextually
4. Celebrate progress and maintain motivation
5. Support customization without complexity

## User Stories

### Epic: Dashboard Overview
- As a user, I see a personalized greeting when I arrive
- As a user, I see today's date and current time
- As a user, I see my most urgent tasks at a glance
- As a user, I see my habit streak progress
- As a user, I see upcoming countdowns
- As a user, I can take quick actions from dashboard

### Epic: Quick Actions
- As a user, I can complete tasks from dashboard
- As a user, I can log mood from dashboard
- As a user, I can mark habits complete from dashboard
- As a user, I can create new items without leaving dashboard
- As a user, I can access frequently used panes quickly

### Epic: Widgets
- As a user, I can see countdown widgets
- As a user, I can see task preview widgets
- As a user, I can see habit progress widgets
- As a user, I can see calendar widgets
- As a user, I can see quick notes widget
- As a user, I can see Google Sheets widgets (if configured)

### Epic: Customization
- As a user, I can rearrange dashboard widgets
- As a user, I can show/hide specific widgets
- As a user, I can customize widget sizes
- As a user, my dashboard layout persists across sessions

## Functional Requirements

### FR1: Dashboard Layout
**Priority:** P0 (Critical)

**Component:**
- `/components/dashboard/AdaptiveDashboard.tsx`

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Greeting + Date/Time                │
├──────────────────┬──────────────────┤
│ Today's Tasks    │ Habit Streaks    │
├──────────────────┼──────────────────┤
│ Quick Mood Log   │ Countdowns       │
├──────────────────┴──────────────────┤
│ Quick Notes                          │
├──────────────────────────────────────┤
│ Optional: Google Sheets, RSS, etc.  │
└──────────────────────────────────────┘
```

**Responsive:**
- Desktop: Multi-column grid
- Tablet: 2-column grid
- Mobile: Single column stack

### FR2: Personalized Greeting
**Priority:** P1 (High)

**Component:**
- `/components/dashboard/DashboardGreeting.tsx`

**Greeting Logic:**
```typescript
function getGreeting(hour: number, name: string): string {
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 18) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
}
```

**Additional Context:**
- Current date (formatted per user preference)
- Current time (12h or 24h based on user preference)
- Optional motivational message
- Streak celebrations ("You're on a 7-day habit streak!")

### FR3: Task Preview Widget
**Priority:** P0 (Critical)

**Component:**
- `/components/dashboard/ContextTaskList.tsx`

**Display:**
- Today's tasks (due today or overdue)
- Limit to 5-10 tasks
- Priority-sorted
- Quick complete checkbox
- Click to expand full task view

**Quick Actions:**
- Mark complete
- Open task detail
- "View all tasks" link

### FR4: Habit Progress Widget
**Priority:** P0 (Critical)

**Component:**
- `/components/dashboard/ContextHabits.tsx`

**Display:**
- Today's habits (not yet completed)
- Current streak for each
- Quick complete button
- Progress indicators

**Celebration:**
- Confetti on habit completion
- Streak milestone notifications
- Encouraging messages

### FR5: Countdown Widget
**Priority:** P1 (High)

**Component:**
- `/components/dashboard/CountdownWidget.tsx`

**Display:**
- Top 3 most urgent countdowns
- Time remaining prominently
- Urgency color coding
- Click to view all countdowns

### FR6: Quick Mood Logger
**Priority:** P1 (High)

**Component:**
- Quick mood logger widget

**Interface:**
- "How are you feeling?" prompt
- 1-10 mood scale buttons
- Optional: Energy and stress sliders
- One-click submit
- Recent mood history (mini chart)

### FR7: Quick Notes
**Priority:** P2 (Medium)

**Component:**
- Dashboard notes widget

**Functionality:**
- Free-form text area
- Auto-save
- Persistent across sessions
- Expand for full editor

**Use Cases:**
- Capture thoughts quickly
- To-do scratchpad
- Daily reminders to self

**Database:**
```sql
CREATE TABLE user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### FR8: Widget Customization
**Priority:** P2 (Medium)

**Component:**
- `/components/dashboard/DashboardCustomization.tsx`

**Features:**
- Drag-and-drop widget reordering
- Show/hide individual widgets
- Resize widgets (future)
- Reset to default layout

**Persistence:**
- localStorage per user
- JSONB preferences in database (future)

**Configuration:**
```typescript
interface DashboardConfig {
  widgets: Array<{
    id: string;
    type: WidgetType;
    visible: boolean;
    order: number;
    size?: 'small' | 'medium' | 'large';
  }>;
}
```

### FR9: Integration Widgets
**Priority:** P2 (Medium)

**Google Sheets Widget:**
- Display data from configured Google Sheet
- Auto-refresh
- Click to expand

**Spotify Now Playing:**
- Show currently playing track
- Playback controls
- Album art

**Weather Widget:**
- Current weather
- Forecast
- Location-based

**RSS Preview:**
- Latest items from feeds
- Unread count
- Click to full RSS pane

### FR10: Calendar Mini View
**Priority:** P2 (Medium)

**Component:**
- Mini calendar widget

**Display:**
- Current month
- Today highlighted
- Dots for events
- Click date to open calendar

**Quick Actions:**
- Create event for clicked date
- View agenda for clicked date

## Components

**Main Dashboard:**
- `/components/dashboard/AdaptiveDashboard.tsx`
- `/components/dashboard/DashboardGreeting.tsx`
- `/components/dashboard/DashboardCustomization.tsx`

**Widget Components:**
- `/components/dashboard/ContextTaskList.tsx`
- `/components/dashboard/ContextHabits.tsx`
- `/components/dashboard/CountdownWidget.tsx`
- `/components/dashboard/GoogleSheetsWidget.tsx`
- `/components/dashboard/SpotifyNowPlaying.tsx`
- `/components/dashboard/WeatherWidget.tsx`

## Hooks

**Data:**
- `/hooks/utils/useDashboardNotes.ts`
- Reuses existing hooks: `useTasks`, `useHabits`, `useCountdowns`, etc.

**UI State:**
- Dashboard customization state
- Widget visibility state

## Success Metrics

### Usage Metrics
- Dashboard as landing page percentage
- Average time on dashboard
- Quick actions taken from dashboard
- Widget interaction rates

### Engagement Metrics
- Habit completions from dashboard
- Task completions from dashboard
- Mood logs from dashboard
- Notes created/updated

### Customization Metrics
- Percentage of users who customize
- Average widgets shown
- Most hidden widgets
- Most used widgets

## Future Enhancements

### v1.1
- Widget marketplace (community widgets)
- Third-party integrations
- Custom widget creation
- Advanced layout grid system

### v1.2
- AI-powered widget suggestions
- Context-aware widget visibility
- Time-of-day adaptive layouts
- Dashboard themes

### v2.0
- Multiple saved dashboard layouts
- Dashboard sharing (templates)
- Collaborative dashboards
- Voice-controlled dashboard

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Task Management PRD](./02-task-management-prd.md)
- [Habit Tracking PRD](./03-habit-tracking-prd.md)
- [Mood Logging PRD](./04-mood-logging-prd.md)
- [Countdowns PRD](./07-countdowns-prd.md)

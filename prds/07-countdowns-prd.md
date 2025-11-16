# Countdowns - Product Requirements Document

**Feature Area:** Countdown Timers & Event Anticipation
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Countdowns system provides visual countdown timers to important events, helping ADHD users maintain awareness of upcoming deadlines and celebrations. Designed to combat time blindness through prominent visual indicators and urgency-based color coding.

## Problem Statement

ADHD users struggle with time perception:
- **Time blindness** - Events feel equally far away or equally urgent
- **Last-minute panic** - Deadlines sneak up unexpectedly
- **Lack of anticipation** - Positive events overlooked
- **Poor planning** - Don't prepare adequately for important dates

## Goals

1. Provide at-a-glance countdown to important events
2. Use urgency levels to guide attention and action
3. Integrate with tasks, concerts, and calendar events
4. Celebrate countdown completion
5. Support customization for personal preferences

## User Stories

- As a user, I can create countdowns to any date/time
- As a user, I can see time remaining in days/hours/minutes
- As a user, I can set urgency levels (normal/soon/urgent/critical)
- As a user, I can link countdowns to tasks, concerts, or events
- As a user, I can customize countdown colors
- As a user, I can view countdowns in grid or list view
- As a user, I receive visual cues as countdown approaches zero
- As a user, I can mark countdowns as complete or delete them

## Functional Requirements

### Data Model

```typescript
interface Countdown {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date: Date;
  urgency: 'normal' | 'soon' | 'urgent' | 'critical' | 'expired';
  color?: string; // Custom color override

  // Links
  task_id?: string;
  concert_id?: string;
  calendar_event_id?: string;

  created_at: Date;
  updated_at: Date;
}
```

### Urgency Calculation

**Auto-calculated based on time remaining:**
- **normal:** > 30 days away
- **soon:** 8-30 days away
- **urgent:** 2-7 days away
- **critical:** < 2 days away
- **expired:** Past target date

**Visual Indicators:**
- normal: Blue/default theme color
- soon: Yellow
- urgent: Orange
- critical: Red, pulsing animation
- expired: Gray, strikethrough

### Countdown Display

**Time Formatting:**
- > 1 year: "X years, Y months"
- > 30 days: "X months, Y days"
- > 1 day: "X days, Y hours"
- < 1 day: "X hours, Y minutes"
- < 1 hour: "X minutes, Y seconds"
- Expired: "Ended X days ago"

**Progress Bar:**
- Calculate percentage: `(now - created_at) / (target - created_at)`
- Visual bar fills as countdown approaches
- Color based on urgency level

### Views

**Grid View:**
- Component: `CountdownGrid.tsx`
- Card-based layout
- Large countdown numbers
- Progress bar
- Quick actions (edit, delete, complete)

**List View:**
- Compact rows
- Sortable by date, urgency, title
- Inline editing

**Widget View:**
- Compact for dashboard
- Show top 3 most urgent
- Click to expand

## Database Schema

```sql
CREATE TABLE countdowns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  urgency countdown_urgency DEFAULT 'normal',
  color TEXT,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  concert_id UUID REFERENCES concerts(id) ON DELETE SET NULL,
  calendar_event_id UUID REFERENCES calendar_events(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_countdowns_user ON countdowns(user_id);
CREATE INDEX idx_countdowns_target_date ON countdowns(user_id, target_date);
CREATE INDEX idx_countdowns_urgency ON countdowns(user_id, urgency);
```

## Components

- `/components/countdowns/CountdownCard.tsx`
- `/components/countdowns/CountdownGrid.tsx`
- `/components/countdowns/CountdownHeader.tsx`
- Dashboard countdown widgets

## Hooks

- `/hooks/analytics/useCountdowns.ts`
- `/hooks/analytics/useCountdownTimers.ts` - Real-time updates
- `/hooks/analytics/useCountdownExpiration.ts`

## Success Metrics

- Countdowns created per user
- Urgency distribution
- Calendar integration usage
- Countdown completion rate

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Calendar PRD](./06-calendar-prd.md)
- [Concerts PRD](./08-concerts-prd.md)

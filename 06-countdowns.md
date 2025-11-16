# PRD: Countdowns & Event Tracking

## Product Overview

The Countdowns feature provides visual countdown timers for important upcoming events, with automatic urgency calculation and color-coded displays. It helps users with time blindness see exactly how far away events are in days/hours/minutes.

## Problem Statement

Users with ADHD experience:
- **Time Blindness**: "Next week" and "3 months" feel equally distant
- **Deadline Surprise**: Events suddenly feel urgent despite advance notice
- **Preparation Anxiety**: Not knowing when to start preparing
- **Visual Time Needs**: Need to SEE time passing, not just know intellectually

## Core Features

### 1. Countdown Creation

**User Stories**:
- As a user, I want to create countdowns for important dates
- As a user, I want to link countdowns to calendar events/tasks/concerts
- As a user, I want to set custom colors for visual organization
- As a user, I want optional descriptions

**Fields**:
- `title`: Countdown name (e.g., "Trip to Hawaii")
- `description`: Optional details
- `target_date`: When event occurs
- `urgency`: Auto-calculated or manual
- `color`: Hex color code
- `calendar_event_id` / `task_id` / `concert_id`: Optional links

### 2. Time Remaining Display

**User Stories**:
- As a user, I want to see exact time remaining in days/hours/minutes
- As a user, I want multiple display formats
- As a user, I want friendly wording ("in 3 days" vs "72 hours")

**Display Formats**:
- **Long**: "3 days, 5 hours, 23 minutes"
- **Compact**: "3d 5h"
- **Single Unit**: "3 days" (rounds to largest unit)
- **Percentage**: Progress bar showing time passed

### 3. Urgency Auto-Calculation

**User Stories**:
- As a user, I want countdown color to change as event approaches
- As a user, I want visual urgency without managing it manually

**Urgency Levels** (from `countdown-utils.ts`):
```typescript
enum Urgency {
  normal = 'normal',    // >30 days away (green/blue)
  soon = 'soon',        // 15-30 days (yellow)
  urgent = 'urgent',    // 7-14 days (orange)
  critical = 'critical', // <7 days (red)
  expired = 'expired'   // past target_date (gray)
}
```

**Auto-Calculation**:
```typescript
function calculateUrgency(targetDate: Date): Urgency {
  const daysRemaining = differenceInDays(targetDate, now())
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining < 7) return 'critical'
  if (daysRemaining < 15) return 'urgent'
  if (daysRemaining < 30) return 'soon'
  return 'normal'
}
```

### 4. Grid View Display

**User Stories**:
- As a user, I want to see all countdowns in a grid
- As a user, I want countdowns sorted by urgency
- As a user, I want visual color coding

**Component**: `CountdownGrid.tsx`

**Layout**:
- Responsive grid (1-4 columns depending on screen size)
- Cards color-coded by urgency
- Sorted: Critical → Urgent → Soon → Normal → Expired

### 5. Countdown Card

**User Stories**:
- As a user, I want each countdown as a distinct card
- As a user, I want to see title, time remaining, urgency at a glance
- As a user, I want to edit/delete from card

**Component**: `CountdownCard.tsx`

**Card Elements**:
- Title (large text)
- Time remaining (very large, bold)
- Progress bar
- Urgency badge
- Edit/delete buttons (on hover)
- Link icon (if linked to task/concert/event)

### 6. Integration with Other Features

**User Stories**:
- As a user, I want task deadlines to auto-create countdowns
- As a user, I want concert dates to auto-create countdowns
- As a user, I want calendar events to optionally create countdowns

**Technical Implementation**:
- Foreign keys: `calendar_event_id`, `task_id`, `concert_id`
- Auto-create: Optional toggle in task/concert/event forms
- Bidirectional: Clicking countdown navigates to linked item

### 7. Preparation Checklist (Future)

**User Stories**:
- As a user, I want checklists for countdown preparation
- As a user, I want items like "Book flight", "Pack bags"
- As a user, I want preparation progress percentage

## User Workflows

### Workflow 1: Creating a Countdown
1. User opens countdowns pane
2. User clicks "+ New Countdown"
3. User enters title: "Vacation to Hawaii"
4. User selects target date: August 15, 2024
5. User chooses color: Blue
6. System calculates: 45 days away (normal urgency)
7. Countdown appears in grid

### Workflow 2: Countdown Becomes Urgent
1. User created countdown 30 days ago
2. Time passes automatically
3. When 14 days remain: Urgency changes to "urgent" (orange)
4. When 6 days remain: Urgency changes to "critical" (red)
5. User sees visual change, feels motivated to prepare
6. When date passes: Urgency changes to "expired" (gray)

### Workflow 3: Linking Countdown to Concert
1. User creates concert entry for "Taylor Swift Concert"
2. User enables "Create countdown" checkbox
3. System auto-creates countdown with concert date
4. Countdown card shows concert icon
5. Clicking countdown opens concert details

## Technical Architecture

### Database Schema
```sql
CREATE TYPE countdown_urgency AS ENUM (
  'normal', 'soon', 'urgent', 'critical', 'expired'
)

CREATE TABLE countdowns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE NOT NULL,
  urgency countdown_urgency DEFAULT 'normal',
  is_active BOOLEAN DEFAULT TRUE,
  color TEXT DEFAULT '#6366f1',
  calendar_event_id UUID REFERENCES calendar_events(id),
  task_id UUID REFERENCES tasks(id),
  concert_id UUID REFERENCES concerts(id)
)
```

### Key Utilities (`lib/countdown-utils.ts`)
- `calculateTimeLeft(targetDate)`: Returns { days, hours, minutes, seconds }
- `formatTimeLeft(timeLeft, format)`: Human-readable formatting
- `getUrgencyColor(urgency)`: Map urgency to CSS color
- `calculateUrgency(targetDate)`: Auto-urgency determination
- `sortCountdownsByUrgency(countdowns)`: Priority sorting

### Component Hierarchy
```
CountdownsContentOrchestrator
├── CountdownHeader (add button, view controls)
├── CountdownGrid
│   └── CountdownCard[] (individual countdowns)
│       ├── Title
│       ├── TimeRemaining (large display)
│       ├── ProgressBar
│       ├── UrgencyBadge
│       └── ActionButtons
└── CountdownModal (create/edit dialog)
```

## ADHD-Friendly Design

### 1. Visual Time
- Giant numbers for time remaining
- Progress bar shows visual completion
- Color changes provide urgency cues

### 2. Automatic Urgency
- No manual urgency management
- System handles color transitions
- User sees change without action

### 3. Always Visible
- Countdowns in dedicated pane
- Optional widget for dashboard
- Persistent visibility

### 4. Celebration
- "Today is the day!" when countdown reaches zero
- Confetti animation on target date
- Archive prompt after event passes

## Performance Considerations

- **Real-time Updates**: Update countdown every minute (not every second to reduce renders)
- **Calculation Caching**: Memoize time calculations
- **Urgency Batching**: Recalculate urgency daily, not on every render

## Future Enhancements

1. **Preparation Checklist**: Tasks associated with countdown
2. **Notifications**: Push notifications at urgency changes
3. **Countdown Sharing**: Share countdowns with friends/family
4. **Recurring Countdowns**: Birthdays, anniversaries
5. **Countdown Groups**: Group related countdowns (trip planning)
6. **Historical Countdowns**: Archive of past events
7. **Countdown Templates**: Pre-made countdown types
8. **Budget Tracking**: Track expenses toward event
9. **Widget Customization**: Different size/style options
10. **Voice Announcements**: "3 days until vacation!"

## Success Criteria

1. ✅ Countdown CRUD operations functional
2. ✅ Auto-urgency calculation working
3. ✅ Color-coded display by urgency
4. ✅ Time remaining accurate and formatted
5. ✅ Grid layout responsive
6. ✅ Links to tasks/concerts/events working
7. ✅ Real-time countdown updates
8. ✅ Mobile-responsive cards

## References

- File: `components/panes/content/CountdownsContentOrchestrator.tsx`
- File: `components/countdowns/CountdownCard.tsx`
- File: `components/countdowns/CountdownGrid.tsx`
- Utility: `lib/countdown-utils.ts`
- Schema: `supabase/schema.sql:380-409`

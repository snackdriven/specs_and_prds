# Calendar & Events - Product Requirements Document

**Feature Area:** Calendar Management & Google Calendar Integration
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Calendar system provides a unified view of all time-based information (tasks, habits, journal entries, concerts, countdowns) with deep Google Calendar integration. Designed to combat time blindness and provide comprehensive schedule visibility for ADHD users.

## Problem Statement

ADHD users struggle with time management because:
- **Time blindness** - Difficulty estimating time and seeing time visually
- **Context switching** - Multiple calendars = fragmented attention
- **Forgetting commitments** - Out of sight = out of mind
- **Overwhelm** - Too much information causes shutdown
- **Sync issues** - Manual calendar updates are forgotten

## Goals

### Primary Goals
1. Provide single unified calendar view for all time-based data
2. Support multiple viewing modes for different mental states
3. Enable effortless Google Calendar bi-directional sync
4. Combat time blindness through visual time representation
5. Integrate seamlessly with tasks, habits, and other EDC features

### Secondary Goals
1. Support drag-and-drop scheduling
2. Handle recurring events intelligently
3. Provide conflict detection
4. Enable CSV import for bulk events
5. Export calendar data

## User Stories

### Epic: Basic Calendar Viewing
- As a user, I can view my calendar in day/week/month views
- As a user, I can navigate between dates easily
- As a user, I can see tasks with due dates on calendar
- As a user, I can see habit completions on calendar
- As a user, I can see journal entries on calendar
- As a user, I can toggle which types of items show on calendar

### Epic: Event Management
- As a user, I can create calendar events
- As a user, I can edit existing events
- As a user, I can delete events
- As a user, I can set recurring events
- As a user, I can drag events to reschedule
- As a user, I can add all-day events

### Epic: Google Calendar Integration
- As a user, I can connect my Google Calendar
- As a user, I can choose sync direction (to Google, from Google, both)
- As a user, I can select which calendars to sync
- As a user, I can see Google events in EDC calendar
- As a user, I can create EDC events that appear in Google Calendar
- As a user, I can set sync interval

### Epic: Multiple Views
- As a user, I can view calendar by day
- As a user, I can view calendar by week
- As a user, I can view calendar by month
- As a user, I can view calendar in agenda mode (list)
- As a user, I can view 3-day or 2-week periods
- As a user, I can view work week (Mon-Fri)

### Epic: Time Conflict Management
- As a user, I receive warnings for overlapping events
- As a user, I can choose conflict resolution strategy
- As a user, I can see buffer time between events
- As a user, I can batch reschedule conflicting events

### Epic: Advanced Features
- As a user, I can import events from CSV
- As a user, I can export calendar to CSV or iCal
- As a user, I can color-code events by type or category
- As a user, I can search events
- As a user, I can set reminders (future)

## Functional Requirements

### FR1: Calendar Event CRUD
**Priority:** P0 (Critical)

**Create Event:**
```typescript
interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: Date;
  end_time: Date;
  all_day: boolean;
  location?: string;
  recurrence_rule?: string; // iCal RRULE format

  // Links to other features
  task_id?: string;
  habit_id?: string;
  concert_id?: string;
  countdown_id?: string;

  // Google Calendar integration
  google_event_id?: string; // If synced from Google
  google_calendar_id?: string; // Which Google calendar

  // Metadata
  color?: string;
  category?: string;
  reminder_minutes?: number[]; // [15, 60] = 15min and 1hr before

  created_at: Date;
  updated_at: Date;
}
```

**Event Types:**
1. **Standalone events** - Created directly in calendar
2. **Task events** - Linked to tasks (due dates)
3. **Habit events** - Linked to habit completions
4. **Concert events** - Linked to concerts
5. **Countdown events** - Linked to countdowns
6. **Google events** - Synced from Google Calendar

**Read Events:**
- Fetch by date range (visible range + buffer)
- Filter by event type
- Include linked entity data
- Expand recurring events within range

**Update Event:**
- Edit any field
- Handle recurring event updates (this only, all future, all)
- Sync changes to Google (if applicable)
- Update linked entities (e.g., task due date)

**Delete Event:**
- Hard delete from database
- Handle recurring event deletion (this only, all)
- Sync deletion to Google (if applicable)
- Optionally preserve linked entity

### FR2: Multiple Calendar Views
**Priority:** P0 (Critical)

**Supported Views:**
1. **Day View** - Single day, hourly grid
2. **Week View** - 7 days, hourly grid
3. **Month View** - Full month, daily cells
4. **Agenda View** - List format, chronological
5. **3-Day View** - Today + 2 days ahead
6. **2-Week View** - 14 days
7. **Work Week View** - Monday-Friday only

**View Components:**
- `/components/calendar/CalendarDayView.tsx`
- `/components/calendar/CalendarAgendaView.tsx`
- `/components/calendar/CalendarDayRenderer.tsx` (custom rendering)

**View Persistence:**
- Stored in `profiles.default_calendar_view`
- Per-pane override in localStorage
- Quick view switcher

**View Features:**
- Grid layout with time slots
- Event cards with truncated titles
- Click to expand/edit
- Drag-and-drop to reschedule
- Color-coding by type/category

### FR3: Google Calendar Integration
**Priority:** P1 (High)

**OAuth Flow:**
- Component: `/components/settings/GoogleCalendarSync.tsx`
- Use Google OAuth 2.0
- Request calendar read/write scopes
- Store tokens in `google_calendar_sync_settings` table

**Sync Configuration:**
```typescript
interface GoogleCalendarSyncSettings {
  id: string;
  user_id: string;
  access_token: string; // Encrypted
  refresh_token: string; // Encrypted
  token_expiry: Date;

  sync_direction: 'to-google' | 'from-google' | 'both';
  sync_interval_minutes: number; // Default 15
  last_sync_at?: Date;

  selected_calendars: string[]; // Google calendar IDs to sync
  conflict_resolution: 'edc-wins' | 'google-wins' | 'manual';

  created_at: Date;
  updated_at: Date;
}
```

**Sync Directions:**
- **to-google:** EDC events → Google Calendar (one-way)
- **from-google:** Google Calendar → EDC (one-way)
- **both:** Bi-directional sync (most complex)

**Sync Process:**
1. Fetch events from Google since last sync
2. Fetch events from EDC since last sync
3. Identify conflicts (same event modified both sides)
4. Apply conflict resolution strategy
5. Push changes to Google (if applicable)
6. Pull changes from Google (if applicable)
7. Update `last_sync_at` timestamp

**Conflict Resolution:**
- **edc-wins:** EDC version always kept
- **google-wins:** Google version always kept
- **manual:** Prompt user to choose (future)

**Implementation:**
- `/lib/calendar/` - Google Calendar API integration
- `/hooks/calendar/useGoogleCalendar.ts` - API wrapper
- `/hooks/calendar/useGoogleCalendarSync.ts` - Sync management

**Database:**
```sql
CREATE TABLE google_calendar_sync_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP WITH TIME ZONE,
  sync_direction TEXT CHECK (sync_direction IN ('to-google', 'from-google', 'both')) DEFAULT 'both',
  sync_interval_minutes INTEGER DEFAULT 15,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  selected_calendars JSONB DEFAULT '[]',
  conflict_resolution TEXT DEFAULT 'edc-wins',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### FR4: Recurring Events
**Priority:** P1 (High)

**Recurrence Rule Format:**
Use iCalendar RRULE standard:
```
FREQ=WEEKLY;BYDAY=MO,WE,FR
FREQ=DAILY;INTERVAL=2
FREQ=MONTHLY;BYMONTHDAY=15
FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25
```

**Recurrence Editor:**
- Simple mode: Daily, Weekly, Monthly, Yearly presets
- Advanced mode: Custom RRULE builder
- End conditions: Never, After N occurrences, By date

**Recurrence Expansion:**
- Expand recurring events within visible range
- Virtual instances (not stored individually)
- Edit single instance: Create exception
- Edit all future: Update RRULE + delete past exceptions
- Edit all: Update RRULE + delete all exceptions

**Exception Handling:**
- Store modified instances separately
- Reference parent recurring event
- Mark as exception in database

### FR5: Drag-and-Drop Scheduling
**Priority:** P1 (High)

**Capabilities:**
- Drag event to different time slot
- Drag event to different day
- Resize event (drag bottom edge to change duration)
- Drag from task list to calendar (create event from task)
- Drag from habit tracker to calendar (schedule habit)

**Visual Feedback:**
- Ghost image while dragging
- Target time slot highlighted
- Snap to grid (15-minute increments default)
- Show new time in tooltip

**Constraints:**
- Prevent overlapping events (optional warning)
- Respect min/max duration
- All-day events can't be dragged to time slots

**Implementation:**
- Native HTML5 drag-and-drop
- Or library like `react-beautiful-dnd`, `@dnd-kit`
- Update event times on drop
- Sync to Google if applicable

### FR6: Event Import/Export
**Priority:** P2 (Medium)

**CSV Import:**
- Component: Event importer modal
- Upload CSV file
- Map columns (title, start, end, description, location)
- Preview import
- Bulk create events
- Hook: `/hooks/calendar/useEventImporter.ts`

**CSV Format:**
```csv
Title,Start Date,Start Time,End Date,End Time,Description,Location,All Day
Meeting,2024-01-15,09:00,2024-01-15,10:00,Team standup,Conference Room,false
Birthday,2024-02-10,,,,,true
```

**iCal Export:**
- Export all events as .ics file
- Compatible with Google Calendar, Outlook, Apple Calendar
- Include recurrence rules
- Include linked entity references in description

**CSV Export:**
- Export events as CSV
- For reporting or backup
- Include all fields

### FR7: Time Conflict Detection
**Priority:** P2 (Medium)

**Conflict Types:**
- Hard conflict: Events overlap completely
- Soft conflict: No buffer time between events
- Travel time conflict: Events at different locations without travel buffer

**Detection:**
- Check on event create
- Check on event update
- Check on drag-and-drop
- Real-time as user adjusts times

**Resolution:**
- Warning modal showing conflicts
- Suggest alternative times
- Option to proceed anyway
- Batch reschedule option

### FR8: Feature Integration
**Priority:** P1 (High)

**Tasks Integration:**
- Tasks with due dates appear on calendar
- Color-coded as task events
- Click to open task modal
- Drag to reschedule task due date
- Complete task from calendar

**Habits Integration:**
- Habit completions appear on calendar
- Habit scheduled times (future)
- Click to mark complete
- Visualize habit patterns

**Journal Integration:**
- Journal entries appear on calendar
- Click to view/edit entry
- Visualize journaling frequency

**Concerts Integration:**
- Concerts appear on calendar
- Color-coded by status
- Click to view concert details
- See show time, door time

**Countdowns Integration:**
- Countdown target dates on calendar
- Urgency-based color coding
- Click to view countdown

## Database Schema

```sql
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,
  recurrence_rule TEXT, -- iCal RRULE format

  -- Links
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  concert_id UUID REFERENCES concerts(id) ON DELETE SET NULL,
  countdown_id UUID REFERENCES countdowns(id) ON DELETE SET NULL,

  -- Google integration
  google_event_id TEXT,
  google_calendar_id TEXT,

  -- Metadata
  color TEXT,
  category TEXT,
  reminder_minutes JSONB, -- Array of integers

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_time_range ON calendar_events(user_id, start_time, end_time);
CREATE INDEX idx_calendar_events_task ON calendar_events(task_id);
CREATE INDEX idx_calendar_events_google ON calendar_events(google_event_id);
```

## Components

**Main Views:**
- `/components/calendar/CalendarContentOrchestrator.tsx` - Main pane orchestrator
- `/components/calendar/CalendarAgendaView.tsx` - Agenda view
- `/components/calendar/CalendarDayView.tsx` - Day view
- `/components/calendar/CalendarDayRenderer.tsx` - Custom rendering

**Modals:**
- `/components/calendar/CalendarEventModalOrchestrator.tsx` - Create/edit events
- `/components/calendar/AllEventsModal.tsx` - Event list

**Settings:**
- `/components/settings/GoogleCalendarSync.tsx` - Sync configuration

## Hooks

**Data Management:**
- `/hooks/calendar/useCalendarEvents.ts` - Event CRUD
- `/hooks/calendar/useGoogleCalendar.ts` - Google Calendar API
- `/hooks/calendar/useGoogleCalendarSync.ts` - Sync management
- `/hooks/calendar/useEventImporter.ts` - CSV import

**UI State:**
- `/hooks/calendar/useCalendarNavigation.ts` - Date navigation
- `/hooks/calendar/useCalendarViewState.ts` - View preferences

## Success Metrics

### Usage Metrics
- Events created per user per week
- Google Calendar sync adoption rate
- Calendar view distribution
- Drag-and-drop usage frequency

### Integration Metrics
- Task→Calendar event conversion rate
- Habit calendar view usage
- Journal calendar view usage

### Sync Metrics
- Sync success rate
- Conflict occurrence rate
- Average sync latency

## Future Enhancements

### v1.1
- Reminders/notifications
- Multiple calendar support (work/personal)
- Calendar sharing (view-only)
- Weather integration on calendar

### v1.2
- Travel time calculation (Google Maps API)
- Smart scheduling suggestions
- Focus time blocking
- Calendar analytics

### v2.0
- AI scheduling assistant
- Meeting transcription integration
- Video call links auto-generated
- Calendar collaboration

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Task Management PRD](./02-task-management-prd.md) - Task integration
- [Habit Tracking PRD](./03-habit-tracking-prd.md) - Habit integration
- [Concerts PRD](./08-concerts-prd.md) - Concert integration

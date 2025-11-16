# Calendar System - Technical Specification

## 1. Complete Feature Specification

### 1.1 Calendar Views

**Included Views:**
- **Month View** (default) - Full month grid, 6 weeks visible
- **Week View** - 7-day column layout with hourly slots
- **Day View** - Single day, 30-minute time slots
- **Agenda View** - List of upcoming events, grouped by day

**Not included (defer to V2):**
- 3-day view (unnecessary complexity)
- Workweek view (covered by week + weekend hiding toggle)
- Year view (low utility for ADHD user - too zoomed out)
- 2-week view (awkward middle ground)

**View Switcher UI:**
```
┌─────────────────────────────────────────┐
│ [Month] [Week] [Day] [Agenda]  [Today]  │
│ < April 2025 >                   ⚙️     │
└─────────────────────────────────────────┘
```
- Horizontal button group (not dropdown - fewer clicks)
- Keyboard shortcuts: M/W/D/A
- "Today" button always visible (returns to current date)
- Settings gear for sync options

**Information Displayed by View:**

**Month View:**
```
Each day cell shows:
- Day number (large)
- Up to 3 events (truncated titles)
- "+2 more" indicator if >3 events
- Dot indicators for event types:
  • Blue dot = calendar event
  • Orange dot = task deadline
  • Purple dot = countdown
  • Red dot = urgent/overdue
```

**Week View:**
```
7 columns × hourly rows (6am-10pm default, scrollable)
- Event blocks with time + title
- All-day events in header row
- Half-height blocks for 30min events
- Color coding by space
- Click to view, drag to reschedule
```

**Day View:**
```
Single column, 30-minute slots
- Full event details visible (title, time, location)
- Task list sidebar showing today's tasks
- Weather widget at top
- Spotify widget at bottom
```

**Agenda View:**
```
Scrolling list grouped by date:

TODAY - April 15
  9:00 AM  Team Standup (Work)
  2:00 PM  Dentist Appointment

TOMORROW - April 16
  (No events)

THURSDAY - April 17
  10:00 AM  Project Deadline (Task)
  7:00 PM  Concert: The National
```

---

### 1.2 Google Calendar Sync

#### A. OAuth Flow

**Step-by-Step Process:**

```typescript
// Step 1: User clicks "Connect Google Calendar"
// Frontend redirects to:
const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?
  client_id=${GOOGLE_CLIENT_ID}
  &redirect_uri=${APP_URL}/auth/google/callback
  &response_type=code
  &scope=https://www.googleapis.com/auth/calendar.events
  &access_type=offline
  &prompt=consent`

// Step 2: User authorizes in Google popup
// Google redirects to: /auth/google/callback?code=AUTH_CODE

// Step 3: Backend exchanges code for tokens
POST https://oauth2.googleapis.com/token
{
  "code": "AUTH_CODE",
  "client_id": "...",
  "client_secret": "...",
  "redirect_uri": "...",
  "grant_type": "authorization_code"
}

// Response:
{
  "access_token": "ya29...",
  "refresh_token": "1//...",
  "expires_in": 3600,
  "token_type": "Bearer"
}

// Step 4: Store tokens in database
// Step 5: Fetch calendar list and perform initial sync
// Step 6: Redirect to settings page showing "Connected ✓"
```

**Token Refresh Strategy:**
```typescript
// Before every Google API call:
async function getValidAccessToken() {
  const tokens = await db.googleTokens.findOne({ userId })

  if (tokens.expiresAt > Date.now()) {
    return tokens.accessToken
  }

  // Token expired, refresh it
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: tokens.refreshToken,
      grant_type: 'refresh_token'
    })
  })

  const { access_token, expires_in } = await response.json()

  await db.googleTokens.update({
    accessToken: access_token,
    expiresAt: Date.now() + (expires_in * 1000)
  })

  return access_token
}
```

#### B. Sync Modes

**Default: Bidirectional**

**Three modes available in settings:**

1. **EDC → Google Only** (Push)
   - Events created in EDC sync to Google
   - Changes in Google ignored
   - Use case: User wants Google as backup only

2. **Google → EDC Only** (Pull)
   - Events from Google appear in EDC
   - EDC events don't go to Google
   - Use case: User manages calendar elsewhere, wants read-only view

3. **Bidirectional** (default)
   - Changes sync both ways
   - Most common use case

**Sync Mode UI:**
```
┌──────────────────────────────────────┐
│ Google Calendar Sync                 │
│                                      │
│ ○ Push Only (EDC → Google)          │
│ ● Bidirectional (Both Ways) ✓       │
│ ○ Pull Only (Google → EDC)          │
│                                      │
│ [Disconnect Google Calendar]         │
└──────────────────────────────────────┘
```

#### C. Conflict Resolution

**When same event edited in both places:**

```typescript
interface SyncConflict {
  eventId: string
  edcVersion: CalendarEvent
  googleVersion: CalendarEvent
  lastSyncedAt: Date
}

// Resolution Strategy: Last-Write-Wins with notification
async function resolveConflict(conflict: SyncConflict) {
  const edcModified = conflict.edcVersion.updatedAt
  const googleModified = new Date(conflict.googleVersion.updated)

  if (googleModified > edcModified) {
    // Google version is newer
    await db.calendarEvents.update(conflict.eventId, conflict.googleVersion)
    await notifyUser({
      type: 'info',
      message: `"${conflict.edcVersion.title}" was updated in Google Calendar`,
      action: 'View Event'
    })
    return 'google'
  } else {
    // EDC version is newer
    await googleCalendar.events.update({
      calendarId: 'primary',
      eventId: conflict.googleVersion.id,
      resource: mapEDCToGoogle(conflict.edcVersion)
    })
    return 'edc'
  }
}
```

**Edge Cases:**
- Event deleted in one system while edited in other → Deletion wins (safer)
- Event moved to different calendar in Google → Update EDC calendar_id
- Recurring event edited (single vs all) → Respect Google's recurrence rules

#### D. Sync Frequency

**Hybrid approach:**

1. **Real-time for EDC changes** (immediate push to Google)
   ```typescript
   // When user creates/edits event in EDC:
   await db.calendarEvents.save(event)
   await syncToGoogleImmediate(event) // Don't wait
   ```

2. **Polling for Google changes** (every 15 minutes)
   ```typescript
   // Cron job every 15 min
   async function syncFromGoogle() {
     const lastSync = await getLastSyncTime()
     const events = await googleCalendar.events.list({
       calendarId: 'primary',
       updatedMin: lastSync.toISOString(),
       showDeleted: true
     })

     for (const event of events.items) {
       await syncGoogleEventToEDC(event)
     }
   }
   ```

3. **Webhook for Google changes** (V2 - requires domain verification)
   - Google Calendar Push Notifications API
   - Instant sync when Google calendar changes
   - Defer to V2 to avoid complexity

**Manual Sync:**
- Button in settings: "Sync Now"
- Shows last sync time: "Last synced: 2 minutes ago"

#### E. Multiple Calendars

**MVP: Primary calendar only**

Settings UI:
```
┌──────────────────────────────────────┐
│ Google Calendar: ✓ Connected         │
│                                      │
│ Syncing: My Primary Calendar         │
│                                      │
│ [Sync Now]  Last synced: 5 min ago   │
└──────────────────────────────────────┘
```

**V2: Multiple calendars**
```
┌──────────────────────────────────────┐
│ Google Calendars                     │
│                                      │
│ ☑ Personal (primary)                 │
│ ☑ Work                               │
│ ☐ Birthdays (read-only)              │
│ ☐ Holidays                           │
│                                      │
│ [+ Add Calendar]                     │
└──────────────────────────────────────┘
```

#### F. Event Mapping

**EDC Event → Google Event:**

```typescript
function mapEDCToGoogle(event: CalendarEvent): GoogleCalendarEvent {
  return {
    summary: event.title,
    description: event.description || '',
    start: {
      dateTime: event.startTime.toISOString(),
      timeZone: 'America/New_York' // User's timezone from settings
    },
    end: {
      dateTime: event.endTime.toISOString(),
      timeZone: 'America/New_York'
    },
    location: event.location || '',
    colorId: mapSpaceToGoogleColor(event.spaceId),
    extendedProperties: {
      private: {
        edc_event_id: event.id,
        edc_event_type: event.eventType, // 'calendar' | 'task' | 'countdown'
        edc_space_id: event.spaceId
      }
    },
    recurrence: event.recurrence ? [
      `RRULE:FREQ=${event.recurrence.frequency};INTERVAL=${event.recurrence.interval}`
    ] : undefined
  }
}

// Color mapping (Google has 11 colors)
function mapSpaceToGoogleColor(spaceId: string): string {
  const colorMap = {
    'work': '1',      // Lavender
    'personal': '2',  // Sage
    'health': '3',    // Grape
    'finance': '4',   // Flamingo
    // ...
  }
  return colorMap[spaceId] || '0' // Default blue
}
```

**Google Event → EDC Event:**

```typescript
function mapGoogleToEDC(gEvent: GoogleCalendarEvent): CalendarEvent {
  const edcEventId = gEvent.extendedProperties?.private?.edc_event_id

  return {
    id: edcEventId || generateUUID(),
    googleEventId: gEvent.id,
    title: gEvent.summary,
    description: gEvent.description,
    startTime: new Date(gEvent.start.dateTime || gEvent.start.date),
    endTime: new Date(gEvent.end.dateTime || gEvent.end.date),
    location: gEvent.location,
    isAllDay: !!gEvent.start.date, // date vs dateTime
    spaceId: gEvent.extendedProperties?.private?.edc_space_id || 'personal',
    eventType: gEvent.extendedProperties?.private?.edc_event_type || 'calendar',
    googleCalendarId: 'primary',
    recurrence: parseGoogleRecurrence(gEvent.recurrence)
  }
}
```

---

### 1.3 Task-Calendar Integration

#### A. Auto-Sync Rules

**When task has due date:**

```typescript
// On task creation/update:
async function handleTaskWithDueDate(task: Task) {
  if (!task.dueDate) {
    // No due date - remove calendar event if exists
    if (task.calendarEventId) {
      await db.calendarEvents.delete(task.calendarEventId)
      await googleCalendar.events.delete({ eventId: task.googleEventId })
    }
    return
  }

  // Task has due date - create/update calendar event
  const calendarEvent = {
    id: task.calendarEventId || generateUUID(),
    title: `⏰ ${task.title}`, // Prefix to distinguish from regular events
    description: task.description,
    startTime: getDueDateTime(task.dueDate, task.dueTime),
    endTime: addMinutes(getDueDateTime(task.dueDate, task.dueTime), 30), // 30min default
    eventType: 'task' as const,
    taskId: task.id,
    spaceId: task.spaceId,
    color: '#FF6B35' // Orange for task deadlines
  }

  if (task.calendarEventId) {
    await db.calendarEvents.update(task.calendarEventId, calendarEvent)
  } else {
    await db.calendarEvents.create(calendarEvent)
    await db.tasks.update(task.id, { calendarEventId: calendarEvent.id })
  }

  // Sync to Google if enabled
  if (userSettings.googleCalendarSync) {
    await syncToGoogle(calendarEvent)
  }
}

function getDueDateTime(dueDate: Date, dueTime?: string): Date {
  if (dueTime) {
    // User specified time: "2:30 PM"
    const [hours, minutes] = parseTime(dueTime)
    const dateTime = new Date(dueDate)
    dateTime.setHours(hours, minutes, 0, 0)
    return dateTime
  } else {
    // No time specified - default to 9 AM
    const dateTime = new Date(dueDate)
    dateTime.setHours(9, 0, 0, 0)
    return dateTime
  }
}
```

**User Control:**

Settings toggle:
```
┌────────────────────────────────────────┐
│ Task Deadlines on Calendar             │
│                                        │
│ ☑ Show task due dates on calendar     │
│                                        │
│ Default time for tasks:                │
│ [09:00 AM ▾]                          │
│                                        │
│ Duration: [30 minutes ▾]              │
└────────────────────────────────────────┘
```

#### B. Update Propagation

**Bidirectional sync:**

```typescript
// Task due date changed → Update calendar event
taskEventEmitter.on('task:updated', async (task, changes) => {
  if ('dueDate' in changes || 'dueTime' in changes) {
    await handleTaskWithDueDate(task)
  }
})

// Calendar event moved → Update task due date (if it's a task event)
calendarEventEmitter.on('event:updated', async (event, changes) => {
  if (event.eventType === 'task' && event.taskId) {
    if ('startTime' in changes) {
      await db.tasks.update(event.taskId, {
        dueDate: event.startTime,
        dueTime: formatTime(event.startTime) // "2:30 PM"
      })

      await notifyUser({
        type: 'info',
        message: `Task "${event.title}" due date updated`,
        action: 'View Task'
      })
    }
  }
})
```

#### C. Deletion Handling

**Task deleted:**
```typescript
taskEventEmitter.on('task:deleted', async (task) => {
  if (task.calendarEventId) {
    await db.calendarEvents.delete(task.calendarEventId)
    if (task.googleEventId) {
      await googleCalendar.events.delete({ eventId: task.googleEventId })
    }
  }
})
```

**Calendar event deleted (that's linked to task):**
```typescript
calendarEventEmitter.on('event:deleted', async (event) => {
  if (event.eventType === 'task' && event.taskId) {
    // Show confirmation before deleting task
    const confirmed = await confirmDialog({
      title: 'Delete Task?',
      message: `This calendar event is linked to task "${event.title}". Delete the task too?`,
      confirmText: 'Delete Task',
      cancelText: 'Keep Task, Remove from Calendar'
    })

    if (confirmed) {
      await db.tasks.delete(event.taskId)
    } else {
      await db.tasks.update(event.taskId, {
        calendarEventId: null,
        dueDate: null,
        dueTime: null
      })
    }
  }
})
```

#### D. Visual Distinction

**Calendar View Styling:**

```css
/* Regular calendar events */
.calendar-event {
  background: var(--space-color);
  border-left: 3px solid var(--space-color-dark);
}

/* Task deadline events */
.calendar-event[data-type="task"] {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%);
  border-left: 3px solid #D45428;
  font-style: italic;
}

.calendar-event[data-type="task"]::before {
  content: "⏰ ";
}

/* Countdown events */
.calendar-event[data-type="countdown"] {
  background: linear-gradient(135deg, #9B5DE5 0%, #B589F5 100%);
  border-left: 3px solid #7A3FBF;
}

.calendar-event[data-type="countdown"]::before {
  content: "🎯 ";
}
```

**Legend in calendar header:**
```
┌────────────────────────────────────┐
│ ⏰ Tasks  🎯 Countdowns  📅 Events │
└────────────────────────────────────┘
```

---

### 1.4 Event Creation

#### A. Quick Add (Natural Language)

**Input box at top of calendar:**

```
┌──────────────────────────────────────────┐
│ Quick Add: Dentist tomorrow at 2pm       │
│            ^                              │
│            Press Enter or click [Add]    │
└──────────────────────────────────────────┘
```

**Parser:**

```typescript
interface QuickAddParser {
  parse(input: string): Partial<CalendarEvent> | null
}

// Examples:
"Dentist tomorrow at 2pm"
→ { title: "Dentist", startTime: tomorrow 2:00 PM, endTime: tomorrow 2:30 PM }

"Team meeting next Monday 10am-11am"
→ { title: "Team meeting", startTime: next Mon 10 AM, endTime: next Mon 11 AM }

"Lunch with Sarah Friday noon"
→ { title: "Lunch with Sarah", startTime: Fri 12:00 PM, endTime: Fri 1:00 PM }

"All day conference next week Thursday"
→ { title: "Conference", startTime: next Thu, isAllDay: true }
```

**Implementation using chrono-node library:**

```typescript
import * as chrono from 'chrono-node'

function parseQuickAdd(input: string): Partial<CalendarEvent> {
  const parsed = chrono.parse(input, new Date(), { forwardDate: true })

  if (parsed.length === 0) {
    return { title: input } // No date found, just use as title
  }

  const dateResult = parsed[0]
  const title = input.replace(dateResult.text, '').trim()

  return {
    title: title || 'Untitled Event',
    startTime: dateResult.start.date(),
    endTime: dateResult.end?.date() || addMinutes(dateResult.start.date(), 30),
    isAllDay: !dateResult.start.isCertain('hour')
  }
}
```

**V2 Enhancement: AI-powered parsing**
- Use Claude API to parse complex inputs
- Extract location, attendees, notes from natural language
- "Dinner with mom at Olive Garden on her birthday (June 15) - remember to bring gift"

#### B. Full Form

**Modal dialog for complete event creation:**

```typescript
interface EventForm {
  title: string                    // Required
  startDate: Date                  // Required
  startTime?: string               // Optional (all-day if omitted)
  endDate?: Date                   // Optional (defaults to startDate)
  endTime?: string                 // Optional
  isAllDay: boolean                // Checkbox
  location?: string                // Optional
  description?: string             // Optional, textarea
  spaceId: string                  // Dropdown, defaults to current space filter
  recurrence?: RecurrenceRule      // Optional, see below
  reminderMinutes?: number[]       // Optional, multi-select
  color?: string                   // Optional, color picker
}
```

**Form UI:**
```
┌──────────────────────────────────────────┐
│ Create Event                        [X]   │
├──────────────────────────────────────────┤
│                                          │
│ Title*                                   │
│ [____________________]                   │
│                                          │
│ When*                                    │
│ [04/15/2025 ▾] [09:00 AM ▾]            │
│ to                                       │
│ [04/15/2025 ▾] [10:00 AM ▾]            │
│ ☐ All day                               │
│                                          │
│ Space                                    │
│ [Work ▾]                                │
│                                          │
│ Location                                 │
│ [____________________]                   │
│                                          │
│ Description                              │
│ [_____________________]                  │
│ [_____________________]                  │
│ [_____________________]                  │
│                                          │
│ Repeat                                   │
│ [Does not repeat ▾]                     │
│                                          │
│ Reminders                                │
│ ☑ 15 minutes before                     │
│ ☐ 1 hour before                         │
│ ☐ 1 day before                          │
│                                          │
│         [Cancel]  [Save Event]           │
└──────────────────────────────────────────┘
```

#### C. Recurring Events

**Recurrence Rules:**

```typescript
type RecurrenceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

interface RecurrenceRule {
  frequency: RecurrenceFrequency
  interval: number // Every X days/weeks/months/years
  byDay?: ('MO'|'TU'|'WE'|'TH'|'FR'|'SA'|'SU')[] // For weekly: which days
  byMonthDay?: number // For monthly: day of month (1-31)
  byMonth?: number // For yearly: month (1-12)
  until?: Date // End date
  count?: number // Or end after X occurrences
}

// Examples:
// Every weekday (Mon-Fri)
{ frequency: 'WEEKLY', interval: 1, byDay: ['MO','TU','WE','TH','FR'] }

// Every 2 weeks on Monday
{ frequency: 'WEEKLY', interval: 2, byDay: ['MO'] }

// 15th of every month
{ frequency: 'MONTHLY', interval: 1, byMonthDay: 15 }

// Annually on birthday
{ frequency: 'YEARLY', interval: 1, byMonth: 6, byMonthDay: 15 }
```

**Recurrence UI (simplified for MVP):**

```
Repeat: [Does not repeat ▾]
        ↓ (dropdown options)
        - Does not repeat
        - Daily
        - Every weekday (Mon-Fri)
        - Weekly
        - Monthly
        - Yearly
        - Custom...

If "Custom" selected:
┌──────────────────────────────────┐
│ Repeat every [1 ▾] [weeks ▾]    │
│                                  │
│ On: [Mo][Tu][We][Th][Fr][Sa][Su]│
│                                  │
│ Ends:                            │
│ ○ Never                          │
│ ○ On [06/15/2025 ▾]             │
│ ○ After [10 ▾] occurrences      │
└──────────────────────────────────┘
```

#### D. Event Templates (V2)

**Defer to V2, but design:**

```typescript
interface EventTemplate {
  id: string
  name: string
  title: string
  durationMinutes: number
  location?: string
  description?: string
  spaceId: string
  recurrence?: RecurrenceRule
  reminderMinutes: number[]
}

// Examples:
const templates = [
  {
    name: 'Team Standup',
    title: 'Team Standup',
    durationMinutes: 15,
    recurrence: { frequency: 'WEEKLY', interval: 1, byDay: ['MO','WE','FR'] },
    spaceId: 'work',
    reminderMinutes: [5]
  },
  {
    name: '1-on-1 Meeting',
    title: '1-on-1 with [Name]',
    durationMinutes: 30,
    spaceId: 'work',
    reminderMinutes: [15]
  }
]
```

---

### 1.5 Drag & Drop

#### A. Drag Behavior

**What can be dragged:**
- Events in Week/Day view (not Month - too small)
- Task deadline events (if enabled)
- Not all-day events (different UI pattern)

**Drag actions:**
```typescript
// Drag vertically = change time
onDragEvent = (event: CalendarEvent, newStart: Date, newEnd: Date) => {
  // Show preview during drag
  showDragPreview(event, newStart, newEnd)
}

onDropEvent = async (event: CalendarEvent, newStart: Date, newEnd: Date) => {
  // Instant save (no confirmation for simple reschedule)
  await db.calendarEvents.update(event.id, {
    startTime: newStart,
    endTime: newEnd
  })

  // If task event, update task due date
  if (event.eventType === 'task' && event.taskId) {
    await db.tasks.update(event.taskId, {
      dueDate: newStart,
      dueTime: formatTime(newStart)
    })
  }

  // Sync to Google
  await syncToGoogle(event)

  // Show undo toast
  showUndoToast('Event moved', () => {
    // Revert to original time
    undoEventMove(event, originalStart, originalEnd)
  })
}
```

**Drag constraints:**
- Can't drag to past dates (show warning)
- Can't drag recurring event (must edit series)
- Snap to 15-minute intervals

**Resize handles:**
```
Week/Day view events have resize handles:
┌─────────────────────┐ ← Top handle (change start time)
│ 9:00 AM             │
│ Team Meeting        │
│                     │
└─────────────────────┘ ← Bottom handle (change end time)
```

---

### 1.6 Calendar Data Model

```sql
-- Main calendar events table
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Event details
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,

  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'America/New_York',

  -- Type and relationships
  event_type TEXT NOT NULL CHECK (event_type IN ('calendar', 'task', 'countdown')),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  countdown_id UUID REFERENCES countdowns(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE SET NULL,

  -- Google Calendar integration
  google_event_id TEXT UNIQUE,
  google_calendar_id TEXT DEFAULT 'primary',
  google_sync_token TEXT, -- For incremental sync

  -- Recurrence
  recurrence_rule JSONB, -- Stores RecurrenceRule interface
  recurrence_parent_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
  recurrence_exception_dates TIMESTAMPTZ[], -- Dates to skip

  -- Metadata
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ, -- Soft delete for sync

  -- Indexes
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Indexes for performance
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_events_task_id ON calendar_events(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_calendar_events_google_id ON calendar_events(google_event_id) WHERE google_event_id IS NOT NULL;
CREATE INDEX idx_calendar_events_space_id ON calendar_events(space_id);

-- Materialized view for recurring event instances
CREATE MATERIALIZED VIEW calendar_event_instances AS
SELECT
  e.id AS parent_event_id,
  e.user_id,
  e.title,
  e.description,
  e.location,
  -- Generate instances for next 2 years
  generate_series(
    e.start_time,
    LEAST(
      e.start_time + INTERVAL '2 years',
      COALESCE((e.recurrence_rule->>'until')::TIMESTAMPTZ, e.start_time + INTERVAL '2 years')
    ),
    (e.recurrence_rule->>'interval')::INTEGER || ' ' ||
    LOWER(e.recurrence_rule->>'frequency') AS INTERVAL
  ) AS instance_start_time,
  e.end_time - e.start_time AS duration
FROM calendar_events e
WHERE e.recurrence_rule IS NOT NULL
  AND e.deleted_at IS NULL;

CREATE INDEX idx_event_instances_user_time ON calendar_event_instances(user_id, instance_start_time);

-- Refresh materialized view daily
-- (Add to cron job)

-- Google Calendar sync metadata
CREATE TABLE google_calendar_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- OAuth tokens
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,

  -- Sync configuration
  sync_mode TEXT NOT NULL CHECK (sync_mode IN ('push', 'pull', 'bidirectional')),
  sync_enabled BOOLEAN DEFAULT TRUE,
  calendar_ids TEXT[] DEFAULT ARRAY['primary'], -- Multiple calendars in V2

  -- Sync state
  last_sync_at TIMESTAMPTZ,
  last_sync_token TEXT, -- Google's sync token for incremental sync

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event reminders
CREATE TABLE calendar_event_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,

  minutes_before INTEGER NOT NULL, -- 15, 60, 1440 (1 day), etc.
  notification_sent_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_event_id ON calendar_event_reminders(event_id);
CREATE INDEX idx_reminders_pending ON calendar_event_reminders(notification_sent_at)
  WHERE notification_sent_at IS NULL;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_calendar_event_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_event_timestamp();
```

---

## 2. API Endpoints

### REST API Design

```typescript
// Event CRUD
GET    /api/calendar/events?start=2025-04-01&end=2025-04-30&space=work
POST   /api/calendar/events
GET    /api/calendar/events/:id
PATCH  /api/calendar/events/:id
DELETE /api/calendar/events/:id

// Quick add
POST   /api/calendar/events/quick-add
Body: { input: "Dentist tomorrow at 2pm" }

// Recurring events
POST   /api/calendar/events/:id/instances  // Create exception
DELETE /api/calendar/events/:id/instances/:date  // Delete single occurrence

// Google Calendar integration
POST   /api/calendar/google/connect  // Start OAuth flow
GET    /api/calendar/google/callback?code=...  // OAuth callback
POST   /api/calendar/google/disconnect
POST   /api/calendar/google/sync  // Manual sync
GET    /api/calendar/google/status  // Connection status

// Reminders
POST   /api/calendar/events/:id/reminders
DELETE /api/calendar/reminders/:id
```

### Example: Get Events

```http
GET /api/calendar/events?start=2025-04-01T00:00:00Z&end=2025-04-30T23:59:59Z&space=work

Response 200:
{
  "events": [
    {
      "id": "evt_abc123",
      "title": "Team Standup",
      "description": null,
      "startTime": "2025-04-15T09:00:00Z",
      "endTime": "2025-04-15T09:15:00Z",
      "isAllDay": false,
      "location": null,
      "eventType": "calendar",
      "spaceId": "work",
      "color": "#1E88E5",
      "recurrence": {
        "frequency": "WEEKLY",
        "interval": 1,
        "byDay": ["MO", "WE", "FR"]
      },
      "reminders": [
        { "minutesBefore": 5 }
      ],
      "googleEventId": "abc123@google.com",
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-04-01T14:30:00Z"
    },
    {
      "id": "evt_def456",
      "title": "⏰ Submit Report",
      "startTime": "2025-04-20T17:00:00Z",
      "endTime": "2025-04-20T17:30:00Z",
      "eventType": "task",
      "taskId": "task_xyz789",
      "spaceId": "work",
      "color": "#FF6B35"
    }
  ],
  "meta": {
    "total": 2,
    "start": "2025-04-01T00:00:00Z",
    "end": "2025-04-30T23:59:59Z"
  }
}
```

### Example: Create Event

```http
POST /api/calendar/events
Content-Type: application/json

{
  "title": "Dentist Appointment",
  "startTime": "2025-04-16T14:00:00Z",
  "endTime": "2025-04-16T15:00:00Z",
  "location": "123 Main St",
  "description": "Annual checkup",
  "spaceId": "personal",
  "reminders": [
    { "minutesBefore": 60 },
    { "minutesBefore": 1440 }
  ]
}

Response 201:
{
  "event": {
    "id": "evt_new789",
    "title": "Dentist Appointment",
    "startTime": "2025-04-16T14:00:00Z",
    "endTime": "2025-04-16T15:00:00Z",
    "location": "123 Main St",
    "description": "Annual checkup",
    "spaceId": "personal",
    "eventType": "calendar",
    "googleEventId": "xyz789@google.com", // Created in Google
    "createdAt": "2025-04-15T10:30:00Z",
    "updatedAt": "2025-04-15T10:30:00Z"
  }
}
```

### Example: Google Calendar Sync

```http
POST /api/calendar/google/sync

Response 200:
{
  "result": {
    "synced": 12,
    "created": 3,
    "updated": 7,
    "deleted": 2,
    "conflicts": 0,
    "duration": 1250, // ms
    "lastSyncAt": "2025-04-15T10:45:00Z"
  }
}
```

---

## 3. Integration Points

### 3.1 Task System
- Task with due date → Auto-create calendar event
- Calendar event moved → Update task due date
- Task deleted → Delete calendar event
- Visual distinction on calendar

### 3.2 Countdown System
- Countdown target date → Create calendar event
- Visual marker on calendar for countdowns
- Different color coding

### 3.3 Spaces System
- Events belong to spaces
- Space filter affects calendar view
- Space colors map to event colors

### 3.4 Weather Integration
- Display weather forecast in Day view
- "Outdoor" tagged tasks + rainy weather = suggestion to reschedule

### 3.5 Dashboard
- Calendar widget showing today's events
- "Next up" event display
- Week-at-a-glance view

---

## 4. Implementation Priority

### Phase 1: MVP (Week 1-2)
**Est. 60 hours**

- [ ] Basic calendar UI (Month, Week, Day views) - 16h
- [ ] Event CRUD (create, read, update, delete) - 8h
- [ ] Database schema + migrations - 4h
- [ ] Space integration (events belong to spaces) - 4h
- [ ] Task-calendar sync (due dates → events) - 12h
- [ ] Local-only (no Google sync yet) - 0h
- [ ] Drag & drop reschedule - 8h
- [ ] Basic reminders (browser notifications) - 8h

**MVP Deliverables:**
✅ Functional calendar with all views
✅ Create/edit/delete events
✅ Task deadlines appear on calendar
✅ Drag to reschedule
✅ Space-based filtering

### Phase 2: Google Calendar (Week 3)
**Est. 30 hours**

- [ ] Google OAuth flow - 6h
- [ ] Token management (store, refresh) - 4h
- [ ] Bidirectional sync - 12h
- [ ] Conflict resolution - 6h
- [ ] Sync status UI - 2h

### Phase 3: Advanced Features (Week 4)
**Est. 20 hours**

- [ ] Quick add with natural language - 8h
- [ ] Recurring events - 8h
- [ ] Agenda view - 2h
- [ ] Event search - 2h

### Phase 4: Polish (Week 5)
**Est. 10 hours**

- [ ] Keyboard shortcuts - 4h
- [ ] Print calendar view - 2h
- [ ] Export to iCal - 2h
- [ ] Performance optimization (lazy load events) - 2h

**Defer to V2:**
- Multiple Google calendars
- Event templates
- Attendees/invitations
- Google Calendar webhooks (push notifications)
- Year view, 3-day view
- AI-powered quick add

---

## 5. Technical Considerations

### 5.1 API Rate Limits

**Google Calendar API:**
- Free tier: 1,000,000 requests/day
- Quota per user: 10,000 requests/day
- For single user: Not a concern

**Mitigation:**
- Cache calendar data locally
- Incremental sync using sync tokens
- Batch operations where possible

### 5.2 Caching Strategy

```typescript
// Cache events in IndexedDB for offline support
class CalendarCache {
  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    const cached = await db.eventCache
      .where('startTime').between(start, end)
      .toArray()

    return cached
  }

  async syncWithServer() {
    const lastSync = await this.getLastSyncTime()
    const updates = await fetch(`/api/calendar/events?since=${lastSync}`)

    for (const event of updates) {
      await db.eventCache.put(event)
    }

    await this.setLastSyncTime(new Date())
  }
}
```

### 5.3 Error Handling

**Google API errors:**
```typescript
async function syncToGoogle(event: CalendarEvent) {
  try {
    const response = await googleCalendar.events.insert({
      calendarId: 'primary',
      resource: mapEDCToGoogle(event)
    })

    await db.calendarEvents.update(event.id, {
      googleEventId: response.data.id
    })

  } catch (error) {
    if (error.code === 401) {
      // Token expired, refresh and retry
      await refreshGoogleToken()
      return syncToGoogle(event) // Retry once
    } else if (error.code === 403) {
      // Quota exceeded
      await notifyUser({
        type: 'error',
        message: 'Google Calendar sync limit reached. Try again later.'
      })
      await db.syncQueue.add(event) // Queue for later
    } else {
      // Other error, log and continue
      console.error('Google sync failed:', error)
      await db.calendarEvents.update(event.id, {
        syncError: error.message,
        syncErrorAt: new Date()
      })
    }
  }
}
```

### 5.4 Performance Optimizations

**1. Virtual scrolling for long event lists:**
```typescript
// In Week view, only render visible hours
<VirtualizedList
  itemHeight={60} // 1 hour = 60px
  totalItems={24} // 24 hours
  renderItem={(hour) => <HourRow hour={hour} events={getEventsForHour(hour)} />}
/>
```

**2. Lazy load events:**
```typescript
// Only fetch events for visible date range
useEffect(() => {
  const { start, end } = getVisibleDateRange(currentView, currentDate)
  fetchEvents(start, end)
}, [currentView, currentDate])
```

**3. Debounce drag operations:**
```typescript
const debouncedDragUpdate = debounce((event, newTime) => {
  updateEventTime(event.id, newTime)
}, 500) // Wait 500ms after drag stops
```

**4. Optimize recurring event generation:**
```typescript
// Generate instances on-demand, not all upfront
function* generateRecurringInstances(
  event: CalendarEvent,
  start: Date,
  end: Date
): Generator<CalendarEvent> {
  let current = event.startTime

  while (current <= end) {
    if (current >= start) {
      yield { ...event, startTime: current, endTime: addDuration(current, event.duration) }
    }

    current = getNextRecurrence(current, event.recurrence)

    if (event.recurrence.until && current > event.recurrence.until) break
    if (event.recurrence.count && instanceCount >= event.recurrence.count) break
  }
}
```

### 5.5 Timezone Handling

**Store all times in UTC, display in user's timezone:**

```typescript
// User settings
interface UserSettings {
  timezone: string // "America/New_York"
}

// Display in UI
import { formatInTimeZone } from 'date-fns-tz'

function displayEventTime(event: CalendarEvent, userTimezone: string) {
  return formatInTimeZone(
    event.startTime,
    userTimezone,
    'h:mm a' // "2:30 PM"
  )
}

// Google Calendar sends times in event's timezone
// Convert to UTC before storing
function normalizeGoogleEventTime(gEvent: GoogleCalendarEvent): Date {
  return new Date(gEvent.start.dateTime) // Already ISO 8601 UTC
}
```

---

## Summary

**MVP Focus:**
1. Basic calendar with Month/Week/Day views ✅
2. Task deadline integration ✅
3. Google Calendar bidirectional sync ✅
4. Drag & drop reschedule ✅
5. Space-based filtering ✅

**Technical Stack:**
- Frontend: React + FullCalendar or react-big-calendar
- Backend: Node.js + Express
- Database: PostgreSQL with JSONB for recurrence rules
- Google API: googleapis npm package
- Natural language: chrono-node library

**Total Estimated Effort:** 120 hours (~3 weeks)

**Files:**
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/calendar/specification.md`
- Schema: Copy-paste ready SQL above
- API: REST endpoints defined above

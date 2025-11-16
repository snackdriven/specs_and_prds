# PRD: Calendar Integration System

## Product Overview

The Calendar Integration System provides a comprehensive, multi-view calendar with bi-directional Google Calendar sync. It serves as the temporal hub for tasks, habits, concerts, and custom events, helping users with ADHD visualize their time and commitments in an accessible, low-cognitive-load interface.

## Problem Statement

Users with ADHD face unique calendar challenges:
- **Time Blindness**: Difficulty visualizing how far away events are
- **Over-Scheduling**: Booking too much without seeing existing commitments
- **Context Switching**: Difficulty moving between different calendar tools
- **Sync Conflicts**: Manual updates across multiple calendars
- **Visual Overwhelm**: Too much information in traditional calendar UIs
- **Missed Events**: Forgetting to check calendar regularly

## Target Users

- **Primary**: Users needing visual time management
- **Secondary**: Users with existing Google Calendar workflows
- **Tertiary**: Power users managing multiple event types (tasks, habits, concerts, etc.)

## Goals & Success Metrics

### User Goals
1. Visualize all time commitments in one unified calendar
2. Sync seamlessly with Google Calendar
3. Switch between views (day, week, month) based on needs
4. Drag-and-drop events to reschedule easily
5. See task deadlines, habit reminders, and custom events together

### Success Metrics
- **Daily Active Calendar Users**: Users viewing calendar daily
- **Google Calendar Sync Adoption**: % of users enabling sync
- **Sync Success Rate**: Successful syncs / total sync attempts
- **View Diversity**: Usage distribution across view modes
- **Event Creation Rate**: Events created per user per week
- **Drag-Drop Usage**: % of event updates via drag-drop vs modal

## Core Features

### 1. Multi-View Calendar Display

**Description**: 8 different calendar view modes optimized for different use cases

**User Stories**:
- As a user, I want to see my week at a glance
- As a user, I want to focus on just today's events
- As a user, I want a traditional monthly calendar view
- As a user, I want a work-week view (Mon-Fri only)
- As a user, I want to see 3 days at once for short-term planning
- As a user, I want a 2-week view for bi-weekly planning
- As a user, I want an agenda/list view for event scanning

**View Modes**:

| View Mode | File | Use Case |
|-----------|------|----------|
| **Day View** | `CalendarDayView.tsx` | Single day detail, hourly breakdown |
| **Week View** | `CalendarWeekView.tsx` | 7-day week, default view |
| **Work Week** | `CalendarWorkWeekView.tsx` | Mon-Fri only, exclude weekends |
| **Month View** | `CalendarMonthView.tsx` | Traditional month grid |
| **3-Day View** | `CalendarThreeDayView.tsx` | Today + next 2 days |
| **2-Week View** | `CalendarTwoWeekView.tsx` | 14-day planning horizon |
| **Agenda View** | `CalendarAgendaView.tsx` | Linear list of upcoming events |
| **Modern Week** | `ModernCalendarWeekView.tsx` | Enhanced week with better UX |

**Technical Implementation**:
- Components: Individual view components in `components/calendar/`
- State: `useCalendarNavigation()` hook manages current date and view mode
- Rendering: Each view independently renders events for its time range
- Performance: Only render visible time range, lazy load past/future

**View Switching**:
- View selector dropdown in calendar header
- Keyboard shortcuts (D=day, W=week, M=month)
- User preference saved in profile (`default_calendar_view`)

### 2. Event CRUD Operations

**Description**: Create, read, update, delete events with rich metadata

**User Stories**:
- As a user, I want to create events with title, time, and description
- As a user, I want to set events as all-day
- As a user, I want to add location to events
- As a user, I want to link events to tasks/habits/concerts
- As a user, I want to edit event details
- As a user, I want to delete events

**Technical Implementation**:
- Database: `calendar_events` table (supabase/schema.sql:267-287)
- Hooks: `useCalendarEvents()` (CRUD operations)
- Components: `AllEventsModal.tsx` (event form)
- Real-time: Supabase subscriptions for live updates

**Event Fields**:
- `title` (required): Event name
- `description` (optional): Event details
- `start_time` (required): Event start (timestamp with timezone)
- `end_time` (required): Event end (timestamp with timezone)
- `all_day` (boolean): Full day event flag
- `location` (optional): Event location/URL
- `recurring_rule` (JSONB): Recurrence pattern (future feature)
- `task_id` (FK): Linked task (null if standalone)
- `habit_id` (FK): Linked habit reminder (null if standalone)
- `concert_id` (FK): Linked concert (null if standalone)
- `google_event_id` (string): Google Calendar event ID (for synced events)
- `google_calendar_id` (string): Source Google Calendar
- `sync_status` (enum): pending | synced | error | conflict

### 3. Drag-and-Drop Rescheduling

**Description**: Click and drag events to new times/dates

**User Stories**:
- As a user, I want to drag an event to a different time slot
- As a user, I want to drag an event to a different day
- As a user, I want visual feedback while dragging
- As a user, I want changes to save automatically on drop

**Technical Implementation**:
- Hook: `useCalendarDragDrop()`
- Library: Browser native drag-and-drop API
- Components: Event handlers in each view component
- Sync: Auto-save on drop, sync to Google Calendar if enabled

**Drag Behavior**:
- **Vertical Drag** (time change): Snap to 15-minute increments
- **Horizontal Drag** (date change): Snap to day boundaries
- **Duration Preservation**: Maintain event length during drag
- **Collision Detection**: Visual warning if overlapping with existing event
- **Undo Support**: Add to undo stack after drop

### 4. Google Calendar Sync

**Description**: Bi-directional sync with Google Calendar

**User Stories**:
- As a user, I want to authenticate with my Google account
- As a user, I want to choose which Google Calendars to sync
- As a user, I want events I create in EDC to appear in Google Calendar
- As a user, I want events from Google Calendar to appear in EDC
- As a user, I want to control sync direction (both, to-google, from-google)
- As a user, I want to handle sync conflicts (local wins, google wins, manual)

**Technical Implementation**:
- Service: `lib/calendar/google-calendar-browser.ts`
- Database: `google_calendar_sync_settings` table (supabase/schema.sql:290-310)
- Hook: `useGoogleCalendarSync()`
- Auth: OAuth 2.0 via Google Identity Services (GIS)
- API: Google Calendar API v3

**Sync Settings**:
```typescript
interface GoogleCalendarSyncSettings {
  enabled: boolean // master on/off switch
  google_calendar_id: string // primary calendar ID
  access_token: string // OAuth access token (encrypted)
  refresh_token: string // OAuth refresh token (encrypted)
  expires_at: timestamp // token expiration
  sync_direction: 'both' | 'to-google' | 'from-google'
  sync_tasks: boolean // sync task due dates
  sync_habits: boolean // sync habit reminders
  sync_journal_reminders: boolean // sync journal prompts
  conflict_resolution: 'manual' | 'google-wins' | 'local-wins'
  sync_interval: number // minutes between syncs (default 15)
  last_sync_at: timestamp // last successful sync
  calendar_configs: JSONB // array of calendar-specific settings
  default_calendar_id: string // where to create new events
}
```

**Sync Flow - Local to Google**:
1. User creates event in EDC
2. Event saved to `calendar_events` with `sync_status='pending'`
3. Sync service picks up pending event
4. Create event via Google Calendar API
5. Store `google_event_id` from response
6. Update `sync_status='synced'`, `last_synced_at=NOW()`

**Sync Flow - Google to Local**:
1. Periodic sync checks Google Calendar for changes since `last_sync_at`
2. Fetch updated/new events from Google Calendar API
3. For each Google event:
   - If `google_event_id` exists locally: Update local event
   - If new: Create local event with `google_event_id`
4. Update `last_sync_at`

**Conflict Resolution**:
- **Manual**: Show conflict dialog, user chooses which version to keep
- **Google Wins**: Always overwrite local with Google version
- **Local Wins**: Always overwrite Google with local version

**Token Management**:
- Access tokens expire after 1 hour
- Refresh token used to get new access token automatically
- Encrypted storage in database (Supabase encryption at rest)

### 5. Task-Calendar Auto-Sync

**Description**: Automatically create calendar events for tasks with due dates

**User Stories**:
- As a user, when I add a due date to a task, I want a calendar event created
- As a user, when I update a task's due date, I want the calendar event updated
- As a user, when I complete a task, I want the calendar event marked complete
- As a user, when I delete a task, I want the calendar event deleted

**Technical Implementation**:
- Service: `lib/calendar/task-calendar-sync.ts`
- Trigger: Task CRUD operations call sync service
- Linking: `calendar_events.task_id` foreign key

**Sync Behavior**:
```typescript
// On task create/update with due_date:
if (task.due_date && !task.calendar_event_id) {
  const event = await createCalendarEvent({
    title: `Task: ${task.title}`,
    start_time: task.due_date,
    end_time: addHours(task.due_date, 1), // default 1-hour duration
    description: task.description,
    task_id: task.id
  })
  await updateTask({ id: task.id, calendar_event_id: event.id })
}

// On task completion:
if (task.completed) {
  await updateCalendarEvent({
    id: task.calendar_event_id,
    title: `✓ ${task.title}` // add checkmark prefix
  })
}

// On task deletion:
if (task.calendar_event_id) {
  await deleteCalendarEvent(task.calendar_event_id)
}
```

### 6. Calendar Sidebar

**Description**: Mini calendar and event list for navigation

**User Stories**:
- As a user, I want a mini calendar to jump to specific dates
- As a user, I want to see today's events in a list
- As a user, I want to see upcoming events
- As a user, I want to filter events by type (tasks, habits, concerts, custom)

**Technical Implementation**:
- Component: `CalendarSidebar.tsx` (28KB)
- Features:
  - Mini monthly calendar with date selection
  - "Today's Events" list
  - "Upcoming Events" list (next 7 days)
  - Event type filters (checkboxes)
  - Create event shortcut button

**Mini Calendar Features**:
- Dots on dates with events (color-coded by type)
- Bold highlight on today
- Click date to navigate main calendar
- Keyboard navigation (arrow keys)

### 7. Event Import/Export

**Description**: Batch import events from files, export to standard formats

**User Stories**:
- As a user, I want to import events from .ics files
- As a user, I want to export my calendar to .ics format
- As a user, I want to export to CSV for spreadsheet analysis
- As a user, I want to export to PDF for printing

**Technical Implementation**:
- Hook: `useEventImporter()`
- Libraries:
  - `ical.js` for .ics parsing/generation
  - `jspdf` for PDF export
- Component: Import/export modal in calendar settings

**Import Flow**:
1. User uploads .ics file
2. Parse with ical.js
3. Preview events to import
4. User selects which events to import
5. Batch create events
6. Show success summary

**Export Formats**:
- **.ics (iCalendar)**: Standard calendar format, compatible with all calendar apps
- **CSV**: Spreadsheet format for analysis
- **PDF**: Print-friendly format
- **JSON**: Developer-friendly format for backups

### 8. Recurring Events (Future)

**Description**: Create events that repeat on a schedule

**User Stories**:
- As a user, I want to create a daily standup event
- As a user, I want to create a weekly team meeting
- As a user, I want to customize recurrence rules
- As a user, I want to edit single occurrences vs all occurrences

**Technical Implementation**:
- Field: `recurring_rule` (JSONB) in `calendar_events` table
- Standard: RFC 5545 (iCalendar) RRULE format
- Current Status: **Not yet implemented** (schema in place)

## User Workflows

### Workflow 1: Viewing This Week's Events
1. User opens calendar pane
2. Calendar defaults to week view showing current week
3. User sees:
   - Task deadlines (blue background)
   - Habit reminders (green background)
   - Concert events (purple background)
   - Custom events (gray background)
4. User clicks event to see details
5. Event modal opens with full description, location, edit/delete options

### Workflow 2: Creating a Custom Event
1. User clicks "+ New Event" button in calendar header
2. Event modal opens
3. User enters:
   - Title: "Doctor Appointment"
   - Start time: 2024-03-15 14:00
   - End time: 2024-03-15 15:00
   - Location: "123 Medical Plaza"
   - Description: "Annual checkup"
4. User clicks "Save"
5. Event appears on calendar at specified time
6. If Google sync enabled: Event syncs to Google Calendar within 15 minutes

### Workflow 3: Rescheduling via Drag-Drop
1. User sees event "Team Meeting" on Monday 10am
2. User clicks and holds event
3. User drags event to Tuesday 2pm
4. Visual feedback shows new position
5. User releases mouse
6. Event updates immediately
7. If Google sync enabled: Update syncs to Google Calendar
8. Undo button appears briefly in case of mistake

### Workflow 4: Enabling Google Calendar Sync
1. User opens calendar settings
2. User clicks "Connect Google Calendar"
3. Google OAuth popup opens
4. User logs in and authorizes calendar access
5. User selects which Google Calendars to sync
6. User chooses sync direction: "Both ways"
7. User chooses conflict resolution: "Google wins"
8. User clicks "Enable Sync"
9. Initial sync runs, imports all Google events
10. Ongoing sync runs every 15 minutes automatically

### Workflow 5: Resolving a Sync Conflict (Manual Mode)
1. User edits event in EDC: "Meeting" from 2pm → 3pm
2. Simultaneously, colleague edits same event in Google Calendar: 2pm → 4pm
3. Next sync detects conflict
4. Conflict resolution modal appears:
   - "Local version: 3pm"
   - "Google version: 4pm"
   - Buttons: "Keep Local" | "Keep Google" | "Cancel"
5. User clicks "Keep Google"
6. Event updates to 4pm in EDC
7. Sync marked as resolved

## Technical Architecture

### Database Schema
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,
  recurring_rule JSONB,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  concert_id UUID REFERENCES concerts(id) ON DELETE SET NULL,
  google_event_id TEXT,
  google_calendar_id TEXT,
  sync_status TEXT DEFAULT 'pending',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)

CREATE TABLE google_calendar_sync_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  google_calendar_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  sync_direction TEXT DEFAULT 'both',
  sync_tasks BOOLEAN DEFAULT TRUE,
  sync_habits BOOLEAN DEFAULT TRUE,
  conflict_resolution TEXT DEFAULT 'manual',
  sync_interval INTEGER DEFAULT 15,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  calendar_configs JSONB DEFAULT '[]',
  default_calendar_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Component Hierarchy
```
CalendarContentOrchestrator (state management)
├── CalendarHeader (view switcher, navigation, create button)
├── CalendarSidebar (mini calendar, event list, filters)
└── CalendarViewRenderer (selected view)
    ├── CalendarDayView (hourly slots, single day)
    ├── CalendarWeekView (7 columns, hourly rows)
    ├── CalendarWorkWeekView (5 columns, Mon-Fri)
    ├── CalendarMonthView (grid of days)
    ├── CalendarThreeDayView (3 columns)
    ├── CalendarTwoWeekView (14 columns)
    ├── CalendarAgendaView (linear list)
    └── ModernCalendarWeekView (enhanced week)
```

### Key Hooks
- `useCalendarEvents()`: CRUD operations, query by date range
- `useCalendarNavigation()`: Current date, view mode state
- `useGoogleCalendar()`: OAuth flow, authentication
- `useGoogleCalendarSync()`: Sync orchestration
- `useCalendarDragDrop()`: Drag-drop event handling
- `useEventImporter()`: Import from .ics files
- `useCalendarDependencyIntegration()`: Task-calendar linking

### State Management
- **TanStack Query**: Server state with `['calendar_events']` key
- **Query Params**: Date range passed to optimize fetch
- **Real-time**: Supabase subscriptions for live updates
- **Local State**: Drag state, selected event, modal open/close

## ADHD-Friendly Design Patterns

### 1. Color-Coded Event Types
- Tasks: Blue background
- Habits: Green background
- Concerts: Purple background
- Custom: Gray background
- Reduces cognitive load for quick identification

### 2. Visual Time Density
- "Busy" hours have darker background shading
- "Free" hours have lighter background
- Helps identify scheduling gaps at a glance

### 3. Minimal Text in Grid View
- Show only event title in calendar grid
- Full details on hover/click
- Prevents visual overwhelm

### 4. Today Emphasis
- Bold border around today's column
- Different background color for current hour
- "Today" badge in header

### 5. Quick Actions
- Right-click context menu on events
- Keyboard shortcuts for navigation (arrow keys, J/K)
- Drag-drop for rescheduling without dialogs

## Accessibility

- Keyboard navigation: Arrow keys to move between dates/times, Enter to select
- Screen reader: ARIA labels on all events, day headers, time slots
- Focus indicators: Clear focus ring on selected event/date
- Time format: Respect user preference (12h vs 24h format)
- Reduced motion: Disable transitions if user prefers reduced motion

## Performance Considerations

- **Date Range Queries**: Only fetch events in visible date range (e.g., current month ±1 week)
- **Virtualization**: For agenda view, virtualize list with `react-window`
- **Indexing**: Database index on `user_id, start_time, end_time` for fast range queries
- **Lazy Load Views**: Code-split each view component for faster initial load
- **Debounced Drag**: Throttle drag-drop updates to avoid excessive re-renders

## Future Enhancements

1. **Recurring Events**: Full RRULE support (daily, weekly, monthly, custom)
2. **Calendar Sharing**: Share calendars with other EDC users
3. **Event Attachments**: Attach files to events
4. **Event Reminders**: Push notifications before events
5. **Weather Integration**: Show weather forecast on future days
6. **Time Blocking**: Visual time blocking interface for planning
7. **Focus Time**: Auto-block focus time based on task estimates
8. **Meeting Polls**: Doodle-style meeting time polling
9. **Availability Sharing**: Share free/busy times with others
10. **Zoom/Meet Integration**: Auto-join meeting links at event time

## Open Questions

1. Should we support Outlook/iCloud calendar sync in addition to Google?
2. Should we allow multiple Google accounts connected simultaneously?
3. How do we handle time zone changes for users who travel?
4. Should we limit calendar date range (e.g., only ±2 years from now)?
5. Should we support team/shared calendars?

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Google API rate limits | High | Low | Implement exponential backoff, queue sync requests |
| Token expiration during sync | Medium | Medium | Automatic token refresh, retry failed syncs |
| Sync conflicts causing data loss | High | Low | Conflict detection, manual resolution mode |
| Calendar overwhelm (too many events) | Medium | Medium | Filtering, color coding, collapsible event types |
| Performance degradation with 1000+ events | Medium | Low | Pagination, virtualization, date range limits |

## Success Criteria for Launch

1. ✅ At least 3 view modes functional (day, week, month)
2. ✅ Event CRUD operations working
3. ✅ Drag-and-drop rescheduling functional
4. ✅ Google Calendar OAuth authentication working
5. ✅ Bi-directional sync functional (basic)
6. ✅ Task-calendar auto-sync working
7. ✅ Sidebar mini calendar functional
8. ✅ Mobile-responsive design
9. ✅ Performance: <1s to load current month
10. ✅ Accessibility: Keyboard navigation working

## References

- File: `components/panes/content/CalendarContentOrchestrator.tsx`
- File: `components/calendar/CalendarWeekView.tsx`
- File: `lib/calendar/google-calendar-browser.ts`
- File: `lib/calendar/task-calendar-sync.ts`
- Hook: `hooks/calendar/useCalendarEvents.ts`
- Schema: `supabase/schema.sql:267-310`
- README: `components/calendar/README.md`

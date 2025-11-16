# Personal Productivity System - Architecture Overview

## Executive Summary

This document defines the architecture for a ADHD-optimized personal productivity system with intelligent feature interconnections, proactive automations, and a unified data model.

**Design Philosophy:**
- **Reduce Cognitive Load**: Minimize decision fatigue through intelligent defaults and automation
- **Maintain Context**: Preserve state across features to reduce "what was I doing?" moments
- **Proactive Assistance**: Surface actionable items before they become urgent
- **Flexibility Without Complexity**: Power features available but not required

---

## 1. Feature Interaction Map

### 1.1 Core Feature Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                          SPACES                                  │
│         (Organizational Layer - Applied to Everything)           │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│    TASKS     │◄────►│   CALENDAR   │◄───►│  COUNTDOWNS  │
│              │      │              │     │              │
└──────┬───────┘      └──────┬───────┘     └──────┬───────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   CHORES/    │      │  DASHBOARD   │     │   CONCERTS   │
│ MAINTENANCE  │      │              │     │              │
└──────────────┘      └──────┬───────┘     └──────────────┘
       │                     │
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│    HABITS    │◄────►│ MOOD LOGGING │
│              │      │              │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │                     │
       └─────────┬───────────┘
                 │
                 ▼
         ┌──────────────┐
         │   JOURNAL    │
         │  (+ Spotify) │
         └──────────────┘
                 │
                 ▼
         ┌──────────────┐
         │    ATLAS     │
         │ (Workspace)  │
         └──────────────┘
```

### 1.2 Feature Connection Matrix

| From Feature | To Feature | Interaction Type | Bidirectional? |
|-------------|-----------|------------------|----------------|
| **Tasks** | Calendar | Due dates sync to calendar events | Yes |
| **Tasks** | Dashboard | Overdue/due today surface automatically | One-way |
| **Tasks** | Chores | Chores ARE tasks with maintenance metadata | N/A (same entity) |
| **Habits** | Mood | Completion triggers mood prompt | One-way |
| **Habits** | Dashboard | Streak status, today's pending habits | One-way |
| **Habits** | Mood | Analytics correlate habit→mood patterns | Data analysis |
| **Calendar** | Countdowns | Events auto-generate countdowns | Optional |
| **Calendar** | Dashboard | Today's events display | One-way |
| **Countdowns** | Concerts | Concerts are specialized countdowns | Inheritance |
| **Countdowns** | Dashboard | Urgent countdowns surface | One-way |
| **Mood** | Journal | Mood snapshot attached to entries | One-way |
| **Spotify** | Journal | Now playing captured with entry | One-way |
| **Spotify** | Dashboard | Now playing widget | One-way |
| **ATLAS** | Tasks | Bug findings → auto-create tasks | Optional |
| **ATLAS** | Habits | Testing sessions count as work habit? | Optional |
| **Spaces** | All | Filter/organize all entities | Universal |

---

## 2. Data Flow Architecture

### 2.1 Primary Data Flows

#### Flow 1: Task → Calendar → Dashboard
```
User creates task with due date
    ↓
Task.due_date syncs to Calendar as event
    ↓
Calendar event surfaces on Dashboard "Today View"
    ↓
User completes task → Calendar event auto-marks complete
```

#### Flow 2: Habit → Mood → Analytics
```
User completes daily habit
    ↓
System prompts: "Log your mood?" (non-intrusive)
    ↓
User logs mood (energy, feeling, notes)
    ↓
Analytics engine correlates:
  - Habit completion → mood improvements
  - Habit skipping → mood dips
    ↓
Insights surface in Analytics Dashboard (v3+)
```

#### Flow 3: Chore Due → Task Creation → Dashboard
```
Maintenance chore reaches threshold
    ↓
System auto-creates task: "Change air filter (every 90 days)"
    ↓
Task appears in Today view if due soon
    ↓
User completes → Chore resets interval counter
```

#### Flow 4: Journal Entry Capture
```
User opens journal
    ↓
System captures:
  - Current mood (optional quick log)
  - Spotify "now playing" (if active)
  - Template applied (if selected)
    ↓
User writes entry
    ↓
Entry stored with rich metadata:
  {
    content: "...",
    mood_snapshot: { energy: 7, feeling: "focused" },
    spotify_track: { title: "...", artist: "...", uri: "..." },
    template_used: "daily_reflection",
    space_id: "work",
    created_at: "..."
  }
```

#### Flow 5: ATLAS → Main System
```
ATLAS testing session completes
    ↓
Bugs/issues identified
    ↓
User option: "Create tasks for findings?"
    ↓
Tasks auto-generated with:
  - Title from JIRA ticket
  - Space = "Work" (or ATLAS-specific space)
  - Priority = based on bug severity
  - Linked back to ATLAS ticket
```

### 2.2 Cross-Feature Data Model

**Unified Entity Properties (via Spaces):**
```typescript
interface SpaceableEntity {
  id: string;
  space_id: string | null;  // Organizational context
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

// All major features extend this
interface Task extends SpaceableEntity { /* ... */ }
interface Habit extends SpaceableEntity { /* ... */ }
interface JournalEntry extends SpaceableEntity { /* ... */ }
interface Countdown extends SpaceableEntity { /* ... */ }
```

**Shared Metadata Tags:**
```typescript
interface MoodSnapshot {
  energy_level: 1-10;  // Physical energy
  emotional_state: string;  // "anxious", "focused", "calm", etc.
  notes?: string;
  captured_at: Date;
}

interface SpotifyCapture {
  track_name: string;
  artist: string;
  album?: string;
  spotify_uri: string;
  captured_at: Date;
}
```

---

## 3. Smart Automation Rules

### 3.1 Proactive Notifications (Priority-Based)

**CRITICAL (Immediate Action Required):**
- Task overdue by 2+ days → "You have 3 overdue tasks. Focus on [highest priority]?"
- Habit streak at 29 days → "Don't break your meditation streak! 1 day until 30."
- Concert in 3 days + ticket status = "not purchased" → "⚠️ Concert urgent: Buy tickets!"

**HIGH (Today/Soon):**
- Task due today + status = "not started" → Morning dashboard: "3 tasks due today"
- Chore due within 7 days → "Oil change due in 5 days (3000 miles since last)"
- Countdown < 7 days + urgency = "high" → Dashboard widget

**MEDIUM (Helpful Reminders):**
- Habit not completed + time = 8pm → "Still time to log your workout today"
- No journal entry in 3+ days → "Reflect on your week?"
- ATLAS session XP earned → "🎮 +50 XP for test coverage!"

**LOW (Suggestions):**
- Mood logged as "low energy" 3 days in row → "Try a habit: Take a walk?"
- Calendar event tomorrow + no related task → "Create prep task for [meeting]?"

### 3.2 Automation Matrix

| Trigger | Condition | Action | User Control |
|---------|-----------|--------|--------------|
| Task created with due date | Due date set | Auto-sync to Google Calendar | Toggle: "Sync tasks to calendar" |
| Task marked complete | Has calendar event | Mark calendar event complete | Automatic |
| Habit completed | First completion today | Prompt: "Log your mood?" | Dismissible, "Don't ask again" |
| Chore interval reached | 90% of interval elapsed | Create task + add to dashboard | Toggle: "Auto-create maintenance tasks" |
| Calendar event imported | Event type = concert/show | Auto-create concert countdown | Toggle: "Auto-track concerts" |
| Countdown reaches 0 | Countdown complete | Archive + prompt for reflection | Automatic archive |
| Journal entry created | No mood logged today | Pre-fill mood from recent entry | Optional skip |
| Spotify playing | Journal opened | Capture "now playing" | Toggle: "Auto-capture music" |
| ATLAS bug found | Severity = high/critical | Suggest task creation | User confirms |
| Multiple tasks in space | Same due date | Suggest batching: "3 work tasks due Friday" | Suggestion only |

### 3.3 ADHD-Specific Automations

**Context Preservation:**
- Auto-save journal drafts every 30 seconds
- "Resume where you left off" on dashboard
- Undo/redo for bulk task operations

**Decision Reduction:**
- Default new tasks to "Today" space if created before noon
- Smart priority suggestion based on due date + dependencies
- One-click "Defer to tomorrow" for tasks

**Hyperfocus Protection:**
- Focus Mode: Hide all notifications except critical
- Timer integration: Pomodoro countdown on dashboard
- "End of day review" prompt if 5+ tasks still open

---

## 4. Chores vs Recurring Tasks Resolution

### 4.1 Architecture Decision: CONSOLIDATE

**Recommendation: Chores ARE tasks with maintenance metadata, NOT a separate system.**

**Rationale:**
- Reduces code duplication
- Unified task management UI
- Avoids "Where did I put that?" cognitive load
- Maintenance tracking is just specialized task recurrence

### 4.2 Implementation: Task Type Extensions

```typescript
interface Task extends SpaceableEntity {
  // Core task fields
  title: string;
  status: "not_started" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  due_date?: Date;

  // Recurrence (for both habits-as-tasks and chores)
  recurrence?: {
    type: "date_based" | "interval_based";

    // Date-based: "every Monday", "every 30 days"
    date_pattern?: {
      frequency: "daily" | "weekly" | "monthly" | "yearly";
      interval: number;  // every N days/weeks/months
      day_of_week?: number[];  // [1,3,5] = Mon, Wed, Fri
    };

    // Interval-based: "every 3000 miles", "every 90 days OR 5000 miles"
    interval_pattern?: {
      metric: "miles" | "hours" | "days" | "uses";
      threshold: number;
      current_value: number;
      last_completed_at: Date;
    };
  };

  // Maintenance-specific metadata
  maintenance_meta?: {
    category: "vehicle" | "home" | "health" | "other";
    item_name: string;  // "2018 Honda Civic", "HVAC System"
    last_service_date: Date;
    service_provider?: string;
    cost_estimate?: number;
    notes?: string;
  };
}
```

### 4.3 Chore-Specific Features

**Proactive Maintenance Dashboard Widget:**
```
┌─────────────────────────────────────┐
│ 🔧 Upcoming Maintenance              │
├─────────────────────────────────────┤
│ ⚠️  Oil Change - Due in 5 days       │
│     2847/3000 miles                  │
│     [Create Task]                    │
│                                      │
│ ⏰  Air Filter - Due in 12 days      │
│     78/90 days                       │
│     [Create Task]                    │
│                                      │
│ ✅ HVAC Service - Due in 45 days     │
│     45/180 days                      │
└─────────────────────────────────────┘
```

**Chore Tracking Workflow:**
1. User creates "Oil Change" chore (interval: 3000 miles OR 90 days)
2. System tracks both metrics simultaneously
3. At 2700 miles (90% threshold) → Dashboard alert
4. User clicks "Create Task" → Task auto-generated with due date
5. User completes task → Chore resets counters, stores history
6. History enables cost tracking, service provider memory

**Why This Works:**
- Chores live in normal task list (searchable, filterable)
- Maintenance Dashboard shows only interval-based items
- Avoids separate "chore" UI that user might forget exists
- Task completion updates chore interval automatically

---

## 5. ATLAS Integration Architecture

### 5.1 Workspace Separation Model

**Recommendation: Separate workspace with shared data layer.**

```
┌───────────────────────────────────────────┐
│         Shared Data Layer                 │
│  (Users, Spaces, Tasks, Habits, Moods)    │
└───────────────┬───────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
┌───────▼──────┐  ┌─────▼──────────┐
│ Main App     │  │ ATLAS Workspace│
│ Workspace    │  │                │
│              │  │ - JIRA Tickets │
│ - Tasks      │  │ - Test Cases   │
│ - Habits     │  │ - AI Scenarios │
│ - Journal    │  │ - Gamification │
│ - Calendar   │  │ - XP/Streaks   │
│ - Dashboard  │  │ - Achievements │
└──────────────┘  └────────────────┘
```

### 5.2 Integration Points

#### A. Task Synchronization (Optional, User-Controlled)

**ATLAS → Main Tasks:**
```typescript
interface AtlasTicket {
  jira_key: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  test_scenarios: TestScenario[];
  created_in_atlas: Date;
}

// User clicks "Create Task from Bug"
function syncAtlasToTask(ticket: AtlasTicket): Task {
  return {
    title: `[${ticket.jira_key}] ${ticket.title}`,
    priority: mapSeverityToPriority(ticket.severity),
    space_id: "work",  // Or dedicated "ATLAS" space
    metadata: {
      atlas_ticket_id: ticket.jira_key,
      source: "atlas",
    },
    // Optional: Due date based on severity
    due_date: ticket.severity === "critical"
      ? addDays(new Date(), 1)
      : addDays(new Date(), 7),
  };
}
```

#### B. Habit Cross-Tracking (Optional)

**Should ATLAS testing sessions count as habits?**

**Recommendation: YES, with dedicated "JIRA Testing" habit**

```typescript
interface Habit {
  title: string;
  frequency: "daily" | "weekly" | "custom";

  // Enable ATLAS integration
  atlas_sync?: {
    enabled: true;
    auto_complete_on_session: boolean;  // Mark habit complete when ATLAS session logged
    min_test_cases: number;  // Require 3+ test cases to count
  };
}

// When ATLAS session completes
function onAtlasSessionComplete(session: AtlasSession) {
  const testingHabit = findHabit("JIRA Testing");

  if (testingHabit?.atlas_sync?.enabled &&
      session.test_cases.length >= testingHabit.atlas_sync.min_test_cases) {
    completeHabit(testingHabit.id);
    notify("✅ JIRA Testing habit completed! Streak: 12 days");
  }
}
```

#### C. Gamification Unification

**Problem:** ATLAS has its own XP/achievements. Should these merge with main app?

**Recommendation: Separate but visible.**

```
Main Dashboard Widget:
┌─────────────────────────────────────┐
│ 🎮 ATLAS Stats                       │
├─────────────────────────────────────┤
│ Level 7 Test Engineer                │
│ 2,450 / 3,000 XP to Level 8          │
│                                      │
│ Recent Achievements:                 │
│ 🏆 100 Test Cases                    │
│ ⚡ 7-Day Testing Streak              │
│                                      │
│ [Open ATLAS Workspace]               │
└─────────────────────────────────────┘
```

**Why Separate:**
- ATLAS gamification is testing-specific (different metrics)
- Avoids diluting main app with JIRA-specific features
- Preserves ATLAS as specialized tool
- Dashboard widget maintains visibility

### 5.3 Data Sharing Architecture

```typescript
// Shared entities (stored in main DB)
- Users
- Spaces (ATLAS gets dedicated space)
- Tasks (when synced from ATLAS)
- Habits (if ATLAS-integrated habit enabled)

// ATLAS-only entities (separate tables/schema)
- JiraTickets
- TestCases
- AiScenarioPredictions
- AtlasAchievements
- AtlasXPTracking

// Bridge table for cross-workspace references
interface WorkspaceBridge {
  main_task_id: string;
  atlas_ticket_id: string;
  sync_direction: "atlas_to_main" | "bidirectional";
  last_synced: Date;
}
```

---

## 6. Technical Recommendations

### 6.1 Database Schema Design

**Core Tables:**

```sql
-- Spaces (organizational layer)
CREATE TABLE spaces (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),  -- Hex color for UI
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (includes chores via maintenance_meta)
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  space_id UUID REFERENCES spaces(id),
  title VARCHAR(500) NOT NULL,
  status VARCHAR(20) DEFAULT 'not_started',
  priority VARCHAR(10) DEFAULT 'medium',
  due_date TIMESTAMP,

  -- Recurrence (JSONB for flexibility)
  recurrence JSONB,  -- { type, date_pattern, interval_pattern }

  -- Maintenance metadata (NULL for non-chore tasks)
  maintenance_meta JSONB,

  -- Dependencies
  parent_task_id UUID REFERENCES tasks(id),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  space_id UUID REFERENCES spaces(id),
  title VARCHAR(200) NOT NULL,
  frequency VARCHAR(20),  -- 'daily', 'weekly', 'custom'
  custom_frequency JSONB,  -- { days: [1,3,5] } for custom schedules

  -- ATLAS integration
  atlas_sync JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

-- Habit completions (for streak tracking)
CREATE TABLE habit_completions (
  id UUID PRIMARY KEY,
  habit_id UUID REFERENCES habits(id),
  completed_at TIMESTAMP DEFAULT NOW(),

  -- Optional mood capture
  mood_snapshot JSONB
);

-- Mood logs
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  energy_level INT CHECK (energy_level BETWEEN 1 AND 10),
  emotional_state VARCHAR(50),
  notes TEXT,

  -- Context
  logged_at TIMESTAMP DEFAULT NOW(),
  triggered_by VARCHAR(50)  -- 'habit_completion', 'manual', 'journal_entry'
);

-- Journal entries
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  space_id UUID REFERENCES spaces(id),

  content TEXT NOT NULL,
  template_used VARCHAR(100),

  -- Rich metadata
  mood_snapshot JSONB,
  spotify_capture JSONB,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Countdowns
CREATE TABLE countdowns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  space_id UUID REFERENCES spaces(id),

  title VARCHAR(200) NOT NULL,
  target_date TIMESTAMP NOT NULL,
  urgency_level VARCHAR(20) DEFAULT 'medium',

  -- Specialized countdown types
  countdown_type VARCHAR(50),  -- 'concert', 'vacation', 'deadline', 'birthday'
  concert_meta JSONB,  -- { venue, ticket_status, artists: [] }

  created_at TIMESTAMP DEFAULT NOW()
);

-- Calendar events (synced from Google Calendar)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),

  google_event_id VARCHAR(200) UNIQUE,  -- For sync tracking

  title VARCHAR(500) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  all_day BOOLEAN DEFAULT FALSE,

  -- Optional link to tasks
  linked_task_id UUID REFERENCES tasks(id),

  synced_at TIMESTAMP DEFAULT NOW()
);

-- ATLAS Workspace (separate schema)
CREATE SCHEMA atlas;

CREATE TABLE atlas.jira_tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),

  jira_key VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500),
  severity VARCHAR(20),

  -- AI predictions
  predicted_scenarios JSONB,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE atlas.workspace_bridge (
  id UUID PRIMARY KEY,
  main_task_id UUID REFERENCES public.tasks(id),
  atlas_ticket_id UUID REFERENCES atlas.jira_tickets(id),
  sync_direction VARCHAR(20),
  last_synced TIMESTAMP DEFAULT NOW()
);
```

### 6.2 API Architecture

**Recommendation: GraphQL for Complex Cross-Feature Queries**

```graphql
type Query {
  # Dashboard query (fetches everything for "Today" view)
  dashboard(date: Date!): Dashboard!

  # Mood-habit correlation
  habitMoodAnalytics(habitId: ID!, dateRange: DateRange!): Analytics!

  # Cross-feature search
  search(query: String!, filters: SearchFilters!): SearchResults!
}

type Dashboard {
  date: Date!

  # Aggregated data
  tasks: [Task!]!  # Due today or overdue
  habits: [Habit!]!  # Pending for today
  moodPrompt: MoodPrompt  # If no mood logged today
  upcomingMaintenance: [Task!]!  # Chores due soon
  urgentCountdowns: [Countdown!]!
  calendarEvents: [CalendarEvent!]!

  # Widgets
  spotifyNowPlaying: SpotifyTrack
  weather: WeatherData
  atlasStats: AtlasStats
}

type Mutation {
  # Smart task creation
  createTask(input: TaskInput!): Task!

  # Complete habit + optional mood log
  completeHabit(habitId: ID!, moodData: MoodInput): HabitCompletion!

  # Create journal with auto-capture
  createJournalEntry(
    content: String!,
    captureSpotify: Boolean = true,
    captureMood: Boolean = false
  ): JournalEntry!

  # ATLAS sync
  syncAtlasTicketToTask(ticketId: ID!): Task!
}
```

**Why GraphQL:**
- Dashboard needs data from 8+ features in one query
- Reduces over-fetching (important for mobile if added later)
- Strong typing helps with ADHD-friendly autocomplete/IDE support
- Subscriptions for real-time updates (habit streak alerts, etc.)

### 6.3 State Management

**Recommendation: React + Zustand (Lightweight, Less Boilerplate)**

```typescript
// stores/dashboardStore.ts
interface DashboardStore {
  todayData: Dashboard | null;
  loading: boolean;

  // Actions
  fetchDashboard: (date: Date) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  dismissNotification: (notifId: string) => void;

  // ADHD-specific
  focusMode: boolean;
  toggleFocusMode: () => void;
  undoStack: Action[];
  redo: () => void;
  undo: () => void;
}

// stores/habitStore.ts
interface HabitStore {
  habits: Habit[];
  todayCompletions: Set<string>;

  completeHabit: (habitId: string, withMoodLog?: boolean) => Promise<void>;

  // Analytics
  getHabitMoodCorrelation: (habitId: string) => Promise<Correlation>;
}
```

**Why Zustand over Redux:**
- Less boilerplate (critical for solo dev)
- Easier to add features incrementally
- Good TypeScript support
- Small bundle size

### 6.4 Integration Architecture

**External Services:**

```typescript
// services/integrations.ts

interface SpotifyService {
  getCurrentlyPlaying(): Promise<SpotifyTrack | null>;
  getRecentlyPlayed(limit: number): Promise<SpotifyTrack[]>;
}

interface GoogleCalendarService {
  syncEvents(since: Date): Promise<CalendarEvent[]>;
  createEvent(event: CalendarEvent): Promise<string>;  // Returns google_event_id
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<void>;

  // Bidirectional sync
  enableBidirectionalSync(): void;
}

interface WeatherService {
  getCurrentWeather(location: string): Promise<WeatherData>;
}

interface JiraService {
  fetchTicket(key: string): Promise<JiraTicket>;
  createTicket(data: JiraTicketInput): Promise<JiraTicket>;

  // MCP integration for ATLAS
  getPredictedScenarios(ticketKey: string): Promise<TestScenario[]>;
}
```

**Service Wrapper Pattern:**
```typescript
class IntegrationManager {
  private spotify: SpotifyService;
  private calendar: GoogleCalendarService;
  private weather: WeatherService;

  async captureJournalContext(): Promise<JournalContext> {
    return {
      spotify: await this.spotify.getCurrentlyPlaying(),
      weather: await this.weather.getCurrentWeather(USER_LOCATION),
      timestamp: new Date(),
    };
  }

  async syncTasksToCalendar(tasks: Task[]) {
    for (const task of tasks.filter(t => t.due_date)) {
      await this.calendar.createEvent({
        title: task.title,
        start_time: task.due_date,
        linked_task_id: task.id,
      });
    }
  }
}
```

---

## 7. Architecture Decision Records (ADRs)

### ADR-001: Consolidate Chores into Tasks

**Status:** Accepted

**Context:**
Chores/maintenance could be separate feature or extension of tasks.

**Decision:**
Implement as task extension with `maintenance_meta` JSONB field.

**Consequences:**
- ✅ Unified task management
- ✅ Reduced code duplication
- ✅ Simpler mental model for user
- ⚠️ Need dedicated "Maintenance Dashboard" widget
- ⚠️ Interval tracking adds complexity to task model

### ADR-002: ATLAS as Separate Workspace

**Status:** Accepted

**Context:**
ATLAS could be fully integrated or separate workspace.

**Decision:**
Separate workspace with shared data layer and optional sync.

**Consequences:**
- ✅ JIRA-specific features don't clutter main app
- ✅ Can evolve ATLAS independently
- ✅ Gamification stays contextual
- ⚠️ Need bridge table for cross-workspace references
- ⚠️ Dashboard widget required for visibility

### ADR-003: GraphQL Over REST

**Status:** Accepted

**Context:**
Dashboard needs data from 8+ features in single view.

**Decision:**
Use GraphQL for API layer.

**Consequences:**
- ✅ Efficient data fetching for dashboard
- ✅ Strong typing helps development
- ✅ Subscriptions enable real-time updates
- ⚠️ Learning curve if unfamiliar
- ⚠️ More complex server setup than REST

### ADR-004: Proactive Notifications with User Control

**Status:** Accepted

**Context:**
ADHD users benefit from reminders but can be overwhelmed by notifications.

**Decision:**
Implement priority-based notifications with granular disable options.

**Consequences:**
- ✅ Helpful without being intrusive
- ✅ User can customize to their needs
- ⚠️ Need clear notification settings UI
- ⚠️ Must track user preferences per notification type

### ADR-005: Mood Tracking as Standalone + Snapshots

**Status:** Accepted

**Context:**
Mood could be habit-only or standalone feature.

**Decision:**
Standalone mood logs + optional snapshots on habit/journal.

**Consequences:**
- ✅ Flexible: log mood anytime or triggered by habits
- ✅ Journal mood snapshots preserve context
- ✅ Habit-mood correlation analytics feasible
- ⚠️ Need to prevent duplicate mood logs (if habit completion prompts mood)

---

## 8. Implementation Roadmap

### Phase 1: Core Foundation (MVP)
1. **Database schema** (tasks, habits, spaces, mood_logs)
2. **Task management** (CRUD, dependencies, basic recurrence)
3. **Habit tracking** (CRUD, completion logging, streak calculation)
4. **Basic dashboard** (today view, overdue tasks, pending habits)
5. **Spaces** (create, assign to tasks/habits)

### Phase 2: Integrations
1. **Google Calendar sync** (bidirectional)
2. **Spotify integration** (now playing capture)
3. **Mood logging** (standalone + habit-triggered prompts)
4. **Journal** (rich text, templates, mood snapshots, Spotify capture)

### Phase 3: Advanced Features
1. **Chores/maintenance** (interval tracking, proactive dashboard widget)
2. **Countdowns** (general + concert specialization)
3. **Smart automations** (proactive notifications, context preservation)
4. **Weather integration** (dashboard widget)

### Phase 4: ATLAS Workspace
1. **ATLAS database schema** (JIRA tickets, test cases, gamification)
2. **MCP integration** (AI scenario predictions)
3. **Workspace bridge** (sync ATLAS → tasks)
4. **ATLAS dashboard widget** (XP, achievements, streaks)

### Phase 5: Analytics & Polish (v3+)
1. **Habit-mood correlation analytics**
2. **Task productivity insights**
3. **Maintenance cost tracking**
4. **Advanced filtering/search**
5. **Mobile optimization** (if desired)

---

## 9. Key Architectural Principles

### 9.1 ADHD-Optimized Design Patterns

**Reduce Decision Fatigue:**
- Smart defaults everywhere (due date = today, space = last used)
- Bulk operations with undo/redo
- One-click common actions ("Defer to tomorrow")

**Preserve Context:**
- Auto-save drafts (journal, task edits)
- "Resume where you left off" on dashboard
- Undo stack persists across sessions

**Minimize Interruptions:**
- Batch notifications (morning digest vs. constant pings)
- Focus Mode hides all non-critical alerts
- Dismissible prompts ("Don't ask again" option)

**Visual Clarity:**
- Color-coded spaces (consistent across features)
- Icons for task types, urgency levels
- Progress indicators (habit streaks, countdown timers)

### 9.2 Data Integrity Rules

**Cascading Deletes:**
- Delete space → archive (not delete) associated entities
- Delete habit → preserve completion history
- Delete task → remove calendar event (if synced)

**Sync Conflict Resolution:**
- Google Calendar sync: Calendar is source of truth for event times
- Task completion: App is source of truth (updates calendar)
- ATLAS sync: User prompted on conflicts ("JIRA ticket updated. Update task?")

**Audit Trail:**
- Track who created/modified entities (for ATLAS collaboration future)
- Preserve deleted entities for 30 days (soft delete)
- Completion history never deleted (for analytics)

---

## 10. System Context Diagram (C4 Model - Level 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                      Personal Productivity System                │
│                      (ADHD-Optimized)                            │
└───────────┬──────────────────────────────────────────────────────┘
            │
            │
            ▼
┌───────────────────┐
│   Solo Developer  │ ◄──── Uses ───► All Features
│   (ADHD User)     │
└───────────────────┘
            │
            │ Interacts with:
            │
    ┌───────┼───────┬───────┬───────┬───────────┐
    │       │       │       │       │           │
    ▼       ▼       ▼       ▼       ▼           ▼
┌────────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────────┐
│ Google │ │Spot-│ │Wea- │ │JIRA │ │MCP  │ │ Database│
│Calendar│ │ify  │ │ther │ │ API │ │Tools│ │(Postgres│
│  API   │ │ API │ │ API │ │     │ │     │ │  + S3)  │
└────────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────────┘
    │         │       │       │       │           │
    │         │       │       │       │           │
    └─────────┴───────┴───────┴───────┴───────────┘
                      │
                      ▼
              Data flows through:
              - GraphQL API
              - Real-time subscriptions
              - Background sync workers
```

---

## 11. Final Recommendations Summary

### ✅ Approved Architecture Decisions

1. **Chores = Tasks + Metadata** (no separate system)
2. **ATLAS = Separate Workspace** (shared data, optional sync)
3. **GraphQL API** (efficient cross-feature queries)
4. **Priority-Based Notifications** (user-controllable granularity)
5. **Spaces as Universal Org Layer** (applies to all features)
6. **Mood Snapshots + Standalone Logs** (flexible mood tracking)
7. **Spotify Auto-Capture on Journal** (ambient context preservation)

### 🔧 Technical Stack Recommendations

- **Frontend:** React + TypeScript + Zustand
- **Backend:** Node.js + GraphQL (Apollo Server)
- **Database:** PostgreSQL (JSONB for flexible metadata)
- **Real-time:** GraphQL Subscriptions
- **Storage:** S3 (for journal attachments, future photos)
- **Integrations:** Google Calendar API, Spotify Web API, OpenWeather API

### 🎯 ADHD-Specific Features Prioritized

1. **Undo/Redo** across all operations
2. **Focus Mode** (hide distractions)
3. **Smart Defaults** (reduce decisions)
4. **Context Preservation** (auto-save, resume sessions)
5. **Batch Notifications** (morning digest, not constant pings)
6. **One-Click Defer** (procrastination without guilt)

### 📊 Key Metrics to Track (Future Analytics)

- Habit completion rate (overall + per habit)
- Mood-habit correlations (energy levels post-exercise, etc.)
- Task completion velocity (by space, priority, day of week)
- Maintenance cost tracking (oil changes, HVAC service)
- ATLAS engagement (testing sessions per week, XP earned)

---

## Conclusion

This architecture prioritizes **context preservation**, **intelligent automation**, and **cognitive load reduction** for a solo developer with ADHD.

Key design wins:
- ✅ Unified data model (spaces everywhere)
- ✅ Smart consolidation (chores = tasks, not separate)
- ✅ Flexible integration (ATLAS separate but visible)
- ✅ Proactive assistance (notifications, automations)
- ✅ ADHD-friendly patterns (undo, focus mode, defaults)

The system should feel like a **trusted assistant**, not a rigid task manager—surfaces the right information at the right time without overwhelming the user.

**Next Steps:**
1. Review and approve architecture decisions
2. Refine mood logging feature details (deferred)
3. Implement Phase 1 (Core Foundation)
4. Iterate based on real-world usage patterns

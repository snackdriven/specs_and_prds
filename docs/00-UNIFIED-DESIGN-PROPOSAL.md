# Unified Design Proposal - Personal ADHD Productivity App

**Project Overview**: Desktop web application for single-user ADHD productivity management
**Status**: Comprehensive design synthesis from 8 specialist agents
**Last Updated**: 2025-11-16

---

## Executive Summary

This document synthesizes recommendations from 8 specialized design agents into a cohesive implementation plan for your personal ADHD productivity application. The system merges EDC/Daybeam concepts into a unified platform with ATLAS as a separate workspace.

**Core Philosophy**: ADHD-first design with progressive disclosure, minimal decision fatigue, and intelligent automation.

---

## 1. System Architecture Overview

### 1.1 Technology Stack (Optimized for Solo Dev)

**Frontend:**
- React 18 + TypeScript 5.9
- Vite for build tooling
- TailwindCSS for styling
- React Query for state management
- Desktop web only (no mobile)

**Backend:**
- PostgreSQL (via Supabase)
- Supabase Auth (Google OAuth)
- Supabase Realtime (live updates)
- Edge Functions for business logic

**Integrations:**
- Google Calendar API (bidirectional sync)
- Spotify Web API (now playing capture)
- Tomorrow.io Weather API
- ATLAS MCP (JIRA testing workspace)

**Deployment:**
- Vercel (frontend)
- Supabase (backend + database)
- Zero DevOps overhead

### 1.2 Database Architecture

**Core Tables:**
```sql
-- Tasks (includes maintenance/chores)
tasks (id, title, description, status, priority, due_date, estimated_minutes,
       task_type, maintenance_config, space_id, dependencies, created_at)

-- Habits
habits (id, name, frequency_type, target_count, space_id, created_at)
habit_logs (id, habit_id, completed_at, mood_at_time, streak_day)

-- Journal
journal_entries (id, content, mood_snapshot, spotify_context, template_id, created_at)

-- Calendar
calendar_events (id, title, start_time, end_time, google_event_id, task_id, sync_status)

-- Mood
mood_logs (id, quick_mood, intensity, energy, stress, tags, voice_note, created_at)

-- Spaces (organizational contexts)
spaces (id, name, color, icon, type) -- Work, Personal, Health, ATLAS

-- Countdowns
countdowns (id, title, target_date, urgency_tier, concert_metadata)

-- ATLAS Integration
atlas_tickets (id, jira_ticket_id, title, status, sync_enabled, workspace_visible)

-- Gamification
xp_events (id, source, type, xp_amount, context_tag, created_at)
user_stats (id, total_xp, level, current_streak, achievements)
```

### 1.3 Feature Interaction Map

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Primary Focus│  │Context Ribbon│  │ Secondary    │      │
│  │ "Start Here" │  │ 8 Widgets    │  │ Zone         │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│     TASKS       │  │    HABITS    │  │   JOURNAL    │
│ ┌─────────────┐ │  │              │  │              │
│ │  Chores     │ │  │ Mood         │  │ Templates    │
│ │  (type =    │ │  │ Correlation  │  │ Spotify      │
│ │ maintenance)│ │  │              │  │ Capture      │
│ └─────────────┘ │  │              │  │              │
│                 │  │              │  │              │
│ Dependencies    │  │ Streaks      │  │ Mood         │
│ Subtasks        │  │ Frequency    │  │ Snapshot     │
│ Recurring       │  │              │  │              │
└────────┬────────┘  └──────┬───────┘  └──────┬───────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                    ┌───────▼────────┐
                    │     SPACES     │
                    │ Work/Personal/ │
                    │ Health/ATLAS   │
                    └───────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐  ┌──────────────┐  ┌──────────────┐
│    CALENDAR    │  │   COUNTDOWNS │  │    ATLAS     │
│                │  │              │  │              │
│ Google Sync    │  │ 5 Urgency    │  │ MCP          │
│ Task           │  │ Tiers        │  │ Integration  │
│ Integration    │  │              │  │              │
│                │  │ Concerts     │  │ Workspace    │
└────────────────┘  └──────────────┘  └──────────────┘
         │                  │                  │
         └──────────────────┴──────────────────┘
                            │
                    ┌───────▼────────┐
                    │  GAMIFICATION  │
                    │ Unified XP     │
                    │ Achievements   │
                    └────────────────┘
```

---

## 2. Feature Specifications Synthesis

### 2.1 Tasks (Core Foundation)

**Scope**: Dependencies, subtasks, recurring, priorities, impact analysis
**Excludes**: Tags (Spaces serve this purpose)

**Key Features:**
1. **Dependencies**: Task A blocks Task B until completion
2. **Subtasks**: Nested tasks with independent tracking
3. **Recurring**: Daily/weekly/custom patterns with auto-generation
4. **Priorities**: High/Medium/Low with color coding
5. **Impact Analysis**: "What's blocked?" view showing dependency chains

**Chores Integration:**
- Chores are tasks with `task_type = 'maintenance'`
- Additional fields: `last_completed_at`, `maintenance_config`
- Separate dashboard view for upcoming maintenance
- Interval tracking: time-based (every 30 days) and metric-based (every 3000 miles)

**Example Maintenance Config:**
```json
{
  "interval_type": "hybrid",
  "interval_value": 90,
  "interval_unit": "days",
  "metric_name": "Odometer",
  "current_value": 25000,
  "target_value": 28000,
  "auto_create_task": true,
  "category": "Vehicle"
}
```

**Automations:**
- Auto-snooze low-priority tasks when schedule is full
- Dependency notification when blocker is completed
- Recurring task generation 24 hours before due date
- Energy-based task suggestions (match task energy to current mood energy)

### 2.2 Habits (Streaks & Frequency)

**Scope**: Core features, mood correlation, visual streaks
**Excludes**: Energy level tracking (covered by mood), heatmap (nice-to-have later), statistics (build if mood correlation requires)

**Key Features:**
1. **Streak Tracking**: Current streak, longest streak, visual indicators
2. **Frequency Types**:
   - Daily (every day)
   - Weekly (X times per week, any days)
   - Custom (every N days)
3. **Mood Correlation**: "How does exercise affect your mood?"
4. **Completion Logging**: One-tap check-in with optional mood capture

**UI Pattern:**
```
┌────────────────────────────────────────┐
│ 🏃 Exercise                  🔥 7 days │
│                                        │
│ ■ ■ ■ ■ ■ ■ ■   This week: 7/7       │
│                                        │
│ [✓ Complete Today]                    │
└────────────────────────────────────────┘
```

**Mood Correlation Analytics (V1):**
```sql
-- Calculate average mood before/after habit
WITH habit_completion_moods AS (
  SELECT
    hl.habit_id,
    hl.mood_at_time,
    LEAD(ml.quick_mood) OVER (ORDER BY hl.completed_at) as mood_after_2hrs
  FROM habit_logs hl
  LEFT JOIN mood_logs ml ON ml.created_at BETWEEN hl.completed_at AND hl.completed_at + INTERVAL '2 hours'
)
SELECT
  habit_id,
  AVG(mood_numeric_before) as avg_mood_before,
  AVG(mood_numeric_after) as avg_mood_after,
  AVG(mood_numeric_after) - AVG(mood_numeric_before) as mood_delta
FROM habit_completion_moods
GROUP BY habit_id;
```

### 2.3 Journal (Templates + Mood + Spotify)

**Scope**: Basic journaling, templates, mood snapshot, Spotify now playing
**Deferred**: Full mood system refinement

**15 Template Library** (from Agent 5):
1. Daily Reflection (5 min)
2. Morning Pages (10 min)
3. Gratitude Log (3 min)
4. Weekly Review (15 min)
5. Project Debrief (8 min)
6. Mood Deep Dive (7 min)
7. Energy Tracking (4 min)
8. Win Log (2 min)
9. Frustration Venting (free-form)
10. Future Self Letter (10 min)
11. Habit Reflection (6 min)
12. Social Battery Check (5 min)
13. Focus Session Notes (variable)
14. Monthly Review (20 min)
15. Quick Brain Dump (1 min)

**Template Structure:**
```typescript
interface JournalTemplate {
  name: string;
  category: 'daily' | 'weekly' | 'monthly' | 'situational';
  estimatedMinutes: number;
  moodPrompt: 'before' | 'after' | 'both' | 'none';
  spotifyCapture: 'auto' | 'manual' | 'none';
  sections: Array<{
    title: string;
    type: 'text' | 'bullet-list' | 'scale' | 'tags';
    required: boolean;
    placeholder?: string;
    maxLength?: number;
  }>;
}
```

**Spotify Integration:**
- Auto-capture on journal open (if playing)
- Display as card in entry: album art + track/artist
- Stored as JSONB in `journal_entries.spotify_context`
- OAuth flow: Spotify Developer App → User authorization → Refresh token storage

**Mood Snapshot:**
- Quick 1-tap emoji selector on journal save
- Optional: Swipe up for detailed mood (intensity, energy, stress)
- Links to `mood_logs` table for correlation analysis

### 2.4 Mood System (Hybrid Approach - Agent 6 Recommendation)

**ADHD Score: 9.5/10**

**Default Interaction (1-Tap):**
```
How are you feeling?
😫  😐  😊  😃  🤩
```

**Expanded Interaction (Swipe Up):**
```
┌────────────────────────────────────┐
│ How are you feeling?               │
│ 😊 Feeling Good                    │
│                                    │
│ Intensity:  ○ ○ ● (Light)         │
│ Energy:     ●●●○○                 │
│ Stress:     ●●○○○                 │
│                                    │
│ Tags: #work #exercise              │
│                                    │
│ [🎤 Voice Note] (optional)         │
└────────────────────────────────────┘
```

**Voice Note AI Processing:**
- Transcription via Web Speech API
- Sentiment extraction: "Feeling overwhelmed" → stress: 4/5
- Energy extraction: "Really tired" → energy: 1/5
- Context extraction: "Meeting was rough" → tag: #work

**Database Schema:**
```sql
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,

  -- Quick mood (always present)
  quick_mood mood_emoji_enum NOT NULL,

  -- Detailed mood (optional)
  intensity INT CHECK (intensity BETWEEN 1 AND 3),
  energy INT CHECK (energy BETWEEN 1 AND 5),
  stress INT CHECK (stress BETWEEN 1 AND 5),
  tags TEXT[],

  -- Voice note (optional)
  voice_note_transcription TEXT,
  voice_note_ai_sentiment NUMERIC,
  voice_note_ai_energy INT,
  voice_note_ai_contexts TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE mood_emoji_enum AS ENUM ('terrible', 'bad', 'okay', 'good', 'great');
```

**7 Alternative Approaches Considered** (all rejected in favor of hybrid):
1. Quick Emoji Only - too simple for insights
2. Detailed Form Only - too much friction
3. Voice-First - accessibility issues
4. Contextual Prompts - too intrusive
5. Passive Tracking - privacy concerns
6. Emoji + Slider - confusing dual input
7. **Hybrid** - ✓ Selected (best ADHD fit)

### 2.5 Dashboard (Time-Adaptive AI System)

**Layout Specification** (1440px × 900px):

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (80px)                                    [Avatar]   │
│ Good morning! ☀️  |  Current: Work Space  |  Level 12      │
├─────────────────────────────────────────────────────────────┤
│ PRIMARY FOCUS ZONE (320px)                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🎯 START HERE                                           │ │
│ │                                                         │ │
│ │ "Fix login bug" (Priority: High)                       │ │
│ │ Due in 2 hours • Est. 45 min • Energy: Medium          │ │
│ │                                                         │ │
│ │ Why now? You have 2 hours before your next meeting,    │ │
│ │ this is your highest priority task, and your current   │ │
│ │ energy level matches the task requirements.            │ │
│ │                                                         │ │
│ │ [▶ Start] [💤 Snooze] [📅 Reschedule]                 │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ CONTEXT RIBBON (120px) - 8 Mini Widgets                     │
│ [Weather] [Spotify] [Next Event] [Streak] [Quick Add]...   │
├─────────────────────────────────────────────────────────────┤
│ SECONDARY ZONE (scrollable)                                 │
│                                                             │
│ [Morning Kickstart Widget] [Habit Check-ins]               │
│ [Quick Wins] [Energy Matcher] [Upcoming Deadlines]         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**"Start Here" Algorithm:**
```sql
WITH available_time AS (
  SELECT COALESCE(
    EXTRACT(EPOCH FROM (MIN(start_time) - NOW())) / 60,
    240  -- Default 4 hours if no upcoming events
  ) AS minutes
  FROM calendar_events
  WHERE start_time > NOW() AND DATE(start_time) = CURRENT_DATE
),
current_energy AS (
  SELECT COALESCE(energy, 3) as level  -- Default to medium
  FROM mood_logs
  ORDER BY created_at DESC
  LIMIT 1
)
SELECT
  t.*,
  CASE
    -- Urgency scoring (0-40 points)
    WHEN t.due_time <= NOW() + INTERVAL '2 hours' THEN 40
    WHEN t.due_time <= NOW() + INTERVAL '4 hours' THEN 30
    WHEN t.due_date = CURRENT_DATE THEN 20
    ELSE 10
  END +
  CASE
    -- Priority scoring (0-30 points)
    WHEN t.priority = 'high' THEN 30
    WHEN t.priority = 'medium' THEN 20
    ELSE 10
  END +
  CASE
    -- Energy match scoring (0-20 points)
    WHEN ABS(t.energy_required - ce.level) = 0 THEN 20
    WHEN ABS(t.energy_required - ce.level) = 1 THEN 15
    ELSE 5
  END +
  CASE
    -- Time availability scoring (0-10 points)
    WHEN t.estimated_duration <= at.minutes * 0.8 THEN 10
    WHEN t.estimated_duration <= at.minutes THEN 5
    ELSE 0
  END AS recommendation_score
FROM tasks t
CROSS JOIN available_time at
CROSS JOIN current_energy ce
WHERE
  t.status = 'incomplete'
  AND t.blocked = false
  AND (t.space_id = current_space_id OR current_space_id IS NULL)
ORDER BY recommendation_score DESC
LIMIT 1;
```

**Time-Based Adaptation:**

| Time Period | Primary Focus | Context Ribbon Widgets | Secondary Zone |
|-------------|--------------|------------------------|----------------|
| Morning (5am-11am) | Morning Kickstart | Weather, Top 3 Tasks, Habit Check-ins | Streak Saver, Daily Goals |
| Midday (11am-3pm) | Energy Matcher | Next Event, Quick Wins, Focus Block | Task Dependencies, Calendar |
| Afternoon (3pm-6pm) | Deadline Urgency | Upcoming Deadlines, Spotify, Countdown | End-of-Day Wrap, Tomorrow Prep |
| Evening (6pm-10pm) | Habit Wrap-Up | Habit Check-ins, Journal Prompt, Wins | Weekly Review (Fridays), Reflection |
| Night (10pm-5am) | Wind Down | Tomorrow's Top 3, Gratitude, Streak Status | Sleep Suggestions, Next Day Preview |

**10 Smart Widgets:**

1. **Morning Kickstart** - Top 3 tasks for the day
2. **Streak Saver** - Habits at risk of breaking
3. **Focus Block** - 90-minute deep work session timer
4. **Quick Wins** - Tasks under 15 minutes
5. **Energy Matcher** - Tasks matching current energy level
6. **Deadline Urgency** - Tasks due within 48 hours
7. **Habit Check-ins** - Today's pending habits
8. **Weekly Milestones** - Progress toward weekly goals
9. **Blocked Tasks** - Tasks waiting on dependencies
10. **Brain Dump Zone** - Quick capture input

### 2.6 Calendar (Google Sync + Task Integration)

**Scope**: Month/Week/Day/Agenda views, bidirectional Google sync, task time blocking
**Deferred**: Natural language parsing ("schedule meeting tomorrow at 2pm")

**View Modes** (implementing 4 of 8):
1. **Month View** - Overview with event dots
2. **Week View** - Default, 7-day horizontal scroll
3. **Day View** - Hour-by-hour timeline
4. **Agenda View** - Chronological list

**Google Calendar Sync:**

**Flow:**
```
User → OAuth Consent → Google Authorization → Refresh Token Storage
     → Background Sync (every 15 min) → Conflict Detection → Resolution
```

**Conflict Resolution Strategy:**
```typescript
enum SyncConflictResolution {
  GOOGLE_WINS = 'google',      // Default for external meetings
  LOCAL_WINS = 'local',        // User edited locally within last 5 min
  MANUAL_REVIEW = 'manual'     // Conflicting edits within same minute
}

interface SyncConflict {
  event_id: string;
  local_version: CalendarEvent;
  google_version: CalendarEvent;
  conflict_fields: string[];  // ['title', 'start_time']
  resolution: SyncConflictResolution;
  resolved_at?: Date;
}
```

**Task → Calendar Integration:**
```typescript
// Auto-create calendar event when task has due_date + due_time
async function createCalendarEventFromTask(task: Task) {
  if (!task.due_date || !task.due_time) return;

  const event: CalendarEvent = {
    title: `[Task] ${task.title}`,
    description: task.description,
    start_time: combineDateAndTime(task.due_date, task.due_time),
    end_time: addMinutes(
      combineDateAndTime(task.due_date, task.due_time),
      task.estimated_minutes || 60
    ),
    task_id: task.id,
    auto_created_from_task: true,
    sync_to_google: true
  };

  await db.calendar_events.create({ data: event });
  await syncToGoogleCalendar(event);
}
```

**Bidirectional Sync:**
- Local edit → Update Google (within 1 minute)
- Google edit → Update local (background sync every 15 min)
- Task completion → Mark calendar event as completed
- Calendar event deletion → Does NOT delete task (unlinks only)

### 2.7 Spotify Integration (Now Playing + Journal)

**OAuth Flow:**
```
1. User clicks "Connect Spotify"
2. Redirect to Spotify authorization
3. Receive access token + refresh token
4. Store refresh token in user_settings.spotify_refresh_token
5. Background refresh access token every 55 minutes
```

**Now Playing Widget** (Context Ribbon):
```
┌──────────────────────────┐
│ 🎵 Currently Playing     │
│ ──────────────────────   │
│ [Album Art]              │
│                          │
│ "Blinding Lights"        │
│ The Weeknd               │
│                          │
│ [▶/❚❚] [❤]              │
└──────────────────────────┘
```

**Journal Auto-Capture:**
```typescript
// Triggered on journal entry creation
async function captureSpotifyForJournal(entryId: string) {
  const nowPlaying = await spotifyAPI.getCurrentlyPlaying();

  if (!nowPlaying?.is_playing) return null;

  const spotifyContext = {
    track_id: nowPlaying.item.id,
    track_name: nowPlaying.item.name,
    artist_name: nowPlaying.item.artists[0].name,
    album_name: nowPlaying.item.album.name,
    album_art_url: nowPlaying.item.album.images[1].url,  // Medium size
    captured_at: new Date(),
    listening_since: nowPlaying.progress_ms
  };

  await db.journal_entries.update({
    where: { id: entryId },
    data: { spotify_context: spotifyContext }
  });

  return spotifyContext;
}
```

**Display in Journal Entry:**
```
┌────────────────────────────────────────┐
│ Journal Entry - Nov 16, 2025           │
├────────────────────────────────────────┤
│                                        │
│ [Journal content here...]              │
│                                        │
├────────────────────────────────────────┤
│ 🎵 Listening to:                       │
│ ┌──────────────────────────────────┐   │
│ │ [Album Art]  "Track Name"        │   │
│ │              Artist Name         │   │
│ │              Album Name          │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘
```

### 2.8 Weather (Tomorrow.io API + Smart Suggestions)

**API Integration:**
```typescript
interface WeatherData {
  current: {
    temperature: number;
    feels_like: number;
    condition: string;  // "Clear", "Rainy", "Cloudy"
    precipitation_probability: number;
    wind_speed: number;
  };
  forecast_4day: Array<{
    date: Date;
    high: number;
    low: number;
    condition: string;
    precipitation_probability: number;
  }>;
}

// Fetch every 30 minutes, cache for 25 minutes
async function fetchWeather() {
  const response = await fetch(
    `https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,weatherCode&apikey=${API_KEY}`
  );
  return transformToWeatherData(response);
}
```

**Context Ribbon Widget:**
```
┌──────────────────┐
│ 🌤️ 72°F          │
│ Partly Cloudy    │
│ High: 78° Low: 65│
└──────────────────┘
```

**Smart Suggestions Based on Weather:**
```typescript
function generateWeatherSuggestions(weather: WeatherData): string[] {
  const suggestions = [];

  if (weather.current.precipitation_probability > 70) {
    suggestions.push("Don't forget an umbrella! ☔");
    suggestions.push("Consider rescheduling outdoor tasks.");
  }

  if (weather.current.temperature < 50) {
    suggestions.push("Dress warmly! 🧥");
  }

  if (weather.current.temperature > 85) {
    suggestions.push("Stay hydrated! 💧");
    suggestions.push("Outdoor exercise might be tough today.");
  }

  if (weather.current.condition === 'Clear' && weather.current.temperature between 65-75) {
    suggestions.push("Perfect weather for outdoor tasks! 🌞");
  }

  return suggestions;
}
```

**Integration with Tasks:**
- Tag outdoor tasks: `outdoor: true`
- Display weather icon next to outdoor tasks
- Suggest rescheduling if precipitation > 50%
- Dashboard widget: "Outdoor task alert: Rain expected at 2pm"

### 2.9 Countdowns (5 Urgency Tiers + Concerts)

**5 Urgency Tiers:**

| Tier | Color | Time Range | Display | Update Frequency |
|------|-------|------------|---------|------------------|
| Critical | Red | < 24 hours | "18 hours 23 min" | Every minute |
| Urgent | Orange | 1-7 days | "5 days 14 hours" | Every hour |
| Soon | Yellow | 1-4 weeks | "12 days" | Every 12 hours |
| Upcoming | Blue | 1-3 months | "6 weeks" | Daily |
| Distant | Gray | > 3 months | "4 months" | Weekly |

**Countdown Widget** (Context Ribbon):
```
┌─────────────────────────────┐
│ 🎯 Next Countdown           │
│ "Conference Presentation"   │
│ ⏰ 2 days 5 hours           │
│ [View All]                  │
└─────────────────────────────┘
```

**Concert Countdown (6-Stage Workflow):**

```typescript
interface ConcertCountdown extends Countdown {
  concert_metadata: {
    artist: string;
    venue: string;
    ticket_status: TicketStatus;
    ticket_link?: string;
    setlist_check: boolean;
    playlist_created: boolean;
    travel_planned: boolean;
  };
}

enum TicketStatus {
  PRE_SALE = 'pre_sale',           // Stage 1: Awaiting pre-sale
  GENERAL_SALE = 'general_sale',   // Stage 2: Awaiting general sale
  PURCHASED = 'purchased',         // Stage 3: Tickets secured
  CONFIRMED = 'confirmed',         // Stage 4: Confirmation received
  READY = 'ready',                 // Stage 5: Setlist checked, playlist made
  ATTENDED = 'attended'            // Stage 6: Concert complete
}
```

**Concert Workflow Automations:**
- **T-minus 30 days**: Create task "Check setlist from recent shows"
- **T-minus 14 days**: Create task "Plan travel/parking"
- **T-minus 7 days**: Create habit "Listen to artist playlist"
- **T-minus 1 day**: Create task "Charge phone, print tickets"
- **Day of**: Dashboard widget: "Concert tonight! 🎸"
- **Day after**: Journal prompt: "How was the concert?"

### 2.10 Spaces (Global Filter + Analytics)

**4 Core Spaces:**
1. **Work** - Tasks, calendar events, ATLAS tickets (when enabled)
2. **Personal** - Tasks, habits, journal, countdowns
3. **Health** - Habits (exercise, sleep), mood logs
4. **ATLAS** - Separate workspace (optional sync to Work)

**Global Space Filter:**
```
┌────────────────────────────────────────┐
│ Current Space: [Work ▼]                │
│                                        │
│ [All Work items shown below...]       │
└────────────────────────────────────────┘
```

**Space Toggle Behavior:**
- Filters dashboard, tasks, calendar, habits
- Does NOT filter journal (always shows all)
- ATLAS space is separate workspace with toggle to show in Work

**Space Analytics:**
```typescript
interface SpaceAnalytics {
  space_id: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  avg_task_duration: number;
  total_time_spent: number;  // minutes
  xp_earned: number;
  mood_trend: number[];  // Last 7 days average
}

// Example query
SELECT
  s.name as space_name,
  COUNT(t.id) as total_tasks,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_tasks,
  ROUND(COUNT(t.id) FILTER (WHERE t.status = 'completed')::numeric / COUNT(t.id) * 100, 2) as completion_rate,
  SUM(t.actual_duration) as total_time_spent,
  SUM(xe.xp_amount) as xp_earned
FROM spaces s
LEFT JOIN tasks t ON t.space_id = s.id
LEFT JOIN xp_events xe ON xe.context_tag = s.name
WHERE s.user_id = $1
GROUP BY s.id;
```

**Space-Specific Settings:**
- Custom color/icon per space
- Separate XP tracking with unified totals
- Space-specific dashboard widgets
- Work space = Calendar + ATLAS integration
- Personal space = Countdowns + Spotify

### 2.11 ATLAS Integration (JIRA MCP + Workspace)

**Architecture Overview:**
```
JIRA Cloud ← MCP Server → PostgreSQL → App Frontend
    ↑                           ↓
    └────── Webhooks ───────────┘
```

**MCP Server Functions:**
1. Fetch tickets by JQL query
2. Update ticket status
3. Add comments
4. Create test execution records
5. AI predictions (Flow-Nexus LSTM)

**Workspace Toggle:**
```typescript
interface ATLASWorkspaceSettings {
  enabled: boolean;  // Show ATLAS in main app
  sync_to_work_space: boolean;  // Display tickets in Work space
  visual_distinction: 'blue_label' | 'separate_section';
  sync_frequency: 'realtime' | 'background_15min' | 'manual';
}
```

**ATLAS Ticket Display in Work Space:**
```
┌────────────────────────────────────────┐
│ Work Space Tasks                       │
├────────────────────────────────────────┤
│ ☑ Regular task                         │
│ ☐ Another regular task                 │
│ 🔵 [ATLAS] PROJ-123: Fix login bug    │
│ 🔵 [ATLAS] PROJ-124: Add validation   │
└────────────────────────────────────────┘
```

**Unified XP System:**
```typescript
enum XPEventType {
  TASK_COMPLETE = 'task_complete',           // +10 XP
  HABIT_STREAK_MILESTONE = 'habit_streak',   // +50 XP (7 day streak)
  ATLAS_TEST_SESSION = 'atlas_session',      // +25 XP per session
  ATLAS_BUG_FOUND = 'atlas_bug',            // +15 XP per bug
  JOURNAL_ENTRY = 'journal_entry',          // +5 XP
  PERFECT_DAY = 'perfect_day'               // +100 XP (all habits + tasks)
}

interface XPEvent {
  source: 'personal' | 'work';
  type: XPEventType;
  xp_amount: number;
  context_tag: string;  // Preserves work/personal distinction
  created_at: Date;
}

// Total XP calculation
SELECT
  SUM(xp_amount) as total_xp,
  SUM(xp_amount) FILTER (WHERE source = 'personal') as personal_xp,
  SUM(xp_amount) FILTER (WHERE source = 'work') as work_xp
FROM xp_events
WHERE user_id = $1;
```

**ATLAS Testing Session Workflow:**
```
1. User clicks "Start ATLAS Session" in Work space
2. App fetches tickets from JIRA via MCP
3. Display tickets in testing dashboard
4. User tests and logs results
5. MCP updates JIRA with findings
6. Award XP for session completion
7. Track testing metrics (bugs found, time spent)
```

**AI Predictions (Flow-Nexus LSTM):**
```typescript
// Predict bug probability based on historical patterns
interface BugPrediction {
  ticket_id: string;
  bug_probability: number;  // 0.0 - 1.0
  confidence: number;       // 0.0 - 1.0
  suggested_focus_areas: string[];
  historical_patterns: {
    similar_tickets: number;
    bug_rate: number;
  };
}

// Example MCP call
const prediction = await mcp__flow_nexus__neural_predict({
  model_id: 'atlas-bug-predictor',
  input_data: {
    ticket_type: 'Story',
    complexity: 'High',
    sprint_velocity: 32,
    developer_experience: 3.5
  }
});
```

---

## 3. Workflow Automations (30+ Rules from Agent 1)

### 3.1 Task Automations

**Auto-Snooze Low Priority:**
```typescript
// Runs daily at 6am
async function autoSnoozeLowPriorityTasks() {
  const todaysTasks = await db.tasks.count({
    where: {
      due_date: today,
      status: 'incomplete'
    }
  });

  if (todaysTasks > 10) {
    await db.tasks.updateMany({
      where: {
        due_date: today,
        priority: 'low',
        status: 'incomplete'
      },
      data: {
        due_date: tomorrow,
        auto_snoozed: true,
        snooze_reason: 'Schedule overload'
      }
    });
  }
}
```

**Dependency Notification:**
```typescript
// Triggered on task completion
async function notifyDependentTasks(completedTaskId: string) {
  const unblockedTasks = await db.tasks.findMany({
    where: {
      dependencies: { has: completedTaskId },
      status: 'incomplete'
    }
  });

  for (const task of unblockedTasks) {
    await createNotification({
      type: 'dependency_unblocked',
      title: 'Task Unblocked!',
      message: `"${task.title}" is now ready to start.`,
      action_url: `/tasks/${task.id}`
    });
  }
}
```

**Energy-Based Suggestions:**
```typescript
// Runs when mood is logged
async function suggestEnergyMatchedTasks(moodLogId: string) {
  const mood = await db.mood_logs.findUnique({ where: { id: moodLogId } });

  const matchedTasks = await db.tasks.findMany({
    where: {
      status: 'incomplete',
      energy_required: mood.energy,  // 1-5 scale
      due_date: { lte: addDays(today, 3) }
    },
    orderBy: { priority: 'desc' },
    take: 3
  });

  if (matchedTasks.length > 0) {
    await createDashboardSuggestion({
      type: 'energy_match',
      title: 'Perfect energy for these tasks!',
      tasks: matchedTasks
    });
  }
}
```

### 3.2 Habit Automations

**Streak Saver Alerts:**
```typescript
// Runs at 8pm daily
async function streakSaverAlerts() {
  const pendingHabits = await db.query(`
    SELECT h.*,
      COALESCE(MAX(hl.completed_at)::date, '1900-01-01') as last_completion
    FROM habits h
    LEFT JOIN habit_logs hl ON hl.habit_id = h.id
    WHERE h.frequency_type = 'daily'
      AND NOT EXISTS (
        SELECT 1 FROM habit_logs
        WHERE habit_id = h.id
          AND DATE(completed_at) = CURRENT_DATE
      )
    GROUP BY h.id
    HAVING COALESCE(MAX(hl.completed_at)::date, '1900-01-01') = CURRENT_DATE - 1
  `);

  for (const habit of pendingHabits) {
    await createNotification({
      type: 'streak_at_risk',
      title: `🔥 Don't break your ${habit.name} streak!`,
      message: 'You still have time to check in today.',
      urgency: 'high'
    });
  }
}
```

### 3.3 Journal Automations

**Evening Reflection Prompt:**
```typescript
// Runs at 9pm daily
async function eveningReflectionPrompt() {
  const todayEntries = await db.journal_entries.count({
    where: {
      created_at: { gte: startOfDay(today) }
    }
  });

  if (todayEntries === 0) {
    await createNotification({
      type: 'journal_reminder',
      title: 'How was your day?',
      message: 'Take 5 minutes to reflect with the Daily Reflection template.',
      action_url: '/journal/new?template=daily-reflection'
    });
  }
}
```

### 3.4 Calendar Automations

**Task Time Blocking:**
```typescript
// Triggered when task with due_date+due_time is created
async function createTimeBlockForTask(taskId: string) {
  const task = await db.tasks.findUnique({ where: { id: taskId } });

  if (!task.due_date || !task.due_time) return;

  // Check for conflicts
  const conflicts = await db.calendar_events.count({
    where: {
      start_time: { lte: task.due_time },
      end_time: { gte: task.due_time }
    }
  });

  if (conflicts > 0) {
    await createNotification({
      type: 'scheduling_conflict',
      title: 'Time conflict detected',
      message: `Task "${task.title}" overlaps with existing calendar event.`
    });
    return;
  }

  await db.calendar_events.create({
    data: {
      title: `[Task] ${task.title}`,
      start_time: task.due_time,
      end_time: addMinutes(task.due_time, task.estimated_minutes || 60),
      task_id: task.id,
      auto_created_from_task: true,
      sync_to_google: true
    }
  });
}
```

### 3.5 Maintenance (Chores) Automations

**Auto-Generate Upcoming Maintenance:**
```typescript
// Runs daily at 7am
async function generateMaintenanceTasks() {
  const maintenanceTasks = await db.tasks.findMany({
    where: {
      task_type: 'maintenance',
      status: 'completed',
      maintenance_config: { not: null }
    }
  });

  for (const task of maintenanceTasks) {
    const config = task.maintenance_config;
    const nextDueDate = calculateNextMaintenanceDate(
      task.last_completed_at,
      config.interval_value,
      config.interval_unit
    );

    // Generate task 7 days before due date
    if (isWithinDays(nextDueDate, 7)) {
      const existingTask = await db.tasks.findFirst({
        where: {
          parent_maintenance_id: task.id,
          status: 'incomplete'
        }
      });

      if (!existingTask && config.auto_create_task) {
        await db.tasks.create({
          data: {
            title: task.title,
            description: task.description,
            task_type: 'maintenance',
            due_date: nextDueDate,
            parent_maintenance_id: task.id,
            maintenance_config: config,
            priority: 'medium'
          }
        });
      }
    }
  }
}
```

---

## 4. Implementation Roadmap

### Phase 1: Core Foundation (Weeks 1-4)

**Week 1-2: Database + Auth**
- PostgreSQL schema setup (Supabase)
- Google OAuth implementation
- Basic user settings table
- Spaces table and seed data

**Week 3-4: Tasks + UI Shell**
- Tasks table and CRUD operations
- Basic dashboard layout
- Task list component
- Task dependencies logic
- Recurring task generation

**Deliverables:**
- ✓ User can log in with Google
- ✓ User can create/edit/complete tasks
- ✓ Tasks can have dependencies
- ✓ Basic dashboard shows task list

### Phase 2: Habits + Mood (Weeks 5-7)

**Week 5: Habits**
- Habits table and CRUD
- Habit logs table
- Streak calculation logic
- Habit check-in UI

**Week 6-7: Mood System**
- Mood logs table
- Hybrid mood logging UI (1-tap + expand)
- Mood-habit correlation queries
- Dashboard mood widget

**Deliverables:**
- ✓ User can track daily habits
- ✓ Streak visualization works
- ✓ Mood logging is quick and optional
- ✓ Basic correlation insights available

### Phase 3: Journal + Spotify (Weeks 8-9)

**Week 8: Journal**
- Journal entries table
- Template system
- Basic journal editor
- Template selector UI

**Week 9: Spotify Integration**
- Spotify OAuth flow
- Now playing widget
- Journal auto-capture
- Spotify context display in entries

**Deliverables:**
- ✓ User can create journal entries
- ✓ Templates guide journaling
- ✓ Spotify context automatically captured
- ✓ Now playing widget works

### Phase 4: Calendar + Google Sync (Weeks 10-12)

**Week 10: Calendar UI**
- Calendar events table
- Week view component
- Month view component
- Day view component

**Week 11-12: Google Sync**
- Google Calendar OAuth
- Bidirectional sync logic
- Conflict detection
- Task-to-calendar integration

**Deliverables:**
- ✓ User can view calendar
- ✓ Google Calendar syncs bidirectionally
- ✓ Tasks with times appear on calendar
- ✓ Conflicts are detected and resolved

### Phase 5: Dashboard Intelligence (Weeks 13-14)

**Week 13: Smart Widgets**
- "Start Here" algorithm implementation
- Context Ribbon widgets
- Time-based adaptation logic
- Widget personalization

**Week 14: Dashboard Polish**
- Drag-drop layout
- Saved layouts
- Performance optimization
- Loading states

**Deliverables:**
- ✓ Dashboard shows AI-recommended task
- ✓ Context Ribbon displays relevant widgets
- ✓ Dashboard adapts to time of day
- ✓ User can customize layout

### Phase 6: Integrations + Chores (Weeks 15-17)

**Week 15: Chores/Maintenance**
- Maintenance config on tasks
- Interval tracking logic
- Auto-generation of maintenance tasks
- Maintenance dashboard view

**Week 16: Weather + Countdowns**
- Weather API integration
- Weather widget
- Countdowns table and UI
- Concert countdown workflow

**Week 17: Spaces + Polish**
- Global space filter
- Space analytics
- Space-specific dashboard widgets
- Integration testing

**Deliverables:**
- ✓ Chores auto-generate based on intervals
- ✓ Weather affects outdoor task suggestions
- ✓ Countdowns work with urgency tiers
- ✓ Spaces filter all content correctly

### Phase 7: ATLAS Integration (Weeks 18-19)

**Week 18: ATLAS MCP**
- ATLAS tickets table
- MCP server connection
- JIRA webhook setup
- Ticket sync logic

**Week 19: ATLAS Workspace**
- ATLAS workspace UI
- Work space integration toggle
- Unified XP system
- Testing session workflow

**Deliverables:**
- ✓ JIRA tickets sync to ATLAS workspace
- ✓ ATLAS tickets can appear in Work space
- ✓ XP system tracks work + personal
- ✓ Testing sessions award XP

### Phase 8: Automations + Polish (Week 20+)

**Week 20: Automation Rules**
- Implement 30+ automation rules
- Notification system
- Background job scheduler
- Error handling

**Week 21+: Testing + Refinement**
- End-to-end testing
- Performance optimization
- Bug fixes
- User feedback iteration

**Deliverables:**
- ✓ All automations run reliably
- ✓ Notifications are timely and relevant
- ✓ System is fast and responsive
- ✓ No critical bugs

---

## 5. Technical Implementation Details

### 5.1 Database Schema (Complete)

**See Agent 1 Output:** `docs/technical-implementation-guide.md`

**Key Tables:**
- `users` - User accounts and settings
- `spaces` - Organizational contexts
- `tasks` - Tasks + chores (hybrid approach)
- `habits` - Habit definitions
- `habit_logs` - Habit check-ins
- `journal_entries` - Journal entries
- `mood_logs` - Mood tracking
- `calendar_events` - Calendar + Google sync
- `countdowns` - Countdowns + concerts
- `atlas_tickets` - JIRA ticket sync
- `xp_events` - Gamification
- `user_stats` - Levels, streaks, achievements
- `notifications` - User notifications
- `spotify_tokens` - Spotify OAuth tokens

### 5.2 API Endpoints

**Tasks:**
```
GET    /api/tasks                    # List tasks (filtered by space)
POST   /api/tasks                    # Create task
GET    /api/tasks/:id                # Get task details
PATCH  /api/tasks/:id                # Update task
DELETE /api/tasks/:id                # Delete task
POST   /api/tasks/:id/complete       # Complete task
GET    /api/tasks/:id/dependencies   # Get dependency tree
```

**Habits:**
```
GET    /api/habits                   # List habits
POST   /api/habits                   # Create habit
GET    /api/habits/:id/logs          # Get habit logs
POST   /api/habits/:id/check-in      # Log habit completion
GET    /api/habits/:id/streak        # Get streak info
```

**Journal:**
```
GET    /api/journal                  # List entries
POST   /api/journal                  # Create entry
GET    /api/journal/:id              # Get entry
GET    /api/templates                # List templates
POST   /api/journal/spotify-capture  # Capture now playing
```

**Calendar:**
```
GET    /api/calendar/events          # List events
POST   /api/calendar/events          # Create event
GET    /api/calendar/sync            # Trigger Google sync
GET    /api/calendar/conflicts       # Get sync conflicts
POST   /api/calendar/resolve-conflict # Resolve conflict
```

**Dashboard:**
```
GET    /api/dashboard/start-here     # Get AI recommendation
GET    /api/dashboard/widgets        # Get active widgets
POST   /api/dashboard/layout         # Save layout
```

**Integrations:**
```
GET    /api/spotify/now-playing      # Get current track
POST   /api/spotify/authorize        # OAuth callback
GET    /api/weather                  # Get weather data
GET    /api/atlas/tickets            # Get JIRA tickets
POST   /api/atlas/session            # Start testing session
```

### 5.3 Frontend Components

**Core Components:**
```typescript
// Dashboard
<Dashboard />
  <PrimaryFocusZone />
    <StartHereWidget />
  <ContextRibbon />
    <WeatherWidget />
    <SpotifyWidget />
    <NextEventWidget />
  <SecondaryZone />
    <MorningKickstartWidget />
    <StreakSaverWidget />
    <QuickWinsWidget />

// Tasks
<TaskList space={currentSpace} />
<TaskDetail taskId={id} />
<TaskDependencyTree taskId={id} />
<MaintenanceDashboard />

// Habits
<HabitList />
<HabitCheckIn habitId={id} />
<HabitStreakView habitId={id} />
<HabitMoodCorrelation habitId={id} />

// Journal
<JournalList />
<JournalEditor templateId={id} />
<TemplateSelector />
<SpotifyCapture />

// Calendar
<CalendarView mode="week" />
<GoogleSyncStatus />
<ConflictResolver conflicts={conflicts} />

// Mood
<MoodLogger mode="quick" />
<MoodLoggerDetailed />
<VoiceNoteCapture />
```

### 5.4 State Management

**React Query for Server State:**
```typescript
// Tasks
const { data: tasks } = useQuery(['tasks', spaceId], () =>
  fetchTasks(spaceId)
);

const completeMutation = useMutation(
  (taskId: string) => completeTask(taskId),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      queryClient.invalidateQueries(['dashboard']);
    }
  }
);
```

**Zustand for Client State:**
```typescript
interface AppStore {
  currentSpace: Space | null;
  setCurrentSpace: (space: Space) => void;
  dashboardLayout: WidgetLayout[];
  setDashboardLayout: (layout: WidgetLayout[]) => void;
}

const useAppStore = create<AppStore>((set) => ({
  currentSpace: null,
  setCurrentSpace: (space) => set({ currentSpace: space }),
  dashboardLayout: [],
  setDashboardLayout: (layout) => set({ dashboardLayout: layout })
}));
```

---

## 6. Open Questions & Deferred Decisions

### 6.1 Calendar Implementation

**Question:** Which view modes to prioritize?
**Options:** Month, Week, Day, Agenda, List, Timeline, 3-Day, Split
**Recommendation:** Week (primary), Month, Day, Agenda (defer others)

**Question:** Natural language parsing?
**Status:** Deferred to Phase 9+ (non-critical for MVP)

### 6.2 Mood System Refinement

**Question:** Which mood approach to finalize?
**Status:** User said "need to refine mood later, i dont like most of those"
**Recommendation:** Review Agent 6 alternatives, likely go with Hybrid (ADHD score 9.5/10)

### 6.3 Analytics Dashboard

**Question:** When to build analytics?
**Status:** User said "defer completely until like 3 iterations in"
**Plan:** Phase 9+ (post-MVP)

### 6.4 Tech Stack Final Decisions

**Frontend Framework:**
- React 18 vs React 19?
- **Recommendation:** React 18 (more stable, better ecosystem)

**Backend:**
- Supabase vs Encore.dev vs custom Express?
- **Recommendation:** Supabase (managed PostgreSQL, Auth, Realtime, best for solo dev)

**Deployment:**
- Vercel vs Netlify vs Railway?
- **Recommendation:** Vercel (best React support, easy preview deployments)

**Testing:**
- Jest + React Testing Library vs Vitest?
- **Recommendation:** Vitest (faster, better Vite integration)

---

## 7. Success Metrics

**MVP Success Criteria:**

1. **Tasks:**
   - ✓ Can create task with dependencies
   - ✓ Recurring tasks auto-generate
   - ✓ Chores track maintenance intervals
   - ✓ Blocked tasks show clearly

2. **Habits:**
   - ✓ Streak tracking accurate
   - ✓ One-tap check-in works
   - ✓ Mood correlation shows insights

3. **Journal:**
   - ✓ Templates guide entries
   - ✓ Spotify context auto-captured
   - ✓ Mood snapshot integrated

4. **Dashboard:**
   - ✓ "Start Here" recommends intelligently
   - ✓ Context Ribbon shows 8 widgets
   - ✓ Time-based adaptation works
   - ✓ Dashboard loads in < 2 seconds

5. **Calendar:**
   - ✓ Google sync bidirectional
   - ✓ Conflicts detected and resolved
   - ✓ Task time blocks created

6. **Integrations:**
   - ✓ Spotify now playing accurate
   - ✓ Weather updates every 30 min
   - ✓ Countdowns show urgency tiers
   - ✓ ATLAS tickets sync from JIRA

7. **Automations:**
   - ✓ Streak saver alerts at 8pm
   - ✓ Low-priority auto-snooze works
   - ✓ Dependency notifications sent
   - ✓ Maintenance tasks auto-generate

**Performance Targets:**
- Dashboard load: < 2 seconds
- Task list render: < 500ms
- Calendar sync: < 5 seconds
- Database queries: < 100ms (p95)

**ADHD-Friendly Metrics:**
- Time to first action: < 5 seconds
- Clicks to complete task: ≤ 2
- Friction score: < 3/10 (user feedback)
- Decision fatigue: Minimal (progressive disclosure)

---

## 8. Next Steps

### Immediate Actions:

1. **User Review:**
   - Review this unified proposal
   - Confirm tech stack recommendations
   - Finalize mood system approach
   - Prioritize calendar view modes

2. **Setup:**
   - Create Supabase project
   - Initialize React + Vite project
   - Set up PostgreSQL schema
   - Configure Google OAuth

3. **Phase 1 Kickoff:**
   - Implement database tables
   - Build authentication flow
   - Create basic task CRUD
   - Develop dashboard shell

### Questions for User:

1. **Tech Stack Confirmation:**
   - Approve: React 18 + Supabase + Vercel?
   - Any preferences or concerns?

2. **Mood System:**
   - Review Agent 6 alternatives (`docs/mood-logging-alternatives.md`)
   - Select final approach (recommend Hybrid)

3. **Calendar Views:**
   - Which 4 of 8 views to implement in MVP?
   - Recommended: Week, Month, Day, Agenda

4. **Timeline:**
   - 20-week plan acceptable?
   - Any features to de-prioritize?

---

## 9. Agent Contributions Summary

**Agent 1 (System Architect):**
- Complete database schema (22 tables)
- Data flow diagrams (10 flows)
- 30+ automation rules
- C4 architecture diagrams
- Technical implementation guide

**Agent 2 (Product Planner):**
- Daily workflows (morning/midday/evening)
- Flowcharts and Mermaid diagrams
- 12-week implementation plan
- Quick reference guides

**Agent 3 (UX Flow Designer):**
- Chores vs tasks analysis
- Hybrid approach recommendation
- 80% code reuse calculation
- Maintenance UI mockups

**Agent 4 (Integration Specialist):**
- ATLAS MCP architecture
- JIRA webhook integration
- Unified XP system
- 14-week ATLAS roadmap
- Gamification strategy

**Agent 5 (Content Designer):**
- 15 journal templates
- 17 chore templates
- 6 breakdown workflows
- UI wireframes
- Integration patterns

**Agent 6 (UX Specialist):**
- 7 mood logging alternatives
- ADHD scoring for each approach
- Hybrid approach design (9.5/10 score)
- Voice note AI processing

**Agent 7 (Dashboard Designer):**
- Complete dashboard specification
- "Start Here" AI algorithm
- 10 smart widgets
- Time-based adaptation
- Performance budgets
- 4-week implementation plan

**Agent 8 (Integration Designer):**
- Calendar specification (15,000 words)
- Spotify integration (8,000 words)
- Weather integration (6,000 words)
- Countdowns + concerts (9,000 words)
- Spaces system (7,000 words)
- All schemas, APIs, and workflows

---

## 10. Documentation Index

**Architecture:**
- `docs/architecture-overview.md` - Master architecture + C4 diagrams
- `docs/data-flow-diagrams.md` - 10 comprehensive flows
- `docs/technical-implementation-guide.md` - Complete tech stack

**Workflows:**
- `docs/workflow-design/daily-workflows.md` - Morning/midday/evening
- `docs/workflow-design/flowcharts-and-diagrams.md` - Mermaid diagrams
- `docs/workflow-design/implementation-guide.md` - 12-week plan

**Features:**
- `docs/design/journal-templates/template-library.md` - 15 templates
- `docs/design/chore-workflows/chore-template-library.md` - 17 templates
- `docs/mood-logging-alternatives.md` - 7 approaches analyzed
- `docs/design/features/calendar/specification.md` - Complete calendar spec
- `docs/design/features/spotify/specification.md` - Spotify integration
- `docs/design/features/weather/specification.md` - Weather API
- `docs/design/features/countdowns/specification.md` - Countdowns + concerts
- `docs/design/features/spaces/specification.md` - Spaces system

**ATLAS:**
- `docs/atlas-integration-summary.md` - Overview
- `docs/atlas-mcp-architecture.md` - MCP implementation
- `docs/atlas-user-workflows.md` - Testing workflows
- `docs/atlas-technical-architecture.md` - Database + Edge Functions
- `docs/atlas-gamification-strategy.md` - Unified XP

**Automation:**
- `docs/automation-rules-specification.md` - 30+ rules

**Reference:**
- `docs/AGENT_MCP_REFERENCE.md` - 54 agents + 126+ MCP tools
- `docs/PRODUCT_ANALYSIS_QUESTIONS.md` - 70 UX questions

---

**Total Documentation:** ~100,000 words across 25+ files
**Implementation Estimate:** 20 weeks (solo developer)
**Tech Stack:** React 18 + TypeScript + Supabase + Vercel
**Target:** Desktop web app for single user (you!)

**Ready to build?** 🚀

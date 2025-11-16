# Data Flow Diagrams - Personal Productivity System

## 1. Task Lifecycle Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       TASK CREATION                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Input       │
                    │ - Title          │
                    │ - Due Date       │
                    │ - Priority       │
                    │ - Space          │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Smart Defaults   │
                    │ Applied          │
                    │ - Space = Last   │
                    │ - Priority=Medium│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Task Created     │
                    │ in Database      │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────────┐
    │Calendar Sync?│ │Dashboard │ │ Dependency   │
    │ (if due_date)│ │ Refresh  │ │ Graph Update │
    └──────┬───────┘ └──────────┘ └──────────────┘
           │
           ▼
    ┌──────────────┐
    │Google Cal API│
    │Create Event  │
    │linked_task_id│
    └──────────────┘
```

## 2. Habit Completion → Mood Correlation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   HABIT COMPLETION FLOW                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Completes   │
                    │ Habit            │
                    │ (e.g., "Workout")│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Check: Mood      │
                    │ Logged Today?    │
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │ NO                      │ YES
                ▼                         ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Prompt: "Log     │        │ Skip Prompt      │
    │ your mood?"      │        │ (already logged) │
    │ - Non-intrusive  │        └──────────────────┘
    │ - Dismissible    │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │ User Logs Mood   │
    │ - Energy: 8/10   │
    │ - Feeling: Proud │
    └────────┬─────────┘
             │
    ┌────────▼─────────┐
    │ Store:           │
    │ mood_logs        │
    │ + habit_id ref   │
    └────────┬─────────┘
             │
    ┌────────▼─────────────────┐
    │ Background Analytics Job │
    │ - Correlate habit→mood   │
    │ - Update insights cache  │
    └──────────────────────────┘
             │
             ▼
    ┌──────────────────────────┐
    │ Future: "Workout habit   │
    │ increases energy by 23%  │
    │ on average"              │
    └──────────────────────────┘
```

## 3. Chore Interval Tracking → Auto-Task Creation

```
┌─────────────────────────────────────────────────────────────────┐
│              CHORE MAINTENANCE WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

Initial Setup:
┌──────────────────┐
│ User Creates     │
│ Maintenance Chore│
│ - Oil Change     │
│ - Interval: 3000 │
│   miles OR       │
│   90 days        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Task Created:    │
│ recurrence: {    │
│   type:          │
│   "interval"     │
│   metric: "miles"│
│   threshold: 3000│
│   current: 0     │
│ }                │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                   MONITORING PHASE                            │
│                                                               │
│  Background Job (Daily):                                     │
│  - Check all interval-based tasks                            │
│  - Calculate progress: current / threshold                   │
│  - If progress >= 90%: Trigger alert                         │
└────────┬──────────────────────────────────────────────────────┘
         │
         ▼ (2700 miles reached)
┌──────────────────┐
│ Dashboard Widget │
│ "⚠️ Oil Change   │
│  Due in 300mi"   │
│ [Create Task]    │
└────────┬─────────┘
         │
         ▼ (User clicks "Create Task")
┌──────────────────┐
│ Task Generated:  │
│ - Title: "Oil    │
│   Change"        │
│ - Due: +7 days   │
│ - Linked to      │
│   chore record   │
└────────┬─────────┘
         │
         ▼ (User completes task)
┌──────────────────┐
│ On Task Complete:│
│ 1. Reset chore   │
│    interval      │
│ 2. Log history   │
│ 3. Update cost   │
│    tracking      │
└──────────────────┘
```

## 4. Journal Entry Context Capture

```
┌─────────────────────────────────────────────────────────────────┐
│              JOURNAL ENTRY CREATION FLOW                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ User Opens       │
                    │ Journal          │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Parallel Context │
                    │ Capture (Async)  │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Spotify API   │    │Check Mood Log│    │Get Template  │
│Get Current   │    │for Today     │    │(if selected) │
│Playing       │    │              │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                  ┌────────▼─────────┐
                  │ Pre-fill Journal │
                  │ Form:            │
                  │ - Spotify track  │
                  │ - Mood snapshot  │
                  │ - Template text  │
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │ User Writes      │
                  │ Entry            │
                  │ (auto-save every │
                  │  30 seconds)     │
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │ Save to Database:│
                  │ {                │
                  │   content: "..." │
                  │   mood_snapshot: │
                  │   {...}          │
                  │   spotify: {...} │
                  │   space_id: "X"  │
                  │ }                │
                  └──────────────────┘
```

## 5. ATLAS Bug → Task Sync Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              ATLAS → MAIN APP SYNC FLOW                          │
└─────────────────────────────────────────────────────────────────┘

In ATLAS Workspace:
┌──────────────────┐
│ User Analyzes    │
│ JIRA Ticket      │
│ PROJECT-1234     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ MCP Integration  │
│ Generates AI     │
│ Test Scenarios   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Finds Bug:  │
│ "Auth token      │
│  expires early"  │
│ Severity: HIGH   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Prompt:              │
│ "Create task for     │
│  this bug?"          │
│ [Yes] [No] [Remind]  │
└────────┬─────────────┘
         │ (User clicks Yes)
         ▼
┌──────────────────────┐
│ Create Task:         │
│ - Title: [PROJECT-   │
│   1234] Auth token   │
│   expires early      │
│ - Priority: HIGH     │
│ - Space: "Work"      │
│ - Metadata:          │
│   atlas_ticket_id    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Create Bridge Record:│
│ workspace_bridge     │
│ - main_task_id       │
│ - atlas_ticket_id    │
│ - sync_direction:    │
│   "atlas_to_main"    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Task Appears in:     │
│ - Main task list     │
│ - Today dashboard    │
│   (if due today)     │
│ - Linked back to     │
│   ATLAS ticket       │
└──────────────────────┘
```

## 6. Calendar Bidirectional Sync

```
┌─────────────────────────────────────────────────────────────────┐
│           GOOGLE CALENDAR BIDIRECTIONAL SYNC                     │
└─────────────────────────────────────────────────────────────────┘

Scenario A: Task Created in App
┌──────────────────┐
│ User Creates Task│
│ Due: 2025-11-20  │
│ 2:00 PM          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Task Saved to DB │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Check User Pref:     │
│ "Sync tasks to       │
│  calendar?" = TRUE   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Google Calendar API: │
│ Create Event         │
│ - Title: Task title  │
│ - Start: due_date    │
│ - Description:       │
│   "Task ID: {uuid}"  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Store Link:          │
│ calendar_events      │
│ - google_event_id    │
│ - linked_task_id     │
└──────────────────────┘

Scenario B: Calendar Event Updated Externally
┌──────────────────┐
│ User Updates     │
│ Event in Google  │
│ Calendar (mobile)│
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Webhook Triggered:   │
│ Google Calendar Push │
│ Notification         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Sync Service:        │
│ Fetch event changes  │
│ - New time?          │
│ - Cancelled?         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Update Linked Task:  │
│ - due_date = new time│
│ - If cancelled,      │
│   prompt user        │
└──────────────────────┘

Scenario C: Task Completed in App
┌──────────────────┐
│ User Marks Task  │
│ Complete         │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Check for Linked     │
│ Calendar Event       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Google Calendar API: │
│ - Mark event         │
│   "completed" (color)│
│ - Or delete event    │
│   (user pref)        │
└──────────────────────┘
```

## 7. Dashboard Aggregation Query Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              DASHBOARD DATA AGGREGATION                          │
└─────────────────────────────────────────────────────────────────┘

User Navigates to Dashboard
         │
         ▼
┌──────────────────────┐
│ GraphQL Query:       │
│ dashboard(           │
│   date: "2025-11-16" │
│ )                    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                 PARALLEL DATA FETCHING                        │
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Tasks    │ │ Habits   │ │ Calendar │ │ Countdowns│       │
│  │ (due/    │ │ (pending)│ │ (events) │ │ (urgent) │       │
│  │  overdue)│ │          │ │          │ │          │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │            │            │            │              │
│  ┌────▼────────────▼────────────▼────────────▼───┐          │
│  │         Aggregate Results                      │          │
│  └────────────────────┬───────────────────────────┘          │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────┐          │
│  │  External API Calls (Parallel)                 │          │
│  │  - Spotify: getCurrentlyPlaying()              │          │
│  │  - Weather: getCurrentWeather()                │          │
│  │  - ATLAS: getStats()                           │          │
│  └────────────────────┬───────────────────────────┘          │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │ Compose Final │
                │ Dashboard DTO │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Return to UI  │
                │ (< 500ms)     │
                └───────────────┘
```

## 8. Smart Automation Trigger Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           AUTOMATION ENGINE PROCESSING                           │
└─────────────────────────────────────────────────────────────────┘

Background Cron Job (Every 15 minutes)
         │
         ▼
┌──────────────────────┐
│ Query Automation     │
│ Rules from Config    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Evaluate Conditions: │
│                      │
│ 1. Task overdue?     │
│ 2. Habit streak risk?│
│ 3. Chore due soon?   │
│ 4. Countdown urgent? │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    PARALLEL RULE CHECKS                       │
│                                                               │
│  Rule 1: Overdue Tasks                                       │
│  ┌────────────────────────────────────────┐                  │
│  │ SELECT * FROM tasks                    │                  │
│  │ WHERE status != 'completed'            │                  │
│  │ AND due_date < NOW() - INTERVAL '2 day'│                  │
│  └────────┬───────────────────────────────┘                  │
│           │ Found: 3 tasks                                   │
│           ▼                                                   │
│  ┌────────────────────────────────────────┐                  │
│  │ Create Notification:                   │                  │
│  │ Priority: CRITICAL                     │                  │
│  │ "You have 3 overdue tasks"             │                  │
│  └────────────────────────────────────────┘                  │
│                                                               │
│  Rule 2: Habit Streak Risk                                   │
│  ┌────────────────────────────────────────┐                  │
│  │ Check habits not completed today       │                  │
│  │ WHERE current_streak >= 7              │                  │
│  └────────┬───────────────────────────────┘                  │
│           │ Found: "Meditation" (29 days)                    │
│           ▼                                                   │
│  ┌────────────────────────────────────────┐                  │
│  │ Create Notification:                   │                  │
│  │ Priority: CRITICAL                     │                  │
│  │ "Don't break 29-day streak!"           │                  │
│  └────────────────────────────────────────┘                  │
│                                                               │
│  Rule 3: Maintenance Due                                     │
│  ┌────────────────────────────────────────┐                  │
│  │ Check interval tasks where:            │                  │
│  │ current / threshold >= 0.9             │                  │
│  └────────┬───────────────────────────────┘                  │
│           │ Found: "Oil Change" (2700/3000)│                  │
│           ▼                                                   │
│  ┌────────────────────────────────────────┐                  │
│  │ Auto-create Task +                     │                  │
│  │ Notification (HIGH)                    │                  │
│  └────────────────────────────────────────┘                  │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Batch Send    │
                    │ Notifications │
                    │ (if enabled)  │
                    └───────┬───────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Log Automation│
                    │ Execution     │
                    │ (for debugging│
                    └───────────────┘
```

## 9. Undo/Redo Stack Management

```
┌─────────────────────────────────────────────────────────────────┐
│              UNDO/REDO STATE MANAGEMENT                          │
└─────────────────────────────────────────────────────────────────┘

User Action: Delete 5 Tasks (Bulk Operation)
         │
         ▼
┌──────────────────────┐
│ Capture Pre-State:   │
│ - Task IDs: [...]    │
│ - Full task objects  │
│ - Timestamp          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Execute Deletion     │
│ (Soft delete: set    │
│  deleted_at)         │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Push to Undo Stack:  │
│ {                    │
│   type: "bulk_delete"│
│   entity: "tasks"    │
│   pre_state: [...]   │
│   post_state: null   │
│   timestamp: "..."   │
│ }                    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Clear Redo Stack     │
│ (new action fork)    │
└──────────────────────┘

User Clicks "Undo"
         │
         ▼
┌──────────────────────┐
│ Pop from Undo Stack  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Restore Pre-State:   │
│ - Undelete tasks     │
│ - Restore all fields │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Push to Redo Stack   │
│ (in case user wants  │
│  to redo delete)     │
└──────────────────────┘

Undo Stack Persistence:
┌──────────────────────┐
│ Store in LocalStorage│
│ + Database (user_id) │
│ - Max 50 actions     │
│ - Prune after 7 days │
└──────────────────────┘
```

## 10. Space Filtering Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              SPACE-BASED FILTERING FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Selects Space: "Work"
         │
         ▼
┌──────────────────────┐
│ Update Global State: │
│ activeSpace = "work" │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│              RE-QUERY ALL FEATURES                            │
│                                                               │
│  Tasks:                                                      │
│  SELECT * FROM tasks WHERE space_id = 'work'                 │
│                                                               │
│  Habits:                                                     │
│  SELECT * FROM habits WHERE space_id = 'work'                │
│                                                               │
│  Journal:                                                    │
│  SELECT * FROM journal_entries WHERE space_id = 'work'       │
│                                                               │
│  Countdowns:                                                 │
│  SELECT * FROM countdowns WHERE space_id = 'work'            │
└────────┬──────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Update UI:           │
│ - Task list filtered │
│ - Dashboard filtered │
│ - Habit list filtered│
│ - Color theme = Work │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Smart Defaults:      │
│ - New tasks default  │
│   to space="Work"    │
│ - New habits default │
│   to space="Work"    │
└──────────────────────┘

Special Case: "All Spaces"
┌──────────────────────┐
│ activeSpace = null   │
│ (Show everything)    │
└──────────────────────┘
```

---

## Data Flow Performance Considerations

### Caching Strategy

**Dashboard Query (Hot Path):**
- Cache for 5 minutes
- Invalidate on any task/habit/event mutation
- Use Redis for multi-user future (currently single user = in-memory)

**Mood-Habit Analytics (Expensive Query):**
- Pre-compute daily via background job
- Store in `analytics_cache` table
- Real-time recalc only on explicit user request

**Calendar Sync:**
- Poll Google Calendar API every 15 minutes
- Use webhooks (push notifications) for real-time updates
- Rate limit: 10 requests/minute (Google quota)

### Real-Time Updates

**GraphQL Subscriptions for:**
- Task completion (update dashboard live)
- Habit completion (trigger confetti animation)
- New calendar event synced
- ATLAS ticket → task created

**WebSocket Connection:**
- Single connection per browser session
- Auto-reconnect with exponential backoff
- Queue mutations during offline mode (ADHD-friendly: don't lose work!)

---

## Error Handling in Data Flows

### Critical Paths

**Calendar Sync Failure:**
```
Google Calendar API unreachable
    ↓
Store task locally (dirty flag)
    ↓
Queue for retry (exponential backoff: 1m, 5m, 15m)
    ↓
Show user banner: "Calendar sync delayed"
    ↓
Retry successful → Clear banner
```

**Spotify Integration Failure:**
```
Spotify API returns 401 (token expired)
    ↓
Prompt user: "Reconnect Spotify?"
    ↓
Journal entry still saves (without Spotify data)
    ↓
Graceful degradation: Show "No music playing"
```

**ATLAS Sync Conflict:**
```
JIRA ticket updated in ATLAS + Task updated in main app
    ↓
Detect conflict: last_synced < both updated_at
    ↓
Prompt user:
  "Conflict detected:
   - JIRA: Title changed to 'X'
   - Task: Title is 'Y'
   Which should we keep?"
    ↓
User chooses → Resolve + log conflict resolution
```

---

## Conclusion

These data flow diagrams illustrate the **interconnected, intelligent architecture** that powers the ADHD-optimized productivity system.

Key design patterns:
- **Parallel data fetching** (dashboard loads fast)
- **Proactive automation** (reduce cognitive load)
- **Graceful degradation** (external APIs can fail safely)
- **Context preservation** (undo/redo, auto-save)
- **Smart defaults** (minimize decisions)

All flows prioritize **speed**, **reliability**, and **user forgiveness** (easy undo, no data loss).

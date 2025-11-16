# Architecture Decision Summary

**Project:** ADHD-Optimized Personal Productivity System
**Date:** 2025-11-16
**Architect:** System Architecture Designer

---

## Executive Summary

This document summarizes the key architectural decisions for a personal productivity system designed specifically for a solo developer with ADHD. The system consolidates tasks, habits, journal, calendar, mood logging, countdowns, concerts, chores/maintenance tracking, and ATLAS (JIRA testing workspace) into an intelligent, context-aware productivity platform.

**Core Design Philosophy:**
- **Reduce Cognitive Load**: Smart defaults, batching, proactive automations
- **Preserve Context**: Auto-save, undo/redo, session state management
- **Intelligent Assistance**: Surface actionable items without being intrusive
- **Flexible Power**: Advanced features available but not required

---

## Critical Architectural Decisions

### 1. ✅ CONSOLIDATE Chores into Tasks (Not Separate System)

**Decision:** Chores/maintenance are tasks with additional metadata, not a separate feature.

**Implementation:**
```typescript
interface Task {
  // Standard task fields
  title: string;
  status: string;
  priority: string;
  dueDate?: Date;

  // Recurrence supports both date-based AND interval-based
  recurrence?: {
    type: "date_based" | "interval_based";
    date_pattern?: { frequency: "daily" | "weekly", interval: number };
    interval_pattern?: { metric: "miles" | "days", threshold: number, current_value: number };
  };

  // Chore-specific metadata (optional, only for maintenance tasks)
  maintenanceMeta?: {
    category: "vehicle" | "home" | "health";
    item_name: string;
    history: { date: Date, cost: number, provider: string }[];
  };
}
```

**Rationale:**
- ✅ Unified task management (one list, one UI)
- ✅ Reduces cognitive overhead ("Where did I put that oil change reminder?")
- ✅ Avoids code duplication
- ✅ Maintenance Dashboard widget shows only interval-based tasks
- ✅ Easy to convert regular task → chore (just add metadata)

**Key Features:**
- **Interval tracking**: "Every 3000 miles OR 90 days" (whichever comes first)
- **Proactive alerts**: Dashboard widget at 90% threshold
- **Auto-task creation**: Generate actionable task when interval reached
- **Cost history**: Track maintenance expenses over time

---

### 2. ✅ ATLAS as Separate Workspace (Shared Data Layer)

**Decision:** ATLAS JIRA testing companion exists as a separate workspace with optional sync to main app.

**Architecture:**
```
┌───────────────────────────────────────┐
│     Shared Data Layer                 │
│  (Users, Spaces, Tasks, Habits, etc.) │
└───────────┬───────────────────────────┘
            │
    ┌───────┴───────┐
    │               │
┌───▼────┐    ┌─────▼──────┐
│ Main   │    │ ATLAS      │
│ App    │    │ Workspace  │
│        │    │ - JIRA     │
│        │    │ - AI Tests │
│        │    │ - XP/Streaks│
└────────┘    └────────────┘
```

**Integration Points:**

| Feature | Integration Method | Bidirectional? |
|---------|-------------------|----------------|
| **Tasks** | Optional sync (user confirms) | One-way (ATLAS→Main) |
| **Habits** | "JIRA Testing" habit auto-completes on session | One-way (ATLAS→Main) |
| **Gamification** | Dashboard widget shows ATLAS XP/level | Display only |
| **Spaces** | ATLAS can use "Work" space or dedicated space | Shared data |

**Rationale:**
- ✅ JIRA-specific features don't clutter main productivity app
- ✅ ATLAS can evolve independently
- ✅ Gamification stays contextual (testing XP ≠ general productivity XP)
- ✅ Dashboard widget maintains visibility without forcing integration
- ⚠️ Requires `workspace_bridge` table for cross-references

**User Workflow:**
1. User finds bug in ATLAS testing session
2. Prompt: "Create task for this bug?" → [Yes]
3. Task auto-created with JIRA ticket linked
4. Task appears in main app task list
5. Task completion can optionally update JIRA status

---

### 3. ✅ GraphQL API (Not REST)

**Decision:** Use GraphQL for API layer to support complex cross-feature queries.

**Key Queries:**

```graphql
type Query {
  # Single query fetches all dashboard data
  dashboard(date: Date!): Dashboard!

  # Habit-mood correlation analytics
  habitMoodAnalytics(habitId: ID!, dateRange: DateRange!): Analytics!

  # Cross-feature search
  search(query: String!, filters: SearchFilters!): SearchResults!
}

type Dashboard {
  tasks: [Task!]!          # Due today or overdue
  habits: [Habit!]!        # Pending for today
  upcomingMaintenance: [Task!]!
  urgentCountdowns: [Countdown!]!
  calendarEvents: [CalendarEvent!]!
  spotifyNowPlaying: SpotifyTrack
  weather: WeatherData
  atlasStats: AtlasStats
}
```

**Rationale:**
- ✅ Dashboard loads in **one request** (8+ features worth of data)
- ✅ Prevents over-fetching (mobile-friendly if added later)
- ✅ Strong typing helps development (autocomplete, error detection)
- ✅ Subscriptions enable real-time updates (task completed → confetti animation)
- ⚠️ More complex server setup than REST
- ⚠️ Learning curve if unfamiliar

**Performance:**
- Use DataLoader pattern (batch + cache entity fetches)
- Cache dashboard query for 5 minutes (invalidate on mutations)
- GraphQL subscriptions over WebSocket for real-time

---

### 4. ✅ Spaces as Universal Organizational Layer

**Decision:** Spaces (contexts like "Work", "Personal", "Health") apply to ALL features.

**Schema:**
```sql
CREATE TABLE spaces (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),  -- Hex color for UI theming
  icon VARCHAR(50)
);

-- Every major feature has space_id FK
ALTER TABLE tasks ADD COLUMN space_id UUID REFERENCES spaces(id);
ALTER TABLE habits ADD COLUMN space_id UUID REFERENCES spaces(id);
ALTER TABLE journal_entries ADD COLUMN space_id UUID REFERENCES spaces(id);
ALTER TABLE countdowns ADD COLUMN space_id UUID REFERENCES spaces(id);
```

**UI Behavior:**
- User selects "Work" space → All lists filter to work-related items
- Color theming changes (Work = blue, Personal = green, etc.)
- New tasks default to active space
- "All Spaces" view shows everything

**Rationale:**
- ✅ Reduces context switching ("Show me only work stuff")
- ✅ Consistent organizational model across features
- ✅ Easy to add/remove spaces (dynamic, user-defined)
- ✅ No need for tags (spaces ARE the organizational layer)

---

### 5. ✅ Priority-Based Notification System

**Decision:** Four-tier notification system with granular user control.

**Priority Levels:**

| Priority | Examples | Response Time | User Can Disable? |
|----------|----------|---------------|-------------------|
| **CRITICAL** | Habit streak at risk (29 days), 2+ days overdue | Immediate full-screen | Per-type |
| **HIGH** | Task due today, chore due in 7 days | Within 1 hour, notification badge | Per-type |
| **MEDIUM** | Mood log suggestion, journal prompt | Dashboard widget only | Per-type |
| **LOW** | Analytics insights, background processing | Silent, results in UI | Always silent |

**User Control:**
```
Settings → Notifications
├── Morning Digest [ON] Time: [8:00 AM]
├── Evening Review [ON] Time: [9:00 PM]
├── Batch Mode: [Daily Digest] | Real-time
├── Overdue Alerts [ON] Threshold: [2 days]
├── Habit Streak Alerts [ON] Min streak: [7 days]
└── [Disable All Non-Critical]
```

**Smart Behavior:**
- If user dismisses notification 3 times → Auto-disable for that type
- Morning digest consolidates all pending items (single notification)
- Focus Mode blocks all notifications except CRITICAL

**Rationale:**
- ✅ Helpful without being overwhelming (ADHD-friendly)
- ✅ User stays in control (can disable anything)
- ✅ Batching reduces notification fatigue
- ✅ Critical items still get through when needed

---

### 6. ✅ Mood Tracking: Standalone + Snapshots

**Decision:** Mood logs are standalone feature with optional snapshots on habit completion and journal entries.

**Data Model:**
```typescript
// Standalone mood logs
interface MoodLog {
  id: string;
  userId: string;
  energyLevel: 1-10;          // Physical energy
  emotionalState: string;     // "anxious", "focused", "calm"
  notes?: string;
  loggedAt: Date;
  triggeredBy: "manual" | "habit_completion" | "journal_entry";
}

// Mood snapshots (embedded in other entities)
interface HabitCompletion {
  habitId: string;
  completedAt: Date;
  moodSnapshot?: {            // Optional capture at completion time
    energy: number;
    feeling: string;
  };
}

interface JournalEntry {
  content: string;
  moodSnapshot?: { ... };     // Captured when journal opened
  spotifyCapture?: { ... };
}
```

**User Workflow:**
1. User completes "Workout" habit
2. Prompt: "Log your mood?" (dismissible)
3. User logs: Energy = 8/10, Feeling = "Energized"
4. Stored as standalone mood log + referenced in habit completion

**Analytics (Phase 3+):**
- Correlate habit completions with mood changes
- "Your workout habit increases energy by 23% on average"
- Display insights on dashboard widget

**Rationale:**
- ✅ Flexible: Can log mood anytime OR triggered by events
- ✅ Preserves context (journal mood snapshots show state when writing)
- ✅ Enables habit-mood correlation analytics
- ⚠️ Need to prevent duplicate mood logs (if habit triggers prompt but user already logged today)

---

### 7. ✅ Undo/Redo Across All Operations

**Decision:** Comprehensive undo/redo system with persistent state.

**Implementation:**
```typescript
interface Action {
  type: string;                // "BULK_DELETE_TASKS", "COMPLETE_HABIT"
  timestamp: Date;
  undo: () => Promise<void>;   // Reversal logic
  redo: () => Promise<void>;   // Reapply logic
  metadata: any;               // Action-specific data
}

class UndoManager {
  undoStack: Action[] = [];    // Max 50 actions
  redoStack: Action[] = [];

  executeAction(action: Action): Promise<void>
  undo(): Promise<void>
  redo(): Promise<void>
}
```

**Supported Actions:**
- Bulk delete tasks → Restore all tasks
- Complete habit → Mark incomplete
- Defer tasks to tomorrow → Restore original due dates
- Edit journal entry → Restore previous version
- Change task priority → Restore old priority

**Persistence:**
- Undo/redo stack stored in database + localStorage
- Survives browser close/reopen
- Pruned after 7 days (prevent infinite growth)

**Keyboard Shortcuts:**
- Ctrl+Z → Undo
- Ctrl+Shift+Z → Redo
- UI buttons: [↶ Undo] [↷ Redo]

**Rationale:**
- ✅ Critical for ADHD users (reduces anxiety about mistakes)
- ✅ Encourages experimentation (easy to revert)
- ✅ Supports bulk operations (delete 10 tasks, undo restores all)
- ⚠️ Adds complexity to all mutations (must implement undo logic)

---

## Feature Interaction Map

```
                    ┌──────────────┐
                    │    SPACES    │ (Universal Org Layer)
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│    TASKS      │◄─┤   CALENDAR    │◄─┤  COUNTDOWNS   │
│ (+ Chores)    │  │               │  │  (+ Concerts) │
└───────┬───────┘  └───────┬───────┘  └───────────────┘
        │                  │
        │                  │
        ▼                  ▼
┌───────────────┐  ┌───────────────┐
│    HABITS     │◄─┤ MOOD LOGGING  │
│               │  │               │
└───────┬───────┘  └───────┬───────┘
        │                  │
        └─────────┬────────┘
                  │
                  ▼
          ┌───────────────┐
          │    JOURNAL    │
          │  (+ Spotify)  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │  DASHBOARD    │
          │ (Aggregates   │
          │  Everything)  │
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │     ATLAS     │
          │  (Workspace)  │
          └───────────────┘
```

**Key Data Flows:**

| From | To | Flow Type | Example |
|------|----|-----------|---------|
| Task | Calendar | Sync | Due date → Calendar event |
| Habit | Mood | Prompt | Completion → "Log mood?" |
| Calendar | Countdown | Auto-create | Concert event → Countdown |
| Chore | Task | Generation | Interval reached → Create task |
| ATLAS | Task | Optional sync | Bug found → Create task |
| Mood | Habit | Analytics | Correlate completions → mood deltas |
| Spotify | Journal | Auto-capture | Now playing → Embedded in entry |
| All Features | Dashboard | Aggregation | Single query → Today view |

---

## Smart Automation Highlights

### 30+ Automation Rules Defined

**Top 10 Most Impactful:**

1. **Overdue Task Alerts** (CRITICAL at 2+ days overdue)
2. **Habit Streak Risk** (Alert at 8pm if daily habit not done)
3. **Auto-Sync Tasks to Calendar** (Due dates → Google Calendar)
4. **Maintenance Interval Alerts** (Chore at 90% → Dashboard widget)
5. **Mood Prompt After Habit** (Non-intrusive, dismissible)
6. **Morning Digest Notification** (8am summary of today's items)
7. **End of Day Review** (9pm: "5 tasks still open. Defer?")
8. **Context Preservation** (Auto-save drafts, restore session state)
9. **Spotify Auto-Capture** (Journal opened → Grab now playing)
10. **Focus Mode Auto-Activation** (Hide distractions, show only current task)

**User Control:**
- Every automation can be disabled
- Thresholds are configurable (2 days → 3 days, 90% → 80%, etc.)
- Batch mode vs. real-time notifications
- Per-automation granular toggles

---

## Technology Stack Summary

### Frontend
- **Framework:** React 18 + TypeScript
- **State:** Zustand (with persistence)
- **UI:** shadcn/ui + Tailwind CSS
- **Rich Text:** Tiptap
- **GraphQL Client:** Apollo Client
- **Date/Time:** date-fns

### Backend
- **Runtime:** Node.js 20 (LTS)
- **Framework:** Fastify
- **API:** GraphQL (Apollo Server)
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Jobs:** BullMQ (Redis-backed)
- **Cache:** Redis

### Integrations
- **Google Calendar API** (bidirectional sync)
- **Spotify Web API** (now playing)
- **OpenWeather API** (dashboard widget)
- **JIRA API** (ATLAS workspace)

### Infrastructure
- **Deployment:** Vercel (frontend) + Vercel Serverless (backend)
- **Database:** Supabase (managed PostgreSQL)
- **Redis:** Upstash (managed Redis)
- **Storage:** S3 (journal attachments, future photos)

---

## Database Schema Highlights

**Core Tables:**
- `users` - Authentication & user data
- `spaces` - Organizational contexts (Work, Personal, etc.)
- `tasks` - Tasks with optional chore metadata
- `habits` - Habit definitions
- `habit_completions` - Completion tracking (for streaks)
- `mood_logs` - Standalone mood entries
- `journal_entries` - Rich text journal with metadata
- `calendar_events` - Google Calendar sync
- `countdowns` - Event countdowns (concerts, deadlines)

**ATLAS Tables (Separate Schema):**
- `atlas.jira_tickets` - JIRA ticket data + AI predictions
- `atlas.workspace_bridge` - Links ATLAS tickets → main tasks

**Key Indexes:**
```sql
-- Dashboard query optimization
CREATE INDEX idx_tasks_user_status_due ON tasks(user_id, status, due_date);
CREATE INDEX idx_habits_user ON habits(user_id);
CREATE INDEX idx_calendar_events_user_start ON calendar_events(user_id, start_time);

-- Chore interval queries
CREATE INDEX idx_tasks_maintenance ON tasks USING GIN ((recurrence->'interval_pattern'));
```

---

## Performance Targets

**Dashboard Load Time:** < 500ms (with cache)
**GraphQL Query Response:** < 100ms (average)
**Real-time Subscription Latency:** < 50ms
**Background Job Execution:** < 1s per automation check
**Auto-save Frequency:** Every 30 seconds (debounced)

**Optimization Strategies:**
- Redis caching (5-minute TTL for dashboard)
- DataLoader pattern (batch entity fetches)
- GraphQL query complexity limits
- Database connection pooling
- JSONB indexes for flexible queries

---

## Implementation Roadmap

### Phase 1: Core Foundation (MVP) - 4-6 weeks
1. Database schema & Prisma setup
2. Task management (CRUD, dependencies, basic recurrence)
3. Habit tracking (CRUD, completions, streak calculation)
4. Basic dashboard (today view, overdue tasks)
5. Spaces (create, assign, filter)

### Phase 2: Integrations - 3-4 weeks
1. Google Calendar sync (bidirectional)
2. Spotify integration (now playing)
3. Mood logging (standalone + prompts)
4. Journal (rich text, templates, metadata capture)

### Phase 3: Advanced Features - 4-5 weeks
1. Chores/maintenance (interval tracking, alerts)
2. Countdowns (general + concert specialization)
3. Smart automations (proactive notifications)
4. Weather integration
5. Undo/redo system

### Phase 4: ATLAS Workspace - 3-4 weeks
1. ATLAS database schema
2. MCP integration (AI predictions)
3. Workspace bridge (sync to main app)
4. Dashboard widget (XP, achievements)

### Phase 5: Analytics & Polish (v3+) - Ongoing
1. Habit-mood correlation analytics
2. Task productivity insights
3. Maintenance cost tracking
4. Advanced filtering/search
5. Mobile optimization (if desired)

**Total Estimated Timeline:** 14-19 weeks (~3.5-4.5 months)

---

## Risk Mitigation

### Technical Risks

**Risk 1: External API Rate Limits**
- **Mitigation:** Implement aggressive caching, respect quotas, graceful degradation
- **Example:** Spotify offline → Journal still saves without music metadata

**Risk 2: Database Performance at Scale**
- **Mitigation:** Proper indexing, query optimization, connection pooling
- **Future:** Read replicas if usage grows

**Risk 3: Real-Time Subscription Load**
- **Mitigation:** WebSocket connection limits, subscription filtering, debounce updates
- **Future:** Use managed service (Ably, Pusher) if self-hosting becomes complex

### User Experience Risks

**Risk 1: Notification Overwhelm**
- **Mitigation:** Default to batched digest mode, granular disable options
- **Monitoring:** Track dismissal rate, auto-disable if > 50%

**Risk 2: Feature Complexity Creep**
- **Mitigation:** Progressive disclosure (advanced features hidden by default)
- **ADHD-Friendly:** Simple defaults, power features opt-in

**Risk 3: Data Loss (ADHD-Critical)**
- **Mitigation:** Auto-save every 30s, undo/redo, soft deletes with 30-day retention
- **Backup:** Automated daily database backups

---

## Success Metrics

**Daily Active Usage:**
- Dashboard views per day
- Tasks completed per day
- Habits logged per day

**Feature Engagement:**
- % of tasks synced to calendar
- Mood logs per week
- Journal entries per week
- ATLAS sessions per week

**ADHD-Specific Metrics:**
- Undo/redo usage frequency (shows trust in system)
- Focus mode activation rate
- Notification dismissal rate (should be < 30%)
- Context restoration success (session resume rate)

**Performance:**
- Dashboard load time (target: < 500ms)
- API response time (target: < 100ms)
- Uptime (target: 99.9%)

---

## Conclusion

This architecture delivers a **comprehensive, ADHD-optimized productivity system** that:

✅ **Consolidates** features into a unified data model (Spaces everywhere)
✅ **Intelligently automates** repetitive tasks (30+ smart rules)
✅ **Preserves context** across sessions (undo/redo, auto-save)
✅ **Reduces cognitive load** (smart defaults, batching, proactive alerts)
✅ **Respects user autonomy** (granular control over all automations)
✅ **Scales gracefully** (GraphQL, caching, background jobs)
✅ **Flexible integration** (ATLAS separate but connected)

**Key Architectural Wins:**
- Chores = Tasks (no duplicate system)
- ATLAS = Separate workspace (focused, not cluttered)
- GraphQL = Efficient cross-feature queries
- Spaces = Universal org layer
- Priority notifications = Helpful, not annoying

**Built specifically for one user with ADHD** — optimized for their workflow, not general users.

**Ready to implement!** 🚀

---

## Appendix: Quick Reference

### File Locations
- Full architecture: `architecture-overview.md`
- Data flows: `data-flow-diagrams.md`
- Automation rules: `automation-rules-specification.md`
- Technical guide: `technical-implementation-guide.md`
- This summary: `architecture-decision-summary.md`

### Next Steps
1. ✅ Review architecture decisions
2. ✅ Approve tech stack choices
3. ✅ Refine mood logging feature (currently deferred)
4. → Begin Phase 1 implementation (database schema + core tasks/habits)
5. → Set up development environment (Prisma, GraphQL, React)
6. → Create initial UI mockups (dashboard, task list, habit tracker)

### Questions for Further Refinement
- **Mood Logging:** What specific mood metrics beyond energy + emotional state?
- **Calendar:** Any specific calendar view requirements (month, week, day)?
- **ATLAS Gamification:** Should XP/achievements carry over to main app someday?
- **Mobile:** Future mobile app, or web-only forever?
- **Sharing:** Any plans to share data (journal entries, habit stats) with others?

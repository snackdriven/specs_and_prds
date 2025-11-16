# Smart Automation Rules Specification

## Overview

This document defines the comprehensive automation rules for the ADHD-optimized personal productivity system. All automations are designed to be **helpful, not intrusive**, with user control at every level.

---

## 1. Automation Principles

### Core Design Philosophy

**DO:**
- ✅ Surface actionable information proactively
- ✅ Reduce decision fatigue with smart defaults
- ✅ Preserve context across sessions
- ✅ Provide one-click actions for common tasks
- ✅ Give granular control (disable per-automation type)

**DON'T:**
- ❌ Create notifications user can't dismiss
- ❌ Make irreversible changes without confirmation
- ❌ Interrupt focus mode with non-critical alerts
- ❌ Assume user preferences (always configurable)
- ❌ Spam with repetitive notifications

### Priority Levels

| Priority | Response Time | User Notification | Example |
|----------|---------------|-------------------|---------|
| **CRITICAL** | Immediate | Yes, full screen if idle | Habit streak at risk, 2+ days overdue |
| **HIGH** | Within 1 hour | Yes, notification badge | Task due today, chore due within 7 days |
| **MEDIUM** | Next dashboard visit | Dashboard widget only | Suggestion to log mood, journal prompt |
| **LOW** | Background processing | Silent, results visible in UI | Analytics computation, cache refresh |

---

## 2. Task Automation Rules

### Rule 2.1: Auto-Sync Tasks to Calendar

**Trigger:** Task created/updated with `due_date` set

**Condition:**
```typescript
user.preferences.sync_tasks_to_calendar === true &&
task.due_date !== null &&
task.status !== 'completed'
```

**Actions:**
1. Call Google Calendar API: Create event
2. Store `google_event_id` in `calendar_events` table
3. Link to task via `linked_task_id`

**User Controls:**
- Toggle: "Sync tasks to Google Calendar" (default: ON)
- Filter: "Only sync high-priority tasks" (default: OFF)
- Setting: Calendar to use (default: Primary)

**Edge Cases:**
- Task due date removed → Delete calendar event (or mark as "No date")
- Task completed → Mark calendar event as completed (color change) OR delete (user pref)
- Calendar event deleted externally → Show banner: "Calendar event deleted. Keep task?"

---

### Rule 2.2: Overdue Task Alerts

**Trigger:** Background job (every 15 minutes)

**Condition:**
```sql
SELECT * FROM tasks
WHERE status != 'completed'
AND due_date < NOW() - INTERVAL '2 days'
AND user_id = :user_id
```

**Actions:**
1. Create notification (CRITICAL priority)
2. Surface on dashboard: "⚠️ You have 3 overdue tasks"
3. Suggest: "Focus on [highest priority task]?"

**User Controls:**
- Threshold: Days overdue before alert (default: 2 days)
- Frequency: Daily digest vs. real-time (default: Daily digest at 8am)
- Disable: "Don't remind about overdue tasks"

**Smart Behavior:**
- If user dismisses notification → Don't re-alert for 24 hours
- If user marks task "in progress" → Remove from overdue count
- If user defers task → Respect new due date

---

### Rule 2.3: Task Due Today Dashboard Surfacing

**Trigger:** Dashboard load OR task created with `due_date = today`

**Condition:**
```sql
SELECT * FROM tasks
WHERE status = 'not_started'
AND DATE(due_date) = CURRENT_DATE
ORDER BY priority DESC, due_date ASC
```

**Actions:**
1. Display in dashboard "Today" section (always visible, no dismiss)
2. Count badge: "3 tasks due today"
3. Quick actions: [Start] [Defer] [Complete]

**User Controls:**
- Sort order: Priority, due time, manual
- View style: List, cards, compact

---

### Rule 2.4: Smart Task Defaults

**Trigger:** User creates new task

**Conditions & Actions:**

| Context | Default Applied | Rationale |
|---------|----------------|-----------|
| Time < 12:00 PM | `space_id = last_used_space` | Assume continuing morning work |
| Time > 12:00 PM | `space_id = "Personal"` | Afternoon often personal tasks |
| No due date set | `due_date = null` | Don't assume urgency |
| No priority set | `priority = "medium"` | Neutral default |
| Title contains "bug" | `priority = "high"` | Bug fixes are urgent |
| Created from ATLAS | `space_id = "Work"`, `priority = severity_map` | Context from origin |

**User Controls:**
- Override all defaults manually
- Disable: "Don't auto-set priority"
- Custom rules: "If title contains X, set priority Y"

---

### Rule 2.5: Bulk Defer to Tomorrow

**Trigger:** User selects multiple tasks → clicks "Defer to Tomorrow"

**Conditions:** No conditions (user-initiated)

**Actions:**
1. Capture pre-state (for undo)
2. Update all selected tasks: `due_date = CURRENT_DATE + 1 day`
3. Sync to calendar (if enabled)
4. Push to undo stack

**User Controls:**
- One-click from dashboard
- Keyboard shortcut: Ctrl+D (configurable)

---

## 3. Habit Automation Rules

### Rule 3.1: Habit Completion → Mood Prompt

**Trigger:** Habit marked complete

**Condition:**
```typescript
mood_logged_today === false &&
habit.prompt_mood_on_complete === true &&
user.preferences.mood_prompts_enabled === true
```

**Actions:**
1. Show non-intrusive prompt: "Log your mood?"
2. Pre-fill energy level from last mood log (if recent)
3. Dismissible with "Don't ask again today"

**User Controls:**
- Per-habit toggle: "Prompt mood after this habit"
- Global disable: "Never prompt for mood logs"
- Timing: Immediately vs. end of day

**Smart Behavior:**
- If user dismisses 3 times in a row → Auto-disable for this habit
- If habit is "Meditation", default prompt to ON (likely mood-affecting)
- If habit is "Take vitamins", default prompt to OFF (less mood impact)

---

### Rule 3.2: Habit Streak Risk Alert

**Trigger:** Background job (8:00 PM daily)

**Condition:**
```sql
SELECT h.*,
  (SELECT MAX(completed_at) FROM habit_completions hc WHERE hc.habit_id = h.id) as last_completion
FROM habits h
WHERE h.frequency = 'daily'
AND DATE(last_completion) < CURRENT_DATE
AND current_streak >= 7  -- Only alert for streaks worth preserving
```

**Actions:**
1. Create notification (CRITICAL if streak >= 30 days, HIGH if 7-29 days)
2. Message: "Don't break your 29-day meditation streak! Still time today."
3. One-click: "Mark as Complete"

**User Controls:**
- Threshold: Minimum streak length to protect (default: 7 days)
- Time: When to send alert (default: 8:00 PM)
- Disable per habit: "Don't remind about this habit"

**Smart Behavior:**
- If user completes habit before 8 PM → Don't send notification
- If user dismisses alert → Don't re-alert until next day
- If habit is weekly frequency → Alert on last day of week

---

### Rule 3.3: Habit Streak Celebration

**Trigger:** Habit completion that increments streak to milestone

**Condition:**
```typescript
new_streak_length IN [7, 14, 30, 60, 90, 180, 365]
```

**Actions:**
1. Show celebratory animation (confetti)
2. Notification: "🎉 30-day meditation streak! You're crushing it."
3. Optional: Prompt to share on social (future feature)

**User Controls:**
- Disable: "Don't celebrate streaks" (default: ON)
- Animation level: Full, minimal, none

---

### Rule 3.4: Habit-Mood Correlation Insights

**Trigger:** Background analytics job (daily at 2:00 AM)

**Condition:**
```sql
-- Require minimum data for statistical significance
SELECT habit_id, COUNT(*) as completions
FROM habit_completions
WHERE completed_at > NOW() - INTERVAL '30 days'
GROUP BY habit_id
HAVING COUNT(*) >= 10  -- At least 10 completions
```

**Actions:**
1. Compute correlation: Habit completion → mood energy delta
2. Store in `analytics_cache` table
3. Surface insights on dashboard (MEDIUM priority):
   - "Your workout habit increases energy by 23% on average"
   - "You tend to feel anxious when skipping meditation"

**User Controls:**
- Disable: "Don't analyze my habits" (privacy toggle)
- Frequency: Weekly vs. monthly insights

**Smart Behavior:**
- Only show positive insights (avoid guilt)
- Use encouraging language
- Link to related journal entries for context

---

## 4. Chore/Maintenance Automation Rules

### Rule 4.1: Interval Threshold Alert

**Trigger:** Background job (daily at 6:00 AM)

**Condition:**
```sql
SELECT t.*,
  t.recurrence->>'current_value' as current,
  t.recurrence->>'threshold' as threshold
FROM tasks t
WHERE t.recurrence->>'type' = 'interval_based'
AND (t.recurrence->>'current_value')::numeric / (t.recurrence->>'threshold')::numeric >= 0.9
```

**Actions:**
1. Display on "Maintenance Dashboard" widget (HIGH priority)
2. Message: "⚠️ Oil Change due in 300 miles (2700/3000)"
3. Button: [Create Task] (auto-generates task with +7 day due date)

**User Controls:**
- Threshold: 90%, 80%, or custom
- Auto-create task: ON/OFF (default: ON at 90%, confirm at 80%)
- Notification frequency: Daily, weekly, at threshold only

---

### Rule 4.2: Auto-Create Maintenance Task

**Trigger:** Interval threshold reached (Rule 4.1) AND user clicks "Create Task" OR auto-create enabled

**Condition:**
```typescript
task.recurrence.current_value / task.recurrence.threshold >= 0.9 &&
user.preferences.auto_create_maintenance_tasks === true
```

**Actions:**
1. Create new task:
   - Title: Original chore title (e.g., "Oil Change")
   - Due date: NOW() + 7 days (adjustable)
   - Priority: "high"
   - Linked to chore via `parent_task_id`
2. Notification: "Oil change task created (due Nov 23)"

**User Controls:**
- Auto-create threshold: 90%, 100%, never
- Default due date offset: +3, +7, +14 days
- Disable per chore

---

### Rule 4.3: Chore Completion → Reset Interval

**Trigger:** Linked maintenance task marked complete

**Condition:**
```typescript
task.parent_task_id !== null &&
parent_task.recurrence?.type === 'interval_based'
```

**Actions:**
1. Prompt: "Reset oil change interval? [3000 miles] [Custom]"
2. Update parent chore:
   - `current_value = 0`
   - `last_completed_at = NOW()`
3. Store in history:
   - Cost (optional user input)
   - Service provider (optional)
   - Notes (optional)

**User Controls:**
- Default interval: Use original or custom
- Prompt for cost tracking: ON/OFF
- Auto-reset: ON (with confirmation) / OFF

---

### Rule 4.4: Maintenance Cost Tracking

**Trigger:** Chore interval reset (Rule 4.3)

**Condition:** User enabled "Track maintenance costs"

**Actions:**
1. Prompt modal:
   - "How much did the oil change cost?" [$45.00]
   - "Service provider?" [Jiffy Lube]
   - "Notes?" [Used synthetic oil]
2. Store in `maintenance_meta.history[]`
3. Update analytics: Average cost, cost trends

**User Controls:**
- Disable: "Don't track costs"
- Required fields: Cost only, all fields, none (optional)

**Future Analytics (v3+):**
- "You've spent $540 on oil changes this year"
- "Oil change costs increased 12% since last year"

---

## 5. Calendar Automation Rules

### Rule 5.1: Calendar Event → Auto-Generate Countdown

**Trigger:** Calendar event synced from Google Calendar

**Condition:**
```typescript
event.title.toLowerCase().includes(['concert', 'show', 'festival', 'vacation', 'trip']) &&
user.preferences.auto_create_countdowns === true
```

**Actions:**
1. Create countdown:
   - Title: Event title
   - Target date: Event start time
   - Type: Auto-detected ("concert", "vacation", etc.)
2. If concert: Prompt for ticket status

**User Controls:**
- Auto-create keywords: Customizable list
- Prompt before creating: ON/OFF
- Default urgency level: Medium, high, custom

---

### Rule 5.2: Tomorrow's Events → Dashboard Preview

**Trigger:** Dashboard load (evening hours 5pm-11pm)

**Condition:**
```sql
SELECT * FROM calendar_events
WHERE DATE(start_time) = CURRENT_DATE + 1
ORDER BY start_time ASC
```

**Actions:**
1. Display widget: "📅 Tomorrow's Schedule"
2. Show events with times
3. Suggest: "Create prep task for [meeting]?" (if meeting-type event)

**User Controls:**
- Hide widget: "Don't show tomorrow's events"
- Time range: Show after 5pm, all day, never

---

### Rule 5.3: Calendar Conflict Detection

**Trigger:** Task created/updated with due_date that overlaps existing calendar event

**Condition:**
```sql
SELECT ce.* FROM calendar_events ce
WHERE ce.start_time <= task.due_date
AND ce.end_time >= task.due_date
```

**Actions:**
1. Show warning: "⚠️ This conflicts with [Meeting at 2pm]"
2. Suggest: "Reschedule task?" [Before] [After] [Ignore]

**User Controls:**
- Disable: "Don't check for conflicts"
- Conflict buffer: 15min, 30min, 1hr before/after events

---

## 6. Journal Automation Rules

### Rule 6.1: Spotify Auto-Capture

**Trigger:** User opens journal entry form

**Condition:**
```typescript
user.preferences.auto_capture_spotify === true &&
spotifyService.getCurrentlyPlaying() !== null
```

**Actions:**
1. Async API call: Spotify `getCurrentlyPlaying()`
2. Pre-fill field: "🎵 Now Playing: [Song] - [Artist]"
3. Store full metadata: `spotify_uri`, album art URL

**User Controls:**
- Disable: "Don't capture Spotify"
- Manual refresh: Button to re-capture if song changed

**Edge Cases:**
- Spotify offline → Skip capture (no error shown)
- No song playing → Display "No music playing" (neutral)
- Explicit content → Still capture (user is adult)

---

### Rule 6.2: Mood Snapshot Pre-Fill

**Trigger:** Journal entry form opened

**Condition:**
```sql
SELECT * FROM mood_logs
WHERE user_id = :user_id
AND logged_at > NOW() - INTERVAL '6 hours'
ORDER BY logged_at DESC
LIMIT 1
```

**Actions:**
1. If mood logged recently: Pre-fill with same values
2. Display: "Using mood from [2 hours ago]. Update?"
3. User can adjust or skip

**User Controls:**
- Disable: "Don't pre-fill mood"
- Time threshold: 6hr, 12hr, 24hr

---

### Rule 6.3: Journal Prompt (No Entry in 3+ Days)

**Trigger:** Dashboard load (evening hours)

**Condition:**
```sql
SELECT MAX(created_at) FROM journal_entries
WHERE user_id = :user_id
HAVING MAX(created_at) < NOW() - INTERVAL '3 days'
```

**Actions:**
1. Dashboard widget (MEDIUM priority): "✍️ Reflect on your week?"
2. One-click: Opens journal with "Weekly Reflection" template
3. Dismissible

**User Controls:**
- Threshold: 3, 7, 14 days
- Disable: "Don't prompt for journal entries"

---

### Rule 6.4: Journal Template Suggestions

**Trigger:** User clicks "New Journal Entry"

**Condition:** Time-based template suggestions

**Actions:**

| Time of Day | Suggested Template | Rationale |
|-------------|-------------------|-----------|
| 6am - 9am | "Morning Pages" | Start of day reflection |
| 9pm - 11pm | "Daily Reflection" | End of day review |
| Friday evening | "Weekly Review" | Week wrap-up |
| Last day of month | "Monthly Goals" | Monthly planning |

**User Controls:**
- Disable: "Don't suggest templates"
- Custom triggers: "Suggest [template] on [day/time]"

---

## 7. Countdown Automation Rules

### Rule 7.1: Urgent Countdown Alert

**Trigger:** Background job (daily at 8am)

**Condition:**
```sql
SELECT * FROM countdowns
WHERE target_date - NOW() <= INTERVAL '7 days'
AND urgency_level = 'high'
```

**Actions:**
1. Dashboard widget: "⏰ Concert in 3 days"
2. If countdown is concert + ticket_status != "purchased":
   - CRITICAL notification: "⚠️ Concert urgent: Buy tickets!"

**User Controls:**
- Urgency threshold: 3, 7, 14 days
- Disable per countdown

---

### Rule 7.2: Countdown Completion → Reflection Prompt

**Trigger:** Countdown reaches target_date (background job at midnight)

**Condition:**
```sql
SELECT * FROM countdowns
WHERE DATE(target_date) = CURRENT_DATE
```

**Actions:**
1. Archive countdown (soft delete)
2. Notification: "🎉 [Event] is today!"
3. Evening prompt: "How was [event]? Write about it?" (links to journal with pre-filled title)

**User Controls:**
- Auto-archive: ON/OFF
- Reflection prompt: ON/OFF

---

## 8. ATLAS Integration Automation Rules

### Rule 8.1: ATLAS Bug → Suggest Task Creation

**Trigger:** User identifies bug in ATLAS testing session

**Condition:**
```typescript
atlas_ticket.severity IN ['high', 'critical']
```

**Actions:**
1. Prompt: "Create task for this bug?"
2. Pre-fill task details:
   - Title: `[JIRA-123] Bug description`
   - Priority: Map severity → priority
   - Space: "Work" (or ATLAS-specific space)

**User Controls:**
- Auto-create for critical bugs: ON/OFF
- Prompt threshold: Always, high+critical only, never

---

### Rule 8.2: ATLAS Session → Complete Habit

**Trigger:** ATLAS testing session marked complete

**Condition:**
```typescript
habit.title === "JIRA Testing" &&
habit.atlas_sync?.enabled === true &&
session.test_cases.length >= habit.atlas_sync.min_test_cases
```

**Actions:**
1. Auto-complete "JIRA Testing" habit
2. Notification: "✅ JIRA Testing habit completed! Streak: 12 days"
3. Trigger Rule 3.1 (mood prompt)

**User Controls:**
- Enable ATLAS sync per habit
- Minimum test cases: 1, 3, 5, 10

---

### Rule 8.3: ATLAS XP Milestone → Dashboard Widget

**Trigger:** ATLAS XP reaches milestone (level up, achievement unlocked)

**Condition:** User earned 100+ XP in single session OR leveled up

**Actions:**
1. Dashboard widget: "🎮 ATLAS: Level 8 unlocked! +50 XP"
2. Link: [View ATLAS Workspace]

**User Controls:**
- Hide ATLAS widget: ON/OFF
- Notification threshold: Level ups only, all achievements, never

---

## 9. Cross-Feature Smart Automations

### Rule 9.1: Context Preservation on Session End

**Trigger:** User closes browser OR idle for 30+ minutes

**Condition:** Always runs

**Actions:**
1. Auto-save all unsaved drafts (journal, task edits)
2. Store active filters, view state, scroll position
3. Store to `user_session_state` table + localStorage

**Restoration on next session:**
1. Dashboard loads → Restore last active space filter
2. Task list loads → Restore sort order, view mode
3. Journal loads → Restore draft if exists

**User Controls:**
- Session persistence: ON/OFF (default: ON)
- Drafts expiration: 24hr, 7 days, never

---

### Rule 9.2: Morning Digest Notification

**Trigger:** Scheduled job (user-configurable time, default 8:00 AM)

**Condition:**
```typescript
user.preferences.morning_digest_enabled === true &&
current_time === user.preferences.digest_time
```

**Actions:**
1. Compile digest:
   - Tasks due today (count + top 3)
   - Habits pending (count)
   - Urgent countdowns
   - Calendar events today
   - Maintenance alerts
2. Single notification with summary
3. Link to dashboard

**User Controls:**
- Time: 6am, 7am, 8am, 9am, custom
- Content: Checkboxes for what to include
- Disable: "Don't send morning digest"

**Smart Behavior:**
- If user already opened app → Don't send digest
- Weekend digest: Optional separate time

---

### Rule 9.3: End of Day Review Prompt

**Trigger:** Scheduled (user-configurable time, default 9:00 PM)

**Condition:**
```sql
SELECT COUNT(*) FROM tasks
WHERE status IN ('not_started', 'in_progress')
AND DATE(due_date) = CURRENT_DATE
-- Has incomplete tasks due today
```

**Actions:**
1. Notification: "5 tasks still open. Defer or complete?"
2. Quick actions:
   - [Defer All to Tomorrow]
   - [Review Tasks]
   - [Dismiss]

**User Controls:**
- Time: 8pm, 9pm, 10pm, custom
- Threshold: Alert if 3+, 5+, any incomplete tasks
- Disable: "Don't send evening review"

---

### Rule 9.4: Focus Mode Auto-Activation

**Trigger:** User clicks "Focus Mode" OR Pomodoro timer starts

**Condition:** Always runs when user activates

**Actions:**
1. Hide all notifications (except CRITICAL)
2. Hide dashboard widgets (minimal view)
3. Show only: Current task, timer, [End Focus] button
4. Log focus session start time

**Auto-Deactivation:**
- Pomodoro timer completes (25 min)
- User clicks [End Focus]
- User idle for 5+ minutes

**User Controls:**
- Focus duration: 25min, 50min, custom
- Critical notifications: Allow/block

---

### Rule 9.5: Batch Task Suggestions

**Trigger:** Dashboard load (morning hours)

**Condition:**
```sql
SELECT space_id, COUNT(*) as task_count
FROM tasks
WHERE status = 'not_started'
AND DATE(due_date) = CURRENT_DATE + 1  -- Tomorrow
GROUP BY space_id
HAVING COUNT(*) >= 3
```

**Actions:**
1. Dashboard suggestion widget: "You have 4 work tasks due tomorrow. Batch them?"
2. One-click: Creates "Batch: Work tasks" focus session
3. Opens tasks in dedicated view

**User Controls:**
- Threshold: 2, 3, 5 tasks
- Disable: "Don't suggest batching"

---

## 10. User Preference Management

### Global Automation Settings

**Settings Panel Structure:**

```
📱 Notifications & Automation
├── 🔔 Notification Preferences
│   ├── Morning Digest [ON] Time: [8:00 AM]
│   ├── Evening Review [ON] Time: [9:00 PM]
│   └── Batch Mode: [Daily digest] | Real-time
│
├── ✅ Task Automations
│   ├── Sync to Google Calendar [ON]
│   ├── Overdue task alerts [ON] Threshold: [2 days]
│   └── Smart task defaults [ON] [Configure...]
│
├── 🏃 Habit Automations
│   ├── Mood prompts after habits [ON]
│   ├── Streak risk alerts [ON] Min streak: [7 days]
│   └── Celebration animations [ON]
│
├── 🔧 Maintenance Automations
│   ├── Auto-create maintenance tasks [ON] At: [90%]
│   ├── Interval alerts [ON] Frequency: [Daily]
│   └── Cost tracking [OFF]
│
├── 📅 Calendar Automations
│   ├── Auto-generate countdowns [ON] Keywords: [concert, trip...]
│   ├── Conflict detection [ON] Buffer: [15 min]
│   └── Tomorrow's events preview [ON]
│
├── ✍️ Journal Automations
│   ├── Auto-capture Spotify [ON]
│   ├── Mood pre-fill [ON] Threshold: [6 hours]
│   └── Journal prompts [ON] After: [3 days]
│
└── 🧠 Cross-Feature
    ├── Context preservation [ON] Draft expiry: [7 days]
    ├── Focus mode [Customizable]
    └── Analytics tracking [ON]
```

### Automation Rules Export (Future Feature)

**User can export automation config as JSON:**
```json
{
  "version": "1.0",
  "user_id": "...",
  "preferences": {
    "sync_tasks_to_calendar": true,
    "morning_digest_enabled": true,
    "digest_time": "08:00",
    "auto_create_maintenance_tasks": true,
    "maintenance_threshold": 0.9,
    // ... all preferences
  }
}
```

**Use cases:**
- Backup preferences
- Share with community ("My ADHD-optimized setup")
- Reset to defaults
- Import from template

---

## 11. Performance Considerations

### Background Job Scheduling

**Cron Jobs:**

| Job | Frequency | Execution Time | Priority |
|-----|-----------|---------------|----------|
| Overdue task check | Every 15 min | 8am-10pm only | HIGH |
| Habit streak risk | Daily | 8:00 PM | CRITICAL |
| Maintenance interval | Daily | 6:00 AM | HIGH |
| Countdown alerts | Daily | 8:00 AM | MEDIUM |
| Analytics computation | Daily | 2:00 AM | LOW |
| Calendar sync | Every 15 min | All day | MEDIUM |

**Rate Limiting:**
- Google Calendar API: 10 req/min (quota management)
- Spotify API: 20 req/min
- Notification throttling: Max 3 notifications/hour (non-critical)

### Notification Batching Strategy

**ADHD-Friendly Batching:**

**Option A: Real-Time (High Urgency)**
- CRITICAL notifications sent immediately
- HIGH notifications sent immediately if user active, batched if idle

**Option B: Daily Digest (Low Cognitive Load)**
- All notifications (except CRITICAL) batched into morning digest
- Single notification at 8am with all info
- User clicks → Opens dashboard with all items highlighted

**User chooses preferred mode in settings.**

---

## 12. Testing & Validation

### Automation Rule Testing Checklist

For each automation rule:
- [ ] Unit tests for condition logic
- [ ] Integration tests for API calls
- [ ] User preference override tests
- [ ] Edge case handling (API failures, null data)
- [ ] Notification delivery tests
- [ ] Performance benchmarks (< 100ms processing)

### A/B Testing Framework (Future)

Track automation effectiveness:
- Completion rate: Tasks completed after auto-creation
- Engagement: Mood logs after habit prompts
- Annoyance metric: Notifications dismissed without action
- User retention: Do automations increase daily active usage?

**Iterate based on data:**
- If dismissal rate > 50% → Reduce notification frequency
- If completion rate < 20% → Re-evaluate automation value

---

## Conclusion

These 30+ automation rules create a **proactive, intelligent assistant** that:
- ✅ Reduces cognitive load (smart defaults, batching)
- ✅ Preserves context (auto-save, session management)
- ✅ Surfaces actionable items (dashboard, notifications)
- ✅ Respects user autonomy (granular control, disable options)

All automations prioritize **helpfulness over intrusiveness**, with ADHD-specific considerations at every level.

**Next Steps:**
1. Implement core automations (Phase 1: Task/Habit rules)
2. Collect user feedback (solo dev = self-feedback)
3. Iterate on notification thresholds
4. Add advanced automations (Phase 3+)

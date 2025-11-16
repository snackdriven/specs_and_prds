# Quick Reference - ADHD Productivity App Workflows

## One-Page Design Cards

### MORNING COMMAND CENTER

```
┌─────────────────────────────────────────┐
│  Good morning! Monday, Jan 15          │
│  ⏰ 8:23 AM                             │
├─────────────────────────────────────────┤
│  TODAY'S FOCUS (max 3)                 │
│  ✓ Morning routine (45 days)           │
│  ○ Write PRD for workflow              │
│  ○ Team standup at 10 AM               │
├─────────────────────────────────────────┤
│  URGENT (only if critical)             │
│  🚨 Oil change overdue by 2 days       │
├─────────────────────────────────────────┤
│  [Log Mood] [Quick Task] [Start Work]  │
└─────────────────────────────────────────┘

WHEN: 6-10 AM, first open
WHY: Reduce decision fatigue
RULE: Max 3 items, single screen
```

---

### TASK SURFACING RULES

| Time | Show | Hide | Why |
|------|------|------|-----|
| **Morning 6-10 AM** | Top 3 priority tasks | Future tasks | Focus energy |
| **Mid-day 10 AM-2 PM** | Work tasks + calendar context | Personal items | Work time |
| **Afternoon 2-6 PM** | Quick wins (< 30 min) | Complex tasks | Energy dip |
| **Evening 6-10 PM** | Personal only | Work tasks | Life mode |

**Priority Score Formula:**
```
score = (basePriority × 3) + (daysUntilDue × -2) +
        (currentSpace × 5) + (moodPattern × 2) +
        (timeOptimal × 4)
```

---

### PROACTIVE SUGGESTION LIMITS

```
✓ ALLOW SUGGESTIONS WHEN:
  - < 3 suggestions shown today
  - > 6 hours since last suggestion
  - NOT during ATLAS focus mode
  - NOT during sleep hours (10 PM - 7 AM)
  - NOT within 1 hour of app open

✗ BLOCK SUGGESTIONS WHEN:
  - 3+ already shown today
  - < 6 hours since last one
  - Focus timer active
  - User recently dismissed (< 7 days)
```

**Priority Ranking:**
1. Streak preservation (highest)
2. Time-sensitive countdowns
3. High-correlation habits
4. Overdue chores
5. Engagement prompts (lowest)

---

### MOOD LOG TRIGGERS

```
✓ PROMPT MOOD LOG:
  - After completing a habit ✅
  - 2 hours after calendar event ✅
  - No mood log in 6 hours + app opened ✅
  - End of ATLAS focus session ✅
  - Manual trigger if > 24 hours ✅

✗ NEVER PROMPT:
  - During active focus timer ❌
  - Between 10 PM - 7 AM ❌
  - Within 1 hour of last mood log ❌
```

**Notification Format:**
```
"Just finished your workout! How are you feeling?"
[😊 Great] [😐 Okay] [😔 Low] [Skip]
```

---

### EVENING REVIEW FLOW

```
Step 1: DAY COMPLETION
  • Tasks: 3 of 4 done (75%)
  • Habits: 2 of 3 done (67%)
  • Mood: 1 log
  [Complete Remaining] [Looks Good]

Step 2: HABIT REMINDER (if incomplete)
  • Missing: Evening meditation (7-day streak at risk!)
  [Mark Done] [Skip Today] [Delete]

Step 3: JOURNAL PROMPT (context-aware)
  "You completed 3 tasks today and logged a 'great' mood.
   What went well?"
  [Write] [Skip]

Step 4: TOMORROW PREVIEW
  • 2 calendar events
  • 5 tasks due
  • 3 habits to complete
  Top Priority: "Finish workflow PRD"
  [Set Reminder] [Done]
```

**Trigger:** After 6 PM + not done today

---

### COUNTDOWN URGENCY RULES

| Countdown Type | Visibility | Action |
|----------------|------------|--------|
| **< 48 hours** | Red Zone (urgent) | Create task prompt |
| **2-14 days** | Yellow Zone (today) | Passive display |
| **2-4 weeks** | Green Zone (context) | Ticket reminder |
| **> 1 month** | Hidden (future) | No display |

**Smart Prompts:**
```
"Oil change due in 3 days"
→ [Create Task] [Schedule] [Snooze 1 day]

"Taylor Swift concert in 10 days - no tickets marked"
→ [Mark Got Tickets] [Set Alert] [Cancel]
```

---

### SMART DEFAULTS CHEATSHEET

#### New Task
```typescript
{
  status: "pending",
  priority: contextPriority(), // Morning = high, evening = low
  space: currentSpace(), // ATLAS → Work, else → Personal
  tags: detectFromTitle(), // "call mom" → ["communication"]
  dueDate: null // User must set
}
```

#### New Habit
```typescript
{
  frequency: "daily",
  time: detectOptimal(), // "exercise" → 8:00 AM
  reminder: true,
  streak: 0,
  correlateWithMood: true
}
```

#### New Journal
```typescript
{
  timestamp: now(),
  mood: previousMood || null,
  prompt: contextPrompt(), // Task completed → "What did you accomplish?"
  space: "Personal"
}
```

#### New Countdown
```typescript
{
  category: detectCategory(), // "concert" → event
  reminder: true,
  thresholds: [14, 7, 3, 1], // Days before alert
  suggestTask: category === "chore" || category === "deadline"
}
```

---

### ATLAS WORK INTEGRATION

```
WORK MODE (ATLAS Timer Active):
  ✓ Show: Work tasks only
  ✓ Show: Focus timer
  ✓ Show: Work metrics
  ✗ Hide: Personal tasks
  ✗ Hide: Habit reminders
  ✗ Hide: Non-work countdowns

LIFE MODE (Default):
  ✓ Show: Personal tasks
  ✓ Show: Habits
  ✓ Show: All countdowns
  ✓ Show: Collapsed work summary
  ✗ Hide: Work task details (expandable)

STREAK TRACKING:
  • Habits: Daily completion (miss 1 day = broken)
  • ATLAS: Weekly hours (< 20 hrs/week = broken)
  • Badges: 7, 30, 90, 365 days (habits)
            4, 12, 26, 52 weeks (work)
```

---

### QUICK CAPTURE PATTERNS

```
USER TYPES → AUTO-DETECT → CATEGORY

"Need to call mom"
  → /need to|must|call/ → TASK

"Feeling stressed about work"
  → /feeling|stressed/ → JOURNAL + MOOD (negative)

"Concert in 2 weeks"
  → /in \d+ (days|weeks)/ → COUNTDOWN

"Ran 3 miles this morning"
  → /did|ran|exercised/ → HABIT LOG

"Happy about presentation"
  → /happy|excited/ → MOOD (positive)

MULTIPLE MATCHES:
  "Stressed about presentation. Need to practice."
  → JOURNAL ("stressed") + TASK ("need to practice")
```

**Accuracy Target:** 85%+ correct categorization

---

### WEEKLY PLANNING STEPS

```
1. REVIEW LAST WEEK
   Stats: 78% tasks, 71% habits, 7.2 mood
   [See Details] [Continue]

2. IMPORT CALENDAR
   8 events next week (Mon-Sat)
   [Auto-Block Focus Time] [Skip]

3. CREATE RECURRING TASKS
   Weekly: Groceries, laundry
   Auto-created: 8 tasks

4. COMMIT TO HABITS
   ✓ Morning routine (daily)
   ✓ Exercise (3x/week)
   ? Read 20 min (adjust?)

5. CHECK COUNTDOWNS
   🚨 Oil change (overdue)
   🎫 Concert Saturday
   [Create Tasks] [Done]

6. PRIORITIZE TASKS
   Select top 3 for week:
   1. Finish workflow PRD
   2. Oil change
   3. Presentation prep

7. PREVIEW WEEK
   Mon: 2 events, 3 tasks, 3 habits
   Tue: 1 event, 2 tasks, 3 habits
   ...
   [Set Reminders] [Start Week]
```

**Trigger:** Sunday evening OR manual

---

### NOTIFICATION TIMING

```
CHECK EVERY 30 MINUTES:

  Is focus mode active? → BLOCK ALL
  Is sleep time (10 PM - 7 AM)? → BLOCK ALL
  Recent notification (< 1 hour)? → BLOCK ALL

  ✓ SEND NOTIFICATION:
    Priority 1: Calendar event in 30 min
    Priority 2: Streak expires today
    Priority 3: Habit due soon

  USER PREFERENCE:
    • All Notifications → Send all
    • Critical Only → Priority 1 only
    • None → Block all
```

**Max Frequency:** 1 per hour, 5 per day

---

### DASHBOARD ZONES

```
RED ZONE (Critical)
├─ Overdue tasks (with days count)
├─ Countdowns < 48 hours
├─ Calendar events < 2 hours
└─ Chores past due
   ACTION REQUIRED NOW

YELLOW ZONE (Today)
├─ Tasks due today (priority sorted)
├─ Habits not completed
├─ Calendar events today
└─ Active work timer
   TODAY'S COMMITMENTS

GREEN ZONE (Context)
├─ Mood trend (3-day avg)
├─ Active streaks
├─ Upcoming events (7-30 days)
└─ Weekly completion %
   PASSIVE AWARENESS

GRAY ZONE (Future)
├─ Tasks due this week
├─ Habits summary
└─ Long-term goals
   COLLAPSED BY DEFAULT
```

---

### INFORMATION HIERARCHY

```
ALWAYS VISIBLE (No Scroll):
  1. Time context (Good morning, 8:23 AM)
  2. Top 3 focus items
  3. Urgent attention (if exists)
  4. Quick actions

SWIPE DOWN (Full Dashboard):
  1. Red Zone (critical)
  2. Yellow Zone (today)
  3. Green Zone (context)
  4. Gray Zone (future, collapsed)

ALWAYS ACCESSIBLE (Footer):
  [+ Task] [+ Habit] [+ Journal] [+ Mood]
```

---

### MOOD CORRELATION INSIGHTS

```
MONTHLY ANALYSIS (1st of month):

  Gather Data:
  • All mood logs (30 days)
  • All habit completions
  • All task completions
  • All work sessions

  Calculate Correlations:
  • Days WITH habit → Avg mood
  • Days WITHOUT habit → Avg mood
  • Difference > 10% → Strong correlation

  Generate Report:
  TOP BOOSTERS:
    ✓ Morning workout → +25% mood
    ✓ 8+ hours sleep → +18% mood
    ✓ Journaling → +12% mood

  NEGATIVE PATTERNS:
    ⚠️ Skipping breakfast → -15% focus
    ⚠️ Late nights → -20% next day

  RECOMMENDATIONS:
    • Schedule workout before 9 AM
    • Create "breakfast" habit
    • Set sleep reminder at 10 PM
```

**Display:** Monthly review + proactive suggestions

---

### STATE TRANSITIONS

```
┌──────────────┐
│  Life Mode   │ ← Default state
└──────┬───────┘
       │
       ├─→ Work Mode (Start ATLAS / Work event)
       │
       ├─→ Evening Review (After 6 PM, not done)
       │
       ├─→ Weekly Planning (Sunday / Manual)
       │
       └─→ Quick Capture (Press +)

All states return to Life Mode when complete.
```

---

### CONTEXT-AWARE PROMPTS

```
JOURNAL PROMPTS (Based on Context):

High completion (>80%) + good mood:
  "You crushed it today! What strategies worked?"

Low mood logged:
  "Today was tough. What's one thing you're grateful for?"

Long work session (3+ hours):
  "You focused for 3 hours. Key takeaways?"

Habit streak milestone (7, 30, 90 days):
  "45 days of morning routine! How has it changed you?"

Low/no completion (<30%):
  "What got in the way today?"

Default:
  "What went well today? What could improve?"
```

---

### SUGGESTION MESSAGES

```
STREAK PRESERVATION:
  "7-day meditation streak ends in 5 hours!"
  [Mark Done Now] [Remind Me] [Skip]

CORRELATION:
  "Exercise correlates with +25% mood - schedule today?"
  [Add to Schedule] [Tell Me More] [Dismiss]

COUNTDOWN:
  "Concert in 10 days - tickets marked?"
  [Got Tickets] [Set Alert] [Cancel Going]

CHORE:
  "Oil change overdue by 2 days - schedule it?"
  [Create Task] [Mark Done] [Snooze 1 Day]

ENGAGEMENT:
  "Quick mood check-in? Haven't logged since Tuesday."
  [Log Mood] [Skip]
```

---

### PHASE PRIORITIES

```
PHASE 1 (Weeks 1-2) - MVP
  ✓ Morning Command Center
  ✓ Dashboard hierarchy
  ✓ Basic task completion
  ✓ Mood prompts after habits
  ✓ Smart defaults

PHASE 2 (Weeks 3-4) - Intelligence
  ✓ Proactive suggestions (top 3)
  ✓ Task surfacing algorithm
  ✓ Evening review flow
  ✓ Quick capture

PHASE 3 (Weeks 5-6) - Advanced
  ✓ Weekly planning
  ✓ Mood correlations
  ✓ ATLAS integration
  ✓ Full suggestion engine
```

---

### SUCCESS METRICS

```
ENGAGEMENT:
  Daily active: 80%+
  Morning opens: 90%+
  Evening review: 60%+

PRODUCTIVITY:
  Task completion: 70%+
  Habit consistency: 75%+
  Mood improvement: +10%/month

INTELLIGENCE:
  Suggestion acceptance: 40%+
  Auto-categorization: 85%+
  Correlation actions: 30%+
```

---

### ANTI-PATTERNS TO AVOID

```
❌ DON'T:
  • Show all 47 tasks at once
  • Nag users with notifications
  • Require > 2 taps for common actions
  • Display future anxiety (tasks > 1 week out)
  • Make suggestions without data backing
  • Overwhelm with 8+ action buttons
  • Show notifications during focus mode

✅ DO:
  • Max 3 items on main screen
  • Context-aware prompts only
  • Single-tap for primary action
  • Focus on today + urgent only
  • Limit suggestions to 3/day
  • 1 primary button, rest hidden
  • Respect focus mode boundaries
```

---

### TESTING CHECKLIST

```
UX TESTS:
  ☐ Morning routine < 60 seconds?
  ☐ Dashboard shows ≤ 3 items without scroll?
  ☐ Every screen has clear next action?
  ☐ No action requires > 2 taps?
  ☐ Suggestions appear ≤ 3 times/day?

INTELLIGENCE TESTS:
  ☐ Task priority changes by time of day?
  ☐ Mood prompts after habit completion?
  ☐ Streak warnings > 6 hours before cutoff?
  ☐ Weekly planning auto-creates recurring?
  ☐ Quick capture 85%+ accuracy?

PERFORMANCE TESTS:
  ☐ Command Center loads < 500ms?
  ☐ Dashboard updates instant after completion?
  ☐ Background analysis no UI lag?
  ☐ Weekly review generates < 2 seconds?
```

---

### QUICK IMPLEMENTATION TIPS

```
1. BUILD FOR YOURSELF
   Use the app daily from day 1
   If it annoys you, it will annoy users

2. SHIP INCREMENTALLY
   Phase 1 is usable on its own
   Add intelligence one feature at a time

3. MEASURE WHAT MATTERS
   Does it reduce decision fatigue?
   Does it create momentum?
   Does it feel good to use?

4. EMBRACE CONSTRAINTS
   Max 3 items = easier to build
   Simple > complex
   Delete features aggressively

5. AUTOMATE YOUR WORKFLOW
   Use ATLAS to track building the app
   Create "Development" space
   Journal about coding decisions
```

---

### ONE-SENTENCE RULES

```
MORNING:
  "Show only what the user can do in the next 4 hours."

TASKS:
  "Right task, right time, right context."

SUGGESTIONS:
  "Suggest only when user can act immediately."

EVENING:
  "Reduce tomorrow's anxiety before bed."

WEEKLY:
  "Plan the week, don't plan the year."

CAPTURE:
  "Capture first, categorize later."

WORK MODE:
  "One context at a time, no mixing."

DEFAULTS:
  "Smart defaults should be right 80% of the time."

METRICS:
  "If it doesn't reduce cognitive load, delete it."

ADHD:
  "Friction kills momentum, simplicity creates it."
```

---

**Print this page for quick reference during development.**

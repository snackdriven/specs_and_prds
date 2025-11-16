# Workflow Flowcharts & Diagrams - ADHD Productivity App

## Daily Flow Overview

```mermaid
graph TD
    A[App Launch] --> B{Time of Day?}

    B -->|6-10 AM| C[Morning Command Center]
    B -->|10 AM-6 PM| D[Active Work Dashboard]
    B -->|6-10 PM| E{Evening Review Done?}
    B -->|10 PM-6 AM| F[Minimal Night View]

    C --> G[3-Item Focus View]
    G --> H[Quick Actions]
    H --> I[User Proceeds]

    D --> J{ATLAS Active?}
    J -->|Yes| K[Work Mode]
    J -->|No| L[Life Mode]

    E -->|No| M[Trigger Evening Flow]
    E -->|Yes| N[Standard Dashboard]

    M --> O[Completion Check]
    O --> P[Habit Reminder]
    P --> Q[Journal Prompt]
    Q --> R[Tomorrow Preview]

    F --> S[Sleep Mode Dashboard]
```

---

## Morning Command Center Flow

```mermaid
graph TD
    A[App Open 6-10 AM] --> B[Load Morning Command Center]

    B --> C[Parallel Data Loading]
    C --> D[Check Overdue Items]
    C --> E[Calculate Habit Streaks]
    C --> F[Get Today's Calendar]
    C --> G[Load Top Priority Tasks]

    D --> H{Any Critical?}
    E --> I{Active Streaks?}
    F --> J{Events < 4 hrs?}
    G --> K{Tasks Due Today?}

    H -->|Yes| L[Add to Urgent Attention]
    H -->|No| M[Skip Urgent Section]

    I -->|Yes| N[Add to Today's Focus]
    K -->|Yes| N
    J -->|Yes| N

    L --> O[Display Command Center]
    M --> O
    N --> O

    O --> P{User Action?}
    P -->|Log Mood| Q[Quick Mood Log]
    P -->|Quick Task| R[Brain Dump]
    P -->|Start Work| S[ATLAS Timer]
    P -->|Swipe Down| T[Full Dashboard]

    Q --> U[Store Mood + Timestamp]
    U --> V[Return to Command Center]

    R --> W[Smart Categorization]
    W --> X[Create Items]
    X --> V

    S --> Y[Work Mode View]
    T --> Z[Expanded Day View]
```

---

## Throughout the Day - Task Surfacing

```mermaid
graph TD
    A[User Opens App] --> B{Current Time?}

    B -->|6-10 AM| C[Morning Tasks]
    B -->|10 AM-2 PM| D[Context Tasks]
    B -->|2-6 PM| E[Quick Win Tasks]
    B -->|6-10 PM| F[Personal Tasks]

    C --> G[Load Top 3 Priority]
    G --> H[Filter: Due Today]
    H --> I[Sort by Priority Score]

    D --> J{Active Space?}
    J -->|Yes| K[Load Space Tasks]
    J -->|No| L[Load Calendar Context]
    K --> M[Filter Relevant]
    L --> M

    E --> N[Load Tasks < 30 min]
    N --> O[Add Overdue Items]
    O --> P[Sort by Effort]

    F --> Q[Load Personal Only]
    Q --> R[Hide Work Tasks]

    I --> S[Display Tasks]
    M --> S
    P --> S
    R --> S

    S --> T{User Completes Task?}
    T -->|Yes| U[Mark Complete]
    U --> V{Trigger Mood Log?}
    V -->|Yes| W[Prompt Mood Check-in]
    V -->|No| X[Update Dashboard]

    W --> Y[Log Mood with Context]
    Y --> X
```

---

## Proactive Suggestion Decision Tree

```mermaid
graph TD
    A[Background Checker<br/>Runs Every Hour] --> B{During Focus?}

    B -->|Yes| C[Skip All Suggestions]
    B -->|No| D{Suggestions<br/>Today < 3?}

    D -->|No| C
    D -->|Yes| E{Last Suggestion<br/>> 6 hrs ago?}

    E -->|No| C
    E -->|Yes| F[Check All Triggers]

    F --> G{Streak at Risk?}
    F --> H{No Mood Log<br/>in 3 days?}
    F --> I{High Correlation<br/>Habit Skipped?}
    F --> J{Countdown<br/>< 48 hrs?}
    F --> K{Chore<br/>Overdue?}

    G -->|Yes| L[Priority: 1]
    H -->|Yes| M[Priority: 5]
    I -->|Yes| N[Priority: 3]
    J -->|Yes| O[Priority: 2]
    K -->|Yes| O

    L --> P[Rank All Triggers]
    M --> P
    N --> P
    O --> P

    P --> Q[Select Highest Priority]
    Q --> R{User Dismissed<br/>in Last 7 Days?}

    R -->|Yes| S[Skip Suggestion]
    R -->|No| T[Display Suggestion Card]

    T --> U{User Action?}
    U -->|Accept| V[Execute Action]
    U -->|Dismiss| W[Store Dismissal]
    U -->|Tell Me More| X[Show Data]

    V --> Y[Mark Suggestion Used]
    W --> Y
    X --> Z[User Decides]
    Z --> Y
```

---

## Evening Review Workflow

```mermaid
graph TD
    A[User Opens App<br/>After 6 PM] --> B{Evening Flow<br/>Done Today?}

    B -->|Yes| C[Standard Dashboard]
    B -->|No| D{User Preference?}

    D -->|Auto| E[Start Evening Flow]
    D -->|Manual| F[Show Prompt]
    F -->|Dismiss| C
    F -->|Start| E

    E --> G[Step 1: Day Completion]
    G --> H[Calculate Stats]
    H --> I[Tasks: X of Y Done]
    H --> J[Habits: X of Y Done]
    H --> K[Mood Logs: Count]

    I --> L[Display Summary]
    J --> L
    K --> L

    L --> M{Incomplete Items?}
    M -->|Yes| N[Show Remaining]
    M -->|No| O[Step 2: Habits]

    N --> P{User Action?}
    P -->|Complete| Q[Update Items]
    P -->|Skip| O

    Q --> O

    O --> R{Any Habits<br/>Incomplete?}
    R -->|Yes| S{Streak at Risk?}
    R -->|No| T[Step 3: Journal]

    S -->|Yes| U[Highlight Streak]
    S -->|No| V[Show Missing Habits]

    U --> W{User Completes?}
    V --> W

    W -->|Yes| X[Mark Done]
    W -->|No| T

    X --> T

    T --> Y[Generate Context Prompt]
    Y --> Z{User Writes?}

    Z -->|Yes| AA[Save Journal Entry]
    Z -->|Skip| AB[Step 4: Preview]

    AA --> AB

    AB --> AC[Load Tomorrow's Data]
    AC --> AD[Calendar Events]
    AC --> AE[Due Tasks]
    AC --> AF[Habits]

    AD --> AG[Display Preview]
    AE --> AG
    AF --> AG

    AG --> AH{Set Reminder?}
    AH -->|Yes| AI[Configure Morning Alarm]
    AH -->|Done| AJ[Mark Evening Flow Complete]

    AI --> AJ
    AJ --> AK[Return to Dashboard]
```

---

## Weekly Planning Flow

```mermaid
graph TD
    A[Start Weekly Planning] --> B[Step 1: Last Week Review]

    B --> C[Query Database]
    C --> D[Task Completion %]
    C --> E[Habit Completion %]
    C --> F[Avg Mood Score]
    C --> G[Best/Worst Days]

    D --> H[Display Stats]
    E --> H
    F --> H
    G --> H

    H --> I{User Continues?}
    I -->|See Details| J[Show Daily Breakdown]
    I -->|Continue| K[Step 2: Calendar Import]

    J --> K

    K --> L[Fetch Calendar Events]
    L --> M[Next 7 Days]
    M --> N[Detect Work Events]
    N --> O[Display Event List]

    O --> P{Auto-Block Focus Time?}
    P -->|Yes| Q[Suggest ATLAS Blocks]
    P -->|No| R[Step 3: Recurring Tasks]

    Q --> S[Calculate Available Gaps]
    S --> T[2+ Hour Blocks Only]
    T --> U[Display Suggestions]
    U --> V{User Accepts?}

    V -->|Yes| W[Create ATLAS Blocks]
    V -->|Customize| X[Manual Adjustment]
    V -->|Skip| R

    W --> R
    X --> R

    R --> Y[Check Recurring Patterns]
    Y --> Z[Weekly Tasks]
    Y --> AA[Chores Due]

    Z --> AB[Auto-Create Tasks]
    AA --> AB

    AB --> AC[Step 4: Habit Commitment]
    AC --> AD[Load Active Habits]
    AD --> AE[Show Last Week Performance]

    AE --> AF{Adjust Frequency?}
    AF -->|Yes| AG[Modify Habits]
    AF -->|No| AH[Step 5: Countdowns]

    AG --> AH

    AH --> AI[Query Countdowns < 7 Days]
    AI --> AJ{Any Critical?}

    AJ -->|Yes| AK[Suggest Task Creation]
    AJ -->|No| AL[Step 6: Task Priority]

    AK --> AM{User Creates?}
    AM -->|Yes| AN[Convert to Tasks]
    AM -->|No| AL

    AN --> AL

    AL --> AO[Load All Tasks]
    AO --> AP[Filter: Due Next Week]
    AP --> AQ[Display for Ranking]

    AQ --> AR{User Selects Top 3?}
    AR -->|Yes| AS[Mark as Priority]
    AR -->|Re-prioritize| AT[Adjust Order]

    AS --> AU[Step 7: Week Preview]
    AT --> AU

    AU --> AV[Generate Day-by-Day View]
    AV --> AW[Mon: X events, Y tasks, Z habits]
    AV --> AX[Tue: ...]
    AV --> AY[... through Sunday]

    AW --> AZ[Display Preview]
    AX --> AZ
    AY --> AZ

    AZ --> BA{Set Reminders?}
    BA -->|Yes| BB[Configure Daily Alarms]
    BA -->|Start Week| BC[Save Plan]

    BB --> BC
    BC --> BD[Return to Dashboard]
```

---

## Quick Capture Flow

```mermaid
graph TD
    A[User Presses +<br/>or Ctrl+K] --> B[Show Quick Capture]

    B --> C[User Types]
    C --> D[Real-time Analysis]

    D --> E{Match Task Pattern?}
    D --> F{Match Journal Pattern?}
    D --> G{Match Countdown Pattern?}
    D --> H{Match Habit Pattern?}
    D --> I{Match Mood Pattern?}

    E -->|Yes| J[Suggest: Task]
    F -->|Yes| K[Suggest: Journal]
    G -->|Yes| L[Suggest: Countdown]
    H -->|Yes| M[Suggest: Habit Log]
    I -->|Yes| N[Suggest: Mood]

    J --> O[Display Suggestions]
    K --> O
    L --> O
    M --> O
    N --> O

    O --> P{Multiple Matches?}
    P -->|Yes| Q[Parse into Separate Items]
    P -->|Single| R[Single Category]

    Q --> S[Show All Detected Items]
    S --> T{User Action?}

    T -->|Create All| U[Batch Create]
    T -->|Edit| V[Modify Items]
    T -->|Cancel| W[Discard]

    R --> X[Pre-fill Fields]
    X --> Y[Apply Smart Defaults]

    Y --> Z{Needs More Info?}
    Z -->|Yes| AA[Show Quick Form]
    Z -->|No| AB[Auto-Create]

    AA --> AC{User Completes?}
    AC -->|Yes| AB
    AC -->|Cancel| W

    U --> AD[Create All Items]
    V --> AD
    AB --> AD

    AD --> AE[Show Success Message]
    AE --> AF[Return to Dashboard]
    W --> AF
```

---

## Mood Correlation Analysis Flow

```mermaid
graph TD
    A[Monthly Analysis<br/>Runs 1st of Month] --> B[Query Last 30 Days]

    B --> C[Gather Data]
    C --> D[All Mood Logs]
    C --> E[All Habit Completions]
    C --> F[All Task Completions]
    C --> G[All Work Sessions]

    D --> H[Process Correlations]
    E --> H
    F --> H
    G --> H

    H --> I[For Each Habit]
    I --> J[Days With Habit]
    I --> K[Days Without Habit]

    J --> L[Avg Mood on Habit Days]
    K --> M[Avg Mood on Non-Habit Days]

    L --> N[Calculate Difference]
    M --> N

    N --> O{Difference > 10%?}
    O -->|Yes| P[Strong Correlation]
    O -->|No| Q[Weak/None]

    P --> R[Rank by Impact]
    Q --> S[Skip from Report]

    R --> T[Top 5 Positive]
    R --> U[Top 3 Negative]

    T --> V[Generate Insights]
    U --> V

    V --> W[Create Recommendations]
    W --> X[Schedule Morning Habit]
    W --> Y[Create New Habit]
    W --> Z[Increase Frequency]

    X --> AA[Display Monthly Report]
    Y --> AA
    Z --> AA

    AA --> AB{User Action?}
    AB -->|Accept Suggestion| AC[Implement Change]
    AB -->|Dismiss| AD[Store Preference]
    AB -->|See More| AE[Detailed View]

    AC --> AF[Update Habits/Schedule]
    AE --> AG[Show All Correlations]
    AG --> AB
```

---

## ATLAS Work Integration Flow

```mermaid
graph TD
    A[User Opens App] --> B{ATLAS Timer<br/>Active?}

    B -->|Yes| C[Work Mode]
    B -->|No| D{Calendar<br/>Work Event?}

    D -->|Yes| E[Suggest Work Mode]
    D -->|No| F[Life Mode]

    E --> G{User Accepts?}
    G -->|Yes| C
    G -->|No| F

    C --> H[Filter Display]
    H --> I[Show Only Work Tasks]
    H --> J[Show ATLAS Timer]
    H --> K[Hide Personal Items]
    H --> L[Disable Habit Reminders]

    I --> M[Work Dashboard]
    J --> M
    K --> M
    L --> M

    M --> N{Timer Ends?}
    N -->|Yes| O[Prompt Mood Log]
    N -->|No| P[Continue Work Mode]

    O --> Q[Log Mood + Work Context]
    Q --> R[Calculate Focus Metrics]
    R --> S[Hours Logged This Week]

    S --> T{> 20 Hours?}
    T -->|Yes| U[Increment Work Streak]
    T -->|No| V[Show Weekly Progress]

    U --> W[Display Work Stats]
    V --> W

    W --> X{Switch to Life Mode?}
    X -->|Yes| F
    X -->|No| Y[Stay in Work Mode]

    F --> Z[Full Dashboard]
    Z --> AA[Show Personal Tasks]
    Z --> AB[Show Habits]
    Z --> AC[Collapsed Work Summary]

    AC --> AD{User Expands?}
    AD -->|Yes| AE[Show ATLAS Details]
    AD -->|No| AF[Continue Life Mode]

    AE --> AG[Today's Work Hours]
    AE --> AH[Tasks Completed]
    AE --> AI[Weekly Streak Status]

    AG --> AJ{Start Work?}
    AH --> AJ
    AI --> AJ

    AJ -->|Yes| AK[Switch to Work Mode]
    AJ -->|No| AF

    AK --> C
```

---

## Smart Default Application Flow

```mermaid
graph TD
    A[User Creates New Item] --> B{Item Type?}

    B -->|Task| C[Task Defaults]
    B -->|Habit| D[Habit Defaults]
    B -->|Journal| E[Journal Defaults]
    B -->|Countdown| F[Countdown Defaults]

    C --> G{Context Detection}
    G --> H{ATLAS Active?}
    G --> I{Calendar Event?}
    G --> J{Time of Day?}

    H -->|Yes| K[space: Work]
    H -->|No| L[space: Personal]

    I -->|Yes| M[space: Event.space]
    I -->|No| L

    J -->|6-10 AM| N[priority: high]
    J -->|10 AM-6 PM| O[priority: medium]
    J -->|6+ PM| P[priority: low]

    K --> Q[Apply Defaults]
    L --> Q
    M --> Q
    N --> Q
    O --> Q
    P --> Q

    Q --> R[Title Analysis]
    R --> S{Contains Keywords?}

    S -->|call/email| T[tags: communication]
    S -->|buy/shop| U[tags: errands]
    S -->|write/code| V[tags: deep-work]
    S -->|quick/5min| W[tags: quick-win]

    T --> X[Suggest Tags]
    U --> X
    V --> X
    W --> X

    X --> Y[Present to User]

    D --> Z[Habit Name Analysis]
    Z --> AA{Type Detection}

    AA -->|exercise/workout| AB[time: 8:00 AM]
    AA -->|journal/read| AC[time: 8:00 PM]
    AA -->|other| AD[time: null]

    AB --> AE[frequency: daily]
    AC --> AE
    AD --> AE

    AE --> AF[reminder: true]
    AF --> Y

    E --> AG{Recent Activity?}
    AG -->|Task Completed| AH[prompt: What did you accomplish?]
    AG -->|Low Mood| AI[prompt: What's weighing on you?]
    AG -->|Evening| AJ[prompt: What went well?]
    AG -->|Morning| AK[prompt: What's your intention?]

    AH --> AL[mood: previous]
    AI --> AL
    AJ --> AL
    AK --> AL

    AL --> Y

    F --> AM[Title Analysis]
    AM --> AN{Category Detection}

    AN -->|concert/event| AO[category: event]
    AN -->|oil/maintenance| AP[category: chore]
    AN -->|due/deadline| AQ[category: deadline]

    AO --> AR[reminder: true]
    AP --> AS[suggestTask: true]
    AQ --> AS

    AR --> AT[thresholds: 14,7,3,1]
    AS --> AT

    AT --> Y

    Y --> AU{User Accepts?}
    AU -->|Yes| AV[Create with Defaults]
    AU -->|Modify| AW[User Edits]

    AW --> AV
    AV --> AX[Save Item]
```

---

## Information Hierarchy Map

```
┌─────────────────────────────────────────────────────────┐
│                    APP DASHBOARD                        │
│                  (Information Layers)                    │
└─────────────────────────────────────────────────────────┘

LAYER 1: CRITICAL (Always Visible - Red Zone)
├─ 🚨 Overdue Items (days overdue count)
├─ 🚨 Countdowns < 48 hours
├─ 🚨 Calendar events < 2 hours
└─ 🚨 Chores past due date
   └─> ACTION REQUIRED NOW

LAYER 2: TODAY (Primary Focus - Yellow Zone)
├─ 📅 Calendar events today (chronological)
├─ ✓ Habits not yet completed (streak visibility)
├─ 📝 Tasks due today (priority sorted)
└─ 💼 Active work timer (if ATLAS running)
   └─> TODAY'S COMMITMENTS

LAYER 3: CONTEXT (Passive Awareness - Green Zone)
├─ 📊 Current mood trend (3-day avg)
├─ 🔥 Active streaks (habits, work)
├─ 🎵 Spotify recently played
├─ 🎫 Upcoming events (7-30 days)
└─ 📈 Weekly completion %
   └─> BACKGROUND INFORMATION

LAYER 4: UPCOMING (Collapsed - Gray Zone)
├─ Tasks due this week (expandable)
├─ Habits weekly summary (expandable)
├─ Future countdowns (expandable)
└─ Long-term goals (expandable)
   └─> FUTURE PLANNING

LAYER 5: QUICK ACTIONS (Always Accessible Footer)
├─ [+ Task] [+ Habit] [+ Journal] [+ Mood]
└─> BRAIN DUMP READY
```

---

## Notification Timing Strategy

```mermaid
graph TD
    A[Notification Engine<br/>Runs Every 30 Min] --> B{Check Conditions}

    B --> C{During Focus?}
    C -->|Yes| D[Block All Notifications]
    C -->|No| E{Sleep Hours?}

    E -->|Yes 10PM-7AM| D
    E -->|No| F{Recent Notification?}

    F -->|< 1 hour ago| D
    F -->|> 1 hour| G[Check Triggers]

    G --> H{Habit Due Soon?}
    G --> I{Calendar Event<br/>in 30 min?}
    G --> J{Streak Expires<br/>Today?}
    G --> K{Task Deadline<br/>in 2 hours?}

    H -->|Yes| L[Priority: 3]
    I -->|Yes| M[Priority: 1]
    J -->|Yes| N[Priority: 2]
    K -->|Yes| M

    L --> O[Queue Notification]
    M --> O
    N --> O

    O --> P{User Preference?}
    P -->|All Notifications| Q[Send Now]
    P -->|Critical Only| R{Priority = 1?}
    P -->|None| D

    R -->|Yes| Q
    R -->|No| D

    Q --> S[Display Notification]
    S --> T{User Action?}

    T -->|Tap| U[Open App to Item]
    T -->|Dismiss| V[Mark as Seen]
    T -->|Snooze| W[Re-queue 1 hour]

    U --> X[Navigate to Context]
    V --> Y[Update Stats]
    W --> Z[Set Snooze Timer]
```

---

## Cross-Feature Data Flow

```mermaid
graph LR
    A[Tasks] -->|Completion triggers| B[Mood Log Prompt]
    B -->|Mood data| C[Correlation Engine]

    D[Habits] -->|Completion data| C
    D -->|Streak status| E[Dashboard Widgets]

    F[Calendar] -->|Events| G[Context Detection]
    G -->|Work events| H[ATLAS Suggestions]
    G -->|Time blocks| I[Task Surfacing]

    J[Journal] -->|Entries| K[Pattern Analysis]
    K -->|Insights| L[Proactive Suggestions]

    M[Countdowns] -->|Urgency| N[Task Creation]
    N -->|New tasks| A

    O[ATLAS] -->|Work hours| P[Streak Tracking]
    O -->|Focus sessions| B

    C -->|Correlations| L
    E -->|Streak risk| L

    L -->|Suggestions| Q[User Interface]
    I -->|Task list| Q
    H -->|Work mode| Q

    Q -->|User actions| R[Database]
    R -->|Historical data| C
    R -->|Patterns| K
```

---

## Decision Matrix: When to Show What

| User Context | Show | Hide | Why |
|--------------|------|------|-----|
| **Morning (6-10 AM)** | Top 3 tasks, active streaks, today's calendar | Future items, completed items | Focus energy on priorities |
| **Work Time (ATLAS)** | Work tasks, timer, focus metrics | Personal tasks, habits, unrelated | Minimize distraction |
| **Mid-day (10 AM-2 PM)** | Context tasks, calendar, quick wins | Tomorrow's items, distant countdowns | Maintain momentum |
| **Afternoon (2-6 PM)** | Quick wins, overdue, easy tasks | Complex tasks, new planning | Energy dip = easy victories |
| **Evening (6-10 PM)** | Personal tasks, habits, reflection | Work items, urgent alerts | Work/life separation |
| **Night (10 PM-6 AM)** | Minimal view, emergency only | All notifications, suggestions | Sleep preservation |

---

## State Transitions

```mermaid
stateDiagram-v2
    [*] --> LifeMode

    LifeMode --> WorkMode: Start ATLAS timer
    LifeMode --> WorkMode: Calendar work event

    WorkMode --> LifeMode: Timer ends
    WorkMode --> LifeMode: Manual toggle

    LifeMode --> EveningReview: After 6 PM + not done
    EveningReview --> LifeMode: Complete review

    LifeMode --> WeeklyPlanning: Sunday evening
    LifeMode --> WeeklyPlanning: Manual trigger
    WeeklyPlanning --> LifeMode: Complete planning

    LifeMode --> QuickCapture: Press + button
    WorkMode --> QuickCapture: Press + button
    QuickCapture --> LifeMode: Create items
    QuickCapture --> WorkMode: Create items

    LifeMode --> FocusMode: User requests
    WorkMode --> FocusMode: Deep work session
    FocusMode --> LifeMode: Exit focus
    FocusMode --> WorkMode: Exit focus
```

---

## Priority Scoring Algorithm Diagram

```
Task Priority Score Calculation:
═══════════════════════════════════════════

Base Priority:
  High = 3 points
  Medium = 2 points
  Low = 1 point
  × 3 (weight multiplier)
  ─────────────────
  Max: 9 points

Days Until Due:
  Overdue = -10 points
  Due today = -5 points
  Due tomorrow = -3 points
  Due this week = -1 point
  × 2 (weight multiplier)
  ─────────────────
  Max impact: -20 points

Related to Current Space:
  Match = +5 points
  No match = 0 points
  × 1 (weight multiplier)
  ─────────────────
  Max: 5 points

Matches Mood Pattern:
  High mood + task type = +2 points
  × 1 (weight multiplier)
  ─────────────────
  Max: 2 points

Time of Day Optimal:
  Morning task in morning = +4 points
  Deep work during focus time = +4 points
  × 1 (weight multiplier)
  ─────────────────
  Max: 4 points

═══════════════════════════════════════════
TOTAL SCORE RANGE: -20 to +20 points

Example Calculations:
─────────────────────────────────────────
1. "Urgent work task, due today, morning"
   = (3 × 3) + (-5 × 2) + 5 + 0 + 4
   = 9 - 10 + 5 + 0 + 4
   = 8 points → TOP PRIORITY

2. "Low priority, due next week, no context"
   = (1 × 3) + (-1 × 2) + 0 + 0 + 0
   = 3 - 2 + 0 + 0 + 0
   = 1 point → LOW PRIORITY

3. "Overdue, personal task, evening"
   = (2 × 3) + (-10 × 2) + 5 + 0 + 0
   = 6 - 20 + 5 + 0 + 0
   = -9 points → CRITICAL (Red Zone)
```

---

## User Journey Map: First Week Experience

```
DAY 1 (Onboarding)
├─ User installs app
├─ Quick setup: Name, timezone, work hours
├─ Guided tour: "Add your first task"
├─ Prompt: "What habits do you want to track?"
└─ Outcome: 2 tasks, 2 habits created

DAY 2 (First Morning)
├─ Morning Command Center appears
├─ Shows: 2 tasks, 2 habits (0% complete)
├─ User completes 1 task → Mood prompt
├─ First mood log recorded
└─ Outcome: User sees streak start

DAY 3 (Building Routine)
├─ Morning shows: 1-day habit streak
├─ User completes both habits
├─ Evening review prompt appears
├─ First journal entry written
└─ Outcome: Streak reinforcement

DAY 4 (First Suggestion)
├─ App suggests: "Exercise correlates with better mood"
├─ User schedules exercise
├─ Completes exercise → Mood log (high)
└─ Outcome: Sees first correlation

DAY 5 (Work Integration)
├─ User starts ATLAS timer for work
├─ Work mode hides personal tasks
├─ Focus session: 2 hours
├─ Mood log after work: Productive feeling
└─ Outcome: Work/life separation clear

DAY 6 (First Weekend)
├─ No work items shown
├─ Personal tasks only
├─ Habit streaks at 5 days
├─ User adds countdown for concert
└─ Outcome: Life mode autonomy

DAY 7 (Weekly Review)
├─ Sunday evening review prompt
├─ Stats: 80% task completion, 6-day streaks
├─ First weekly insights shown
├─ Next week planning started
└─ Outcome: User hooked on system

WEEK 2+
├─ Proactive suggestions increase
├─ Correlations become visible
├─ Streaks become motivators
├─ System adapts to user patterns
└─ Outcome: Habit formation successful
```

---

**These flowcharts and diagrams provide visual clarity for implementing the ADHD-optimized workflow design, ensuring every interaction is intentional and user-centric.**

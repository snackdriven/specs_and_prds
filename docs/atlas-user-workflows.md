# ATLAS User Workflows

## Morning Check-in Workflow

### Scenario: Solo dev starts their day

**Goal**: See both personal and work priorities in one glance

```
User opens app → Dashboard (default view)

┌──────────────────────────────────────────────────────┐
│             🌅 Good Morning, Alex!                   │
│                 Monday, Nov 16, 2025                 │
├──────────────────────────────────────────────────────┤
│                                                       │
│  🎯 TODAY'S FOCUS                                    │
│  ┌─────────────────────────────────────────────┐    │
│  │  💼 Work: 3 tickets in Testing               │    │
│  │     • PROJ-456: Payment flow bug [High]      │    │
│  │     • PROJ-489: Login timeout issue          │    │
│  │     • PROJ-501: Mobile UI regression         │    │
│  │                                               │    │
│  │  ✅ Personal: 2 tasks due today              │    │
│  │     • Review apartment lease renewal          │    │
│  │     • Call dentist for checkup               │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  🔥 STREAKS                                          │
│  ┌─────────────────┬─────────────────┐              │
│  │ 🧪 Testing:  7d │ 📚 Reading: 12d │              │
│  │ 💪 Gym:     3d │ 📝 Journal:  5d │              │
│  └─────────────────┴─────────────────┘              │
│                                                       │
│  📊 PROGRESS                                         │
│  Level 14 [████████░░] 82% to Level 15              │
│  Total XP: 8,420 (+180 yesterday)                   │
│                                                       │
│  📅 CALENDAR (Next 4 hours)                          │
│  9:00 AM  - Stand-up (Work Calendar)                │
│  10:30 AM - Testing session: PROJ-456 (ATLAS)       │
│  12:00 PM - Lunch break reminder                    │
│                                                       │
│  [🏠 Go to Personal Space]  [💼 Go to Work Space]   │
└──────────────────────────────────────────────────────┘
```

**User Action Options:**

1. **Click "Work Space"** → Opens full ATLAS interface
2. **Click specific JIRA ticket** → Jump directly to testing session
3. **Click personal task** → Opens task detail modal
4. **Pull down to refresh** → Triggers on-demand JIRA sync

**Behind the Scenes:**
```javascript
// Dashboard data aggregation
async function loadDashboard(userId) {
  const [personalTasks, jiraTickets, streaks, calendar, xp] = await Promise.all([
    supabase.from('tasks').select('*').eq('user_id', userId).eq('due_date', 'today'),
    supabase.from('jira_tickets').select('*').eq('assignee', userId).eq('status', 'Testing'),
    supabase.from('streaks').select('*').eq('user_id', userId),
    supabase.from('calendar_events').select('*').gte('start_time', 'now').limit(5),
    supabase.from('user_xp').select('*').eq('user_id', userId).single()
  ]);

  return {
    focus: {
      work: jiraTickets,
      personal: personalTasks
    },
    streaks,
    calendar,
    xp
  };
}
```

---

## Testing Session Workflow

### Scenario: User starts testing a JIRA ticket

**Step 1: Initiate Session**

```
User in Work Space → Clicks "Start Testing" on PROJ-456

┌──────────────────────────────────────────────────────┐
│  🧪 Testing Session: PROJ-456                        │
│  Payment flow bug - Card declined incorrectly        │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ⏱️  Session Timer: 00:00:00 [RUNNING]               │
│                                                       │
│  🤖 AI COACH: "Let's tackle this payment bug!"      │
│                                                       │
│  💡 SUGGESTED TEST SCENARIOS (AI-Generated):         │
│  ┌────────────────────────────────────────────┐     │
│  │ ✓ Test with valid Visa card                │     │
│  │ ✓ Test with valid Mastercard               │     │
│  │ ☐ Test with expired card                   │     │
│  │ ☐ Test with insufficient funds             │     │
│  │ ☐ Test with CVV mismatch                   │     │
│  │ ☐ Test with international card             │     │
│  │ ☐ Verify error message clarity             │     │
│  │                                             │     │
│  │ [+ Add Custom Scenario]                    │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  📝 TESTING NOTES                                    │
│  [Text editor for notes...]                          │
│                                                       │
│  🐛 BUGS FOUND                                       │
│  [+ Create Bug Report]                               │
│                                                       │
│  [End Session]  [Pause]  [Mark as Blocked]          │
└──────────────────────────────────────────────────────┘
```

**AI Prediction Logic:**
```typescript
// Flow-Nexus LSTM + AgentDB vector search
async function generateTestScenarios(ticketKey: string) {
  // 1. Fetch ticket details from JIRA
  const ticket = await mcpClient.callTool({
    name: 'jira_get_issue',
    arguments: { issueKey: ticketKey }
  });

  // 2. Extract ticket context
  const context = {
    summary: ticket.fields.summary,
    description: ticket.fields.description,
    issueType: ticket.fields.issuetype.name,
    priority: ticket.fields.priority.name,
    components: ticket.fields.components.map(c => c.name)
  };

  // 3. AgentDB vector search: Find similar past tickets
  const similarTickets = await agentdb.query({
    vector: await embedText(context.summary + context.description),
    topK: 5
  });

  // 4. LSTM prediction: Learn from past testing patterns
  const pastScenarios = similarTickets.map(t => t.metadata.test_scenarios);
  const predictedScenarios = await flowNexus.lstm.predict({
    input: context,
    history: pastScenarios
  });

  // 5. Combine AI suggestions with domain knowledge
  return mergeScenariosWithTemplates(predictedScenarios, context.issueType);
}
```

**Step 2: During Testing**

User checks off scenarios, adds notes, marks bugs:

```javascript
// Real-time session tracking
const sessionState = {
  ticketKey: 'PROJ-456',
  startTime: '2025-11-16T09:30:00Z',
  scenarios: [
    { id: 1, description: 'Test with valid Visa', completed: true, passed: true },
    { id: 2, description: 'Test with expired card', completed: true, passed: false, bugFound: true }
  ],
  notes: 'Card validation logic seems broken for expired cards...',
  bugsFound: [
    {
      title: 'Expired card shows "Card declined" instead of "Card expired"',
      severity: 'Medium',
      stepsToReproduce: '1. Enter expired card\n2. Click Pay\n3. See error message'
    }
  ],
  pauses: [
    { start: '2025-11-16T10:00:00Z', end: '2025-11-16T10:15:00Z', reason: 'Stand-up meeting' }
  ]
};
```

**Step 3: End Session**

User clicks "End Session" → Triggers multiple actions:

```
┌──────────────────────────────────────────────────────┐
│  🎉 Testing Session Complete!                        │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ⏱️  Session Duration: 45 minutes                    │
│  ✅ Scenarios Completed: 7/7                         │
│  🐛 Bugs Found: 2                                    │
│                                                       │
│  🏆 REWARDS EARNED                                   │
│  • +50 XP (Testing Session)                          │
│  • +25 XP (Bug Discovery Bonus)                      │
│  • +10 XP (7-day Testing Streak! 🔥)                │
│  • Achievement Unlocked: "Bug Hunter II"             │
│                                                       │
│  📊 SESSION SUMMARY                                  │
│  ┌────────────────────────────────────────────┐     │
│  │ ✓ Moved PROJ-456 to "Done"                 │     │
│  │ ✓ Created bug: PROJ-512 (expired card UX)  │     │
│  │ ✓ Created bug: PROJ-513 (CVV validation)   │     │
│  │ ✓ Added comment to PROJ-456 with notes     │     │
│  │ ✓ Logged 45 min worklog to JIRA            │     │
│  │ ✓ Updated testing streak (7 days)          │     │
│  │ ✓ Trained AI patterns from session         │     │
│  └────────────────────────────────────────────┘     │
│                                                       │
│  😊 HOW ARE YOU FEELING?                             │
│  [😊 Great] [😐 Neutral] [😤 Frustrated] [😴 Tired] │
│                                                       │
│  [Continue to Next Ticket]  [Take a Break]          │
└──────────────────────────────────────────────────────┘
```

**Post-Session Actions (Automated):**

```javascript
async function endTestingSession(sessionId: string) {
  const session = await getSession(sessionId);

  // 1. Update JIRA ticket status
  await mcpClient.callTool({
    name: 'jira_update_issue_status',
    arguments: {
      issueKey: session.ticketKey,
      transition: 'Done'
    }
  });

  // 2. Create bug tickets for each bug found
  for (const bug of session.bugsFound) {
    const newBug = await mcpClient.callTool({
      name: 'jira_create_issue',
      arguments: {
        project: 'PROJ',
        summary: bug.title,
        description: `Found during testing of ${session.ticketKey}\n\n${bug.stepsToReproduce}`,
        issueType: 'Bug',
        priority: bug.severity
      }
    });

    // Create personal follow-up task
    await supabase.from('tasks').insert({
      user_id: session.userId,
      title: `Follow up on bug ${newBug.key}`,
      description: 'Verify bug fix after dev completes',
      due_date: addDays(new Date(), 3),
      tag: 'work-spillover',
      space: 'personal'
    });
  }

  // 3. Add testing notes as JIRA comment
  await mcpClient.callTool({
    name: 'jira_add_comment',
    arguments: {
      issueKey: session.ticketKey,
      comment: `Testing completed ✅\n\nScenarios tested: ${session.scenarios.length}\nBugs found: ${session.bugsFound.length}\n\nNotes:\n${session.notes}`
    }
  });

  // 4. Log time to JIRA worklog
  const timeSpent = Math.floor((session.endTime - session.startTime) / 1000);
  await mcpClient.callTool({
    name: 'jira_add_worklog',
    arguments: {
      issueKey: session.ticketKey,
      timeSpentSeconds: timeSpent,
      comment: 'Testing session via ATLAS',
      started: session.startTime
    }
  });

  // 5. Update user XP and streaks
  await awardXP(session.userId, {
    base: 50, // Testing session
    bugBonus: session.bugsFound.length * 25,
    streakBonus: session.streakDays >= 7 ? 10 : 0
  });

  // 6. Update testing streak
  await updateStreak(session.userId, 'testing', session.endTime);

  // 7. Add to calendar as completed event
  await supabase.from('calendar_events').insert({
    user_id: session.userId,
    title: `Testing: ${session.ticketKey}`,
    start_time: session.startTime,
    end_time: session.endTime,
    event_type: 'testing_session',
    metadata: { ticketKey: session.ticketKey, bugsFound: session.bugsFound.length }
  });

  // 8. Train AI patterns from this session
  await agentdb.insert({
    vector: await embedText(session.notes + session.ticketKey),
    metadata: {
      ticketKey: session.ticketKey,
      scenarios: session.scenarios,
      bugsFound: session.bugsFound.length,
      duration: timeSpent,
      userId: session.userId
    }
  });

  await flowNexus.lstm.train({
    input: session.scenarios,
    output: session.bugsFound,
    context: { issueType: session.issueType }
  });

  // 9. Prompt for mood logging
  return {
    showMoodPrompt: true,
    sessionSummary: { /* ... */ }
  };
}
```

**Step 4: Mood Logging (Optional)**

```
User selects "😤 Frustrated"

→ System logs mood entry:
  {
    timestamp: '2025-11-16T11:15:00Z',
    mood: 'frustrated',
    context: 'work',
    trigger: 'testing_session',
    ticketKey: 'PROJ-456',
    note: 'Payment bugs are getting repetitive'
  }

→ Coach responds:
  "Tough session! You found 2 critical bugs though 💪
   How about a 15-minute break before the next one?"

→ Creates personal task suggestion:
  "Take 15-minute walk" [Due: Now] [Tag: self-care]
```

---

## Pattern Learning Workflow

### Scenario: AI learns from testing history to improve predictions

**What Gets Learned:**

```typescript
interface TestingPattern {
  // Ticket characteristics
  ticketType: string; // Bug, Story, Task
  component: string; // Payment, Auth, UI, API
  priority: string; // High, Medium, Low

  // Effective test scenarios
  scenarios: {
    description: string;
    bugsFoundFrequency: number; // How often this scenario found bugs
    executionTime: number; // Average time to complete
  }[];

  // Bug patterns
  commonBugs: {
    title: string;
    frequency: number; // How often this bug type appears
    relatedScenarios: string[]; // Which scenarios catch it
  }[];

  // Testing effectiveness
  avgSessionDuration: number;
  avgBugsFoundPerSession: number;
  mostProductiveTimeOfDay: string; // '09:00-11:00'
}
```

**Learning Flow:**

```
After Each Testing Session:
  ↓
1. AgentDB Vector Storage
   • Store session notes + ticket description as vector
   • Enable semantic search: "Find similar tickets I've tested"
  ↓
2. LSTM Pattern Training
   • Input: Ticket characteristics (summary, type, priority)
   • Output: Effective test scenarios + bugs found
   • Model learns: "For payment bugs, always test card expiry"
  ↓
3. Pattern Recognition
   • Analyze: Which scenarios consistently find bugs?
   • Identify: Time patterns (testing at 9 AM = 30% more bugs found)
   • Detect: Repetitive bugs (expired card UX issue = 5th time)
  ↓
4. Improve Future Predictions
   • Next payment ticket → Suggest scenarios that found bugs before
   • Next testing session → Recommend optimal time (9 AM)
   • Repetitive bug detected → Alert: "This bug pattern again! Consider root cause investigation"
```

**Example Pattern Application:**

```
User opens new ticket: PROJ-520 (Payment flow - Refund issue)

AI recognizes:
  • Similar to PROJ-456, PROJ-489, PROJ-501 (all payment-related)
  • Past payment tickets: avg 7 scenarios, 2.3 bugs found
  • Most effective scenarios:
    1. Test with expired card (found bugs 80% of time)
    2. Test with insufficient funds (found bugs 60%)
    3. Verify error messages (found bugs 70%)

AI suggests:
  🤖 "Based on your past payment testing, here are scenarios
      that found bugs 80% of the time:

      1. Test refund with expired card
      2. Test refund with insufficient account balance
      3. Verify refund confirmation email
      4. Test partial refund amounts

      ⏱️ Estimated session time: 45 min (based on your history)
      🎯 Expected bugs: 2-3 (similar tickets found 2.3 avg)

      [Start Testing] [Customize Scenarios]"
```

**Repetitive Bug Detection:**

```
AI detects: "Expired card UX issue" bug created 5 times in 3 months

→ System creates personal task:
  Title: "Investigate root cause: Expired card UX issues"
  Description: "You've found this bug 5 times. Time to address the root cause
                with the dev team instead of just reporting individual instances."
  Priority: High
  Tag: work-improvement

→ Coach message:
  "🔍 Pattern detected! You've found the expired card UX bug 5 times.
      Maybe it's time to discuss a permanent fix with the team?"
```

---

## Daily Challenge Workflow

### Scenario: Gamification keeps user engaged

**Morning Challenge Assignment:**

```
Dashboard shows daily challenge:

┌────────────────────────────────────────────┐
│  🎯 TODAY'S CHALLENGE                      │
│                                            │
│  🧪 "Testing Trio"                         │
│  Complete testing for 3 JIRA tickets       │
│                                            │
│  Progress: ██░░░░ 1/3                      │
│  Reward: +100 XP + "Speed Tester" badge    │
│                                            │
│  [View Tickets]                            │
└────────────────────────────────────────────┘
```

**Challenge Completion:**

```
User completes 3rd ticket → Challenge complete!

┌────────────────────────────────────────────┐
│  🎉 CHALLENGE COMPLETE!                    │
│                                            │
│  🧪 "Testing Trio" ✅                      │
│                                            │
│  +100 XP                                   │
│  +Badge: "Speed Tester"                    │
│                                            │
│  🔥 You're on a 3-day challenge streak!   │
│  Complete tomorrow for streak bonus!       │
│                                            │
│  [Share Achievement] [Next Challenge]      │
└────────────────────────────────────────────┘
```

**Challenge Types:**

```typescript
const dailyChallenges = [
  {
    id: 'testing-trio',
    name: 'Testing Trio',
    description: 'Complete 3 JIRA tickets',
    category: 'work',
    difficulty: 'medium',
    xpReward: 100,
    badge: 'Speed Tester'
  },
  {
    id: 'bug-bounty',
    name: 'Bug Bounty',
    description: 'Find 5 bugs across any tickets',
    category: 'work',
    difficulty: 'hard',
    xpReward: 150,
    badge: 'Bug Hunter III'
  },
  {
    id: 'balanced-day',
    name: 'Balanced Day',
    description: 'Complete 2 work tasks + 3 personal tasks',
    category: 'unified',
    difficulty: 'medium',
    xpReward: 120,
    badge: 'Life Balance'
  },
  {
    id: 'perfect-testing',
    name: 'Perfect Testing',
    description: 'Complete testing session with no bugs found (all pass)',
    category: 'work',
    difficulty: 'easy',
    xpReward: 50,
    badge: 'Clean Slate'
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive',
    description: 'Spend 2+ hours on a single ticket testing',
    category: 'work',
    difficulty: 'hard',
    xpReward: 180,
    badge: 'Thorough Tester'
  }
];

// Challenge selection algorithm
function selectDailyChallenge(userId: string, date: Date) {
  // Analyze user's current work queue
  const jiraTickets = getUserJiraTickets(userId);
  const personalTasks = getUserPersonalTasks(userId);

  // Match challenge to user's workload
  if (jiraTickets.length >= 3) {
    return challenges.find(c => c.id === 'testing-trio');
  } else if (jiraTickets.length >= 1 && personalTasks.length >= 3) {
    return challenges.find(c => c.id === 'balanced-day');
  } else {
    // Rotate through other challenges
    return getRandomChallenge(userId, date);
  }
}
```

---

## Weekly Review Workflow

### Scenario: End of week reflection and planning

**Friday Evening Notification:**

```
🔔 Notification:
"Your week in review is ready! See what you accomplished 📊"

User clicks → Opens review screen:

┌──────────────────────────────────────────────────────┐
│  📊 WEEK IN REVIEW                                   │
│  Nov 11 - Nov 16, 2025                               │
├──────────────────────────────────────────────────────┤
│                                                       │
│  🏆 ACHIEVEMENTS                                     │
│  • Level Up! 13 → 14 (+630 XP this week)            │
│  • New Badge: "Bug Hunter II"                        │
│  • 7-day testing streak 🔥                           │
│                                                       │
│  💼 WORK (ATLAS)                                     │
│  • 12 JIRA tickets tested                            │
│  • 8 bugs found and reported                         │
│  • 6h 30min total testing time                       │
│  • Most tested: Payment flow (5 tickets)             │
│                                                       │
│  ✅ PERSONAL                                         │
│  • 15 tasks completed                                │
│  • 5-day journal streak                              │
│  • 3-day gym habit maintained                        │
│                                                       │
│  📈 INSIGHTS                                         │
│  • Peak productivity: Mon-Wed 9-11 AM               │
│  • Mood: Mostly positive (4.2/5 avg)                │
│  • Work stress spike: Thursday afternoon             │
│                                                       │
│  💡 PATTERNS LEARNED                                 │
│  • Payment bugs: Test card expiry first (80% hit)   │
│  • Testing sessions: 45min optimal length            │
│  • You find more bugs before lunch 🧠               │
│                                                       │
│  🎯 NEXT WEEK GOALS                                  │
│  [Set Goals]  [Export Report]  [Share]              │
└──────────────────────────────────────────────────────┘
```

**Goal Setting for Next Week:**

```
User clicks "Set Goals"

┌──────────────────────────────────────────────┐
│  🎯 SET NEXT WEEK'S GOALS                    │
│                                              │
│  Based on your patterns, here are           │
│  recommended goals:                          │
│                                              │
│  💼 Work:                                    │
│  ☐ Test 10 JIRA tickets (↓ from 12)        │
│  ☐ Maintain 7-day testing streak             │
│  ☐ Investigate root cause of payment bugs   │
│                                              │
│  ✅ Personal:                                │
│  ☐ Complete 20 tasks (↑ from 15)            │
│  ☐ Extend gym streak to 10 days             │
│  ☐ Journal daily                             │
│                                              │
│  🎯 Stretch Goal:                            │
│  ☐ Reach Level 15 (+870 XP needed)          │
│                                              │
│  [Save Goals]  [Customize]                   │
└──────────────────────────────────────────────┘
```

---

## Cross-Space Integration Examples

### Example 1: JIRA Deadline → Personal Countdown

```
JIRA ticket PROJ-456 has due date: Nov 18, 2025

→ System creates countdown in Personal Space:
  {
    title: "PROJ-456 Testing Due",
    targetDate: "2025-11-18T17:00:00Z",
    category: "work",
    showIn: ["dashboard", "personal-space", "work-space"]
  }

→ Calendar event created:
  {
    title: "⚠️ PROJ-456 Due Today",
    startTime: "2025-11-18T09:00:00Z",
    endTime: "2025-11-18T17:00:00Z",
    allDay: false,
    type: "deadline",
    source: "jira"
  }
```

### Example 2: Work Stress → Personal Self-Care Task

```
User logs mood after 3 consecutive testing sessions:
  Session 1: 😊 Great
  Session 2: 😐 Neutral
  Session 3: 😤 Frustrated

→ AI detects stress pattern

→ Creates personal task:
  {
    title: "Take a break - you've had 3 tough sessions",
    description: "Go for a walk, grab coffee, or do 10min meditation",
    priority: "high",
    dueDate: "now",
    tag: "self-care",
    autoCreated: true,
    context: "work-stress-detection"
  }

→ Coach message:
  "😤 Noticed you're feeling frustrated. How about a
      break before tackling more tickets? Your wellbeing
      matters! 💙"
```

### Example 3: Testing Streak → Unified Achievement

```
User completes 7 consecutive days of testing

→ Work streak updated: testing_streak = 7 days

→ Unified achievement unlocked:
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Completed 7 consecutive days of work tasks",
    category: "productivity",
    xpBonus: 100,
    unlockedAt: "2025-11-16T18:00:00Z"
  }

→ Also contributes to "30-Day Consistency" achievement progress:
  Progress: 7/30 days (23 more days to unlock)

→ Displayed on dashboard, personal space, AND work space
```

### Example 4: Bug Found → Follow-up Personal Task

```
During testing session, user creates bug: PROJ-512

→ Immediately creates linked personal task:
  {
    title: "Verify fix for PROJ-512",
    description: "Check that expired card UX bug is resolved after dev fixes it",
    dueDate: addDays(now, 5), // 5 days from now
    tag: "work-followup",
    linkedJiraTicket: "PROJ-512",
    space: "personal"
  }

→ When PROJ-512 status changes to "Done":
  → Send notification: "PROJ-512 marked done! Ready to verify?"
  → Personal task updated: dueDate = tomorrow
  → Create new JIRA ticket: "Verify PROJ-512 fix"
```

---

## Quick Access Sidebar Workflow

### Scenario: User is in Personal Space but needs to check JIRA status

**Sidebar (Always Visible):**

```
┌────────────────┐
│  💼 WORK       │
│  ────────────  │
│  📋 3 tickets  │
│  🧪 1 testing  │
│  ⏱️  12:34     │
│  ────────────  │
│  [Open Work]   │
└────────────────┘
```

**Click to expand:**

```
┌──────────────────────────────────┐
│  💼 WORK QUICK VIEW              │
│  ──────────────────────────────  │
│                                  │
│  🧪 ACTIVE SESSION               │
│  PROJ-489: Login timeout         │
│  ⏱️  12:34 elapsed               │
│  [End Session]                   │
│  ──────────────────────────────  │
│                                  │
│  📋 PENDING TICKETS (3)          │
│  • PROJ-501: Mobile UI [High]    │
│  • PROJ-456: Payment flow        │
│  • PROJ-520: Refund issue        │
│  ──────────────────────────────  │
│                                  │
│  🔥 Testing Streak: 7 days       │
│  🏆 XP Today: +125               │
│  ──────────────────────────────  │
│                                  │
│  [🔄 Sync JIRA]                  │
│  [💼 Open Work Space]            │
└──────────────────────────────────┘
```

**Benefits:**
- Glanceable status without context switching
- Timer visible from any space
- One-click sync without leaving current view
- Quick access to jump to full Work Space when needed

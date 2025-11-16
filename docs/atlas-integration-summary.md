# ATLAS Integration Architecture - Executive Summary

## Overview

This document provides a comprehensive integration design for **ATLAS** (JIRA testing companion) into your main productivity app. ATLAS brings JIRA testing into your daily workflow with AI predictions, gamification, and seamless work-life integration.

---

## 1. Integration Approach: **Work Space + Quick Access Sidebar**

### Recommendation: Hybrid Model

**Primary: Dedicated "Work" Space**
- Full-featured ATLAS workspace within main app
- Complete testing workflow with AI predictions, coach, gamification
- Natural context switching: Personal vs Work

**Secondary: Quick Access Sidebar**
- Collapsible panel available from any space
- Shows: assigned tickets, active session timer, daily progress
- One-click jump to full Work space

### App Structure

```
Main App Navigation:
┌─────────────────────────────────────────────┐
│  🏠 Dashboard  │  ✅ Personal  │  💼 Work  │
└─────────────────────────────────────────────┘

Dashboard (Unified):
- Today's focus (personal + work)
- Active streaks (testing + habits)
- Calendar (all events)
- Overall XP/level

Personal Space:
- Your tasks
- Habits
- Journal
- Mood logs
- Countdowns

Work Space (ATLAS):
- JIRA tickets (synced via MCP)
- Testing sessions
- AI test suggestions
- Coach feedback
- Work achievements
```

**Why This Works:**
✅ ATLAS gets dedicated space for complex workflows
✅ Maintains separation between work and personal context
✅ Quick access sidebar prevents constant switching
✅ Unified dashboard shows holistic daily view

---

## 2. Data Sharing Strategy

### Shared Across Spaces

| Data Type | Integration | Benefit |
|-----------|-------------|---------|
| **XP/Achievements** | Unified system | One level, work + personal progress |
| **Calendar** | Tagged events | Testing sessions + personal events |
| **Dashboard** | Aggregated view | Morning check-in shows everything |
| **Streaks** | Parallel tracking | Testing streak + habit streaks |
| **Mood Logging** | Context-tagged | Track work stress vs personal wellbeing |

### Work Space Only (ATLAS)

| Data Type | Reason |
|-----------|--------|
| **JIRA Tickets** | Work-specific, not personal tasks |
| **Test Sessions** | Detailed testing metadata |
| **AI Predictions** | JIRA-context dependent |
| **Coach (Work)** | Work motivation style |

### Cross-Space Triggers

**Examples:**
- Bug found → Create personal follow-up task
- Work stress detected → Suggest self-care break
- JIRA deadline → Create personal countdown
- Testing session → Calendar event (visible everywhere)

---

## 3. MCP Integration Pattern: **Hybrid Sync Strategy**

### Three-Tiered Approach

```
1. REAL-TIME WEBHOOKS (Critical Events)
   JIRA → Webhook → MCP Server → App
   - Ticket assigned to you
   - Status changed
   - Comment mentions you

2. BACKGROUND SYNC (Every 15 min)
   Supabase Cron → MCP Server → Database
   - Fetch assigned tickets
   - Update metadata
   - Sync sprint data

3. ON-DEMAND (User-Triggered)
   User clicks "Sync Now"
   - Full ticket refresh
   - Manual pattern re-training
```

### Critical MCP Tools (MVP)

**Phase 1 (Must Have):**
1. `jira_get_assigned_issues`
2. `jira_get_issue`
3. `jira_update_issue_status`
4. `jira_add_comment`
5. `jira_create_issue`

**Phase 2 (Enhancements):**
6. `jira_add_worklog` (time tracking)
7. `jira_get_transitions`
8. `jira_search_issues`

---

## 4. Technical Architecture

### Recommendation: **Single Database + Supabase Backend**

**Why Single Database:**
- Solo dev: Simplicity > microservices
- Shared data requires joins (XP, calendar, tasks)
- Easier transactions (create bug + task atomically)
- Cost-effective (one Supabase instance)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│           React Frontend (Vite + TypeScript)         │
│  Dashboard │ Personal Space │ Work Space (ATLAS)   │
└────────────────────┬────────────────────────────────┘
                     │
                     │ Supabase Client
                     │
┌────────────────────┴────────────────────────────────┐
│              Supabase Backend                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ PostgreSQL Database                          │  │
│  │ - users, tasks, jira_tickets                 │  │
│  │ - testing_sessions, achievements, streaks    │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Edge Functions (Serverless)                  │  │
│  │ - sync-jira                                  │  │
│  │ - process-testing-session                    │  │
│  │ - generate-ai-scenarios                      │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │ Realtime Subscriptions                       │  │
│  │ - Auto-update UI on ticket changes           │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┬────────────┐
         │                        │            │
┌────────▼──────┐    ┌───────────▼──────┐   ┌▼─────────┐
│ ATLAS MCP     │    │ Flow-Nexus       │   │ AgentDB  │
│ Server        │    │ LSTM             │   │ Vectors  │
│ (JIRA API)    │    │ (Predictions)    │   │ (Search) │
└───────────────┘    └──────────────────┘   └──────────┘
```

### Technology Stack

**Frontend:**
- Vite + React + TypeScript
- TailwindCSS + shadcn/ui
- Supabase client (real-time)

**Backend:**
- PostgreSQL (Supabase)
- Supabase Auth
- Supabase Edge Functions (Deno)

**Integrations:**
- ATLAS MCP Server (Node.js)
- Flow-Nexus (LSTM predictions)
- AgentDB (vector search)

**Deployment:**
- Frontend: Vercel/Netlify
- MCP Webhook: Railway/Fly.io
- Total cost: ~$35-50/month

---

## 5. User Workflows

### Morning Check-in

```
User opens app → Dashboard

Today's Focus:
  💼 Work: 3 tickets in Testing
  ✅ Personal: 2 tasks due today

Streaks:
  🧪 Testing: 7 days 🔥
  📚 Reading: 12 days 🔥🔥

Progress:
  Level 14 [████████░░] 82% to Level 15

[Go to Work Space] [Go to Personal Space]
```

### Testing Session Workflow

```
1. User clicks "Start Testing" on PROJ-456
   → Timer starts
   → AI suggests test scenarios (from AgentDB + templates)

2. During testing:
   → User checks off scenarios
   → Adds notes
   → Marks bugs found
   → Creates JIRA bugs via MCP

3. End session:
   → Automated actions:
     - Update JIRA status → Done
     - Create bugs in JIRA
     - Log worklog (time spent)
     - Award XP (50 base + bug bonuses)
     - Update testing streak
     - Create calendar event
     - Train AI patterns
     - Prompt for mood logging

4. Session summary:
   ✅ 7 scenarios completed
   🐛 2 bugs found and reported
   🏆 +85 XP earned
   🔥 7-day testing streak!

5. Mood logging:
   User selects mood → System detects stress
   → Creates self-care task suggestion
```

### Cross-Space Integration Example

```
Testing Session Ends (Work Space)
  → Bug PROJ-512 created in JIRA
  → Personal task auto-created: "Verify PROJ-512 fix" (due in 5 days)
  → Work stress detected from mood
  → Coach suggests: "Take a 15-minute break"
  → Self-care task created: "Walk outside" (Personal Space)
  → All visible on unified dashboard
```

---

## 6. Gamification Strategy: **Unified System**

### Philosophy: One XP Pool, Context-Aware Rewards

**Core Principle:**
- **One level** for whole person (not separate work/personal levels)
- **Context tags** preserve work vs personal distinction
- **Separate streaks** for different activities
- **Unified achievements** with work/personal/life-balance categories

### XP Sources

```typescript
const XP_VALUES = {
  // Work (ATLAS)
  TESTING_SESSION_BASE: 50,
  BUG_FOUND: 25,
  TESTING_STREAK_BONUS: 10,

  // Personal
  TASK_COMPLETED: 20,
  TASK_HIGH_PRIORITY: 35,

  // Habits
  HABIT_COMPLETED: 15,
  HABIT_STREAK_MILESTONE: 50,

  // Life Balance
  BALANCED_DAY: 60, // Work + personal tasks
  MOOD_LOGGED: 5,
  SELF_CARE_TASK: 25,

  // Daily Challenges
  CHALLENGE_MEDIUM: 100,
  CHALLENGE_HARD: 150
};
```

### Level Progression

```
Level 1 → 2: 100 XP (day 1-2)
Level 5: 2,500 XP (~1 week)
Level 10: 10,000 XP (~1 month)
Level 20: 40,000 XP (~6 months)
Level 50: 250,000 XP (~2 years)
```

### Achievement Categories

1. **Testing** (Work): Bug Hunter I-III, Speed Tester, Week Warrior
2. **Productivity** (Unified): Task Master I-II, Early Bird, Night Owl
3. **Life Balance**: Balanced Day/Week, Self-Care Champion, Stress Manager
4. **Consistency**: Habit Hero (7d), Habit Legend (30d), Challenge Crusher
5. **Mastery**: Pattern Master, Root Cause Detective, Level Milestones

### Streaks

**Separate tracking, unified display:**
- 🧪 Testing: 7 days (work)
- 📚 Reading: 12 days (personal)
- 💪 Gym: 3 days (personal)
- 📝 Journal: 5 days (personal)

**Streak Protection:** 1 freeze per month (24-hour grace period)

### Daily Challenges

**Smart assignment based on workload:**
- Weekday + 3 JIRA tickets → "Testing Trio" (complete 3 tickets)
- Weekend → "Self-Care Sunday" (2 self-care tasks)
- Balanced workload → "Full Spectrum" (work + personal + habit + mood log)

---

## 7. AI Predictions

### AgentDB Vector Search

**What it does:**
- Stores testing session notes as semantic vectors
- Finds similar tickets you've tested before
- Shows: "You tested similar tickets 2 weeks ago, found 3 bugs in 45 min"

**Use case:**
```
User starts testing PROJ-520 (Payment refund issue)

AgentDB finds:
  • PROJ-456 (Payment flow bug) - 80% similar
  • PROJ-489 (Payment timeout) - 65% similar

Shows: "Similar payment bugs found 3 and 2 bugs respectively.
        Consider testing card expiry scenarios first."
```

### Flow-Nexus LSTM Predictions

**What it does:**
- Trains on your past testing patterns
- Input: Ticket summary + type + priority
- Output: Predicted test scenarios + expected bugs

**Learning progression:**
```
Session 1-5: Uses generic templates
Session 6-20: Learns your testing style
Session 21+: Personalized predictions (80% accuracy)
```

### Pattern Learning

**System learns:**
1. **Effective scenarios**: "Card expiry test finds bugs 80% of the time"
2. **Time patterns**: "You find more bugs at 9 AM"
3. **Repetitive bugs**: "Expired card UX issue = 5th time → Investigate root cause"

---

## 8. MVP Scope (3.5 Months)

### Phase 1-2: Foundation + JIRA (Week 1-4)
- ✅ Supabase backend + auth
- ✅ ATLAS MCP server (5 tools)
- ✅ Manual JIRA sync
- ✅ Basic testing sessions
- ✅ Bug creation via MCP

### Phase 3-4: Gamification + Personal (Week 5-8)
- ✅ XP system (levels 1-50)
- ✅ Testing streak
- ✅ 5 starter achievements
- ✅ Personal tasks
- ✅ Unified dashboard

### Phase 5-6: AI + Polish (Week 9-12)
- ✅ AgentDB similar tickets
- ✅ Template scenario suggestions
- ✅ Background JIRA sync (every 15 min)
- ✅ Calendar integration
- ✅ Coach personality
- ✅ Daily challenges

### Phase 7: Production (Week 13-14)
- ✅ Testing & bug fixes
- ✅ Deployment
- ✅ Documentation

**Total: 14 weeks = ~3.5 months**

---

## 9. Key Design Decisions

### ✅ Work Space (not separate app)
**Why:** Keeps everything in one place, shared auth, unified navigation

### ✅ Single database
**Why:** Simpler for solo dev, enables cross-space features, easier transactions

### ✅ Supabase backend
**Why:** Batteries included (auth, real-time, storage, serverless functions)

### ✅ Unified XP system
**Why:** User progresses as whole person, not fragmented work/life XP

### ✅ Hybrid sync (webhooks + background + manual)
**Why:** Real-time for critical events, background for bulk updates, manual as fallback

### ✅ AgentDB + templates (defer LSTM to Phase 5)
**Why:** Templates work well for MVP, ML adds value incrementally

### ✅ Context tags (not separate systems)
**Why:** Preserves work/personal distinction without duplicating gamification

---

## 10. Success Metrics

### MVP Launch Criteria

**Technical:**
- JIRA tickets sync successfully
- Testing sessions tracked accurately
- XP/achievements unlock correctly
- Real-time updates work smoothly
- No critical bugs

**User Experience:**
- Complete testing workflow in < 5 clicks
- Dashboard loads in < 2 seconds
- ATLAS feels integrated, not separate tool

**Engagement:**
- Use ATLAS for 80% of JIRA testing
- Maintain 7-day testing streak
- Unlock 10+ achievements in first month
- Balanced days happen naturally

---

## 11. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| JIRA API rate limits | Cache tickets, webhooks instead of polling, exponential backoff |
| MCP complexity | Start with 5 core tools, use tested `jira-client` library |
| AI accuracy | Start with templates, add ML incrementally |
| Scope creep | Strict MVP feature list, defer "nice to have" |
| Supabase costs | Pro plan ($25/mo) sufficient, optimize queries |

---

## 12. Cost Estimate

| Service | Cost/Month |
|---------|-----------|
| Supabase Pro | $25 |
| Flow-Nexus Starter | $10-20 |
| MCP Server Hosting | $0-5 |
| JIRA | $0 (work account) |
| **Total** | **~$35-50/month** |

---

## 13. Next Steps

### This Week (Week 1):
1. [ ] Set up Supabase project
2. [ ] Initialize React app (Vite + TypeScript)
3. [ ] Create ATLAS MCP server skeleton
4. [ ] Finalize database schema

### Next Week (Week 2):
1. [ ] Implement authentication
2. [ ] Build 5 core MCP tools
3. [ ] Test JIRA sync locally
4. [ ] Create basic Work Space UI

### Week 3:
1. [ ] Deploy Supabase Edge Function
2. [ ] Build testing session UI
3. [ ] Implement timer
4. [ ] Test end-to-end workflow

**Goal: Working JIRA integration by end of Week 4** 🎯

---

## 14. Post-MVP Features (Backlog)

1. **Advanced AI**: Flow-Nexus LSTM, pattern learning across projects, anomaly detection
2. **Social**: Team leaderboards, share achievements, collaborative testing
3. **Mobile**: React Native app, push notifications, quick notes
4. **Analytics**: Testing effectiveness dashboard, bug patterns, productivity heatmaps
5. **Integrations**: Slack notifications, Google Calendar sync, Notion export

---

## Conclusion

This integration architecture achieves your goal: **"ATLAS as part of the workspace, not a separate silo."**

**Key Achievements:**
✅ JIRA testing integrated into daily workflow
✅ Work and personal tasks unified on dashboard
✅ Gamification spans both contexts (one level, balanced incentives)
✅ AI learns from your testing patterns
✅ Work stress triggers self-care suggestions
✅ Single app, single database, single auth

**Result:** ATLAS feels like a natural part of your productivity system. Testing isn't a burden—it's a rewarding part of your day that contributes to overall progress.

**Start building Phase 1 this week!** 🚀

---

## Document References

1. **[atlas-mcp-architecture.md](C:/Users/bette/Desktop/specs_and_prds/docs/atlas-mcp-architecture.md)** - MCP server implementation details
2. **[atlas-user-workflows.md](C:/Users/bette/Desktop/specs_and_prds/docs/atlas-user-workflows.md)** - Detailed user scenarios
3. **[atlas-technical-architecture.md](C:/Users/bette/Desktop/specs_and_prds/docs/atlas-technical-architecture.md)** - Database schema, backend design
4. **[atlas-gamification-strategy.md](C:/Users/bette/Desktop/specs_and_prds/docs/atlas-gamification-strategy.md)** - XP system, achievements, streaks
5. **[atlas-mvp-roadmap.md](C:/Users/bette/Desktop/specs_and_prds/docs/atlas-mvp-roadmap.md)** - 14-week implementation plan

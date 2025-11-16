# ATLAS MVP Roadmap & Implementation Plan

## MVP Philosophy: **"Basic JIRA Integration + Core Gamification"**

**Goal**: Get ATLAS into your daily workflow ASAP, validate integration value, iterate based on real usage.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Backend Setup

**Tasks:**
- [ ] Initialize Supabase project
- [ ] Set up database schema (core tables only)
- [ ] Configure authentication
- [ ] Deploy Supabase Edge Functions skeleton

**Core Tables (MVP):**
```sql
-- Minimal schema for MVP
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  preferences JSONB
);

CREATE TABLE jira_tickets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ticket_key TEXT UNIQUE,
  summary TEXT,
  status TEXT,
  priority TEXT,
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE testing_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  ticket_key TEXT REFERENCES jira_tickets(ticket_key),
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  bugs_found INTEGER DEFAULT 0,
  status TEXT
);

CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1
);

CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT,
  current_streak INTEGER DEFAULT 0
);
```

**Deliverable**: Working Supabase backend with auth + basic data models

---

### 1.2 MCP Server (JIRA Integration)

**Tasks:**
- [ ] Set up ATLAS MCP server project
- [ ] Implement core MCP tools (5 tools for MVP):
  - `jira_get_assigned_issues`
  - `jira_get_issue`
  - `jira_update_issue_status`
  - `jira_add_comment`
  - `jira_create_issue`
- [ ] Test MCP tools locally with Claude Desktop
- [ ] Deploy webhook server (manual sync for MVP, webhooks in Phase 2)

**Deliverable**: Working MCP server that can fetch and update JIRA tickets

---

### 1.3 Frontend Skeleton

**Tasks:**
- [ ] Initialize Vite + React + TypeScript project
- [ ] Set up TailwindCSS + shadcn/ui components
- [ ] Implement authentication flow (sign up, login, logout)
- [ ] Create basic routing (Dashboard, Work Space, Personal Space)
- [ ] Set up Supabase client

**Deliverable**: Authenticated app skeleton with navigation

---

## Phase 2: Core JIRA Integration (Week 3-4)

### 2.1 JIRA Sync

**Tasks:**
- [ ] Implement Supabase Edge Function: `sync-jira`
- [ ] Create JIRA ticket display component
- [ ] Add "Sync JIRA" button (manual sync)
- [ ] Store synced tickets in database
- [ ] Display tickets in Work Space

**UI:**
```
Work Space:
┌───────────────────────────────────────┐
│  💼 WORK SPACE                        │
├───────────────────────────────────────┤
│  [🔄 Sync JIRA]  Last sync: 5 min ago │
│                                       │
│  📋 ASSIGNED TICKETS (3)              │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ PROJ-456 [High]                 │ │
│  │ Payment flow bug                │ │
│  │ Status: Testing                 │ │
│  │ [Start Testing]                 │ │
│  └─────────────────────────────────┘ │
│  ... (2 more tickets)                 │
└───────────────────────────────────────┘
```

**Deliverable**: Work Space shows real JIRA tickets, manual sync works

---

### 2.2 Basic Testing Session

**Tasks:**
- [ ] Create "Start Testing" flow
- [ ] Implement timer component
- [ ] Basic testing notes textarea
- [ ] "End Session" button
- [ ] Store session in database
- [ ] Update JIRA ticket status via MCP

**UI:**
```
Testing Session:
┌───────────────────────────────────────┐
│  🧪 Testing: PROJ-456                 │
├───────────────────────────────────────┤
│  ⏱️  00:23:45 [Running]               │
│                                       │
│  📝 NOTES                             │
│  [Textarea for notes...]              │
│                                       │
│  🐛 BUGS FOUND: 2                     │
│  [+ Add Bug] [List bugs...]           │
│                                       │
│  [End Session] [Pause]                │
└───────────────────────────────────────┘
```

**Deliverable**: Can start testing session, take notes, log bugs, end session

---

### 2.3 Bug Creation Flow

**Tasks:**
- [ ] Create "Add Bug" modal
- [ ] Form: bug title, description, severity
- [ ] Create JIRA issue via MCP (`jira_create_issue`)
- [ ] Link bug to current testing session
- [ ] Display created bugs in session summary

**Deliverable**: Can create JIRA bugs from within testing session

---

## Phase 3: Gamification Core (Week 5-6)

### 3.1 XP System

**Tasks:**
- [ ] Implement XP calculation logic
- [ ] Award XP on session end
- [ ] Update `user_xp` table
- [ ] Display XP and level on dashboard
- [ ] Add XP breakdown view

**UI (Dashboard):**
```
┌───────────────────────────────────────┐
│  📊 PROGRESS                          │
│  Level 3 [████░░░░] 45% to Level 4   │
│  Total XP: 890 (+75 today)            │
│                                       │
│  [View XP Breakdown]                  │
└───────────────────────────────────────┘
```

**Deliverable**: XP awarded after testing sessions, level displayed

---

### 3.2 Testing Streak

**Tasks:**
- [ ] Create "Testing" habit record on user signup
- [ ] Update streak when session completes
- [ ] Display streak on dashboard
- [ ] Implement streak milestone notifications (7-day)

**UI:**
```
┌───────────────────────────────────────┐
│  🔥 TESTING STREAK: 5 days            │
│  Longest: 12 days                     │
│  Test again today to keep it alive!   │
└───────────────────────────────────────┘
```

**Deliverable**: Testing streak tracked and displayed

---

### 3.3 First Achievements

**Tasks:**
- [ ] Create `achievements` table with 5 starter achievements:
  - "First Test" (1 session)
  - "Bug Hunter I" (10 bugs)
  - "Week Warrior" (7-day streak)
  - "Speed Tester" (3 sessions in 1 day)
  - "Level 5" milestone
- [ ] Implement achievement unlock check on session end
- [ ] Create achievement unlock notification UI
- [ ] Display unlocked achievements on dashboard

**Deliverable**: Basic achievement system works

---

## Phase 4: Personal Space Integration (Week 7-8)

### 4.1 Personal Tasks

**Tasks:**
- [ ] Create `tasks` table
- [ ] Build task creation form
- [ ] Display tasks in Personal Space
- [ ] Mark tasks as complete
- [ ] Award XP for task completion

**UI:**
```
Personal Space:
┌───────────────────────────────────────┐
│  ✅ PERSONAL SPACE                    │
├───────────────────────────────────────┤
│  [+ Add Task]                         │
│                                       │
│  TODAY                                │
│  ☐ Review apartment lease             │
│  ☐ Call dentist                       │
│                                       │
│  UPCOMING                             │
│  ☐ Buy groceries (Tomorrow)           │
└───────────────────────────────────────┘
```

**Deliverable**: Can create and complete personal tasks, earn XP

---

### 4.2 Unified Dashboard

**Tasks:**
- [ ] Build dashboard aggregation view
- [ ] Show both work + personal tasks
- [ ] Display combined XP progress
- [ ] Add "Today's Focus" section

**UI:**
```
Dashboard:
┌───────────────────────────────────────┐
│  🌅 Good Morning, Alex!               │
├───────────────────────────────────────┤
│  🎯 TODAY'S FOCUS                     │
│  💼 Work: 3 tickets in Testing        │
│  ✅ Personal: 2 tasks due today       │
│                                       │
│  🔥 Testing Streak: 5 days            │
│  📊 Level 3 [████░░░░] 45%            │
│                                       │
│  [🏠 Personal] [💼 Work]              │
└───────────────────────────────────────┘
```

**Deliverable**: Unified dashboard showing work + personal overview

---

### 4.3 Cross-Space Features

**Tasks:**
- [ ] Implement "Balanced Day" detection
- [ ] Award bonus XP for balanced days
- [ ] Create "Balanced Day" achievement
- [ ] Display work/personal XP breakdown

**Deliverable**: Balanced day bonus works, XP breakdown shows sources

---

## Phase 5: AI Predictions (Week 9-10)

### 5.1 AgentDB Integration

**Tasks:**
- [ ] Set up AgentDB vector database
- [ ] Store testing session notes as vectors
- [ ] Implement semantic search for similar tickets
- [ ] Display "Similar Past Tickets" when starting session

**UI:**
```
┌───────────────────────────────────────┐
│  💡 SIMILAR TICKETS YOU'VE TESTED:    │
│                                       │
│  • PROJ-489 (2 weeks ago)             │
│    Found 3 bugs, 45 min session       │
│                                       │
│  • PROJ-501 (1 month ago)             │
│    Found 2 bugs, 38 min session       │
└───────────────────────────────────────┘
```

**Deliverable**: AgentDB finds similar past tickets

---

### 5.2 Basic Scenario Suggestions

**Tasks:**
- [ ] Create template scenarios by issue type (Bug, Story, Task)
- [ ] Analyze past session scenarios from similar tickets
- [ ] Generate 3-5 scenario suggestions
- [ ] Display scenarios as checklist in testing session

**Templates:**
```typescript
const SCENARIO_TEMPLATES = {
  Bug: [
    "Reproduce the reported bug",
    "Test edge cases",
    "Verify error messages",
    "Test with different user roles",
    "Check mobile/tablet versions"
  ],
  Story: [
    "Test happy path",
    "Test validation rules",
    "Test user permissions",
    "Test error handling",
    "Verify UI/UX matches design"
  ]
};
```

**Deliverable**: Testing session shows AI-suggested scenarios

---

### 5.3 Flow-Nexus LSTM (Optional for MVP)

**Tasks:**
- [ ] Set up Flow-Nexus account
- [ ] Train simple LSTM model on past sessions
- [ ] Integrate predictions into scenario suggestions
- [ ] Compare template vs LSTM accuracy

**Note**: Can defer to Phase 6 if time constrained. Templates work well for MVP.

---

## Phase 6: Polish & Enhancements (Week 11-12)

### 6.1 Background JIRA Sync

**Tasks:**
- [ ] Set up Supabase Cron job (every 15 min)
- [ ] Implement webhook server for real-time updates
- [ ] Configure JIRA webhook
- [ ] Test real-time ticket updates

**Deliverable**: JIRA tickets auto-sync without manual refresh

---

### 6.2 Calendar Integration

**Tasks:**
- [ ] Create `calendar_events` table
- [ ] Display calendar on dashboard
- [ ] Show testing sessions as events
- [ ] Add JIRA deadlines to calendar

**Deliverable**: Calendar shows work + personal events

---

### 6.3 Coach Personality

**Tasks:**
- [ ] Implement coach message system
- [ ] Add personality selector (4 types)
- [ ] Display coach messages on session end
- [ ] Show coach encouragement on streaks

**Deliverable**: Coach provides personality-based feedback

---

### 6.4 Daily Challenges

**Tasks:**
- [ ] Create `daily_challenges` table
- [ ] Implement challenge assignment logic
- [ ] Display daily challenge on dashboard
- [ ] Track challenge progress
- [ ] Award XP on completion

**Deliverable**: Daily challenges work, shown on dashboard

---

### 6.5 Mood Logging

**Tasks:**
- [ ] Create `mood_logs` table
- [ ] Add mood selector after testing session
- [ ] Store mood with context (work/personal)
- [ ] Display mood trends on dashboard

**Deliverable**: Can log mood after sessions, trends visible

---

## Phase 7: Production Ready (Week 13-14)

### 7.1 Testing & Bug Fixes

**Tasks:**
- [ ] End-to-end testing of all workflows
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Mobile responsive design
- [ ] Cross-browser testing

---

### 7.2 Deployment

**Tasks:**
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Configure production environment variables
- [ ] Set up domain (optional)
- [ ] Deploy MCP webhook server
- [ ] Configure production JIRA webhook

---

### 7.3 Documentation

**Tasks:**
- [ ] Write user guide
- [ ] Document MCP setup process
- [ ] Create troubleshooting guide
- [ ] Document API/database schema

---

## MVP Feature Checklist

### ✅ Must Have (Phase 1-4)

- [ ] **JIRA Integration**
  - [ ] Manual sync JIRA tickets
  - [ ] Display tickets in Work Space
  - [ ] Update ticket status via MCP
  - [ ] Create bugs from testing session

- [ ] **Testing Sessions**
  - [ ] Start/stop timer
  - [ ] Take notes
  - [ ] Log bugs found
  - [ ] End session summary

- [ ] **Gamification**
  - [ ] XP system (levels 1-50)
  - [ ] Testing streak tracking
  - [ ] 5 starter achievements
  - [ ] XP breakdown by source

- [ ] **Personal Space**
  - [ ] Create/complete tasks
  - [ ] Earn XP from tasks
  - [ ] Separate work/personal views

- [ ] **Dashboard**
  - [ ] Unified daily overview
  - [ ] Work + personal tasks
  - [ ] Streak display
  - [ ] XP/level progress

### 🎯 Should Have (Phase 5-6)

- [ ] **AI Predictions**
  - [ ] AgentDB similar tickets
  - [ ] Template scenario suggestions
  - [ ] Pattern learning (basic)

- [ ] **Enhancements**
  - [ ] Background JIRA sync (every 15 min)
  - [ ] Calendar integration
  - [ ] Coach personality
  - [ ] Daily challenges
  - [ ] Mood logging

### 💡 Nice to Have (Post-MVP)

- [ ] Real-time JIRA webhooks
- [ ] Flow-Nexus LSTM predictions
- [ ] Advanced achievements (50+ achievements)
- [ ] Habit tracking (beyond testing streak)
- [ ] Journal entries
- [ ] Countdowns
- [ ] Team leaderboards
- [ ] Analytics dashboard
- [ ] Mobile app

---

## Technology Stack (Final)

### Frontend
- **Framework**: Vite + React + TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State**: Zustand (lightweight) or React Context
- **Data Fetching**: Supabase client (built-in real-time)

### Backend
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **API**: Supabase Edge Functions (Deno)
- **Real-time**: Supabase Realtime subscriptions

### Integrations
- **JIRA**: ATLAS MCP Server (Node.js)
- **AI/ML**: Flow-Nexus (LSTM) + AgentDB (vectors)
- **Deployment**: Vercel (frontend) + Railway/Fly.io (MCP webhook)

### Development Tools
- **Package Manager**: npm or pnpm
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions (optional)

---

## Development Timeline Summary

| Phase | Duration | Features | Status |
|-------|----------|----------|--------|
| **1. Foundation** | Week 1-2 | Backend setup, MCP server, auth | 🔴 Not started |
| **2. JIRA Integration** | Week 3-4 | Sync tickets, testing sessions, bug creation | 🔴 Not started |
| **3. Gamification** | Week 5-6 | XP, streaks, achievements | 🔴 Not started |
| **4. Personal Space** | Week 7-8 | Tasks, unified dashboard, balanced day | 🔴 Not started |
| **5. AI Predictions** | Week 9-10 | AgentDB, scenario suggestions | 🔴 Not started |
| **6. Polish** | Week 11-12 | Auto-sync, calendar, coach, challenges | 🔴 Not started |
| **7. Production** | Week 13-14 | Testing, deployment, docs | 🔴 Not started |

**Total MVP Timeline**: 14 weeks (~3.5 months)

**Aggressive Timeline** (if focused full-time): 8 weeks (2 months)

---

## Success Metrics

### MVP Success Criteria

1. **Technical**:
   - JIRA tickets sync successfully
   - Testing sessions tracked accurately
   - XP/achievements unlock correctly
   - No critical bugs

2. **User Experience**:
   - Can complete full testing workflow in < 5 clicks
   - Dashboard loads in < 2 seconds
   - Real-time updates work smoothly

3. **Engagement**:
   - Use ATLAS for 80% of JIRA testing
   - Maintain 7-day testing streak
   - Unlock 10+ achievements in first month

4. **Integration**:
   - ATLAS feels like part of daily workflow, not separate tool
   - Balanced days happen naturally
   - Work stress detected and managed

---

## Next Steps (Immediate)

1. **Week 1**:
   - [ ] Set up Supabase project
   - [ ] Initialize React app
   - [ ] Create ATLAS MCP server skeleton
   - [ ] Design database schema (finalize)

2. **Week 2**:
   - [ ] Implement authentication
   - [ ] Build core MCP tools (5 tools)
   - [ ] Test JIRA sync locally
   - [ ] Create basic Work Space UI

3. **Week 3**:
   - [ ] Deploy Supabase Edge Function for sync
   - [ ] Build testing session UI
   - [ ] Implement timer component
   - [ ] Test end-to-end JIRA workflow

---

## Risk Mitigation

### Potential Risks

1. **JIRA API Rate Limits**:
   - **Mitigation**: Cache tickets, use webhooks instead of polling, implement exponential backoff

2. **MCP Server Complexity**:
   - **Mitigation**: Start with 5 core tools, expand later. Use well-tested `jira-client` library

3. **AI Predictions Accuracy**:
   - **Mitigation**: Start with templates, add ML incrementally. Template scenarios work well for MVP

4. **Scope Creep**:
   - **Mitigation**: Strict MVP feature list. Defer "nice to have" features to post-MVP

5. **Supabase Costs**:
   - **Mitigation**: Pro plan ($25/mo) sufficient for solo dev. Optimize queries, use caching

---

## Post-MVP Features (Backlog)

1. **Advanced AI**:
   - Flow-Nexus LSTM for scenario predictions
   - Pattern learning across multiple projects
   - Anomaly detection (repetitive bugs)

2. **Social Features**:
   - Team leaderboards
   - Share achievements
   - Collaborative testing sessions

3. **Mobile App**:
   - React Native app
   - Push notifications for streaks
   - Quick testing notes on mobile

4. **Analytics**:
   - Testing effectiveness dashboard
   - Bug patterns over time
   - Productivity heatmaps

5. **Integrations**:
   - Slack notifications
   - Google Calendar sync
   - Notion export for journal

---

## Conclusion

This MVP roadmap prioritizes:
1. **Core JIRA integration** (Phases 1-2)
2. **Basic gamification** (Phase 3)
3. **Personal space integration** (Phase 4)
4. **AI enhancements** (Phases 5-6)

**Result**: Fully functional ATLAS in ~3.5 months, with room for iteration based on real usage.

The unified database + Supabase backend keeps complexity low while enabling powerful real-time features and cross-space integration. MCP server decouples JIRA logic, making it easy to swap implementations or add other integrations later.

**Start with Phase 1 this week!** 🚀

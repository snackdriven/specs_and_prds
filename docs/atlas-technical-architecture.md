# ATLAS Technical Architecture Recommendations

## 1. Database Strategy

### RECOMMENDATION: **Single Unified Database** (PostgreSQL via Supabase)

**Rationale:**
- Solo dev: Simplicity over microservice complexity
- Shared data (XP, streaks, calendar) requires joins
- Easier transaction management (e.g., create bug + personal task atomically)
- Cost-effective (one Supabase instance)
- Real-time subscriptions work across all tables

### Database Schema

```sql
-- ============================================
-- USERS & AUTHENTICATION
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- User preferences
  preferences JSONB DEFAULT '{
    "default_space": "personal",
    "theme": "light",
    "notifications_enabled": true,
    "coach_personality": "encouraging"
  }'::jsonb
);

-- Supabase Auth handles authentication
-- This table extends user metadata

-- ============================================
-- SPACES (Organizational Context)
-- ============================================
CREATE TYPE space_type AS ENUM ('personal', 'work');

CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Personal", "Work"
  type space_type NOT NULL,
  color TEXT, -- For UI theming
  icon TEXT, -- Emoji or icon name
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TASKS (Personal + JIRA-linked)
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id),

  -- Core fields
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,

  -- Scheduling
  due_date DATE,
  due_time TIME,
  reminder_at TIMESTAMPTZ,

  -- Organization
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  tags TEXT[], -- ['work-spillover', 'self-care', 'urgent']

  -- JIRA integration
  jira_ticket_key TEXT, -- e.g., 'PROJ-456'
  is_jira_linked BOOLEAN DEFAULT FALSE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  auto_created BOOLEAN DEFAULT FALSE, -- True if AI created it

  -- Indexing
  CONSTRAINT fk_jira_ticket FOREIGN KEY (jira_ticket_key)
    REFERENCES jira_tickets(ticket_key) ON DELETE SET NULL
);

CREATE INDEX idx_tasks_user_due ON tasks(user_id, due_date) WHERE completed = FALSE;
CREATE INDEX idx_tasks_jira ON tasks(jira_ticket_key) WHERE is_jira_linked = TRUE;

-- ============================================
-- JIRA TICKETS (Cached from JIRA API)
-- ============================================
CREATE TABLE jira_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- JIRA identifiers
  ticket_key TEXT UNIQUE NOT NULL, -- 'PROJ-456'
  ticket_id TEXT NOT NULL, -- JIRA internal ID

  -- Core ticket data
  summary TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL, -- 'To Do', 'In Progress', 'Testing', 'Done'
  priority TEXT, -- 'High', 'Medium', 'Low'
  issue_type TEXT, -- 'Bug', 'Story', 'Task'

  -- Assignment
  assignee_email TEXT,
  reporter_email TEXT,

  -- Project context
  project_key TEXT,
  project_name TEXT,
  components TEXT[], -- ['Payment', 'Frontend']
  labels TEXT[],

  -- Scheduling
  created_date TIMESTAMPTZ,
  updated_date TIMESTAMPTZ,
  due_date DATE,

  -- Estimation
  story_points INTEGER,
  original_estimate_seconds INTEGER,
  remaining_estimate_seconds INTEGER,
  time_spent_seconds INTEGER,

  -- Sprint
  sprint_id TEXT,
  sprint_name TEXT,

  -- Sync metadata
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE, -- False if ticket completed/closed

  -- Full JIRA response (for debugging)
  raw_jira_data JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jira_user_active ON jira_tickets(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_jira_status ON jira_tickets(status);
CREATE INDEX idx_jira_project ON jira_tickets(project_key);

-- ============================================
-- TESTING SESSIONS (ATLAS Core Feature)
-- ============================================
CREATE TABLE testing_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ticket_key TEXT REFERENCES jira_tickets(ticket_key),

  -- Session timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  total_duration_seconds INTEGER, -- Excluding pauses

  -- Testing data
  scenarios JSONB NOT NULL DEFAULT '[]', -- Array of test scenarios
  /* Example:
  [
    {
      "id": 1,
      "description": "Test with expired card",
      "completed": true,
      "passed": false,
      "notes": "Error message unclear",
      "completed_at": "2025-11-16T10:30:00Z"
    }
  ]
  */

  notes TEXT, -- General session notes
  bugs_found INTEGER DEFAULT 0,
  bugs_created TEXT[], -- Array of JIRA bug keys created

  -- AI predictions
  ai_suggested_scenarios JSONB, -- Original AI suggestions
  ai_prediction_accuracy DECIMAL(3,2), -- 0.0 to 1.0

  -- Session state
  status TEXT CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  pauses JSONB DEFAULT '[]', -- [{ start: '...', end: '...', reason: '...' }]

  -- XP earned
  xp_earned INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_ticket ON testing_sessions(user_id, ticket_key);
CREATE INDEX idx_sessions_active ON testing_sessions(user_id, status) WHERE status IN ('active', 'paused');

-- ============================================
-- HABITS & STREAKS
-- ============================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id),

  name TEXT NOT NULL, -- 'Testing', 'Gym', 'Reading', 'Journal'
  description TEXT,

  -- Frequency
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'custom')),
  target_days INTEGER, -- e.g., 5 for 'Test 5 days/week'

  -- Tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,

  -- Special: Work vs Personal
  category TEXT CHECK (category IN ('work', 'personal', 'health', 'learning')),
  is_work_habit BOOLEAN DEFAULT FALSE, -- True for testing habit

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  completed_at DATE NOT NULL,

  -- Optional: Link to what triggered completion
  triggered_by TEXT, -- 'testing_session', 'manual', 'task_completion'
  related_entity_id UUID, -- e.g., testing_session.id

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(habit_id, completed_at) -- One log per day per habit
);

CREATE INDEX idx_habit_logs_recent ON habit_logs(habit_id, completed_at DESC);

-- ============================================
-- GAMIFICATION (XP, Levels, Achievements)
-- ============================================
CREATE TABLE user_xp (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Total XP
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  xp_to_next_level INTEGER DEFAULT 100,

  -- Breakdown by category
  work_xp INTEGER DEFAULT 0, -- From testing sessions
  personal_xp INTEGER DEFAULT 0, -- From personal tasks
  habit_xp INTEGER DEFAULT 0, -- From habit completions
  challenge_xp INTEGER DEFAULT 0, -- From daily challenges

  -- Stats
  total_sessions INTEGER DEFAULT 0,
  total_bugs_found INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Achievement definition
  name TEXT UNIQUE NOT NULL, -- 'Bug Hunter II', 'Week Warrior'
  description TEXT,
  category TEXT, -- 'testing', 'productivity', 'consistency'

  -- Requirements
  criteria JSONB NOT NULL,
  /* Example:
  {
    "type": "bug_count",
    "threshold": 50,
    "timeframe": "all_time"
  }
  */

  -- Rewards
  xp_reward INTEGER DEFAULT 0,
  badge_icon TEXT, -- URL or emoji

  -- Rarity
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,

  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress DECIMAL(5,2) DEFAULT 0.0, -- For multi-step achievements

  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_recent ON user_achievements(user_id, unlocked_at DESC);

-- ============================================
-- DAILY CHALLENGES
-- ============================================
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Challenge metadata
  challenge_type TEXT NOT NULL, -- 'testing-trio', 'bug-bounty', etc.
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('work', 'personal', 'unified')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),

  -- Date
  assigned_date DATE NOT NULL,

  -- Requirements
  requirements JSONB NOT NULL,
  /* Example:
  {
    "tickets_to_complete": 3,
    "bugs_to_find": 5,
    "task_breakdown": { "work": 2, "personal": 3 }
  }
  */

  -- Progress
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  -- Rewards
  xp_reward INTEGER,
  badge_reward TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, assigned_date) -- One challenge per day
);

CREATE INDEX idx_challenges_active ON daily_challenges(user_id, assigned_date)
  WHERE completed = FALSE;

-- ============================================
-- CALENDAR EVENTS
-- ============================================
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT,

  -- Timing
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT FALSE,

  -- Event type
  event_type TEXT CHECK (event_type IN (
    'testing_session',
    'personal_task',
    'jira_deadline',
    'reminder',
    'custom'
  )),

  -- Source tracking
  source TEXT, -- 'jira', 'testing_session', 'user', 'auto_generated'
  linked_entity_id UUID, -- ID of related task/session/ticket

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_user_time ON calendar_events(user_id, start_time);

-- ============================================
-- MOOD & JOURNAL
-- ============================================
CREATE TABLE mood_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  logged_at TIMESTAMPTZ DEFAULT NOW(),

  -- Mood
  mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'frustrated', 'tired', 'stressed')),
  mood_score DECIMAL(2,1) CHECK (mood_score BETWEEN 1.0 AND 5.0), -- 1.0 = worst, 5.0 = best

  -- Context
  context TEXT CHECK (context IN ('work', 'personal', 'general')),
  trigger TEXT, -- 'testing_session', 'task_completion', 'manual'
  related_entity_id UUID,

  -- Optional note
  note TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mood_user_time ON mood_logs(user_id, logged_at DESC);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  entry_date DATE NOT NULL,
  title TEXT,
  content TEXT,

  -- Tagging
  tags TEXT[],
  mood_at_writing TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, entry_date) -- One entry per day
);

CREATE INDEX idx_journal_user_date ON journal_entries(user_id, entry_date DESC);

-- ============================================
-- COUNTDOWNS
-- ============================================
CREATE TABLE countdowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,

  -- Display options
  category TEXT, -- 'work', 'personal', 'life_event'
  color TEXT,
  icon TEXT,

  -- JIRA integration
  jira_ticket_key TEXT,
  auto_created BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_countdowns_active ON countdowns(user_id, target_date) WHERE is_active = TRUE;

-- ============================================
-- AI / ML DATA (Pattern Learning)
-- ============================================
CREATE TABLE testing_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Pattern metadata
  pattern_type TEXT, -- 'effective_scenario', 'bug_pattern', 'time_optimization'

  -- Context
  ticket_type TEXT, -- 'Bug', 'Story', 'Task'
  component TEXT, -- 'Payment', 'Auth', 'UI'
  priority TEXT,

  -- Learned data
  pattern_data JSONB NOT NULL,
  /* Example:
  {
    "scenario": "Test with expired card",
    "success_rate": 0.8,
    "avg_bugs_found": 1.2,
    "sample_size": 10
  }
  */

  -- Effectiveness tracking
  confidence_score DECIMAL(3,2), -- 0.0 to 1.0
  sample_size INTEGER, -- How many sessions contributed

  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patterns_user_type ON testing_patterns(user_id, pattern_type);

-- AgentDB vectors stored separately (via AgentDB SDK)
-- Flow-Nexus LSTM models stored in Flow-Nexus platform

-- ============================================
-- MCP SYNC TRACKING
-- ============================================
CREATE TABLE jira_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  sync_type TEXT CHECK (sync_type IN ('background', 'webhook', 'manual')),

  -- Sync stats
  tickets_fetched INTEGER,
  tickets_created INTEGER,
  tickets_updated INTEGER,
  tickets_deleted INTEGER,

  -- Status
  status TEXT CHECK (status IN ('success', 'partial', 'failed')),
  error_message TEXT,

  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_log_user_time ON jira_sync_log(user_id, started_at DESC);

-- ============================================
-- COACH PERSONALITY
-- ============================================
CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  message TEXT NOT NULL,
  personality TEXT CHECK (personality IN ('encouraging', 'motivating', 'casual', 'professional')),

  -- Context
  triggered_by TEXT, -- 'session_end', 'streak_milestone', 'mood_detection'
  context_data JSONB,

  shown_at TIMESTAMPTZ DEFAULT NOW(),
  dismissed BOOLEAN DEFAULT FALSE
);

-- ============================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE jira_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
-- ... (enable for all user-specific tables)

-- Example policy: Users can only see their own data
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Repeat similar policies for all tables

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to all tables with updated_at

-- Auto-calculate XP level from total XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(XP / 100))
  RETURN FLOOR(SQRT(xp / 100.0));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level = calculate_level(NEW.total_xp);
  NEW.xp_to_next_level = (POWER(NEW.current_level + 1, 2) * 100) - NEW.total_xp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_xp_level
  BEFORE UPDATE ON user_xp
  FOR EACH ROW
  WHEN (NEW.total_xp <> OLD.total_xp)
  EXECUTE FUNCTION update_user_level();

-- Auto-update streak when habit logged
CREATE OR REPLACE FUNCTION update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_log_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get last completion date
  SELECT MAX(completed_at) INTO last_log_date
  FROM habit_logs
  WHERE habit_id = NEW.habit_id
    AND completed_at < NEW.completed_at;

  -- Get current streak
  SELECT current_streak INTO current_streak
  FROM habits
  WHERE id = NEW.habit_id;

  -- If consecutive day, increment streak
  IF last_log_date = NEW.completed_at - INTERVAL '1 day' THEN
    current_streak = current_streak + 1;
  ELSIF last_log_date IS NULL OR last_log_date < NEW.completed_at - INTERVAL '1 day' THEN
    -- Streak broken, reset to 1
    current_streak = 1;
  END IF;

  -- Update habit
  UPDATE habits
  SET
    current_streak = current_streak,
    longest_streak = GREATEST(longest_streak, current_streak),
    total_completions = total_completions + 1,
    updated_at = NOW()
  WHERE id = NEW.habit_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_streak_on_log
  AFTER INSERT ON habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_habit_streak();

-- ============================================
-- VIEWS (Useful aggregations)
-- ============================================

-- Dashboard data view
CREATE VIEW dashboard_summary AS
SELECT
  u.id AS user_id,

  -- Work tasks (from JIRA)
  (SELECT COUNT(*) FROM jira_tickets WHERE user_id = u.id AND is_active = TRUE) AS active_jira_tickets,
  (SELECT COUNT(*) FROM jira_tickets WHERE user_id = u.id AND status = 'Testing') AS tickets_in_testing,

  -- Personal tasks
  (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND completed = FALSE AND due_date = CURRENT_DATE) AS tasks_due_today,

  -- Streaks
  (SELECT COALESCE(SUM(current_streak), 0) FROM habits WHERE user_id = u.id AND is_active = TRUE) AS total_streak_days,

  -- XP
  (SELECT total_xp FROM user_xp WHERE user_id = u.id) AS total_xp,
  (SELECT current_level FROM user_xp WHERE user_id = u.id) AS current_level,

  -- Today's activity
  (SELECT COUNT(*) FROM testing_sessions WHERE user_id = u.id AND DATE(start_time) = CURRENT_DATE) AS sessions_today,
  (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND DATE(completed_at) = CURRENT_DATE) AS tasks_completed_today

FROM users u;

-- Testing effectiveness view
CREATE VIEW testing_effectiveness AS
SELECT
  user_id,
  ticket_key,

  COUNT(*) AS total_sessions,
  SUM(bugs_found) AS total_bugs_found,
  AVG(bugs_found) AS avg_bugs_per_session,
  AVG(total_duration_seconds) AS avg_session_duration,
  AVG(ai_prediction_accuracy) AS avg_ai_accuracy,

  SUM(xp_earned) AS total_xp_earned

FROM testing_sessions
WHERE status = 'completed'
GROUP BY user_id, ticket_key;
```

---

## 2. Backend Architecture

### RECOMMENDATION: **Supabase Backend + Serverless Edge Functions**

**Components:**

```
┌──────────────────────────────────────────────────┐
│             React Frontend (Vite)                 │
│  - Dashboard, Spaces UI, Testing Interface       │
│  - Real-time subscriptions (Supabase Realtime)   │
│  - MCP client (for JIRA operations)              │
└─────────────────┬────────────────────────────────┘
                  │
                  │ HTTP/WebSocket
                  │
┌─────────────────┴────────────────────────────────┐
│            Supabase Backend                       │
├───────────────────────────────────────────────────┤
│                                                   │
│  ┌────────────────────────────────────┐          │
│  │   PostgreSQL Database              │          │
│  │   (Schema defined above)           │          │
│  └────────────────────────────────────┘          │
│                                                   │
│  ┌────────────────────────────────────┐          │
│  │   Edge Functions (Deno)            │          │
│  │   ├─ sync-jira                     │          │
│  │   ├─ process-testing-session       │          │
│  │   ├─ calculate-achievements        │          │
│  │   ├─ assign-daily-challenge        │          │
│  │   └─ generate-ai-scenarios         │          │
│  └────────────────────────────────────┘          │
│                                                   │
│  ┌────────────────────────────────────┐          │
│  │   Realtime Subscriptions           │          │
│  │   - Tasks updates                  │          │
│  │   - JIRA ticket changes            │          │
│  │   - Testing session events         │          │
│  │   - XP/achievement notifications   │          │
│  └────────────────────────────────────┘          │
│                                                   │
│  ┌────────────────────────────────────┐          │
│  │   Authentication (Supabase Auth)   │          │
│  │   - Email/password                 │          │
│  │   - OAuth (future: Google, GitHub) │          │
│  └────────────────────────────────────┘          │
│                                                   │
│  ┌────────────────────────────────────┐          │
│  │   Storage (Supabase Storage)       │          │
│  │   - User avatars                   │          │
│  │   - JIRA attachment caching        │          │
│  └────────────────────────────────────┘          │
│                                                   │
└───────────────────────────────────────────────────┘
                  │
                  │ External integrations
                  │
    ┌─────────────┴─────────────┬────────────────┐
    │                           │                │
┌───▼──────────┐   ┌───────────▼──────┐  ┌─────▼─────────┐
│ ATLAS MCP    │   │ Flow-Nexus       │  │  AgentDB      │
│ Server       │   │ LSTM API         │  │  Vector DB    │
│ (JIRA Sync)  │   │ (Predictions)    │  │  (Patterns)   │
└──────────────┘   └──────────────────┘  └───────────────┘
```

### Key Supabase Edge Functions

#### 1. `sync-jira` - Background JIRA Sync

```typescript
// supabase/functions/sync-jira/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Get all users with JIRA integration
  const { data: users } = await supabase
    .from('users')
    .select('id, email, preferences')
    .not('preferences->jira_api_token', 'is', null);

  for (const user of users) {
    // Call ATLAS MCP server to fetch tickets
    const tickets = await fetchJiraTickets(user);

    // Upsert to database
    for (const ticket of tickets) {
      await supabase
        .from('jira_tickets')
        .upsert({
          user_id: user.id,
          ticket_key: ticket.key,
          ticket_id: ticket.id,
          summary: ticket.fields.summary,
          description: ticket.fields.description,
          status: ticket.fields.status.name,
          priority: ticket.fields.priority?.name,
          issue_type: ticket.fields.issuetype.name,
          assignee_email: ticket.fields.assignee?.emailAddress,
          project_key: ticket.fields.project.key,
          due_date: ticket.fields.duedate,
          raw_jira_data: ticket,
          last_synced_at: new Date().toISOString()
        }, {
          onConflict: 'ticket_key'
        });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

**Trigger:** Supabase Cron job every 15 minutes

```sql
-- In Supabase Dashboard > Database > Cron Jobs
SELECT cron.schedule(
  'sync-jira-tickets',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://<project-ref>.supabase.co/functions/v1/sync-jira',
    headers := '{"Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb
  ) AS request_id;
  $$
);
```

#### 2. `process-testing-session` - Handle Session End

```typescript
// supabase/functions/process-testing-session/index.ts
serve(async (req) => {
  const { sessionId } = await req.json();
  const supabase = createClient(/*...*/);

  // Fetch session data
  const { data: session } = await supabase
    .from('testing_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  // 1. Calculate XP
  const xp = calculateSessionXP(session);
  await supabase
    .from('user_xp')
    .update({
      total_xp: supabase.sql`total_xp + ${xp}`,
      work_xp: supabase.sql`work_xp + ${xp}`,
      total_sessions: supabase.sql`total_sessions + 1`,
      total_bugs_found: supabase.sql`total_bugs_found + ${session.bugs_found}`
    })
    .eq('user_id', session.user_id);

  // 2. Update testing streak habit
  await supabase.from('habit_logs').insert({
    habit_id: await getTestingHabitId(session.user_id),
    user_id: session.user_id,
    completed_at: new Date().toISOString().split('T')[0],
    triggered_by: 'testing_session',
    related_entity_id: sessionId
  });

  // 3. Check for achievement unlocks
  await checkAchievements(session.user_id, {
    total_bugs: session.bugs_found,
    session_duration: session.total_duration_seconds
  });

  // 4. Create calendar event
  await supabase.from('calendar_events').insert({
    user_id: session.user_id,
    title: `Testing: ${session.ticket_key}`,
    start_time: session.start_time,
    end_time: session.end_time,
    event_type: 'testing_session',
    source: 'testing_session',
    linked_entity_id: sessionId,
    metadata: { bugs_found: session.bugs_found }
  });

  // 5. Train AI patterns (async)
  await trainPatterns(session);

  return new Response(JSON.stringify({ success: true, xp_earned: xp }));
});
```

#### 3. `generate-ai-scenarios` - AI Test Predictions

```typescript
// supabase/functions/generate-ai-scenarios/index.ts
serve(async (req) => {
  const { ticketKey } = await req.json();
  const supabase = createClient(/*...*/);

  // Fetch ticket details
  const { data: ticket } = await supabase
    .from('jira_tickets')
    .select('*')
    .eq('ticket_key', ticketKey)
    .single();

  // 1. AgentDB: Find similar past tickets
  const similarTickets = await agentdb.query({
    query: `${ticket.summary} ${ticket.description}`,
    topK: 5,
    filter: { component: ticket.components }
  });

  // 2. Flow-Nexus LSTM: Predict scenarios
  const predictions = await flowNexus.predict({
    model: 'testing-scenarios',
    input: {
      issueType: ticket.issue_type,
      component: ticket.components[0],
      priority: ticket.priority,
      summary: ticket.summary
    },
    context: similarTickets.map(t => t.metadata.scenarios)
  });

  // 3. Merge with template scenarios
  const scenarios = mergeScenarios(predictions, ticket.issue_type);

  return new Response(JSON.stringify({ scenarios }));
});
```

---

## 3. Authentication Strategy

### RECOMMENDATION: **Supabase Auth with Single Sign-On**

**Implementation:**

```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        // Initialize user preferences
        preferences: {
          default_space: 'personal',
          theme: 'light'
        }
      }
    }
  });

  if (!error && data.user) {
    // Create initial user record in users table
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email,
      created_at: new Date().toISOString()
    });

    // Create default spaces
    await supabase.from('spaces').insert([
      {
        user_id: data.user.id,
        name: 'Personal',
        type: 'personal',
        color: '#4F46E5',
        icon: '🏠'
      },
      {
        user_id: data.user.id,
        name: 'Work',
        type: 'work',
        color: '#10B981',
        icon: '💼'
      }
    ]);

    // Create testing habit
    await supabase.from('habits').insert({
      user_id: data.user.id,
      name: 'Testing',
      frequency: 'daily',
      category: 'work',
      is_work_habit: true
    });

    // Initialize XP
    await supabase.from('user_xp').insert({
      user_id: data.user.id,
      total_xp: 0,
      current_level: 1
    });
  }

  return { data, error };
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChanged((event, session) => {
    callback(session?.user);
  });
}
```

**Flow:**

1. User signs up → Supabase Auth creates account
2. Trigger creates user record + default spaces + habits
3. User logs in → JWT token stored in localStorage
4. Frontend uses token for all API calls (automatic with Supabase client)
5. Row-level security ensures data isolation

---

## 4. Real-time Updates

### Supabase Realtime Subscriptions

```typescript
// src/hooks/useRealtimeJiraTickets.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useRealtimeJiraTickets(userId: string) {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchTickets = async () => {
      const { data } = await supabase
        .from('jira_tickets')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('priority', { ascending: false });

      setTickets(data || []);
    };

    fetchTickets();

    // Subscribe to changes
    const subscription = supabase
      .channel('jira_tickets')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'jira_tickets',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets(prev => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setTickets(prev => prev.map(t =>
              t.id === payload.new.id ? payload.new : t
            ));
          } else if (payload.eventType === 'DELETE') {
            setTickets(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  return tickets;
}
```

**Use in components:**

```typescript
function WorkSpace() {
  const { user } = useAuth();
  const tickets = useRealtimeJiraTickets(user.id);

  // tickets automatically updates when JIRA sync runs!
  return (
    <div>
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
```

---

## 5. MCP Server Deployment

### Local Development Setup

```bash
# atlas-mcp-server/
npm install
npm run build

# Add to Claude Desktop config (~/.config/claude/config.json)
{
  "mcpServers": {
    "atlas-jira": {
      "command": "node",
      "args": ["C:/Users/bette/Desktop/atlas-mcp-server/dist/server.js"],
      "env": {
        "JIRA_HOST": "your-company.atlassian.net",
        "JIRA_EMAIL": "your-email@company.com",
        "JIRA_API_TOKEN": "your_token"
      }
    }
  }
}
```

### Production Deployment (Webhook Server)

**Option 1: Serverless (Recommended for solo dev)**

Deploy webhook server to Vercel/Railway/Fly.io:

```typescript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "webhook-server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/jira/webhook",
      "dest": "/webhook-server.ts"
    }
  ]
}
```

**Option 2: VPS**

Deploy to DigitalOcean/AWS with PM2:

```bash
pm2 start webhook-server.js --name atlas-webhook
pm2 start sync-worker.js --name atlas-sync-worker
pm2 save
```

---

## 6. Cost Estimation (Solo Dev)

| Service | Tier | Cost/Month |
|---------|------|-----------|
| **Supabase** | Pro | $25 |
| **Flow-Nexus** | Starter (LSTM + AgentDB) | $10-20 |
| **MCP Server Hosting** | Vercel Hobby / Railway Hobby | $0-5 |
| **JIRA** | Existing work account | $0 |
| **Domain** | Optional | $12/year |
| **TOTAL** | | **~$35-50/month** |

**Scaling costs:** Only pay more if user base grows (unlikely for solo dev tool)

---

## 7. Development Workflow

```bash
# Local development
cd main-app
npm run dev  # Vite React app on localhost:5173

# Supabase local development (optional)
npx supabase start  # Local Postgres + Edge Functions

# MCP server
cd atlas-mcp-server
npm run dev  # Rebuild on file changes

# Test MCP tools
claude-code --test-mcp atlas-jira jira_get_assigned_issues
```

---

## Summary: Why This Architecture?

✅ **Single Database**: Simpler for solo dev, enables complex joins
✅ **Supabase**: Batteries included (auth, realtime, storage, edge functions)
✅ **MCP Server**: Decoupled JIRA integration, can swap MCP implementation
✅ **Flow-Nexus/AgentDB**: Managed ML services, no need to train/host models
✅ **Serverless Functions**: Pay per use, scales to zero
✅ **Real-time**: Instant UI updates without polling
✅ **Cost-Effective**: ~$40/month for full-featured app
✅ **Scalable**: Can migrate to microservices later if needed

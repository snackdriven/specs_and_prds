# Implementation Guide

## Overview

This guide provides a phased approach to building the journal templates and chore breakdown system for your ADHD-friendly productivity app.

**Guiding Principles:**
- Build for yourself first (solve your own pain points)
- Start with core features, iterate based on use
- Ship small, ship often
- Optimize for usefulness over complexity

---

## Phase 0: Foundation (Prerequisites)

**Ensure these exist before starting:**

### Database Schema

```sql
-- Existing (assumed from context)
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'general', -- 'general', 'maintenance', 'project'
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- NEW: Journal system
CREATE TABLE journal_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'as-needed'
  icon TEXT,
  color TEXT,
  estimated_minutes INTEGER,
  mood_prompt TEXT, -- 'before', 'after', 'both', 'optional', 'disabled'
  spotify_capture TEXT DEFAULT 'auto', -- 'auto', 'manual', 'disabled'
  suggested_frequency TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_template_sections (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES journal_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  section_type TEXT NOT NULL, -- 'text', 'bullet-list', 'number-scale', 'multiple-choice'
  required BOOLEAN DEFAULT false,
  placeholder TEXT,
  max_length INTEGER,
  options JSONB, -- For multiple-choice type
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES journal_templates(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  mood_before JSONB, -- { emoji: string, label: string, timestamp: timestamp }
  mood_after JSONB,
  spotify_track JSONB, -- { id, name, artist, album, album_art, url }
  triggered_by_chore UUID REFERENCES chores(id), -- If auto-prompted
  is_draft BOOLEAN DEFAULT false
);

CREATE TABLE journal_entry_sections (
  id UUID PRIMARY KEY,
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  template_section_id UUID REFERENCES journal_template_sections(id),
  content JSONB NOT NULL, -- Flexible: text, array of strings, number, etc.
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NEW: Chore system
CREATE TABLE chore_templates (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'vehicle', 'home', 'health', 'equipment', 'pet', 'other'
  description TEXT,
  default_interval JSONB NOT NULL, -- { value: number, unit: string, flexible: boolean }
  estimated_minutes INTEGER,
  difficulty TEXT, -- 'easy', 'medium', 'hard', 'professional'
  cost_estimate JSONB, -- { min: number, max: number, currency: string }
  external_dependency BOOLEAN DEFAULT false,
  safety_notes TEXT,
  icon TEXT,
  color TEXT,
  seasonal_variations JSONB, -- Array of season-specific subtask sets
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chore_template_subtasks (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES chore_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER,
  optional BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  requires_photo BOOLEAN DEFAULT false,
  metric_capture TEXT, -- Which metric to prompt for at this step
  safety_warning TEXT,
  season TEXT, -- NULL for all seasons, or 'spring', 'summer', 'fall', 'winter'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chores (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES chore_templates(id),
  name TEXT NOT NULL,
  interval JSONB NOT NULL, -- { time: {value, unit}, metric: {value, unit, key}, whichever_first: boolean }
  next_due_date TIMESTAMP,
  next_due_metric JSONB, -- { key: string, value: number, unit: string }
  reminder_days_before INTEGER DEFAULT 7,
  cost_estimate JSONB,
  notes TEXT,
  current_metric_value JSONB, -- { key: string, value: number, updated_at: timestamp }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  archived_at TIMESTAMP
);

CREATE TABLE chore_subtasks (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER,
  optional BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  requires_photo BOOLEAN DEFAULT false,
  metric_capture TEXT,
  safety_warning TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chore_completions (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  time_spent_minutes INTEGER,
  metrics JSONB NOT NULL, -- { odometer: 65250, cost: 45.99, ... }
  notes TEXT,
  photos JSONB, -- Array of { url, caption, step_id }
  journal_entry_id UUID REFERENCES journal_entries(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chore_subtask_completions (
  id UUID PRIMARY KEY,
  completion_id UUID REFERENCES chore_completions(id) ON DELETE CASCADE,
  subtask_id UUID REFERENCES chore_subtasks(id),
  completed_at TIMESTAMP,
  notes TEXT,
  photo_urls JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_journal_entries_created ON journal_entries(created_at DESC);
CREATE INDEX idx_journal_entries_template ON journal_entries(template_id);
CREATE INDEX idx_chores_next_due ON chores(next_due_date) WHERE archived_at IS NULL;
CREATE INDEX idx_chore_completions_chore ON chore_completions(chore_id);
CREATE INDEX idx_tasks_type ON tasks(task_type);
```

### API Endpoints (to create)

**Journal:**
- `GET /api/journal/templates` - List all templates
- `GET /api/journal/templates/:id` - Get template with sections
- `POST /api/journal/entries` - Create new entry
- `PATCH /api/journal/entries/:id` - Update entry (auto-save)
- `GET /api/journal/entries` - List user's entries
- `GET /api/journal/entries/:id` - Get single entry

**Chores:**
- `GET /api/chores/templates` - List all chore templates
- `GET /api/chores/templates/:id` - Get template with subtasks
- `POST /api/chores` - Create chore from template
- `GET /api/chores` - List user's chores
- `GET /api/chores/:id` - Get chore details
- `POST /api/chores/:id/complete` - Complete chore
- `GET /api/chores/upcoming` - Get upcoming due chores

**Spotify:**
- `GET /api/spotify/now-playing` - Get current track
- `POST /api/spotify/search` - Search tracks

---

## Phase 1: Journal Templates (Week 1-2)

**Goal:** Basic journaling with 3-5 core templates

### Week 1: Template System

**Priority 1: Data + Templates**

1. **Seed Core Templates** (Day 1)
   - Create SQL seed file with 5 templates:
     - Daily Reflection
     - Morning Intention
     - Quick Win
     - Gratitude Practice
     - Problem Solving
   - Include all sections per template spec
   - Run migration

2. **Template Selection UI** (Day 2-3)
   - Build template list screen
   - Category filters
   - Template cards with icon, time estimate
   - "Start Journaling" action

3. **Basic Entry Creation** (Day 4-5)
   - Create entry from template
   - Render sections based on type:
     - Text input
     - Bullet list (simple text area, split by newlines)
     - Number scale (slider)
     - Multiple choice (radio buttons)
   - Save draft on each section completion
   - Complete entry

**Acceptance Criteria:**
- Can select template
- Can complete all 5 section types
- Entry persists in database
- Can view completed entries

### Week 2: Mood + Spotify

**Priority 2: Integrations**

1. **Mood Snapshots** (Day 1-2)
   - Mood selection UI (emoji grid)
   - Capture before/after based on template config
   - Store in JSONB
   - Display in entry history

2. **Spotify Integration** (Day 3-5)
   - Connect Spotify API
   - "Now Playing" capture
   - Manual search and select
   - Display track in entry
   - Tap to play on Spotify (external link)

**Acceptance Criteria:**
- Mood captured and displayed
- Spotify track captured (if playing)
- Can manually search/select track
- View entry shows track info

**Deliverable:** Functional journaling system with 5 templates

---

## Phase 2: Chore Templates (Week 3-4)

**Goal:** Create and view chores with basic reminders

### Week 3: Chore Creation

**Priority 1: Template System**

1. **Seed Chore Templates** (Day 1)
   - Create SQL seed file with 5 templates:
     - Oil Change (vehicle)
     - HVAC Service (home)
     - Dental Checkup (health)
     - Air Filter (home)
     - Tire Rotation (vehicle)
   - Include subtasks per spec
   - Run migration

2. **Chore Template Selection** (Day 2)
   - Template list screen
   - Category filter
   - Template cards with time, cost, difficulty
   - "Use Template" action

3. **Chore Creation Flow** (Day 3-5)
   - 3-step wizard:
     - Step 1: Details (name, interval, first due, notes)
     - Step 2: Subtasks (review, edit, reorder)
     - Step 3: Reminders (days before, notification prefs)
   - Create chore + subtasks in DB
   - Calculate next due date

**Acceptance Criteria:**
- Can browse templates by category
- Can customize details
- Can edit subtasks
- Chore saved with correct next due date

### Week 4: Chore Viewing + Reminders

**Priority 2: Core Workflows**

1. **Chore List Screen** (Day 1-2)
   - View all chores
   - Filter: upcoming, overdue, all
   - Sort by due date
   - Quick actions: mark complete, view details

2. **Chore Detail Screen** (Day 2-3)
   - View chore info
   - Last completed date, cost, notes
   - Subtask breakdown
   - "Complete" or "Create Task" buttons

3. **Simple Reminders** (Day 4-5)
   - Daily cron job checks chores due in 7 days
   - Create notification entry
   - Show on home dashboard
   - Tap to view chore details

**Acceptance Criteria:**
- Can view all chores
- Can see upcoming due dates
- Reminder appears 7 days before due
- Tap reminder → chore details

**Deliverable:** Chore system with templates and basic reminders

---

## Phase 3: Chore Completion Flows (Week 5-6)

**Goal:** Complete chores with metrics and photos

### Week 5: Simple Completion

**Priority 1: Single-Task Mode**

1. **Quick Completion Flow** (Day 1-3)
   - "Mark Complete" button on chore
   - Capture required metrics (form)
   - Optional notes and photos
   - Save completion
   - Calculate next due date
   - Update chore

2. **Completion History** (Day 3-5)
   - View past completions
   - Show: date, cost, notes, photos
   - Edit past completions
   - Delete if needed

**Acceptance Criteria:**
- Can complete chore with metrics
- Next due date auto-calculated
- History displays correctly

### Week 6: Checklist Mode

**Priority 2: Step-by-Step**

1. **Checklist UI** (Day 1-3)
   - Show all subtasks
   - Expand current step
   - Progress bar
   - Timer (optional)
   - Complete step by step
   - Capture photos per step
   - Metric capture at relevant steps

2. **Step Persistence** (Day 3-4)
   - Save progress if interrupted
   - Resume where left off
   - "You started this X hours ago" prompt

3. **Final Completion** (Day 5)
   - After all required steps done
   - Capture final metrics
   - Overall notes
   - Show time spent (auto-tracked)
   - Save completion

**Acceptance Criteria:**
- Can complete chore step-by-step
- Progress persists across sessions
- Time auto-tracked
- Photos attached to steps

**Deliverable:** Full chore completion workflows (simple + checklist)

---

## Phase 4: Integration Points (Week 7-8)

**Goal:** Connect journals, chores, tasks

### Week 7: Post-Chore Journaling

**Priority 1: Triggers**

1. **Post-Chore Prompt** (Day 1-2)
   - After chore completion (if >30 min or >$100)
   - Show journal prompt
   - "Quick Journal Entry" or "Quick Win"
   - Pre-fill chore name
   - Link entry to completion

2. **Post-Chore Reflection Template** (Day 2-3)
   - Create template
   - Pre-populate "What You Completed"
   - Capture mood after
   - Quick thoughts
   - Spotify capture

3. **Quick Win Integration** (Day 4-5)
   - Quick Win from chore completion
   - Pre-fill accomplishment
   - Mood selection
   - Save + celebrate

**Acceptance Criteria:**
- Prompt appears after chore completion
- Can create journal entry or quick win
- Entry linked to chore completion

### Week 8: Task ↔ Chore Connection

**Priority 2: Workflows**

1. **Create Task from Chore** (Day 1-3)
   - "Create Task" button on chore reminder
   - Import subtasks as task description
   - Link task to chore
   - When task completed → prompt to complete chore

2. **Chore References in Journals** (Day 3-5)
   - Auto-detect chore mentions in journal entries
   - Link entries to chores
   - Show in chore history: "You journaled about this"

**Acceptance Criteria:**
- Can create task from chore
- Task completion prompts chore completion
- Journal entries link to chores

**Deliverable:** Integrated system (journals + chores + tasks)

---

## Phase 5: Advanced Features (Week 9-10)

**Goal:** Smart features, insights, polish

### Week 9: Intelligence

**Priority 1: Patterns + Suggestions**

1. **Mood Correlation** (Day 1-3)
   - Analyze mood before/after chores
   - Calculate average mood shift
   - Surface insights: "Completing chores boosts your mood by X%"
   - Show on insights dashboard

2. **Energy Audit Integration** (Day 3-5)
   - Detect chores in Energy Audit entries
   - Track which chores drain energy
   - Suggest scheduling draining chores on light days
   - Smart scheduling recommendations

**Acceptance Criteria:**
- Insights show mood correlation
- Energy draining chores identified
- Scheduling suggestions appear

### Week 10: Seasonal + Variations

**Priority 2: Adaptations**

1. **Seasonal Chore Variations** (Day 1-3)
   - Detect current season
   - Load season-specific subtasks
   - Prompt user: "This is spring cleaning - different steps?"
   - Allow manual override

2. **Template Customization** (Day 3-5)
   - Edit existing templates
   - Save as custom template
   - Share across devices (export/import JSON)
   - Reset to default

**Acceptance Criteria:**
- Seasonal subtasks load correctly
- Can customize templates
- Custom templates persist

**Deliverable:** Smart, adaptive system

---

## Phase 6: Polish + Launch (Week 11-12)

**Goal:** Production-ready app

### Week 11: UI/UX Polish

**Priority 1: Experience**

1. **Onboarding** (Day 1-2)
   - Welcome screens
   - Quick tutorial
   - Sample entries/chores
   - Template recommendations

2. **Animations + Feedback** (Day 2-3)
   - Smooth transitions
   - Progress animations
   - Haptic feedback
   - Success celebrations

3. **Accessibility** (Day 4-5)
   - Screen reader support
   - Color contrast fixes
   - Font size options
   - Keyboard navigation

**Acceptance Criteria:**
- Smooth, polished experience
- WCAG AA compliance
- Onboarding guides new users

### Week 12: Testing + Launch

**Priority 2: Stability**

1. **Bug Fixes** (Day 1-3)
   - Test all flows
   - Fix edge cases
   - Performance optimization
   - Error handling

2. **Data Migration** (Day 3-4)
   - Import existing tasks as chores (if applicable)
   - Set initial due dates
   - Preserve history

3. **Documentation** (Day 4-5)
   - User guide
   - FAQ
   - Template library reference
   - Release notes

**Deliverable:** Shipped app!

---

## Technical Stack Recommendations

**Frontend:**
- React Native (cross-platform mobile)
- TypeScript (type safety for ADHD-friendly dev)
- Expo (faster iteration)
- React Navigation (routing)
- React Hook Form (forms with validation)
- Zustand or Redux (state management)

**Backend:**
- Node.js + Express (or Next.js API routes)
- PostgreSQL (robust relational DB)
- Prisma (type-safe ORM)
- JWT auth (simple, stateless)

**Integrations:**
- Spotify Web API (OAuth + now-playing)
- Push notifications (Expo Notifications)
- Calendar (react-native-calendar-events)
- Camera (expo-camera for photos)

**Deployment:**
- Backend: Railway, Render, or Fly.io
- Database: Supabase or managed Postgres
- Mobile: Expo EAS Build → App Store/Play Store

---

## Development Best Practices

### For Solo Dev with ADHD

**1. Work in Short Sprints**
- 2-hour focus blocks
- Clear deliverable per session
- Celebrate small wins

**2. Ship Incrementally**
- Don't wait for perfect
- Release after each phase
- Iterate based on your own use

**3. Dogfood Immediately**
- Use the app yourself from Phase 1
- Fix what annoys you
- Add features you actually need

**4. Keep It Simple**
- Resist feature creep
- Build what you'll use 80% of the time
- Advanced features can wait

**5. Document as You Go**
- Future you will forget why you did things
- Comment complex logic
- Keep a dev journal (meta!)

---

## Success Metrics

**Phase 1-2 (MVP):**
- Can journal daily with 5 templates
- Can create and view 5 chore types
- Reminders work

**Phase 3-4 (Integration):**
- Complete chores via checklist
- Journal after chore completion
- Tasks created from chores

**Phase 5-6 (Intelligence):**
- Insights show patterns
- Smart suggestions appear
- Seasonal variations work

**Launch:**
- Using app daily for 2+ weeks
- Haven't missed a chore reminder
- Journaling streak >7 days
- Actually reduces your ADHD overwhelm!

---

## Risks & Mitigation

**Risk 1: Scope Creep**
- Mitigation: Stick to phase plan, resist adding features mid-phase

**Risk 2: Spotify API Complexity**
- Mitigation: Make Spotify optional, graceful fallback to manual entry

**Risk 3: Notification Reliability**
- Mitigation: Use proven libraries (Expo Notifications), test extensively

**Risk 4: Burnout**
- Mitigation: Take breaks, ship small, don't over-commit

**Risk 5: Over-Engineering**
- Mitigation: Build for N=1 (yourself), generalize later

---

## Post-Launch Iteration Ideas

**Future Enhancements (Only if you need them):**

1. **Recurring Tasks**
   - Template library for common tasks (like chores but daily/weekly)

2. **Goal Tracking**
   - Link journal entries to goals
   - Progress visualization

3. **Habit Streaks**
   - Beyond journaling
   - Chore completion streaks
   - Rewards/badges

4. **Social Features**
   - Share templates with friends
   - Anonymous mood trends (if multi-user)

5. **AI Insights**
   - GPT-powered journal prompts
   - Sentiment analysis
   - Pattern detection

6. **Voice Input**
   - Dictate journal entries
   - Voice commands for task creation

7. **Gamification**
   - Points for completion
   - Levels and achievements
   - Challenges with friends

8. **Advanced Analytics**
   - Cost trends over time
   - Maintenance ROI (DIY vs. shop)
   - Energy/mood correlations

**But remember:** Only build these if they solve a real problem you're experiencing. Don't build for imaginary users.

---

## Final Thoughts

**You're building for yourself first.** This is your superpower as a solo dev. Every feature decision should pass the test: "Will I actually use this?"

**Start small, ship often, iterate fast.** Phases 1-2 give you a usable app. Everything after that is icing.

**Embrace imperfection.** Done is better than perfect. Ship messy code, refactor later. The goal is to reduce YOUR ADHD overwhelm, not to build a perfect app.

**Trust the process.** This guide gives you structure, but adapt as you learn. Your needs will evolve as you use the app.

Good luck! You've got this. 🚀

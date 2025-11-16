# Journal Templates & Chore Breakdown Design Summary

## 📋 Document Overview

This design package contains comprehensive specifications for journal templates and chore breakdown workflows for your ADHD-friendly productivity app.

**Created:** June 2025
**For:** Solo developer building personal productivity app
**Design Philosophy:** ADHD-friendly, practical, optimized for usefulness over complexity

---

## 📁 Document Structure

### 1. Journal Templates
**File:** `journal-templates/template-library.md`

**Contents:**
- 15 complete journal templates
- ADHD-friendly design principles
- Mood and Spotify integration specs
- Template customization system

**Key Templates:**
- Daily Reflection (5-7 min)
- Morning Intention (3-5 min)
- Gratitude Practice (3-4 min)
- Problem Solving (8-10 min)
- Anxiety Processing (5-7 min)
- Quick Win Capture (1-2 min)
- Weekly Review (10-15 min)
- And 8 more...

**Template Structure:**
```typescript
interface JournalTemplate {
  id: string
  name: string
  category: 'daily' | 'weekly' | 'monthly' | 'as-needed'
  sections: TemplateSection[] // 3-7 prompts
  moodPrompt: 'before' | 'after' | 'both' | 'optional'
  spotifyCapture: 'auto' | 'manual' | 'disabled'
  estimatedMinutes: number
  icon: string
  color: string
}
```

---

### 2. Chore Template Library
**File:** `chore-workflows/chore-template-library.md`

**Contents:**
- 17 complete chore templates
- Vehicle, home, health, equipment categories
- Subtask breakdowns for each chore
- Metric tracking specifications
- Seasonal variations

**Key Templates:**

**Vehicle (6):**
- Oil Change (45-60 min, $30-80)
- Tire Rotation (30-60 min, $20-50)
- State Inspection (45-90 min, $15-50)
- Brake Inspection (30-45 min, $0-400)
- Battery Test (15-20 min, free-$200)
- Air Filter (10-15 min, $15-30)

**Home (6):**
- HVAC Service (60-90 min, $80-150)
- Clean Gutters (2-4 hrs, $0-200)
- HVAC Filter (5-10 min, $10-30)
- Smoke Detectors (15-20 min, $0-30)
- Dryer Vent (30-60 min, $20-150)
- Water Heater (30-45 min, $0-150)

**Health (3):**
- Dental Checkup (60 min, $0-150)
- Annual Physical (45-60 min, $0-200)
- Prescription Refills (15-30 min, varies)

**Equipment (2):**
- Lawn Mower Prep (30-45 min, $20-50)
- Computer Backup (20-30 min, free)

**Template Structure:**
```typescript
interface ChoreTemplate {
  name: string
  category: 'vehicle' | 'home' | 'health' | 'equipment'
  defaultInterval: { value: number, unit: string }
  subtasks: ChoreSubtask[] // Step-by-step breakdown
  estimatedMinutes: number
  costEstimate: { min: number, max: number }
  requiredMetrics: string[] // e.g., ['odometer', 'cost']
  seasonalVariations?: SeasonalVariation[]
}
```

---

### 3. Chore Breakdown Workflows
**File:** `chore-workflows/breakdown-workflows.md`

**Contents:**
- 6 detailed workflow diagrams
- Chore creation flow (3-step wizard)
- Chore reminder flow (notification → action)
- Chore completion flows (simple + checklist modes)
- Seasonal variation handling
- External dependency workflows (appointments)
- Edge case handling (early/late/no longer needed)

**Key Workflows:**

**Workflow 1: Chore Creation**
```
Template Selection
    ↓
Customize Details (name, interval, first due)
    ↓
Review Subtasks (edit, reorder, add/remove)
    ↓
Configure Reminders (7 days before, metric-based)
    ↓
Chore Created ✓
```

**Workflow 2: Chore Reminder**
```
7 days before due → Notification
    ↓
User Actions:
  - Create Task (import subtasks)
  - View Details
  - Snooze 3 days
  - Dismiss
```

**Workflow 3: Chore Completion**

**Mode A - Simple (Single-Task):**
- Quick "Mark Complete"
- Capture metrics (odometer, cost, etc.)
- Optional notes and photos
- Auto-calculate next due date

**Mode B - Checklist (Step-by-Step):**
- Walk through each subtask
- Progress bar visualization
- Auto-track time spent
- Photos per step
- Metric capture at relevant steps
- Final summary with all details

---

### 4. Integration Points
**File:** `integration/journal-chore-integration.md`

**Contents:**
- 10 integration scenarios
- Post-chore journal prompts
- Mood correlation tracking
- Energy audit connections
- Spotify integration across systems
- Task ↔ Chore ↔ Journal linking

**Key Integrations:**

**Integration 1: Post-Chore Journaling**
- Trigger after chore completion (>30 min or >$100)
- "Post-Chore Reflection" template
- Auto-fill chore name
- Capture accomplishment mood
- Link entry to completion

**Integration 2: Mood Correlation**
- Track mood before/after chores
- Calculate average mood shift
- Identify which chores boost/drain mood
- Surface insights: "Vehicle maintenance boosts mood by 22%"

**Integration 3: Energy-Aware Scheduling**
- Detect energy-draining chores in Energy Audit
- Suggest scheduling on lighter days
- Proactive recommendations

**Integration 4: Spotify Memories**
- Capture music during chore completion
- Attach to journal entries
- Build "maintenance playlist" over time
- Musical memory anchors

**Data Flow:**
```
CHORE → Creates TASK (when due)
  ↓
TASK Completed → Updates CHORE
  ↓
CHORE Completed → Triggers JOURNAL Prompt
  ↓
JOURNAL Entry → Captures Mood + Spotify
  ↓
INSIGHTS Generated → Mood/Energy Correlations
```

---

### 5. UI Mockups & Wireframes
**File:** `ui-mockups/screen-wireframes.md`

**Contents:**
- 10 detailed screen mockups
- Design system specifications
- Component library
- Interaction patterns
- Accessibility guidelines

**Key Screens:**

1. **Home Dashboard** - Quick capture, upcoming maintenance, suggested journals
2. **Journal Template Selection** - Visual cards, time estimates, streaks
3. **Journal Entry** - Progressive sections, mood capture, Spotify integration
4. **Chore Template Selection** - Category filters, cost/time estimates
5. **Chore Creation** - 3-step wizard (details, subtasks, reminders)
6. **Chore Checklist** - Step-by-step completion, progress tracking
7. **Maintenance Reminder** - Notification and in-app detail view
8. **Insights Dashboard** - Mood trends, maintenance stats, correlations
9. **Spotify Integration** - Now playing capture, manual search
10. **Settings** - Customization, notifications, integrations

**Design System:**
- **Color Palette:** 15 template-specific colors + UI colors
- **Typography:** Clear hierarchy (28px/22px/18px/16px)
- **Icons:** Emoji-based for clarity
- **Spacing:** Consistent (16px edges, 24px sections)
- **Touch Targets:** Minimum 44x44px
- **Animations:** Subtle, purposeful (300ms max)

---

### 6. Implementation Guide
**File:** `implementation-guide.md`

**Contents:**
- Complete database schema
- 6-phase implementation plan (12 weeks)
- Priority ranking
- Technical stack recommendations
- Success metrics
- Risk mitigation

**Implementation Phases:**

**Phase 0: Foundation** (Prerequisites)
- Database schema
- API endpoints
- Dev environment

**Phase 1: Journal Templates** (Weeks 1-2)
- Template system
- Basic entry creation
- Mood + Spotify integration
- **Deliverable:** Functional journaling with 5 templates

**Phase 2: Chore Templates** (Weeks 3-4)
- Chore template system
- Chore creation flow
- Basic reminders
- **Deliverable:** Chore system with templates and reminders

**Phase 3: Chore Completion** (Weeks 5-6)
- Simple completion mode
- Checklist mode
- Metric capture
- Photo attachments
- **Deliverable:** Full completion workflows

**Phase 4: Integration** (Weeks 7-8)
- Post-chore journaling
- Task ↔ Chore connection
- Chore references in journals
- **Deliverable:** Integrated system

**Phase 5: Advanced Features** (Weeks 9-10)
- Mood correlation analytics
- Energy audit integration
- Seasonal variations
- Template customization
- **Deliverable:** Smart, adaptive system

**Phase 6: Polish + Launch** (Weeks 11-12)
- Onboarding
- Animations
- Accessibility
- Bug fixes
- Documentation
- **Deliverable:** Shipped app!

**Tech Stack:**
- Frontend: React Native + TypeScript + Expo
- Backend: Node.js + Express + PostgreSQL
- Integrations: Spotify API, Push Notifications, Camera

---

## 🎯 Design Principles (Across All Systems)

### ADHD-Friendly Design

**1. Reduce Cognitive Load**
- Short, focused prompts (3-7 questions max)
- Clear visual hierarchy
- Progress indicators everywhere
- One task at a time focus

**2. Flexible Completion**
- Optional sections clearly marked
- Can save drafts anytime
- Resume where you left off
- Skip without guilt

**3. Quick Capture**
- 1-2 minute templates available
- Pre-filled defaults
- Auto-save on every change
- Minimal required fields

**4. Visual Feedback**
- Progress bars
- Streak tracking
- Completion celebrations
- Clear time estimates

**5. Forgiving Interactions**
- Easy undo
- Edit past entries
- Reschedule without penalty
- Archive (not delete)

---

## 📊 Key Metrics & Insights

### Journal Analytics

**Track:**
- Streak days
- Entries per month
- Most used templates
- Average completion time
- Mood trends over time

**Surface:**
- "Your mood is 15% higher on days when you journal in the morning"
- "You've journaled 18 times this month - 50% more than last month!"
- "Quick Win is your most-used template (12x this month)"

### Chore Analytics

**Track:**
- On-time completion rate
- Actual vs. estimated costs
- Actual vs. estimated time
- Completion frequency

**Surface:**
- "You completed 3 maintenance tasks this month - $196 total"
- "Your on-time rate: 100% 🎉"
- "Oil changes typically cost you $46 (vs. $30-80 estimate)"
- "You always complete dental checkups 2 weeks late - adjust due date?"

### Cross-System Insights

**Track:**
- Mood correlation with chore completion
- Energy patterns (which chores drain most)
- Spotify patterns (productive playlists)
- Journal entries after chores

**Surface:**
- "Completing chores boosts your mood by 18% on average"
- "Vehicle maintenance gives you the biggest mood boost (+22%)"
- "HVAC service drains your energy - schedule on light days"
- "You listen to classic rock during car maintenance"

---

## 🔗 Database Relationships

```
journal_templates
    ↓ (1:many)
journal_template_sections

journal_entries
    ↓ (1:many)
journal_entry_sections
    ↓ (references)
journal_template_sections

chore_templates
    ↓ (1:many)
chore_template_subtasks

chores
    ↓ (1:many)
chore_subtasks
    ↓ (1:many)
chore_completions
    ↓ (1:many)
chore_subtask_completions

chore_completions
    ↓ (optional 1:1)
journal_entries (post-chore reflection)

tasks
    ↓ (optional 1:1)
chores (created_from_chore)
```

---

## 🎨 Template Categories Summary

### Journal Templates (15)

**Daily (4):**
- Daily Reflection (🌙)
- Morning Intention (☀️)
- Work Day Review (💼)
- Quick Win (⭐)

**Weekly (3):**
- Weekly Review (📊)
- Energy Audit (⚡)
- Relationship Reflection (💞)
- Learning Log (📚)

**Monthly (1):**
- Goal Setting (🎯)

**As-Needed (7):**
- Gratitude Practice (🙏)
- Problem Solving (💡)
- Creative Brain Dump (🎨)
- Anxiety Processing (🌊)
- Self-Compassion (💚)
- Decision Record (⚖️)
- Post-Chore Reflection (✅)
- Maintenance Overwhelm (🔧)

### Chore Templates (17)

**Vehicle (6):**
- Oil Change, Tire Rotation, State Inspection, Brake Inspection, Battery Test, Air Filter

**Home (6):**
- HVAC Service, Clean Gutters, HVAC Filter, Smoke Detectors, Dryer Vent, Water Heater

**Health (3):**
- Dental Checkup, Annual Physical, Prescription Refills

**Equipment (2):**
- Lawn Mower Prep, Computer Backup

---

## 🚀 Quick Start Guide

**For Developer:**

1. **Read Implementation Guide first** - Understand the 6-phase plan
2. **Set up database** - Run schema from implementation guide
3. **Seed templates** - Start with 5 journal + 5 chore templates
4. **Build Phase 1** - Journal system (Weeks 1-2)
5. **Use it yourself** - Dogfood from day one
6. **Iterate fast** - Ship small, fix what annoys you

**For Product Decisions:**

1. **Journal Templates** - Start with Daily Reflection, Morning Intention, Quick Win
2. **Chore Templates** - Start with Oil Change, Dental Checkup, HVAC Filter
3. **Completion Modes** - Build simple mode first, checklist mode second
4. **Integration** - Post-chore journal prompts are highest value

**For UX:**

1. **Mockups** - Reference `ui-mockups/screen-wireframes.md`
2. **Design System** - Use color palette and spacing from mockups
3. **Workflows** - Follow diagrams in `chore-workflows/breakdown-workflows.md`
4. **Accessibility** - WCAG AA minimum, ADHD-friendly patterns

---

## 📈 Success Criteria

**MVP (Phase 1-2):**
- ✓ Can journal daily with 5 templates
- ✓ Can create chores from 5 templates
- ✓ Reminders work 7 days before due

**Full Feature (Phase 3-4):**
- ✓ Complete chores with checklist mode
- ✓ Journal after chore completion
- ✓ Tasks created from chores

**Smart System (Phase 5-6):**
- ✓ Mood/energy insights generated
- ✓ Seasonal variations work
- ✓ Smart scheduling suggestions

**Personal Success:**
- ✓ Using app daily for 2+ weeks
- ✓ Haven't missed a chore reminder
- ✓ Journaling streak >7 days
- ✓ **Actually reduces ADHD overwhelm!**

---

## 🎁 What Makes This Design Special

**1. ADHD-Optimized**
- Every feature designed to reduce overwhelm
- Short, focused interactions
- Visual progress everywhere
- Flexible, forgiving

**2. Holistic Integration**
- Journals + Chores + Tasks work together
- Mood + Energy + Maintenance correlations
- Musical memory anchors (Spotify)
- Context preservation

**3. Smart Insights**
- Learn from your patterns
- Proactive suggestions
- Adaptive scheduling
- Cost/time tracking

**4. Built for Solo Dev**
- Phases prioritized for value
- Ship incrementally
- Optimize for N=1 (yourself)
- Clear implementation path

**5. Real-World Practical**
- Based on actual maintenance needs
- Accounts for procrastination
- Handles interruptions
- Celebrates small wins

---

## 📝 Next Steps

**Immediate:**
1. Review implementation guide
2. Set up development environment
3. Create database schema
4. Seed first 5 journal templates

**Week 1-2:**
- Build journal template system
- Ship basic journaling

**Week 3-4:**
- Build chore template system
- Ship chore creation + reminders

**Month 2:**
- Build completion workflows
- Integrate journals + chores

**Month 3:**
- Add smart features
- Polish and launch

**After Launch:**
- Use it yourself daily
- Fix what annoys you
- Add features you actually need
- Iterate based on real use

---

## 💬 Design Philosophy

> "Build for yourself first. Every feature should pass the test: 'Will I actually use this?' Start small, ship often, iterate fast. Done is better than perfect. The goal is to reduce YOUR ADHD overwhelm, not to build a perfect app."

This design is optimized for **usefulness over complexity**. Every template, workflow, and integration is grounded in real-world needs. If something feels too complex, simplify it. If you won't use it daily, don't build it yet.

**Trust the process. You've got this.** 🚀

---

## 📂 File Reference

- **Journal Templates:** `journal-templates/template-library.md`
- **Chore Templates:** `chore-workflows/chore-template-library.md`
- **Workflows:** `chore-workflows/breakdown-workflows.md`
- **Integration:** `integration/journal-chore-integration.md`
- **UI Mockups:** `ui-mockups/screen-wireframes.md`
- **Implementation:** `implementation-guide.md`
- **This Summary:** `00-DESIGN-SUMMARY.md`

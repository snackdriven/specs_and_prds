# Quick Reference Cheat Sheet

## 🎯 Core Concepts

### Journal Templates
**15 templates** organized by frequency:
- **Daily** (4): Daily Reflection, Morning Intention, Work Review, Quick Win
- **Weekly** (4): Weekly Review, Energy Audit, Relationship, Learning
- **Monthly** (1): Goal Setting
- **As-Needed** (6): Gratitude, Problem Solving, Anxiety, Self-Compassion, Decision, Creative

**Key Features:**
- 3-7 prompts per template
- 1-15 minutes duration
- Mood snapshots (before/after/both)
- Spotify auto-capture
- Rich text editing

### Chore Templates
**17 templates** organized by category:
- **Vehicle** (6): Oil Change, Tire Rotation, Inspection, Brakes, Battery, Air Filter
- **Home** (6): HVAC, Gutters, Filter, Detectors, Dryer, Water Heater
- **Health** (3): Dental, Physical, Prescriptions
- **Equipment** (2): Lawn Mower, Computer Backup

**Key Features:**
- Step-by-step subtasks
- Time estimates (10-240 minutes)
- Cost estimates
- Metric tracking (odometer, cost, etc.)
- Seasonal variations

---

## 📊 Data Models (Simplified)

### Journal Entry
```typescript
{
  template_id: uuid
  mood_before: { emoji, label }
  mood_after: { emoji, label }
  spotify_track: { name, artist, url }
  sections: [
    { template_section_id, content }
  ]
  triggered_by_chore?: uuid
}
```

### Chore
```typescript
{
  template_id: uuid
  name: string
  interval: {
    time: { value, unit }
    metric: { value, unit, key }
  }
  next_due_date: timestamp
  next_due_metric: { key, value }
  reminder_days_before: 7
}
```

### Chore Completion
```typescript
{
  chore_id: uuid
  completed_at: timestamp
  time_spent_minutes: number
  metrics: { odometer, cost, ... }
  notes: string
  photos: [{ url, caption }]
  journal_entry_id?: uuid
}
```

---

## 🔄 Key Workflows

### Create Journal Entry
```
1. Select template
2. Capture mood (before)
3. Complete sections (auto-save each)
4. Capture mood (after)
5. Auto-capture Spotify track
6. Complete entry
```

### Create Chore
```
1. Select template (or create custom)
2. Customize details (name, interval, due date)
3. Review/edit subtasks
4. Configure reminders (7 days before)
5. Save chore
```

### Complete Chore (Checklist Mode)
```
1. Start checklist
2. For each subtask:
   - Complete step
   - Capture photo (if required)
   - Enter metrics (if needed)
3. Final summary:
   - Enter required metrics (odometer, cost)
   - Overall notes
   - Attach photos
4. Save completion
5. Auto-calculate next due date
6. Trigger journal prompt (optional)
```

### Chore Reminder → Task → Completion
```
1. Reminder appears (7 days before)
2. User: Create Task
3. Task created with subtasks
4. User: Complete Task
5. Prompt: Complete Chore?
6. User: Yes → Chore completion flow
7. Chore marked complete
8. Prompt: Journal about this?
9. User: Yes → Post-Chore Reflection
```

---

## 🎨 UI Patterns

### Home Dashboard
- Quick capture buttons (Journal, Task, Goal)
- Today's tasks list
- Upcoming maintenance (next 7 days)
- Suggested journal template
- Recent journal entries

### Template Selection
- Visual cards with icons
- Time estimates prominent
- Category filters
- Streak tracking
- Last used timestamps

### Entry/Completion Forms
- Progress bar at top
- Sections expand/collapse
- Required vs. optional clear
- Auto-save on every change
- "Save Draft" and "Complete" actions

### Insights Dashboard
- Mood trends graph
- Maintenance completed this month
- Mood correlation insights
- Energy patterns
- Cost tracking

---

## 🔧 Technical Quick Reference

### Database Tables (Core)
- `journal_templates` + `journal_template_sections`
- `journal_entries` + `journal_entry_sections`
- `chore_templates` + `chore_template_subtasks`
- `chores` + `chore_subtasks`
- `chore_completions` + `chore_subtask_completions`

### API Endpoints (Minimum)
```
GET    /api/journal/templates
GET    /api/journal/templates/:id
POST   /api/journal/entries
PATCH  /api/journal/entries/:id
GET    /api/journal/entries

GET    /api/chores/templates
GET    /api/chores/templates/:id
POST   /api/chores
GET    /api/chores
GET    /api/chores/upcoming
POST   /api/chores/:id/complete

GET    /api/spotify/now-playing
POST   /api/spotify/search
```

### Notification Triggers
- Daily: Check chores due in 7 days
- Metric-based: Check odometer/hours approaching threshold
- Overdue: Daily reminder if chore >3 days late
- Streak: Daily journal reminder (user-configured time)

---

## 📏 Design Specs

### Colors
**Templates:** Each has unique color (15 total)
**UI:**
- Primary: #2196F3 (Blue)
- Success: #4CAF50 (Green)
- Warning: #FF9800 (Orange)
- Error: #E74C3C (Red)

### Typography
- H1: 28px Bold
- H2: 22px Semibold
- H3: 18px Semibold
- Body: 16px Regular

### Spacing
- Screen edges: 16px
- Section gaps: 24px
- Item gaps: 12px
- Card padding: 16px

### Touch Targets
- Minimum: 44x44px
- Buttons: 48px height
- Icons: 24x24px (in 44px tap area)

---

## ⏱️ Time Estimates

### Journal Templates (1-15 min)
- **Quick** (<5 min): Quick Win (1-2), Gratitude (3-4), Morning Intention (3-5)
- **Standard** (5-10 min): Daily Reflection (5-7), Anxiety (5-7), Work Review (5-6), Energy Audit (6-8)
- **Deep** (10-15 min): Weekly Review (10-15), Problem Solving (8-10), Goal Setting (12-15)

### Chore Templates (10-240 min)
- **Quick** (<30 min): Air Filter (10-15), Battery Test (15-20), Smoke Detectors (15-20), Computer Backup (20-30)
- **Standard** (30-90 min): Oil Change (45-60), Tire Rotation (30-60), Inspection (45-90), HVAC Service (60-90), Dryer Vent (30-60), Water Heater (30-45), Lawn Mower (30-45), Dental (60), Physical (45-60)
- **Long** (2-4 hrs): Clean Gutters (2-4)

---

## 💰 Cost Estimates

### Chore Templates
- **Free**: Battery Test, Smoke Detectors, Computer Backup, Lawn Mower (DIY), Water Heater (DIY)
- **Low** ($0-50): Air Filter ($15-30), Inspection ($15-50), Tire Rotation ($20-50), HVAC Filter ($10-30), Prescriptions (varies), Dental ($0-150 w/insurance)
- **Medium** ($50-200): Oil Change ($30-80), HVAC Service ($80-150), Dryer Vent ($20-150), Physical ($0-200 w/insurance)
- **High** ($100-400): Brake Inspection ($0-400 if replacement), Clean Gutters ($100-200), Battery ($100-200)

---

## 🎯 Metrics to Track

### Journal
- Streak days
- Entries per week/month
- Template usage frequency
- Average completion time
- Mood trends (average, variance)

### Chores
- On-time completion rate
- Actual vs. estimated cost
- Actual vs. estimated time
- Overdue days (when late)
- Cost per category per month

### Cross-System
- Mood before/after chores
- Energy patterns by chore type
- Journal entries after chores
- Task → Chore completion rate

---

## 🚀 Implementation Priority

### Phase 1: Journal MVP (Weeks 1-2)
**Ship:** 5 templates, mood capture, Spotify integration

### Phase 2: Chore MVP (Weeks 3-4)
**Ship:** 5 templates, creation flow, basic reminders

### Phase 3: Completion (Weeks 5-6)
**Ship:** Simple and checklist modes, metrics, photos

### Phase 4: Integration (Weeks 7-8)
**Ship:** Post-chore journaling, task creation, linking

### Phase 5: Intelligence (Weeks 9-10)
**Ship:** Mood correlation, energy insights, seasonal variations

### Phase 6: Launch (Weeks 11-12)
**Ship:** Polish, onboarding, accessibility, docs

---

## ✅ Acceptance Criteria Checklist

### Journal System
- [ ] Can select from 5 templates
- [ ] Can complete all section types (text, bullet, scale, choice)
- [ ] Mood captured before/after
- [ ] Spotify track auto-captured
- [ ] Entry saves as draft
- [ ] Entry completes and displays in history
- [ ] Can edit past entries

### Chore System
- [ ] Can select from 5 templates
- [ ] Can customize details (name, interval, due date)
- [ ] Can edit subtasks
- [ ] Chore saves with correct next due
- [ ] Reminder appears 7 days before
- [ ] Can create task from chore
- [ ] Can complete chore (simple mode)
- [ ] Can complete chore (checklist mode)
- [ ] Metrics captured (odometer, cost)
- [ ] Photos attached
- [ ] Next due date auto-calculated

### Integration
- [ ] Post-chore journal prompt appears
- [ ] Can create journal entry from chore completion
- [ ] Can create Quick Win from chore
- [ ] Task completion prompts chore completion
- [ ] Chore linked to journal entry
- [ ] Mood correlation insights visible
- [ ] Energy draining chores identified

---

## 🐛 Common Edge Cases

### Journals
- **Interrupted entry:** Save draft, resume later
- **No Spotify playing:** Manual search or skip
- **Template too long:** Can skip optional sections
- **Mood changed:** Can update before saving

### Chores
- **Completed early:** Ask reason, adjust next due based on today
- **Completed late:** Suggest adjusting due date if pattern
- **No longer needed:** Archive (keep history)
- **Seasonal variation:** Auto-detect season, allow override
- **External appointment:** Two-phase (schedule, then complete)
- **Metric approaching:** Trigger reminder early (e.g., at 64,500 mi for 65,000 mi due)

---

## 📱 Mobile-First Interactions

### Gestures
- **Swipe right:** Complete task/subtask
- **Swipe left:** Delete/archive
- **Long press:** Context menu
- **Pull to refresh:** Update lists

### Quick Actions
- **Home quick capture:** Tap icon → immediate entry
- **Template quick start:** Tap "Start" → skip selection
- **Chore quick complete:** Swipe → mark done
- **Photo capture:** Tap camera → inline upload

### Navigation
- **Bottom tabs:** Home, Tasks, Journal, Insights
- **Back button:** Always visible in header
- **Modal close:** X in top-right or swipe down

---

## 🔐 Privacy & Data

### Local-First
- All data stored locally (SQLite/Postgres)
- Analytics calculated on-device
- No cloud sync required (optional future)

### User Control
- Export all data (JSON)
- Delete all data (confirmation required)
- Choose what to track (toggle analytics)
- Spotify: opt-in, revokable

---

## 💡 Pro Tips for Solo Dev

1. **Start with 3 journal templates** - Daily Reflection, Morning Intention, Quick Win
2. **Start with 3 chore templates** - Oil Change, Dental Checkup, HVAC Filter
3. **Ship simple completion mode first** - Checklist mode can wait
4. **Use your own car/home** - Seed templates with YOUR maintenance needs
5. **Dogfood from day one** - Use the app yourself, fix what annoys you
6. **Don't over-engineer** - Build for N=1 (yourself), generalize later
7. **Celebrate small wins** - Ship phases, don't wait for perfect
8. **Trust the process** - 12 weeks to launch is doable

---

## 📚 Document Quick Links

- **Full Summary:** `00-DESIGN-SUMMARY.md`
- **Journal Templates:** `journal-templates/template-library.md`
- **Chore Templates:** `chore-workflows/chore-template-library.md`
- **Workflows:** `chore-workflows/breakdown-workflows.md`
- **Integration:** `integration/journal-chore-integration.md`
- **UI Mockups:** `ui-mockups/screen-wireframes.md`
- **Implementation:** `implementation-guide.md`

---

**Remember:** Done is better than perfect. Ship small, iterate fast. Build what you'll actually use. 🚀

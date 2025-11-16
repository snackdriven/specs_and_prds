# Product Analysis & UX Design Questions

**Generated**: 2025-11-16
**Purpose**: Comprehensive product/UX questions to explore design decisions, feature intent, and user experience across three product visions (EDC, Daybeam, ATLAS)

---

## 📊 REPOSITORY OVERVIEW

This repository contains specifications for **THREE DISTINCT PRODUCTS**:

1. **EDC (Executive Dysfunction Center)** - ADHD-first productivity app with multi-pane architecture
2. **Daybeam** - General productivity & wellness platform
3. **ATLAS** - AI-powered JIRA testing companion

---

## 🎯 STRATEGIC PRODUCT QUESTIONS

### Product Vision & Strategy

**Q1**: Are EDC and Daybeam **two separate products**, or is Daybeam the **new/rebranded version** of EDC?
- If separate: What differentiates them? Why maintain two similar products?
- If evolution: Is EDC deprecated? What's the migration path?

**Q2**: What is the relationship between these products?
- Are they targeting different markets?
- Should features be cross-pollinated?
- Is there a shared design system?

**Q3**: What is ATLAS's role in this ecosystem?
- Standalone tool for a specific use case?
- Intended to integrate with EDC/Daybeam?
- Separate product line entirely?

**Q4**: For EDC vs Daybeam - which features are unique vs overlapping?

| Feature | EDC | Daybeam | Intent Question |
|---------|-----|---------|----------------|
| Tasks | ✅ (with dependencies, subtasks) | ✅ (simpler?) | Should both have same complexity? |
| Habits | ✅ | ✅ | Same implementation? |
| Mood Tracking | ✅ (1-10 scale, energy, stress) | ✅ (1-10 scale) | EDC has more detail? |
| Journal | ✅ (templates, prompts) | ✅ (templates) | Feature parity? |
| Countdowns | ✅ | ✅ | Identical feature? |
| Calendar | ✅ (8 view modes, Google sync) | ❌ | Why only in EDC? |
| Multi-Pane System | ✅ (CORE FEATURE) | ❌ | EDC's killer feature? |
| Concerts | ✅ | ❌ | EDC-specific niche feature? |
| RSS Feeds | ✅ | ❌ | EDC-specific? |
| Chores/Maintenance | ✅ | ❌ | EDC-specific? |
| Analytics Dashboard | ❌ | ✅ | Daybeam-specific? |
| Spaces System | ❌ | ✅ | Daybeam-specific organizational model? |
| Tags System | ❌ | ✅ | Daybeam has better tagging? |

**Q5**: Technology Stack Divergence
- EDC: React 18 + Supabase
- Daybeam: React 19 + Encore.dev
- **Why different backends?** Strategic decision or legacy?
- **Will they converge?**

---

## 🎨 UI/UX DESIGN QUESTIONS (The Specifics You Want!)

### Mood Tracking UX

**Q6**: Mood Scale: 1-10 numeric vs emoji selection?
- **EDC shows**: 1-10 scale with custom mood labels
- **Options to explore**:
  - Should users choose from 3, 5, or 10 emoji quick-taps?
  - Is numeric slider (1-10) better than discrete emoji buttons?
  - Hybrid approach: emoji buttons with underlying numeric value?
- **Trade-off**: Simplicity (fewer choices) vs. Precision (more granularity)

**Q7**: Mood Logging Friction
- **Current**: Optional notes, energy (1-5), stress (1-5), context tags
- **Questions**:
  - How many fields are TOO many for quick capture?
  - Should there be "Quick Mood" (one tap) vs "Detailed Mood" (all fields)?
  - Should energy/stress be **sliders** or **button groups** (1-2-3-4-5)?
  - Example preference:
    - ⚡ Energy: Slider or Buttons? (Exhausted ← → Energized)
    - 😰 Stress: Slider or Buttons? (Relaxed ← → Overwhelming)

**Q8**: Mood Entry Context
- **Current**: JSONB `context` field for tags
- **UI Question**:
  - Checkbox list of common contexts (work, home, social, exercise)?
  - Freeform tag input?
  - Pre-defined buttons + "Add custom"?
  - How many context tags should be visible at once? (3 vs 5 vs "show all")

### Habit Tracking UX

**Q9**: Habit Completion Button
- **Current**: One-click checkmark button
- **Options**:
  - Single tap → instant complete?
  - Tap → Quick confirm dialog ("Mark complete?")?
  - Long-press for options (add notes, rate difficulty)?
  - Swipe gestures (swipe right = complete)?

**Q10**: Habit Frequency Configuration
- **EDC**: Daily, weekly, custom frequency_value
- **UI**:
  - Dropdown menu ("Daily", "Weekly", "Custom")?
  - Segmented control (buttons for Daily/Weekly/Custom)?
  - Stepper for custom frequency ("Complete X times per week")?
  - Example: "Exercise 3 times per week" → How to set that?
    - Option A: Frequency dropdown "Weekly" + Number input "3"
    - Option B: Single sentence builder "I want to do this [3] times per [week]"
    - Option C: Calendar picker (select specific days: M W F)

**Q11**: Streak Visualization
- **Current**: Fire emoji 🔥 + numeric count
- **Options**:
  - Just number? ("12 days")
  - Emoji + number? ("🔥 12")
  - Progress ring around habit icon?
  - GitHub-style contribution heatmap?
  - Animated flame that grows with streak?
- **Milestone Celebrations**: What happens at 7/30/100 day streak?
  - Confetti animation? Sound? Badge? All three?

**Q12**: Habit Calendar Heatmap
- **Current**: "Calendar heatmap showing completion density"
- **Design questions**:
  - Color intensity gradient (light green → dark green) vs discrete colors?
  - How to show MULTIPLE completions in one day? (2x, 3x)
  - Cell size: Small (month view) vs Large (week view)?
  - Click on cell → What happens? (Show details modal? Inline notes?)

### Task Management UX

**Q13**: Task Priority Levels
- **EDC**: 1-5 priority scale (integer)
- **UI Options**:
  - Dropdown: "Low", "Medium", "High", "Urgent", "Critical"
  - Star rating (⭐⭐⭐⭐⭐)
  - Color picker (Red = urgent, Yellow = medium, Green = low)
  - Slider (Low ← → High)
  - Which feels more natural for ADHD users?

**Q14**: Task Due Date Picker
- **Options**:
  - Calendar popup (full calendar grid)?
  - Relative picker ("Today", "Tomorrow", "Next Week", "Pick Date")?
  - Smart text input ("tomorrow 3pm", "next friday")?
  - Combination?

**Q15**: Task Dependencies Visualization
- **EDC**: Tasks can have blocking dependencies
- **UI**: How to show "Task B is blocked by Task A"?
  - Lock icon on blocked tasks?
  - Dotted line connecting tasks in list view?
  - Graph visualization (node diagram)?
  - Inline warning: "⚠️ Blocked by: Task A"?

**Q16**: Task Views: Kanban vs List vs Focus Flow
- **Current**: Multiple view modes available
- **Question**: Should there be a **primary default view**?
  - What % of users prefer Kanban vs List?
  - Should app "remember" last-used view?
  - Quick toggle buttons (☰ List | 📋 Kanban | 🎯 Focus) or dropdown?

**Q17**: Task Status
- **Options**: pending, in_progress, completed
- **UI**:
  - Checkbox (unchecked/checked) for 2-state (pending/completed)?
  - Dropdown for 3-state (pending/in_progress/completed)?
  - Drag task between columns (Kanban-style) to change status?
  - Status badge/pill next to task?

### Pane System UX (EDC-specific)

**Q18**: Pane Size Presets
- **Current**: EXTRA_WIDE (25%), WIDE (22%), STANDARD (20%), NARROW (18%)
- **Question**: Are these percentages optimal?
  - Should users have **direct pixel control** (drag to exact width)?
  - Should there be **snap points** (pane snaps to preset widths)?
  - Is 4% difference between presets enough (20% → 22% → 25%)?

**Q19**: Pane Add Menu
- **Options**:
  - Dropdown menu with checkboxes (current open panes checked)?
  - Modal dialog with pane gallery (icons + descriptions)?
  - Slide-out sidebar with drag-to-add panes?
  - Command palette (Cmd+K → type pane name)?

**Q20**: Pane Themes
- **Feature**: Each pane can have its own theme
- **Questions**:
  - Is per-pane theming too complex? (Cognitive overload?)
  - Should there be theme **presets** for whole workspace? ("Dark Mode All", "Colorful", "High Contrast")
  - How many theme options per pane? (3 vs 10 vs 18?)
  - Should panes auto-suggest themes based on content? (Calendar = light, Tasks = dark)

**Q21**: Pane Minimize/Maximize
- **Current**: Minimize (header only), Maximize (fullscreen), Collapse (sidebar)
- **Icons**:
  - Standard window controls (− □ ×)?
  - Custom icons (eye, expand, collapse)?
  - Text labels ("Hide", "Expand", "Close")?
  - Right-click context menu vs always-visible buttons?

**Q22**: Mobile Responsiveness
- **EDC**: Panes stack vertically on mobile (accordion-style)
- **Question**: Should mobile have **different UX entirely**?
  - Bottom nav bar with swipe between panes?
  - Drawer menu with pane selection?
  - Tabbed interface (like browser tabs)?
  - One pane at a time (accordion) - current approach?

### Calendar Integration UX

**Q23**: Calendar View Modes
- **EDC**: 8 view modes (day, week, month, agenda, 3-day, 2-week, workweek, year)
- **Question**: Is 8 views too many?
  - Which views are most-used?
  - Should less common views be in "More options" submenu?
  - View switcher UI: Dropdown, segmented control, or tabs?

**Q24**: Google Calendar Sync Indicators
- **Feature**: Bi-directional Google Calendar sync
- **UI**: How to show which events are synced vs local-only?
  - Icon badge on event (🔄)?
  - Color coding (synced = blue, local = gray)?
  - Text label ("Synced" vs "Local only")?
  - Separate visual layers/calendars?

### Journal UX

**Q25**: Journal Templates
- **Feature**: Pre-built templates (Daily Reflection, Gratitude, etc.)
- **UI**:
  - Template selector as dropdown before writing?
  - Template gallery modal with previews?
  - Quick action buttons ("Start Gratitude Journal", "Daily Reflection")?
  - Start blank, then "Apply Template" option?

**Q26**: Rich Text Editor
- **Question**: Level of formatting complexity?
  - **Minimal**: Bold, Italic, Bullets (3 buttons)
  - **Medium**: + Headers, Links, Images (7 buttons)
  - **Full**: + Tables, Code blocks, Embeds (15+ buttons)
  - What's optimal for journaling without distraction?

**Q27**: Journal Search
- **Feature**: Full-text search
- **UI**:
  - Search bar at top of journal pane?
  - Cmd+F overlay search?
  - Filters: By date range, by tag, by template type?
  - Search results: List view or highlighted in chronological view?

### Countdowns UX

**Q28**: Countdown Visual Display
- **Options**:
  - Large number ("12 DAYS")?
  - Progress circle (visual ring showing % of time elapsed)?
  - Calendar-style countdown with X's on passed days?
  - Flip clock animation?

**Q29**: Countdown Urgency Colors
- **Current**: Normal, Soon, Urgent, Critical, Expired
- **Color scheme**:
  - Green → Yellow → Orange → Red progression?
  - Single color with intensity (light → dark)?
  - Icon changes (💚 → 💛 → 🧡 → ❤️)?
  - At what thresholds? (>7 days normal, 3-7 soon, 1-2 urgent, 0 critical?)

### Settings & Preferences UX

**Q30**: Settings Organization
- **Question**: How to organize 30+ settings across features?
  - Tabbed interface (General, Appearance, Integrations, Features)?
  - Accordion sections (expand/collapse groups)?
  - Search-first (Cmd+K to find setting)?
  - Flat scrolling list with headers?

**Q31**: Theme Selector
- **18+ themes available**
- **UI**:
  - Dropdown list with theme names?
  - Visual gallery with theme previews/screenshots?
  - Color swatches only?
  - Live preview (hover theme = instant preview without committing)?

---

## ⚙️ FEATURE IMPLEMENTATION QUESTIONS

### Recurring Tasks (EDC)

**Q32**: Recurrence Rule Configuration
- **Current**: JSONB recurrence_rule with frequency, interval, until, count
- **UI Complexity**:
  - Should users see ALL options at once?
  - Progressive disclosure (Basic: "Every [X] [days/weeks]", Advanced: until date, day of week, etc.)?
  - Natural language input ("Every Monday and Friday")?
  - Visual calendar selector (click days for weekly recurrence)?

**Q33**: Recurring Task Auto-Generation
- **Current**: Creates next instance when current completed
- **Behavior questions**:
  - Should it generate in advance (e.g., create next week's instance now)?
  - What if user misses one? Generate anyway or skip?
  - Should there be a "View All Instances" option (next 10 occurrences)?

### Task Dependencies (EDC)

**Q34**: Dependency Manager UI
- **Feature**: Manage which tasks block which
- **UI Options**:
  - Modal dialog with multi-select (select blockers for Task B)?
  - Inline in task edit form (add dependency button)?
  - Visual graph editor (drag line from Task A to Task B)?
  - Which feels most intuitive?

**Q35**: Circular Dependency Prevention
- **Current**: Algorithm detects cycles
- **UI**: What happens when user tries to create circular dependency?
  - Error toast ("Cannot create: circular dependency detected")?
  - Warning dialog with explanation and graph visualization?
  - Disable the option in UI (grey out tasks that would create cycle)?

### Spaces & Tags (Daybeam)

**Q36**: Spaces vs Tags Mental Model
- **Feature**: Both systems for organization
- **Question**: How to explain difference to users?
  - Spaces = "Contexts" (Work, Personal, Health)
  - Tags = "Attributes" (#urgent, #waiting-on-someone)
  - Should UI have visual distinction (icons, colors)?
  - Can items belong to multiple spaces? Or just one space + multiple tags?

**Q37**: Space Selector UI
- **Options**:
  - Dropdown in task/habit creation?
  - Icon buttons (click icon to assign space)?
  - Drag-and-drop tasks into space regions?
  - Color-coded sections?

**Q38**: Tag Input Method
- **Options**:
  - Freeform text input with autocomplete?
  - Predefined tag buttons (most-used)?
  - Hybrid (popular tags as buttons + "Add custom tag" input)?
  - How many tags should be quickly accessible? (5 vs 10 vs 20?)

### Analytics Dashboard (Daybeam)

**Q39**: Analytics Visualization Choices
- **Feature**: "Comprehensive data visualization"
- **Chart Types**: When to use what?
  - Task completion: Line chart vs bar chart vs area chart?
  - Habit streaks: Calendar heatmap vs progress bars?
  - Mood trends: Line chart vs candlestick (showing range)?
  - Correlations: Scatter plot vs correlation matrix?

**Q40**: Analytics Time Ranges
- **Options**:
  - Fixed presets ("Last 7 days", "Last 30 days", "Last 90 days")?
  - Custom date range picker?
  - Quick buttons + custom option?
  - Should there be "All Time" view?

**Q41**: Insight Generation
- **Feature**: "Automated insights generation"
- **Display**:
  - Text notifications ("Your productivity is 20% higher on Mondays!")?
  - Dedicated insights panel in analytics?
  - Push notifications?
  - Email digest?

### Gamification (ATLAS)

**Q42**: XP & Leveling System
- **Feature**: XP, levels, streaks for test completion
- **UI**:
  - XP bar always visible (persistent header)?
  - XP bar only on dashboard?
  - Level-up animation when threshold reached?
  - Sound effects on XP gain?

**Q43**: Achievement Display
- **Feature**: Achievement types (milestone, streak, mastery, discovery)
- **UI**:
  - Badge icons displayed where?
  - Achievement notification toast?
  - Achievement gallery page?
  - Progress bars for incomplete achievements?

**Q44**: Coach Personality
- **Feature**: 5 coach personalities (coach, analyst, hype_man, drill_sergeant, silent)
- **Implementation**:
  - How much personality should show in messaging?
  - Should coach persona affect UI visuals (colors, fonts)?
  - Voice/tone examples for each persona?
  - User setting or adaptive based on performance?

---

## 🔬 TECHNICAL IMPLEMENTATION QUESTIONS

### Performance & Optimization

**Q45**: Real-time Sync Strategy
- **EDC**: Supabase subscriptions for real-time updates
- **Question**: Should ALL features be real-time or just critical ones?
  - Real-time: Tasks, Habits, Mood (yes, these change frequently)
  - Polling might be OK: Journal, Settings (change less frequently)
  - Battery/performance trade-off on mobile?

**Q46**: Data Pagination
- **EDC**: "Load 50 tasks at a time, infinite scroll for more"
- **Options**:
  - Infinite scroll (automatic load more)?
  - "Load More" button (manual)?
  - Pagination numbers (1, 2, 3...)?
  - Virtual scrolling (render only visible items)?

**Q47**: Offline Support
- **Current**: All products require internet (Supabase/Encore backends)
- **Question**: Is offline mode a priority?
  - Should there be local-first with sync (like Notion)?
  - Or always-online is acceptable?
  - PWA with service worker caching?

### Data Export & Portability

**Q48**: Export Formats
- **Mentioned**: CSV, PDF, JSON
- **Question**: What should be exportable?
  - All data (full backup)?
  - Per-feature (just tasks, just habits)?
  - Filtered subsets (last 30 days)?
  - Export UI: Settings page or per-feature?

**Q49**: Data Import
- **Not mentioned in PRDs**
- **Should users be able to IMPORT data?**
  - From other apps (Todoist, Habitica, Google Tasks)?
  - CSV upload for bulk task creation?
  - Calendar import (.ics files)?

### Integrations

**Q50**: Google Calendar Sync Modes
- **EDC**: to-google, from-google, both
- **UI**: How to explain these modes to users?
  - Radio buttons with descriptions?
  - Visual diagram showing sync direction?
  - Recommended default?

**Q51**: Spotify Integration
- **EDC**: "Now playing" widget
- **Question**: Scope of integration?
  - Just display current song?
  - Playback controls in app?
  - Mood-music correlation (what song was playing when mood logged)?
  - Playlist suggestions based on mood?

**Q52**: Weather Integration (Tomorrow.io)
- **EDC**: Current weather, forecasts
- **Use cases**:
  - Display on dashboard only?
  - Correlate weather with mood ("You're happier on sunny days!")?
  - Task suggestions based on weather ("It's raining, good day for indoor tasks")?
  - How prominent should weather be?

---

## 👥 USER EXPERIENCE & ACCESSIBILITY

### ADHD-Specific Design

**Q53**: Progressive Disclosure
- **Principle**: Show essential info first, details on demand
- **Implementation questions**:
  - How much to show collapsed vs expanded?
  - Task card collapsed: Title + due date only?
  - Task card expanded: + Description + tags + dependencies?
  - User control or automatic based on screen size?

**Q54**: Dopamine Triggers
- **Current**: Celebration animations, streaks, progress bars
- **Balance**: When is it too much?
  - Animation on EVERY task completion or just milestones?
  - Sound effects? (Checkbox "ding", streak fire "whoosh")?
  - Haptic feedback on mobile?
  - Settings to disable for users who find it overwhelming?

**Q55**: Decision Fatigue Reduction
- **Principle**: Smart defaults, saved filters
- **Examples**:
  - New task defaults: Status=pending, Priority=medium, Due date=none?
  - New habit defaults: Frequency=daily, Frequency value=1?
  - Should app learn user preferences over time (AI defaults)?

### Accessibility (WCAG Compliance)

**Q56**: Keyboard Navigation
- **Question**: What keyboard shortcuts are essential?
  - Task completion: Space bar or Enter?
  - New task/habit: Cmd+N?
  - Search: Cmd+F or Cmd+K?
  - Navigate between panes: Tab, Cmd+1/2/3, or arrow keys?

**Q57**: Screen Reader Support
- **Question**: What ARIA labels are most important?
  - Streak counts: "12 day streak" or just "12"?
  - Task status: "Pending" vs "Not yet started"?
  - Mood buttons: "Happy mood, value 8 out of 10"?

**Q58**: Color Contrast & High Contrast Mode
- **18+ themes available**
- **Question**:
  - Should there be a dedicated "High Contrast" theme?
  - Should all themes meet WCAG AA minimum?
  - Any AAA compliance themes?
  - Dark mode default or user choice?

### Mobile Optimization

**Q59**: Touch Target Sizes
- **Question**: Minimum button size for mobile?
  - 44x44px (iOS guideline)?
  - 48x48px (Android guideline)?
  - Larger for ADHD users (motor control considerations)?

**Q60**: Mobile Gestures
- **Options**: Tap, Long-press, Swipe
  - Task completion: Tap checkbox or swipe right?
  - Task deletion: Long-press or swipe left + confirm?
  - Pane switching (EDC): Swipe between panes?
  - Are gestures discoverable or do they need tutorial?

---

## 🚀 PRIORITIZATION & ROADMAP

**Q61**: MVP Features
- **For each product**: What's the MINIMUM for launch?
  - EDC: Just tasks + habits + pane system?
  - Daybeam: Just tasks + habits + spaces?
  - ATLAS: Just JIRA sync + basic predictions?

**Q62**: Feature Sequencing
- **Question**: If building from scratch, what order?
  1. Core infrastructure (auth, database, pane system)
  2. Tasks (most used feature)
  3. Habits (second most used)
  4. Then what? Mood, Calendar, Journal, or Analytics first?

**Q63**: Power User vs Casual User
- **Design philosophy**: Who to optimize for?
  - Power users need ALL features, casual users overwhelmed
  - Should there be "Simple Mode" vs "Advanced Mode"?
  - Progressive onboarding (unlock features over time)?
  - Settings to hide unused features?

**Q64**: Cross-Product Feature Migration
- **Question**: Should winning features from one product move to others?
  - Example: Daybeam has Analytics, should EDC get it?
  - Example: EDC has Pane System, should Daybeam get it?
  - Or keep products distinct?

---

## 📝 CONTENT & COPYWRITING

**Q65**: Tone & Voice
- **EDC**: ADHD-friendly, empathetic
  - Examples: "All caught up!" vs "No tasks remaining"
  - "You unblocked 3 tasks!" vs "Dependencies resolved"
- **Daybeam**: More professional/neutral?
- **ATLAS**: Gaming-inspired, coach-driven?
- **Should tone be customizable?**

**Q66**: Empty States
- **Question**: What to show when user has no data?
  - No tasks: "Nothing on your plate! Add a task to get started." + big "Add Task" CTA?
  - No habits: Habit template gallery as empty state?
  - No mood entries: Quick mood logger prominently displayed?
  - Friendly illustrations or just text?

**Q67**: Error Messages
- **Examples**:
  - User tries to create circular dependency: What's the message?
    - "Oops! This would create a circular dependency. Task A can't depend on Task B if Task B depends on Task A."
    - "Circular dependency detected. Please choose a different task."
  - User tries to delete task with dependents: What's the message?
    - "This task is blocking 3 other tasks. Delete anyway?"
    - "Warning: Deleting this will affect 3 dependent tasks."
  - Sync failure:
    - "Couldn't sync with Google Calendar. Check your connection."
    - "Sync failed. Retry?"

---

## 🎯 FINAL META QUESTIONS

**Q68**: Design System Consistency
- **Question**: Should all three products share a design system?
  - Unified component library?
  - Consistent colors, typography, spacing?
  - Or each product has its own visual identity?

**Q69**: User Testing
- **Question**: What specific UX decisions need user testing?
  - A/B test: 5 emojis vs 10 scale for mood?
  - A/B test: Slider vs buttons for energy level?
  - Usability test: Can users understand pane system without tutorial?
  - Which questions above are most critical to test?

**Q70**: Product Vision Alignment
- **Final question**:
  - Is the goal to have 3 distinct products?
  - Or consolidate into one super-app?
  - Or have EDC be premium, Daybeam be free/simpler version?
  - What's the 2-year vision for this ecosystem?

---

## 📊 SUMMARY TABLE: KEY UX DECISIONS TO MAKE

| Feature Area | Decision Point | Options | Priority |
|--------------|----------------|---------|----------|
| Mood Logging | Scale Type | 3 emojis vs 5 emojis vs 10 numeric | High |
| Mood Logging | Energy Input | Slider vs Button Group | High |
| Mood Logging | Stress Input | Slider vs Button Group | High |
| Habit Completion | Interaction | Single tap vs Confirm dialog | High |
| Habit Frequency | Configuration | Dropdown vs Sentence builder | Medium |
| Habit Streak | Visualization | Number only vs Emoji+Number vs Progress ring | Medium |
| Task Priority | Input Method | Dropdown vs Star rating vs Slider | High |
| Task Due Date | Picker Type | Calendar vs Relative vs Smart text | High |
| Task Dependencies | Visualization | Lock icon vs Graph vs Inline warning | Medium |
| Pane System | Size Control | Presets vs Free resize vs Snap points | Medium (EDC only) |
| Pane System | Theme Granularity | Per-pane vs Workspace-wide | Low (EDC only) |
| Calendar | View Modes | 8 views vs Simplified (4 views) | Low |
| Journal | Editor Complexity | Minimal vs Medium vs Full formatting | Medium |
| Countdowns | Display Style | Large number vs Progress ring | Low |
| Analytics | Chart Types | Line vs Bar vs Area (per metric) | Medium (Daybeam) |
| Gamification | XP Visibility | Persistent vs Dashboard only | Medium (ATLAS) |

---

**Ready for next steps:**
1. Prioritize which questions are most critical to answer
2. User research/testing on specific UX decisions
3. Create design prototypes for A/B testing options
4. Align product vision (EDC vs Daybeam relationship)


# Spaces System - Technical Specification

## 1. Complete Feature Specification

### 1.1 Space Creation & Management

#### A. Space Definition

```typescript
interface Space {
  id: string
  userId: string

  // Core fields
  name: string                    // Required: "Work", "Personal", "Health"
  description?: string            // Optional: Purpose/notes
  color: string                   // Required: For visual distinction
  icon?: string                   // Optional: Emoji or icon identifier

  // Settings
  isDefault: boolean              // Is this the default space for new items?
  sortOrder: number               // Display order (0-indexed)

  // Metadata
  createdAt: Date
  updatedAt: Date
}
```

#### B. Pre-defined vs Custom Spaces

**Recommended approach: Hybrid**

**Default spaces created on user registration:**

```typescript
const DEFAULT_SPACES = [
  {
    name: 'Personal',
    description: 'Personal life, hobbies, relationships',
    color: '#2196F3', // Blue
    icon: '🏠',
    isDefault: true,
    sortOrder: 0
  },
  {
    name: 'Work',
    description: 'Work projects, meetings, deadlines',
    color: '#4CAF50', // Green
    icon: '💼',
    isDefault: false,
    sortOrder: 1
  }
]

async function createDefaultSpaces(userId: string) {
  for (const space of DEFAULT_SPACES) {
    await db.spaces.create({
      userId,
      ...space
    })
  }
}
```

**User can add custom spaces:**

```
Settings > Spaces
┌────────────────────────────────────────┐
│ Your Spaces                            │
├────────────────────────────────────────┤
│                                        │
│ 🏠 Personal (Default)                  │
│    Personal life, hobbies...           │
│    [Edit] [Delete]                     │
│                                        │
│ 💼 Work                                │
│    Work projects, meetings...          │
│    [Edit] [Set as Default]             │
│                                        │
│ 🏋️ Health & Fitness                   │
│    Workouts, meal planning...          │
│    [Edit] [Delete]                     │
│                                        │
│ [+ Add New Space]                      │
└────────────────────────────────────────┘
```

#### C. Space Fields

**Create/Edit Space Form:**

```
┌────────────────────────────────────────┐
│ Create Space                      [X]   │
├────────────────────────────────────────┤
│                                        │
│ Name*                                  │
│ [Health & Fitness_______________]      │
│                                        │
│ Description                            │
│ [Track workouts, meals, wellness___]   │
│ [_________________________________]    │
│                                        │
│ Icon (optional)                        │
│ [🏋️] [Choose Icon]                    │
│                                        │
│ Color*                                 │
│ ⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤                     │
│ #FF5722 (selected)                     │
│                                        │
│ ☐ Set as default for new items        │
│                                        │
│         [Cancel]  [Create Space]       │
└────────────────────────────────────────┘
```

**Color palette (12 colors):**

```typescript
const SPACE_COLORS = [
  { name: 'Blue', value: '#2196F3' },
  { name: 'Green', value: '#4CAF50' },
  { name: 'Orange', value: '#FF9800' },
  { name: 'Purple', value: '#9C27B0' },
  { name: 'Red', value: '#F44336' },
  { name: 'Teal', value: '#009688' },
  { name: 'Pink', value: '#E91E63' },
  { name: 'Indigo', value: '#3F51B5' },
  { name: 'Lime', value: '#CDDC39' },
  { name: 'Cyan', value: '#00BCD4' },
  { name: 'Amber', value: '#FFC107' },
  { name: 'Deep Purple', value: '#673AB7' }
]
```

#### D. Default Space

**Only ONE space can be default:**

```typescript
async function setDefaultSpace(userId: string, spaceId: string) {
  // Unset current default
  await db.spaces.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false }
  })

  // Set new default
  await db.spaces.update({
    where: { id: spaceId },
    data: { isDefault: true }
  })
}
```

**New items automatically assigned to default space:**

```typescript
// When creating new task without explicit space
async function createTask(data: CreateTaskInput, userId: string) {
  // If no space specified, use default
  if (!data.spaceId) {
    const defaultSpace = await db.spaces.findFirst({
      where: { userId, isDefault: true }
    })

    data.spaceId = defaultSpace.id
  }

  return await db.tasks.create({ ...data, userId })
}
```

---

### 1.2 Space Assignment

#### A. Assignment UI

**Dropdown on create/edit:**

```
Create Task
┌────────────────────────────────────────┐
│ Title*                                 │
│ [Finish project proposal____________]  │
│                                        │
│ Space*                                 │
│ [💼 Work ▾]                            │
│  ├─ 🏠 Personal                        │
│  ├─ 💼 Work (current)                  │
│  └─ 🏋️ Health & Fitness               │
│                                        │
│ Due Date                               │
│ [04/20/2025 ▾]                        │
│                                        │
│ [Cancel]  [Create Task]                │
└────────────────────────────────────────┘
```

**Quick change via context menu:**

```
Right-click on task card
┌────────────────────────────┐
│ Edit                       │
│ Duplicate                  │
│ Delete                     │
├────────────────────────────┤
│ Move to Space ▸            │
│   ├─ 🏠 Personal           │
│   ├─ 💼 Work ✓             │
│   └─ 🏋️ Health & Fitness  │
└────────────────────────────┘
```

**Drag-and-drop (V2):**

```
Dashboard (grouped by space)
┌──────────────────────────────────────┐
│ 💼 Work                              │
│ ┌──────────────────────────────────┐ │
│ │ ☐ Finish proposal                │ │
│ │ ☐ Team meeting prep              │ │ ← Drag task
│ └──────────────────────────────────┘ │
│                                      │
│ 🏠 Personal                          │
│ ┌──────────────────────────────────┐ │
│ │ ☐ Buy groceries                  │ │ ← Drop here
│ │ ☐ Call dentist                   │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

#### B. Bulk Assignment

**Select multiple items → Assign to space:**

```
Tasks Page
┌────────────────────────────────────────┐
│ [Select All] Selected: 3               │
│ [Move to Space ▾] [Delete]             │
├────────────────────────────────────────┤
│ ☑ Finish proposal                      │
│ ☑ Team meeting prep                    │
│ ☐ Buy groceries                        │
│ ☑ Schedule dentist                     │
└────────────────────────────────────────┘

After clicking "Move to Space":
┌────────────────────────────┐
│ Move 3 tasks to:           │
│ ○ 🏠 Personal              │
│ ● 💼 Work                  │
│ ○ 🏋️ Health & Fitness     │
│                            │
│ [Cancel]  [Move]           │
└────────────────────────────┘
```

#### C. Single Space Assignment

**Items belong to ONE space only:**

```typescript
// Enforced at database level
ALTER TABLE tasks
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

// Can't delete space if items exist
async function deleteSpace(spaceId: string) {
  const itemCount = await db.tasks.count({ where: { spaceId } })

  if (itemCount > 0) {
    throw new Error(`Cannot delete space: ${itemCount} tasks still assigned. Move or delete them first.`)
  }

  await db.spaces.delete({ where: { id: spaceId } })
}
```

**Move items before deleting space:**

```
Delete Space Confirmation
┌────────────────────────────────────────┐
│ Cannot Delete Space                    │
├────────────────────────────────────────┤
│ "Work" has 12 items assigned:          │
│ • 8 tasks                              │
│ • 2 habits                             │
│ • 1 countdown                          │
│ • 1 calendar event                     │
│                                        │
│ Move these items to:                   │
│ [🏠 Personal ▾]                        │
│                                        │
│ Then delete space "Work"?              │
│                                        │
│ [Cancel]  [Move & Delete]              │
└────────────────────────────────────────┘
```

#### D. Change Space After Creation

**Always allowed, no restrictions:**

```typescript
async function updateTaskSpace(taskId: string, newSpaceId: string) {
  await db.tasks.update({
    where: { id: taskId },
    data: { spaceId: newSpaceId }
  })

  // Update related entities
  // If task has calendar event, update event's space too
  const task = await db.tasks.findUnique({ where: { id: taskId }, include: { calendarEvent: true } })

  if (task.calendarEventId) {
    await db.calendarEvents.update({
      where: { id: task.calendarEventId },
      data: { spaceId: newSpaceId }
    })
  }
}
```

---

### 1.3 Space Filtering

#### A. Global Space Filter

**Top-level filter affecting entire app:**

```
┌──────────────────────────────────────────────┐
│ EDC Dashboard                                │
│ [All Spaces ▾] [Today ▾] [+]           [⚙️] │
└──────────────────────────────────────────────┘
    ↓
┌────────────────────┐
│ All Spaces ✓       │
│ ─────────────────  │
│ 🏠 Personal        │
│ 💼 Work            │
│ 🏋️ Health         │
└────────────────────┘
```

**Filter applies to all views:**

```typescript
// Context provider for global space filter
const SpaceFilterContext = createContext<{
  selectedSpaceId: string | null // null = "All Spaces"
  setSelectedSpaceId: (id: string | null) => void
}>()

// Used throughout app
function TasksList() {
  const { selectedSpaceId } = useSpaceFilter()

  const tasks = useTasks({
    where: selectedSpaceId ? { spaceId: selectedSpaceId } : {}
  })

  return <>{/* Render tasks */}</>
}
```

**Filter state persisted:**

```typescript
// Save to localStorage
useEffect(() => {
  if (selectedSpaceId) {
    localStorage.setItem('selectedSpaceId', selectedSpaceId)
  } else {
    localStorage.removeItem('selectedSpaceId')
  }
}, [selectedSpaceId])

// Restore on load
useEffect(() => {
  const saved = localStorage.getItem('selectedSpaceId')
  if (saved) {
    setSelectedSpaceId(saved)
  }
}, [])
```

#### B. Per-Pane Space Filter

**Each pane can have independent filter (V2):**

```
Dashboard (Split View)
┌──────────────────────┬──────────────────────┐
│ Tasks                │ Calendar             │
│ [💼 Work ▾]          │ [All Spaces ▾]       │
├──────────────────────┼──────────────────────┤
│ Work tasks only      │ All events           │
└──────────────────────┴──────────────────────┘
```

**Too complex for MVP, defer to V2.**

#### C. URL-Based Filtering

**Space filter reflected in URL:**

```typescript
// Route: /dashboard?space=work
const [searchParams, setSearchParams] = useSearchParams()

// Read from URL
const spaceId = searchParams.get('space')

// Update URL when filter changes
function setSpaceFilter(spaceId: string | null) {
  if (spaceId) {
    setSearchParams({ space: spaceId })
  } else {
    setSearchParams({})
  }
}

// Benefits:
// - Shareable links (though single-user app)
// - Browser back/forward works
// - Bookmark specific space views
```

#### D. Visual Filtering Indicators

**Show active filter in UI:**

```
When filtering by "Work":
┌────────────────────────────────────────┐
│ Tasks - 💼 Work                        │
│ Showing 8 work tasks  [Clear Filter]   │
├────────────────────────────────────────┤
│ ☐ Finish proposal                      │
│ ☐ Team meeting prep                    │
│ ...                                    │
└────────────────────────────────────────┘
```

**Empty state when no items in space:**

```
┌────────────────────────────────────────┐
│ Tasks - 🏋️ Health & Fitness           │
├────────────────────────────────────────┤
│                                        │
│        No health tasks yet             │
│                                        │
│   [+ Add Task]  [View All Spaces]      │
│                                        │
└────────────────────────────────────────┘
```

---

### 1.4 Space-Specific Features

#### A. Space Analytics

**Dashboard analytics per space:**

```
┌────────────────────────────────────────┐
│ Space Overview - 💼 Work               │
├────────────────────────────────────────┤
│ Tasks: 12 total                        │
│ • Completed: 8 (67%)                   │
│ • Pending: 4                           │
│ • Overdue: 1                           │
│                                        │
│ Habits: 3 total                        │
│ • Streak: 7 days avg                   │
│                                        │
│ Events: 5 upcoming                     │
│ • Next: Team Standup (tomorrow)        │
│                                        │
│ Productivity: 78% ↑                    │
│ (vs last week: 65%)                    │
└────────────────────────────────────────┘
```

**SQL query:**

```sql
-- Space analytics
SELECT
  s.id,
  s.name,
  COUNT(DISTINCT t.id) FILTER (WHERE t.completed = false) as pending_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.completed = true) as completed_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.due_date < NOW() AND t.completed = false) as overdue_tasks,
  COUNT(DISTINCT h.id) as habit_count,
  COUNT(DISTINCT ce.id) as upcoming_events
FROM spaces s
LEFT JOIN tasks t ON t.space_id = s.id
LEFT JOIN habits h ON h.space_id = s.id
LEFT JOIN calendar_events ce ON ce.space_id = s.id AND ce.start_time > NOW()
WHERE s.user_id = $1
GROUP BY s.id, s.name;
```

#### B. Space Themes (V2)

**Different theme per space:**

```typescript
interface SpaceTheme {
  spaceId: string
  themeMode: 'light' | 'dark' | 'auto'
  accentColor: string
  fontScale: number // 0.8 - 1.2
}

// Example: Work = dark theme, Personal = light theme
const spaceThemes = {
  work: {
    themeMode: 'dark',
    accentColor: '#4CAF50',
    fontScale: 1.0
  },
  personal: {
    themeMode: 'light',
    accentColor: '#2196F3',
    fontScale: 1.1
  }
}

// Apply theme when space filter changes
useEffect(() => {
  if (selectedSpaceId) {
    const theme = spaceThemes[selectedSpaceId]
    applyTheme(theme)
  } else {
    applyTheme(defaultTheme)
  }
}, [selectedSpaceId])
```

**Defer to V2+ (complex, low priority for ADHD user).**

#### C. Space Defaults

**Different defaults per space:**

```typescript
interface SpaceDefaults {
  spaceId: string

  // Task defaults
  defaultTaskPriority: Priority
  defaultTaskDuration: number // minutes

  // Habit defaults
  defaultHabitFrequency: 'daily' | 'weekly'

  // Calendar defaults
  defaultEventDuration: number // minutes
}

// Example: Work space defaults
const workDefaults = {
  defaultTaskPriority: 'high',
  defaultTaskDuration: 60,
  defaultEventDuration: 30
}

// Applied when creating items in that space
async function createTask(data: CreateTaskInput, spaceId: string) {
  const defaults = await db.spaceDefaults.findUnique({ where: { spaceId } })

  return await db.tasks.create({
    ...data,
    spaceId,
    priority: data.priority || defaults?.defaultTaskPriority || 'medium',
    estimatedDuration: data.estimatedDuration || defaults?.defaultTaskDuration
  })
}
```

**UI:**

```
Space Settings - 💼 Work
┌────────────────────────────────────────┐
│ Defaults for New Items                 │
├────────────────────────────────────────┤
│ Task Priority:  [High ▾]               │
│ Task Duration:  [60 minutes ▾]         │
│                                        │
│ Habit Frequency: [Daily ▾]             │
│                                        │
│ Event Duration: [30 minutes ▾]         │
│                                        │
│ [Save Defaults]                        │
└────────────────────────────────────────┘
```

**Defer to V2.**

---

### 1.5 ATLAS Work Integration

#### A. ATLAS as Separate Workspace

**ATLAS is NOT a space - it's a separate workspace:**

```typescript
// ATLAS items don't have spaceId
interface JIRATicket {
  id: string
  userId: string
  jiraId: string
  title: string
  // NO spaceId - ATLAS is separate
}

// User can optionally link JIRA ticket to EDC task
interface Task {
  id: string
  spaceId: string // Required
  atlasTicketId?: string // Optional: Link to JIRA ticket
}
```

**Navigation:**

```
┌────────────────────────────────────────┐
│ [Dashboard] [Tasks] [Calendar] [ATLAS] │
│                                        │
│ [All Spaces ▾]  ← Only for non-ATLAS  │
└────────────────────────────────────────┘

When on ATLAS page:
┌────────────────────────────────────────┐
│ [Dashboard] [Tasks] [Calendar] [ATLAS] │
│                    (active)            │
│ JIRA Integration                       │
│ (Space filter hidden)                  │
└────────────────────────────────────────┘
```

#### B. JIRA → EDC Task Conversion

**User can create EDC task from JIRA ticket:**

```
ATLAS Page
┌────────────────────────────────────────┐
│ JIRA-123: Fix login bug                │
│ Status: In Progress                    │
│ Assignee: You                          │
│                                        │
│ [Create EDC Task from this]            │
└────────────────────────────────────────┘

Click button:
┌────────────────────────────────────────┐
│ Create Task from JIRA-123              │
├────────────────────────────────────────┤
│ Title: [Fix login bug______________]   │
│                                        │
│ Space: [💼 Work ▾]                     │
│                                        │
│ Due Date: [04/20/2025 ▾]              │
│                                        │
│ ☑ Link to JIRA ticket                 │
│                                        │
│ [Cancel]  [Create Task]                │
└────────────────────────────────────────┘
```

**Created task:**

```typescript
{
  id: 'task_abc123',
  title: 'Fix login bug',
  spaceId: 'space_work',
  dueDate: '2025-04-20',
  atlasTicketId: 'JIRA-123', // Link back to JIRA
  description: 'From JIRA-123: Fix login bug\n\nhttps://jira.company.com/browse/JIRA-123',
  // ...
}
```

#### C. Display JIRA Tickets in Work Space

**Option (V2): Show JIRA tickets in Work space view:**

```
Tasks - 💼 Work
┌────────────────────────────────────────┐
│ [EDC Tasks ✓] [JIRA Tickets]          │
├────────────────────────────────────────┤
│ EDC Tasks (8)                          │
│ ☐ Finish proposal                      │
│ ☐ Team meeting prep                    │
│                                        │
│ JIRA Tickets (3)                       │
│ 📎 JIRA-123: Fix login bug             │
│ 📎 JIRA-456: Update docs               │
│                                        │
└────────────────────────────────────────┘
```

**This requires:**
- Virtual "Work" space that includes JIRA tickets
- Merge JIRA API data with EDC tasks
- Complex query logic

**Recommendation: Defer to V2. Keep ATLAS separate for MVP.**

---

### 1.6 Data Model

```sql
-- Spaces table
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Core fields
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  icon TEXT,

  -- Settings
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, name), -- Space names unique per user
  CHECK(color ~ '^#[0-9A-Fa-f]{6}$') -- Valid hex color
);

CREATE INDEX idx_spaces_user_id ON spaces(user_id);
CREATE INDEX idx_spaces_is_default ON spaces(user_id, is_default);
CREATE INDEX idx_spaces_sort_order ON spaces(user_id, sort_order);

-- Ensure only one default space per user
CREATE UNIQUE INDEX idx_spaces_one_default
  ON spaces(user_id)
  WHERE is_default = true;

-- Add spaceId to all entity tables
ALTER TABLE tasks
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

ALTER TABLE habits
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

ALTER TABLE journal_entries
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

ALTER TABLE countdowns
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

ALTER TABLE calendar_events
  ADD COLUMN space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE RESTRICT;

-- Indexes
CREATE INDEX idx_tasks_space_id ON tasks(space_id);
CREATE INDEX idx_habits_space_id ON habits(space_id);
CREATE INDEX idx_journal_entries_space_id ON journal_entries(space_id);
CREATE INDEX idx_countdowns_space_id ON countdowns(space_id);
CREATE INDEX idx_calendar_events_space_id ON calendar_events(space_id);

-- Space defaults (V2)
CREATE TABLE space_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE UNIQUE,

  -- Task defaults
  default_task_priority TEXT CHECK (default_task_priority IN ('low', 'medium', 'high', 'critical')),
  default_task_duration INTEGER, -- minutes

  -- Habit defaults
  default_habit_frequency TEXT CHECK (default_habit_frequency IN ('daily', 'weekly', 'monthly')),

  -- Calendar defaults
  default_event_duration INTEGER, -- minutes

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Space analytics (materialized view for performance)
CREATE MATERIALIZED VIEW space_analytics AS
SELECT
  s.id AS space_id,
  s.user_id,
  s.name,
  s.color,

  -- Task stats
  COUNT(DISTINCT t.id) FILTER (WHERE t.completed = false) as pending_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.completed = true) as completed_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.due_date < NOW() AND t.completed = false) as overdue_tasks,

  -- Habit stats
  COUNT(DISTINCT h.id) as total_habits,
  AVG(h.current_streak) FILTER (WHERE h.current_streak > 0) as avg_streak,

  -- Calendar stats
  COUNT(DISTINCT ce.id) FILTER (WHERE ce.start_time > NOW()) as upcoming_events,
  COUNT(DISTINCT cd.id) FILTER (WHERE cd.target_date > NOW() AND cd.archived = false) as active_countdowns,

  -- Productivity (completion rate)
  CASE
    WHEN COUNT(DISTINCT t.id) > 0 THEN
      ROUND((COUNT(DISTINCT t.id) FILTER (WHERE t.completed = true)::numeric / COUNT(DISTINCT t.id)) * 100, 1)
    ELSE 0
  END as completion_rate

FROM spaces s
LEFT JOIN tasks t ON t.space_id = s.id
LEFT JOIN habits h ON h.space_id = s.id
LEFT JOIN calendar_events ce ON ce.space_id = s.id
LEFT JOIN countdowns cd ON cd.space_id = s.id
GROUP BY s.id, s.user_id, s.name, s.color;

CREATE INDEX idx_space_analytics_user_id ON space_analytics(user_id);

-- Refresh materialized view (add to cron job)
-- REFRESH MATERIALIZED VIEW space_analytics;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_space_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER spaces_updated_at
  BEFORE UPDATE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_space_timestamp();

-- Prevent deletion of space with items
CREATE OR REPLACE FUNCTION prevent_space_deletion_with_items()
RETURNS TRIGGER AS $$
DECLARE
  item_count INTEGER;
BEGIN
  -- Count items in this space across all tables
  SELECT
    (SELECT COUNT(*) FROM tasks WHERE space_id = OLD.id) +
    (SELECT COUNT(*) FROM habits WHERE space_id = OLD.id) +
    (SELECT COUNT(*) FROM journal_entries WHERE space_id = OLD.id) +
    (SELECT COUNT(*) FROM countdowns WHERE space_id = OLD.id) +
    (SELECT COUNT(*) FROM calendar_events WHERE space_id = OLD.id)
  INTO item_count;

  IF item_count > 0 THEN
    RAISE EXCEPTION 'Cannot delete space "%" with % items assigned. Move or delete them first.', OLD.name, item_count;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_space_deletion
  BEFORE DELETE ON spaces
  FOR EACH ROW
  EXECUTE FUNCTION prevent_space_deletion_with_items();
```

---

## 2. API Endpoints

```typescript
// Spaces CRUD
GET    /api/spaces                  // List all spaces
GET    /api/spaces/:id              // Get single space
POST   /api/spaces                  // Create space
PATCH  /api/spaces/:id              // Update space
DELETE /api/spaces/:id              // Delete space (fails if items exist)
POST   /api/spaces/:id/set-default  // Set as default space

// Space management
POST   /api/spaces/:id/move-items   // Move all items to another space before delete
GET    /api/spaces/:id/analytics    // Get space analytics
GET    /api/spaces/:id/items        // Get all items in space

// Bulk operations
POST   /api/spaces/reorder          // Update sort order of all spaces
```

### Example: List Spaces

```http
GET /api/spaces

Response 200:
{
  "spaces": [
    {
      "id": "space_personal",
      "name": "Personal",
      "description": "Personal life, hobbies, relationships",
      "color": "#2196F3",
      "icon": "🏠",
      "isDefault": true,
      "sortOrder": 0,
      "stats": {
        "taskCount": 15,
        "habitCount": 4,
        "eventCount": 8,
        "countdownCount": 2
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-04-15T10:00:00Z"
    },
    {
      "id": "space_work",
      "name": "Work",
      "description": "Work projects, meetings, deadlines",
      "color": "#4CAF50",
      "icon": "💼",
      "isDefault": false,
      "sortOrder": 1,
      "stats": {
        "taskCount": 23,
        "habitCount": 3,
        "eventCount": 12,
        "countdownCount": 1
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-04-15T10:00:00Z"
    }
  ]
}
```

### Example: Create Space

```http
POST /api/spaces
Content-Type: application/json

{
  "name": "Health & Fitness",
  "description": "Workouts, meal planning, wellness tracking",
  "color": "#FF5722",
  "icon": "🏋️",
  "isDefault": false
}

Response 201:
{
  "space": {
    "id": "space_health",
    "name": "Health & Fitness",
    "description": "Workouts, meal planning, wellness tracking",
    "color": "#FF5722",
    "icon": "🏋️",
    "isDefault": false,
    "sortOrder": 2,
    "stats": {
      "taskCount": 0,
      "habitCount": 0,
      "eventCount": 0,
      "countdownCount": 0
    },
    "createdAt": "2025-04-15T14:00:00Z",
    "updatedAt": "2025-04-15T14:00:00Z"
  }
}
```

### Example: Delete Space (with items)

```http
DELETE /api/spaces/space_work

Response 400:
{
  "error": "SPACE_HAS_ITEMS",
  "message": "Cannot delete space 'Work' with 38 items assigned",
  "details": {
    "taskCount": 23,
    "habitCount": 3,
    "eventCount": 12,
    "countdownCount": 1
  },
  "suggestions": [
    "Move items to another space using POST /api/spaces/:id/move-items",
    "Delete items manually before deleting space"
  ]
}
```

### Example: Move Items Before Delete

```http
POST /api/spaces/space_work/move-items
Content-Type: application/json

{
  "targetSpaceId": "space_personal"
}

Response 200:
{
  "moved": {
    "tasks": 23,
    "habits": 3,
    "events": 12,
    "countdowns": 1,
    "total": 39
  },
  "message": "Moved 39 items from 'Work' to 'Personal'"
}

Then delete:
DELETE /api/spaces/space_work

Response 204: (success, no content)
```

### Example: Get Space Analytics

```http
GET /api/spaces/space_work/analytics

Response 200:
{
  "space": {
    "id": "space_work",
    "name": "Work",
    "color": "#4CAF50"
  },
  "analytics": {
    "tasks": {
      "total": 23,
      "pending": 15,
      "completed": 8,
      "overdue": 2,
      "completionRate": 34.8
    },
    "habits": {
      "total": 3,
      "avgStreak": 12.3,
      "longestStreak": 21
    },
    "events": {
      "upcoming": 12,
      "nextEvent": {
        "title": "Team Standup",
        "startTime": "2025-04-16T09:00:00Z"
      }
    },
    "countdowns": {
      "active": 1,
      "critical": 0,
      "urgent": 1
    },
    "productivity": {
      "thisWeek": 78,
      "lastWeek": 65,
      "trend": "up"
    }
  },
  "generatedAt": "2025-04-15T14:30:00Z"
}
```

---

## 3. Integration Points

### 3.1 All Entity Types
- Tasks, Habits, Journal Entries, Countdowns, Calendar Events all have `spaceId`
- Space filter affects all entity lists
- Deleting space requires moving/deleting all items

### 3.2 Dashboard
- Space filter dropdown in header
- Show item counts per space
- Space analytics cards

### 3.3 Calendar
- Event colors match space colors
- Filter calendar by space
- Create event in current space by default

### 3.4 ATLAS Integration
- ATLAS is separate from spaces (no spaceId)
- Can create EDC task from JIRA ticket → assign to space
- ATLAS page doesn't show space filter

---

## 4. Implementation Priority

### Phase 1: MVP (Week 1)
**Est. 16 hours**

- [ ] Database schema (spaces table) - 2h
- [ ] Default spaces creation - 1h
- [ ] Space CRUD API - 4h
- [ ] Add spaceId to all entities - 2h
- [ ] Space dropdown component - 2h
- [ ] Global space filter - 3h
- [ ] Space management UI - 2h

**MVP Deliverables:**
✅ Create/edit/delete spaces
✅ Assign items to spaces
✅ Global space filter
✅ Default space for new items
✅ 2 default spaces (Personal, Work)

### Phase 2: Enhanced Features (Week 2)
**Est. 10 hours**

- [ ] Space analytics - 4h
- [ ] Bulk move items - 2h
- [ ] Space reordering (drag-drop) - 2h
- [ ] Item count badges - 1h
- [ ] Space color theming - 1h

### Phase 3: Advanced (V2)
**Est. 12 hours**

- [ ] Per-pane space filters - 4h
- [ ] Space defaults (task priority, etc.) - 3h
- [ ] Space themes (dark/light per space) - 3h
- [ ] Space templates - 2h

**Defer to V2+:**
- Per-space themes
- Advanced analytics (productivity trends)
- Space templates (preset configurations)
- Shared spaces (multi-user, not needed for solo dev)

---

## 5. Technical Considerations

### 5.1 Performance

**Efficient filtering queries:**

```typescript
// Use indexes for space filtering
// Already created: CREATE INDEX idx_tasks_space_id ON tasks(space_id)

// Query with space filter
const tasks = await db.tasks.findMany({
  where: {
    userId,
    spaceId: selectedSpaceId, // Indexed, fast
    completed: false
  },
  orderBy: { dueDate: 'asc' }
})

// Without filter (all spaces)
const tasks = await db.tasks.findMany({
  where: {
    userId,
    completed: false
  },
  include: {
    space: true // Include space details for display
  },
  orderBy: { dueDate: 'asc' }
})
```

### 5.2 Caching

**Cache space list (rarely changes):**

```typescript
class SpaceCache {
  private cache: Space[] | null = null
  private expiresAt: number = 0

  async getSpaces(userId: string): Promise<Space[]> {
    if (this.cache && this.expiresAt > Date.now()) {
      return this.cache
    }

    const spaces = await db.spaces.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' }
    })

    this.cache = spaces
    this.expiresAt = Date.now() + 300000 // 5 minutes

    return spaces
  }

  invalidate() {
    this.cache = null
    this.expiresAt = 0
  }
}

// Invalidate on CRUD
eventEmitter.on('space:created', () => spaceCache.invalidate())
eventEmitter.on('space:updated', () => spaceCache.invalidate())
eventEmitter.on('space:deleted', () => spaceCache.invalidate())
```

### 5.3 Default Space Enforcement

**Always one default space:**

```typescript
// Trigger to ensure one default (database level)
// Already created: CREATE UNIQUE INDEX idx_spaces_one_default

// Application level check
async function updateSpace(spaceId: string, updates: Partial<Space>) {
  if (updates.isDefault === true) {
    // Unset other defaults first
    await db.spaces.updateMany({
      where: {
        userId: currentUser.id,
        isDefault: true,
        id: { not: spaceId }
      },
      data: { isDefault: false }
    })
  }

  if (updates.isDefault === false) {
    // Can't unset default if it's the only space
    const spaceCount = await db.spaces.count({ where: { userId: currentUser.id } })
    if (spaceCount === 1) {
      throw new Error('Cannot unset default on only space')
    }

    // If unsetting default, set another space as default
    const otherSpace = await db.spaces.findFirst({
      where: {
        userId: currentUser.id,
        id: { not: spaceId }
      }
    })

    await db.spaces.update({
      where: { id: otherSpace.id },
      data: { isDefault: true }
    })
  }

  return await db.spaces.update({
    where: { id: spaceId },
    data: updates
  })
}
```

### 5.4 Space Deletion Safety

**Prevent accidental deletion:**

```typescript
// Database trigger already prevents deletion with items
// Application layer for better UX:

async function deleteSpace(spaceId: string) {
  const itemCounts = await getSpaceItemCounts(spaceId)
  const totalItems = Object.values(itemCounts).reduce((sum, count) => sum + count, 0)

  if (totalItems > 0) {
    // Return helpful error with move suggestion
    throw new SpaceDeletionError({
      message: `Cannot delete space with ${totalItems} items`,
      itemCounts,
      suggestion: 'Move items to another space or delete them first',
      actionUrl: `/spaces/${spaceId}/move-items`
    })
  }

  // Check if this is the only space
  const spaceCount = await db.spaces.count({ where: { userId: currentUser.id } })
  if (spaceCount === 1) {
    throw new Error('Cannot delete the only space. Create another space first.')
  }

  // Safe to delete
  await db.spaces.delete({ where: { id: spaceId } })
}
```

### 5.5 Migration for Existing Data

**When adding spaces to existing app:**

```sql
-- Migration script
BEGIN;

-- Create default "Personal" space for all users
INSERT INTO spaces (user_id, name, description, color, icon, is_default, sort_order)
SELECT
  id as user_id,
  'Personal' as name,
  'Personal tasks, events, and notes' as description,
  '#2196F3' as color,
  '🏠' as icon,
  true as is_default,
  0 as sort_order
FROM users;

-- Assign all existing items to default space
UPDATE tasks
SET space_id = (SELECT id FROM spaces WHERE user_id = tasks.user_id AND is_default = true);

UPDATE habits
SET space_id = (SELECT id FROM spaces WHERE user_id = habits.user_id AND is_default = true);

UPDATE journal_entries
SET space_id = (SELECT id FROM spaces WHERE user_id = journal_entries.user_id AND is_default = true);

UPDATE countdowns
SET space_id = (SELECT id FROM spaces WHERE user_id = countdowns.user_id AND is_default = true);

UPDATE calendar_events
SET space_id = (SELECT id FROM spaces WHERE user_id = calendar_events.user_id AND is_default = true);

COMMIT;
```

---

## Summary

**MVP Focus:**
1. Create/manage spaces ✅
2. Assign items to spaces ✅
3. Global space filter ✅
4. Default space system ✅
5. Space analytics ✅

**Technical Stack:**
- PostgreSQL with foreign keys
- Unique constraint on default space
- Trigger to prevent deletion with items
- Materialized view for analytics

**Total Estimated Effort:** 26 hours (~3 days)

**Key Features:**
- 2 default spaces (Personal, Work)
- User can create unlimited custom spaces
- Items belong to exactly one space
- Cannot delete space with items
- Global filter affects all views
- Space analytics dashboard

**ATLAS Integration:**
- ATLAS is separate from spaces
- Can create EDC task from JIRA → assign to space
- Work space doesn't automatically include JIRA tickets (V2 feature)

**Files:**
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/spaces/specification.md`

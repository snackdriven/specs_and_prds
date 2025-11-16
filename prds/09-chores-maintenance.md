# PRD: Chores & Maintenance Tracking

## Product Overview

The Chores feature helps users track recurring maintenance tasks (cleaning, car maintenance, etc.) with target intervals, automatic task generation, and status tracking to prevent items from falling through the cracks.

## Problem Statement

Users with ADHD struggle with maintenance tasks because:
- **Out of Sight, Out of Mind**: Forgetting about recurring chores
- **No Urgency**: Maintenance tasks have no "due date" until overdue
- **Planning Difficulty**: Not knowing when to schedule chores
- **Task Proliferation**: Too many one-off tasks clog task list
- **Status Blindness**: Not knowing what's overdue vs on-track

## Core Features

### 1. Chore CRUD Operations

**User Stories**:
- As a user, I want to create recurring chores
- As a user, I want to set target intervals (every N days/weeks)
- As a user, I want to categorize chores
- As a user, I want to set priority levels

**Chore Fields**:
- `title`: Chore name (e.g., "Clean bathroom")
- `description`: Optional details
- `category`: Enum (kitchen, bathroom, bedroom, car, yard, etc.)
- `target_interval_days`: How often it should be done
- `priority`: Enum (low, medium, high)
- `is_active`: Active vs archived

### 2. Completion Logging

**User Stories**:
- As a user, I want to log when I complete a chore
- As a user, I want to see completion history
- As a user, I want to add notes about completion

**Completion Fields**:
- `chore_id`: Foreign key to chore
- `completed_at`: When chore was completed
- `notes`: Optional completion notes
- `duration_minutes`: How long it took (optional)

### 3. Status Calculation

**User Stories**:
- As a user, I want to see if chores are on-track, upcoming, or overdue
- As a user, I want automatic status calculation
- As a user, I want visual color-coding

**Status Types**:
```typescript
type ChoreStatus = 'on_track' | 'upcoming' | 'overdue'
```

**Status Logic**:
```typescript
function calculateChoreStatus(
  lastCompletion: Date,
  targetIntervalDays: number
): ChoreStatus {
  const daysSinceCompletion = differenceInDays(now(), lastCompletion)
  const daysUntilDue = targetIntervalDays - daysSinceCompletion

  if (daysUntilDue < 0) return 'overdue' // past target
  if (daysUntilDue <= 3) return 'upcoming' // due in 3 days
  return 'on_track' // still on schedule
}
```

**Color Coding**:
- **On Track**: Green
- **Upcoming**: Yellow
- **Overdue**: Red

### 4. Automatic Task Generation

**User Stories**:
- As a user, I want overdue chores to auto-create tasks
- As a user, I want to schedule chores as tasks
- As a user, I want task completion to log chore completion

**Technical Implementation**:
- Hook: `useChoreTaskGeneration()`
- Trigger: Button "Generate Tasks for Overdue Chores"
- Behavior: Creates task for each overdue chore
- Link: Task has reference to chore
- Completion: Completing task logs chore completion

**Task Generation Flow**:
1. User clicks "Generate Tasks"
2. System finds all overdue chores
3. For each overdue chore:
   - Check if task already exists for this chore
   - If not, create task with title: "Chore: [chore name]"
   - Link task to chore
4. Show notification: "Created 3 tasks for overdue chores"
5. User sees tasks in task list
6. User completes task
7. System logs chore completion automatically

### 5. Chore Categories

**User Stories**:
- As a user, I want to organize chores by category
- As a user, I want to filter by category
- As a user, I want predefined categories

**Categories**:
```typescript
enum ChoreCategory {
  kitchen = 'Kitchen',
  bathroom = 'Bathroom',
  bedroom = 'Bedroom',
  living_areas = 'Living Areas',
  laundry = 'Laundry',
  car_maintenance = 'Car Maintenance',
  yard_work = 'Yard Work',
  pet_care = 'Pet Care',
  general = 'General',
  other = 'Other'
}
```

### 6. Chore Statistics

**User Stories**:
- As a user, I want to see total chores (on-track, upcoming, overdue)
- As a user, I want to see completion rate
- As a user, I want to see average completion time

**Stats Provided**:
- Total chores
- On-track count
- Upcoming count (due in 3 days)
- Overdue count
- Completion rate (last 30 days)
- Average completion interval
- Most overdue chore

### 7. Chore Card Display

**User Stories**:
- As a user, I want visual cards for chores
- As a user, I want to see days since last completion
- As a user, I want to see days until target

**Card Elements**:
- Chore title
- Category badge
- Priority indicator
- Status color border
- "Last completed: 5 days ago"
- "Target: every 7 days"
- "Due in: 2 days" (or "Overdue by: 3 days")
- Progress bar showing completion timeline
- "Complete" button
- "Generate Task" button

## User Workflows

### Workflow 1: Creating a Chore
1. User opens chores pane
2. User clicks "+ New Chore"
3. User enters:
   - Title: "Clean bathroom"
   - Category: Bathroom
   - Target interval: 7 days
   - Priority: Medium
4. User saves chore
5. Chore appears in list with status "overdue" (never completed)
6. User completes chore immediately
7. Status changes to "on_track"

### Workflow 2: Chore Becomes Overdue
1. User has chore: "Change air filter" (every 90 days)
2. Last completion: 95 days ago
3. System calculates: 5 days overdue
4. Chore card shows red border
5. Status badge: "Overdue"
6. Days indicator: "Overdue by 5 days"

### Workflow 3: Generating Tasks from Chores
1. User has 3 overdue chores
2. User clicks "Generate Tasks for Overdue Chores"
3. System creates 3 tasks:
   - "Chore: Clean bathroom"
   - "Chore: Vacuum living room"
   - "Chore: Wash car"
4. Tasks appear in task list
5. User completes "Clean bathroom" task
6. System logs chore completion
7. Chore status changes from "overdue" to "on_track"
8. Task is marked complete

## Technical Architecture

### Database Schema
```sql
CREATE TABLE chores (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  target_interval_days INTEGER NOT NULL,
  priority TEXT DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE
)

CREATE TABLE chore_completions (
  id UUID PRIMARY KEY,
  chore_id UUID REFERENCES chores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  duration_minutes INTEGER
)
```

### Key Hooks
- `useChores()`: CRUD operations
- `useChoreCompletions()`: Completion history
- `useChoreTaskGeneration()`: Auto-generate tasks
- `useChoreStats()`: Statistics calculation

### Component Hierarchy
```
ChoresContentOrchestrator
├── ChoresHeader (add button, generate tasks button)
├── ChoresStats (overview cards)
├── ChoresFilters (category, status filters)
├── ChoresGrid
│   └── ChoreCard[]
│       ├── Title & category
│       ├── Status indicator
│       ├── Progress bar
│       ├── Last completion
│       ├── Complete button
│       └── Generate task button
└── ChoreModal (create/edit form)
```

## ADHD-Friendly Design

### 1. Visual Status
- Color-coded borders by status
- Clear "overdue" indicators
- Progress bars show time passage

### 2. One-Click Completion
- Complete button on card
- No modal required for basic completion
- Optional notes if desired

### 3. Auto-Task Generation
- Convert chores to actionable tasks
- Reduce mental overhead
- Tasks integrate with existing workflow

### 4. Interval-Based Thinking
- "Every 7 days" easier than "due on specific date"
- Flexible completion window
- Forgiveness for occasional delays

## Performance Considerations

- **Status Calculation**: Calculate on-demand, cache results
- **Completion History**: Load only recent completions (last 90 days)
- **Task Generation**: Batch operation with progress indicator

## Future Enhancements

1. **Chore Templates**: Common chore bundles (spring cleaning, car care)
2. **Shared Chores**: Assign to household members
3. **Checklist Items**: Subtasks for complex chores
4. **Time Estimation**: Predict completion time
5. **Supplies Tracking**: Link to supplies needed
6. **Photo Documentation**: Before/after photos
7. **Seasonal Chores**: Only show in certain months
8. **Routine Building**: Group chores into routines (morning cleaning, etc.)
9. **Gamification**: Points for consistent completion
10. **Smart Scheduling**: AI suggests best times based on energy levels

## Success Criteria

1. ✅ Chore CRUD operations functional
2. ✅ Completion logging working
3. ✅ Status calculation accurate (on-track, upcoming, overdue)
4. ✅ Category filtering working
5. ✅ Task generation functional
6. ✅ Statistics display (overdue count, etc.)
7. ✅ Color-coded visual status
8. ✅ Mobile-responsive cards

## References

- File: `components/panes/content/ChoresContentOrchestrator.tsx`
- File: `components/panes/content/ChoresContentOrchestratorUtils.ts`
- File: `components/chores/ChoreCard.tsx`
- Hook: `hooks/chores/useChores.ts`
- Hook: `hooks/chores/useChoreTaskGeneration.ts`
- Utility: `lib/features/chore-utils.ts`

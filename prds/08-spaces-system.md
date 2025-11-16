# PRD: Spaces System

## Overview

**Feature Name:** Spaces (Organizational Contexts)
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Spaces system provides users with a powerful organizational framework to categorize and segment their tasks, habits, journal entries, and countdowns across different life contexts. Spaces act as containers or "buckets" that help users mentally separate work from personal life, health goals from hobbies, or any other meaningful divisions. Each Space is customizable with colors and icons, creating visual distinction and enabling context-specific views throughout the application.

## Problem Statement

Users struggle with:
- Mental context switching between different life areas (work vs personal vs health)
- Finding relevant items when everything is mixed together
- Maintaining work-life balance when all tasks appear in one list
- Organizing disparate goals and responsibilities
- Creating meaningful separations without complex hierarchies
- Feeling overwhelmed by seeing all commitments at once
- Losing focus on specific life areas that need attention

## Goals & Success Metrics

### Goals
1. Enable clear separation of life contexts and responsibilities
2. Reduce cognitive load through contextual filtering
3. Support work-life balance by segregating professional and personal items
4. Provide visual identity for different life areas
5. Enable focused work sessions within a single context
6. Simplify organization without complex hierarchies (folders, sub-folders, etc.)

### Success Metrics
- **Space Adoption:** % of users who create at least one Space
- **Space Usage:** % of tasks/habits/journals assigned to Spaces
- **Multi-Space Users:** % of users with 2+ active Spaces
- **Filter Engagement:** Frequency of filtering by Space
- **Space Balance:** Distribution of items across Spaces (indicates well-balanced usage)
- **Retention:** Correlation between Space usage and app retention
- **Average Spaces:** Mean number of Spaces per active user (target: 3-5)

## User Personas

### Primary: The Context Switcher
- **Demographics:** 25-45 years old, professional with multiple life roles
- **Needs:** Separate work, personal, health, family contexts clearly
- **Pain Points:** Everything mixed together, can't focus on one area
- **Usage Pattern:** Creates 3-5 Spaces, filters frequently, batch work by context

### Secondary: The Work-Life Balancer
- **Demographics:** 30-50 years old, values clear boundaries
- **Needs:** Keep work tasks separate from personal life
- **Pain Points:** Work bleeding into personal time, mental exhaustion
- **Usage Pattern:** Creates "Work" and "Personal" Spaces, strict filtering

### Tertiary: The Project Organizer
- **Demographics:** 20-40 years old, manages multiple projects simultaneously
- **Needs:** Organize by project, client, or initiative
- **Pain Points:** Task overwhelm, losing track of project-specific items
- **Usage Pattern:** Creates Spaces per project, archives completed projects

## Functional Requirements

### 1. Space Creation

#### 1.1 Create Space Dialog
**Priority:** P0 (Critical)
- **Input Fields:**
  - Name (required, max 50 characters)
  - Description (optional, max 200 characters)
  - Color (required, from predefined palette)
  - Icon (required, from icon library)
- **Validation:**
  - Name cannot be empty
  - Name must be unique per user
  - Color selection required (default if not chosen)
  - Icon selection required (default if not chosen)
- **Smart Defaults:**
  - Suggest common Space names (Work, Personal, Health, etc.)
  - Default color rotation
  - Default icon based on name (e.g., "Work" → briefcase icon)

#### 1.2 Space Templates
**Priority:** P2 (Nice to Have)
- **Pre-built Spaces:**
  - Work (blue, briefcase icon)
  - Personal (purple, home icon)
  - Health & Fitness (green, heart icon)
  - Learning (orange, book icon)
  - Family (pink, users icon)
  - Finance (yellow, dollar icon)
  - Hobbies (cyan, star icon)
- **One-Click Creation:**
  - Select template → auto-filled name, color, icon
  - Editable after creation

#### 1.3 Color Customization
**Priority:** P0 (Critical)
- **Color Palette:**
  - 12-16 predefined colors
  - Ensures readability and contrast
  - Colors: red, orange, yellow, green, teal, cyan, blue, indigo, purple, pink, gray, brown
- **Color Preview:**
  - Live preview in creation dialog
  - Show how color appears on badges, cards, filters
- **Custom Colors (Future):**
  - Hex color picker
  - Color validation for contrast

#### 1.4 Icon Selection
**Priority:** P0 (Critical)
- **Icon Library:**
  - 50+ icons from Lucide React
  - Organized by category (work, lifestyle, health, objects, etc.)
  - Searchable icon picker
- **Common Icons:**
  - Briefcase, Home, Heart, Book, Users, Dollar, Star, Target, Coffee, etc.
- **Icon Preview:**
  - Live preview in creation dialog
  - Consistent sizing across app

### 2. Space Display

#### 2.1 Space Badge
**Priority:** P0 (Critical)
- **Visual Design:**
  - Pill-shaped badge
  - Space color as background
  - Space icon + name (or icon only in compact mode)
  - White or dark text based on background color (contrast)
- **Placement:**
  - On task cards
  - On habit cards
  - On journal entry cards
  - On countdown cards
  - In filter chips

#### 2.2 Space List View
**Priority:** P0 (Critical)
- **Dedicated Spaces Page:**
  - Grid or list layout
  - Each Space as a card
  - Card shows:
    - Space name and icon
    - Space color (background or border)
    - Item counts (X tasks, Y habits, Z journal entries, N countdowns)
    - Quick actions (view items, edit, delete)
- **Sorting:**
  - Alphabetical (A-Z, Z-A)
  - By creation date
  - By item count (most used first)
  - Manual reordering (drag-and-drop - future)

#### 2.3 Space-Specific Views
**Priority:** P1 (High)
- **Click Space → Filtered View:**
  - Navigates to Tasks view filtered by Space
  - Or shows dedicated Space detail page with tabs:
    - Tasks tab
    - Habits tab
    - Journal tab
    - Countdowns tab
    - Analytics tab (Space-specific metrics)
- **Quick Access:**
  - Space shortcuts in sidebar (future)
  - Recently used Spaces

### 3. Space Assignment

#### 3.1 Assign to Tasks
**Priority:** P0 (Critical)
- Space dropdown in Create Task dialog
- Space dropdown in Edit Task dialog
- Change Space from task card quick actions
- Bulk assign Space to multiple tasks (future)
- "No Space" option (unassigned tasks)

#### 3.2 Assign to Habits
**Priority:** P0 (Critical)
- Space dropdown in Create Habit dialog
- Space dropdown in Edit Habit dialog
- Visual Space badge on habit cards

#### 3.3 Assign to Journal Entries
**Priority:** P0 (Critical)
- Space dropdown in Create/Edit Journal dialog
- Space badge on journal entry cards
- Filter journal entries by Space

#### 3.4 Assign to Countdowns
**Priority:** P0 (Critical)
- Space dropdown in Create/Edit Countdown dialog
- Space badge on countdown cards
- Filter countdowns by Space

### 4. Filtering by Space

#### 4.1 Space Filter Controls
**Priority:** P0 (Critical)
- **Dropdown Filter:**
  - "All Spaces" option
  - List of user's Spaces (alphabetical)
  - "No Space" option (unassigned items)
  - Space color indicator in dropdown
- **Multi-Select Filter (Future):**
  - Select multiple Spaces at once
  - Show items from any selected Space
- **Quick Filter Chips:**
  - Click Space badge to filter by that Space
  - Active filter shown as chip above list
  - Clear filter button

#### 4.2 Cross-Feature Filtering
**Priority:** P0 (Critical)
- Consistent Space filtering across:
  - Tasks view
  - Habits view
  - Journal view
  - Countdowns view
  - Analytics view (Space-specific analytics)
- Persist last used Space filter (per view)

### 5. Space Management

#### 5.1 Edit Space
**Priority:** P0 (Critical)
- Click Space card to open edit dialog
- All properties editable (name, description, color, icon)
- Save/cancel actions
- Update confirmation
- Changes reflect immediately on all associated items

#### 5.2 Delete Space
**Priority:** P0 (Critical)
- Delete action in Space menu
- **Confirmation Dialog:**
  - Show item count (X tasks, Y habits, etc.)
  - Warning: "This will unassign the Space from all items"
  - Checkbox: "I understand items will not be deleted"
  - Delete button (destructive styling)
- **Deletion Behavior:**
  - Space is removed from all associated items
  - Items remain (not deleted)
  - Items become "No Space" (unassigned)
- **Soft Delete (Future):**
  - Archive instead of permanent delete
  - Restore archived Spaces

#### 5.3 Archive Space (Future)
**Priority:** P3 (Future)
- Archive completed projects or unused Spaces
- Archived Spaces hidden from filters
- Items remain assigned to archived Space
- "View Archived" toggle to see
- Unarchive action available

### 6. Space Analytics

#### 6.1 Space-Specific Metrics
**Priority:** P2 (Nice to Have)
- **Per-Space Statistics:**
  - Total items (tasks, habits, journals, countdowns)
  - Task completion rate within Space
  - Habit completion rate within Space
  - Average mood when items tagged with Space (future: requires mood-space link)
  - Journal entries count
- **Space Comparison:**
  - Compare productivity across Spaces
  - Identify most/least active Spaces
  - Balance recommendations

#### 6.2 Space Balance Insights
**Priority:** P2 (Nice to Have)
- **Insights:**
  - "80% of your tasks are in Work - consider work-life balance"
  - "You haven't added anything to Health in 2 weeks"
  - "Your most balanced week had equal focus across all Spaces"
- **Visual Balance:**
  - Pie chart showing item distribution
  - Stacked bar chart showing activity per Space over time

### 7. Default Space Settings

#### 7.1 Default Space Assignment
**Priority:** P2 (Nice to Have)
- **User Preference:**
  - Set a default Space for new tasks
  - Set a default Space for new habits
  - Set a default Space for new journal entries
  - Set a default Space for new countdowns
- **Time-Based Defaults (Future):**
  - Work hours → default to Work Space
  - Evenings/weekends → default to Personal Space

## Non-Functional Requirements

### Performance
- Space list load: < 100ms for 50 Spaces
- Space filter application: < 50ms
- Space badge rendering: performant with 100+ items

### Accessibility
- Keyboard navigation for Space selection
- Screen reader support for Space colors and icons
- Color-blind friendly (don't rely on color alone - use icons + text)
- High contrast mode support

### Scalability
- Support 50+ Spaces per user (though not recommended)
- Efficient filtering with database indexing on space_id
- No performance degradation with many Spaces

### Data Integrity
- Prevent Space name collisions per user
- Handle Space deletion gracefully (unassign, don't cascade delete items)
- Consistent Space references across all entities

### UX Guidelines
- Encourage 3-5 Spaces (sweet spot for organization)
- Warn when creating 10+ Spaces (may be too complex)
- Suggest consolidation if many inactive Spaces

## User Experience

### Information Architecture
```
Spaces View
├── Header
│   ├── Page Title
│   └── Create Space Button
├── Spaces Grid/List
│   ├── Space Card 1
│   │   ├── Icon + Name + Color
│   │   ├── Description
│   │   ├── Item Counts
│   │   └── Quick Actions (View, Edit, Delete)
│   ├── Space Card 2
│   └── ... Space Card N
└── Create Space Dialog

Space Detail View (Optional - future)
├── Space Header
│   ├── Icon + Name + Color
│   ├── Description
│   └── Edit/Delete Actions
├── Tabs
│   ├── Tasks Tab
│   ├── Habits Tab
│   ├── Journal Tab
│   ├── Countdowns Tab
│   └── Analytics Tab
└── Summary Stats
```

### User Flows

#### Flow 1: Initial Space Setup
1. User signs up and starts using Daybeam
2. User creates first task
3. System prompts: "Organize your tasks with Spaces"
4. User clicks "Create Space"
5. System suggests: "Work" (blue, briefcase)
6. User accepts suggestion
7. System creates Work Space
8. User prompted to create "Personal" Space
9. User creates Personal Space (purple, home icon)
10. User now has clear work-personal separation

#### Flow 2: Assign Task to Space
1. User clicks "Create Task"
2. User enters task title: "Prepare presentation"
3. User opens Space dropdown
4. User selects "Work" Space
5. Task saved with Work Space
6. Task appears with blue "Work" badge
7. User can filter to see only Work tasks

#### Flow 3: Filter by Space for Focus Session
1. User wants to focus on work tasks only
2. User navigates to Tasks view
3. User opens Space filter dropdown
4. User selects "Work"
5. Task list filters to show only Work tasks
6. User completes work tasks in focused session
7. User clears filter to see all tasks

#### Flow 4: Manage Completed Project Space
1. User completed a freelance project
2. User has "Project Alpha" Space with 25 completed tasks
3. User navigates to Spaces view
4. User clicks "Project Alpha" card
5. User clicks "Delete Space"
6. Confirmation dialog appears with item count
7. User confirms deletion
8. Space removed, tasks remain but unassigned
9. User can later assign tasks to "Freelance" Space if needed

### Visual Design

#### Space Color Palette
- Red (#ef4444)
- Orange (#f97316)
- Yellow (#eab308)
- Green (#22c55e)
- Teal (#14b8a6)
- Cyan (#06b6d4)
- Blue (#3b82f6)
- Indigo (#6366f1)
- Purple (#a855f7)
- Pink (#ec4899)
- Gray (#6b7280)
- Brown (#92400e)

#### Space Badge Design
```
┌─────────────────┐
│ 💼 Work         │  ← Blue background, white text
└─────────────────┘

┌─────────────────┐
│ 🏠 Personal     │  ← Purple background, white text
└─────────────────┘

Compact mode:
[💼]  [🏠]  [❤️]
```

#### Space Card Design
```
┌─────────────────────────────────────────┐
│ 💼 Work                                  │
│ Professional tasks and projects          │
│                                          │
│ 15 tasks • 3 habits • 8 journal entries  │
│                                          │
│              [View] [Edit] [Delete]      │
└─────────────────────────────────────────┘
```

## Technical Specifications

### Frontend Components
```typescript
<SpacesView>
  <SpacesHeader>
    <h1>Spaces</h1>
    <CreateSpaceButton />
  </SpacesHeader>

  <SpacesGrid>
    {spaces.map(space => (
      <SpaceCard
        key={space.id}
        space={space}
        onView={() => navigateToSpace(space.id)}
        onEdit={() => openEditDialog(space.id)}
        onDelete={() => handleDelete(space.id)}
      />
    ))}
  </SpacesGrid>

  <CreateSpaceDialog />
  <EditSpaceDialog />
</SpacesView>

<SpaceSelector value={selectedSpace} onChange={setSelectedSpace}>
  <option value="">All Spaces</option>
  {spaces.map(space => (
    <option key={space.id} value={space.id}>
      {space.icon} {space.name}
    </option>
  ))}
  <option value="none">No Space</option>
</SpaceSelector>

<SpaceBadge space={space}>
  <Icon name={space.icon} />
  <span>{space.name}</span>
</SpaceBadge>
```

### Data Models
```typescript
interface Space {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string; // hex color
  icon: string; // icon name from Lucide
  created_at: string;
  updated_at: string;
}

interface SpaceWithCounts extends Space {
  task_count: number;
  habit_count: number;
  journal_count: number;
  countdown_count: number;
  total_items: number;
}

// Tasks, Habits, Journals, Countdowns all have:
interface HasSpace {
  space_id?: string; // nullable - items can have no Space
}
```

### API Endpoints
```
POST   /spaces                      Create Space
GET    /users/:user_id/spaces       List user's Spaces
GET    /spaces/:id                  Get Space details
PUT    /spaces/:id                  Update Space
DELETE /spaces/:id                  Delete Space (unassigns from items)

GET    /spaces/:id/tasks            Get tasks in Space
GET    /spaces/:id/habits           Get habits in Space
GET    /spaces/:id/journal          Get journal entries in Space
GET    /spaces/:id/countdowns       Get countdowns in Space
GET    /spaces/:id/analytics        Get Space-specific analytics
```

### Database Schema
```sql
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(200),
  color VARCHAR(7) NOT NULL, -- hex color
  icon VARCHAR(50) NOT NULL,  -- icon name
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name) -- prevent duplicate names per user
);

-- Add space_id to existing tables:
ALTER TABLE tasks ADD COLUMN space_id UUID REFERENCES spaces(id) ON DELETE SET NULL;
ALTER TABLE habits ADD COLUMN space_id UUID REFERENCES spaces(id) ON DELETE SET NULL;
ALTER TABLE journal_entries ADD COLUMN space_id UUID REFERENCES spaces(id) ON DELETE SET NULL;
ALTER TABLE countdowns ADD COLUMN space_id UUID REFERENCES spaces(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX idx_tasks_space_id ON tasks(space_id);
CREATE INDEX idx_habits_space_id ON habits(space_id);
CREATE INDEX idx_journal_space_id ON journal_entries(space_id);
CREATE INDEX idx_countdowns_space_id ON countdowns(space_id);
```

### Space Deletion Logic
```typescript
async function deleteSpace(spaceId: string) {
  // Begin transaction
  const transaction = await db.beginTransaction();

  try {
    // Unassign space from all tasks
    await db.query('UPDATE tasks SET space_id = NULL WHERE space_id = $1', [spaceId]);

    // Unassign space from all habits
    await db.query('UPDATE habits SET space_id = NULL WHERE space_id = $1', [spaceId]);

    // Unassign space from all journal entries
    await db.query('UPDATE journal_entries SET space_id = NULL WHERE space_id = $1', [spaceId]);

    // Unassign space from all countdowns
    await db.query('UPDATE countdowns SET space_id = NULL WHERE space_id = $1', [spaceId]);

    // Delete the space
    await db.query('DELETE FROM spaces WHERE id = $1', [spaceId]);

    // Commit transaction
    await transaction.commit();

    return { success: true };
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    throw error;
  }
}
```

## Dependencies

### Internal
- Tasks system (Space assignment)
- Habits system (Space assignment)
- Journal system (Space assignment)
- Countdowns system (Space assignment)
- Analytics (Space-specific analytics)

### External
- React Query (data fetching)
- Lucide React (icon library)
- Radix UI (dialogs, dropdowns)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users create too many Spaces (complexity) | Medium | Medium | Suggest 3-5 Spaces, warn at 10+, educate on benefits of simplicity |
| Confusion between Spaces and Tags | Medium | Medium | Clear documentation, different visual treatments, use case examples |
| Space deletion anxiety (fear of losing data) | High | Low | Clear confirmation dialog, emphasize items are preserved, undo option |
| Overwhelming Space management | Low | Low | Simple UI, templates, drag-and-drop reordering (future) |
| Performance with many Spaces | Low | Low | Efficient queries, indexing, virtual scrolling if needed |

## Future Enhancements

### Phase 2
- Space hierarchy (parent-child Spaces)
- Shared Spaces (collaboration features)
- Space templates with pre-populated content
- Default Space based on time of day
- Space-specific theming (change app colors per Space)

### Phase 3
- Space goals and metrics
- Automatic Space suggestions based on content
- Space workflows (checklists, processes)
- Cross-Space dependencies (tasks in one Space blocking another)
- Space archives with reactivation

### Phase 4
- AI-powered Space organization
- Smart Space switching based on context (location, time, calendar events)
- Public Space templates marketplace
- Space-level permissions and sharing

## Open Questions

1. Should we enforce a maximum number of Spaces (e.g., 20)?
2. What's the default behavior when a Space is deleted - archive items or leave unassigned?
3. Should we support Space hierarchies (sub-Spaces) in v1?
4. How do we handle Space name changes - update everywhere or maintain history?
5. Should Spaces be shareable in v1 or wait for collaboration features?
6. What's the ideal onboarding flow to encourage Space creation?

## Appendix

### A. Common Space Examples
**Work Contexts:**
- Work
- Freelance
- Side Projects
- Client Name (for consultants)
- Department Name (for employees)

**Personal Life:**
- Personal
- Home & Family
- Relationships
- Self-Care

**Development Areas:**
- Health & Fitness
- Learning & Education
- Hobbies
- Finance
- Travel

**Project-Based:**
- Project Alpha
- Home Renovation
- Wedding Planning
- Book Writing

### B. Keyboard Shortcuts
- `Cmd/Ctrl + Shift + S` - Create new Space
- `S` - Focus Space filter dropdown
- `Escape` - Clear Space filter
- `Arrow keys` - Navigate Space dropdown
- `Enter` - Select Space from dropdown

### C. Analytics Events
```
- space_created
- space_edited
- space_deleted
- space_assigned (to task/habit/journal/countdown)
- space_filter_applied
- space_viewed (detail page)
- space_template_used
```

### D. Educational Content
**Why Use Spaces?**
- Mental clarity: Separate work and personal life
- Focus: Filter to one Space for deep work sessions
- Balance: Ensure equal attention across life areas
- Organization: Group related items together
- Flexibility: More lightweight than complex folder structures

**Best Practices:**
- Keep it simple: 3-5 Spaces is ideal
- Name clearly: "Work" not "W" or "Professional Stuff"
- Use colors meaningfully: Consistent color-coding helps recognition
- Review regularly: Archive or delete unused Spaces
- Don't over-categorize: If unsure, leave items unassigned

# PRD: Multi-Pane Workspace System

## Product Overview

The Pane System is the core architectural pattern of EDC, providing a flexible, draggable, resizable workspace where users can organize multiple feature areas (tasks, calendar, habits, etc.) simultaneously. It's designed specifically to reduce context switching for users with ADHD.

## Problem Statement

Traditional single-pane apps force users with ADHD to:
- **Constant Context Switching**: Navigate between pages to see different information
- **Memory Load**: Remember what was on previous page
- **Task Interruption**: Lose focus when switching views
- **Spatial Disorientation**: Difficulty tracking "where am I?" in navigation hierarchy
- **Sequential Thinking**: Forces linear navigation when thinking is non-linear

## Target Users

- **Primary**: Users with ADHD who benefit from seeing multiple contexts simultaneously
- **Secondary**: Power users who want dashboard-style layouts
- **Tertiary**: Multi-taskers managing complex workflows

## Core Features

### 1. Pane Types

**User Stories**:
- As a user, I want to open multiple feature panes at once
- As a user, I want to choose which panes to display
- As a user, I want panes for all major features

**Available Pane Types**:
```typescript
type PaneType =
  | 'calendar'        // Calendar with events
  | 'mood'            // Mood logging
  | 'tasks'           // Task management
  | 'habits'          // Habit tracking
  | 'chores'          // Chores/maintenance
  | 'countdowns'      // Countdown timers
  | 'journal'         // Journaling
  | 'widgets'         // Dashboard widgets (deprecated)
  | 'settings'        // Settings/preferences
  | 'work'            // Work checklist
  | 'wedding'         // Wedding planning
  | 'concerts'        // Concert tracking
  | 'rss'             // RSS feed reader
  | 'quick-links'     // Quick bookmarks
  | 'tags'            // Tag management
  | 'data-visualization' // CSV chart visualization
```

### 2. Pane Size Configuration

**User Stories**:
- As a user, I want panes to have appropriate default widths
- As a user, I want to resize panes
- As a user, I want pane sizes to persist

**Pane Size Presets**:
```typescript
enum PaneSizeConfig {
  EXTRA_WIDE = 'EXTRA_WIDE',  // 25% width (5-6 columns) - calendar, settings
  WIDE = 'WIDE',               // 22% width - tasks, journal
  STANDARD = 'STANDARD',       // 20% width - mood, habits
  NARROW = 'NARROW',           // 18% width - countdowns, quick-links
  CUSTOM = 'CUSTOM'            // User-defined
}
```

**Default Configurations**:
- **Calendar**: EXTRA_WIDE (needs space for week view)
- **Settings**: EXTRA_WIDE (complex forms)
- **Tasks**: WIDE (lots of content)
- **Journal**: WIDE (writing space)
- **Mood**: STANDARD (compact forms)
- **Habits**: STANDARD (list of habits)
- **Countdowns**: NARROW (simple cards)
- **Quick Links**: NARROW (link list)

### 3. Drag-and-Drop Positioning

**User Stories**:
- As a user, I want to drag panes to rearrange them
- As a user, I want visual feedback during drag
- As a user, I want pane order to persist

**Technical Implementation**:
- Library: `@dnd-kit/core` + `@dnd-kit/sortable`
- Component: `UnifiedSortablePane.tsx`
- State: Zustand store for pane order
- Persistence: Save to `user_pane_settings` table

**Drag Behavior**:
- Grab handle on pane header
- Visual placeholder shows drop target
- Smooth animation on drop
- Other panes shift to accommodate

### 4. Resize Handles

**User Stories**:
- As a user, I want to resize panes horizontally
- As a user, I want minimum/maximum size constraints
- As a user, I want resize to affect adjacent panes

**Technical Implementation**:
- Library: `react-resizable-panels`
- Resize handles between panes
- Constraints: Min 300px, max 800px
- Persistence: Save sizes to user settings

### 5. Pane Visibility Controls

**User Stories**:
- As a user, I want to show/hide panes
- As a user, I want to minimize panes to header-only
- As a user, I want to maximize panes to full-screen
- As a user, I want to collapse panes to a sidebar

**Visibility States**:
```typescript
interface PaneVisibility {
  visible: boolean      // shown in workspace
  minimized: boolean    // header only, content hidden
  fullscreen: boolean   // expanded to full viewport
  collapsed: boolean    // completely hidden, restore button only
}
```

**Controls**:
- Eye icon: Toggle visibility
- Minus icon: Minimize to header
- Maximize icon: Fullscreen mode
- Collapse icon: Collapse to sidebar

### 6. Pane Menu System

**User Stories**:
- As a user, I want to add new panes from a menu
- As a user, I want to remove panes
- As a user, I want to see which panes are currently open

**Component**: Pane selector menu (dropdown or sidebar)

**Menu Features**:
- Checkmarks next to open panes
- Click to toggle pane visibility
- "Add All" / "Remove All" options
- Pane count indicator

### 7. Pane-Specific Themes

**User Stories**:
- As a user, I want to customize theme per pane
- As a user, I want different color schemes for different panes
- As a user, I want visual distinction between panes

**Technical Implementation**:
- Database: `user_pane_settings.custom_theme` field
- Component: Theme picker in pane header menu
- Theming: 15+ available themes
- Inheritance: Workspace theme → Pane theme → Content theme

**Theme Application**:
- Each pane can override workspace theme
- Pane content inherits pane theme
- Scrollbars, borders, headers use pane theme
- Smooth transitions when changing themes

### 8. Pane Alternate Names

**User Stories**:
- As a user, I want to rename panes
- As a user, I want "Tasks" pane called "To-Do"
- As a user, I want personalized pane headers

**Technical Implementation**:
- Database: `user_pane_settings.alternate_name` field
- UI: Edit icon in pane header
- Display: Use alternate name if set, otherwise default

### 9. Responsive Layout

**User Stories**:
- As a user on mobile, I want panes to stack vertically
- As a user on tablet, I want 2-column layout
- As a user on desktop, I want 3-4 column layout

**Breakpoints**:
- **Mobile** (<768px): 1 column, vertical stack, accordion-style
- **Tablet** (768-1024px): 2 columns
- **Desktop** (1024-1440px): 3 columns
- **Wide** (>1440px): 4+ columns

### 10. Pane Content Registry

**User Stories**:
- As a developer, I want to register new pane types easily
- As a developer, I want lazy-loaded pane content
- As a developer, I want consistent pane interface

**Technical Implementation**:
- File: `components/panes/content/registry.tsx`
- Pattern: Factory pattern with lazy imports
- Registration:
  ```typescript
  registerPaneContent({
    type: 'new-feature',
    component: React.lazy(() => import('./NewFeatureContent')),
    defaultConfig: { size: 'STANDARD' }
  })
  ```

## User Workflows

### Workflow 1: Setting Up Workspace
1. User opens EDC for first time
2. Default panes load: Calendar, Tasks, Habits
3. User clicks "+ Add Pane" menu
4. User selects "Countdowns"
5. Countdown pane appears on right side
6. User drags Countdown pane to left of Calendar
7. Layout saves automatically

### Workflow 2: Resizing Panes
1. User has Calendar and Tasks panes open
2. Calendar is too narrow to see full week
3. User hovers between panes, sees resize handle
4. User drags resize handle to the right
5. Calendar pane expands, Tasks pane shrinks
6. New sizes save automatically
7. Next session restores these sizes

### Workflow 3: Customizing Pane Theme
1. User has Tasks pane open with default theme
2. User clicks theme icon in Tasks header
3. Theme picker dropdown appears
4. User selects "Dark Emerald" theme
5. Tasks pane transitions to new theme
6. Other panes remain in their themes
7. Theme preference saves

### Workflow 4: Mobile Responsive View
1. User opens EDC on phone
2. Panes stack vertically (accordion-style)
3. User sees Calendar pane first (expanded)
4. User taps Tasks header
5. Tasks pane expands, Calendar collapses
6. User can scroll within expanded pane
7. One pane visible at a time on mobile

## Technical Architecture

### Database Schema
```sql
CREATE TABLE user_pane_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  pane_type TEXT NOT NULL,
  custom_theme TEXT,
  alternate_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pane_type)
)
```

### Key Components
- **PaneSystem.tsx**: Main orchestrator for pane workspace
- **UnifiedSortablePane.tsx**: Individual draggable/resizable pane wrapper
- **registry.tsx**: Central registry for pane content components
- **config.ts**: Pane type configurations and size presets

### Pane Interface
```typescript
interface PaneConfig {
  id: string
  type: PaneType
  size: PaneSizeConfig
  order: number
  visible: boolean
  minimized: boolean
  fullscreen: boolean
  theme?: string
  alternateName?: string
}

interface PaneContentProps {
  paneConfig: PaneConfig
  theme: UnifiedPaneTheme
  onMaximize?: () => void
  currentPanes?: PaneConfig[]
}
```

### Component Hierarchy
```
PaneSystem (workspace orchestrator)
├── PaneMenuBar (add/remove panes)
├── PaneGrid (responsive grid layout)
│   └── UnifiedSortablePane[] (draggable pane wrappers)
│       ├── PaneHeader
│       │   ├── Title (with alternate name)
│       │   ├── Theme picker
│       │   ├── Minimize/maximize buttons
│       │   └── Close button
│       ├── PaneContent (loaded from registry)
│       │   ├── TasksContentOrchestrator
│       │   ├── CalendarContentOrchestrator
│       │   ├── HabitsContentOrchestrator
│       │   └── ... (all feature content)
│       └── ResizeHandle
└── CollapsedPanesSidebar (restore buttons)
```

## ADHD-Friendly Design

### 1. Visual Persistence
- All information stays visible
- No need to remember what's on other page
- Spatial memory aids navigation

### 2. Flexible Organization
- Arrange panes to match mental model
- No forced linear structure
- User controls their workspace

### 3. Reduced Context Switching
- See tasks and calendar simultaneously
- Drag task to calendar without page switch
- Check mood while viewing habits

### 4. Progressive Disclosure
- Start with few panes, add more as needed
- Minimize panes to reduce visual clutter
- Collapse unused panes to sidebar

### 5. Cognitive Load Distribution
- Split attention across multiple panes
- Each pane focused on single purpose
- Visual boundaries reduce interference

## Performance Considerations

- **Lazy Loading**: Pane content loaded only when pane opens
- **Virtual Rendering**: Off-screen panes not rendered
- **Memoization**: Pane components memoized to prevent unnecessary re-renders
- **Resize Throttling**: Resize events throttled to 60fps
- **Drag Optimization**: Use `will-change` CSS for smooth dragging

## Future Enhancements

1. **Pane Tabs**: Multiple views per pane (e.g., Tasks pane with Kanban/List tabs)
2. **Pane Linking**: Link panes (scroll Task in Calendar scrolls Calendar to date)
3. **Pane Snapshots**: Save/load workspace configurations
4. **Shared Workspaces**: Share workspace layout with others
5. **Conditional Panes**: Show/hide panes based on time of day
6. **Pane Templates**: Pre-made layouts (Focus Mode, Full Dashboard, etc.)
7. **Floating Panes**: Detach panes to floating windows
8. **Picture-in-Picture**: Pin small pane always on top
9. **Pane Shortcuts**: Keyboard shortcuts to switch between panes
10. **Smart Layouts**: AI suggests layout based on usage patterns

## Success Criteria

1. ✅ Pane drag-and-drop working smoothly
2. ✅ Pane resizing functional with constraints
3. ✅ At least 10 pane types registered
4. ✅ Per-pane theme customization working
5. ✅ Pane visibility controls (minimize, maximize, close)
6. ✅ Pane settings persistence (size, theme, order)
7. ✅ Mobile responsive layout (vertical stack)
8. ✅ Performance: <100ms for pane drag/resize
9. ✅ Accessibility: Keyboard navigation between panes
10. ✅ Lazy loading: Content loaded only when pane opens

## References

- File: `components/panes/PaneSystem.tsx`
- File: `components/panes/UnifiedSortablePane.tsx`
- File: `components/panes/content/registry.tsx`
- File: `components/panes/config.ts`
- Schema: `supabase/schema.sql:43-52` (user_pane_settings)
- README: `components/panes/README.md`
- README: `components/panes/content/README.md`

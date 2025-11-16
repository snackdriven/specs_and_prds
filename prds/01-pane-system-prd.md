# Pane System - Product Requirements Document

**Feature Area:** Multi-Pane Workspace System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Pane System is the foundational architectural component of EDC, providing an Andy Matuschak-style sliding pane interface that allows users to view and interact with multiple contexts simultaneously without cognitive overload.

## Problem Statement

Traditional productivity apps force users into rigid layouts or overwhelming tab systems. For individuals with ADHD:
- **Context switching is expensive** - Moving between screens breaks focus
- **Out of sight = out of mind** - Hidden information is forgotten information
- **One-size-fits-all doesn't work** - Different tasks need different layouts
- **Cognitive load adds up** - Complex interfaces increase executive function burden

## Goals

### Primary Goals
1. **Reduce Context Switching:** Allow multiple panes visible simultaneously
2. **Maintain Focus:** Minimize/maximize panes to control information density
3. **Support Flexibility:** Users can arrange panes however they need
4. **Preserve Context:** Pane configurations persist across sessions

### Secondary Goals
1. Enable per-pane customization (themes, names)
2. Support responsive layouts (desktop-optimized)
3. Provide visual recognition through color coding
4. Allow quick transitions between focused and overview modes

## User Stories

### Epic: Basic Pane Management
- As a user, I can add new panes to my workspace
- As a user, I can reorder panes via drag-and-drop
- As a user, I can resize panes to my preferred width
- As a user, I can remove panes I don't need
- As a user, I can minimize panes to a thin "spine" to reduce clutter
- As a user, I can maximize a pane to fullscreen for focused work

### Epic: Pane Customization
- As a user, I can rename panes to match my workflow
- As a user, I can assign custom themes to individual panes
- As a user, I can see color-coded pane headers for quick recognition
- As a user, my pane configurations persist across sessions

### Epic: Navigation & Focus
- As a user, I can scroll through many panes horizontally
- As a user, I can quickly minimize all panes to see the overview
- As a user, I can expand panes from their spine view
- As a user, I can work with multiple panes side-by-side

## Functional Requirements

### FR1: Pane Types
**Priority:** P0 (Critical)

The system shall support 16 pane types:
1. `tasks` - Task management
2. `calendar` - Calendar and events
3. `habits` - Habit tracking
4. `mood` - Mood logging
5. `journal` - Journaling
6. `countdowns` - Countdown timers
7. `concerts` - Concert tracking
8. `rss` - RSS feed reader
9. `settings` - Application settings
10. `chores` - Work checklist
11. `widgets` - Dashboard widgets
12. `quick-links` - Bookmark management
13. `tags` - Tag management
14. `data-visualization` - Data exploration
15. `wedding` - Wedding countdown (custom theme)
16. `work` - Work-specific pane

### FR2: Pane Operations
**Priority:** P0 (Critical)

**Add Pane:**
- Exposed via `onInternalAddPaneReady` callback
- Creates new pane with unique ID
- Places at end of pane array by default
- Supports initial configuration (width, theme, name)

**Remove Pane:**
- Removes pane from array
- Updates localStorage
- No confirmation dialog (easy to re-add)

**Reorder Panes:**
- Drag-and-drop interface
- Visual feedback showing drop position (before/after)
- Updates order in localStorage

**Resize Panes:**
- Click-and-drag resize handles
- Enforces min/max width constraints (200-800px default)
- Width persisted per pane in localStorage

### FR3: Pane States
**Priority:** P0 (Critical)

**Normal State:**
- Width: 200-800px (user-configurable)
- Shows full content
- Header with controls
- Resizable via handles

**Minimized State (Spine):**
- Width: 32px (configurable via `spineWidth` prop)
- Shows rotated header text
- Single click to expand
- Still draggable

**Maximized State (Fullscreen):**
- Width: 100% viewport
- Hides other panes
- Shows close button to exit fullscreen
- Keyboard shortcut: ESC to exit

### FR4: Rendering Modes
**Priority:** P0 (Critical)

**Fixed Width Mode:**
- Each pane has fixed width
- Horizontal scrolling enabled
- Scroll buttons appear when needed
- Suitable for many panes

**Resizable Panels Mode:**
- Uses `react-resizable-panels`
- Proportional sizing
- Resize handles between panes
- Enabled via `enableResizablePanels` prop

**Maximized Mode:**
- Single pane fills viewport
- All other panes hidden
- Quick toggle back to previous mode

### FR5: Persistence
**Priority:** P0 (Critical)

**localStorage Structure:**
```typescript
Key: `pane-system-state-${userId}`
Value: {
  panes: Array<{
    id: string;
    type: PaneType;
    width?: number;
    customTheme?: string;
    alternateName?: string;
  }>;
  version: number;
}
```

**Persistence Triggers:**
- Pane added/removed
- Pane reordered
- Pane resized
- Theme changed
- Name changed

**Debounced:** Updates debounced to 500ms for resize operations

### FR6: Theme Integration
**Priority:** P1 (High)

**Pane Color System:**
Each pane type has an associated theme color from the active theme:
```typescript
calendar: theme.paneColors.calendar
tasks: theme.paneColors.tasks
habits: theme.paneColors.habits
// ... etc
```

**Per-Pane Theme Override:**
- Stored in `user_pane_settings` table
- Applied via `custom_theme` column
- Overrides global theme for that pane only
- Managed via settings interface

### FR7: Alternate Names
**Priority:** P2 (Medium)

**Feature:**
- Users can rename panes
- Stored in `user_pane_settings` table
- Applied via `alternate_name` column
- Shown in header and spine
- Managed via `usePaneAlternateNames()` hook

**Use Case:**
User might rename "Tasks" to "To-Do" or "Work Items"

### FR8: Navigation
**Priority:** P1 (High)

**Horizontal Scrolling:**
- Smooth scroll via buttons
- Mouse wheel support
- Touch swipe support (where available)
- Scroll buttons show when content overflows
- Auto-scroll when dragging panes near edges

**Keyboard Navigation:**
- ESC: Exit fullscreen mode
- Arrow keys: Navigate between panes (future)
- Tab: Navigate within pane content

## Non-Functional Requirements

### NFR1: Performance
- Pane add/remove: <100ms
- Drag-and-drop feedback: <16ms (60fps)
- Resize operations: <16ms (60fps)
- Initial render: <500ms for 10 panes
- localStorage updates: Debounced to reduce writes

### NFR2: Accessibility
- Keyboard-navigable pane controls
- ARIA labels on all interactive elements
- Screen reader support for pane operations
- Focus management during add/remove/maximize
- Color contrast compliance (WCAG 2.1 AA)

### NFR3: Responsive Design
- Desktop-optimized (1280px+ primary target)
- Tablet support (768px+) with adjusted widths
- Mobile: Fallback to single-pane view
- Breakpoints respect theme design tokens

### NFR4: Browser Compatibility
- Chrome/Edge (Chromium): Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported

## Technical Architecture

### Component Structure

```
components/panes/
├── PaneSystem.tsx                    # Main orchestrator
├── UnifiedSortablePane.tsx          # Individual pane component
├── PaneSystemRenderers.tsx          # Rendering mode implementations
├── PaneSystemUtils.ts               # Utility functions
├── PaneSystemWelcomeScreens.tsx    # Empty states
├── usePaneSystemState.ts            # State management hook
├── useScrollState.ts                # Scroll behavior hook
├── config.ts                        # Default configurations
├── id.ts                            # ID generation
├── types.ts                         # TypeScript types
├── content/
│   ├── registry.tsx                 # Lazy-loaded content registry
│   ├── TasksContentOrchestrator.tsx
│   ├── CalendarContentOrchestrator.tsx
│   ├── HabitsContentOrchestrator.tsx
│   ├── ... (36+ orchestrators)
└── unified-components/
    ├── PaneControlHeaderOrchestrator.tsx
    ├── UnifiedPaneHeader.tsx
    └── ... (shared UI components)
```

### Data Flow

```
User Action
    ↓
PaneSystem (orchestrator)
    ↓
usePaneSystemState (state management)
    ↓
localStorage (persistence)
    ↓
PaneSystemRenderers (rendering)
    ↓
UnifiedSortablePane (individual panes)
    ↓
Content Orchestrator (feature-specific)
    ↓
Content Renderer (UI)
```

### State Management

**Local State (React.useState):**
- Drag-and-drop state (draggedPaneId, dropTargetId, dropPosition)
- Scroll state (canScrollLeft, canScrollRight)
- Transient UI state

**Persistent State (localStorage):**
- Pane configurations
- Order
- Widths
- User-specific keys

**Database State (Supabase):**
- Custom themes per pane (`user_pane_settings.custom_theme`)
- Alternate names (`user_pane_settings.alternate_name`)
- User preferences (`profiles`)

### Hooks

**usePaneSystemState:**
- Location: `components/panes/usePaneSystemState.ts`
- Purpose: Centralize pane array state and persistence
- Returns: panes, setPanes, derived state, handlers

**usePaneAlternateNames:**
- Location: `hooks/ui/usePaneAlternateNames.ts`
- Purpose: Manage pane renaming
- Database: `user_pane_settings` table

**usePaneSettings:**
- Location: `hooks/panes/usePaneSettings.ts`
- Purpose: Manage per-pane theme and settings
- Database: `user_pane_settings` table

**useScrollState:**
- Location: `components/panes/useScrollState.ts`
- Purpose: Handle horizontal scrolling logic
- Returns: scroll handlers, calculatePaneWidth

## UI/UX Specifications

### Visual Design

**Pane Header:**
- Height: 48px (3rem)
- Background: Pane theme color
- Text: White or high-contrast color
- Controls: Minimize, Maximize, Close buttons
- Title: Pane type or alternate name

**Pane Spine (Minimized):**
- Width: 32px default (configurable)
- Background: Pane theme color (slightly darkened)
- Text: Rotated 90° (configurable direction)
- Hover: Slight scale/glow effect
- Click: Expand to normal width

**Resize Handles:**
- Width: 4px
- Color: Transparent (visible on hover)
- Hover color: Border color from theme
- Cursor: col-resize
- Touch target: 16px (larger than visual)

**Scroll Buttons:**
- Position: Fixed left/right edges
- Size: 40px × full height
- Background: Semi-transparent gradient
- Icon: Chevron (← or →)
- Visibility: Only when overflow exists

### Animations

**Pane Add:**
- Duration: 300ms
- Easing: ease-out
- Effect: Slide in from right, fade in

**Pane Remove:**
- Duration: 200ms
- Easing: ease-in
- Effect: Shrink width to 0, fade out

**Minimize/Expand:**
- Duration: 250ms
- Easing: ease-in-out
- Effect: Width transition with transform

**Maximize/Exit Fullscreen:**
- Duration: 300ms
- Easing: ease-in-out
- Effect: Width/position transition

**Drag-and-Drop:**
- Visual feedback: Drop indicator line
- Ghost pane: Semi-transparent version
- Snap: Magnetic snap to drop positions

### Interaction Patterns

**Add Pane:**
1. User clicks "Add Pane" button
2. Dropdown/modal shows available pane types
3. User selects type
4. Pane appears at end with animation
5. Auto-scrolls to show new pane

**Reorder Pane:**
1. User clicks and holds pane header
2. Pane becomes semi-transparent
3. Drop indicators appear between panes
4. User drags to desired position
5. Drop indicator highlights target
6. On release, pane moves to new position
7. Order persists immediately

**Resize Pane:**
1. User hovers over pane edge
2. Resize handle appears
3. User clicks and drags
4. Pane width updates in real-time
5. Constraints enforced (min/max width)
6. On release, width persists (debounced)

**Minimize Pane:**
1. User clicks minimize button
2. Pane animates to spine width
3. Text rotates 90°
4. Other panes reflow

**Maximize Pane:**
1. User clicks maximize button
2. All other panes hide
3. Target pane expands to full width
4. Close button appears
5. ESC key exits

## Edge Cases & Error Handling

### Edge Case 1: No Panes
**Scenario:** User removes all panes
**Behavior:** Show `NoPanesWelcomeScreen` with "Add Pane" button

### Edge Case 2: All Panes Minimized
**Scenario:** User minimizes all panes
**Behavior:** Show `AllPanesMinimizedScreen` with "Expand All" option

### Edge Case 3: localStorage Full
**Scenario:** localStorage quota exceeded
**Behavior:**
- Show error toast
- Attempt to clear old data
- Fall back to session-only persistence

### Edge Case 4: Invalid Pane Configuration
**Scenario:** Corrupted localStorage data
**Behavior:**
- Log error
- Reset to default configuration
- Show notification to user

### Edge Case 5: Browser Window Resize
**Scenario:** User resizes browser window
**Behavior:**
- Recalculate pane widths
- Adjust scroll buttons
- Maintain relative proportions

### Edge Case 6: Maximum Panes
**Scenario:** User tries to add 20+ panes
**Behavior:**
- Allow but warn about performance
- Suggest removing unused panes
- Maintain smooth scrolling

## Testing Strategy

### Unit Tests
- Pane add/remove/reorder operations
- Width calculation and constraints
- localStorage persistence
- State management hooks

### Integration Tests
- Pane system with content orchestrators
- Theme integration
- Alternate names
- User preferences

### E2E Tests (Playwright)
- Add/remove/reorder panes workflow
- Minimize/maximize/resize operations
- Drag-and-drop reordering
- Theme switching per pane
- Persistence across page reload

### Performance Tests
- Render time with 1, 5, 10, 20 panes
- Drag-and-drop frame rate
- Resize operation smoothness
- Memory usage with many panes

## Success Metrics

### Usage Metrics
- Average panes per user
- Most used pane types
- Pane reorder frequency
- Minimize/maximize usage
- Custom theme adoption

### Performance Metrics
- Pane render time <500ms
- Drag-and-drop frame rate >55fps
- Resize operation frame rate >55fps
- localStorage update frequency

### User Satisfaction
- Pane system usability score
- Feature discoverability
- Customization satisfaction
- Performance perception

## Future Enhancements

### v1.1 Planned
- Pane groups/workspaces (save multiple configurations)
- Keyboard shortcuts for pane navigation
- Pane search/filter
- Export/import pane configurations

### v1.2 Potential
- Vertical stacking option
- Pane templates
- Collaborative pane sharing
- Mobile-optimized pane system
- Picture-in-picture detached panes

### v2.0 Vision
- Multi-monitor support
- Cloud sync of pane configurations
- AI-suggested pane layouts
- Advanced pane rules (auto-open/close based on context)

## Open Questions

1. Should we limit maximum number of panes? (Currently unlimited)
2. Should we provide pane templates for common workflows?
3. Should pane configurations sync across devices?
4. Should we support nested panes (panes within panes)?
5. Should we track pane usage analytics to suggest optimal layouts?

## Dependencies

### External Libraries
- `react-resizable-panels` - For resizable panels mode
- `framer-motion` - For animations (if used)
- `@dnd-kit/core` - For drag-and-drop (if migrating from current implementation)

### Internal Dependencies
- User context (`contexts/UserContext`)
- Theme system (`lib/themes/`)
- Design tokens (`lib/themes/design-tokens.ts`)
- Content orchestrators (`components/panes/content/`)

## Approval & Sign-off

- [ ] Product Owner
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] QA Lead

---

## Related Documents

- [Pane System Functional Specification](../functional-specs/01-pane-system-functional-spec.md)
- [Master PRD](./00-MASTER-PRD.md)
- [Theme System PRD](./12-theme-system-prd.md)

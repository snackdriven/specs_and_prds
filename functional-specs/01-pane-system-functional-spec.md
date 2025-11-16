# Pane System - Functional Specification

**Feature Area:** Multi-Pane Workspace System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Purpose

This document provides detailed technical specifications for implementing and maintaining the Pane System in EDC. It serves as a reference for developers working on pane-related features.

## System Architecture

### Component Hierarchy

```
<PaneSystem>
  ├─ usePaneSystemState() [hook]
  ├─ useScrollState() [hook]
  ├─ usePaneAlternateNames() [hook]
  │
  ├─ [Rendering Mode Selection]
  │   ├─ FixedWidthModeRenderer
  │   │   └─ UnifiedSortablePane (×N)
  │   │       ├─ PaneControlHeaderOrchestrator
  │   │       └─ [Content from registry]
  │   │
  │   ├─ ResizablePanelsModeRenderer
  │   │   └─ ResizablePanelGroup
  │   │       └─ ResizablePanel (×N)
  │   │           └─ UnifiedSortablePane
  │   │               ├─ PaneControlHeaderOrchestrator
  │   │               └─ [Content from registry]
  │   │
  │   └─ MaximizedModeRenderer
  │       └─ UnifiedSortablePane (single)
  │           ├─ PaneControlHeaderOrchestrator
  │           └─ [Content from registry]
  │
  └─ [Empty States]
      ├─ NoPanesWelcomeScreen
      └─ AllPanesMinimizedScreen
```

### File Locations

**Core Files:**
- `/components/panes/PaneSystem.tsx` - Main orchestrator component
- `/components/panes/UnifiedSortablePane.tsx` - Individual pane wrapper
- `/components/panes/PaneSystemRenderers.tsx` - Rendering mode implementations
- `/components/panes/PaneSystemUtils.ts` - Utility functions
- `/components/panes/PaneSystemWelcomeScreens.tsx` - Empty state screens

**State Management:**
- `/components/panes/usePaneSystemState.ts` - Core pane state hook
- `/components/panes/useScrollState.ts` - Scroll behavior hook
- `/hooks/ui/usePaneAlternateNames.ts` - Pane renaming hook
- `/hooks/panes/usePaneSettings.ts` - Per-pane settings hook

**Configuration:**
- `/components/panes/config.ts` - Default pane configurations
- `/components/panes/types.ts` - TypeScript type definitions
- `/components/panes/id.ts` - ID generation utilities

**Content:**
- `/components/panes/content/registry.tsx` - Lazy-loaded content registry
- `/components/panes/content/*ContentOrchestrator.tsx` - 36+ feature orchestrators

**Shared Components:**
- `/components/panes/unified-components/PaneControlHeaderOrchestrator.tsx`
- `/components/panes/unified-components/UnifiedPaneHeader.tsx`
- `/components/panes/unified-components/PaneMetadata.tsx`
- `/components/panes/unified-components/PaneContentHeader.tsx`

## Data Models

### TypeScript Interfaces

**PaneConfig:**
```typescript
interface PaneConfig {
  id: string;                    // Unique identifier (nanoid)
  type: PaneType;                // One of 16 pane types
  width?: number;                // Custom width (200-800px)
  isMinimized?: boolean;         // Spine mode flag
  customTheme?: string;          // Theme override
  alternateName?: string;        // User-defined name
}
```

**PaneType:**
```typescript
type PaneType =
  | 'calendar'
  | 'chores'
  | 'concerts'
  | 'countdowns'
  | 'data-visualization'
  | 'habits'
  | 'journal'
  | 'mood'
  | 'quick-links'
  | 'rss'
  | 'settings'
  | 'tags'
  | 'tasks'
  | 'wedding'
  | 'widgets'
  | 'work';
```

**PaneSystemProps:**
```typescript
interface PaneSystemProps {
  // Appearance
  userColorOverride?: string;
  rotatedHeadersEnabled?: boolean;
  spineTextDirection?: 'top-to-bottom' | 'bottom-to-top';
  spineWidth?: number;

  // Layout
  widthStrategy?: 'user' | 'fixed' | 'proportional';
  defaultLeafWidth?: number;
  minPaneWidth?: number;
  maxPaneWidth?: number;
  enableResizablePanels?: boolean;

  // Internal (deprecated)
  _stackingEnabled?: boolean;

  // Callbacks
  onPaneAdd?: (type: PaneType) => void;
  onAvailablePaneTypesChange?: (types: PaneType[]) => void;
  onInternalAddPaneReady?: (fn: (type: PaneType) => void) => void;
  onMinimizeAllReady?: (fn: () => void) => void;
  onCurrentPanesChange?: (panes: PaneConfig[]) => void;
}
```

**PaneContentProps:**
```typescript
interface PaneContentProps {
  paneId: string;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  customTheme?: string;
  userColorOverride?: string;
  alternateName?: string;
}
```

### Database Schema

**user_pane_settings:**
```sql
CREATE TABLE user_pane_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  pane_type TEXT NOT NULL,
  custom_theme TEXT,
  alternate_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, pane_type)
);

CREATE INDEX idx_user_pane_settings_user ON user_pane_settings(user_id);
CREATE INDEX idx_user_pane_settings_type ON user_pane_settings(user_id, pane_type);
```

**profiles (relevant fields):**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  -- Pane-related preferences could be added here
  -- Currently pane configs stored in localStorage
  ...
);
```

### localStorage Structure

**Key Pattern:**
```
pane-system-state-${userId}
```

**Value Schema:**
```typescript
{
  panes: Array<{
    id: string;           // nanoid
    type: PaneType;
    width?: number;       // Optional custom width
    isMinimized?: boolean;
    // customTheme and alternateName stored in database
  }>;
  version: number;        // Schema version (currently 1)
}
```

**Migration Strategy:**
- Version 1: Current schema
- Future versions: Add migration logic in `usePaneSystemState.ts`

## State Management

### usePaneSystemState Hook

**Location:** `/components/panes/usePaneSystemState.ts`

**Responsibilities:**
1. Load pane configuration from localStorage
2. Synchronize with database for themes/names
3. Provide pane CRUD operations
4. Calculate derived state (visible panes, available types)
5. Persist changes to localStorage

**Interface:**
```typescript
function usePaneSystemState(
  contextUser: User | null,
  spineWidth: number,
  options: {
    spineTextDirection: string;
    minPaneWidth: number;
    maxPaneWidth: number;
    widthStrategy: string;
    defaultLeafWidth: number;
  }
): {
  // State
  panes: PaneConfig[];
  setPanes: (panes: PaneConfig[]) => void;

  // Scroll state
  canScrollLeft: boolean;
  setCanScrollLeft: (value: boolean) => void;
  canScrollRight: boolean;
  setCanScrollRight: (value: boolean) => void;

  // Derived state
  visiblePanes: PaneConfig[];
  availablePaneTypes: PaneType[];
  hasFullscreenPane: boolean;
  allPanesMinimized: boolean;
  panelSizesArray: number[];

  // Operations
  debouncedLayoutUpdate: () => void;
}
```

**Implementation Details:**

**Initial Load:**
```typescript
useEffect(() => {
  if (!contextUser?.id) return;

  const storageKey = `pane-system-state-${contextUser.id}`;
  const stored = localStorage.getItem(storageKey);

  if (stored) {
    const { panes, version } = JSON.parse(stored);
    // Apply migrations if needed
    setPanes(panes);
  } else {
    // Load default configuration
    setPanes(DEFAULT_PANE_CONFIGS);
  }
}, [contextUser?.id]);
```

**Persistence:**
```typescript
useEffect(() => {
  if (!contextUser?.id || panes.length === 0) return;

  const storageKey = `pane-system-state-${contextUser.id}`;
  const data = {
    panes: panes.map(p => ({
      id: p.id,
      type: p.type,
      width: p.width,
      isMinimized: p.isMinimized,
    })),
    version: 1,
  };

  localStorage.setItem(storageKey, JSON.stringify(data));
}, [panes, contextUser?.id]);
```

**Debounced Updates:**
```typescript
const debouncedLayoutUpdate = useMemo(
  () => debounce(() => {
    // Trigger layout recalculation
    // Used for resize operations
  }, 500),
  []
);
```

### usePaneAlternateNames Hook

**Location:** `/hooks/ui/usePaneAlternateNames.ts`

**Purpose:** Manage user-defined pane names

**Database Integration:**
```typescript
// Fetch alternate names
const { data: settings } = useQuery({
  queryKey: ['pane-settings', userId],
  queryFn: async () => {
    const { data } = await supabase
      .from('user_pane_settings')
      .select('pane_type, alternate_name')
      .eq('user_id', userId);
    return data;
  },
});

// Update alternate name
const updateName = useMutation({
  mutationFn: async ({ paneType, name }: { paneType: PaneType; name: string }) => {
    return supabase
      .from('user_pane_settings')
      .upsert({
        user_id: userId,
        pane_type: paneType,
        alternate_name: name,
      }, {
        onConflict: 'user_id,pane_type',
      });
  },
});
```

**Return Value:**
```typescript
{
  alternateNames: Record<PaneType, string | undefined>;
  updateAlternateName: (type: PaneType, name: string) => Promise<void>;
  clearAlternateName: (type: PaneType) => Promise<void>;
}
```

### usePaneSettings Hook

**Location:** `/hooks/panes/usePaneSettings.ts`

**Purpose:** Manage per-pane theme and settings

**Similar pattern to usePaneAlternateNames but for custom themes**

## Operations

### Add Pane

**Trigger:** User selects pane type from add menu

**Implementation:**
```typescript
const addPane = useCallback((type: PaneType) => {
  const newPane: PaneConfig = {
    id: generateId(),
    type,
    width: defaultLeafWidth,
    isMinimized: false,
  };

  setPanes(prev => [...prev, newPane]);

  // Auto-scroll to show new pane
  setTimeout(() => {
    scrollContainerRef.current?.scrollTo({
      left: scrollContainerRef.current.scrollWidth,
      behavior: 'smooth',
    });
  }, 100);
}, [defaultLeafWidth]);
```

**Constraints:**
- Cannot add duplicate pane types (enforced by UI, not here)
- Maximum panes: No hard limit, performance degrades gracefully

### Remove Pane

**Trigger:** User clicks close button on pane

**Implementation:**
```typescript
const removePane = useCallback((paneId: string) => {
  setPanes(prev => prev.filter(p => p.id !== paneId));
}, []);
```

**Edge Cases:**
- Removing last pane: Show `NoPanesWelcomeScreen`
- Removing maximized pane: Exit fullscreen mode first

### Reorder Panes

**Trigger:** User drags pane to new position

**Implementation:**
```typescript
const handleDragEnd = useCallback((event: DragEndEvent) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setPanes(prev => {
    const oldIndex = prev.findIndex(p => p.id === active.id);
    const newIndex = prev.findIndex(p => p.id === over.id);

    const newPanes = [...prev];
    const [movedPane] = newPanes.splice(oldIndex, 1);
    newPanes.splice(newIndex, 0, movedPane);

    return newPanes;
  });
}, []);
```

**Drag Indicators:**
- Visual line showing drop position
- Highlight target pane
- Ghost image of dragged pane

### Resize Pane

**Trigger:** User drags resize handle

**Implementation:**
```typescript
const handleResize = useCallback((paneId: string, newWidth: number) => {
  // Enforce constraints
  const constrainedWidth = Math.max(
    minPaneWidth,
    Math.min(maxPaneWidth, newWidth)
  );

  setPanes(prev => prev.map(p =>
    p.id === paneId ? { ...p, width: constrainedWidth } : p
  ));

  // Debounce localStorage update
  debouncedLayoutUpdate();
}, [minPaneWidth, maxPaneWidth, debouncedLayoutUpdate]);
```

**Constraints:**
- Min width: 200px (configurable)
- Max width: 800px (configurable)
- Snap to multiples of 50px (optional)

### Toggle Minimize

**Trigger:** User clicks minimize/expand button

**Implementation:**
```typescript
const toggleMinimize = useCallback((paneId: string) => {
  setPanes(prev => prev.map(p =>
    p.id === paneId ? { ...p, isMinimized: !p.isMinimized } : p
  ));
}, []);
```

**Animation:**
- Width transition: 250ms ease-in-out
- Text rotation: 250ms (if going from normal to spine)
- Other panes reflow automatically

### Toggle Maximize

**Trigger:** User clicks maximize button or ESC key

**Implementation:**
```typescript
const [maximizedPaneId, setMaximizedPaneId] = useState<string | null>(null);

const toggleMaximize = useCallback((paneId: string) => {
  setMaximizedPaneId(prev => prev === paneId ? null : paneId);
}, []);

// ESC key handler
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && maximizedPaneId) {
      setMaximizedPaneId(null);
    }
  };

  window.addEventListener('keydown', handleEscape);
  return () => window.removeEventListener('keydown', handleEscape);
}, [maximizedPaneId]);
```

**Rendering:**
- When `maximizedPaneId` is set, use `MaximizedModeRenderer`
- Hide all other panes
- Show close button in header

## Rendering Modes

### Fixed Width Mode

**When Used:** Default mode, `enableResizablePanels === false`

**Component:** `FixedWidthModeRenderer`

**Layout:**
```tsx
<div className="flex overflow-x-auto">
  {visiblePanes.map(pane => (
    <UnifiedSortablePane
      key={pane.id}
      config={pane}
      width={calculatePaneWidth(pane)}
      onResize={handleResize}
      onToggleMinimize={toggleMinimize}
      onRemove={removePane}
    />
  ))}
</div>
```

**Characteristics:**
- Each pane has explicit width
- Horizontal scrolling enabled
- Scroll buttons when overflow
- Simple to reason about

### Resizable Panels Mode

**When Used:** `enableResizablePanels === true`

**Component:** `ResizablePanelsModeRenderer`

**Library:** `react-resizable-panels`

**Layout:**
```tsx
<ResizablePanelGroup direction="horizontal">
  {visiblePanes.map((pane, index) => (
    <React.Fragment key={pane.id}>
      <ResizablePanel
        defaultSize={calculateDefaultSize(pane)}
        minSize={minPaneWidth / totalWidth * 100}
        maxSize={maxPaneWidth / totalWidth * 100}
      >
        <UnifiedSortablePane config={pane} ... />
      </ResizablePanel>

      {index < visiblePanes.length - 1 && (
        <ResizableHandle />
      )}
    </React.Fragment>
  ))}
</ResizablePanelGroup>
```

**Characteristics:**
- Proportional sizing
- Resize handles between panes
- No scrolling (all panes fit)
- More complex state management

### Maximized Mode

**When Used:** User maximizes a pane

**Component:** `MaximizedModeRenderer`

**Layout:**
```tsx
<div className="w-full h-full">
  <UnifiedSortablePane
    config={maximizedPane}
    width="100%"
    isMaximized
    onToggleMaximize={() => setMaximizedPaneId(null)}
    ...
  />
</div>
```

**Characteristics:**
- Single pane visible
- Full viewport width
- Close button to exit
- ESC key support

## Content Registry

**Location:** `/components/panes/content/registry.tsx`

**Purpose:** Lazy-load pane content to reduce initial bundle size

**Implementation:**
```typescript
const contentRegistry: Record<PaneType, React.LazyExoticComponent<...>> = {
  tasks: lazy(() => import('./TasksContentOrchestrator')),
  calendar: lazy(() => import('./CalendarContentOrchestrator')),
  habits: lazy(() => import('./HabitsContentOrchestrator')),
  // ... etc
};

export function getPaneContent(type: PaneType): React.ComponentType<PaneContentProps> {
  return contentRegistry[type];
}
```

**Usage in UnifiedSortablePane:**
```tsx
const ContentComponent = getPaneContent(config.type);

return (
  <Suspense fallback={<PaneLoadingState />}>
    <ContentComponent
      paneId={config.id}
      isMinimized={config.isMinimized}
      customTheme={config.customTheme}
      alternateName={config.alternateName}
      {...otherProps}
    />
  </Suspense>
);
```

## Styling & Theming

### Theme Integration

**Pane Colors from Theme:**
```typescript
import { getCurrentTheme } from '@/lib/themes';

const theme = getCurrentTheme();
const paneColor = theme.paneColors[paneType];
```

**Color Application:**
```tsx
<div
  className="pane-header"
  style={{
    backgroundColor: paneColor,
    color: getContrastingTextColor(paneColor),
  }}
>
  {/* Header content */}
</div>
```

**Custom Theme Override:**
```typescript
const effectiveColor = customTheme
  ? getThemeByName(customTheme).paneColors[paneType]
  : theme.paneColors[paneType];
```

### Responsive Styling

**Breakpoints:**
```css
/* Desktop (default) */
.pane-system { /* ... */ }

/* Tablet */
@media (max-width: 1024px) {
  .pane-system {
    --min-pane-width: 300px;
    --max-pane-width: 600px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .pane-system {
    /* Fallback to single-pane view */
    flex-direction: column;
  }
}
```

### Animations

**Using Tailwind + CSS Transitions:**
```css
.pane {
  transition: width 250ms ease-in-out;
}

.pane.minimizing {
  transition: width 250ms ease-in-out,
              transform 250ms ease-in-out;
}

.pane-header-text.rotated {
  transform: rotate(-90deg);
  transition: transform 250ms ease-in-out;
}
```

**Using Framer Motion (if preferred):**
```tsx
<motion.div
  initial={{ width: 0, opacity: 0 }}
  animate={{ width: paneWidth, opacity: 1 }}
  exit={{ width: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Pane content */}
</motion.div>
```

## Performance Considerations

### Optimization Strategies

**1. Lazy Loading:**
- Content components lazy-loaded via registry
- Suspense boundaries prevent blocking

**2. Virtualization:**
- For 20+ panes, consider virtual scrolling
- Only render visible panes + buffer

**3. Memoization:**
```typescript
const PaneSystem = React.memo(function PaneSystem(props) {
  // ...
});

const UnifiedSortablePane = React.memo(function UnifiedSortablePane(props) {
  // ...
});
```

**4. Debouncing:**
- Resize operations debounced (500ms)
- localStorage updates debounced
- Scroll calculations throttled

**5. Efficient Re-renders:**
- Use `useCallback` for handlers
- Use `useMemo` for expensive calculations
- Avoid inline object creation in render

### Performance Monitoring

**Metrics to Track:**
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Pane render time
- Drag-and-drop frame rate
- localStorage write frequency

**Tools:**
- React DevTools Profiler
- Chrome Performance tab
- Lighthouse CI

## Testing

### Unit Tests

**usePaneSystemState:**
```typescript
describe('usePaneSystemState', () => {
  it('loads panes from localStorage', () => {
    // Setup localStorage
    // Render hook
    // Assert panes loaded
  });

  it('persists panes to localStorage', () => {
    // Render hook
    // Update panes
    // Assert localStorage updated
  });

  it('calculates visiblePanes correctly', () => {
    // Render hook with mixed minimized/normal panes
    // Assert visiblePanes excludes minimized
  });
});
```

**PaneSystem Utils:**
```typescript
describe('createToggleMinimizeHandler', () => {
  it('toggles isMinimized flag', () => {
    const panes = [{ id: '1', type: 'tasks', isMinimized: false }];
    const setPanes = jest.fn();

    const handler = createToggleMinimizeHandler('1', setPanes, panes);
    handler();

    expect(setPanes).toHaveBeenCalledWith([
      { id: '1', type: 'tasks', isMinimized: true }
    ]);
  });
});
```

### Integration Tests

**Pane Operations:**
```typescript
describe('PaneSystem', () => {
  it('adds pane when addPane called', () => {
    const { result } = renderHook(() => usePaneSystem());

    act(() => {
      result.current.addPane('calendar');
    });

    expect(result.current.panes).toContainEqual(
      expect.objectContaining({ type: 'calendar' })
    );
  });

  it('removes pane when removePane called', () => {
    // Similar pattern
  });
});
```

### E2E Tests (Playwright)

**Workflow Tests:**
```typescript
test('user can add, reorder, and remove panes', async ({ page }) => {
  await page.goto('/panes');

  // Add pane
  await page.click('[data-testid="add-pane-button"]');
  await page.click('[data-testid="pane-type-calendar"]');

  // Verify pane added
  await expect(page.locator('[data-pane-type="calendar"]')).toBeVisible();

  // Drag to reorder
  const source = page.locator('[data-pane-id="pane-1"]');
  const target = page.locator('[data-pane-id="pane-2"]');
  await source.dragTo(target);

  // Verify order changed
  const paneOrder = await page.locator('[data-pane-id]').allTextContents();
  expect(paneOrder).toEqual(['pane-2', 'pane-1', 'calendar']);

  // Remove pane
  await page.click('[data-pane-type="calendar"] [data-testid="close-button"]');

  // Verify pane removed
  await expect(page.locator('[data-pane-type="calendar"]')).not.toBeVisible();
});

test('pane configuration persists after reload', async ({ page }) => {
  // Add panes, customize
  // Reload page
  // Verify configuration restored
});
```

**Performance Tests:**
```typescript
test('pane system handles 20 panes smoothly', async ({ page }) => {
  // Add 20 panes
  // Measure render time
  // Assert < 2 seconds

  // Drag a pane
  // Measure frame rate
  // Assert > 55fps
});
```

## Error Handling

### localStorage Errors

**Quota Exceeded:**
```typescript
try {
  localStorage.setItem(key, value);
} catch (error) {
  if (error instanceof DOMException && error.code === 22) {
    console.error('localStorage quota exceeded');

    // Attempt cleanup
    clearOldPaneConfigurations();

    // Show user notification
    toast.error('Storage full. Some settings may not persist.');

    // Fall back to session-only
    sessionStorage.setItem(key, value);
  }
}
```

**Corrupted Data:**
```typescript
try {
  const data = JSON.parse(localStorage.getItem(key));
  if (!isValidPaneConfig(data)) {
    throw new Error('Invalid pane configuration');
  }
  return data;
} catch (error) {
  console.error('Failed to load pane config:', error);

  // Reset to defaults
  return DEFAULT_PANE_CONFIGS;
}
```

### Database Errors

**Failed to Load Settings:**
```typescript
const { data, error } = await supabase
  .from('user_pane_settings')
  .select('*')
  .eq('user_id', userId);

if (error) {
  console.error('Failed to load pane settings:', error);

  // Show error toast
  toast.error('Failed to load custom pane settings. Using defaults.');

  // Fall back to localStorage only
  return {};
}
```

**Failed to Save Settings:**
```typescript
const { error } = await supabase
  .from('user_pane_settings')
  .upsert({
    user_id: userId,
    pane_type: type,
    custom_theme: theme,
  });

if (error) {
  console.error('Failed to save pane settings:', error);

  // Show error toast
  toast.error('Failed to save settings. Please try again.');

  // Revert optimistic update
  queryClient.invalidateQueries(['pane-settings', userId]);
}
```

## Security Considerations

### User Data Isolation

**RLS Policies:**
All pane settings enforce user_id matching:
```sql
CREATE POLICY "Users can view own pane settings" ON user_pane_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own pane settings" ON user_pane_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

**Query Safety:**
Always include user_id in queries:
```typescript
// CORRECT
const { data } = await supabase
  .from('user_pane_settings')
  .select('*')
  .eq('user_id', userId);

// INCORRECT - RLS will enforce, but be explicit
const { data } = await supabase
  .from('user_pane_settings')
  .select('*');
```

### localStorage Security

**User-Specific Keys:**
```typescript
const key = `pane-system-state-${userId}`;
```
Prevents cross-user data leakage in shared browser scenarios.

**Data Validation:**
```typescript
function isValidPaneConfig(data: unknown): data is PaneConfig[] {
  if (!Array.isArray(data)) return false;

  return data.every(pane =>
    typeof pane.id === 'string' &&
    typeof pane.type === 'string' &&
    VALID_PANE_TYPES.includes(pane.type)
  );
}
```

### XSS Prevention

**Sanitize Alternate Names:**
```typescript
function sanitizePaneName(name: string): string {
  // Remove HTML tags, script content
  return DOMPurify.sanitize(name, { ALLOWED_TAGS: [] });
}
```

**Use Text Content (not innerHTML):**
```tsx
<h2>{alternateName || defaultName}</h2> {/* Safe */}
```

## Accessibility

### Keyboard Navigation

**Tab Order:**
1. Pane headers (left to right)
2. Minimize/maximize/close buttons
3. Pane content (natural tab order)
4. Scroll buttons

**Keyboard Shortcuts:**
- `ESC`: Exit fullscreen mode
- `Tab`: Navigate between interactive elements
- `Enter`/`Space`: Activate buttons
- (Future) Arrow keys for pane navigation

### ARIA Labels

**Pane Container:**
```tsx
<div
  role="region"
  aria-label={`${alternateName || type} pane`}
  aria-describedby={`pane-desc-${id}`}
>
  <span id={`pane-desc-${id}`} className="sr-only">
    {isMinimized ? 'Minimized' : 'Expanded'}
  </span>
  {/* Content */}
</div>
```

**Interactive Elements:**
```tsx
<button
  aria-label={`Minimize ${alternateName || type} pane`}
  onClick={onToggleMinimize}
>
  <MinimizeIcon />
</button>

<button
  aria-label={`Close ${alternateName || type} pane`}
  onClick={onClose}
>
  <CloseIcon />
</button>
```

### Screen Reader Support

**Live Regions for Updates:**
```tsx
<div
  role="status"
  aria-live="polite"
  className="sr-only"
>
  {statusMessage}
</div>
```

**Announce Pane Changes:**
```typescript
const announceChange = (message: string) => {
  setStatusMessage(message);
  setTimeout(() => setStatusMessage(''), 3000);
};

// When pane added
announceChange(`${type} pane added`);

// When pane removed
announceChange(`${type} pane removed`);
```

### Color Contrast

**Ensure WCAG 2.1 AA Compliance:**
- Text on pane headers: 4.5:1 minimum
- Interactive elements: 3:1 minimum
- Focus indicators: 3:1 minimum

**High Contrast Mode:**
Respect user's high_contrast preference:
```typescript
const headerColor = user.high_contrast
  ? getHighContrastColor(paneColor)
  : paneColor;
```

## Deployment & Monitoring

### Feature Flags

**Gradual Rollout:**
```typescript
const ENABLE_RESIZABLE_PANELS = featureFlags.resizablePanels;
const ENABLE_PANE_GROUPS = featureFlags.paneGroups;

<PaneSystem
  enableResizablePanels={ENABLE_RESIZABLE_PANELS}
  ...
/>
```

### Analytics

**Track Pane Usage:**
```typescript
analytics.track('pane_added', {
  pane_type: type,
  user_id: userId,
  current_pane_count: panes.length,
});

analytics.track('pane_reordered', {
  user_id: userId,
  pane_count: panes.length,
});

analytics.track('pane_minimized', {
  pane_type: type,
  user_id: userId,
});
```

### Error Monitoring

**Sentry Integration:**
```typescript
try {
  // Pane operation
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'pane-system',
      operation: 'add_pane',
    },
    extra: {
      paneType: type,
      currentPaneCount: panes.length,
    },
  });

  // Show user-friendly error
  toast.error('Failed to add pane. Please try again.');
}
```

## Maintenance & Future Work

### Code Quality

**Cognitive Complexity:**
- Target: ≤15 per function
- Current: PaneSystem.tsx main component ~12

**Type Safety:**
- All public APIs fully typed
- No `any` types
- Strict mode enabled

**Testing:**
- Unit test coverage: >80% goal
- Integration tests: Core workflows
- E2E tests: Critical user paths

### Technical Debt

**Known Issues:**
1. Drag-and-drop could use @dnd-kit/core for better accessibility
2. Resize performance could be improved with requestAnimationFrame
3. Mobile pane system needs dedicated design
4. Pane groups/workspaces would benefit from refactor

### Refactoring Opportunities

**Extract Drag-and-Drop:**
Create dedicated hook:
```typescript
function usePaneDragAndDrop(panes, setPanes) {
  // Encapsulate all D&D logic
}
```

**Extract Persistence:**
Create dedicated hook:
```typescript
function usePanePersistence(userId, panes) {
  // Handle localStorage and database sync
}
```

**Extract Rendering:**
Already done with PaneSystemRenderers.tsx, but could go further:
- Separate files for each renderer
- More granular component breakdown

## Conclusion

The Pane System is the foundational UX innovation of EDC. This specification provides the technical details needed to maintain, extend, and troubleshoot the system effectively.

Key principles:
- **Simplicity:** Clear component hierarchy
- **Performance:** Lazy loading, memoization, debouncing
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- **Maintainability:** Well-structured code, comprehensive tests
- **Flexibility:** Multiple rendering modes, extensive customization

---

## References

- [Pane System PRD](../prds/01-pane-system-prd.md)
- [Master PRD](../prds/00-MASTER-PRD.md)
- [Andy Matuschak's Notes on Sliding Panes](https://notes.andymatuschak.org/)
- [react-resizable-panels Documentation](https://github.com/bvaughn/react-resizable-panels)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

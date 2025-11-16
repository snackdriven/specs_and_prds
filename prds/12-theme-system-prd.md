# Theme System - Product Requirements Document

**Feature Area:** Comprehensive Theming & Design System
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Theme System provides comprehensive visual customization through 18+ professionally designed themes, design tokens, and per-pane theme overrides. Designed to support neurodivergent users through cognitive load optimization, visual hierarchy, and personalization.

## Problem Statement

Visual design impacts ADHD users significantly:
- **Sensory overwhelm** - Harsh colors and high contrast cause fatigue
- **Lack of personalization** - One-size-fits-all themes don't work
- **Cognitive load** - Poor visual hierarchy increases mental effort
- **Motivation** - Aesthetics affect engagement and enjoyment
- **Accessibility** - Color blindness, contrast needs vary

## Goals

1. Provide diverse theme options for different preferences and needs
2. Optimize themes for cognitive load reduction
3. Support per-pane theme overrides for visual organization
4. Enable accessibility through high contrast and alternative themes
5. Maintain performance through lazy loading and caching

## User Stories

### Epic: Theme Selection
- As a user, I can choose from 18+ themes
- As a user, I can preview themes before applying
- As a user, I can switch themes anytime
- As a user, I can use system dark/light mode
- As a user, my theme preference persists

### Epic: Per-Pane Theming
- As a user, I can assign custom themes to individual panes
- As a user, I can see pane-specific colors in headers
- As a user, I can reset pane themes to global theme
- As a user, I can visually distinguish panes by color

### Epic: Accessibility Themes
- As a user, I can use high contrast theme
- As a user, I can use themes optimized for color blindness
- As a user, I can adjust contrast levels
- As a user, I can reduce visual noise

### Epic: Theme Customization (Future)
- As a user, I can create custom themes
- As a user, I can share my themes with the community
- As a user, I can import community themes
- As a user, I can edit theme colors

## Functional Requirements

### FR1: Theme Architecture
**Priority:** P0 (Critical)

**Design Token System:**
Located in `/lib/themes/design-tokens.ts`

**Token Categories:**
```typescript
// Color Utilities
export const textColors = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  muted: 'text-muted-foreground/70',
  subtle: 'text-muted-foreground/50',
  accent: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
  inverted: 'text-primary-foreground',
};

export const backgroundColors = {
  page: 'bg-background',
  card: 'bg-card',
  muted: 'bg-muted',
  secondary: 'bg-secondary',
  accent: 'bg-accent',
  primary: 'bg-primary',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  error: 'bg-destructive/10',
  hover: 'hover:bg-accent',
  active: 'bg-accent',
};

export const borderColors = {
  default: 'border-border',
  muted: 'border-border/40',
  input: 'border-input',
  accent: 'border-primary',
  destructive: 'border-destructive',
};

// Spacing (8px base)
export const spacing = {
  xs: '0.5rem',  // 8px
  sm: '1rem',    // 16px
  md: '1.5rem',  // 24px
  lg: '2rem',    // 32px
  xl: '3rem',    // 48px
  '2xl': '4rem', // 64px
};

// Typography
export const typography = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
  tiny: 'text-xs',
  label: 'text-sm font-medium',
};

// Border Radius
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};
```

**CSS Custom Properties:**
Each theme defines CSS variables:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... and 30+ more variables */

  /* Pane-specific colors */
  --pane-calendar: 210 100% 50%;
  --pane-tasks: 280 100% 50%;
  --pane-habits: 150 100% 40%;
  /* ... 16 pane colors */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

### FR2: Theme Registry
**Priority:** P0 (Critical)

**Location:** `/lib/themes/registry.ts`

**Theme Definition:**
```typescript
interface Theme {
  id: string;
  name: string;
  description?: string;
  author?: string;
  cssClass: string; // Applied to <html> or <body>
  paneColors: {
    calendar: string;
    tasks: string;
    habits: string;
    mood: string;
    journal: string;
    countdowns: string;
    concerts: string;
    rss: string;
    settings: string;
    chores: string;
    widgets: string;
    quickLinks: string;
    tags: string;
    dataVisualization: string;
    wedding: string;
    work: string;
  };
  preview?: string; // Screenshot or gradient
  tags?: string[]; // ['dark', 'minimal', 'colorful']
}
```

**Available Themes:**
1. **System** - Follows OS dark/light mode
2. **Autumn** - Warm oranges and browns
3. **Bridge** - Cool blues and grays
4. **Corporate** - Professional navy and gray
5. **Cosmic Nebula** - Purple and pink space theme
6. **Cyberpunk** - Neon and dark backgrounds
7. **Glassmorphism** - Translucent cards and blur effects
8. **High Contrast** - Maximum contrast for accessibility
9. **Kawaii** - Soft pastels and rounded corners
10. **Mint** - Minty greens and fresh colors
11. **MySpace** - Nostalgic early 2000s aesthetic
12. **Mystic Twilight** - Deep purples and indigos
13. **Sunrise** - Warm morning gradients
14. **Sunset Glow** - Evening gradient palette
15. **Terminal** - Monospace and command line aesthetic
16. **Custom Themes** - User-created (future)

**Theme Files:**
Each theme has its own file in `/lib/themes/`:
- `autumn.ts`
- `bridge.ts`
- `corporate.ts`
- etc.

### FR3: Theme Application
**Priority:** P0 (Critical)

**Theme Loading:**
```typescript
// Get current theme
const theme = getCurrentTheme();

// Apply theme CSS class
document.documentElement.className = theme.cssClass;

// Access pane colors
const calendarColor = theme.paneColors.calendar;
```

**Theme Persistence:**
- Stored in `profiles` table or localStorage
- Loaded on app init
- Applied before first render

**Theme Switching:**
- Immediate application
- Smooth transition (CSS transitions)
- No page reload required

### FR4: Per-Pane Theme Overrides
**Priority:** P1 (High)

**Storage:**
- `user_pane_settings` table
- `custom_theme` field per pane type

**Application:**
```typescript
function getPaneTheme(paneType: PaneType, userPaneSettings): Theme {
  const customTheme = userPaneSettings[paneType]?.custom_theme;

  if (customTheme) {
    return getThemeByName(customTheme);
  }

  return getCurrentTheme(); // Fall back to global
}
```

**UI:**
- Pane settings dropdown
- Theme preview
- Reset to global option

**Use Case:**
User might use dark theme globally but light theme for calendar pane for better visibility

### FR5: ADHD-Optimized Design Principles
**Priority:** P0 (Critical)

**Cognitive Load Optimization:**
1. **Visual Hierarchy:** Clear information architecture
2. **Spacing:** Generous whitespace (8px base)
3. **Color Contrast:** WCAG 2.1 AA minimum
4. **Reduced Clutter:** Progressive disclosure
5. **Consistent Patterns:** Predictable UI elements

**Color Considerations:**
- Avoid pure red (aggressive, anxiety-inducing)
- Use blue for primary actions (calming, trustworthy)
- Limit color palette (3-5 main colors)
- Consistent meaning (red=delete, green=success)

**Typography:**
- Readable font sizes (16px base minimum)
- Clear font hierarchy
- Generous line height (1.5-1.7)
- Dyslexia-friendly options (Open Dyslexic)

**Animation:**
- Subtle, purposeful animations
- Respect reduced motion preference
- Celebrate wins (confetti, but optional)
- Smooth transitions (150-300ms)

### FR6: Accessibility Compliance
**Priority:** P0 (Critical)

**WCAG 2.1 Standards:**
- **Level AA:** Minimum for all themes
- **Level AAA:** High contrast theme

**Color Contrast:**
- Text: 4.5:1 ratio minimum
- Large text (18px+): 3:1 ratio minimum
- Interactive elements: 3:1 ratio minimum
- Focus indicators: 3:1 ratio minimum

**High Contrast Theme:**
- Maximum contrast ratios
- Black on white (or vice versa)
- Clear borders and outlines
- No subtle grays

**Color Blindness Support:**
- Don't rely on color alone
- Use patterns, icons, labels
- Test with color blindness simulators
- Alternative themes for specific types (future)

### FR7: Performance Optimization
**Priority:** P1 (High)

**Lazy Loading:**
- Theme files loaded on-demand
- Only active theme loaded
- Preload on hover (theme switcher)

**Caching:**
- Theme CSS cached in browser
- localStorage for theme preference
- Service worker caching (PWA)

**CSS Optimization:**
- Critical CSS inlined
- Non-critical CSS deferred
- Minimal unused styles
- CSS custom properties for dynamic values

**Measurement:**
- Theme switch < 100ms
- First paint with theme < 500ms
- No layout shift on theme change

### FR8: Modal-Aware Theme Detection
**Priority:** P2 (Medium)

**Context-Aware Theming:**
Some themes need to know rendering context:
```typescript
function getThemeContext(): 'modal' | 'page' | 'pane' {
  // Detect if rendering in modal
  // Adjust theme properties accordingly
}
```

**Use Case:**
Glassmorphism theme needs different backdrop blur in modals vs pages

### FR9: Theme Preview
**Priority:** P2 (Medium)

**Preview Interface:**
- Thumbnail of each theme
- Hover to see full preview
- Click to apply immediately
- Side-by-side comparison (future)

**Preview Implementation:**
- Screenshot of app with theme applied
- Or live preview in iframe
- Shows representative UI elements

### FR10: Custom Theme Creation (Future)
**Priority:** P3 (Low)

**Theme Builder:**
- Color picker for each design token
- Live preview as you edit
- Save to personal themes
- Share with community

**Validation:**
- Check color contrast
- Warn if accessibility issues
- Suggest improvements

**Community Themes:**
- Browse user-created themes
- Import themes by ID or URL
- Rate and review themes

## Theme File Structure

```
lib/themes/
├── index.ts                  # Main export
├── design-tokens.ts          # Design token utilities
├── registry.ts               # Theme registry
├── autumn.ts                 # Theme: Autumn
├── bridge.ts                 # Theme: Bridge
├── corporate.ts              # Theme: Corporate
├── cosmic-nebula.ts          # Theme: Cosmic Nebula
├── cyberpunk.ts              # Theme: Cyberpunk
├── glassmorphism.ts          # Theme: Glassmorphism
├── high-contrast.ts          # Theme: High Contrast
├── kawaii.ts                 # Theme: Kawaii
├── mint.ts                   # Theme: Mint
├── myspace.ts                # Theme: MySpace
├── mystic-twilight.ts        # Theme: Mystic Twilight
├── sunrise.ts                # Theme: Sunrise
├── sunset-glow.ts            # Theme: Sunset Glow
├── terminal.ts               # Theme: Terminal
├── custom-themes.ts          # User custom themes
├── system/                   # System light/dark
├── custom/                   # Custom theme builder
└── integrations/             # Integration-specific themes
```

## Components

**Theme Selection:**
- Settings page theme dropdown
- Theme preview cards
- Quick theme switcher (future)

**Theme Provider:**
- React context for current theme
- Theme utilities
- Pane theme resolution

## Hooks

**useTheme:**
```typescript
function useTheme() {
  const currentTheme = getCurrentTheme();
  const setTheme = (themeId: string) => { /* ... */ };
  const getPaneColor = (paneType: PaneType) => { /* ... */ };

  return { currentTheme, setTheme, getPaneColor };
}
```

## Success Metrics

### Usage Metrics
- Theme distribution (which themes most popular)
- Theme switching frequency
- Per-pane theme override adoption
- Default theme retention rate

### Accessibility Metrics
- High contrast theme usage
- Color contrast issues reported
- Accessibility preference correlation

### Performance Metrics
- Theme load time
- Theme switch time
- CSS bundle size per theme

## Future Enhancements

### v1.1
- Custom theme builder
- Theme import/export
- Community theme marketplace
- Scheduled theme switching (auto-dark at night)

### v1.2
- AI theme generator from photo
- Adaptive themes (change based on time/context)
- Theme A/B testing
- Advanced color blindness modes

### v2.0
- Brand themes for organizations
- Theme API for third-party integrations
- Animated themes
- 3D/WebGL themes

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Pane System PRD](./01-pane-system-prd.md) - Per-pane theming
- [Settings PRD](./11-settings-integrations-prd.md) - Theme selection UI

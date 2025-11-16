# PRD: Advanced Theme System

## Product Overview

The Theme System provides a comprehensive, performance-optimized theming architecture with 15+ custom themes designed for accessibility and cognitive load reduction. It features modal-aware theme detection, per-pane theme customization, and ADHD-friendly color schemes.

## Problem Statement

Users with ADHD and neurodivergent traits need:
- **Reduced Visual Noise**: Clean, minimal designs that don't overwhelm
- **Cognitive Load Optimization**: Color schemes that support focus
- **Personalization**: Visual customization for comfort and preference
- **Accessibility**: High contrast, color-blind friendly options
- **Context Switching**: Different themes for different panes/contexts

Traditional themes are:
- **Generic**: Not designed for ADHD/executive dysfunction
- **Performance-Heavy**: Cause lag when switching
- **Limited**: One theme for entire app
- **Accessibility-Poor**: Don't meet WCAG standards

## Core Features

### 1. Theme Library

**User Stories**:
- As a user, I want to choose from 15+ professionally designed themes
- As a user, I want themes optimized for different times of day
- As a user, I want themes designed for focus vs. creativity

**Available Themes** (from `lib/themes/README.md`):

**Light Themes**:
- **arctic-white**: Ultra-minimal, high contrast
- **beige-comfort**: Warm, easy on eyes
- **soft-lavender**: Calming purple tones
- **mint-fresh**: Energizing green
- **sky-blue**: Peaceful blue
- **warm-cream**: Cozy neutral
- **paper-white**: Classic paper-like

**Dark Themes**:
- **dark-slate**: Professional dark mode
- **dark-emerald**: Rich green dark
- **dark-ocean**: Deep blue dark
- **midnight-purple**: Purple-tinted dark
- **charcoal**: Pure dark gray
- **coffee-brown**: Warm brown dark

**Special Themes**:
- **high-contrast**: WCAG AAA compliance
- **forest-zen**: Nature-inspired calm
- **sunset-glow**: Warm gradient theme

### 2. Theme Components

**User Stories**:
- As a developer, I want consistent theme structure
- As a developer, I want type-safe theme definitions
- As a developer, I want theme utilities

**Theme Structure**:
```typescript
interface UnifiedPaneTheme {
  // Core colors
  background: string          // Main background
  foreground: string          // Text color
  card: string                // Card backgrounds
  cardForeground: string      // Card text
  border: string              // Borders

  // Interactive elements
  primary: string             // Primary actions
  primaryForeground: string   // Primary text
  secondary: string           // Secondary actions
  accent: string              // Accents/highlights

  // Status colors
  success: string             // Success states
  warning: string             // Warning states
  error: string               // Error states
  info: string                // Info states

  // Muted colors
  muted: string               // Muted backgrounds
  mutedForeground: string     // Muted text

  // Specialized
  input: string               // Form inputs
  ring: string                // Focus rings
  scrollbar: string           // Scrollbar colors

  // Metadata
  name: string                // Theme name
  isDark: boolean             // Dark mode flag
}
```

### 3. Theme Application

**User Stories**:
- As a user, I want to change the entire app theme
- As a user, I want different themes for different panes
- As a user, I want theme changes to be instant

**Scope Levels**:
```
Workspace Theme (global default)
  ↓
Pane Theme (per-pane override)
  ↓
Component Theme (component-specific override)
```

**Technical Implementation**:
- Context: `ThemeProvider` wraps entire app
- Database: `profiles.accent_color` (legacy) + `user_pane_settings.custom_theme`
- CSS Variables: Theme applied via CSS custom properties
- React Context: Theme object available to all components

### 4. Modal-Aware Theme Detection

**User Stories**:
- As a user, when a modal opens, I want it to match the theme
- As a user, I want modals to use appropriate pane theme

**Technical Implementation**:
- File: `lib/themes/modal-theme-detector.ts`
- Algorithm: Detect which pane triggered modal, use that theme
- Fallback: Use workspace theme if no pane context
- Optimization: Memoized theme resolution

### 5. Theme Persistence

**User Stories**:
- As a user, I want my theme choice to persist across sessions
- As a user, I want per-pane themes to persist
- As a user, I want theme sync across devices

**Storage**:
- Workspace Theme: `profiles.accent_color` (mapped to theme name)
- Pane Themes: `user_pane_settings.custom_theme`
- Local Cache: `localStorage` for instant load
- Database: Source of truth, synced on login

### 6. Performance Optimization

**User Stories**:
- As a user, I want instant theme switching
- As a user, I want no lag when changing themes
- As a user, I want smooth transitions

**Optimizations** (from `README-OPTIMIZATIONS.md`):

**Lazy Loading**:
- Theme files loaded only when selected
- Dynamic imports for theme modules
- Preload popular themes on app start

**Caching**:
- LRU cache for recently used themes
- Memoized theme computations
- CSS variable caching

**Transitions**:
- CSS transitions for smooth color changes
- No layout shifts during theme change
- Optimized repaint/reflow

**Code Splitting**:
- Theme utilities separated from theme data
- Common theme functions in shared module
- Unused themes tree-shaken in production

### 7. Accessibility Features

**User Stories**:
- As a user with color blindness, I want accessible themes
- As a user with low vision, I want high contrast themes
- As a user with photosensitivity, I want reduced brightness options

**Accessibility Compliance**:
- **WCAG AA**: All themes meet minimum 4.5:1 contrast ratio
- **WCAG AAA**: "high-contrast" theme meets 7:1 ratio
- **Color-Blind Friendly**: Themes tested with color-blind simulators
- **Reduced Motion**: Respect `prefers-reduced-motion` media query

**High Contrast Mode**:
- Profile setting: `profiles.high_contrast`
- When enabled: Force high-contrast theme
- Increased border weights
- Stronger color distinctions

### 8. Theme Customization UI

**User Stories**:
- As a user, I want to preview themes before applying
- As a user, I want a visual theme picker
- As a user, I want to see theme applied in real-time

**Theme Picker Components**:
- **Global Theme Picker**: In settings pane
- **Pane Theme Picker**: In pane header menu
- **Theme Preview**: Show sample UI with theme applied
- **Theme Swatches**: Color palette display

### 9. Theme Utilities

**Developer Features**:
- `getThemeByName(name)`: Load theme by name
- `getDefaultTheme()`: Get default theme
- `isDarkTheme(theme)`: Check if dark mode
- `applyTheme(theme)`: Apply theme to DOM
- `getContrastRatio(color1, color2)`: Calculate contrast
- `generateThemeVariables(theme)`: CSS variable generation

### 10. Theme-Aware Components

**User Stories**:
- As a developer, I want components to adapt to theme automatically
- As a developer, I want theme-aware styling utilities

**Theme Integration**:
- Scroll areas use theme scrollbar colors
- Buttons use theme primary colors
- Cards use theme card backgrounds
- Borders use theme border colors
- Focus rings use theme ring colors

## Technical Architecture

### File Structure
```
lib/themes/
├── index.ts                        // Main exports
├── theme-types.ts                  // TypeScript definitions
├── unified-themes.ts               // Theme objects
├── unified-theme-utils.ts          // Utility functions
├── modal-theme-detector.ts         // Modal theme logic
├── README.md                       // Documentation
└── README-OPTIMIZATIONS.md         // Performance docs

components/panes/themes/
├── pane-theme-context.tsx          // Theme context provider
├── use-pane-theme.ts               // Theme hook
└── theme-picker.tsx                // Theme picker UI
```

### Theme Loading Flow
```
1. App loads → ThemeProvider initializes
2. Fetch user profile → Get accent_color
3. Map accent_color to theme name → Load theme
4. Apply theme to CSS variables → DOM updates
5. User changes theme → Update profile
6. Re-apply theme → CSS variables update
7. Components re-render with new theme colors
```

### CSS Variable System
```css
:root {
  /* Applied from theme object */
  --background: theme.background;
  --foreground: theme.foreground;
  --primary: theme.primary;
  /* ...all theme colors */
}

/* Components reference variables */
.button {
  background-color: var(--primary);
  color: var(--primary-foreground);
}
```

## ADHD-Friendly Design Principles

### 1. Cognitive Load Colors
- Muted backgrounds reduce visual noise
- High contrast for important elements
- Low contrast for secondary information
- Strategic use of color for focus

### 2. Reduced Stimulation
- Soft color palettes (beige-comfort, warm-cream)
- No harsh pure white backgrounds
- Gentle transitions, not jarring changes

### 3. Focus Support
- "Forest-zen" theme for deep work
- "Arctic-white" for clarity and focus
- "Midnight-purple" for nighttime focus

### 4. Personalization
- 15+ options for individual preferences
- Per-pane themes for context switching
- Easy theme switching without commitment

## Performance Benchmarks

From optimization work:
- **Theme Switch Time**: <50ms (instant)
- **Initial Load**: <100ms (with caching)
- **Memory Footprint**: <5KB per theme
- **CPU Usage**: <1% during theme change
- **Bundle Size**: 30KB total (all themes), 2KB per theme

## Future Enhancements

1. **Custom Theme Builder**: User-created themes
2. **Theme Marketplace**: Share/download community themes
3. **AI Theme Generator**: Generate themes from image/palette
4. **Automatic Theme Switching**: Switch based on time of day
5. **Focus Mode Themes**: Ultra-minimal themes for deep work
6. **Gradient Themes**: Multi-color gradient backgrounds
7. **Animated Themes**: Subtle animations in backgrounds
8. **Seasonal Themes**: Themes that change with seasons
9. **Mood-Based Themes**: Switch themes based on logged mood
10. **Color-Blind Themes**: Specialized themes for color vision deficiencies

## Success Criteria

1. ✅ 15+ themes available
2. ✅ Workspace-level theme switching functional
3. ✅ Per-pane theme customization working
4. ✅ Theme persistence across sessions
5. ✅ Performance: <50ms theme switch time
6. ✅ Accessibility: All themes meet WCAG AA
7. ✅ High contrast mode functional
8. ✅ Modal-aware theme detection working
9. ✅ Theme preview in picker
10. ✅ Smooth transitions between themes

## References

- Directory: `lib/themes/`
- File: `lib/themes/unified-themes.ts` (theme definitions)
- File: `lib/themes/unified-theme-utils.ts` (utilities)
- File: `lib/themes/modal-theme-detector.ts` (modal theming)
- File: `components/panes/themes/pane-theme-context.tsx`
- README: `lib/themes/README.md`
- Optimization Doc: `components/panes/themes/README-OPTIMIZATIONS.md`
- Schema: `profiles.accent_color`, `user_pane_settings.custom_theme`

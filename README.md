# Executive Dysfunction Center - Product Requirements Documents

This directory contains comprehensive Product Requirements Documents (PRDs) for all major features in the Executive Dysfunction Center (EDC) application.

## Overview

EDC is a specialized ADHD/executive dysfunction management application built with React 18 + TypeScript, using Supabase for backend services. It features a unique multi-pane workspace system designed specifically for neurodivergent users.

## PRD Index

### Core Feature PRDs

1. **[Task Management System](./01-task-management.md)**
   - Comprehensive task tracking with dependencies
   - Recurring tasks with auto-generation
   - Impact analysis and critical path calculation
   - Subtasks and parent-child hierarchies
   - Multiple views (list, Kanban, focus flow)
   - Smart filtering and saved filters
   - Calendar integration

2. **[Habit Tracking System](./02-habit-tracking.md)**
   - Daily/weekly/custom frequency habits
   - Streak tracking and analytics
   - One-click completion logging
   - Mood-habit correlation analysis
   - Energy level tracking
   - Calendar reminder integration

3. **[Calendar Integration System](./03-calendar-integration.md)**
   - 8 different calendar view modes
   - Bi-directional Google Calendar sync
   - Drag-and-drop event rescheduling
   - Task-calendar auto-sync
   - Import/export (.ics, CSV, PDF)
   - Multi-calendar support

4. **[Mood Logging & Insights](./04-mood-logging.md)**
   - Quick one-tap mood logging
   - Custom mood scales (1-10)
   - Energy and stress level tracking
   - Mood trend visualization
   - Habit-mood correlation analytics
   - Context tagging

5. **[Journal with Templates](./05-journal.md)**
   - Freeform journaling with rich text
   - Customizable writing templates
   - Public template sharing
   - Mood context snapshot
   - Writing prompts and personality picker
   - Full-text search and tag organization

6. **[Countdowns & Event Tracking](./06-countdowns.md)**
   - Visual countdown timers
   - Automatic urgency calculation (normal, soon, urgent, critical)
   - Color-coded display
   - Integration with tasks/concerts/calendar
   - Time remaining in multiple formats

7. **[Concert Tracking & Discovery](./07-concerts.md)**
   - Multi-status workflow tracking
   - Venue management with drive times
   - Card and table view modes
   - Supporting acts and notes
   - Calendar and countdown integration
   - Status filtering

8. **[RSS Feed Reader](./08-rss-feeds.md)**
   - Google Reader-style interface
   - Multiple view modes (all, unread, starred, category)
   - List types (expanded, list, magazine)
   - Auto-mark as read options
   - Category organization
   - Star/archive functionality

9. **[Chores & Maintenance Tracking](./09-chores-maintenance.md)**
   - Recurring maintenance tasks
   - Target interval-based scheduling
   - Status calculation (on-track, upcoming, overdue)
   - Automatic task generation from overdue chores
   - Category organization
   - Completion logging with notes

### Architecture PRDs

10. **[Multi-Pane Workspace System](./10-pane-system.md)**
    - 15+ pane types for different features
    - Drag-and-drop pane positioning
    - Resizable panes with constraints
    - Per-pane theme customization
    - Visibility controls (minimize, maximize, collapse)
    - Responsive layouts (mobile, tablet, desktop)
    - Pane settings persistence
    - Content registry system

11. **[Advanced Theme System](./11-theme-system.md)**
    - 15+ professionally designed themes
    - Light, dark, and high-contrast modes
    - Per-pane theme customization
    - Modal-aware theme detection
    - Performance-optimized (lazy loading, caching)
    - WCAG AA/AAA accessibility compliance
    - Smooth theme transitions
    - Theme persistence across sessions

## Feature Comparison Matrix

| Feature | Real-time Sync | Google Integration | Offline Support | Mobile Optimized | ADHD-Optimized |
|---------|----------------|-------------------|-----------------|------------------|----------------|
| Tasks | ✅ | ✅ (Calendar) | ❌ | ✅ | ✅ |
| Habits | ✅ | ❌ | ❌ | ✅ | ✅ |
| Calendar | ✅ | ✅ (Full Sync) | ❌ | ✅ | ✅ |
| Mood | ✅ | ❌ | ❌ | ✅ | ✅ |
| Journal | ✅ | ❌ | ❌ | ✅ | ✅ |
| Countdowns | ✅ | ❌ | ❌ | ✅ | ✅ |
| Concerts | ✅ | ❌ | ❌ | ✅ | ✅ |
| RSS | ✅ | ❌ | ❌ | ✅ | ✅ |
| Chores | ✅ | ❌ | ❌ | ✅ | ✅ |
| Pane System | ✅ | ❌ | ❌ | ✅ | ✅ |
| Theme System | ✅ | ❌ | ✅ | ✅ | ✅ |

## ADHD-First Design Principles

All features in EDC follow these core design principles:

### 1. Progressive Disclosure
- Collapsible sections to reduce cognitive overhead
- Show essential information first, details on demand
- Minimize visual clutter

### 2. Contextual Loading
- Specific loading states ("Loading tasks...") vs generic spinners
- Progress indicators for long operations
- Immediate feedback for user actions

### 3. Visual Hierarchy
- Strategic use of spacing and typography
- Color coding for quick identification
- Size and position convey importance

### 4. Dopamine Triggers
- Celebration animations on completion
- Streak tracking and progress visualization
- Positive reinforcement ("All caught up!")
- Achievement milestones

### 5. Reduce Decision Fatigue
- Smart defaults for all settings
- Saved filters and templates
- One-click actions where possible
- Guided workflows for complex tasks

### 6. Time Blindness Mitigation
- Visual countdowns and timers
- Color-coded urgency levels
- Multiple time representations (days, hours, percentages)
- Calendar integration for all time-based features

### 7. Memory Support
- Real-time sync across devices
- Undo/redo for critical operations
- Auto-save for all content
- Visual history and audit trails

## Technical Stack

### Frontend
- **Framework**: React 18 + TypeScript 5.9
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Zustand + TanStack Query (React Query)
- **Animations**: Framer Motion
- **Drag-and-Drop**: @dnd-kit
- **Charts**: Recharts + D3

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Google OAuth
- **Real-time**: Supabase subscriptions
- **Row Level Security**: Per-user data isolation

### External Integrations
- **Google Calendar API**: Bi-directional calendar sync
- **Google Sheets API**: Data export
- **Spotify API**: Now playing widget
- **RSS Parsers**: Feed aggregation

### Development Tools
- **Linting**: Biome (strict TypeScript rules)
- **Testing**: Playwright (E2E tests)
- **Build**: Vite (fast HMR)
- **Package Manager**: npm

## Development Guidelines

When working with these PRDs:

1. **Reference**: Always reference the relevant PRD before implementing features
2. **Updates**: Keep PRDs updated as features evolve
3. **Cross-References**: Link related PRDs for feature dependencies
4. **User Stories**: Base implementation on user stories in PRDs
5. **Success Criteria**: Verify all success criteria before marking features complete

## PRD Structure

Each PRD follows a consistent structure:

- **Product Overview**: High-level feature description
- **Problem Statement**: User pain points addressed
- **Target Users**: Primary, secondary, tertiary users
- **Goals & Success Metrics**: Measurable outcomes
- **Core Features**: Detailed feature breakdowns with user stories
- **User Workflows**: Step-by-step usage scenarios
- **Technical Architecture**: Database schema, components, hooks
- **ADHD-Friendly Design**: Specific neurodivergent-friendly patterns
- **Performance Considerations**: Optimization strategies
- **Future Enhancements**: Roadmap items
- **Success Criteria**: Launch requirements
- **References**: File paths and documentation links

## Contributing

When creating new PRDs:

1. Follow the existing structure
2. Include concrete user stories for all features
3. Document ADHD-friendly design considerations
4. Specify technical implementation details
5. Define measurable success criteria
6. Link to actual code files and schema

## Related Documentation

- **Architecture**: `docs/archive/megaprompt.md` - Institutional knowledge
- **Development**: `docs/guides/DEVELOPMENT_GUIDELINES.md` - Coding standards
- **Database**: `supabase/schema.sql` - Complete schema
- **Components**: Feature-specific READMEs in component directories
- **Themes**: `lib/themes/README.md` - Theme system documentation

## Questions or Feedback?

For questions about specific features, refer to:
- The relevant PRD in this directory
- Component-specific README files
- The main project README: `/home/user/dreamy-ping/README.md`
- CLAUDE.md instructions: `/home/user/dreamy-ping/CLAUDE.md`

---

**Last Updated**: 2025-01-22
**Version**: 1.0.0
**Status**: Complete ✅

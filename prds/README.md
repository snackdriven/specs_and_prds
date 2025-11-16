# Daybeam Product Requirements Documents (PRDs)

## Overview

This directory contains comprehensive Product Requirements Documents (PRDs) for all major features and systems within the Daybeam application. Daybeam is a personal productivity and wellness platform that integrates task management, habit tracking, mood monitoring, journaling, and countdown tracking into one cohesive experience.

## Purpose

These PRDs serve multiple purposes:
1. **Product Documentation:** Detailed specifications for each feature area
2. **Development Guide:** Technical requirements and implementation details
3. **Design Reference:** UX flows, visual design, and interaction patterns
4. **Strategic Planning:** Goals, success metrics, and future enhancements
5. **Stakeholder Communication:** Clear articulation of product vision and scope

## Document Structure

Each PRD follows a consistent structure:
- **Overview:** Feature summary and metadata
- **Executive Summary:** High-level feature description
- **Problem Statement:** User pain points addressed
- **Goals & Success Metrics:** Objectives and KPIs
- **User Personas:** Target user profiles
- **Functional Requirements:** Detailed feature specifications
- **Non-Functional Requirements:** Performance, security, scalability
- **User Experience:** Information architecture, user flows, visual design
- **Technical Specifications:** Data models, APIs, implementation details
- **Dependencies:** Internal and external dependencies
- **Risks & Mitigations:** Potential issues and solutions
- **Future Enhancements:** Roadmap and out-of-scope features
- **Open Questions:** Unresolved decisions
- **Appendix:** Supporting materials and references

---

## Core Feature PRDs

### 1. [Dashboard (Today View)](./01-dashboard-today-view.md)

**Status:** Implemented | **Priority:** P0 (Critical)

The central hub of Daybeam, providing users with a real-time overview of their daily productivity, wellness, and upcoming commitments.

**Key Features:**
- Summary cards (Tasks, Habits, Moods, Countdowns)
- Quick capture interfaces (Mood, Journal)
- Today's task list
- Real-time data aggregation

**Success Metrics:**
- Daily active usage rate
- Quick capture usage rate
- Page load time < 2 seconds

---

### 2. [Tasks Management](./02-tasks-management.md)

**Status:** Implemented | **Priority:** P0 (Critical)

Comprehensive task management system enabling users to create, organize, track, and complete tasks across different contexts and priorities.

**Key Features:**
- Task creation with rich metadata (due dates, priorities, descriptions)
- Status management (todo, in progress, completed, snoozed)
- Priority levels (low, medium, high, urgent)
- Filtering, sorting, and search
- Space and tag organization

**Success Metrics:**
- Task completion rate
- Daily active tasks per user
- Time to complete task

---

### 3. [Habits Tracking](./03-habits-tracking.md)

**Status:** Implemented | **Priority:** P0 (Critical)

Powerful habit tracking system supporting daily, weekly, and monthly habits with streak motivation and insightful analytics.

**Key Features:**
- Flexible habit frequencies (daily, weekly, monthly)
- Target-based completion tracking
- Streak calculations (current, best, at-risk)
- Habit entries with notes
- Calendar heatmap visualization
- Completion rate analytics

**Success Metrics:**
- Habit completion rate
- Active streaks average
- Habit retention after 30 days
- 66+ day habit success rate

---

### 4. [Mood Tracking](./04-mood-tracking.md)

**Status:** Implemented | **Priority:** P0 (Critical)

Emotional wellbeing monitoring through simple mood logging (1-10 scale) with context, triggers, and trend analysis.

**Key Features:**
- Quick mood capture (1-10 scale)
- Optional context notes and triggers
- Mood tagging system
- Trend analysis (7-day, 30-day)
- Tag correlations (mood boosters/drainers)
- Mood charts and statistics

**Success Metrics:**
- Logging frequency (entries per day)
- Consistency (% of days with entries)
- Entry richness (% with context)
- Trend detection usage

---

### 5. [Journal Entries](./05-journal-entries.md)

**Status:** Implemented | **Priority:** P1 (High)

Digital journaling platform supporting both structured (template-based) and unstructured journaling with rich text, privacy controls, and organization.

**Key Features:**
- Rich text editor with formatting
- Journal templates (Daily Reflection, Gratitude, Weekly Review, etc.)
- Privacy settings (private/public)
- Full-text search
- Space and tag organization
- Writing statistics and streaks

**Success Metrics:**
- Journal frequency (entries per week)
- Entry retention after 30 days
- Average word count
- Template usage rate
- Search usage rate

---

### 6. [Countdowns](./06-countdowns.md)

**Status:** Implemented | **Priority:** P1 (High)

Track important future dates and events with visual countdown timers showing days remaining.

**Key Features:**
- Countdown creation with event dates
- Color and icon customization
- Days remaining calculation
- Urgency indicators (≤ 3 days)
- Past event handling
- Dashboard integration (urgent countdowns)

**Success Metrics:**
- Active countdowns per user
- Countdown completion rate
- Urgency response (tasks created for urgent countdowns)
- Average lead time (creation to event)

---

### 7. [Analytics View](./07-analytics-view.md)

**Status:** Implemented | **Priority:** P1 (High)

Comprehensive data visualization and insights across all tracked metrics, transforming raw data into actionable intelligence.

**Key Features:**
- Overview summary statistics
- Task completion analytics
- Habit performance metrics
- Mood trends and correlations
- Journal writing statistics
- Cross-metric correlations
- Automated insights generation
- Data export (CSV, PDF)

**Success Metrics:**
- Analytics engagement (% viewing weekly)
- Session duration on Analytics
- Insight discovery rate
- Behavior change from insights
- Export usage rate

---

## Organizational System PRDs

### 8. [Spaces System](./08-spaces-system.md)

**Status:** Implemented | **Priority:** P0 (Critical)

Organizational framework to categorize and segment items across different life contexts (Work, Personal, Health, etc.).

**Key Features:**
- Space creation with colors and icons
- Space assignment to tasks, habits, journals, countdowns
- Space-based filtering
- Space-specific views and analytics
- Space templates

**Success Metrics:**
- Space adoption rate
- Space usage (% of items assigned)
- Multi-space users
- Filter engagement
- Average spaces per user (target: 3-5)

---

### 9. [Tags System](./09-tags-system.md)

**Status:** Implemented | **Priority:** P0 (Critical)

Flexible, cross-cutting categorization layer enabling multi-dimensional organization and powerful pattern discovery.

**Key Features:**
- Tag creation with colors
- Multi-tag assignment to items
- Tag autocomplete and suggestions
- Tag-based filtering (single and multi-tag)
- Tag correlations (especially mood-tag)
- Tag merge and cleanup tools
- Tag analytics

**Success Metrics:**
- Tag adoption rate
- Tag usage (% of items with tags)
- Multi-tag items
- Tag filtering frequency
- Tag-mood correlation discovery

---

## Technology Stack

### Frontend
- **Framework:** React 19.1.1 with TypeScript 5.9.2
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.8.2
- **State Management:** TanStack React Query 5.86.0
- **UI Components:** Radix UI
- **Styling:** Tailwind CSS 4.1.12
- **Icons:** Lucide React 0.484.0
- **Date Utilities:** date-fns 4.1.0

### Backend
- **Framework:** Encore.dev (TypeScript)
- **Language:** TypeScript 5.9.2
- **Database:** PostgreSQL (Encore managed)
- **API Style:** RESTful with Encore decorators

### Infrastructure
- **Package Manager:** Bun
- **Deployment:** Encore Cloud Platform
- **CI/CD:** GitHub integration

---

## Product Principles

### 1. Frictionless Capture
Every feature prioritizes quick, easy data entry:
- Quick mood capture: < 5 seconds
- Quick task creation: < 10 seconds
- Quick habit logging: < 5 seconds

### 2. Meaningful Insights
Raw data is transformed into actionable intelligence:
- Automated pattern detection
- Correlation analysis
- Trend visualization
- Personalized recommendations

### 3. Flexible Organization
Multiple organizational paradigms coexist:
- Spaces for broad contexts
- Tags for attributes and themes
- No forced hierarchies
- User-driven structure

### 4. Compassionate Design
Especially for mental health features:
- Non-judgmental language
- Celebration over criticism
- Privacy and security
- Emotional safety

### 5. Visual Clarity
Information is easy to understand at a glance:
- Color-coded indicators
- Visual progress bars
- Intuitive icons
- Consistent design language

### 6. Performance First
Speed and responsiveness are non-negotiable:
- Sub-second page loads
- Optimistic UI updates
- Smooth animations (60fps)
- Efficient data queries

---

## User Journey

### New User Onboarding
1. **Welcome & Setup** → Create account, basic preferences
2. **Space Creation** → Set up Work and Personal spaces
3. **First Task** → Create and complete first task
4. **Habit Introduction** → Set up first daily habit
5. **Mood Logging** → Log first mood entry
6. **Dashboard Discovery** → See all features come together

### Daily Flow
1. **Morning Check-In**
   - Open Dashboard
   - Review today's tasks, habits, urgent countdowns
   - Log morning mood
   - Plan day priorities

2. **Throughout Day**
   - Complete tasks
   - Log habit completions
   - Quick journal entries
   - Mood check-ins

3. **Evening Reflection**
   - Mark remaining tasks as complete or snoozed
   - Log final mood
   - Evening journal entry
   - Review tomorrow's commitments

### Weekly Review
1. Navigate to Analytics view
2. Review 7-day trends (tasks, habits, mood)
3. Identify patterns and correlations
4. Adjust habits or priorities based on insights
5. Plan upcoming week

---

## Data Model Overview

### Core Entities
- **Users:** Authentication and profile
- **Tasks:** Todo items with metadata
- **Habits:** Recurring behaviors to track
- **Habit Entries:** Daily/periodic completion logs
- **Moods:** Emotional state entries (1-10)
- **Journal Entries:** Free-form or templated writing
- **Countdowns:** Future event tracking
- **Spaces:** Organizational contexts
- **Tags:** Cross-cutting labels

### Relationships
- **One-to-Many:** User → Tasks, Habits, Moods, Journals, Countdowns, Spaces, Tags
- **Many-to-Many:** Tasks ↔ Tags, Habits ↔ Tags, Moods ↔ Tags, Journals ↔ Tags
- **One-to-Optional-One:** Task → Space, Habit → Space, Journal → Space, Countdown → Space

---

## Roadmap

### Current: Version 1.0 (Implemented)
✅ All 9 core features implemented
✅ Dashboard, Tasks, Habits, Moods, Journal, Countdowns
✅ Analytics, Spaces, Tags

### Next: Version 1.1 (Planned)
- Notifications and reminders
- Mobile responsive optimizations
- Accessibility improvements (WCAG 2.1 AA)
- Performance optimizations

### Future: Version 2.0 (Vision)
- Recurring tasks and habits
- Subtasks and task dependencies
- Advanced analytics with AI insights
- Collaboration features (shared spaces, tasks)
- Calendar integration
- Third-party app integrations

### Long-term: Version 3.0+ (Aspirational)
- Mobile native apps (iOS, Android)
- Voice-activated features
- Wearable device integration
- Social and community features
- Public API for developers
- AI-powered coaching and recommendations

---

## Success Metrics (Product-Wide)

### Engagement
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Monthly Active Users (MAU)
- DAU/MAU ratio (stickiness)
- Average session duration
- Sessions per user per day

### Retention
- Day 1, 7, 30 retention rates
- Churn rate
- Feature adoption rates
- Multi-feature users (using 3+ features)

### Quality
- Task completion rate
- Habit consistency (streak lengths)
- Mood logging frequency
- Journal entry count
- Data entry richness (descriptions, tags, etc.)

### Satisfaction
- Net Promoter Score (NPS)
- Feature satisfaction ratings
- Support ticket volume
- User testimonials and reviews

---

## Contributing to PRDs

### When to Update PRDs
- Feature scope changes
- New requirements discovered
- Technical constraints identified
- User feedback incorporated
- Metrics or goals adjusted

### Update Process
1. Identify sections needing changes
2. Draft updates in separate document or branch
3. Review with product team
4. Update PRD with change log
5. Communicate changes to stakeholders

### Change Log Format
```
## Change Log
- **2025-11-15:** Initial PRD creation
- **YYYY-MM-DD:** [Description of change]
```

---

## Related Documentation

- **[DEVELOPMENT.md](../../DEVELOPMENT.md):** Setup and deployment guide
- **Database Schema:** `backend/core/migrations/`
- **API Documentation:** Generated by Encore (`encore api`)
- **Component Library:** `frontend/components/ui/`
- **User Guide:** *(To be created)*
- **Admin Guide:** *(To be created)*

---

## Contact & Ownership

**Product Owner:** Product Team
**Last Updated:** 2025-11-15
**Version:** 1.0

For questions, feedback, or suggestions about these PRDs, please open an issue in the project repository or contact the product team.

---

## Appendix

### A. Glossary
- **Space:** Broad organizational context (Work, Personal, etc.)
- **Tag:** Attribute or theme label (#urgent, #exercise, etc.)
- **Streak:** Consecutive periods of habit completion
- **Mood Booster:** Tag correlated with above-average mood
- **Mood Drainer:** Tag correlated with below-average mood
- **Quick Capture:** Rapid data entry interface
- **Countdown:** Future event with days-remaining display
- **Template:** Pre-structured journal entry format

### B. Acronyms
- **PRD:** Product Requirements Document
- **UX:** User Experience
- **UI:** User Interface
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **NPS:** Net Promoter Score
- **DAU/WAU/MAU:** Daily/Weekly/Monthly Active Users
- **KPI:** Key Performance Indicator
- **P0/P1/P2:** Priority levels (0 = Critical, 1 = High, 2 = Nice to Have)

### C. Design System References
- **Color Palette:** Cyan/blue accents on dark theme
- **Typography:** System fonts, readable sizes
- **Spacing:** Consistent 4px/8px grid system
- **Icons:** Lucide React library
- **Components:** Radix UI primitives with custom styling

---

**End of PRD Index**

For detailed information on any feature, please refer to the individual PRD documents linked above.

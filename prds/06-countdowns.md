# PRD: Countdowns

## Overview

**Feature Name:** Countdowns
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Countdowns feature enables users to track important future dates and events with visual countdown timers. It transforms abstract future dates into tangible "days remaining" displays, helping users prepare for deadlines, celebrate upcoming milestones, and maintain awareness of time-sensitive commitments. The feature supports both anticipatory (exciting events) and preparatory (deadlines) use cases with customizable visual styling.

## Problem Statement

Users struggle with:
- Losing track of important future dates and deadlines
- Understanding "how far away" a future event really is
- Preparing adequately for upcoming commitments
- Maintaining excitement for positive future events
- Balancing multiple time-sensitive responsibilities
- Converting calendar dates into actionable time frames
- Prioritizing which upcoming events need attention now
- Managing both exciting events (vacations, birthdays) and stressful ones (deadlines, appointments)

## Goals & Success Metrics

### Goals
1. Make future dates tangible and visible through countdown timers
2. Help users prioritize based on temporal urgency
3. Support both exciting anticipation and deadline preparation
4. Reduce anxiety about forgetting important dates
5. Create emotional connection to future events
6. Enable proactive preparation for time-sensitive commitments

### Success Metrics
- **Active Countdowns:** Average number of active countdowns per user
- **Countdown Completion:** % of countdowns that reach their date (vs deleted early)
- **Urgency Response:** % of urgent countdowns (< 3 days) that have associated tasks
- **Revisit Rate:** Daily views of Countdowns page
- **Lead Time:** Average days between countdown creation and event date
- **Engagement:** % of users with at least one active countdown
- **Category Balance:** Mix of positive vs deadline countdown types

## User Personas

### Primary: The Event Anticipator
- **Demographics:** 20-50 years old, values experiences and milestones
- **Needs:** Track vacations, birthdays, anniversaries, concerts, trips
- **Pain Points:** Losing excitement during long waits, forgetting to prepare
- **Usage Pattern:** Creates countdowns months in advance, daily check-ins

### Secondary: The Deadline Manager
- **Demographics:** 25-45 years old, professional with time-sensitive work
- **Needs:** Track project deadlines, submission dates, presentation days
- **Pain Points:** Deadline anxiety, last-minute rushing, missed commitments
- **Usage Pattern:** Creates countdowns at project start, urgent alerts

### Tertiary: The Life Planner
- **Demographics:** 30-60 years old, long-term thinker
- **Needs:** Track retirement, mortgages, life milestones, kids' graduations
- **Pain Points:** Abstract long-term dates feel intangible
- **Usage Pattern:** Creates countdowns for major life events, periodic reviews

### Quaternary: The Goal Achiever
- **Demographics:** 18-40 years old, achievement-oriented
- **Needs:** Track fitness events (marathons), certification exams, challenges
- **Pain Points:** Losing motivation during long training periods
- **Usage Pattern:** Creates countdowns as motivation, links to habit tracking

## Functional Requirements

### 1. Countdown Creation

#### 1.1 Create Countdown Dialog
**Priority:** P0 (Critical)
- **Input Fields:**
  - Event Name (required, max 100 characters)
  - Event Date (required, date picker, must be future)
  - Description (optional, max 300 characters)
  - Color (optional, predefined palette)
  - Icon (optional, from icon library - future)
  - Active/Inactive toggle (default: active)
- **Validation:**
  - Event name cannot be empty
  - Event date must be in the future (warning if past, but allow)
  - Color selection or default color applied
- **Quick Create:**
  - Minimal fields: name and date only
  - Smart defaults for color (rotating through palette)
  - Expandable for additional fields

#### 1.2 Color Customization
**Priority:** P1 (High)
- **Color Palette:**
  - Predefined colors: red, orange, yellow, green, blue, purple, pink, cyan
  - Color affects countdown card background/border
  - Color coding for event types (user's mental model)
  - Examples:
    - Red: urgent deadlines
    - Green: vacations, positive events
    - Blue: appointments, neutral events
    - Purple: personal milestones
- **Visual Feedback:**
  - Color preview in creation dialog
  - Color swatch on countdown cards
  - Gradient or solid color options (future)

#### 1.3 Recurring Countdowns (Future)
**Priority:** P3 (Future)
- Annual events (birthdays, anniversaries)
- Monthly events (bill due dates)
- Custom recurrence patterns
- Auto-reset after event passes

### 2. Countdown Display

#### 2.1 Countdown Card Layout
**Priority:** P0 (Critical)
```
┌─────────────────────────────────────────┐
│ 🎉 Summer Vacation                      │
│                                          │
│        42 DAYS                           │
│     June 28, 2025                        │
│                                          │
│ "Two weeks in Hawaii! 🌺"              │
│                                  [Edit] ✕│
└─────────────────────────────────────────┘
```
- Event name (bold, large)
- Large countdown number (days remaining)
- Target date display
- Optional description
- Color-coded card background or border
- Quick actions (edit, delete, toggle active)

#### 2.2 Time Remaining Display
**Priority:** P0 (Critical)
- **Primary Display:** Days remaining
  - "X DAYS" in large bold font
  - "1 DAY" (singular for day 1)
  - "TODAY!" (on event day)
  - "TOMORROW" (one day before)
- **Secondary Display:** Full date
  - "June 28, 2025"
  - Weekday display (future): "Thursday, June 28"
  - Relative display: "in 6 weeks"
- **Extended Precision (Future):**
  - Hours and minutes for same-day events
  - "5 hours, 32 minutes"
  - Live countdown for urgent events

#### 2.3 Urgency Indicators
**Priority:** P1 (High)
- **Urgent:** ≤ 3 days remaining
  - Red pulsing border or glow
  - Urgent badge/flag
  - Displayed at top of list
  - Shown on dashboard
- **Soon:** 4-7 days remaining
  - Yellow/orange accent
  - "Soon" badge
- **Upcoming:** 8-30 days remaining
  - Standard styling
- **Distant:** > 30 days
  - Subtle styling, lower visual priority

#### 2.4 Past Events
**Priority:** P1 (High)
- **Event Has Passed:**
  - "Event passed X days ago"
  - Grayed out styling
  - Option to delete or mark complete
  - Optional: archive automatically after 7 days
- **Grace Period:**
  - Keep visible for 7 days after passing
  - "Completed" state vs "Passed"
  - Optional completion celebration

### 3. Countdown Organization

#### 3.1 List View
**Priority:** P0 (Critical)
- **Default Sort:**
  - Urgent countdowns first (≤ 3 days)
  - Then by days remaining (soonest first)
  - Inactive countdowns at bottom
- **Visual Grouping:**
  - "Urgent" section (≤ 3 days)
  - "This Week" section (4-7 days)
  - "This Month" section (8-30 days)
  - "Later" section (> 30 days)
  - "Past Events" section (after event date)
- **Card Grid:**
  - Responsive grid layout
  - 1-3 columns based on screen size
  - Consistent card sizes
  - Hover effects for interactivity

#### 3.2 Filtering & Sorting
**Priority:** P2 (Nice to Have)
- **Filters:**
  - Active vs inactive
  - By color (filter by event type)
  - By urgency level
  - By date range
  - Past vs future
- **Sort Options:**
  - By days remaining (default)
  - By event date
  - By creation date
  - By event name (A-Z)
  - By color

#### 3.3 Calendar Integration (Future)
**Priority:** P3 (Future)
- Import from Google Calendar
- Export to iCal
- Sync with system calendar
- Display in calendar view
- Create tasks for countdown events

### 4. Countdown Management

#### 4.1 Edit Countdown
**Priority:** P0 (Critical)
- Click countdown card to open edit dialog
- All properties editable
- Save/cancel actions
- Recalculate days remaining on date change
- Update confirmation toast

#### 4.2 Delete Countdown
**Priority:** P0 (Critical)
- Delete action in card menu
- Confirmation dialog
- Permanent deletion
- Success toast with undo option (5 seconds)

#### 4.3 Toggle Active/Inactive
**Priority:** P1 (High)
- Active toggle switch
- Inactive countdowns hidden from main view (optional)
- "View inactive" toggle to show all
- Use case: Tentative events, "maybe" trips
- Preserve data when inactive

#### 4.4 Mark as Complete
**Priority:** P2 (Nice to Have)
- "Mark complete" action after event passes
- Celebration animation
- Move to completed section
- Optional: create journal entry about event
- Completion stats (events completed this year)

### 5. Countdown Notifications (Future)

#### 5.1 Reminder Settings
**Priority:** P3 (Future)
- Per-countdown notification settings
- Remind at: 30 days, 7 days, 3 days, 1 day, day-of
- Custom reminder times
- Push notifications (web/mobile)
- Email reminders
- Disable reminders per countdown

### 6. Countdown Analytics

#### 6.1 Statistics
**Priority:** P2 (Nice to Have)
- Total active countdowns
- Upcoming events this month
- Urgent events (≤ 3 days)
- Events completed this year
- Average lead time (creation to event date)
- Most anticipated events (most views)

### 7. Dashboard Integration

#### 7.1 Countdown Summary Card
**Priority:** P0 (Critical)
- Display on main dashboard
- Show urgent countdowns (≤ 3 days)
- Limit to top 3 most urgent
- Quick link to full Countdowns view
- Color-coded urgent indicators

## Non-Functional Requirements

### Performance
- Countdown list load: < 150ms for 50 countdowns
- Real-time countdown updates (days recalculate at midnight)
- Smooth card animations
- Optimistic updates for quick interactions

### Accessibility
- Keyboard navigation
- Screen reader support for countdown values
- High contrast mode
- Color-blind friendly urgency indicators (not just color)
- ARIA labels for all interactive elements

### Scalability
- Support 100+ countdowns per user
- Efficient date calculations
- Database indexing on user_id, event_date, active status

### Data Integrity
- Accurate timezone handling
- Consistent date calculations
- Prevent invalid dates
- Handle edge cases (leap years, DST changes)

### UX Psychology
- Balance urgency without anxiety
- Celebrate proximity to positive events
- Gentle reminders for deadlines
- Avoid overwhelming visual urgency

## User Experience

### Information Architecture
```
Countdowns View
├── Header
│   ├── Page Title
│   ├── Create Countdown Button
│   └── Filter/Sort Controls
├── Urgent Section (≤ 3 days)
│   ├── Urgent Countdown Card 1
│   └── Urgent Countdown Card 2
├── This Week Section (4-7 days)
│   ├── Countdown Card 3
│   └── Countdown Card 4
├── This Month Section (8-30 days)
│   └── Countdown Cards 5-10
├── Later Section (> 30 days)
│   └── Countdown Cards 11-N
└── Past Events Section
    └── Completed/Passed Countdowns

Countdown Card
├── Event Name
├── Days Remaining (Large)
├── Event Date
├── Description (Optional)
├── Color Indicator
└── Quick Actions (Edit, Delete, Toggle)
```

### User Flows

#### Flow 1: Create Vacation Countdown
1. User books vacation 3 months in advance
2. User opens Countdowns view
3. User clicks "Create Countdown"
4. User enters name: "Hawaii Vacation 🌴"
5. User selects date: June 28, 2025
6. User adds description: "Two weeks in Maui!"
7. User selects green color (vacation/positive)
8. User clicks "Create"
9. Countdown appears showing "92 DAYS"
10. User feels excited seeing tangible countdown

#### Flow 2: Project Deadline Tracking
1. User receives project deadline: 2 weeks away
2. User creates countdown: "Client Presentation"
3. User selects red color (urgent/deadline)
4. User sets date: 14 days from now
5. Countdown displays "14 DAYS"
6. As date approaches, countdown moves to urgent section
7. 3 days before: countdown shows red urgent indicator
8. User sees urgent countdown on dashboard
9. User prepares adequately, completes on time
10. After event: user marks countdown complete

#### Flow 3: Daily Countdown Check
1. User opens app in morning
2. Dashboard shows urgent countdowns
3. User sees "2 DAYS" until dentist appointment
4. User creates task: "Confirm dentist appointment"
5. User opens full Countdowns view
6. User reviews all upcoming events
7. User feels organized and prepared
8. User adjusts plans based on proximity of events

#### Flow 4: Manage Past Events
1. User's birthday countdown reaches "TODAY!"
2. Celebration animation plays
3. Countdown card shows "Event is today!"
4. Next day: countdown shows "Event passed 1 day ago"
5. User clicks "Mark Complete"
6. Countdown moves to completed section
7. Optional: user creates journal entry about birthday
8. Countdown archived after 7 days

### Visual Design

#### Countdown Card Colors
- Red: Urgent deadlines, important dates
- Orange: Work events, meetings
- Yellow: Appointments, reminders
- Green: Vacations, positive events, celebrations
- Blue: Neutral events, general reminders
- Purple: Personal milestones, achievements
- Pink: Relationship events (anniversaries, dates)
- Cyan: Health/wellness events

#### Urgency Styling
- **Urgent (≤ 3 days):**
  - Red pulsing glow
  - "URGENT" badge
  - Larger card size
  - Animation on hover
- **Soon (4-7 days):**
  - Yellow accent border
  - "SOON" badge
- **Standard:**
  - Color-coded by user selection
  - Subtle border

#### Typography
- Event name: Bold, 20-24px
- Days remaining: Bold, 48-64px (huge!)
- Date: Regular, 14-16px
- Description: Italic, muted color, 12-14px

## Technical Specifications

### Frontend Components
```typescript
<CountdownsView>
  <CountdownsHeader>
    <h1>Countdowns</h1>
    <CreateCountdownButton />
    <FilterSortControls />
  </CountdownsHeader>

  {urgentCountdowns.length > 0 && (
    <UrgentSection>
      <h2>🚨 Urgent (3 days or less)</h2>
      <CountdownGrid>
        {urgentCountdowns.map(countdown => (
          <CountdownCard key={countdown.id} countdown={countdown} urgent />
        ))}
      </CountdownGrid>
    </UrgentSection>
  )}

  <ThisWeekSection>
    <h2>This Week</h2>
    <CountdownGrid>
      {thisWeekCountdowns.map(countdown => (
        <CountdownCard key={countdown.id} countdown={countdown} />
      ))}
    </CountdownGrid>
  </ThisWeekSection>

  {/* More sections... */}

  <CreateCountdownDialog />
</CountdownsView>

<CountdownCard countdown={countdown} urgent={urgent}>
  <CardHeader>
    <EventName>{countdown.event_name}</EventName>
    <QuickActions>
      <EditButton />
      <DeleteButton />
      <ToggleActiveButton />
    </QuickActions>
  </CardHeader>

  <CountdownDisplay>
    <DaysRemaining>{daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'}</DaysRemaining>
    <EventDate>{formatDate(countdown.event_date)}</EventDate>
  </CountdownDisplay>

  {countdown.description && (
    <Description>{countdown.description}</Description>
  )}

  {urgent && <UrgentBadge>URGENT</UrgentBadge>}
</CountdownCard>
```

### Data Models
```typescript
interface Countdown {
  id: string;
  user_id: string;
  event_name: string;
  event_date: string; // YYYY-MM-DD
  description?: string;
  color: string; // hex color or preset name
  is_active: boolean;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

interface CountdownWithCalculations extends Countdown {
  days_remaining: number;
  is_today: boolean;
  is_tomorrow: boolean;
  is_urgent: boolean; // ≤ 3 days
  is_soon: boolean; // 4-7 days
  is_past: boolean;
  days_since_passed?: number;
}
```

### Days Remaining Calculation
```typescript
function calculateDaysRemaining(eventDate: string): number {
  const today = startOfDay(new Date());
  const event = startOfDay(new Date(eventDate));
  const days = differenceInDays(event, today);
  return days;
}

function enrichCountdown(countdown: Countdown): CountdownWithCalculations {
  const daysRemaining = calculateDaysRemaining(countdown.event_date);

  return {
    ...countdown,
    days_remaining: daysRemaining,
    is_today: daysRemaining === 0,
    is_tomorrow: daysRemaining === 1,
    is_urgent: daysRemaining >= 0 && daysRemaining <= 3,
    is_soon: daysRemaining >= 4 && daysRemaining <= 7,
    is_past: daysRemaining < 0,
    days_since_passed: daysRemaining < 0 ? Math.abs(daysRemaining) : undefined,
  };
}
```

### API Endpoints
```
POST   /countdowns                      Create countdown
GET    /users/:user_id/countdowns       List countdowns (active by default)
GET    /countdowns/:id                  Get countdown details
PUT    /countdowns/:id                  Update countdown
DELETE /countdowns/:id                  Delete countdown
POST   /countdowns/:id/toggle-active    Toggle active status
POST   /countdowns/:id/complete         Mark as completed

GET    /users/:user_id/countdowns/urgent   Get urgent countdowns (dashboard)
GET    /users/:user_id/countdowns/stats    Get countdown statistics
```

### State Management
```typescript
// React Query hooks
const { data: countdowns } = useCountdowns(userId, { active: true });
const { data: urgentCountdowns } = useUrgentCountdowns(userId);
const createCountdown = useCreateCountdown();
const updateCountdown = useUpdateCountdown();
const deleteCountdown = useDeleteCountdown();

// Client-side enrichment
const enrichedCountdowns = useMemo(() => {
  return countdowns?.map(enrichCountdown) || [];
}, [countdowns]);

// Grouping by urgency
const groupedCountdowns = useMemo(() => {
  const urgent = enrichedCountdowns.filter(c => c.is_urgent && !c.is_past);
  const thisWeek = enrichedCountdowns.filter(c => c.is_soon && !c.is_past);
  const thisMonth = enrichedCountdowns.filter(c =>
    c.days_remaining > 7 && c.days_remaining <= 30
  );
  const later = enrichedCountdowns.filter(c => c.days_remaining > 30);
  const past = enrichedCountdowns.filter(c => c.is_past);

  return { urgent, thisWeek, thisMonth, later, past };
}, [enrichedCountdowns]);
```

## Dependencies

### Internal
- Dashboard (urgent countdown display)
- Tasks (create tasks from countdowns - future)
- Analytics (countdown statistics)

### External
- React Query (data fetching)
- date-fns (date calculations)
- Radix UI (dialogs, color picker)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Countdown anxiety (stress from urgent indicators) | Medium | Medium | Use gentle language, allow disabling urgency indicators, positive framing |
| Timezone issues causing incorrect day calculations | High | Low | Use user's local timezone, clear day boundaries, test edge cases |
| Clutter from too many countdowns | Medium | Medium | Encourage active/inactive usage, auto-archive past events, grouping |
| Disappointment when events pass | Low | Medium | Celebration for completed events, optional journal prompt, positive closure |
| Users forget to create countdowns | Medium | Low | Suggest countdowns from calendar integration (future), prompts |

## Future Enhancements

### Phase 2
- Recurring countdowns (annual birthdays, anniversaries)
- Notification reminders at custom intervals
- Calendar integration (import/export)
- Countdown widgets for home screen
- Share countdown with friends/family

### Phase 3
- Countdown milestones (e.g., "50 days until vacation!")
- Photo/image backgrounds for countdowns
- Countdown templates (wedding, baby due date, retirement)
- Link countdowns to tasks (auto-create prep tasks)
- Countdown groups (related events)

### Phase 4
- Social countdowns (public events, shared anticipation)
- Countdown live wallpapers
- AR countdown displays
- Voice countdowns ("Alexa, how many days until my vacation?")
- Smart suggestions from email/calendar

## Open Questions

1. Should we support hour/minute precision for same-day events?
2. What's the ideal urgency threshold: 3 days, 5 days, or 7 days?
3. Should past events auto-archive after X days, or require manual action?
4. How do we balance anticipation excitement vs deadline stress in UI?
5. Should there be a limit on the number of active countdowns?
6. Should we support negative dates (e.g., "5 days since last vacation")?

## Appendix

### A. Color Meaning Suggestions
Provide users with suggested color meanings:
- 🔴 Red: Deadlines, urgent events, important commitments
- 🟠 Orange: Work events, meetings, professional milestones
- 🟡 Yellow: Appointments, reminders, administrative tasks
- 🟢 Green: Vacations, celebrations, positive events
- 🔵 Blue: Health appointments, routine events, neutral
- 🟣 Purple: Personal achievements, goals, milestones
- 🌸 Pink: Relationships, anniversaries, social events
- 🔷 Cyan: Wellness, self-care, meditation retreats

### B. Keyboard Shortcuts
- `Cmd/Ctrl + D` - Create new countdown (D for "date")
- `E` - Edit focused countdown
- `Delete` - Delete focused countdown
- `Space` - Toggle active/inactive on focused countdown
- `Arrow keys` - Navigate between countdown cards
- `Enter` - Open countdown detail view

### C. Analytics Events
```
- countdown_created
- countdown_edited
- countdown_deleted
- countdown_completed
- countdown_toggled_active
- countdown_viewed_urgent
- countdown_reached (event day)
- countdown_passed (event in past)
- countdown_milestone (50 days, 30 days, 7 days)
```

### D. Event Type Examples
**Exciting/Positive:**
- Vacation/travel
- Birthday
- Anniversary
- Concert/show
- Wedding
- Baby due date
- Retirement
- Graduation

**Preparatory/Deadline:**
- Project deadline
- Exam date
- Submission due
- Presentation day
- Bill due date
- Contract renewal
- Appointment

**Neutral/Administrative:**
- Doctor appointment
- Car registration
- Passport expiration
- Subscription renewal
- Lease end date

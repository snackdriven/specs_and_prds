# PRD: Concert Tracking & Discovery

## Product Overview

The Concert Tracking feature helps users manage concert attendance from discovery through post-show, with multi-status workflow tracking, venue management, and preparation coordination.

## Problem Statement

Concert-goers with ADHD struggle with:
- **Complex Planning**: Multiple steps (tickets, lodging, time off)
- **Venue Details**: Forgetting drive times, addresses
- **Status Tracking**: Losing track of what's been handled
- **Date Management**: Concerts spread across months/years
- **Preparation Panic**: Realizing lodging needed at last minute

## Core Features

### 1. Concert CRUD with Status Workflow

**User Stories**:
- As a user, I want to track concerts I'm interested in
- As a user, I want to move concerts through preparation stages
- As a user, I want to see what still needs to be done

**Concert Status Workflow**:
```
would_need_tickets → bought_tickets →
request_time_off → time_off_requested →
book_lodging → prepared_lodging →
ready_and_waiting → [missed_not_missed | another_show_in_books]
```

**Status Definitions**:
- `would_need_tickets`: Interested, no tickets yet
- `bought_tickets`: Tickets purchased
- `request_time_off`: Need to request PTO
- `time_off_requested`: PTO requested, awaiting approval
- `book_lodging`: Need to book hotel/travel
- `prepared_lodging`: Accommodations booked
- `ready_and_waiting`: All prepared, waiting for show
- `missed_not_missed`: Show occurred (retrospective)
- `another_show_in_books`: Adding another date for same artist

### 2. Venue Management

**User Stories**:
- As a user, I want to save venues I visit frequently
- As a user, I want to store drive times to venues
- As a user, I want to reuse venue details for multiple concerts

**Venue Fields**:
- `name`: Venue name (e.g., "Red Rocks Amphitheatre")
- `address`: Full street address
- `city` / `state`: Location
- `drive_time_minutes`: Drive duration from home
- `drive_time_display`: Human-readable (e.g., "2 hours 15 minutes")

**Technical Implementation**:
- Database: `venues` table (supabase/schema.sql:415-426)
- Relationship: One venue → Many concerts
- Reusability: Select existing venue or create new on concert form

### 3. Concert Details

**User Stories**:
- As a user, I want to store artist name, date, venue
- As a user, I want to save door/show times
- As a user, I want to note supporting acts
- As a user, I want free-form notes field

**Concert Fields**:
- `event_title`: Artist/show name
- `venue_id`: Foreign key to venue (optional)
- `venue_name`: Denormalized venue name (if no venue_id)
- `event_date`: Show date (DATE type)
- `day_of_week`: Auto-calculated day name
- `doors_open`: Door time (TIME type)
- `show_starts`: Show start time (TIME type)
- `supporting_acts`: Text field for openers
- `notes`: Free-form notes
- `status`: Workflow status (see above)
- `is_active`: Active vs archived

### 4. Concert Views

**User Stories**:
- As a user, I want to see concerts as cards (visual)
- As a user, I want to see concerts as a table (dense)
- As a user, I want to switch between views

**View Modes**:

**Card View** (`ConcertsCardView.tsx`):
- Grid of concert cards
- Large artist name, date, venue
- Status badge
- Countdown if upcoming
- Color-coded by status

**Table View** (`ConcertsTableView.tsx`):
- Spreadsheet-style layout
- Sortable columns (date, artist, venue, status)
- Compact for many concerts
- Quick-edit inline

### 5. Status Filtering

**User Stories**:
- As a user, I want to filter by status
- As a user, I want to see only upcoming shows
- As a user, I want to see past shows

**Component**: `ConcertsFilters.tsx`

**Filter Options**:
- Status: Multi-select (would_need_tickets, bought_tickets, etc.)
- Venue: Filter by specific venue
- Date Range: Past, upcoming, all
- Active/Archived: Show archived concerts or not

### 6. Concert Card with Expandable Details

**User Stories**:
- As a user, I want summary view of concerts
- As a user, I want to expand for full details
- As a user, I want quick actions (edit, delete, change status)

**Components**:
- `ConcertCard.tsx`: Card wrapper
- `ConcertCardExpandedDetails.tsx`: Expanded section

**Card Displays**:
- Artist name (large)
- Date and day of week
- Venue name
- Drive time indicator
- Status badge
- Countdown (if upcoming)
- Expand/collapse button

**Expanded Details**:
- Full address
- Doors/show times
- Supporting acts
- Notes
- Edit/delete buttons
- Status change dropdown

### 7. Concert Modal (Full Edit)

**User Stories**:
- As a user, I want a full-screen form for concert creation
- As a user, I want to select existing venue or create new
- As a user, I want date/time pickers

**Component**: `ConcertModal.tsx`

**Form Sections**:
- Basic Info (artist, date, venue)
- Timing (doors, show start)
- Status workflow
- Additional details (supporting acts, notes)
- Venue management (select existing or create new)

### 8. Calendar & Countdown Integration

**User Stories**:
- As a user, I want concerts to appear on my calendar
- As a user, I want automatic countdowns for concerts
- As a user, I want to see drive time in calendar event

**Technical Implementation**:
- `calendar_events.concert_id`: Foreign key linking
- Auto-create calendar event on concert save
- Auto-create countdown on concert save (optional toggle)
- Calendar event includes venue address and drive time

## User Workflows

### Workflow 1: Adding a New Concert
1. User opens concerts pane
2. User clicks "+ New Concert"
3. Concert modal opens
4. User enters:
   - Artist: "The National"
   - Date: June 15, 2024
   - Selects existing venue: "Red Rocks Amphitheatre"
   - Doors: 6:00 PM
   - Show starts: 7:30 PM
   - Status: would_need_tickets
5. User saves concert
6. Concert card appears in grid
7. Calendar event auto-created for June 15
8. Countdown auto-created showing "87 days"

### Workflow 2: Moving Through Workflow
1. User sees concert card for "The National"
2. Status: "would_need_tickets"
3. User buys tickets online
4. User clicks status dropdown on card
5. User selects "bought_tickets"
6. Card color changes, badge updates
7. User later books hotel
8. User changes status to "prepared_lodging"
9. All preparation complete

### Workflow 3: Concert Day
1. Countdown shows "Today is the day!"
2. Calendar shows concert event
3. User sees drive time: "2 hours 15 minutes"
4. User leaves appropriately early
5. After concert, user changes status to "missed_not_missed"
6. Concert moves to past section

## Technical Architecture

### Database Schema
```sql
CREATE TYPE concert_status AS ENUM (
  'would_need_tickets', 'request_time_off', 'book_lodging',
  'bought_tickets', 'prepared_lodging', 'time_off_requested',
  'ready_and_waiting', 'missed_not_missed', 'another_show_in_books'
)

CREATE TABLE venues (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  drive_time_minutes INTEGER DEFAULT 0,
  drive_time_display TEXT
)

CREATE TABLE concerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  event_title TEXT NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  venue_name TEXT,
  event_date DATE NOT NULL,
  day_of_week TEXT,
  doors_open TIME,
  show_starts TIME,
  address TEXT,
  city_state TEXT,
  drive_time_minutes INTEGER DEFAULT 0,
  drive_time_display TEXT,
  supporting_acts TEXT,
  notes TEXT,
  status concert_status DEFAULT 'would_need_tickets',
  is_active BOOLEAN DEFAULT TRUE
)
```

### Key Hooks
- `useConcerts()`: CRUD with venue joins
- `useVenues()`: Venue management

### Component Hierarchy
```
ConcertsContentOrchestrator
├── ConcertsHeader (add button, view switcher)
├── ConcertsFilters (status, venue, date filters)
├── ConcertsCardView
│   └── ConcertCard[]
│       ├── ConcertCardExpandedDetails (collapsible)
│       └── StatusBadge
├── ConcertsTableView (alternative dense view)
├── ConcertModal (create/edit form)
└── VenueModal (venue management)
```

## ADHD-Friendly Design

### 1. Status Workflow
- Visual progress through preparation stages
- Clear "what's next" guidance
- No ambiguity about status

### 2. Drive Time Prominence
- Large display of drive time
- Prevents last-minute panic
- Helps with time planning

### 3. Countdowns Integration
- See how far away concert is
- Urgency increases as date approaches
- Time blindness mitigation

### 4. Venue Reusability
- Save frequently visited venues
- Reduce repetitive data entry
- Consistent drive time tracking

## Future Enhancements

1. **Setlist Integration**: Import setlists from setlist.fm
2. **Ticket Tracking**: Store ticket purchase details, price
3. **Budget Management**: Track concert expenses
4. **Photo Gallery**: Upload concert photos
5. **Friend Coordination**: Share concerts with friends attending
6. **Venue Maps**: Interactive seating charts
7. **Spotify Integration**: Link to artist on Spotify
8. **Tour Dates**: Import artist tour dates from APIs
9. **Merch Wishlist**: Track desired merchandise
10. **Review/Rating**: Rate shows after attending

## Success Criteria

1. ✅ Concert CRUD operations functional
2. ✅ Status workflow with all states working
3. ✅ Venue management (create, edit, reuse)
4. ✅ Card and table views functional
5. ✅ Status filtering working
6. ✅ Calendar integration (auto-create events)
7. ✅ Countdown integration
8. ✅ Mobile-responsive design

## References

- File: `components/panes/content/ConcertsContentOrchestrator.tsx`
- File: `components/concerts/ConcertCard.tsx`
- File: `components/concerts/ConcertModal.tsx`
- File: `components/concerts/VenueModal.tsx`
- Hook: `hooks/concerts/useConcerts.ts`
- Schema: `supabase/schema.sql:415-474`

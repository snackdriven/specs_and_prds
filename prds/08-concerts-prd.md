# Concerts - Product Requirements Document

**Feature Area:** Concert Tracking & Event Planning
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Concerts system provides multi-stage tracking for live music events, helping users manage the complex process from ticket purchasing through attendance. Designed for music fans who attend multiple shows and need systematic planning.

## Problem Statement

Concert planning involves many steps:
- **Ticket availability** - Need to act fast
- **Time off requests** - Must submit in advance
- **Lodging booking** - Hotels fill up quickly
- **Overwhelming when attending many shows** - Hard to track status
- **Forgotten details** - Show times, venues, supporting acts

## Goals

1. Track concert status through multi-stage workflow
2. Manage venue information including drive times
3. Integrate with calendar and countdowns
4. Provide visibility into upcoming shows
5. Support multiple views (card, table)

## User Stories

- As a user, I can add concerts I'm interested in
- As a user, I can track concert status (from "would need tickets" to "ready and waiting")
- As a user, I can manage venue information
- As a user, I can see concerts on my calendar
- As a user, I can view supporting acts
- As a user, I can filter concerts by status
- As a user, I can see drive time to venues
- As a user, I can add notes about each concert

## Functional Requirements

### Concert Status Workflow

**9 Status Stages:**
1. **would_need_tickets** - Interested but no tickets yet
2. **request_time_off** - Have tickets, need to request time off
3. **book_lodging** - Time off approved, need hotel
4. **bought_tickets** - Tickets purchased
5. **prepared_lodging** - Lodging booked
6. **time_off_requested** - Requested but not approved yet
7. **ready_and_waiting** - All logistics complete
8. **missed_not_missed** - Past event (attended or not)
9. **another_show_in_books** - Related to other concerts

**Status Transitions:**
- User manually updates status via dropdown
- Color-coded status badges
- Filter view by status

### Data Models

```typescript
interface Concert {
  id: string;
  user_id: string;
  artist_name: string;
  venue_id?: string;
  date: Date;
  door_time?: string;
  show_time?: string;
  supporting_acts?: string[];
  status: ConcertStatus;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

interface Venue {
  id: string;
  user_id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  drive_time_minutes?: number; // From user's location
  notes?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Venue Management

**Venue Features:**
- Reusable venue entries
- Drive time calculation/manual entry
- Address and location details
- Notes field for parking, entry procedures

**Component:**
- `VenueModal.tsx` - Add/edit venues

### Views

**Card View:**
- Component: `ConcertsCardView.tsx`
- Large cards with all details
- Expandable for full information
- Component: `ConcertCardExpandedDetails.tsx`

**Table View:**
- Component: `ConcertsTableView.tsx`
- Compact rows
- Sortable columns
- Quick status updates

**Filtering:**
- Component: `ConcertsFilters.tsx`
- By status
- By date range
- By artist
- By venue

### Calendar Integration

**Concert Events:**
- Automatically create calendar events
- Include door time, show time
- Link back to concert details
- Update calendar when concert changes

**Countdown Integration:**
- Auto-create countdown for upcoming concerts
- Urgency based on date proximity

## Database Schema

```sql
CREATE TABLE concerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  artist_name TEXT NOT NULL,
  venue_id UUID REFERENCES venues(id),
  date DATE NOT NULL,
  door_time TIME,
  show_time TIME,
  supporting_acts JSONB,
  status concert_status DEFAULT 'would_need_tickets',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  drive_time_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_concerts_user ON concerts(user_id);
CREATE INDEX idx_concerts_date ON concerts(user_id, date);
CREATE INDEX idx_concerts_status ON concerts(user_id, status);
CREATE INDEX idx_concerts_venue ON concerts(venue_id);
CREATE INDEX idx_venues_user ON venues(user_id);
```

## Components

**Main Views:**
- `/components/concerts/ConcertsCardView.tsx`
- `/components/concerts/ConcertsTableView.tsx`
- `/components/concerts/ConcertCardExpandedDetails.tsx`

**Modals:**
- `/components/concerts/ConcertModal.tsx`
- `/components/concerts/VenueModal.tsx`

**Utilities:**
- `/components/concerts/ConcertsFilters.tsx`

## Hooks

- `/hooks/concerts/useConcerts.ts`
- `/hooks/concerts/useVenues.ts`

## Success Metrics

- Concerts tracked per user
- Status progression completion rate
- Venue reuse frequency
- Calendar integration adoption

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Calendar PRD](./06-calendar-prd.md)
- [Countdowns PRD](./07-countdowns-prd.md)

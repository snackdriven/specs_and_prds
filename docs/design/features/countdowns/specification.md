# Countdowns & Concerts - Technical Specification

## 1. Complete Feature Specification

### 1.1 Countdowns Core Features

#### A. Data Fields

```typescript
interface Countdown {
  id: string
  userId: string

  // Core fields
  title: string                    // Required: "Wedding Day", "Product Launch"
  targetDate: Date                 // Required: Date of the event
  targetTime?: string              // Optional: "2:30 PM" (if specific time matters)

  // Optional metadata
  description?: string             // Details about the event
  color?: string                   // For visual categorization
  icon?: string                    // Emoji or icon identifier
  category?: string                // "work", "personal", "deadline", etc.

  // Integration
  calendarEventId?: string         // Link to calendar event
  taskId?: string                  // Link to related task
  spaceId: string                  // Required: Which space it belongs to

  // Type discrimination
  type: 'generic' | 'concert' | 'deadline' | 'birthday' | 'anniversary'

  // Settings
  showOnDashboard: boolean         // Display in dashboard widget
  notifyAt?: number[]              // Notify X days before [7, 3, 1, 0]

  // Metadata
  createdAt: Date
  updatedAt: Date
  completedAt?: Date               // When it passed (for archiving)
  archived: boolean
}
```

#### B. Urgency Calculation

**Urgency Tiers:**

```typescript
enum UrgencyLevel {
  EXPIRED = 'expired',       // Past due
  CRITICAL = 'critical',     // < 3 days
  URGENT = 'urgent',         // 3-7 days
  SOON = 'soon',            // 7-14 days
  NORMAL = 'normal',        // > 14 days
}

function calculateUrgency(targetDate: Date): UrgencyLevel {
  const now = new Date()
  const daysUntil = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil < 0) {
    return UrgencyLevel.EXPIRED
  } else if (daysUntil < 3) {
    return UrgencyLevel.CRITICAL
  } else if (daysUntil < 7) {
    return UrgencyLevel.URGENT
  } else if (daysUntil < 14) {
    return UrgencyLevel.SOON
  } else {
    return UrgencyLevel.NORMAL
  }
}

// Color coding
const URGENCY_COLORS = {
  expired: '#9E9E9E',    // Gray
  critical: '#F44336',   // Red
  urgent: '#FF9800',     // Orange
  soon: '#FFC107',       // Amber
  normal: '#2196F3',     // Blue
}
```

#### C. Display Formats

**Multiple display modes:**

```typescript
type DisplayFormat = 'simple' | 'detailed' | 'date-focused' | 'ring'

function formatCountdown(countdown: Countdown, format: DisplayFormat): string {
  const now = new Date()
  const target = countdown.targetDate
  const diff = target.getTime() - now.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  switch (format) {
    case 'simple':
      return `${days} days`

    case 'detailed':
      return `${days} days, ${hours} hours, ${minutes} min`

    case 'date-focused':
      return `Until ${format(target, 'MMMM d, yyyy')}`

    case 'ring':
      // Progress ring percentage (for circular display)
      const created = countdown.createdAt
      const total = target.getTime() - created.getTime()
      const elapsed = now.getTime() - created.getTime()
      const percent = Math.min(100, (elapsed / total) * 100)
      return `${percent.toFixed(1)}% elapsed`
  }
}
```

**Visual Examples:**

```
┌─────────────────────────────────────┐
│ Product Launch                      │
│ ⏰ 12 days                          │   (simple)
│ URGENT                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Wedding Day                         │
│ 💍 85 days, 6 hours, 23 min        │   (detailed)
│ NORMAL                              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Tax Deadline                        │
│ 📅 Until April 15, 2025            │   (date-focused)
│ CRITICAL (2 days)                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Vacation                            │
│      ⭕ 67.3% elapsed               │   (ring)
│ 🏖️ 42 days                         │
└─────────────────────────────────────┘
```

#### D. Auto-Archive

**Options for handling expired countdowns:**

```typescript
interface ArchiveSettings {
  autoArchive: boolean              // Auto-archive after passing
  archiveDelayDays: number          // Archive X days after passing (default: 0)
  deleteAfterArchiveDays?: number   // Auto-delete X days after archiving
}

// Cron job to archive expired countdowns
async function archiveExpiredCountdowns() {
  const expired = await db.countdowns.findMany({
    where: {
      targetDate: { lt: new Date() },
      archived: false,
      type: { not: 'birthday' } // Don't archive birthdays (recurring)
    }
  })

  for (const countdown of expired) {
    const daysSinceExpired = (Date.now() - countdown.targetDate.getTime()) / (1000 * 60 * 60 * 24)

    if (daysSinceExpired >= (countdown.archiveSettings?.archiveDelayDays || 0)) {
      await db.countdowns.update({
        where: { id: countdown.id },
        data: {
          archived: true,
          completedAt: countdown.targetDate
        }
      })

      // Notify user
      await notifyUser({
        userId: countdown.userId,
        type: 'info',
        message: `"${countdown.title}" has been archived`,
        action: 'View Archive'
      })
    }
  }
}
```

**User preferences:**

```
Settings > Countdowns
┌────────────────────────────────────┐
│ ☑ Auto-archive expired countdowns  │
│   Archive [0 ▾] days after passing │
│                                    │
│ ☑ Delete archived countdowns after│
│   [30 ▾] days                      │
└────────────────────────────────────┘
```

---

### 1.2 Concerts (Specialized Countdowns)

#### A. Additional Fields

```typescript
interface Concert extends Countdown {
  type: 'concert'

  // Concert-specific fields
  venue: {
    id: string
    name: string                   // "Madison Square Garden"
    address: string                // Full address
    city: string
    state: string
    zip: string
    latitude?: number              // For drive time calculation
    longitude?: number
  }

  artistName: string               // Main artist
  supportingActs?: string[]        // Opening acts

  // Ticket workflow
  ticketStatus: TicketStatus
  ticketPurchaseDate?: Date
  ticketPrice?: number
  ticketConfirmation?: string      // Confirmation number
  ticketLink?: string              // Link to tickets (email, PDF, etc.)

  // Planning
  travelTime?: number              // Drive time in minutes
  departureTime?: Date             // When to leave
  parkingInfo?: string
  notes?: string                   // "Bring earplugs", "Meet Sarah at door"
}

enum TicketStatus {
  INTERESTED = 'interested',                   // 1. Might want to go
  LOOKING = 'looking',                        // 2. Actively searching for tickets
  OFFER_PENDING = 'offer_pending',           // 3. Made offer, waiting for response
  PURCHASED = 'purchased',                    // 4. Tickets secured
  CONFIRMED = 'confirmed',                    // 5. Event confirmed (no cancellation)
  READY = 'ready',                           // 6. All planning done, ready to go
  ATTENDED = 'attended',                      // 7. Event happened, attended
  MISSED = 'missed',                         // 8. Event happened, didn't attend
  CANCELLED = 'cancelled',                    // 9. Event cancelled by venue
}
```

#### B. Simplified Workflow

**9 stages → Simplified to 6 core stages for MVP:**

```typescript
enum TicketStatusMVP {
  INTERESTED = 'interested',      // 1. Want to go
  LOOKING = 'looking',           // 2. Looking for tickets
  PURCHASED = 'purchased',       // 3. Tickets purchased
  READY = 'ready',              // 4. Ready to attend
  ATTENDED = 'attended',         // 5. Attended event
  MISSED = 'missed',            // 6. Didn't attend
}

// Status progression UI
const STATUS_FLOW = [
  'interested',
  'looking',
  'purchased',
  'ready',
  'attended'
]

// UI: Progress stepper
function ConcertStatusStepper({ concert }: { concert: Concert }) {
  const currentIndex = STATUS_FLOW.indexOf(concert.ticketStatus)

  return (
    <div className="status-stepper">
      {STATUS_FLOW.map((status, index) => (
        <div
          key={status}
          className={classNames('step', {
            'completed': index < currentIndex,
            'active': index === currentIndex,
            'pending': index > currentIndex
          })}
        >
          {getStatusIcon(status)}
          {getStatusLabel(status)}
        </div>
      ))}
    </div>
  )
}
```

**Visual workflow:**

```
Concert: The National - April 30, 2025

┌────────────────────────────────────────────────────┐
│ Status: Looking for Tickets                        │
├────────────────────────────────────────────────────┤
│                                                    │
│ ●────────●────────○────────○────────○             │
│ Interested  Looking  Purchased  Ready  Attended   │
│                                                    │
│ [Mark as Purchased]                                │
└────────────────────────────────────────────────────┘

After clicking "Mark as Purchased":
┌────────────────────────────────────────────────────┐
│ Tickets Purchased ✓                                │
├────────────────────────────────────────────────────┤
│ Purchase Date: [04/10/2025 ▾]                     │
│ Price: [$120.00]                                   │
│ Confirmation: [ABC123XYZ]                          │
│ Ticket Link: [Upload PDF or paste link]           │
│                                                    │
│ [Save]  [Cancel]                                   │
└────────────────────────────────────────────────────┘
```

#### C. Calendar Integration

**Concert → Calendar Event with all details:**

```typescript
async function createConcertCalendarEvent(concert: Concert): Promise<CalendarEvent> {
  // Calculate departure time (concert time - travel time - 30 min buffer)
  const departureTime = concert.targetTime
    ? subtractMinutes(
        parseTime(concert.targetDate, concert.targetTime),
        (concert.travelTime || 0) + 30
      )
    : null

  const calendarEvent = {
    title: `🎵 ${concert.artistName}`,
    description: `
Concert: ${concert.artistName}
${concert.supportingActs?.length ? `Supporting: ${concert.supportingActs.join(', ')}` : ''}

Venue: ${concert.venue.name}
Address: ${concert.venue.address}

Tickets: ${concert.ticketStatus}
${concert.ticketPrice ? `Price: $${concert.ticketPrice}` : ''}
${concert.ticketConfirmation ? `Confirmation: ${concert.ticketConfirmation}` : ''}

${concert.departureTime ? `🚗 Leave at: ${format(concert.departureTime, 'h:mm a')}` : ''}
${concert.parkingInfo ? `Parking: ${concert.parkingInfo}` : ''}

${concert.notes || ''}
    `.trim(),

    startTime: concert.targetDate,
    endTime: addHours(concert.targetDate, 3), // Assume 3-hour concert
    location: `${concert.venue.name}, ${concert.venue.address}`,
    eventType: 'countdown' as const,
    countdownId: concert.id,
    spaceId: concert.spaceId,
    color: '#9C27B0', // Purple for concerts

    // Reminders
    reminders: [
      { minutesBefore: 60 },                    // 1 hour before
      { minutesBefore: concert.travelTime },   // When to leave
      { minutesBefore: 1440 }                  // Day before
    ]
  }

  return calendarEvent
}
```

#### D. Drive Time Calculation

**Using Google Maps Distance Matrix API (V2):**

```typescript
async function calculateDriveTime(
  userLocation: Location,
  venue: Venue
): Promise<number> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/distancematrix/json?` +
    `origins=${userLocation.latitude},${userLocation.longitude}` +
    `&destinations=${venue.latitude},${venue.longitude}` +
    `&departure_time=now` +
    `&key=${GOOGLE_MAPS_API_KEY}`
  )

  const data = await response.json()
  const durationInTraffic = data.rows[0].elements[0].duration_in_traffic.value // seconds

  return Math.ceil(durationInTraffic / 60) // Convert to minutes
}

// MVP: Manual entry
// V2: Auto-calculate using Google Maps API
```

**UI:**

```
┌────────────────────────────────────────┐
│ Venue Details                          │
├────────────────────────────────────────┤
│ Madison Square Garden                  │
│ 4 Pennsylvania Plaza                   │
│ New York, NY 10001                     │
│                                        │
│ Drive Time: [45 ▾] minutes            │
│ Departure: 6:15 PM (auto-calculated)   │
│                                        │
│ Parking: [Street parking expensive]   │
└────────────────────────────────────────┘
```

---

### 1.3 Countdown-Concert Relationship

**Data Model: Table Per Type (TPT) with inheritance:**

```sql
-- Base countdowns table (generic countdowns)
CREATE TABLE countdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Core fields
  title TEXT NOT NULL,
  target_date TIMESTAMPTZ NOT NULL,
  target_time TEXT, -- "2:30 PM"

  -- Metadata
  description TEXT,
  color TEXT,
  icon TEXT,
  category TEXT,

  -- Relationships
  calendar_event_id UUID REFERENCES calendar_events(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,

  -- Type
  type TEXT NOT NULL CHECK (type IN ('generic', 'concert', 'deadline', 'birthday', 'anniversary')),

  -- Settings
  show_on_dashboard BOOLEAN DEFAULT TRUE,
  notify_at INTEGER[], -- Days before to notify: {7, 3, 1, 0}

  -- Archive
  archived BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_countdowns_user_id ON countdowns(user_id);
CREATE INDEX idx_countdowns_target_date ON countdowns(target_date);
CREATE INDEX idx_countdowns_archived ON countdowns(archived);
CREATE INDEX idx_countdowns_type ON countdowns(type);

-- Concerts table (extends countdowns)
CREATE TABLE concerts (
  id UUID PRIMARY KEY REFERENCES countdowns(id) ON DELETE CASCADE,

  -- Artist
  artist_name TEXT NOT NULL,
  supporting_acts TEXT[],

  -- Venue
  venue_id UUID REFERENCES venues(id),
  -- Denormalized venue data for performance
  venue_name TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  venue_city TEXT,
  venue_state TEXT,
  venue_zip TEXT,
  venue_latitude NUMERIC(9, 6),
  venue_longitude NUMERIC(9, 6),

  -- Tickets
  ticket_status TEXT NOT NULL CHECK (ticket_status IN (
    'interested', 'looking', 'offer_pending', 'purchased',
    'confirmed', 'ready', 'attended', 'missed', 'cancelled'
  )),
  ticket_purchase_date DATE,
  ticket_price NUMERIC(10, 2),
  ticket_confirmation TEXT,
  ticket_link TEXT,

  -- Travel
  travel_time_minutes INTEGER,
  departure_time TIMESTAMPTZ,
  parking_info TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_concerts_artist ON concerts(artist_name);
CREATE INDEX idx_concerts_ticket_status ON concerts(ticket_status);
CREATE INDEX idx_concerts_venue_id ON concerts(venue_id);

-- Venues table (reusable)
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',

  latitude NUMERIC(9, 6),
  longitude NUMERIC(9, 6),

  -- Metadata
  website TEXT,
  phone TEXT,
  capacity INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(name, city, state)
);

CREATE INDEX idx_venues_name ON venues(name);
CREATE INDEX idx_venues_city_state ON venues(city, state);
```

**TypeScript types:**

```typescript
// Base countdown
interface Countdown {
  id: string
  userId: string
  title: string
  targetDate: Date
  targetTime?: string
  description?: string
  color?: string
  icon?: string
  category?: string
  calendarEventId?: string
  taskId?: string
  spaceId: string
  type: 'generic' | 'concert' | 'deadline' | 'birthday' | 'anniversary'
  showOnDashboard: boolean
  notifyAt?: number[]
  archived: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Concert extends Countdown
interface Concert extends Countdown {
  type: 'concert'
  artistName: string
  supportingActs?: string[]
  venueId?: string
  venueName: string
  venueAddress: string
  venueCity?: string
  venueState?: string
  venueZip?: string
  venueLatitude?: number
  venueLongitude?: number
  ticketStatus: TicketStatus
  ticketPurchaseDate?: Date
  ticketPrice?: number
  ticketConfirmation?: string
  ticketLink?: string
  travelTimeMinutes?: number
  departureTime?: Date
  parkingInfo?: string
  notes?: string
}
```

---

### 1.4 Dashboard Display

#### A. Widget Layout

**Dashboard "Upcoming Events" section:**

```
┌──────────────────────────────────────────────┐
│ Upcoming Countdowns & Concerts               │
├──────────────────────────────────────────────┤
│                                              │
│ 🎵 The National                 2 DAYS       │
│    Madison Square Garden        CRITICAL     │
│    Tickets: Ready ✓                          │
│    [View Details]                            │
│                                              │
│ 💍 Wedding Anniversary         12 DAYS      │
│    URGENT                                    │
│    [View Details]                            │
│                                              │
│ 📅 Tax Deadline                85 DAYS      │
│    April 15, 2025              NORMAL        │
│    [View Details]                            │
│                                              │
│ [+ Add Countdown]  [View All]                │
└──────────────────────────────────────────────┘
```

#### B. Filtering & Sorting

**Default: Show next 5, sorted by urgency then date:**

```typescript
async function getDashboardCountdowns(userId: string): Promise<Countdown[]> {
  const countdowns = await db.countdowns.findMany({
    where: {
      userId,
      archived: false,
      showOnDashboard: true,
      targetDate: { gte: new Date() } // Future events only
    },
    include: {
      concerts: true // Join concerts if type = 'concert'
    },
    take: 5
  })

  // Sort by urgency, then date
  return countdowns.sort((a, b) => {
    const urgencyA = calculateUrgency(a.targetDate)
    const urgencyB = calculateUrgency(b.targetDate)

    const urgencyOrder = ['critical', 'urgent', 'soon', 'normal']
    const urgencyDiff = urgencyOrder.indexOf(urgencyA) - urgencyOrder.indexOf(urgencyB)

    if (urgencyDiff !== 0) return urgencyDiff

    // Same urgency, sort by date
    return a.targetDate.getTime() - b.targetDate.getTime()
  })
}
```

**User controls:**

```
[All Spaces ▾]  [All Types ▾]  [Sort: Urgency ▾]
```

#### C. Visual Design

**Card component:**

```tsx
function CountdownCard({ countdown }: { countdown: Countdown }) {
  const urgency = calculateUrgency(countdown.targetDate)
  const isConcert = countdown.type === 'concert'

  return (
    <div
      className={`countdown-card urgency-${urgency}`}
      style={{ borderLeftColor: URGENCY_COLORS[urgency] }}
    >
      <div className="countdown-header">
        <span className="countdown-icon">{countdown.icon || (isConcert ? '🎵' : '⏰')}</span>
        <h3 className="countdown-title">{countdown.title}</h3>
        <span className="countdown-time">{formatCountdown(countdown, 'simple')}</span>
      </div>

      {isConcert && (
        <div className="concert-details">
          <p className="venue">{countdown.venueName}</p>
          <p className="ticket-status">
            Tickets: {getTicketStatusLabel(countdown.ticketStatus)}
          </p>
        </div>
      )}

      <div className="countdown-footer">
        <span className={`urgency-badge urgency-${urgency}`}>
          {urgency.toUpperCase()}
        </span>
        <button onClick={() => viewDetails(countdown.id)}>
          View Details
        </button>
      </div>
    </div>
  )
}
```

---

## 2. API Endpoints

```typescript
// Countdowns CRUD
GET    /api/countdowns                     // List all (with filters)
GET    /api/countdowns/:id                 // Get single countdown
POST   /api/countdowns                     // Create countdown
PATCH  /api/countdowns/:id                 // Update countdown
DELETE /api/countdowns/:id                 // Delete countdown
POST   /api/countdowns/:id/archive         // Manually archive
POST   /api/countdowns/:id/restore         // Restore from archive

// Concerts (extends countdowns)
GET    /api/concerts                       // List concerts
GET    /api/concerts/:id                   // Get concert details
POST   /api/concerts                       // Create concert
PATCH  /api/concerts/:id                   // Update concert
PATCH  /api/concerts/:id/status            // Update ticket status
POST   /api/concerts/:id/calculate-travel  // Calculate drive time

// Venues
GET    /api/venues                         // List venues (for autocomplete)
GET    /api/venues/:id                     // Get venue details
POST   /api/venues                         // Create venue

// Dashboard
GET    /api/dashboard/countdowns           // Get dashboard countdowns
```

### Example: Create Countdown

```http
POST /api/countdowns
Content-Type: application/json

{
  "title": "Product Launch",
  "targetDate": "2025-06-15T09:00:00Z",
  "description": "Launch new feature to production",
  "color": "#2196F3",
  "icon": "🚀",
  "category": "work",
  "spaceId": "space_work",
  "type": "deadline",
  "showOnDashboard": true,
  "notifyAt": [7, 3, 1, 0]
}

Response 201:
{
  "countdown": {
    "id": "countdown_abc123",
    "title": "Product Launch",
    "targetDate": "2025-06-15T09:00:00Z",
    "description": "Launch new feature to production",
    "color": "#2196F3",
    "icon": "🚀",
    "category": "work",
    "spaceId": "space_work",
    "type": "deadline",
    "showOnDashboard": true,
    "notifyAt": [7, 3, 1, 0],
    "archived": false,
    "urgency": "normal",
    "daysUntil": 61,
    "calendarEventId": "evt_xyz789", // Auto-created
    "createdAt": "2025-04-15T14:00:00Z",
    "updatedAt": "2025-04-15T14:00:00Z"
  }
}
```

### Example: Create Concert

```http
POST /api/concerts
Content-Type: application/json

{
  "title": "The National",
  "targetDate": "2025-04-30T20:00:00Z",
  "spaceId": "space_personal",
  "type": "concert",
  "artistName": "The National",
  "supportingActs": ["Phoebe Bridgers"],
  "venueName": "Madison Square Garden",
  "venueAddress": "4 Pennsylvania Plaza, New York, NY 10001",
  "venueCity": "New York",
  "venueState": "NY",
  "ticketStatus": "purchased",
  "ticketPrice": 120.00,
  "ticketConfirmation": "ABC123XYZ",
  "travelTimeMinutes": 45,
  "notes": "Meet Sarah at door B"
}

Response 201:
{
  "concert": {
    "id": "concert_def456",
    "title": "The National",
    "targetDate": "2025-04-30T20:00:00Z",
    "spaceId": "space_personal",
    "type": "concert",
    "artistName": "The National",
    "supportingActs": ["Phoebe Bridgers"],
    "venueName": "Madison Square Garden",
    "venueAddress": "4 Pennsylvania Plaza, New York, NY 10001",
    "venueCity": "New York",
    "venueState": "NY",
    "ticketStatus": "purchased",
    "ticketPrice": 120.00,
    "ticketConfirmation": "ABC123XYZ",
    "travelTimeMinutes": 45,
    "departureTime": "2025-04-30T18:45:00Z", // Auto-calculated
    "notes": "Meet Sarah at door B",
    "urgency": "urgent",
    "daysUntil": 15,
    "calendarEventId": "evt_concert123",
    "createdAt": "2025-04-15T14:00:00Z",
    "updatedAt": "2025-04-15T14:00:00Z"
  }
}
```

### Example: Update Ticket Status

```http
PATCH /api/concerts/concert_def456/status
Content-Type: application/json

{
  "ticketStatus": "ready"
}

Response 200:
{
  "concert": {
    "id": "concert_def456",
    "ticketStatus": "ready",
    "updatedAt": "2025-04-20T10:00:00Z"
  }
}
```

---

## 3. Integration Points

### 3.1 Calendar System
- Countdown → Auto-create calendar event
- Concert → Calendar event with venue address, reminders
- Update countdown → Update calendar event
- Visual distinction (purple for concerts, orange for deadlines)

### 3.2 Task System
- Link countdown to task (deadline countdown)
- Task with deadline → Option to create countdown
- Countdown completion → Mark task as complete

### 3.3 Spaces System
- Countdowns belong to spaces
- Filter by space
- Work space = deadlines, Personal space = concerts/birthdays

### 3.4 Dashboard
- Widget showing next 5 urgent countdowns
- Color-coded by urgency
- Quick actions (view details, mark complete)

### 3.5 Notifications
- Notify X days before (configurable)
- Push notifications for critical countdowns
- Email reminders for concerts (day before)

---

## 4. Implementation Priority

### Phase 1: MVP - Basic Countdowns (Week 1)
**Est. 24 hours**

- [ ] Database schema (countdowns table) - 3h
- [ ] Countdown CRUD API - 6h
- [ ] Urgency calculation - 2h
- [ ] Dashboard widget - 6h
- [ ] Create/edit countdown UI - 4h
- [ ] Calendar integration - 3h

**MVP Deliverables:**
✅ Create/edit/delete countdowns
✅ Display on dashboard
✅ Urgency color coding
✅ Auto-create calendar events
✅ Archive expired countdowns

### Phase 2: Concerts (Week 2)
**Est. 20 hours**

- [ ] Concerts table + venues table - 3h
- [ ] Concert creation UI - 5h
- [ ] Ticket status workflow - 4h
- [ ] Venue search/autocomplete - 3h
- [ ] Concert calendar integration - 3h
- [ ] Concert details view - 2h

### Phase 3: Advanced Features (Week 3)
**Est. 12 hours**

- [ ] Drive time calculation (manual) - 2h
- [ ] Departure time auto-calculation - 2h
- [ ] Notifications (email/push) - 4h
- [ ] Recurring countdowns (birthdays) - 4h

### Phase 4: Polish (Week 4)
**Est. 8 hours**

- [ ] Multiple display formats - 3h
- [ ] Progress ring visualization - 2h
- [ ] Archive management UI - 2h
- [ ] Export countdowns (iCal) - 1h

**Defer to V2:**
- Google Maps API for drive time
- Ticket price tracking/alerts
- Concert discovery (Ticketmaster API)
- Shared countdowns (multiple users)

---

## 5. Technical Considerations

### 5.1 Caching & Performance

**Cache urgency calculations:**

```typescript
// Cache urgency for 1 hour (doesn't change frequently)
class CountdownCache {
  private urgencyCache = new Map<string, { urgency: UrgencyLevel, expiresAt: number }>()

  getUrgency(countdownId: string, targetDate: Date): UrgencyLevel {
    const cached = this.urgencyCache.get(countdownId)

    if (cached && cached.expiresAt > Date.now()) {
      return cached.urgency
    }

    const urgency = calculateUrgency(targetDate)

    this.urgencyCache.set(countdownId, {
      urgency,
      expiresAt: Date.now() + 3600000 // 1 hour
    })

    return urgency
  }
}
```

### 5.2 Real-Time Updates

**Update countdown timers every minute:**

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    setCountdowns(prev => prev.map(countdown => ({
      ...countdown,
      daysUntil: calculateDaysUntil(countdown.targetDate),
      urgency: calculateUrgency(countdown.targetDate)
    })))
  }, 60000) // Update every minute

  return () => clearInterval(interval)
}, [])
```

### 5.3 Notifications

**Notification scheduling:**

```sql
-- Notification queue
CREATE TABLE countdown_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  countdown_id UUID NOT NULL REFERENCES countdowns(id) ON DELETE CASCADE,

  notify_at TIMESTAMPTZ NOT NULL,
  days_before INTEGER NOT NULL,

  sent_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  error TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_countdown_notifications_notify_at ON countdown_notifications(notify_at)
  WHERE sent_at IS NULL;
```

**Cron job:**

```typescript
// Every 15 minutes, check for pending notifications
cron.schedule('*/15 * * * *', async () => {
  const pending = await db.countdownNotifications.findMany({
    where: {
      notifyAt: { lte: new Date() },
      sentAt: null
    },
    include: { countdown: true }
  })

  for (const notification of pending) {
    await sendNotification({
      userId: notification.countdown.userId,
      title: `Countdown: ${notification.countdown.title}`,
      body: `${notification.daysBefore} days until ${notification.countdown.title}`,
      actionUrl: `/countdowns/${notification.countdown.id}`
    })

    await db.countdownNotifications.update({
      where: { id: notification.id },
      data: { sentAt: new Date() }
    })
  }
})
```

### 5.4 Recurring Events (Birthdays)

**Handle recurring countdowns:**

```typescript
// For birthdays, auto-create next year's countdown when archived
eventEmitter.on('countdown:archived', async (countdown) => {
  if (countdown.type === 'birthday') {
    const nextYear = addYears(countdown.targetDate, 1)

    await db.countdowns.create({
      ...countdown,
      id: generateUUID(),
      targetDate: nextYear,
      archived: false,
      completedAt: null
    })
  }
})
```

---

## Summary

**MVP Focus:**
1. Basic countdowns with urgency ✅
2. Dashboard widget ✅
3. Calendar integration ✅
4. Concert tracking with ticket workflow ✅
5. Venue management ✅

**Technical Stack:**
- PostgreSQL with table-per-type inheritance
- Real-time updates (every minute)
- Notification queue for reminders
- Integration with calendar system

**Total Estimated Effort:** 64 hours (~8 days)

**Key Features:**
- Urgency-based color coding
- 6-stage ticket workflow for concerts
- Auto-calculate departure time
- Auto-archive expired events
- Dashboard widget with filtering

**Files:**
- `C:/Users/bette/Desktop/specs_and_prds/docs/design/features/countdowns/specification.md`

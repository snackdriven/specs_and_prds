# LiveJournal Clone - SPARC (Specification & Product Requirements)

**Feature Area:** Personal Journaling Platform
**Version:** 1.0
**Last Updated:** 2025-01-22
**Status:** In Development
**Type:** Single-User Personal Journal

---

## Overview

A modern, single-user LiveJournal clone designed for personal reflection and journaling. This application provides a private, distraction-free space for daily journaling with integrated mood tracking, customizable templates, and Spotify integration for capturing the moment's soundtrack.

## Problem Statement

Modern journaling platforms often include social features, sharing capabilities, and multi-user interactions that can distract from personal reflection. Users need:

- **Privacy-first design** - No sharing, no social features, no other users
- **Modern UI** - Updated interface that feels contemporary and pleasant to use
- **Structure without rigidity** - Templates to guide writing without forcing structure
- **Context capture** - Ability to record mood and current music for richer entries
- **Simplicity** - Focus on writing, not features

## Goals

### Primary Goals
1. Provide a beautiful, modern journaling interface
2. Support both structured (template-based) and free-form journaling
3. Integrate mood tracking for emotional context
4. Capture Spotify "now playing" for musical context
5. Maintain complete privacy - single user, no sharing, no cloud sync required

### Secondary Goals
1. Enable template customization
2. Support rich text formatting
3. Provide search and filtering capabilities
4. Create a pleasant, distraction-free writing experience

## User Stories

### Epic: Core Journaling
- As a user, I can create journal entries with rich text formatting
- As a user, I can save and edit my entries
- As a user, I can delete entries I no longer want
- As a user, I can view all my entries in a chronological list
- As a user, I can search my entries by content

### Epic: Templates
- As a user, I can choose from pre-built journal templates
- As a user, I can create custom templates with my own prompts
- As a user, I can edit existing templates
- As a user, I can start a new entry without a template (free-form)

### Epic: Mood Integration
- As a user, I can select my current mood when creating an entry
- As a user, I can see my mood displayed with each entry
- As a user, I can filter entries by mood
- As a user, I can see mood trends over time

### Epic: Spotify Integration
- As a user, I can connect my Spotify account
- As a user, I can capture "now playing" track when creating an entry
- As a user, I can see the track that was playing when I wrote each entry
- As a user, I can play the track from within the journal entry

## Functional Requirements

### FR1: Journal Entry Management
**Priority:** P0 (Critical)

**Entry Structure:**
```typescript
interface JournalEntry {
  id: string;
  title?: string;
  content: string; // Rich text/HTML
  mood?: MoodType;
  spotifyTrack?: {
    trackId: string;
    trackName: string;
    artistName: string;
    albumName: string;
    albumArt: string;
    previewUrl?: string;
    spotifyUrl: string;
  };
  templateId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  entryDate: Date; // Date the entry is for (can be different from createdAt)
}
```

**CRUD Operations:**
- Create: New entry with optional title, content, mood, Spotify track
- Read: List view with previews, detail view for full entry
- Update: Edit existing entries (title, content, mood, tags)
- Delete: Remove entries with confirmation

**Rich Text Editor:**
- Bold, italic, underline formatting
- Lists (ordered and unordered)
- Links
- Headings (H1-H3)
- Auto-save drafts every 30 seconds
- Word count display

### FR2: Templates System
**Priority:** P1 (High)

**Template Structure:**
```typescript
interface JournalTemplate {
  id: string;
  name: string;
  description?: string;
  prompts: Array<{
    id: string;
    label: string;
    placeholder?: string;
    required: boolean;
    order: number;
  }>;
  isDefault: boolean; // Pre-built templates
  createdAt: Date;
  updatedAt: Date;
}
```

**Pre-built Templates:**
1. **Daily Reflection**
   - What went well today?
   - What was challenging?
   - What am I grateful for?
   - What did I learn?

2. **Morning Pages**
   - Free-form writing prompt
   - Stream of consciousness

3. **Evening Review**
   - How did today go?
   - What would I do differently?
   - Tomorrow's intentions

4. **Gratitude Journal**
   - Three things I'm grateful for
   - Why each matters

5. **Problem Solving**
   - What's the problem?
   - What are possible solutions?
   - What's my next step?

6. **Goal Setting**
   - What do I want to achieve?
   - Why is this important?
   - What's my plan?

**Custom Templates:**
- Users can create templates from scratch
- Users can modify existing templates (creates a copy)
- Templates can be deleted (except pre-built ones)

**Template Usage:**
- Select template when creating new entry
- Prompts appear as form fields or sections
- User can skip optional prompts
- Content is saved preserving template structure

### FR3: Mood Integration
**Priority:** P1 (High)

**Mood Types:**
```typescript
type MoodType = 
  | 'ecstatic'    // 😄
  | 'happy'       // 😊
  | 'content'     // 🙂
  | 'neutral'     // 😐
  | 'melancholic' // 😔
  | 'anxious'     // 😰
  | 'angry'       // 😠
  | 'exhausted'   // 😴
  | 'inspired'    // ✨
  | 'peaceful';   // 🕊️
```

**Mood Features:**
- Mood selector when creating/editing entries
- Mood displayed as emoji + label on entry cards
- Filter entries by mood
- Mood statistics (mood distribution over time)
- Optional mood notes/description

**Mood Display:**
- Color-coded mood indicators
- Mood emoji in entry list
- Mood filter sidebar
- Mood trend visualization (optional)

### FR4: Spotify Integration
**Priority:** P1 (High)

**Spotify OAuth:**
- Connect Spotify account via OAuth 2.0
- Store access token securely (local storage)
- Refresh token handling
- Disconnect option

**Now Playing Capture:**
- "Capture Now Playing" button in entry editor
- Fetches current track from Spotify Web API
- Displays track info (name, artist, album, album art)
- Saves track metadata with entry

**Track Display:**
- Album art thumbnail in entry
- Track name, artist, album
- Link to Spotify track
- Optional: 30-second preview playback
- Optional: Play button to open in Spotify

**API Requirements:**
- Spotify Web API: `user-read-currently-playing`
- Spotify Web API: `user-read-playback-state`
- Track metadata: name, artist, album, images, preview_url, external_urls

**Error Handling:**
- Handle no active playback gracefully
- Show message if Spotify not connected
- Handle token expiration with re-auth prompt

### FR5: Search & Filtering
**Priority:** P2 (Medium)

**Search:**
- Full-text search across titles and content
- Highlight search matches
- Search history (recent searches)
- Clear search button

**Filters:**
- By date range (calendar picker)
- By mood
- By template used
- By tags
- By Spotify artist/album
- Combined filters (AND logic)

**Sort Options:**
- Newest first (default)
- Oldest first
- Alphabetical by title
- By mood

### FR6: Data Persistence
**Priority:** P0 (Critical)

**Storage Strategy:**
- Local-first: All data stored in browser localStorage
- Export/Import: JSON export for backup
- No cloud sync (privacy-first)
- IndexedDB for larger datasets (future)

**Data Structure:**
```typescript
interface AppData {
  entries: JournalEntry[];
  templates: JournalTemplate[];
  settings: {
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
    defaultMood?: MoodType;
    theme?: 'light' | 'dark' | 'auto';
  };
}
```

**Export/Import:**
- Export all data as JSON file
- Import JSON file to restore data
- Merge vs replace options
- Validation on import

## Technical Specifications

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for data management
- LocalStorage for persistence

**Rich Text Editor:**
- Tiptap or Slate.js for rich text editing
- Markdown support (optional)

**Spotify Integration:**
- Spotify Web API
- OAuth 2.0 flow
- Axios or Fetch for API calls

**UI Components:**
- Radix UI or Headless UI for accessible components
- Lucide React for icons
- Date-fns for date handling

### Component Architecture

```
src/
├── components/
│   ├── journal/
│   │   ├── EntryList.tsx
│   │   ├── EntryCard.tsx
│   │   ├── EntryEditor.tsx
│   │   ├── EntryDetail.tsx
│   │   └── RichTextEditor.tsx
│   ├── templates/
│   │   ├── TemplateSelector.tsx
│   │   ├── TemplateEditor.tsx
│   │   └── TemplateCard.tsx
│   ├── mood/
│   │   ├── MoodSelector.tsx
│   │   └── MoodFilter.tsx
│   ├── spotify/
│   │   ├── SpotifyConnect.tsx
│   │   ├── NowPlayingCapture.tsx
│   │   └── TrackDisplay.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── SearchBar.tsx
├── hooks/
│   ├── useJournal.ts
│   ├── useTemplates.ts
│   ├── useSpotify.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── storage.ts
│   ├── spotify.ts
│   └── utils.ts
└── types/
    └── index.ts
```

### Data Models

**Journal Entry:**
```typescript
interface JournalEntry {
  id: string; // UUID
  title?: string;
  content: string; // HTML or Markdown
  mood?: MoodType;
  spotifyTrack?: SpotifyTrack;
  templateId?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  entryDate: Date;
}

interface SpotifyTrack {
  trackId: string;
  trackName: string;
  artistName: string;
  albumName: string;
  albumArt: string;
  previewUrl?: string;
  spotifyUrl: string;
  capturedAt: Date;
}
```

**Template:**
```typescript
interface JournalTemplate {
  id: string;
  name: string;
  description?: string;
  prompts: TemplatePrompt[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplatePrompt {
  id: string;
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
}
```

## User Experience

### Design Principles

1. **Privacy First**
   - No sharing buttons
   - No social features
   - Clear indication that data is local-only

2. **Minimal Distraction**
   - Clean, focused writing interface
   - Hide UI chrome when writing
   - Full-screen writing mode option

3. **Modern Aesthetics**
   - Contemporary color palette
   - Smooth animations
   - Responsive design
   - Dark mode support

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - High contrast mode option
   - Focus indicators

### User Flows

**Creating a New Entry:**
1. Click "New Entry" button
2. Optionally select a template
3. Fill in title (optional)
4. Write content in rich text editor
5. Optionally select mood
6. Optionally capture Spotify now playing
7. Add tags (optional)
8. Save entry

**Using a Template:**
1. Click "New Entry"
2. Select template from dropdown
3. Template prompts appear as form fields
4. Fill in prompts (required ones marked)
5. Content auto-populates editor
6. Edit as needed
7. Save

**Capturing Spotify Track:**
1. Have Spotify playing
2. In entry editor, click "Capture Now Playing"
3. System fetches current track
4. Track info appears in entry
5. Save entry with track metadata

## Success Metrics

### Functional Metrics
- ✅ Users can create, edit, delete entries
- ✅ Templates work correctly
- ✅ Mood selection and display works
- ✅ Spotify integration captures tracks
- ✅ Search and filter function properly
- ✅ Data persists in localStorage

### User Experience Metrics
- Fast page load (< 2 seconds)
- Smooth typing experience (no lag)
- Intuitive UI (no user confusion)
- Responsive on mobile devices

## Future Enhancements

### v1.1
- Markdown support
- Entry export (PDF, Markdown)
- Entry statistics (word count, writing streaks)
- Calendar view of entries

### v1.2
- Tag management system
- Advanced search (full-text with operators)
- Entry templates with variables
- Custom mood types

### v2.0
- Optional cloud backup (encrypted)
- Mobile app (React Native)
- Voice-to-text journaling
- Photo attachments

## Implementation Checklist

- [ ] Set up React + TypeScript + Vite project
- [ ] Configure Tailwind CSS
- [ ] Set up component structure
- [ ] Implement localStorage persistence
- [ ] Build rich text editor
- [ ] Create entry CRUD operations
- [ ] Build template system
- [ ] Implement mood selector
- [ ] Integrate Spotify OAuth
- [ ] Add Spotify "now playing" capture
- [ ] Build search and filtering
- [ ] Create modern UI components
- [ ] Add responsive design
- [ ] Implement dark mode
- [ ] Add export/import functionality
- [ ] Write documentation

## Open Questions

1. Should we support Markdown or just rich text?
2. Should templates be editable or only copyable?
3. How long should Spotify tokens be cached?
4. Should we support multiple Spotify accounts?
5. What's the maximum entry size limit?

---

## Related Documents

- [Journal PRD](./05-journal-prd.md) - Reference for similar features
- [Mood Logging PRD](./04-mood-logging-prd.md) - Mood integration patterns

---

**Last Updated:** 2025-01-22
**Status:** Specification Complete, Implementation In Progress


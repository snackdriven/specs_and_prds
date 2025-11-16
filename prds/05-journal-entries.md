# PRD: Journal Entries

## Overview

**Feature Name:** Journal Entries
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented
**Owner:** Product Team

## Executive Summary

The Journal Entries system provides users with a digital journaling platform for reflection, gratitude, planning, and free-form writing. It supports both structured (template-based) and unstructured journaling, with privacy controls, rich text formatting, and organizational tools through Spaces and Tags. The feature aims to make journaling a sustainable daily practice by reducing friction and providing meaningful ways to revisit past entries.

## Problem Statement

Users struggle with:
- Maintaining a consistent journaling practice
- Finding time and energy to write meaningful entries
- Knowing what to write about (writer's block)
- Keeping private thoughts secure and organized
- Revisiting and learning from past journal entries
- Balancing structure (prompts) with creative freedom
- Managing journals across different life areas (work reflections, personal growth, gratitude, etc.)
- Accessing journals across devices

## Goals & Success Metrics

### Goals
1. Make journaling frictionless and accessible (< 15 seconds to start writing)
2. Support both guided (template) and free-form journaling
3. Provide meaningful ways to search, filter, and revisit entries
4. Ensure privacy and security of sensitive personal content
5. Encourage consistency through gentle prompts and streaks
6. Enable reflection and personal growth through entry review

### Success Metrics
- **Journal Frequency:** Average entries per user per week
- **Entry Retention:** % of users still journaling after 30 days
- **Entry Length:** Average word count per entry (indicates depth)
- **Template Usage:** % of entries created with templates vs. free-form
- **Search Usage:** % of users who search/filter old entries
- **Consistency Streak:** Average consecutive days with entries
- **Entry Revisit Rate:** % of entries viewed again after creation
- **Word Count Over Time:** Trend of entry depth (increasing = engagement)

## User Personas

### Primary: The Reflective Writer
- **Demographics:** 25-50 years old, values self-awareness and growth
- **Needs:** Regular reflection space, prompts for deeper thinking, privacy
- **Pain Points:** Inconsistency, forgetting insights, scattered journal locations
- **Usage Pattern:** Evening reflection sessions, morning gratitude entries

### Secondary: The Therapy Companion
- **Demographics:** 20-60 years old, in therapy or working on mental health
- **Needs:** Process emotions, prepare for therapy, track progress
- **Pain Points:** Losing track of thoughts between sessions, difficulty articulating feelings
- **Usage Pattern:** Daily emotional processing, weekly therapy prep

### Tertiary: The Gratitude Practitioner
- **Demographics:** 25-65 years old, focused on positive psychology
- **Needs:** Daily gratitude logging, positive memory bank
- **Pain Points:** Repetitive entries, forgetting good moments
- **Usage Pattern:** Morning or evening gratitude ritual, 3-5 items per day

### Quaternary: The Life Logger
- **Demographics:** 18-40 years old, documentation enthusiast
- **Needs:** Chronicle daily life, capture memories, future reminiscence
- **Pain Points:** Time-consuming writing, organizing entries, finding old memories
- **Usage Pattern:** End-of-day recaps, photo journals (future), travel logs

## Functional Requirements

### 1. Journal Entry Creation

#### 1.1 Quick Entry Interface
**Priority:** P0 (Critical)
- **Location:**
  - Dashboard quick capture section
  - Dedicated Journal view
  - Floating action button (mobile)
- **Fields:**
  - Content (required, rich text, no max length)
  - Title (optional, max 200 characters)
  - Privacy toggle (private/public - future sharing)
  - Space selector (optional)
  - Tag selector (optional, multi-select)
- **Auto-save:**
  - Save draft every 30 seconds
  - Preserve content on accidental close
  - "Unsaved changes" warning

#### 1.2 Template-Based Entries
**Priority:** P1 (High)
- **Built-in Templates:**
  - **Daily Reflection:** "What went well today? What could be improved? What am I grateful for?"
  - **Gratitude:** "3 things I'm grateful for today"
  - **Weekly Review:** "Wins this week, Challenges faced, Lessons learned, Goals for next week"
  - **Morning Pages:** "Stream of consciousness - write whatever comes to mind"
  - **Goal Setting:** "My goal, Why it matters, Action steps, Success criteria"
  - **Mood Journal:** "How I'm feeling, What triggered it, What I need"
- **Template Structure:**
  - Prompts as section headers
  - Rich text fields for each prompt
  - Optional fields (can skip prompts)
  - Save as free-form after creation
- **Custom Templates (Future):**
  - User-created templates
  - Template library/marketplace

#### 1.3 Rich Text Editor
**Priority:** P1 (High)
- **Formatting:**
  - Bold, italic, underline
  - Headers (H1, H2, H3)
  - Bullet and numbered lists
  - Blockquotes
  - Horizontal rules
  - Links
- **Editor Features:**
  - Markdown support (optional mode)
  - Word count display
  - Reading time estimate
  - Focus mode (distraction-free)
- **Media Support (Future):**
  - Image uploads
  - Voice note attachments
  - Video embeds

### 2. Journal Entry Display

#### 2.1 Entry List View
**Priority:** P0 (Critical)
- **Chronological Feed:**
  - Most recent entries first
  - Grouped by date ("Today", "Yesterday", "Last Week", month labels)
  - Card-based layout
- **Entry Card Elements:**
  - Title (if provided) or generated preview
  - Content preview (first 200 characters)
  - Timestamp (relative: "2 hours ago" or absolute: "Jan 15, 2025")
  - Word count badge
  - Space and tag badges
  - Privacy indicator (lock icon for private)
  - Quick actions (edit, delete, share)
- **Pagination:**
  - Load 20 entries initially
  - Infinite scroll or "Load more" button
  - Performance optimization for large archives

#### 2.2 Entry Detail View
**Priority:** P0 (Critical)
- **Full-Screen Reading Mode:**
  - Distraction-free layout
  - Full content with formatting
  - Metadata section (date, word count, tags, space)
  - Edit and delete actions
  - Navigation to previous/next entry
- **Reading Experience:**
  - Optimized typography (readable font, line height, width)
  - Dark mode support
  - Text size controls
  - Print/export entry option

#### 2.3 Calendar View
**Priority:** P2 (Nice to Have)
- Month calendar with entry indicators
- Dots or colors showing days with entries
- Click date to view entries from that day
- Visual streaks (consecutive journaling days)
- Monthly summary stats (total entries, avg word count)

### 3. Journal Organization & Discovery

#### 3.1 Search
**Priority:** P1 (High)
- **Full-Text Search:**
  - Search across titles and content
  - Real-time search results
  - Highlight matching terms in results
  - Search within specific date ranges
  - Search within specific spaces or tags
- **Search Operators:**
  - Exact phrase: "exact match"
  - Exclude: -word
  - OR operator: word1 OR word2
  - Tag search: #tagname

#### 3.2 Filtering
**Priority:** P1 (High)
- **Filter Options:**
  - By date range (custom, last 7 days, last 30 days, last year)
  - By space
  - By tag (multiple tags, AND/OR logic)
  - By privacy status (private, public)
  - By presence of title
  - By word count range
- **Active Filters Display:**
  - Filter chips showing active filters
  - Clear individual filters
  - Clear all filters button
  - Saved filter presets (future)

#### 3.3 Sorting
**Priority:** P1 (High)
- **Sort Options:**
  - Date created (newest first, oldest first)
  - Date modified (recently edited)
  - Title (A-Z, Z-A)
  - Word count (longest, shortest)
- **Remember User Preference:**
  - Last used sort order
  - Per-space sort preferences (future)

#### 3.4 Favorites/Bookmarks
**Priority:** P2 (Nice to Have)
- Star/favorite important entries
- "Favorites" filter for quick access
- Favorite count in user stats
- Featured entry on dashboard (random favorite)

### 4. Journal Entry Management

#### 4.1 Edit Entry
**Priority:** P0 (Critical)
- Click entry to open edit mode
- Same rich text editor as creation
- All metadata editable (title, space, tags, privacy)
- Auto-save during editing
- "Last edited" timestamp
- Edit history (future: version control)

#### 4.2 Delete Entry
**Priority:** P0 (Critical)
- Delete action in entry menu
- Strong confirmation dialog (destructive action)
- Optional: soft delete with 30-day recovery (trash)
- Permanent deletion after confirmation
- Success toast notification
- Undo option (5-second window) for accidental deletion

#### 4.3 Duplicate Entry
**Priority:** P2 (Nice to Have)
- Duplicate action creates copy
- Useful for template-like entries
- Editable after duplication
- Clear "Copy" indication in title

#### 4.4 Archive Entry
**Priority:** P2 (Nice to Have)
- Archive action hides from main view
- Archived entries in separate section
- Useful for old entries to reduce clutter
- Unarchive action available
- Archived entries still searchable

### 5. Privacy & Sharing

#### 5.1 Privacy Settings
**Priority:** P1 (High)
- **Per-Entry Privacy:**
  - Private (default): only user can see
  - Public (future): can be shared
  - Space-level default privacy
- **Privacy Indicator:**
  - Lock icon for private entries
  - Globe icon for public entries (future)
  - Clear visual distinction

#### 5.2 Sharing (Future - Phase 2)
**Priority:** P3 (Future)
- Share individual entries via link
- Time-limited sharing links
- Password-protected shares
- Revoke sharing access
- View count for shared entries

### 6. Journal Prompts & Inspiration

#### 6.1 Daily Prompts
**Priority:** P2 (Nice to Have)
- Rotating daily journaling prompt
- Display on dashboard and journal view
- Categories: reflection, gratitude, creativity, goals
- "Use this prompt" button creates templated entry
- Prompt history (view past prompts)

#### 6.2 Prompt Library
**Priority:** P2 (Nice to Have)
- Browsable prompt collection
- Filter by category, mood, purpose
- User-submitted prompts (future)
- Save favorite prompts
- Random prompt generator

### 7. Journal Analytics

#### 7.1 Writing Stats
**Priority:** P2 (Nice to Have)
- **Statistics Dashboard:**
  - Total entries (all-time)
  - Current streak (consecutive days with entries)
  - Longest streak
  - Total word count (all entries combined)
  - Average words per entry
  - Most productive day of week
  - Most productive time of day
  - Entries by month (bar chart)
- **Visual Representations:**
  - Heatmap calendar (like GitHub contributions)
  - Word count trend over time
  - Tag cloud (most used tags)

#### 7.2 Reflection Prompts
**Priority:** P3 (Future)
- AI-generated insights from past entries
- "On this day" reminders (entries from past years)
- Common themes identification
- Sentiment analysis over time
- Word frequency analysis

## Non-Functional Requirements

### Performance
- Entry creation: < 500ms save time
- Entry list load: < 200ms for 20 entries
- Search results: < 300ms for full-text search
- Rich text editor: smooth typing experience (no lag)
- Auto-save: non-blocking, background operation

### Accessibility
- Full keyboard navigation
- Screen reader support for rich text
- High contrast mode
- Keyboard shortcuts for formatting
- Skip links for long entries

### Privacy & Security
- **Critical:** Journals contain highly sensitive personal information
- End-to-end encryption (future consideration)
- Strict user data isolation
- No analytics tracking on entry content (only metadata)
- Secure deletion (overwrite data, not just mark deleted)
- Export all data (GDPR compliance)
- Account deletion = permanent journal deletion

### Data Integrity
- Auto-save prevents data loss
- Conflict resolution for multi-device editing (future)
- Entry versioning for recovery (future)
- Reliable timestamps (UTC, displayed in user's timezone)

### Scalability
- Support 10,000+ entries per user (decades of journaling)
- Efficient full-text search indexing
- Pagination for performance
- Lazy loading of entry content
- Database indexing on user_id, created_at, tags

## User Experience

### Information Architecture
```
Journal View
├── Header
│   ├── Page Title
│   ├── Create Entry Button
│   ├── Template Selector
│   └── View Toggles (List, Calendar)
├── Search & Filters
│   ├── Search Input
│   ├── Date Range Filter
│   ├── Space Filter
│   ├── Tag Filter
│   ├── Privacy Filter
│   └── Active Filter Chips
├── Sort Controls
├── Entry List
│   ├── Entry Card 1
│   │   ├── Title / Preview
│   │   ├── Timestamp
│   │   ├── Word Count
│   │   ├── Tags
│   │   └── Quick Actions
│   ├── Entry Card 2
│   └── ... Entry Card N
└── Load More Button

Entry Editor
├── Title Input (optional)
├── Rich Text Editor
│   ├── Formatting Toolbar
│   ├── Content Area
│   └── Word Count / Auto-save Indicator
├── Metadata Section
│   ├── Privacy Toggle
│   ├── Space Selector
│   └── Tag Selector
└── Save / Cancel Buttons

Entry Detail View
├── Header
│   ├── Title
│   ├── Metadata (Date, Word Count, Reading Time)
│   └── Actions (Edit, Delete, Share, Favorite)
├── Content (Rendered with Formatting)
├── Tags & Space Badges
└── Navigation (Previous / Next Entry)
```

### User Flows

#### Flow 1: Morning Gratitude Journaling
1. User opens Daybeam app
2. Sees daily prompt on dashboard: "What are you grateful for today?"
3. Clicks "Quick Journal Entry"
4. Selects "Gratitude" template
5. Template loads with 3 prompt fields
6. User types:
   - "Good night's sleep"
   - "Supportive partner"
   - "Morning coffee and sunshine"
7. Auto-save activates (saves draft)
8. User clicks "Save Entry"
9. Entry appears in journal list
10. Success toast: "Gratitude entry saved 🌟"

#### Flow 2: Evening Reflection
1. User navigates to Journal view
2. Clicks "Create Entry" button
3. Selects "Daily Reflection" template
4. Template prompts:
   - "What went well today?"
   - "What could be improved?"
   - "What am I grateful for?"
5. User writes detailed responses (500 words total)
6. Word count updates in real-time
7. User assigns to "Personal" space
8. User adds tags: #reflection, #growth
9. User sets privacy to "Private"
10. User clicks "Save"
11. Entry saved and appears at top of list

#### Flow 3: Searching Past Entries
1. User wants to find entries about "meditation"
2. User navigates to Journal view
3. User types "meditation" in search box
4. Results appear in real-time (8 matching entries)
5. Matching text highlighted in previews
6. User clicks first result
7. Full entry opens in detail view
8. User reads entry from 3 months ago
9. User reflects on progress made since then

#### Flow 4: Weekly Review Routine
1. User opens Journal on Sunday evening
2. Clicks "Create Entry"
3. Selects "Weekly Review" template
4. Template has structured prompts:
   - "Wins this week"
   - "Challenges faced"
   - "Lessons learned"
   - "Goals for next week"
5. User reviews calendar to recall week
6. User fills each section
7. User adds tags: #weekly-review, #planning
8. Entry saved
9. User commits to next week's goals

### Visual Design

#### Entry Card Design
```
┌─────────────────────────────────────────┐
│ 🔒 Morning Reflections                  │
│ Today at 8:42 AM • 342 words             │
│                                          │
│ "Started the day with meditation and... │
│ felt a sense of calm that carried...    │
│                                          │
│ 💼 Personal | #meditation #gratitude    │
│                                  [Edit] ✕│
└─────────────────────────────────────────┘
```

#### Rich Text Editor
- Clean, minimal toolbar
- Distraction-free writing area
- Subtle background
- Focus mode: hides sidebar and other UI
- Character/word count in bottom corner
- Auto-save indicator (pulsing dot)

#### Typography
- Serif font for reading (Georgia, Times New Roman)
- Larger line height (1.6-1.8)
- Optimal line length (60-70 characters)
- Generous margins
- Muted colors for metadata

## Technical Specifications

### Frontend Components
```typescript
<JournalView>
  <JournalHeader>
    <h1>Journal</h1>
    <CreateEntryButton />
    <TemplateSelector templates={journalTemplates} />
  </JournalHeader>

  <SearchAndFilters>
    <SearchInput />
    <DateRangeFilter />
    <SpaceFilter />
    <TagFilter />
    <PrivacyFilter />
  </SearchAndFilters>

  <JournalEntriesList>
    {entries.map(entry => (
      <JournalEntryCard
        key={entry.id}
        entry={entry}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ))}
  </JournalEntriesList>

  <JournalEditorDialog />
</JournalView>

<RichTextEditor>
  <FormattingToolbar>
    <BoldButton />
    <ItalicButton />
    <UnderlineButton />
    <HeadingDropdown />
    <ListButtons />
    <LinkButton />
  </FormattingToolbar>

  <EditableContent
    content={content}
    onChange={handleChange}
    onBlur={handleAutoSave}
  />

  <EditorFooter>
    <WordCount count={wordCount} />
    <AutoSaveIndicator saving={isSaving} />
  </EditorFooter>
</RichTextEditor>
```

### Data Models
```typescript
interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string; // HTML or Markdown
  privacy: 'private' | 'public';
  space_id?: string;
  word_count: number;
  is_favorite: boolean;
  is_archived: boolean;
  template_id?: string;
  created_at: string;
  updated_at: string;
}

interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  prompts: {
    label: string;
    placeholder: string;
    required: boolean;
  }[];
  category: string;
}

interface JournalStats {
  total_entries: number;
  total_word_count: number;
  average_words_per_entry: number;
  current_streak: number; // consecutive days with entries
  longest_streak: number;
  entries_this_month: number;
  favorite_time_of_day: string; // "morning", "afternoon", "evening"
  most_productive_day: string; // "Monday", etc.
}
```

### API Endpoints
```
POST   /journal                           Create journal entry
GET    /users/:user_id/journal            List entries (with filters, pagination)
GET    /journal/:id                       Get specific entry
PUT    /journal/:id                       Update entry
DELETE /journal/:id                       Delete entry
POST   /journal/:id/favorite              Toggle favorite
POST   /journal/:id/archive               Archive entry

GET    /users/:user_id/journal/search     Full-text search
GET    /users/:user_id/journal/stats      Get journaling statistics
GET    /users/:user_id/journal/calendar   Get calendar data (entries by date)

GET    /journal/templates                 List available templates
GET    /journal/prompts/daily             Get daily prompt
```

### Rich Text Storage
- Store as HTML (sanitized) or Markdown
- Sanitize HTML on server to prevent XSS
- Use DOMPurify or similar library
- Support conversion between formats

### Auto-Save Implementation
```typescript
const useAutoSave = (content: string, entryId?: string) => {
  const [isSaving, setIsSaving] = useState(false);
  const debouncedSave = useMemo(
    () =>
      debounce(async (data: string) => {
        setIsSaving(true);
        try {
          if (entryId) {
            await updateJournalEntry(entryId, { content: data });
          } else {
            // Save as draft
            await saveDraft({ content: data });
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
      }, 2000), // 2-second debounce
    [entryId]
  );

  useEffect(() => {
    if (content) {
      debouncedSave(content);
    }
  }, [content, debouncedSave]);

  return isSaving;
};
```

## Dependencies

### Internal
- Spaces system (entry organization)
- Tags system (entry categorization)
- Dashboard (quick journal capture)
- Mood tracking (optional link moods to entries)

### External
- React Query (data fetching)
- Rich text editor library (Tiptap, Slate, or Draft.js)
- date-fns (date handling)
- DOMPurify (HTML sanitization)
- Fuse.js or ElasticSearch (full-text search)
- Radix UI (dialogs)
- Lucide React (icons)

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Data loss due to browser crashes | Critical | Low | Auto-save every 30 seconds, localStorage backup, recovery dialog on reopen |
| Privacy breach (unauthorized access) | Critical | Low | Strong authentication, encryption, strict RBAC, security audits |
| Users feel overwhelmed by blank page | Medium | High | Offer templates and prompts, gentle guidance, low-pressure environment |
| Rich text formatting breaks on display | Medium | Medium | Sanitize and validate HTML, thorough testing, fallback to plain text |
| Performance issues with very long entries | Medium | Low | Virtualization, lazy loading, warn at extreme word counts |
| Users abandon journaling after initial enthusiasm | High | Medium | Gentle reminders, streak tracking, celebrate milestones, low friction |

## Future Enhancements

### Phase 2
- Voice-to-text journaling
- Image uploads and photo journals
- Drawing/sketching capability
- Custom templates created by users
- Sharing entries with friends or therapists
- "On this day" reminders (past entries)

### Phase 3
- Collaborative journaling (shared journals)
- AI writing assistant (suggest completions, fix grammar)
- Sentiment analysis over time
- Theme and topic extraction from entries
- Integration with mood and habit tracking (link entries)
- Export to PDF, EPUB, or physical book

### Phase 4
- Handwriting input (stylus support)
- Multi-language support with translation
- Voice journals (audio recordings)
- Video journals
- Integration with therapy platforms
- Publish anonymized excerpts to community

## Open Questions

1. Should we support collaborative journaling (shared entries) in v1 or wait?
2. What's the ideal auto-save frequency - too often causes server load, too infrequent risks data loss?
3. Should we limit entry length, or allow unlimited writing?
4. How do we handle users with 10+ years of journal data (storage, performance)?
5. Should favorites be a separate feature or just a tag?
6. What's the minimum viable rich text formatting (start simple or full featured)?

## Appendix

### A. Journaling Best Practices (Educational Content)
- **Consistency over perfection:** Write something, even if brief
- **No judgment:** Journal is for you, not performance
- **Experiment:** Try different templates and styles
- **Review:** Revisit entries to identify patterns and growth
- **Gratitude focus:** Balance challenges with appreciation
- **Prompt use:** Use prompts when stuck, ignore when flowing

### B. Template Ideas
- Morning Pages (stream of consciousness)
- Evening Reflection
- Gratitude (daily/weekly)
- Goal Setting and Review
- Dream Journal
- Travel Journal
- Reading/Learning Log
- Therapy Preparation
- Decision Making (pros/cons, feelings)
- Relationship Reflection
- Career Development Log

### C. Keyboard Shortcuts
- `Cmd/Ctrl + J` - Create new journal entry
- `Cmd/Ctrl + S` - Save entry (manual save)
- `Cmd/Ctrl + B` - Bold
- `Cmd/Ctrl + I` - Italic
- `Cmd/Ctrl + U` - Underline
- `Cmd/Ctrl + K` - Insert link
- `Cmd/Ctrl + F` - Search entries
- `Escape` - Close editor
- `Cmd/Ctrl + Shift + F` - Focus mode (distraction-free)

### D. Analytics Events
```
- journal_entry_created
- journal_entry_edited
- journal_entry_deleted
- journal_entry_favorited
- journal_entry_archived
- journal_template_used
- journal_prompt_used
- journal_searched
- journal_filtered
- journal_streak_milestone (7, 30, 100, 365 days)
- journal_word_count_milestone (10k, 50k, 100k words)
- journal_entry_shared (future)
```

### E. Privacy & Security Considerations
- **Encryption at rest:** Encrypt journal content in database
- **Encryption in transit:** HTTPS for all API calls
- **Access logs:** Monitor unauthorized access attempts
- **Data export:** Allow users to download all entries
- **Right to deletion:** Permanent deletion on request
- **No content mining:** Never use journal content for AI training without explicit consent
- **Minimal metadata:** Store only essential data, no tracking

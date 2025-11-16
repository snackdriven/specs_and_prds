# Journal - Product Requirements Document

**Feature Area:** Journaling & Reflective Writing
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Journal system provides template-based reflective writing with mood context integration. Designed to reduce the friction of journaling for ADHD users through structured prompts while maintaining flexibility for free-form expression.

## Problem Statement

Traditional journaling fails ADHD users because:
- **Blank page paralysis** - "What should I write about?" is overwhelming
- **Inconsistent practice** - Hard to build journaling habit without structure
- **Lost insights** - Past entries hard to search or analyze
- **No context** - Entries exist in isolation without life context

## Goals

### Primary Goals
1. Reduce journaling friction through templates and prompts
2. Integrate mood and activity context automatically
3. Support both structured and free-form entries
4. Make past entries easily searchable and reviewable
5. Celebrate writing consistency

### Secondary Goals
1. Share templates with community
2. Analyze journal patterns and themes
3. Export for personal records
4. Link entries to specific events or periods

## User Stories

### Epic: Basic Journaling
- As a user, I can create journal entries with title and content
- As a user, I can save drafts and come back later
- As a user, I can edit past entries
- As a user, I can search my journal entries
- As a user, I can delete entries I no longer want

### Epic: Templates & Prompts
- As a user, I can use pre-built journal templates
- As a user, I can create custom templates
- As a user, I can add prompts to guide my writing
- As a user, I can share templates publicly
- As a user, I can browse community templates

### Epic: Mood Context Integration
- As a user, I can see my mood when I wrote an entry
- As a user, I can review entries by mood state
- As a user, I can log mood while journaling
- As a user, I can see patterns between writing and mood

### Epic: Writing Analytics
- As a user, I can track word count
- As a user, I can see writing streak
- As a user, I can view journaling frequency
- As a user, I can celebrate writing milestones

### Epic: Calendar Integration
- As a user, I can view entries on calendar
- As a user, I can create entries for specific dates
- As a user, I can see journal frequency on calendar
- As a user, I can review "one year ago today" entries

## Functional Requirements

### FR1: Journal Entry CRUD
**Priority:** P0 (Critical)

**Create Entry:**
```typescript
interface JournalEntry {
  id: string;
  user_id: string;
  title?: string; // Optional
  content: string;
  word_count: number; // Auto-calculated
  mood_entry_id?: string; // Link to mood log
  template_id?: string; // Template used (if any)
  tags?: string[]; // JSONB array
  created_at: Date;
  updated_at: Date;
}
```

**Rich Text Editor:**
- Markdown support preferred
- Or simple rich text (bold, italic, lists)
- Auto-save drafts
- Character/word count display

**Mood Context:**
- Auto-link to most recent mood entry
- Or prompt to log mood while writing
- Display mood context in entry metadata

**Read Entries:**
- List view with previews
- Full entry detail view
- Search across titles and content
- Filter by date, tag, template, mood

**Update Entry:**
- Edit anytime
- Show "last edited" timestamp
- Version history (future)

**Delete Entry:**
- Soft delete for recovery
- Hard delete permanently removes

### FR2: Templates System
**Priority:** P1 (High)

**Template Structure:**
```typescript
interface JournalTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  prompts: Array<{
    id: string;
    question: string;
    order: number;
    required: boolean;
  }>;
  is_public: boolean; // Share with community
  category?: string; // Gratitude, Reflection, Planning, etc.
  created_at: Date;
  updated_at: Date;
}
```

**Default Templates:**
- Daily Reflection (gratitude, wins, challenges)
- Morning Pages (free writing)
- Evening Review (day summary)
- Gratitude Journal (3 things grateful for)
- Problem Solving (describe problem, brainstorm solutions)
- Goal Setting (weekly/monthly goals)

**Custom Templates:**
- User can create from scratch
- Or modify default templates
- Reorder prompts
- Set required vs optional prompts

**Public Templates:**
- Users can mark templates as public
- Browse community templates
- Import public templates to own collection
- Rate/favorite templates

**Component:**
- `/components/journal/JournalTemplatesAccordion.tsx`
- Template selector
- Template editor
- Template browser

**Database:**
```sql
CREATE TABLE journal_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  prompts JSONB NOT NULL, -- Array of prompt objects
  is_public BOOLEAN DEFAULT FALSE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_templates_user ON journal_templates(user_id);
CREATE INDEX idx_journal_templates_public ON journal_templates(is_public);
```

### FR3: Prompts & Guided Writing
**Priority:** P1 (High)

**Prompt Display:**
- Show prompts one at a time or all at once (user preference)
- Checkboxes for required prompts
- Skip optional prompts
- Prompt progress indicator

**Writing Interface:**
- Dedicated text area per prompt
- Or single editor with prompt headers
- Auto-insert prompts into editor
- Preserve prompt structure in saved entry

**Prompt Library:**
- Pre-written prompts for inspiration
- Random prompt generator
- Daily prompt (rotates)
- Prompt suggestions based on mood

### FR4: Search & Filtering
**Priority:** P1 (High)

**Full-Text Search:**
- Search titles and content
- Highlight matches
- Sort by relevance or date

**Filters:**
- Date range
- Tags
- Template used
- Mood range (if mood linked)
- Word count range

**Saved Searches:**
- Save common filter combinations
- Quick access dropdown

### FR5: Writing Analytics
**Priority:** P2 (Medium)

**Metrics:**
- Total entries
- Total words written
- Average word count
- Writing streak (consecutive days)
- Longest streak
- Entries per week/month

**Visualizations:**
- Calendar heatmap (entry frequency)
- Word count over time (line chart)
- Entry distribution by day of week
- Tag cloud (most used tags)

**Milestones:**
- First entry
- 10 entries, 50 entries, 100 entries
- 10,000 words, 50,000 words
- 7-day streak, 30-day streak, 365-day streak

### FR6: Calendar Integration
**Priority:** P2 (Medium)

**Journal Calendar:**
- Component: `/components/journal/JournalCalendarWidget.tsx`
- Mini calendar showing days with entries
- Click to view/create entry for that day
- Visual indicator (dot or count)

**Entry Dating:**
- Create entry for past date
- Create entry for future date (planned reflection)
- Distinguish between created_at and entry_date

**Timehop Feature:**
- "One year ago today" reminder
- "On this day" past entries
- Prompt to reflect on growth

### FR7: Mood Context Integration
**Priority:** P1 (High)

**Auto-Link Mood:**
- When creating entry, link to most recent mood log (within 6 hours)
- Display mood context in entry metadata
- Optional mood badge on entry cards

**Prompt Mood Logging:**
- If no recent mood log, prompt to log
- Quick mood selector in journal modal
- Creates mood entry alongside journal entry

**Mood-Based Filtering:**
- Filter entries by mood range
- "Show entries when I was feeling good"
- "Show entries during stressful periods"

**Cross-Analysis:**
- Identify writing patterns by mood
- Notice if journaling affects mood
- Mood timeline with journal markers

## Database Schema

```sql
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  mood_entry_id UUID REFERENCES mood_entries(id),
  template_id UUID REFERENCES journal_templates(id),
  tags JSONB,
  entry_date DATE DEFAULT CURRENT_DATE, -- Distinct from created_at
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_journal_entries_user ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_date ON journal_entries(user_id, entry_date);
CREATE INDEX idx_journal_entries_tags ON journal_entries USING GIN (tags);
CREATE INDEX idx_journal_entries_template ON journal_entries(template_id);
CREATE INDEX idx_journal_entries_mood ON journal_entries(mood_entry_id);
```

## Components

**Main Views:**
- `/components/journal/JournalContentOrchestrator.tsx` - Main pane orchestrator
- Journal list view (entries list)
- Journal detail view (single entry)

**Editor:**
- Journal entry editor (markdown or rich text)
- Template prompt renderer

**Templates:**
- `/components/journal/JournalTemplatesAccordion.tsx`
- Template selector dropdown
- Template editor modal
- Template browser

**Calendar:**
- `/components/journal/JournalCalendarWidget.tsx`
- Mini calendar with entry indicators

**Prompts:**
- `/components/journal/writing-prompt-card.tsx`
- Random prompt generator
- Prompt library

## Hooks

**Data Management:**
- `/hooks/journal/useJournal.ts` - CRUD operations

**Query Keys:**
```typescript
['journal-entries', userId]
['journal-templates', userId]
['public-templates']
['journal-stats', userId]
```

## Success Metrics

### Usage Metrics
- Entries per user per week
- Template usage percentage
- Public template creation rate
- Average word count

### Engagement Metrics
- Writing streak length
- Consecutive days journaling
- Template browsing frequency
- Search usage

### Outcome Metrics
- User-reported journaling consistency improvement
- Mood correlation insights discovered
- Templates shared

## Future Enhancements

### v1.1
- Voice-to-text journaling
- Photo attachments
- Drawing/sketching integration
- Entry sharing with therapist

### v1.2
- AI writing assistant (suggestions, grammar)
- Sentiment analysis
- Theme extraction (common topics)
- Entry relationships (link related entries)

### v2.0
- Collaborative journaling (shared with partner/therapist)
- Prompted journaling (AI-generated personalized prompts)
- Advanced analytics (word clouds, topic modeling)
- Export as PDF book

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Mood Logging PRD](./04-mood-logging-prd.md) - Mood integration
- [Calendar PRD](./06-calendar-prd.md) - Calendar integration

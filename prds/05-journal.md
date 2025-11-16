# PRD: Journal with Templates

## Product Overview

The Journal feature provides a flexible writing space with customizable templates and prompts. It helps users with ADHD maintain a reflective practice through structured prompts that reduce the cognitive load of "what should I write about?"

## Problem Statement

Users with ADHD struggle with journaling due to:
- **Blank Page Anxiety**: Not knowing where to start
- **Inconsistent Practice**: Forgetting to journal regularly
- **Lack of Structure**: Freeform writing feels overwhelming
- **Lost Context**: Forgetting what was important to document
- **Analysis Paralysis**: Too many potential topics

## Target Users

- **Primary**: Users wanting structured journaling practice
- **Secondary**: Users in therapy needing reflection tools
- **Tertiary**: Writers using journal for creative practice

## Core Features

### 1. Freeform Journal Entries

**User Stories**:
- As a user, I want to write freely without constraints
- As a user, I want to add titles to entries
- As a user, I want to see word count
- As a user, I want to capture mood context with entries

**Technical Implementation**:
- Database: `journal_entries` table (supabase/schema.sql:240-250)
- Hooks: `useJournalEntries()`, `useCreateJournalEntry()`
- Components: Rich text editor for content

**Entry Fields**:
- `title` (optional): Entry title
- `content` (required): Rich text content
- `template_id` (optional): If created from template
- `mood_context` (JSONB): Snapshot of current mood
- `word_count` (integer): Auto-calculated
- `created_at` / `updated_at` (timestamps)

### 2. Journal Templates

**User Stories**:
- As a user, I want to choose from pre-made templates
- As a user, I want to create my own templates
- As a user, I want to share templates publicly
- As a user, I want prompts to guide my writing

**Technical Implementation**:
- Database: `journal_templates` table (supabase/schema.sql:229-237)
- Components: `JournalTemplatesAccordion.tsx`
- RLS: Public templates visible to all users

**Template Structure**:
```typescript
interface JournalTemplate {
  id: UUID
  user_id: UUID
  name: string // "Daily Reflection", "Gratitude Journal"
  prompts: string[] // Array of writing prompts
  is_public: boolean // Shareable with community
}
```

**Example Templates**:

**Daily Reflection**:
- How did I feel today?
- What went well?
- What could I improve tomorrow?
- What am I grateful for?

**Gratitude Journal**:
- Three things I'm grateful for today
- Why these things matter to me
- How can I show appreciation?

**ADHD Check-In**:
- What tasks did I complete?
- What challenges did I face?
- What strategies helped today?
- What do I need to adjust?

**Anxiety Processing**:
- What am I anxious about?
- Is this worry realistic?
- What can I control?
- What coping strategies can I use?

### 3. Writing Prompts

**User Stories**:
- As a user, I want random prompts when I'm stuck
- As a user, I want prompts relevant to my mood
- As a user, I want prompts about recent activities (habits, tasks)

**Prompt Sources**:
- Template-based prompts
- Random writing prompts library
- Context-aware prompts (based on mood, incomplete tasks, etc.)

**Component**: `writing-prompt-card.tsx`

### 4. Journal Calendar Widget

**User Stories**:
- As a user, I want to see which days I journaled
- As a user, I want to jump to past entries by date
- As a user, I want to see journal streak

**Technical Implementation**:
- Component: `JournalCalendarWidget.tsx`
- Visual: Calendar heatmap showing entries
- Interaction: Click date to open entry

### 5. Journal Statistics

**User Stories**:
- As a user, I want to see total entries count
- As a user, I want to see average word count
- As a user, I want to see journal streak
- As a user, I want to see most common themes/tags

**Technical Implementation**:
- Component: `JournalSummaryWidget.tsx`
- Stats calculated from entries

**Statistics Displayed**:
- Total entries
- Current streak (consecutive days)
- Average words per entry
- Longest entry
- Most productive day of week

### 6. Tag-Based Organization

**User Stories**:
- As a user, I want to tag entries with topics
- As a user, I want to filter entries by tag
- As a user, I want to see tag cloud

**Technical Implementation**:
- Component: `JournalTagsWidget.tsx`
- Tags stored in entry content or separate field

### 7. Mood Context Snapshot

**User Stories**:
- As a user, I want journal entries to capture my current mood
- As a user, I want to review past moods with entries
- As a user, I want to see if journaling improves mood

**Technical Implementation**:
- Field: `mood_context` (JSONB) in `journal_entries`
- On entry creation: Snapshot current mood_entry if exists
- Display: Mood indicator next to entry in list

### 8. Full-Text Search

**User Stories**:
- As a user, I want to search entries by keyword
- As a user, I want to find entries by date range
- As a user, I want to search within templates

**Technical Implementation**:
- Database: Full-text index on `content` field
- Component: Search bar in journal sidebar
- Hook: Filter entries by search query

### 9. Personality Picker (Fun Feature)

**User Stories**:
- As a user, I want to write in different "personas" for fun
- As a user, I want prompts adapted to writing style

**Technical Implementation**:
- Component: `personality-picker.tsx`
- Options: Reflective, Creative, Analytical, Humorous, etc.
- Affects prompt wording/tone

## User Workflows

### Workflow 1: Creating Entry from Template
1. User opens journal pane
2. User clicks "New Entry"
3. User selects "Daily Reflection" template
4. Editor opens with 4 prompts pre-filled as section headers
5. User writes responses under each prompt
6. System auto-saves every 30 seconds
7. User clicks "Save" when done
8. Entry appears in journal list with today's date

### Workflow 2: Freeform Journaling
1. User opens journal pane
2. User clicks "New Entry"
3. User skips template selection
4. User types freely in editor
5. User adds optional title: "Thoughts on Today"
6. System shows word count: 237 words
7. User saves entry
8. Mood context auto-captured if user logged mood today

### Workflow 3: Reviewing Past Entries
1. User opens journal calendar widget
2. User sees heatmap of entry frequency
3. User clicks on date 3 weeks ago
4. Entry from that date opens
5. User sees mood indicator: 😊 (happy)
6. User reads past reflections
7. User feels progress seeing improvement

## Technical Architecture

### Database Schema
```sql
CREATE TABLE journal_templates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  prompts JSONB NOT NULL, -- array of strings
  is_public BOOLEAN DEFAULT FALSE
)

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  template_id UUID REFERENCES journal_templates(id) ON DELETE SET NULL,
  mood_context JSONB,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Key Hooks
- `useJournalEntries()`: CRUD with real-time sync
- `useJournalTemplates()`: Template management
- `useCreateJournalEntry()`: Entry creation with template integration

### Component Hierarchy
```
JournalContentOrchestrator
├── JournalSidebar
│   ├── JournalCalendarWidget
│   ├── JournalSummaryWidget
│   ├── JournalTagsWidget
│   └── SearchBar
├── JournalEditor (main content area)
│   ├── TitleInput
│   ├── RichTextEditor
│   └── WordCount
└── JournalTemplatesAccordion (template selector)
```

## ADHD-Friendly Design

### 1. Auto-Save
- Save every 30 seconds automatically
- "Saved" indicator to reduce anxiety
- Never lose work

### 2. Low-Friction Start
- Templates reduce decision paralysis
- Random prompt button when stuck
- Start with just one prompt

### 3. Progress Visibility
- Word count provides dopamine feedback
- Streak tracking motivates consistency
- Calendar heatmap shows pattern

### 4. Structure Options
- Templates for structure-seekers
- Freeform for free-spirits
- Hybrid approach allowed

## Future Enhancements

1. **Voice-to-Text**: Dictate entries instead of typing
2. **AI Insights**: Analyze entries for patterns/themes
3. **Entry Sharing**: Share entries with therapist
4. **Photo Journal**: Attach images to entries
5. **Markdown Support**: Rich formatting for power users
6. **Export**: PDF/DOCX export for archives
7. **Reminders**: Schedule journal reminder notifications
8. **Locked Entries**: Password-protect sensitive entries
9. **Collaborative Templates**: Community template sharing
10. **Therapy Integration**: Send entries to therapist portal

## Success Criteria

1. ✅ Freeform entry creation functional
2. ✅ At least 5 default templates provided
3. ✅ Custom template creation working
4. ✅ Public template browsing functional
5. ✅ Auto-save working (30s interval)
6. ✅ Word count display
7. ✅ Mood context capture
8. ✅ Calendar widget showing entry dates
9. ✅ Mobile-responsive editor

## References

- File: `components/panes/content/JournalContentOrchestrator.tsx`
- File: `components/journal/JournalTemplatesAccordion.tsx`
- File: `components/journal/writing-prompt-card.tsx`
- Hook: `hooks/journal/useJournalEntries.ts`
- Schema: `supabase/schema.sql:229-264`
- README: `components/journal/README.md`

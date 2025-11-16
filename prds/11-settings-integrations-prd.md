# Settings & Integrations - Product Requirements Document

**Feature Area:** User Settings & External Service Integrations
**Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** Implemented

---

## Overview

The Settings system provides comprehensive user preference management and external service integration configuration. Designed to give users control over their EDC experience while maintaining simplicity and discoverability.

## Problem Statement

Users need to customize their experience:
- **Accessibility needs** - Font size, contrast, motion preferences
- **Personal preferences** - Time format, default views
- **Integration requirements** - Connect Google Calendar, Spotify, etc.
- **Privacy concerns** - Control over data and analytics
- **Customization without overwhelm** - Too many settings causes decision fatigue

## Goals

1. Provide essential customization options
2. Support external service integrations
3. Maintain sensible defaults for immediate usability
4. Group settings logically to reduce overwhelm
5. Enable power users while protecting casual users

## User Stories

### Epic: Profile Settings
- As a user, I can set my display name
- As a user, I can upload an avatar
- As a user, I can set my font preferences
- As a user, I can choose accent colors
- As a user, I can set time format (12h/24h)
- As a user, I can export my profile data

### Epic: Accessibility Settings
- As a user, I can enable high contrast mode
- As a user, I can reduce motion/animations
- As a user, I can adjust font size
- As a user, I can set color preferences
- As a user, I can enable screen reader optimizations

### Epic: Theme Settings
- As a user, I can choose from 18+ themes
- As a user, I can preview themes before applying
- As a user, I can set per-pane theme overrides
- As a user, I can create custom themes (future)

### Epic: Integration Settings
- As a user, I can connect Google Calendar
- As a user, I can configure sync direction and interval
- As a user, I can connect Spotify
- As a user, I can connect Google Sheets
- As a user, I can disconnect integrations
- As a user, I can see integration status

### Epic: Feature Settings
- As a user, I can customize mood options
- As a user, I can manage journal templates
- As a user, I can set default calendar view
- As a user, I can configure notification preferences
- As a user, I can set default task priorities

### Epic: Privacy & Data
- As a user, I can enable/disable analytics
- As a user, I can export all my data
- As a user, I can delete my account
- As a user, I can review privacy policy
- As a user, I can manage email preferences

## Functional Requirements

### FR1: Profile Management
**Priority:** P0 (Critical)

**Profile Fields:**
```typescript
interface UserProfile {
  id: string;
  email: string; // From auth.users
  display_name?: string;
  organization_name?: string;
  avatar_url?: string;
  font_family: string; // Default: 'Inter'
  font_size: number; // 1-6 scale, default: 3
  time_format: '12h' | '24h'; // Default: '12h'
  accent_color: string; // Default: 'blue'
  high_contrast: boolean; // Default: false
  reduced_motion: boolean; // Default: false
  default_calendar_view: CalendarView; // Default: 'week'
  analytics_enabled: boolean; // Default: true
  email_notifications: boolean; // Default: true
  joybox_image_url?: string; // Custom celebration image
  wedding_date?: string; // For wedding countdown (example custom field)
  created_at: Date;
  updated_at: Date;
}
```

**Avatar Upload:**
- Hook: `/hooks/utils/useAvatarUpload.ts`
- Supabase Storage bucket
- Image optimization (max 500x500)
- MIME type validation (jpg, png, gif)

**Font Options:**
- Inter (default)
- Open Dyslexic (accessibility)
- System fonts
- More options via dropdown

**Font Size Scale:**
- 1: 12px base
- 2: 14px base
- 3: 16px base (default)
- 4: 18px base
- 5: 20px base
- 6: 24px base

### FR2: Accessibility Settings
**Priority:** P0 (Critical)

**High Contrast Mode:**
- Increases color contrast ratios
- WCAG 2.1 AAA compliance
- Affects entire app
- Toggle in settings

**Reduced Motion:**
- Disables animations
- Respects `prefers-reduced-motion`
- Can be force-enabled via settings
- Affects transitions, confetti, etc.

**Font Size:**
- Global font scaling
- Applies to all components
- Respects component-specific overrides

**Color Blindness Support:**
- Alternative color schemes (future)
- Pattern-based indicators in addition to color

### FR3: Theme System Settings
**Priority:** P1 (High)

**Theme Selection:**
- Dropdown of all available themes
- Live preview on selection
- Apply button (or auto-apply)
- Reset to default

**Available Themes:**
- System (auto light/dark)
- Autumn
- Bridge
- Corporate
- Cosmic Nebula
- Cyberpunk
- Glassmorphism
- High Contrast
- Kawaii
- Mint
- MySpace
- Mystic Twilight
- Sunrise
- Sunset Glow
- Terminal
- Custom themes

**Per-Pane Theme Overrides:**
- Managed via pane settings
- Stored in `user_pane_settings` table
- Shown in pane customization UI

**Theme Creation (Future):**
- Custom theme builder
- Color picker for each token
- Save and share themes

### FR4: Google Calendar Integration
**Priority:** P1 (High)

**Component:**
- `/components/settings/GoogleCalendarSync.tsx`

**Setup Flow:**
1. Click "Connect Google Calendar"
2. OAuth consent screen
3. Grant calendar permissions
4. Redirect back to EDC
5. Configure sync settings
6. Enable sync

**Sync Configuration:**
- Sync direction: to-google, from-google, both
- Sync interval: 5, 15, 30, 60 minutes
- Select calendars to sync (multi-select)
- Conflict resolution strategy
- Enable/disable sync

**Status Display:**
- Connected account email
- Last sync timestamp
- Sync status (active, paused, error)
- Disconnect button

**Error Handling:**
- Token expiry auto-refresh
- Rate limit handling
- Conflict display
- Reconnection prompts

### FR5: Spotify Integration
**Priority:** P2 (Medium)

**Setup Flow:**
- OAuth similar to Google Calendar
- Request playback read permissions
- Store tokens in `spotify_tokens` table

**Features:**
- Now playing display
- Playback controls (future)
- Recent tracks (future)

**Component:**
- Spotify callback page
- Spotify now playing widget
- Settings toggle

### FR6: Google Sheets Integration
**Priority:** P2 (Medium)

**Setup Flow:**
- OAuth for Sheets access
- Select spreadsheet
- Map columns to widgets
- Configure refresh interval

**Components:**
- Google Sheets auth flow
- Sheets configuration form
- Data preview

**Hooks:**
- `/hooks/utils/useGoogleSheetsAuth.ts`
- `/hooks/utils/useGoogleSheetsData.ts`
- `/hooks/utils/useGoogleSheetsConfig.ts`

### FR7: Mood Options Customization
**Priority:** P1 (High)

**Component:**
- `/components/settings/MoodOptionsManager.tsx`

**Customization:**
- Edit mood level labels (1-10)
- Assign emojis to each level
- Set colors for visualization
- Add descriptions
- Reset to defaults

**Database:**
- `mood_options` table
- User-specific customization
- Falls back to defaults if not customized

### FR8: Journal Templates Management
**Priority:** P1 (High)

**Component:**
- `/components/settings/JournalTemplatesManager.tsx`

**Features:**
- View all templates
- Create new template
- Edit existing templates
- Delete templates
- Mark templates as public/private
- Import community templates

### FR9: Notification Preferences
**Priority:** P2 (Medium)

**Email Notifications:**
- Daily summary
- Task reminders
- Habit streak milestones
- Calendar event reminders

**In-App Notifications:**
- Toast notifications
- Browser notifications (with permission)
- Sound effects toggle

**Preferences:**
- Enable/disable each type
- Set quiet hours
- Notification frequency

### FR10: Data Export & Privacy
**Priority:** P1 (High)

**Data Export:**
- Export all data as JSON
- Export specific features (tasks, habits, etc.) as CSV
- Scheduled exports (future)
- Email export link

**Account Deletion:**
- Soft delete (deactivate account)
- Hard delete (permanent removal)
- Confirmation modal with consequences
- Grace period for recovery (future)

**Privacy Controls:**
- Analytics toggle
- Data sharing preferences
- Third-party integration permissions
- Review connected apps

### FR11: Authentication Status
**Priority:** P0 (Critical)

**Component:**
- `/components/settings/AuthenticationStatusRenderer.tsx`

**Display:**
- Current logged-in email
- Account creation date
- Login provider (email, Google OAuth)
- Active sessions (future)

**Actions:**
- Change password
- Update email
- Enable 2FA (future)
- Log out

## Database Schema

**Profiles:**
```sql
-- Already defined in main schema
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  font_family TEXT DEFAULT 'Inter',
  font_size INTEGER DEFAULT 3 CHECK (font_size BETWEEN 1 AND 6),
  email TEXT,
  display_name TEXT,
  organization_name TEXT,
  avatar_url TEXT,
  time_format TEXT DEFAULT '12h' CHECK (time_format IN ('12h', '24h')),
  high_contrast BOOLEAN DEFAULT FALSE,
  reduced_motion BOOLEAN DEFAULT FALSE,
  default_calendar_view TEXT DEFAULT 'week',
  accent_color TEXT DEFAULT 'blue',
  analytics_enabled BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  joybox_image_url TEXT,
  wedding_date TEXT DEFAULT '2026-04-11',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Integration Tables:**
- `google_calendar_sync_settings`
- `google_sheets_auth_tokens`
- `spotify_tokens`

## Components

**Main Settings:**
- `/pages/Settings.tsx`
- `/pages/SettingsUtils.tsx`

**Specific Settings:**
- `/components/settings/GoogleCalendarSync.tsx`
- `/components/settings/MoodOptionsManager.tsx`
- `/components/settings/JournalTemplatesManager.tsx`
- `/components/settings/AuthenticationStatusRenderer.tsx`

**Forms:**
- Profile form
- Accessibility form
- Integration forms

## Hooks

**Profile:**
- User context provides profile data
- Profile update mutations

**Integrations:**
- `/hooks/utils/useGoogleSheetsAuth.ts`
- `/hooks/utils/useSpotify.ts`
- `/hooks/calendar/useGoogleCalendarSync.ts`

**Utilities:**
- `/hooks/utils/useAvatarUpload.ts`
- `/hooks/utils/useWorkspaceSettings.ts`

## Success Metrics

### Customization Metrics
- Percentage of users who change defaults
- Most customized settings
- Theme distribution
- Font size distribution

### Integration Metrics
- Google Calendar connection rate
- Spotify connection rate
- Google Sheets connection rate
- Integration abandonment rate

### Accessibility Metrics
- High contrast mode usage
- Reduced motion usage
- Font size adjustment usage

## Future Enhancements

### v1.1
- Keyboard shortcuts customization
- Import/export settings
- Settings sync across devices
- Advanced notification rules

### v1.2
- Zapier integration
- IFTTT integration
- Webhook support
- API key management

### v2.0
- Plugin system
- Custom integrations builder
- Settings profiles (work/personal)
- Team settings management

---

## Related Documents

- [Master PRD](./00-MASTER-PRD.md)
- [Theme System PRD](./12-theme-system-prd.md)
- [Calendar PRD](./06-calendar-prd.md) - Google Calendar integration

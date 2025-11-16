# Mood Logging System - Alternative Approaches

**Project**: Personal Productivity App for ADHD
**Version**: 1.0
**Date**: 2025-11-16

---

## Approach 1: Emoji Mood Wheel

### UI Mockup Description

```
┌─────────────────────────────┐
│   How are you feeling?      │
│                             │
│         😊                  │
│    ⚡       😐              │
│  😤    👆    😔             │
│    🥱       😰              │
│                             │
│  [Intensity Selector]       │
│   ○ Light  ● Medium  ○ Strong│
│                             │
│  Context (optional):        │
│  [Work] [Social] [Home]     │
│                             │
│      [Log Mood ✓]           │
└─────────────────────────────┘
```

**Visual Design**:
- Circular arrangement of 8 primary emotions
- Large, tappable emoji targets (60px minimum)
- Selected emoji pulses/animates
- Intensity selector appears after emoji selection
- Context tags slide up (optional step)
- Total screen time: 3-8 seconds

### User Flow

1. **Open mood log** (from notification, habit completion, or manual)
2. **Tap primary emotion** (one of 8 emojis)
   - Selected emoji enlarges 1.5x with haptic feedback
3. **Select intensity** (light/medium/strong)
   - Defaults to "medium" for one-tap completion
4. **Optional: Add context tag(s)**
   - Skip button visible ("Log without context")
5. **Auto-saves** with celebratory micro-animation

**Interaction time**: 1-2 taps (3-8 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Core mood data
  emotion: 'happy' | 'sad' | 'angry' | 'anxious' | 'neutral' | 'tired' | 'energized' | 'content';
  intensity: 1 | 2 | 3; // light, medium, strong

  // Derived numeric scores (for correlation)
  moodScore: number; // 0-100 (calculated from emotion + intensity)
  energyLevel: number; // 0-100 (derived from emotion type)

  // Optional enrichment
  contextTags?: string[]; // ['work', 'exercise', 'social']
  note?: string;

  // Metadata
  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual' | 'journal-entry';
  relatedHabitId?: string;
  relatedJournalId?: string;
}
```

**Emotion → Score Mapping**:
```typescript
const emotionBaseScores = {
  happy: 85,
  content: 70,
  energized: 75,
  neutral: 50,
  tired: 40,
  anxious: 30,
  sad: 25,
  angry: 20
};

// Intensity modifiers
const intensityModifier = {
  1: -10, // light (e.g., "lightly happy" = 75)
  2: 0,   // medium (base score)
  3: +10  // strong (e.g., "very anxious" = 40)
};

moodScore = emotionBaseScores[emotion] + intensityModifier[intensity];
```

### Correlation-Readiness: 9/10

**Strengths**:
- ✅ Numeric mood score enables direct correlation analysis
- ✅ Energy level derived automatically
- ✅ Context tags enable multi-dimensional analysis
- ✅ Intensity captures nuance without complexity
- ✅ Consistent data structure across all logs

**Example Correlation Queries**:
```sql
-- Average mood by habit
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood,
  AVG(m.energyLevel) as avg_energy
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
WHERE m.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY h.name;

-- Emotion distribution by context
SELECT
  emotion,
  contextTag,
  COUNT(*) as frequency
FROM mood_entries, UNNEST(contextTags) as contextTag
GROUP BY emotion, contextTag;
```

**Limitation**:
- Discrete emotions may not capture complex mixed states

### ADHD-Friendliness Score: 8.5/10

**Justification**:

**Strengths** (+8.5):
- ✅ **Visual & intuitive**: Emojis reduce cognitive load
- ✅ **Fast**: 1-2 taps for minimal logging
- ✅ **Dopamine hit**: Emoji selection + animation = instant reward
- ✅ **Progressive disclosure**: Optional context doesn't block core action
- ✅ **Forgiving**: No wrong answer, defaults to "medium"
- ✅ **Low decision fatigue**: 8 clear options vs. infinite scale

**Weaknesses** (-1.5):
- ⚠️ Emotion identification still required (some ADHD users struggle with this)
- ⚠️ 8 options might feel overwhelming in the moment

**ADHD-Specific Optimizations**:
- Default to last-selected emotion (pattern recognition)
- "Quick repeat" button: "Same as last time?"
- Haptic feedback for tactile engagement
- Animation reinforcement (dopamine)

### Implementation Complexity: Medium

**Technical Requirements**:

**Frontend** (Medium):
- Custom circular layout component
- Emoji animation library
- State management for progressive disclosure
- Touch gesture handling

**Backend** (Easy):
- Simple CRUD for mood entries
- Pre-calculated mood score (no complex aggregation)
- Standard SQL queries for correlation

**Timeline Estimate**: 2-3 weeks
- Week 1: Core emoji selector + data model
- Week 2: Intensity/context UI + animations
- Week 3: Correlation analytics + visualization

**Dependencies**:
- Emoji rendering (native or library like `react-native-emoji`)
- Chart library for mood history
- Notification system for prompts

---

## Approach 2: Color Gradient Picker

### UI Mockup Description

```
┌─────────────────────────────┐
│   Tap to capture your mood  │
│                             │
│  ┌───────────────────────┐ │
│  │                       │ │  High
│  │   [Gradient Canvas]   │ │  Energy
│  │                       │ │    ↕
│  │   Blue→Green→Yellow   │ │  Low
│  │      →Orange          │ │  Energy
│  │                       │ │
│  │         👆            │ │
│  └───────────────────────┘ │
│   Sad  →  Neutral  →  Happy│
│                             │
│  Your mood: Calm & Content  │
│  Score: 68/100              │
│                             │
│  [Add Note (optional)]      │
│      [Log Mood ✓]           │
└─────────────────────────────┘
```

**Visual Design**:
- Full-width gradient canvas (300x200px minimum)
- Smooth color transitions (blue → green → yellow → orange)
- Vertical axis: Light colors (top) → Dark colors (bottom)
- Tap location marked with pulsing circle
- Live preview of mood interpretation below gradient
- History shows colored dots in timeline

### User Flow

1. **Open mood log**
2. **Tap anywhere on gradient**
   - Immediate visual feedback (circle appears at tap point)
   - Live text updates: "Energized & Happy" / "Calm & Neutral"
3. **Review interpretation** ("Looks right?")
   - Option to tap again to adjust
4. **Optional: Add note**
5. **Auto-saves after 2 seconds** or manual "Log Mood" tap

**Interaction time**: 1 tap (2-5 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Raw gradient coordinates
  gradientX: number; // 0-100 (horizontal position: sad→happy)
  gradientY: number; // 0-100 (vertical position: low→high energy)

  // Derived scores
  moodScore: number; // 0-100 (same as gradientX)
  energyLevel: number; // 0-100 (same as gradientY)

  // Visual representation
  colorHex: string; // e.g., "#78C2A3" (calculated from X,Y)

  // Derived category (for filtering)
  category: 'sad-low' | 'sad-high' | 'neutral-low' | 'neutral-high' |
            'happy-low' | 'happy-high' | 'very-happy';

  // Optional
  note?: string;
  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual';
  relatedHabitId?: string;
}
```

**Coordinate → Category Mapping**:
```typescript
function categorize(x: number, y: number): string {
  // Quadrant analysis
  if (x < 33) { // Sad spectrum
    return y > 50 ? 'sad-high' : 'sad-low';
  } else if (x < 66) { // Neutral spectrum
    return y > 50 ? 'neutral-high' : 'neutral-low';
  } else { // Happy spectrum
    return x > 80 && y > 60 ? 'very-happy' :
           y > 50 ? 'happy-high' : 'happy-low';
  }
}

function getColorFromCoords(x: number, y: number): string {
  // Interpolate between gradient colors
  const hue = x * 0.6; // 0 (blue) → 60 (yellow/orange)
  const lightness = 30 + (y * 0.4); // 30% (dark) → 70% (light)
  const saturation = 70;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
```

### Correlation-Readiness: 10/10

**Strengths**:
- ✅ **Perfect numeric data**: Direct X/Y coordinates = continuous variables
- ✅ **Dual-axis capture**: Mood + Energy in single interaction
- ✅ **Infinitely granular**: Can detect subtle mood changes over time
- ✅ **Consistent scale**: 0-100 for all entries
- ✅ **Visual correlation**: Color timeline immediately shows patterns

**Example Correlation Queries**:
```sql
-- Mood improvement by habit (with energy context)
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood,
  AVG(m.energyLevel) as avg_energy,
  AVG(m.moodScore) FILTER (WHERE m.energyLevel > 50) as avg_mood_high_energy
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
GROUP BY h.name;

-- Mood trajectory analysis (continuous improvement)
SELECT
  DATE_TRUNC('day', timestamp) as day,
  AVG(moodScore) as daily_avg,
  STDDEV(moodScore) as mood_variability
FROM mood_entries
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;
```

**Advanced Analytics**:
- Scatter plots (mood vs. energy by habit)
- Heat maps (what time of day = best mood?)
- Trend lines (is mood improving over time?)

### ADHD-Friendliness Score: 7/10

**Justification**:

**Strengths** (+7):
- ✅ **Extremely fast**: Single tap, no decisions
- ✅ **Intuitive**: Colors feel natural (blue = sad, yellow = happy)
- ✅ **Beautiful**: Visually satisfying = dopamine
- ✅ **No language required**: Pure visual interaction
- ✅ **Infinite precision**: No "which option fits me?" paralysis

**Weaknesses** (-3):
- ⚠️ **Abstract**: "What does light green mean again?" (cognitive load)
- ⚠️ **No clear categories**: Hard to remember what you logged
- ⚠️ **Motor precision required**: Small screen = hard to tap exact spot
- ⚠️ **Interpretation burden**: "Am I calm-happy or energized-neutral?"

**ADHD-Specific Concerns**:
- Lack of discrete options might cause decision paralysis ("where exactly should I tap?")
- No clear feedback loop ("did I do this right?")
- Harder to develop logging habits without consistent categories

**Mitigations**:
- Add "Quick Zones" overlay (tap corners for common moods)
- Show historical dots on gradient ("You tapped here last time")
- Provide text labels at gradient edges

### Implementation Complexity: Hard

**Technical Requirements**:

**Frontend** (Hard):
- Custom canvas/SVG gradient rendering
- Touch coordinate capture with precision
- Color interpolation algorithm
- Smooth animations for tap feedback
- Responsive gradient sizing (mobile → tablet)

**Backend** (Easy):
- Standard numeric storage (X, Y coordinates)
- Color hex calculation (can be done client-side)

**Timeline Estimate**: 3-4 weeks
- Week 1: Gradient canvas + touch handling
- Week 2: Color calculations + interpretation logic
- Week 3: History visualization (color dots timeline)
- Week 4: Polish + accessibility (what about colorblind users?)

**Risk Factors**:
- **Accessibility**: Colorblind users can't use this system
- **Cross-platform consistency**: Gradient rendering varies (iOS vs Android)
- **User testing**: Might confuse users unfamiliar with continuous scales

---

## Approach 3: Quick Check-In (Minimal)

### UI Mockup Description

```
┌─────────────────────────────┐
│   How are you feeling?      │
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │
│   │ 😊  │ │ 😐  │ │ 😔  │  │
│   │Good │ │ Meh │ │ Bad │  │
│   └─────┘ └─────┘ └─────┘  │
│                             │
│   [Why? (optional)]         │
│                             │
│        ✓ Logged!            │
└─────────────────────────────┘

// If "Why?" tapped:
┌─────────────────────────────┐
│   Why good/meh/bad?         │
│                             │
│  [😴 Tired]  [⚡ Energized] │
│  [😰 Stressed] [😌 Calm]   │
│  [💪 Productive] [🎉 Fun]  │
│                             │
│  Or type: _________________ │
│                             │
│      [Done ✓]               │
└─────────────────────────────┘
```

**Visual Design**:
- Three massive buttons (fills screen width)
- Color-coded: Green (good), Yellow (meh), Red (bad)
- Emoji + text label for clarity
- Haptic feedback on tap
- "Why?" appears as small link below buttons (non-intrusive)
- Success animation ("✓ Logged!") fades after 1 second

### User Flow

**Minimal Path** (1 tap):
1. Open mood log
2. Tap Good/Meh/Bad
3. Auto-saves with checkmark animation
4. Done (2 seconds total)

**Extended Path** (optional):
1. Tap Good/Meh/Bad
2. Tap "Why?" link that appears
3. Select reason tags OR type note
4. Tap "Done"
5. Done (10-15 seconds)

**Interaction time**: 1 tap (2 seconds) or 3-4 taps (10-15 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Core mood data (minimal)
  sentiment: 'positive' | 'neutral' | 'negative';

  // Derived numeric score (for correlation)
  moodScore: number; // 75 (good), 50 (meh), 25 (bad)

  // Optional enrichment
  reasonTags?: string[]; // ['tired', 'productive', 'stressed']
  note?: string;

  // Metadata
  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual';
  relatedHabitId?: string;
  relatedJournalId?: string;

  // Tracking (for analytics)
  wasEnriched: boolean; // Did user add "why?"
  responseTimeMs: number; // How fast did they log?
}
```

**Sentiment → Score Mapping**:
```typescript
const sentimentScores = {
  positive: 75,  // "Good"
  neutral: 50,   // "Meh"
  negative: 25   // "Bad"
};

// If reason tags present, adjust score slightly
const reasonModifiers = {
  energized: +10,
  tired: -10,
  stressed: -5,
  calm: +5,
  productive: +5,
  fun: +10
};
```

### Correlation-Readiness: 6/10

**Strengths**:
- ✅ **Simple correlation**: Good days vs. bad days analysis
- ✅ **Consistent scale**: 25/50/75 (or 0/50/100) for all entries
- ✅ **Reason tags**: Can analyze "tired + good" vs "tired + bad"
- ✅ **High completion rate**: More data = better correlations

**Weaknesses**:
- ⚠️ **Low granularity**: Only 3 data points (loses nuance)
- ⚠️ **No energy dimension**: Can't separate "good-tired" from "good-energized"
- ⚠️ **Coarse patterns**: "Exercise improves mood" might miss "only morning exercise helps"

**Example Correlation Queries**:
```sql
-- Average mood by habit (basic)
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood,
  SUM(CASE WHEN m.sentiment = 'positive' THEN 1 ELSE 0 END)::float / COUNT(*) as pct_good_days
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
GROUP BY h.name;

-- Reason tag correlation (requires enrichment)
SELECT
  tag,
  AVG(moodScore) as avg_mood_when_tag_present
FROM mood_entries, UNNEST(reasonTags) as tag
GROUP BY tag;
```

**Limitation**: Won't detect subtle improvements (7/10 → 8/10) that other approaches capture.

### ADHD-Friendliness Score: 10/10

**Justification**:

**Strengths** (+10):
- ✅ **Fastest possible**: One tap, zero cognitive load
- ✅ **No decision fatigue**: Only 3 crystal-clear options
- ✅ **Instant gratification**: Checkmark animation = dopamine hit
- ✅ **Forgiving**: No "wrong" answer, no pressure to elaborate
- ✅ **Habit-forming**: Simplicity = higher completion rate
- ✅ **Optional depth**: Can add context if motivated, but not required
- ✅ **Low barrier**: Works even when brain is foggy

**ADHD-Specific Features**:
- **Progressive disclosure**: Complexity hidden by default
- **Visual clarity**: Large buttons, emoji labels
- **Fast feedback**: No waiting, no loading
- **No guilt**: "Meh" is a valid answer (not forced positivity)

**Why this scores higher than emoji wheel**:
- Emoji wheel = 8 options (mild decision paralysis)
- Quick Check-In = 3 options (no paralysis possible)

**Use Case**:
- User just completed "Exercise" habit
- Notification: "How do you feel?"
- User taps "😊 Good" while putting phone back in pocket
- Total time: 2 seconds, zero cognitive effort

### Implementation Complexity: Easy

**Technical Requirements**:

**Frontend** (Easy):
- Three buttons (native components)
- Simple animation library (Lottie for checkmark)
- Modal for "Why?" (standard component)
- Tag buttons (reusable component)

**Backend** (Easy):
- Simple enum storage (sentiment)
- Array field for tags
- Standard CRUD operations

**Timeline Estimate**: 1 week
- Day 1-2: Core 3-button UI + data model
- Day 3: "Why?" modal + tag selection
- Day 4-5: Animations + notifications integration

**Dependencies**:
- Minimal (no external APIs, no complex libraries)

**Risk Factors**:
- None (simplest possible implementation)

---

## Approach 4: Dimensional Sliders

### UI Mockup Description

```
┌─────────────────────────────┐
│   How are you feeling?      │
│                             │
│  Mood (negative → positive) │
│  😔 ━━━━━●━━━━━ 😊          │
│           ↑                 │
│        Slightly positive    │
│                             │
│  Energy (low → high)        │
│  🥱 ━━━━●━━━━━━ ⚡          │
│        ↑                    │
│     Moderate energy         │
│                             │
│  Stress (calm → overwhelmed)│
│  😌 ━━●━━━━━━━━ 😰         │
│      ↑                      │
│   Slightly stressed         │
│                             │
│      [Log Mood ✓]           │
└─────────────────────────────┘
```

**Visual Design**:
- Three horizontal sliders (full width)
- Each slider has emoji labels on ends
- Live numeric feedback (or text: "Slightly positive")
- Sliders default to center (neutral)
- Color-coded handles: Green (mood), Yellow (energy), Red (stress)
- Haptic feedback when dragging sliders

### User Flow

1. **Open mood log**
   - Sliders load at center position (neutral)
2. **Adjust Mood slider** (drag left/right)
   - Label updates: "Negative" → "Neutral" → "Positive" → "Very positive"
3. **Adjust Energy slider** (drag left/right)
   - Label updates: "Exhausted" → "Low" → "Moderate" → "High" → "Energized"
4. **Adjust Stress slider** (optional - starts at "calm")
   - Label updates: "Calm" → "Moderate" → "High" → "Overwhelmed"
5. **Tap "Log Mood"**
6. **Auto-saves with summary**: "Logged: Positive mood, moderate energy, low stress"

**Interaction time**: 3-4 slider drags + 1 tap (10-20 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Dimensional scores (validated psych model)
  valence: number;        // -5 to +5 (negative to positive)
  arousal: number;        // -5 to +5 (low energy to high energy)
  stress: number;         // 0 to 10 (calm to overwhelmed)

  // Derived composite scores
  moodScore: number;      // 0-100 (calculated from valence + arousal)
  energyLevel: number;    // 0-100 (same as arousal, normalized)
  stressLevel: number;    // 0-100 (same as stress, normalized)

  // Derived category (for filtering)
  quadrant: 'happy-energized' | 'happy-calm' | 'sad-energized' | 'sad-calm';

  // Metadata
  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual';
  relatedHabitId?: string;
}
```

**Dimensional → Composite Mapping**:
```typescript
// Circumplex model of affect
function calculateMoodScore(valence: number, arousal: number): number {
  // Valence is primary (70%), arousal is secondary (30%)
  const valenceNormalized = (valence + 5) * 10; // -5→+5 becomes 0→100
  const arousalNormalized = (arousal + 5) * 10;

  return (valenceNormalized * 0.7) + (arousalNormalized * 0.3);
}

function categorizeQuadrant(valence: number, arousal: number): string {
  if (valence > 0 && arousal > 0) return 'happy-energized';
  if (valence > 0 && arousal <= 0) return 'happy-calm';
  if (valence <= 0 && arousal > 0) return 'sad-energized';
  return 'sad-calm';
}
```

### Correlation-Readiness: 10/10

**Strengths**:
- ✅ **Psychologically validated**: Circumplex model (Russell, 1980)
- ✅ **Multi-dimensional**: Independent variables (valence ≠ arousal)
- ✅ **High granularity**: 11 points per slider (vs. 3-point scale)
- ✅ **Advanced analytics**: Can analyze "Exercise → high arousal but low valence?"
- ✅ **Stress tracking**: Separate stress dimension = unique insights

**Example Correlation Queries**:
```sql
-- Habit impact on independent dimensions
SELECT
  h.name,
  AVG(m.valence) as avg_valence,
  AVG(m.arousal) as avg_arousal,
  AVG(m.stress) as avg_stress
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
GROUP BY h.name;

-- Quadrant analysis (which habits lead to "happy-calm"?)
SELECT
  h.name,
  COUNT(*) FILTER (WHERE m.quadrant = 'happy-calm') as happy_calm_count,
  COUNT(*) FILTER (WHERE m.quadrant = 'happy-energized') as happy_energized_count
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
GROUP BY h.name;

-- Stress-valence correlation (does stress → negative mood?)
SELECT
  CORR(stress, valence) as stress_mood_correlation
FROM mood_entries;
```

**Research-Grade Analytics**:
- Detect patterns like "Exercise → high arousal + high stress + positive valence"
- Compare morning vs. evening mood profiles
- Track stress reduction interventions

### ADHD-Friendliness Score: 5/10

**Justification**:

**Strengths** (+5):
- ✅ **Visual feedback**: Slider position = clear state
- ✅ **Forgiving**: Can adjust multiple times before logging
- ✅ **Defaults to neutral**: No pressure to be positive
- ✅ **Tactile**: Sliding = engaging for kinesthetic learners

**Weaknesses** (-5):
- ⚠️ **Too many decisions**: 3 sliders = cognitive overload
- ⚠️ **Requires introspection**: "What's my arousal level?" (abstract concept)
- ⚠️ **Slow**: 10-20 seconds per log (vs. 2 seconds for Quick Check-In)
- ⚠️ **Decision paralysis**: "Is this +3 or +4 valence?" (analysis paralysis)
- ⚠️ **Psychological jargon**: ADHD users may not understand "valence/arousal"

**ADHD-Specific Concerns**:
- **Executive dysfunction**: Choosing 3 slider positions = high working memory load
- **Time blindness**: Will feel like logging takes forever
- **Rejection sensitivity**: Might feel judged for "wrong" slider positions

**Mitigations**:
- Make stress slider optional (2 sliders = less overwhelming)
- Add "Quick presets" buttons: "Tired but happy", "Stressed and down"
- Allow single-slider mode: "Just rate your mood (we'll skip energy/stress)"

### Implementation Complexity: Medium

**Technical Requirements**:

**Frontend** (Medium):
- Three custom slider components with snap-to-grid
- Real-time label updates (debounced)
- Haptic feedback on slider movement
- Visual design (color-coded sliders)

**Backend** (Easy):
- Store three numeric values
- Calculate composite scores (simple math)
- Standard SQL queries for correlation

**Timeline Estimate**: 2 weeks
- Week 1: Core slider UI + data model + calculations
- Week 2: Polish (haptics, animations, presets)

**Dependencies**:
- Slider library (or custom component)
- Chart library for dimensional scatter plots

---

## Approach 5: Voice Input + AI Categorization

### UI Mockup Description

```
┌─────────────────────────────┐
│   How are you feeling?      │
│                             │
│         ┌─────────┐         │
│         │    🎤   │         │
│         │  Tap to │         │
│         │  speak  │         │
│         └─────────┘         │
│                             │
│   Or type: ____________     │
│                             │
└─────────────────────────────┘

// After speaking:
┌─────────────────────────────┐
│   You said:                 │
│   "Pretty good, tired but   │
│    productive"              │
│                             │
│   I heard:                  │
│   😊 Mood: Positive (7/10)  │
│   🥱 Energy: Low (3/10)     │
│   💪 Context: Productive    │
│                             │
│   [✓ Correct] [✏️ Edit]    │
└─────────────────────────────┘
```

**Visual Design**:
- Large microphone button (center screen)
- Animated waveform while speaking
- Transcription appears in real-time
- AI interpretation shows below with emoji labels
- "Correct" auto-logs, "Edit" allows manual adjustment

### User Flow

1. **Open mood log**
2. **Tap microphone button**
   - Haptic feedback + waveform animation
3. **Speak naturally**: "Feeling pretty good today, but a bit tired"
4. **AI processes speech** (1-2 seconds)
   - Transcription appears
   - AI extracts: mood=positive, energy=low, context=general
5. **Review interpretation**
   - If correct → Tap "✓ Correct" → Auto-saves
   - If wrong → Tap "✏️ Edit" → Manual slider adjustment
6. **Done** (10-15 seconds total)

**Alternative Flow (Text)**:
1. Tap text field instead of microphone
2. Type: "good but tired"
3. AI processes text (same as voice)
4. Review and confirm

**Interaction time**: 1 tap + speak (10-15 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Core mood data (AI-extracted)
  moodScore: number;          // 0-100
  energyLevel: number;        // 0-100
  stressLevel?: number;       // 0-100 (if mentioned)

  // Context extraction
  contextTags: string[];      // ['work', 'productive', 'tired']
  emotions: string[];         // ['happy', 'tired'] (multi-emotion support)

  // Source data (for audit/training)
  inputMethod: 'voice' | 'text';
  transcription: string;      // "Pretty good, tired but productive"
  aiConfidence: number;       // 0-100 (how confident is the AI?)
  wasEdited: boolean;         // Did user correct AI interpretation?

  // Metadata
  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual';
  relatedHabitId?: string;
}
```

**AI Extraction Logic** (simplified):
```typescript
// Using Claude/GPT with structured output
const prompt = `
Extract mood data from this user input: "${userInput}"

Return JSON:
{
  "moodScore": 0-100 (negative to positive),
  "energyLevel": 0-100 (low to high),
  "stressLevel": 0-100 (calm to stressed, or null if not mentioned),
  "emotions": ["primary emotion", "secondary emotion"],
  "contextTags": ["work", "exercise", etc.],
  "confidence": 0-100
}

Examples:
"Feeling great today!" → {"moodScore": 85, "energyLevel": 70, "emotions": ["happy"], "confidence": 95}
"Tired and stressed" → {"moodScore": 30, "energyLevel": 20, "stressLevel": 80, "emotions": ["tired", "stressed"], "confidence": 90}
"Pretty good but tired" → {"moodScore": 70, "energyLevel": 35, "emotions": ["content", "tired"], "confidence": 85}
`;
```

### Correlation-Readiness: 9/10

**Strengths**:
- ✅ **Rich context**: Captures nuance that buttons miss
- ✅ **Multi-dimensional**: Extracts mood, energy, stress, context automatically
- ✅ **Natural language**: Preserves original phrasing for qualitative analysis
- ✅ **Mixed emotions**: Can detect "happy but anxious" (vs. forced single choice)
- ✅ **Longitudinal patterns**: Can analyze language changes over time

**Example Correlation Queries**:
```sql
-- Average mood by habit
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood,
  AVG(m.energyLevel) as avg_energy,
  ARRAY_AGG(DISTINCT e) as common_emotions
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id,
UNNEST(m.emotions) as e
GROUP BY h.name;

-- Sentiment analysis over time (qualitative)
SELECT
  DATE_TRUNC('week', timestamp) as week,
  AVG(moodScore) as avg_mood,
  STRING_AGG(transcription, ' | ') as sample_entries
FROM mood_entries
GROUP BY week;

-- AI confidence as quality metric
SELECT
  AVG(moodScore) FILTER (WHERE aiConfidence > 80) as high_confidence_avg,
  AVG(moodScore) FILTER (WHERE aiConfidence <= 80) as low_confidence_avg
FROM mood_entries;
```

**Advanced Analytics**:
- Word cloud of common mood phrases
- Correlation between AI confidence and user edits (model accuracy)
- Emotion co-occurrence ("stressed" + "productive" = ??)

**Limitation** (-1):
- Dependency on AI accuracy (might misinterpret sarcasm, idioms)

### ADHD-Friendliness Score: 6/10

**Justification**:

**Strengths** (+6):
- ✅ **Natural**: Speaking feels easier than choosing options
- ✅ **Fast**: No button hunting, just talk
- ✅ **Expressive**: Can vent ("UGH today was awful") = cathartic
- ✅ **Low cognitive load**: No need to translate feelings → categories
- ✅ **Conversational**: Feels like talking to a friend

**Weaknesses** (-4):
- ⚠️ **Not always available**: Can't use in meetings, public spaces, quiet times
- ⚠️ **Anxiety-inducing**: Some ADHD users hate hearing their voice
- ⚠️ **Requires review step**: Must confirm AI interpretation (extra step)
- ⚠️ **Tech anxiety**: "Did it hear me right?" (trust issues)
- ⚠️ **Privacy concerns**: Voice data storage = creepy factor

**ADHD-Specific Concerns**:
- **Verbal processing differences**: Some ADHD users struggle to articulate feelings
- **Time pressure**: "Say something NOW" can cause freeze response
- **Perfectionism**: Might re-record multiple times ("that didn't sound right")

**Mitigations**:
- Always offer text alternative (tap text field instead)
- Show transcription in real-time (reduces "did it hear me?" anxiety)
- Allow skip AI review step (auto-accept if confidence > 90%)
- Offline mode: Store audio, process later

### Implementation Complexity: Hard

**Technical Requirements**:

**Frontend** (Medium):
- Speech-to-text API integration (Web Speech API or native)
- Waveform animation during recording
- Real-time transcription display
- Edit UI for AI corrections

**Backend** (Hard):
- AI API integration (OpenAI GPT-4, Claude, or Gemini)
- Structured output parsing (JSON extraction)
- Audio storage (if keeping recordings)
- Fallback logic (if AI fails)

**Timeline Estimate**: 4-5 weeks
- Week 1: Speech-to-text integration
- Week 2: AI extraction logic + prompt engineering
- Week 3: Edit UI + correction flow
- Week 4: Offline mode + audio storage
- Week 5: Testing + prompt refinement (accuracy tuning)

**Dependencies**:
- Speech recognition API (browser or native)
- LLM API (OpenAI $0.01-0.03 per log)
- Audio storage (AWS S3 or similar, if storing recordings)

**Cost Considerations**:
- GPT-4 API: ~$0.02 per mood log (60 tokens × $0.03/1K)
- Claude Haiku: ~$0.001 per mood log (cheaper alternative)
- Annual cost for daily logging: $7-$73/year

**Risk Factors**:
- **Privacy**: Users may distrust voice data collection
- **Accuracy**: AI might misinterpret colloquialisms, sarcasm
- **Latency**: 1-2 second delay feels slow
- **Offline**: Won't work without internet (unless local model)

---

## Approach 6: Contextualized Quick Buttons

### UI Mockup Description

```
// Morning (6-10 AM):
┌─────────────────────────────┐
│   Good morning! 🌅          │
│   How did you sleep?        │
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │
│   │ 😴  │ │ 😐  │ │ 😊  │  │
│   │Rough│ │Okay │ │Great│  │
│   └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘

// Daytime (10 AM - 6 PM):
┌─────────────────────────────┐
│   How's your day going? ⏰  │
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │
│   │ 😰  │ │ 😐  │ │ ⚡  │  │
│   │Stress│ │Fine │ │Great│  │
│   └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘

// Evening (6-10 PM):
┌─────────────────────────────┐
│   How was today? 🌙         │
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │
│   │ 😔  │ │ 😐  │ │ 😊  │  │
│   │Rough│ │Okay │ │Good │  │
│   └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘

// After habit completion:
┌─────────────────────────────┐
│   ✓ Exercise completed!     │
│   How do you feel?          │
│                             │
│   ┌─────┐ ┌─────┐ ┌─────┐  │
│   │ 🥵  │ │ 💪  │ │ ⚡  │  │
│   │Wiped│ │Strong│ │Pumped│ │
│   └─────┘ └─────┘ └─────┘  │
└─────────────────────────────┘
```

**Visual Design**:
- Context-specific greeting (changes by time/activity)
- 3 buttons tailored to context (not generic good/meh/bad)
- Emoji + label customized to situation
- Subtle animation (sunrise → daytime → moon)
- Haptic feedback on selection

### User Flow

**Morning Check-In**:
1. Wake up notification: "How did you sleep?"
2. Tap "Rough" / "Okay" / "Great"
3. Auto-saves as morning mood

**Daytime Check-In** (mid-day prompt):
1. Notification: "How's your day going?"
2. Tap "Stressed" / "Fine" / "Great"
3. Auto-saves as midday mood

**Post-Habit Check-In**:
1. Complete "Exercise" habit
2. Notification: "How do you feel?"
3. Tap context-specific option ("Wiped" / "Strong" / "Pumped")
4. Auto-saves with habit linkage

**Evening Reflection**:
1. Evening notification: "How was today?"
2. Tap "Rough" / "Okay" / "Good"
3. Auto-saves as evening summary

**Interaction time**: 1 tap (2-3 seconds)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Context-specific data
  contextType: 'morning-sleep' | 'daytime-general' | 'evening-reflection' |
               'post-habit' | 'manual';
  selectedOption: string; // e.g., "rough", "great", "stressed", "pumped"

  // Normalized scores (for correlation)
  moodScore: number;      // 25/50/75 (mapped from context options)
  energyLevel: number;    // Inferred from context + option

  // Context metadata
  timeOfDay: 'morning' | 'midday' | 'evening' | 'night';
  relatedHabitId?: string;
  habitCategory?: string; // e.g., "exercise", "meditation", "work"

  // Tracking
  triggerSource: 'scheduled-prompt' | 'habit-completion' | 'manual';
}
```

**Context → Score Mapping**:
```typescript
const contextMappings = {
  'morning-sleep': {
    rough: { mood: 25, energy: 20 },
    okay: { mood: 50, energy: 50 },
    great: { mood: 75, energy: 80 }
  },
  'daytime-general': {
    stressed: { mood: 30, energy: 40 },
    fine: { mood: 55, energy: 50 },
    great: { mood: 80, energy: 70 }
  },
  'evening-reflection': {
    rough: { mood: 25, energy: 30 },
    okay: { mood: 50, energy: 45 },
    good: { mood: 75, energy: 60 }
  },
  'post-exercise': {
    wiped: { mood: 50, energy: 20 },   // Tired but accomplished
    strong: { mood: 75, energy: 60 },
    pumped: { mood: 85, energy: 90 }
  }
};
```

### Correlation-Readiness: 7/10

**Strengths**:
- ✅ **Context-rich**: Knows what question was asked
- ✅ **Time-based**: Can analyze morning vs. evening patterns
- ✅ **Habit-linked**: Direct correlation with specific activities
- ✅ **Normalized scores**: All options map to 0-100 scale
- ✅ **Natural language**: "Rough sleep" = clearer than "3/10"

**Weaknesses**:
- ⚠️ **Inconsistent scales**: "Rough sleep" vs. "Stressed day" aren't directly comparable
- ⚠️ **Data fragmentation**: Multiple schemas (sleep vs. general vs. post-habit)
- ⚠️ **Confounding variables**: Did "great" mean mood or energy?

**Example Correlation Queries**:
```sql
-- Habit impact (post-habit moods only)
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood_after,
  ARRAY_AGG(m.selectedOption) as common_feelings
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
WHERE m.contextType = 'post-habit'
GROUP BY h.name;

-- Sleep quality → day quality
SELECT
  morning.selectedOption as sleep_quality,
  AVG(evening.moodScore) as avg_evening_mood
FROM mood_entries morning
JOIN mood_entries evening
  ON DATE(morning.timestamp) = DATE(evening.timestamp)
  AND evening.contextType = 'evening-reflection'
WHERE morning.contextType = 'morning-sleep'
GROUP BY morning.selectedOption;

-- Time-of-day patterns
SELECT
  timeOfDay,
  AVG(moodScore) as avg_mood
FROM mood_entries
GROUP BY timeOfDay;
```

**Advanced Analytics**:
- Sleep quality → next-day productivity correlation
- Exercise timing → evening mood correlation
- Stress patterns by day of week

### ADHD-Friendliness Score: 9/10

**Justification**:

**Strengths** (+9):
- ✅ **Hyper-relevant**: Question matches current context (low cognitive load)
- ✅ **No decision fatigue**: Only 3 options, customized to situation
- ✅ **Fast**: 1 tap, done (same speed as Quick Check-In)
- ✅ **Conversational**: Feels like app is asking the right question
- ✅ **Natural language**: "How did you sleep?" > "Rate your mood 1-10"
- ✅ **Contextual cues**: Time-based prompts reduce "what should I log?" confusion
- ✅ **Habit reinforcement**: Post-habit check-in = instant dopamine hit

**Weaknesses** (-1):
- ⚠️ **Requires understanding context**: "Why is it asking about sleep at 2 PM?" (if schedule shifts)

**ADHD-Specific Features**:
- **Removes abstraction**: "How do you feel?" (vague) → "How did you sleep?" (concrete)
- **Smart timing**: Prompts appear when relevant (not random)
- **Pattern recognition**: Same question at same time = habit formation

**Use Case**:
- 7 AM: "How did you sleep?" → Tap "Okay" (2 seconds)
- 12 PM: "How's your day?" → Tap "Fine" (2 seconds)
- 3 PM: Complete "Exercise" → "How do you feel?" → Tap "Pumped" (2 seconds)
- 9 PM: "How was today?" → Tap "Good" (2 seconds)

**Total daily logging time**: 8 seconds across 4 check-ins (vs. 40+ seconds with sliders)

### Implementation Complexity: Medium

**Technical Requirements**:

**Frontend** (Medium):
- Time-based context detection (morning/midday/evening)
- Habit-type detection (exercise → specific options)
- Dynamic button generator (3 options per context)
- Notification scheduling system

**Backend** (Medium):
- Context mapping tables (habit → question + options)
- Time-zone aware scheduling
- Context-to-score normalization logic

**Timeline Estimate**: 2-3 weeks
- Week 1: Context detection + dynamic UI
- Week 2: Notification scheduling + habit integration
- Week 3: Score normalization + correlation queries

**Dependencies**:
- Notification system (push notifications)
- Habit tracking integration (trigger post-habit prompts)
- Time-zone library (for accurate context detection)

**Risk Factors**:
- **Schedule sensitivity**: User wakes up at 2 PM → morning prompt at 7 AM is wrong
- **Context mismatch**: User does yoga at 10 PM → gets "evening reflection" instead of "post-yoga"
- **Notification fatigue**: 4 daily prompts might feel overwhelming

**Mitigations**:
- User-configurable schedule (set morning/evening times)
- Smart learning: Adjust context based on user patterns
- Frequency settings: Allow user to disable certain prompts

---

## Approach 7: Hybrid (Best of Multiple)

### UI Mockup Description

```
// Default view (collapsed):
┌─────────────────────────────┐
│   How are you feeling?      │
│                             │
│   😊  😐  😔  😰  ⚡       │
│                             │
│   [+ Add note]              │
│   [⌃ More options]          │
└─────────────────────────────┘

// After tapping emoji (minimal path):
┌─────────────────────────────┐
│   😊 Happy                  │
│                             │
│   Quick note (optional):    │
│   ________________________  │
│                             │
│   [Log Mood ✓]              │
│   [⌃ More details]          │
└─────────────────────────────┘

// Expanded view (swipe up or tap "More"):
┌─────────────────────────────┐
│   😊 Happy                  │
│                             │
│   Intensity:                │
│   ○ Light  ● Medium  ○ Strong│
│                             │
│   Energy level:             │
│   🥱 ━━━●━━━━━━ ⚡          │
│                             │
│   Why? (tags)               │
│   [💼 Work] [🏃 Exercise]   │
│                             │
│   Note: _________________   │
│                             │
│      [Log Mood ✓]           │
└─────────────────────────────┘

// Long-press for voice:
┌─────────────────────────────┐
│   🎤 Listening...           │
│                             │
│   ～～～～～～～～～～～～～ │
│                             │
│   "Feeling good but tired"  │
│                             │
│   [Cancel] [✓ Use this]     │
└─────────────────────────────┘
```

**Visual Design**:
- **Default**: 5 large emoji buttons (horizontal row)
- **Progressive disclosure**: Additional options slide up
- **Gestural**: Swipe up for details, long-press for voice
- **Visual hierarchy**: Primary action (emoji) is largest, details are secondary
- **Haptic feedback**: Different vibrations for tap vs. swipe vs. long-press

### User Flow

**Path 1: Minimal (1 tap)**
1. Tap emoji (😊)
2. Auto-saves after 2 seconds
3. Done (2 seconds)

**Path 2: Quick Note (2 taps)**
1. Tap emoji (😊)
2. Tap "Add note" field
3. Type quick note
4. Tap "Log Mood"
5. Done (10 seconds)

**Path 3: Detailed (swipe + interactions)**
1. Tap emoji (😊)
2. Swipe up for "More options"
3. Adjust intensity (light/medium/strong)
4. Drag energy slider
5. Select context tags
6. Optionally add note
7. Tap "Log Mood"
8. Done (20-30 seconds)

**Path 4: Voice (long-press)**
1. Long-press anywhere on screen
2. Speak mood
3. Review AI interpretation
4. Confirm or edit
5. Done (10-15 seconds)

**Interaction time**: 2 seconds (minimal) to 30 seconds (detailed)

### Data Schema

```typescript
interface MoodEntry {
  id: string;
  timestamp: Date;
  userId: string;

  // Core mood data (always present)
  primaryEmotion: 'happy' | 'neutral' | 'sad' | 'anxious' | 'energized';

  // Derived base score
  moodScore: number; // 0-100 (from emotion)

  // Optional enrichment (progressive disclosure)
  intensity?: 1 | 2 | 3;
  energyLevel?: number; // 0-100 (if slider used)
  stressLevel?: number; // 0-100 (if expanded)

  // Context (optional)
  contextTags?: string[];
  note?: string;

  // Voice input (optional)
  voiceTranscription?: string;
  voiceExtracted?: {
    aiMoodScore: number;
    aiEnergyLevel: number;
    aiConfidence: number;
  };

  // Metadata
  inputMethod: 'emoji-only' | 'emoji-note' | 'emoji-detailed' | 'voice';
  completionTimeMs: number; // How long did logging take?
  wasExpanded: boolean; // Did user view detailed options?

  triggerSource: 'habit-completion' | 'scheduled-prompt' | 'manual';
  relatedHabitId?: string;
}
```

**Score Calculation** (adapts to input method):
```typescript
function calculateMoodScore(entry: MoodEntry): number {
  // Base score from emotion
  const emotionScores = {
    happy: 85, neutral: 50, sad: 25, anxious: 30, energized: 75
  };
  let score = emotionScores[entry.primaryEmotion];

  // Intensity modifier (if provided)
  if (entry.intensity) {
    const intensityMod = { 1: -10, 2: 0, 3: +10 };
    score += intensityMod[entry.intensity];
  }

  // Energy modifier (if provided)
  if (entry.energyLevel !== undefined) {
    score = (score * 0.7) + (entry.energyLevel * 0.3);
  }

  // Voice override (if provided and high confidence)
  if (entry.voiceExtracted && entry.voiceExtracted.aiConfidence > 85) {
    score = entry.voiceExtracted.aiMoodScore;
  }

  return Math.min(100, Math.max(0, score));
}
```

### Correlation-Readiness: 9/10

**Strengths**:
- ✅ **Flexible granularity**: Simple logs still useful, detailed logs better
- ✅ **Consistent base score**: All entries have moodScore (comparable)
- ✅ **Rich when needed**: Optional fields enable deep analysis
- ✅ **Voice data**: Qualitative insights when available
- ✅ **Input method tracking**: Can analyze "detailed logs vs. quick logs"

**Example Correlation Queries**:
```sql
-- Habit impact (all logs, regardless of detail level)
SELECT
  h.name,
  AVG(m.moodScore) as avg_mood,
  AVG(m.energyLevel) FILTER (WHERE m.energyLevel IS NOT NULL) as avg_energy_when_logged
FROM mood_entries m
JOIN habits h ON m.relatedHabitId = h.id
GROUP BY h.name;

-- Detail level analysis (do detailed logs correlate with mood?)
SELECT
  inputMethod,
  AVG(moodScore) as avg_mood,
  AVG(completionTimeMs) as avg_time
FROM mood_entries
GROUP BY inputMethod;

-- Voice sentiment over time
SELECT
  DATE_TRUNC('week', timestamp) as week,
  AVG(moodScore) FILTER (WHERE inputMethod = 'voice') as voice_avg_mood,
  STRING_AGG(voiceTranscription, ' | ') FILTER (WHERE inputMethod = 'voice') as voice_samples
FROM mood_entries
GROUP BY week;
```

**Advanced Analytics**:
- Compare "quick logs" vs. "detailed logs" accuracy (if user later edits)
- Energy patterns (users who log energy vs. those who don't)
- Note text analysis (word clouds, sentiment trends)

**Limitation** (-1):
- Inconsistent data density (some entries rich, some minimal) makes statistical comparisons tricky

### ADHD-Friendliness Score: 9.5/10

**Justification**:

**Strengths** (+9.5):
- ✅ **Respects energy levels**: Quick when tired, detailed when motivated
- ✅ **No forced complexity**: Defaults to simplest path (1 tap)
- ✅ **Discoverable depth**: "More options" visible but not intrusive
- ✅ **Multiple modalities**: Tap, swipe, voice (suits different preferences)
- ✅ **Forgiving**: No wrong way to use it
- ✅ **Dopamine optimization**: Emoji tap = instant visual feedback
- ✅ **Voice escape hatch**: When brain is too foggy for buttons
- ✅ **Progressive disclosure**: Complexity hidden until wanted

**Weaknesses** (-0.5):
- ⚠️ **Feature discovery**: User might not know about swipe/long-press (needs tutorial)

**ADHD-Specific Features**:
- **Executive function accommodation**: Low-function days = 1 tap, high-function days = detailed
- **Hyperfocus support**: Can add extensive notes when motivated
- **Decision fatigue prevention**: Default path has zero decisions beyond emoji
- **Sensory variety**: Visual (emoji), tactile (swipe), auditory (voice)

**Use Cases**:

*Low-energy morning*:
- Tap 😔 → Auto-logs in 2 seconds

*Post-workout high*:
- Tap ⚡ → Swipe up → Adjust intensity to "Strong" → Add tags "Exercise, Endorphins" → Log
- Total time: 15 seconds (but user is motivated)

*Late-night journal mode*:
- Long-press → Speak entire day recap → AI extracts mood + energy → Confirm
- Total time: 20 seconds, but felt conversational

### Implementation Complexity: Hard

**Technical Requirements**:

**Frontend** (Hard)**:
- Multi-path UI (emoji, expanded, voice)
- Gesture handling (swipe, long-press)
- Progressive disclosure animations
- Voice integration + waveform
- Dynamic form (fields appear conditionally)

**Backend** (Medium):
- Flexible schema (nullable fields)
- AI integration (for voice)
- Score calculation (adapts to available data)

**Timeline Estimate**: 5-6 weeks
- Week 1: Core emoji UI + minimal path
- Week 2: Expanded view (sliders, tags, intensity)
- Week 3: Voice integration + AI extraction
- Week 4: Gestures (swipe, long-press) + animations
- Week 5: Polish + tutorial (feature discovery)
- Week 6: Testing + refinement

**Dependencies**:
- Gesture library (react-native-gesture-handler)
- Animation library (Reanimated or Lottie)
- Speech-to-text (Web Speech API or native)
- AI API (Claude/GPT for voice processing)

**Risk Factors**:
- **Complexity**: Most complex to build and maintain
- **Feature discoverability**: Users might not find swipe/voice features
- **Testing burden**: 4 different input paths = 4x test coverage needed

**Mitigations**:
- Onboarding tutorial: "Try swiping up for more options!"
- Contextual hints: "Tip: Long-press for voice input" (after 5 emoji-only logs)
- Analytics tracking: Monitor which paths users take (remove unused features)

---

## 🎯 RECOMMENDATION

### Top Choice: **Hybrid Approach (Approach 7)** with fallback to **Quick Check-In (Approach 3)**

**Why Hybrid wins**:

1. **Maximum flexibility** - Respects user's current mental state
   - Overwhelmed? 1 tap (😐)
   - Motivated? Swipe up for details
   - Can't choose? Long-press and speak

2. **ADHD-optimized** - Adapts to executive function fluctuations
   - Bad brain day: Minimal path (no shame, no complexity)
   - Good brain day: Can nerd out with sliders and notes
   - Progressive disclosure prevents overwhelm

3. **Data quality** - Best of both worlds
   - Minimal logs: Still get baseline mood score
   - Detailed logs: Rich correlation data when available
   - Voice logs: Qualitative insights for nuance

4. **Future-proof** - Can evolve with user
   - Week 1: User only taps emoji (builds habit)
   - Month 2: Discovers "More options" (gradual complexity)
   - Month 6: Uses voice for journaling (advanced usage)

**Why Quick Check-In is the fallback**:
- If Hybrid proves too complex to build, Quick Check-In delivers 80% of the value in 20% of the effort
- Still ADHD-friendly (10/10 score)
- Still enables basic correlation analysis
- Can be upgraded to Hybrid later (just add progressive disclosure)

### Runner-Up: **Contextualized Quick Buttons (Approach 6)**

**Why it's great**:
- Highest contextual relevance (right question at right time)
- Zero cognitive load (app decides what to ask)
- Natural language > abstract scales

**Why it didn't win**:
- Locked into predefined contexts (less flexible)
- Harder to compare across contexts (data fragmentation)
- Requires complex notification logic

**When to choose this instead**:
- User wants fully automated mood tracking (no decisions)
- App already has strong notification system
- User follows predictable daily routine

---

## 📊 COMPARISON MATRIX

| Criteria | Emoji Wheel | Color Gradient | Quick Check-In | Dim. Sliders | Voice AI | Contextualized | Hybrid |
|----------|-------------|----------------|----------------|--------------|----------|----------------|--------|
| **Speed** | ⚡⚡ (3-8s) | ⚡⚡⚡ (2-5s) | ⚡⚡⚡ (2s) | ⚡ (10-20s) | ⚡⚡ (10-15s) | ⚡⚡⚡ (2s) | ⚡⚡⚡ (2-30s) |
| **Data Richness** | 📊📊📊 (9/10) | 📊📊📊📊 (10/10) | 📊 (6/10) | 📊📊📊📊 (10/10) | 📊📊📊 (9/10) | 📊📊 (7/10) | 📊📊📊 (9/10) |
| **ADHD-Friendly** | 🧠🧠🧠🧠 (8.5) | 🧠🧠🧠 (7) | 🧠🧠🧠🧠🧠 (10) | 🧠🧠 (5) | 🧠🧠🧠 (6) | 🧠🧠🧠🧠 (9) | 🧠🧠🧠🧠 (9.5) |
| **Complexity** | 🛠️🛠️ (Medium) | 🛠️🛠️🛠️ (Hard) | 🛠️ (Easy) | 🛠️🛠️ (Medium) | 🛠️🛠️🛠️ (Hard) | 🛠️🛠️ (Medium) | 🛠️🛠️🛠️ (Hard) |
| **Correlation** | ✅ Excellent | ✅ Perfect | ⚠️ Basic | ✅ Perfect | ✅ Excellent | ✅ Good | ✅ Excellent |
| **Flexibility** | ⚠️ Locked to 8 | ⚠️ Abstract | ⚠️ 3 options | ⚠️ Sliders only | ✅ Natural | ⚠️ Context-locked | ✅ Adapts |
| **Privacy** | ✅ Local | ✅ Local | ✅ Local | ✅ Local | ⚠️ Cloud AI | ✅ Local | ⚠️ Cloud (voice) |
| **Offline** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ⚠️ Partial |
| **Cost** | $0 | $0 | $0 | $0 | $7-73/year | $0 | $7-73/year |

**Legend**:
- ⚡ = Speed (more = faster)
- 📊 = Data richness (more = better correlation)
- 🧠 = ADHD-friendliness (more = better)
- 🛠️ = Implementation complexity (more = harder)

---

## 🚀 MVP STRATEGY

### Phase 1: Foundation (Week 1-2) - **Quick Check-In**

**Build**: Approach 3 (Quick Check-In)
- 3 buttons (Good/Meh/Bad)
- Basic data model
- Habit integration (post-completion prompt)

**Why start here**:
- Fastest to ship (1 week)
- Validates core assumption (will user log mood at all?)
- Establishes baseline data collection
- Easy to upgrade later

**Success Metrics**:
- 70%+ completion rate on post-habit prompts
- Average log time < 5 seconds
- User feedback: "This is easy"

### Phase 2: Enhancement (Week 3-4) - **Add Emoji Wheel**

**Upgrade**: Quick Check-In → Emoji Wheel (Approach 1)
- Replace 3 buttons with 8 emoji options
- Add intensity selector (light/medium/strong)
- Add optional context tags

**Why add this**:
- User data shows Quick Check-In is too simple ("I want more options")
- Correlation analysis needs more granularity
- Still fast (3-8 seconds)

**Success Metrics**:
- Users select non-default intensity 40%+ of time
- Context tags added 25%+ of time
- Average mood score variance increases (more nuance)

### Phase 3: Progressive Disclosure (Week 5-6) - **Hybrid Core**

**Upgrade**: Emoji Wheel → Hybrid (Approach 7 - no voice yet)
- Add "More options" swipe-up
- Add energy slider (optional)
- Add note field (optional)
- Track input method (minimal vs. detailed)

**Why add this**:
- Power users want more detail
- Casual users still get 1-tap experience
- Data shows who uses what (inform future features)

**Success Metrics**:
- 60%+ still use minimal path (validates progressive disclosure)
- 20-30% expand for details (validates feature)
- Detailed logs correlate with higher engagement

### Phase 4: Voice (Week 7-8) - **Full Hybrid**

**Add**: Voice input (Approach 7 complete)
- Long-press for voice
- AI extraction (Claude Haiku API)
- Voice transcription storage

**Why add last**:
- Most complex feature
- Not essential for MVP
- Can validate demand first ("Would you use voice input?" survey)

**Success Metrics**:
- 10%+ users try voice at least once
- Voice logs have higher note completion (vs. manual typing)
- AI confidence > 80% average

### Phase 5: Context Awareness (Week 9-10) - **Optional**

**Add**: Contextualized prompts (Approach 6 elements)
- Morning: "How did you sleep?"
- Post-exercise: "How do you feel?"
- Evening: "How was today?"

**Why add as bonus**:
- Personalization increases engagement
- Reduces "what should I log?" decision fatigue
- Can A/B test vs. generic "How are you feeling?"

**Success Metrics**:
- Contextualized prompts have 10%+ higher completion rate
- User feedback: "App feels more personal"

---

## 🔗 INTEGRATION POINTS

### 1. Habit Tracking Integration

**Trigger Points**:
```typescript
// After habit completion
onHabitComplete(habitId: string) {
  // Immediate mood prompt (within 5 seconds)
  showMoodPrompt({
    trigger: 'habit-completion',
    relatedHabitId: habitId,
    contextType: getHabitContext(habitId), // e.g., "post-exercise"
  });
}

// Scheduled check-ins (independent of habits)
scheduleMoodPrompts([
  { time: '09:00', type: 'morning-general' },
  { time: '21:00', type: 'evening-reflection' }
]);
```

**Data Linkage**:
```sql
-- Link mood to habit completion
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_score INT NOT NULL,
  related_habit_id UUID REFERENCES habits(id),
  trigger_source TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Query: Average mood after each habit
SELECT
  h.name AS habit_name,
  AVG(m.mood_score) AS avg_mood_after,
  COUNT(m.id) AS total_logs
FROM habits h
LEFT JOIN mood_entries m ON m.related_habit_id = h.id
WHERE m.trigger_source = 'habit-completion'
GROUP BY h.name
ORDER BY avg_mood_after DESC;
```

**UI Integration**:
- Habit completion screen → Mood prompt appears as bottom sheet
- Habit list view → Show mood emoji next to each habit completion
- Habit detail → "Your average mood after this habit: 72/100 😊"

### 2. Journal Integration

**Trigger Points**:
```typescript
// Before journal entry
onJournalStart() {
  // Optional: Pre-populate journal with current mood
  const mood = getCurrentMoodIfRecent(); // Last 1 hour
  if (mood) {
    prefillJournal(`Feeling ${mood.emotion} today...`);
  }
}

// After journal entry
onJournalSave(journalId: string, content: string) {
  // Capture mood snapshot with journal
  if (!recentMoodExists()) {
    showMoodPrompt({
      trigger: 'journal-entry',
      relatedJournalId: journalId,
      prefillFromContent: true // AI extract mood from journal text
    });
  }
}
```

**Mood Snapshot in Journal**:
```typescript
interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;

  // Mood snapshot (captured at time of writing)
  moodSnapshot?: {
    moodScore: number;
    emotion: string;
    energyLevel: number;
  };
}
```

**Journal UI Enhancement**:
```
┌─────────────────────────────┐
│   Journal - Nov 16, 2025    │
│                             │
│   😊 Mood: Happy (75/100)   │
│   ⚡ Energy: High (80/100)  │
│                             │
│   Today was productive...   │
│   [Journal content]         │
└─────────────────────────────┘
```

### 3. Dashboard Integration

**Mood Visualization Options**:

**Option A: Line Chart (Trend Over Time)**
```typescript
// 30-day mood trend
<LineChart
  data={moodEntries.map(e => ({
    date: e.timestamp,
    mood: e.moodScore,
    energy: e.energyLevel
  }))}
  xAxis="date"
  yAxis={["mood", "energy"]}
  colors={["#4CAF50", "#FFC107"]}
/>
```

**Option B: Calendar Heatmap**
```typescript
// GitHub-style contribution graph
<CalendarHeatmap
  data={moodEntries}
  colorScale={[
    { value: 0, color: '#d32f2f' },   // Red (bad)
    { value: 50, color: '#fdd835' },  // Yellow (meh)
    { value: 100, color: '#388e3c' }  // Green (good)
  ]}
  onClick={date => showDayDetail(date)}
/>
```

**Option C: Emoji Timeline**
```typescript
// Visual timeline of mood emojis
<Timeline>
  {moodEntries.map(entry => (
    <TimelineItem
      time={entry.timestamp}
      emoji={entry.emotion} // 😊😐😔
      onClick={() => showMoodDetail(entry.id)}
    />
  ))}
</Timeline>
```

**Dashboard Layout**:
```
┌─────────────────────────────┐
│   Dashboard                 │
│                             │
│   📊 Mood Overview          │
│   ┌───────────────────────┐ │
│   │ [30-day line chart]   │ │
│   │  Trend: ↗ +12%        │ │
│   └───────────────────────┘ │
│                             │
│   🎯 Mood-Habit Correlation │
│   Exercise:      😊 78/100  │
│   Meditation:    😌 82/100  │
│   Work sessions: 😐 62/100  │
│                             │
│   📅 This Week              │
│   M T W T F S S             │
│   😊😐😔😊😊😌😊            │
└─────────────────────────────┘
```

### 4. Correlation Analytics

**Key Metrics to Display**:

**A. Habit Impact Ranking**
```sql
-- Which habits improve mood most?
SELECT
  h.name,
  AVG(m.mood_score) - (
    SELECT AVG(mood_score) FROM mood_entries WHERE user_id = $1
  ) AS mood_improvement,
  COUNT(m.id) AS sample_size
FROM habits h
JOIN mood_entries m ON m.related_habit_id = h.id
WHERE h.user_id = $1
GROUP BY h.name
HAVING COUNT(m.id) >= 5 -- Minimum sample size
ORDER BY mood_improvement DESC;
```

**UI Display**:
```
Top Mood Boosters:
1. 🏃 Morning Run      +18 points
2. 🧘 Meditation       +12 points
3. 📚 Reading          +8 points

Mood Drainers:
1. 📱 Social Media     -15 points
2. 🍔 Junk Food        -8 points
```

**B. Time-of-Day Patterns**
```sql
-- When is mood best/worst?
SELECT
  EXTRACT(HOUR FROM timestamp) AS hour_of_day,
  AVG(mood_score) AS avg_mood
FROM mood_entries
WHERE user_id = $1
GROUP BY hour_of_day
ORDER BY hour_of_day;
```

**UI Display**:
```
Your Mood by Time:
🌅 Morning (6-12):   68/100 😊
☀️ Afternoon (12-6): 55/100 😐
🌙 Evening (6-12):   72/100 😊
```

**C. Streak Impact**
```sql
-- Does habit consistency → better mood?
WITH habit_streaks AS (
  SELECT
    user_id,
    habit_id,
    COUNT(*) AS streak_length
  FROM habit_completions
  WHERE completed_at >= NOW() - INTERVAL '7 days'
  GROUP BY user_id, habit_id
)
SELECT
  hs.streak_length,
  AVG(m.mood_score) AS avg_mood
FROM habit_streaks hs
JOIN mood_entries m ON m.user_id = hs.user_id
  AND m.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY hs.streak_length
ORDER BY hs.streak_length;
```

**UI Display**:
```
Consistency = Happiness:
7-day streak:   82/100 😊
3-day streak:   68/100 😊
No streak:      52/100 😐

Keep going! 🔥
```

### 5. Notification Strategy

**Prompt Timing** (avoid notification fatigue):

**Low-frequency mode** (default):
- Post-habit only (no scheduled prompts)
- 1-3 prompts/day max

**Medium-frequency mode**:
- Morning check-in (9 AM)
- Post-habit prompts
- Evening reflection (9 PM)
- 2-5 prompts/day

**High-frequency mode** (research mode):
- Morning, midday, evening, night
- All post-habit prompts
- 4-8 prompts/day

**Smart Scheduling**:
```typescript
// Don't prompt if user just logged
function shouldPromptMood(): boolean {
  const lastLog = getLastMoodEntry();
  const hoursSinceLog = (Date.now() - lastLog.timestamp) / 1000 / 60 / 60;

  // Don't prompt within 2 hours of last log
  if (hoursSinceLog < 2) return false;

  // Don't prompt during "focus time" (if user set)
  if (isInFocusMode()) return false;

  // Don't prompt after 10 PM (sleep time)
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) return false;

  return true;
}
```

---

## 🎨 VISUALIZATION RECOMMENDATIONS

### Primary: Calendar Heatmap

**Why**:
- ✅ Instant visual pattern recognition (good week vs. bad week)
- ✅ GitHub-style familiarity (ADHD users love gamification)
- ✅ Tap any day → See detail (what happened that day?)
- ✅ Long-term trends (3 months at a glance)

**Implementation**:
```typescript
import CalendarHeatmap from 'react-calendar-heatmap';

<CalendarHeatmap
  startDate={new Date('2025-09-01')}
  endDate={new Date('2025-11-16')}
  values={moodEntries.map(e => ({
    date: e.timestamp,
    count: e.moodScore // 0-100
  }))}
  classForValue={(value) => {
    if (!value) return 'color-empty';
    if (value.count < 33) return 'color-scale-1'; // Red
    if (value.count < 66) return 'color-scale-2'; // Yellow
    return 'color-scale-3'; // Green
  }}
  onClick={(value) => showDayDetail(value.date)}
/>
```

### Secondary: Line Chart with Habit Annotations

**Why**:
- ✅ Shows trend over time (is mood improving?)
- ✅ Overlays habit completions (visual correlation)
- ✅ Confidence intervals (account for data sparsity)

**Implementation**:
```typescript
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip } from 'recharts';

<LineChart data={dailyMoodData}>
  <XAxis dataKey="date" />
  <YAxis domain={[0, 100]} />
  <Line type="monotone" dataKey="avgMood" stroke="#4CAF50" />
  <Line type="monotone" dataKey="avgEnergy" stroke="#FFC107" />

  {/* Habit completion markers */}
  {exerciseDays.map(day => (
    <ReferenceLine x={day} stroke="#2196F3" label="🏃" />
  ))}

  <Tooltip content={<CustomTooltip />} />
</LineChart>

// Custom tooltip shows:
// "Nov 16: Mood 75/100, Energy 60/100"
// "Habits: Exercise, Meditation"
```

### Tertiary: Correlation Scatter Plot (Advanced)

**Why**:
- ✅ Visualizes habit → mood correlation
- ✅ Identifies outliers ("Why was mood high despite no exercise?")
- ✅ Research-grade insight

**Implementation**:
```typescript
<ScatterChart>
  <XAxis label="Days Since Last Exercise" />
  <YAxis label="Mood Score" domain={[0, 100]} />
  <Scatter
    data={moodData.map(e => ({
      daysSinceExercise: calculateDaysSince(e.timestamp, 'exercise'),
      mood: e.moodScore
    }))}
    fill="#4CAF50"
  />
  <Tooltip />
</ScatterChart>

// Shows: Mood drops after 3+ days without exercise
```

---

## 🧠 ACCESSIBILITY: Emotion Identification Support

**Challenge**: Some ADHD users struggle with alexithymia (difficulty identifying emotions)

**Solutions**:

### 1. Emotion Wheel with Descriptions
```
😊 Happy: Light, positive feeling
😌 Content: Calm and satisfied
⚡ Energized: Alert and ready to go
😐 Neutral: Neither good nor bad
🥱 Tired: Low energy, need rest
😰 Anxious: Worried or on edge
😔 Sad: Down or disappointed
😤 Frustrated: Annoyed or stuck
```

### 2. Body-Based Alternative
```
Instead of "How do you feel?" ask:
"What's your body telling you?"

Options:
🔋 Full battery (energized, ready)
🪫 Half charged (okay, managing)
📵 Low battery (tired, drained)
⚡ Buzzing (anxious, restless)
🛌 Need rest (exhausted)
```

### 3. Visual Scale (No Words)
```
Show images:
☀️ Bright sunny day
⛅ Partly cloudy
☁️ Overcast
🌧️ Rainy
⛈️ Stormy

User taps weather = mood
```

### 4. "I don't know" Option
```
Always include:
🤷 Not sure / Can't tell

This:
- Reduces pressure (no forced introspection)
- Still logs timestamp (can correlate "unsure days" with habits)
- Prevents logging abandonment
```

### 5. AI Suggestion (from journal)
```
If user wrote journal first:
"Your journal sounds like you're feeling tired but accomplished. Is that right?"

[✓ Yes, use this] [✏️ Not quite] [🤷 Skip mood]
```

---

## 📝 FINAL SUMMARY

**Recommended Path**:
1. **Ship**: Quick Check-In (Approach 3) - Week 1
2. **Upgrade**: Emoji Wheel (Approach 1) - Week 3
3. **Enhance**: Hybrid (Approach 7 without voice) - Week 5
4. **Optional**: Add Voice (Approach 7 complete) - Week 7
5. **Optional**: Add Context (Approach 6 elements) - Week 9

**Why This Strategy**:
- ✅ Fast MVP (1 week to usable mood tracking)
- ✅ Incremental complexity (user grows with app)
- ✅ Data-driven decisions (each phase validates next)
- ✅ ADHD-friendly at every stage (never overwhelming)
- ✅ Correlation-ready from day 1 (all approaches store numeric scores)

**Key Principles**:
1. **Progressive disclosure** > All features at once
2. **Speed** > Precision (2-second log > 30-second detailed log)
3. **Flexible** > Rigid (hybrid > single approach)
4. **Visual** > Text (emoji > "Rate 1-10")
5. **Forgiving** > Prescriptive ("Meh" is valid, "I don't know" is valid)

**Success Metrics** (3-month target):
- 70%+ completion rate on mood prompts
- Average log time < 10 seconds
- 30%+ of users use expanded features at least once
- Statistically significant correlation between ≥3 habits and mood
- User feedback: "This doesn't feel like a chore"

---

*End of Mood Logging Alternatives Document*

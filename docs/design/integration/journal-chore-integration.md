# Journal & Chore Integration Points

## Philosophy

**Journaling and maintenance are connected:**
- Completing chores affects mood and energy
- Tracking both creates holistic life picture
- Reflection after effort builds satisfaction
- Patterns emerge (e.g., "I always feel energized after home projects")

---

## Integration Point 1: Post-Chore Journal Prompts

### Trigger:
When user completes a significant chore (estimated time >30 min OR cost >$100)

### Flow:

```
┌─────────────────────────────────────┐
│ HVAC Service Completed! ✓           │
│                                     │
│ Completed: May 12, 2025             │
│ Cost: $125.00                       │
│ Time: 1 hour 15 minutes             │
│                                     │
│ 💭 Reflect on this?                 │
│                                     │
│ "Take a moment to capture how you   │
│  feel after completing this         │
│  maintenance."                      │
│                                     │
│ [Quick Journal Entry] [Skip]        │
└─────────────────────────────────────┘
        │
        ▼ (User taps [Quick Journal Entry])
┌─────────────────────────────────────┐
│ Post-Chore Reflection               │
│                                     │
│ You completed:                      │
│ HVAC Service                        │
│                                     │
│ How do you feel now? (Optional)     │
│ [😊 Accomplished]                   │
│ [😌 Relieved]                       │
│ [😫 Exhausted]                      │
│ [💸 Stressed about cost]            │
│                                     │
│ Quick thoughts (Optional):          │
│ [Glad this is done for the year.    │
│  Tech said everything looks good -  │
│  feels good to be proactive.]       │
│                                     │
│ ♪ Now playing:                      │
│ [Auto-captured from Spotify]        │◄─── Spotify integration
│                                     │
│ [Save Entry] [Skip]                 │
└─────────────────────────────────────┘
```

### Custom Journal Template: "Post-Chore Reflection"

**Purpose:** Capture feeling of accomplishment after completing maintenance

**Category:** As-needed
**Estimated Time:** 2-3 minutes
**Icon:** ✅ | **Color:** Satisfying Green (#4CAF50)

**Sections:**
1. **What You Completed** (auto-filled, required)
   - Pre-populated with chore name
   - "HVAC Service", "Oil Change", etc.

2. **How It Feels** (multiple-choice, required)
   - Options: "Accomplished", "Relieved", "Proud", "Exhausted", "Frustrated", "Stressed"
   - Visual emoji selection

3. **What Went Well** (text, optional)
   - "What made this easier or better than expected?"
   - Max 150 characters

4. **What Was Hard** (text, optional)
   - "Any challenges or frustrations?"
   - Max 150 characters

5. **Next Time** (text, optional)
   - "Anything you'd do differently next time?"
   - Max 150 characters

**Mood Prompt:** After (captures post-accomplishment mood)
**Spotify Capture:** Auto
**Suggested Frequency:** After any chore >30 min

---

## Integration Point 2: Chore ↔ Task ↔ Journal Connection

### Data Flow:

```
CHORE (Maintenance Item)
    │
    ├──► Creates TASK (When due soon)
    │         │
    │         ├──► Task completed
    │         │         │
    │         │         ▼
    │         │    Update CHORE completion
    │         │         │
    │         │         └──► Trigger journal prompt
    │         │
    │         └──► Task created in journal
    │
    └──► Referenced in journal entries
```

### Example Timeline:

**May 5, 2025:**
- System reminder: "HVAC service due in 7 days"
- User creates task from chore

**May 8, 2025:**
- Journal entry (Daily Reflection):
  - "Tomorrow's Top 3: 1. Schedule HVAC appointment..."

**May 11, 2025:**
- Task: "Call HVAC company"
- Completed at 2:30 PM

**May 12, 2025:**
- HVAC service appointment (from chore)
- Service completed at 11:15 AM
- Chore marked complete with metrics
- Journal prompt triggered
- Post-Chore Reflection created

**May 12, 2025 (evening):**
- Journal entry (Daily Reflection):
  - "Today's Wins: Got HVAC serviced, no issues found!"
  - Energy Level: 7/10 (accomplished but tired)

### Database Relationships:

```typescript
interface JournalEntry {
  id: string
  template_id: string
  created_at: timestamp
  mood_before?: MoodSnapshot
  mood_after?: MoodSnapshot
  spotify_track?: SpotifyTrack
  sections: JournalSection[]

  // NEW: Links to tasks/chores
  linked_tasks?: string[] // Task IDs mentioned
  linked_chores?: string[] // Chore IDs mentioned
  triggered_by_chore?: string // If auto-prompted by chore completion
}

interface Task {
  // ... existing fields ...
  created_from_chore?: string // Chore ID if spawned from maintenance
  completed_at?: timestamp
}

interface Chore {
  // ... existing fields ...
  completion_history: ChoreCompletion[]
}

interface ChoreCompletion {
  completed_at: timestamp
  metrics: Record<string, any>
  journal_entry_id?: string // Link to reflection if created
}
```

---

## Integration Point 3: Mood Correlation Tracking

### Insight Generation:

**Question:** Does completing chores affect your mood?

**Data Collection:**
- Mood before chore (optional)
- Mood after chore (via post-chore journal)
- Mood in daily reflections on days with chore completion

**Analytics:**

```
┌─────────────────────────────────────┐
│ Insights: Chores & Mood             │
│                                     │
│ 📊 When you complete maintenance    │
│    tasks, your mood tends to be:    │
│                                     │
│    15% more "accomplished"          │
│    12% more "energized"             │
│                                     │
│ 🏆 Chores that boost your mood most:│
│    1. Vehicle maintenance (+22%)    │
│    2. Home projects (+18%)          │
│    3. Equipment maintenance (+12%)  │
│                                     │
│ 😓 Chores that drain you:           │
│    1. HVAC service (exhausting)     │
│    2. Gutter cleaning (physically   │
│       demanding)                    │
│                                     │
│ 💡 Tip: Schedule draining chores on │
│    days when you have fewer other   │
│    commitments.                     │
│                                     │
│ [View Full Report]                  │
└─────────────────────────────────────┘
```

**Privacy Note:** All analytics local-only, never shared

---

## Integration Point 4: Maintenance Stress Journaling

### Problem:
Chores piling up can cause anxiety

### Solution: "Maintenance Stress" Journal Template

**Template: Maintenance Overwhelm**

**Purpose:** Process anxiety about pending chores
**Category:** As-needed
**Estimated Time:** 5-7 minutes
**Icon:** 🔧 | **Color:** Calm Blue (#5DADE2)

**Sections:**
1. **What's Piling Up?** (auto-populated, required)
   - System lists overdue and upcoming chores
   - Example output:
     ```
     Overdue (2):
     • Oil change (3 days overdue)
     • Dental checkup (1 week overdue)

     Due Soon (3):
     • HVAC service (in 5 days)
     • Replace air filter (in 12 days)
     • Tire rotation (in 18 days)
     ```

2. **What Feels Most Urgent?** (multiple-choice, required)
   - Select from list above
   - Can pick multiple

3. **What's the Real Worry?** (text, required)
   - "What about this maintenance feels overwhelming?"
   - Options: "Cost", "Time", "Complexity", "Making appointment", "Other"
   - Max 200 characters

4. **First Small Step** (text, required)
   - "What's ONE tiny step you could take today?"
   - Max 100 characters
   - Placeholder: "Just schedule the appointment. Or research costs. Or make a phone call."

5. **Can I Delegate/Simplify?** (text, optional)
   - "Is there an easier way? Could someone help?"
   - Max 150 characters

**Mood Prompt:** Both (track anxiety reduction)
**Spotify Capture:** Manual (calming music)
**Suggested Frequency:** As needed (or auto-prompt if 3+ chores overdue)

**Smart Action:**
After completing template, show:
```
┌─────────────────────────────────────┐
│ Next Step                           │
│                                     │
│ You identified:                     │
│ "Call dentist to schedule checkup"  │
│                                     │
│ Create task for this?               │
│ [Yes - Create Task] [Not Now]       │
└─────────────────────────────────────┘
```

---

## Integration Point 5: Monthly Maintenance Review

### Trigger:
First week of month (aligns with "Weekly Review" and "Goal Setting" templates)

### Template: "Monthly Maintenance Review"

**Purpose:** Review last month's maintenance, plan ahead
**Category:** Monthly
**Estimated Time:** 8-10 minutes
**Icon:** 🔍 | **Color:** Professional Gray (#607D8B)

**Sections:**
1. **Maintenance Completed** (auto-populated, optional)
   - System lists all chores completed last month
   - Example:
     ```
     May 2025:
     ✓ HVAC Service (May 12) - $125
     ✓ Air Filter (May 3) - $25
     ✓ Oil Change (May 28) - $65

     Total maintenance cost: $215
     Total time: 3 hours 20 minutes
     ```

2. **Wins & Lessons** (text, optional)
   - "What went well with maintenance this month?"
   - Max 200 characters
   - Placeholder: "Stayed on top of everything? Found a great new mechanic? Saved money by DIY?"

3. **Challenges** (text, optional)
   - "What made maintenance harder this month?"
   - Max 200 characters

4. **Upcoming Maintenance** (auto-populated, required)
   - System lists chores due next month
   - Example:
     ```
     Due in June 2025:
     • Tire rotation (Jun 15) - Est. $40, 45 min
     • Dental checkup (Jun 20) - Est. $0-50, 60 min
     • Test smoke detectors (Jun 30) - Free, 15 min

     Estimated total: $40-90
     Estimated time: 2 hours
     ```

5. **Budget Check** (text, optional)
   - "Does next month's maintenance fit your budget?"
   - Options: "Yes, no problem", "Tight but manageable", "Need to adjust/postpone"

6. **What to Prioritize** (bullet-list, optional)
   - "If you can only do 1-2 things, which matter most?"

**Mood Prompt:** Optional
**Spotify Capture:** Disabled
**Suggested Frequency:** Monthly, 1st-7th

**Smart Features:**
- Compare actual costs vs. estimates
- Track on-time completion rate
- Identify patterns (e.g., "You've delayed dental 3 months in a row")

---

## Integration Point 6: "Done List" in Daily Reflection

### Enhancement to Daily Reflection Template:

**NEW Section (Optional):**

**Maintenance Completed Today** (auto-populated, optional)
- If any chores completed today, show them
- Example:
  ```
  ✓ Oil Change (Completed 2:30 PM)
  ```
- User can expand for details or just acknowledge

**Benefit:**
- See maintenance in context of full day
- Celebrate non-work accomplishments
- Recognize energy spent on adulting tasks

---

## Integration Point 7: Energy Audit + Chore Planning

### Problem:
User learns home projects drain energy, but has HVAC service scheduled on a busy work day

### Solution: Energy-Aware Chore Scheduling

**During Energy Audit (Weekly template):**

```
┌─────────────────────────────────────┐
│ Energy Audit                        │
│                                     │
│ Energy Drainers this week:          │
│ • Long meetings                     │
│ • Home maintenance (HVAC service)   │◄─── Auto-detected
│ • Difficult conversations           │
│                                     │
│ Pattern I notice:                   │
│ "Maintenance tasks are exhausting   │
│  when combined with full work days" │
│                                     │
│ One change to try:                  │
│ [Schedule chores on lighter work    │
│  days or take afternoon off]        │
│                                     │
│ [Save]                              │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ 💡 Smart Suggestion                 │
│                                     │
│ You have "Tire Rotation" due soon   │
│ (June 15 - a Thursday)              │
│                                     │
│ Based on your energy patterns,      │
│ consider scheduling on a Friday     │
│ or weekend instead?                 │
│                                     │
│ [Reschedule] [Keep Thursday]        │
└─────────────────────────────────────┘
```

---

## Integration Point 8: Spotify Integration Across Chores & Journals

### Use Cases:

**1. Chore Completion Soundtrack:**
- Capture what user was listening to during chore
- Build "productive maintenance" playlist over time
- Example: "You listen to classic rock during car maintenance"

**2. Journal Music Context:**
- Post-chore journal entry captures current Spotify track
- Creates musical memory anchors
- Example: Hear that song later → remember "That's when I finally got HVAC fixed"

**3. Mood Music Correlation:**
- Does certain music correlate with better mood after chores?
- Suggest playlists for draining tasks
- Example: "Your mood is 20% better after chores when listening to upbeat music"

### Implementation:

```typescript
interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album?: string
  album_art?: string
  external_url: string
  captured_at: timestamp
}

// Attached to:
// - Journal entries (existing)
// - Chore completions (NEW)
// - Task completions (NEW, if task created from chore)
```

**Privacy:** User controls when Spotify data is captured (auto, manual, disabled per template/chore)

---

## Integration Point 9: Reflection on Maintenance Habits

### New Prompt in "Self-Compassion Check-In" Template:

**When triggered by overdue chore:**

```
┌─────────────────────────────────────┐
│ Self-Compassion Check-In            │
│                                     │
│ What happened:                      │
│ [I've been putting off scheduling   │
│  my dental checkup for 3 months]    │◄─── Auto-suggested
│                                     │     based on overdue
│ What you'd tell a friend:           │     chore
│ [...]                               │
└─────────────────────────────────────┘
```

**Reframe maintenance procrastination with kindness:**
- "Adulting is hard, especially with ADHD"
- "Calling to schedule feels overwhelming - that's valid"
- "You're aware and working on it - that counts"

---

## Integration Point 10: Chore Completion → Quick Win

### Auto-Prompt After Chore:

```
┌─────────────────────────────────────┐
│ Oil Change Completed! ✓             │
│                                     │
│ [View Summary] [Journal]            │
│                                     │
│ Or log a Quick Win:                 │
│ "I changed my oil!" →               │
│ [💪 Quick Win Entry]                │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Quick Win Capture                   │
│                                     │
│ I did this!                         │
│ "Changed my car's oil - saved $50   │
│  by doing it myself!"               │
│                                     │
│ How it feels:                       │
│ [😊 Proud] ✓                        │
│                                     │
│ ♪ Now playing:                      │
│ [The Eagles - Take It Easy]         │
│                                     │
│ [Save] 🎉                           │
└─────────────────────────────────────┘
```

**Benefit:** Instant dopamine from logging win (great for ADHD)

---

## Summary: Integration Benefits

**1. Holistic Life View:**
- See maintenance in context of overall wellbeing
- Understand how adulting tasks affect mood and energy
- Track patterns (e.g., "I avoid dentist when stressed at work")

**2. Reduced Guilt/Stress:**
- Celebrate chore completions (not just work wins)
- Process overwhelm through journaling
- Self-compassion when procrastinating

**3. Data-Driven Insights:**
- Mood correlation with maintenance
- Energy patterns (which chores drain most)
- Cost tracking over time
- Identify helpful patterns (music, timing, etc.)

**4. Smart Suggestions:**
- Schedule draining chores on lighter days
- Prompt journaling after significant effort
- Suggest simpler approaches based on past struggles

**5. Motivation:**
- Quick wins for dopamine
- Visual progress (both chores AND journals)
- Spotify memories tied to accomplishments
- Streak tracking across both systems

**6. Context Preservation:**
- Musical anchors (Spotify integration)
- Emotional context (mood snapshots)
- Notes and reflections persist
- Photo documentation

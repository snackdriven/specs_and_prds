# Chore Breakdown Workflows

## Core Philosophy

**Break Down Overwhelm:**
- Complex maintenance → manageable steps
- Clear progress visualization
- Flexible completion modes
- Natural metric capture

---

## Workflow 1: Chore Creation Flow

### Entry Points:
1. **From scratch** (manual entry)
2. **From template** (pre-populated)
3. **From reminder** ("Oil change due soon" → create task)

### Flow Diagram:

```
┌─────────────────────────┐
│ Create Chore            │
│ [Scratch] [Template]    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Choose Template?        │
│ [Vehicle] [Home]        │◄─── Quick filter by category
│ [Health] [Equipment]    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Template Selection      │
│ • Oil Change            │
│ • HVAC Service          │
│ • Dental Checkup        │◄─── Visual cards with icons
│ • Tire Rotation         │     Show: name, interval, time, cost
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Customize Details       │
│ Name: [Oil Change]      │
│ Interval: [5000] [mi]   │◄─── Pre-filled from template
│ First Due: [Date]       │     User can modify
│ Cost Est: $30-80        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Review Subtasks         │
│ ✓ Gather supplies (10m) │
│ ✓ Warm engine (5m)      │◄─── Can add/remove/edit
│ ✓ Drain old oil (10m)   │     Reorder by dragging
│ ✓ Replace filter (10m)  │     Toggle required/optional
│                         │
│ [+ Add Custom Subtask]  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Configure Reminders     │
│ Alert me: [7] days      │◄─── Default 7 days before
│           before due    │     User can adjust
│                         │
│ ☑ Remind me when I'm    │
│   near this location    │◄─── Optional: geo-fence
│   (e.g., "Near Jiffy    │     (future feature)
│    Lube")               │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Add Personal Notes      │
│ [Free text field]       │◄─── Optional
│                         │     "Preferred shop",
│                         │     "Last time cost $65"
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Chore Created! ✓        │
│                         │
│ Next due: June 15       │
│ You'll be reminded:     │
│ June 8 (7 days before)  │
│                         │
│ [View Chore] [Done]     │
└─────────────────────────┘
```

### Key Design Decisions:

**Templates First:**
- Most users want quick setup
- Templates provide education (learn what maintenance involves)
- Always allow customization

**Subtask Visibility:**
- Show ALL subtasks during creation
- User knows upfront what's involved
- Reduces "scope surprise" later

**Flexible Intervals:**
- Support time-based (days, weeks, months)
- Support metric-based (miles, hours)
- Allow mixed (e.g., "6 months OR 5,000 miles, whichever first")

**Cost Transparency:**
- Show estimate ranges from template
- Build history of actual costs over time
- Help user budget for upcoming maintenance

---

## Workflow 2: Chore Reminder Flow

### Trigger Conditions:
- 7 days before due date
- When metric approaches threshold (e.g., odometer near oil change mileage)
- User-defined custom triggers

### Notification Design:

```
┌─────────────────────────────────┐
│ 🔔 Maintenance Due Soon         │
│                                 │
│ Oil Change                      │
│ Due: June 15 (in 7 days)        │
│ Est. time: 45-60 min            │
│ Est. cost: $30-80               │
│                                 │
│ [Create Task] [View Details]    │
│ [Snooze 3 days] [Dismiss]       │
└─────────────────────────────────┘
```

### Reminder Flow:

```
┌─────────────────────────┐
│ User receives reminder  │
└───────────┬─────────────┘
            │
            ▼
     ┌──────┴──────┐
     │   Action?   │
     └──┬───┬───┬──┘
        │   │   │
   ┌────┘   │   └────┐
   │        │        │
   ▼        ▼        ▼
[Task]  [Details] [Snooze]
   │        │        │
   │        │        └──► Remind again in 3 days
   │        │
   │        ▼
   │    ┌─────────────────────────┐
   │    │ Chore Details Screen    │
   │    │ • Full subtask list     │
   │    │ • Cost estimate         │
   │    │ • Time estimate         │
   │    │ • Last completed: ...   │
   │    │ • Notes: "Preferred..." │
   │    │                         │
   │    │ [Create Task Now]       │
   │    │ [Schedule for Later]    │
   │    └────────────┬────────────┘
   │                 │
   │                 ▼
   ▼    ┌─────────────────────────┐
   └───►│ Create Task from Chore  │
        │                         │
        │ Import all subtasks?    │
        │ ○ Yes - checklist mode  │◄─── Recommended for complex
        │ ○ No - single task      │◄─── Simple completion
        │                         │
        │ Due date: [June 15]     │
        │ Assign to: [Me]         │
        │                         │
        │ [Create Task]           │
        └─────────────────────────┘
```

### Smart Reminder Features:

**Contextual Information:**
- Show last completion date
- Show cost history ("Last time: $65")
- Show any notes ("Preferred shop: Jiffy Lube on Main St")

**Quick Actions:**
- **Create Task:** Instantly converts to actionable task
- **View Details:** See full breakdown before committing
- **Snooze:** Defer reminder (3 days, 1 week, custom)
- **Dismiss:** Mark as "not needed yet" (manual reschedule)

**Escalation:**
- If snoozed 3+ times → "This keeps getting delayed. Still relevant?"
- If past due → Change notification urgency
- If safety-critical (smoke detectors, brakes) → Can't dismiss without reason

---

## Workflow 3: Chore Completion Flow

### Two Completion Modes:

#### Mode A: Single-Task Completion (Simple Chores)
*"I just did it, mark it done"*

```
┌─────────────────────────┐
│ Chore: Air Filter       │
│ Status: Completed ✓     │
│                         │
│ Quick capture:          │
│ Date: [Auto: Today]     │
│ Odometer: [65,432]      │◄─── Required metrics
│ Cost: [$25.99]          │     Quick input
│                         │
│ Notes (optional):       │
│ [Bought at AutoZone]    │
│                         │
│ 📷 Add Photo            │◄─── Optional
│                         │
│ [Save]                  │
└─────────────────────────┘
        │
        ▼
┌─────────────────────────┐
│ Completion Saved! ✓     │
│                         │
│ Next due:               │
│ Dec 15, 2025            │
│ (in 6 months)           │
│                         │
│ Reminder set for:       │
│ Dec 8, 2025             │
│                         │
│ [Done] [View History]   │
└─────────────────────────┘
```

**Best For:**
- Simple, quick chores
- Single-step tasks
- "Just get it done" mindset

---

#### Mode B: Checklist Completion (Complex Chores)
*"Walk me through it step by step"*

```
┌─────────────────────────────────────┐
│ Oil Change                      [×] │
│ Est. total time: 45-60 min          │
│ Progress: ▓▓▓▓▓░░░░░ 5/8 steps     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✓ 1. Gather supplies (10 min)      │◄─── Completed
│   Completed 2:15 PM                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✓ 2. Warm up engine (5 min)        │
│   Completed 2:25 PM                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✓ 3. Drain old oil (10 min)        │
│   Completed 2:40 PM                 │
│   ⚠️ Oil was very hot - wear gloves│◄─── Safety note
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ✓ 4. Replace oil filter (10 min)   │
│   Completed 2:55 PM                 │
│   📷 [Photo: Old filter condition]  │◄─── Photo captured
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ▶ 5. Add new oil (10 min)          │◄─── Current step
│   Oil type: [5W-30 synthetic]       │     (highlighted)
│   Amount: [5 quarts]                │
│                                     │
│   [✓ Complete Step]                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ○ 6. Dispose old oil (10 min)      │◄─── Optional
│   Optional step                     │     Can skip
│   [ Skip ] [Do It]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ○ 7. Update records (5 min)        │◄─── Upcoming
│   Record odometer and cost          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ○ 8. Reset maintenance light        │
│   Follow owner's manual             │
└─────────────────────────────────────┘

         [Pause] [Complete All]
```

**When All Steps Complete:**

```
┌─────────────────────────────────────┐
│ All steps complete! 🎉              │
│                                     │
│ Capture final details:              │
│                                     │
│ Odometer: [65,250] mi               │◄─── Required metrics
│ Total cost: [$45.99]                │
│                                     │
│ Oil type used:                      │
│ [5W-30 Synthetic - Mobil 1]         │
│                                     │
│ Overall notes:                      │
│ [Everything went smoothly. Filter   │
│  was very dirty - good timing!]     │
│                                     │
│ 📷 Photos (3)                       │
│ [Old filter] [Receipt] [Oil]        │
│                                     │
│ Time spent: 52 minutes              │◄─── Auto-tracked
│ (vs. estimated 45-60 min)           │     from first to last step
│                                     │
│ [Complete Chore]                    │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Oil Change Completed! ✓             │
│                                     │
│ Completed: June 15, 2025            │
│ At: 65,250 miles                    │
│ Cost: $45.99                        │
│                                     │
│ Next due:                           │
│ Dec 15, 2025 OR 70,250 miles        │
│ (whichever comes first)             │
│                                     │
│ Would you like to journal about     │
│ completing this maintenance?        │
│                                     │
│ [Yes - Quick Entry] [No Thanks]     │
└─────────────────────────────────────┘
```

**Best For:**
- Multi-step chores
- First time doing a chore
- Learning new maintenance skills
- Safety-critical tasks (want to ensure nothing skipped)

---

### Completion Flow Features:

**Smart Time Tracking:**
- Auto-start timer when first subtask begins
- Auto-stop when last subtask completes
- Compare actual vs. estimated time
- Learn user's pace over time

**Photo Capture:**
- "Before" and "after" photos
- Damage documentation
- Receipt archiving
- Visual proof for warranty/records

**Metric Capture:**
- Integrated into relevant steps
- e.g., "Step 7: Update records" prompts for odometer, cost
- Pre-filled with last known values
- Validation (e.g., odometer can't decrease)

**Progress Persistence:**
- Save progress if interrupted
- Resume where you left off
- "You started this 2 hours ago, continue?"

**Flexible Skipping:**
- Optional steps clearly marked
- Can skip with one tap
- Required steps must be completed or marked "couldn't do" with reason

---

## Workflow 4: Seasonal Chore Variations

### Problem:
Some chores differ by season (e.g., gutter cleaning: spring vs. fall)

### Solution: Contextual Subtask Sets

**Example: Gutter Cleaning**

```
┌─────────────────────────────────────┐
│ Gutter Cleaning                     │
│ Last completed: Oct 15, 2024 (Fall) │
│ Next due: April 15, 2025 (Spring)   │
│                                     │
│ This is a SPRING cleaning           │
│                                     │
│ Spring focus:                       │
│ • Remove winter debris              │◄─── Different emphasis
│ • Check for ice damage              │     than fall
│ • Repair before summer storms       │
│                                     │
│ [Start Checklist]                   │
└─────────────────────────────────────┘
```

**Subtask Differences:**

| Base Subtasks (All Seasons) | Spring-Specific | Fall-Specific |
|-----------------------------|-----------------|---------------|
| Safety setup | Check for ice damage | Extra focus on leaf removal |
| Remove debris | Inspect winter wear | Prepare for snow/ice |
| Flush with hose | Repair before storms | Install gutter guards (optional) |
| Clean downspouts | | Trim overhanging branches |
| Inspect for damage | | |

**Implementation:**
- Template stores base + seasonal variation subtasks
- System auto-selects based on completion date
- User can manually override ("Actually doing fall version")

---

## Workflow 5: External Dependency Handling

### Problem:
Many chores require scheduling professionals (HVAC, dentist, etc.)

### Solution: Two-Phase Completion

**Phase 1: Schedule Appointment**

```
┌─────────────────────────────────────┐
│ HVAC Service                        │
│ Due: May 15, 2025                   │
│                                     │
│ ⚠️ Requires professional service    │
│                                     │
│ Step 1: Schedule appointment        │
│ Service provider:                   │
│ [Cool Air HVAC] ▼                   │◄─── Saved from history
│ Or: [+ Add new provider]            │
│                                     │
│ Phone: (555) 123-4567               │◄─── Auto-filled
│                                     │
│ Appointment date:                   │
│ [May 12, 2025] 📅                   │
│ Time: [10:00 AM]                    │
│                                     │
│ Estimated cost: $100-150            │
│ Last year: $125                     │◄─── History
│                                     │
│ [Schedule Appointment]              │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Appointment Scheduled ✓             │
│                                     │
│ Cool Air HVAC                       │
│ May 12, 2025 at 10:00 AM            │
│                                     │
│ Added to calendar                   │
│                                     │
│ Reminder:                           │
│ May 11 at 6:00 PM                   │
│ "HVAC appointment tomorrow morning" │
│                                     │
│ [Done]                              │
└─────────────────────────────────────┘
```

**Phase 2: Service Completion**

```
┌─────────────────────────────────────┐
│ HVAC Service Appointment Today      │
│ Cool Air HVAC - 10:00 AM            │
│                                     │
│ Pre-service checklist:              │
│ ☑ Replaced air filter yesterday     │
│ ☑ Cleared area around unit          │
│                                     │
│ [Service Started] [Reschedule]      │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────┐
│ Service Complete                    │
│                                     │
│ Tech name: [Mike]                   │
│ Service date: [Auto: Today]         │
│ Cost: [$125.00]                     │
│                                     │
│ Issues found:                       │
│ [Coolant slightly low, topped off.  │
│  Condensate drain clear. System     │
│  running efficiently.]              │
│                                     │
│ 📷 Service report photo             │
│ [Tap to add photo]                  │
│                                     │
│ Recommendations:                    │
│ [Replace filter monthly during      │
│  summer. Schedule fall furnace      │
│  check in September.]               │
│                                     │
│ Next service due:                   │
│ [Auto: May 12, 2026]                │
│ Or customize: [Date picker]         │
│                                     │
│ [Complete Service]                  │
└─────────────────────────────────────┘
```

**Key Features:**

**Service Provider History:**
- Remember past providers
- Track costs per provider
- Notes ("Always on time", "Expensive but thorough")

**Calendar Integration:**
- Auto-add appointment to calendar
- Reminder 1 day before
- Reminder 1 hour before (optional)

**Documentation:**
- Photo of service report
- Copy of findings/recommendations
- Receipt archiving

**Smart Next Scheduling:**
- Auto-calculate next due (1 year from service, not from original due)
- Tech recommendations override default interval

---

## Workflow 6: Recurring Chore Patterns

### Challenge:
User completes chore → what happens next?

### Solution: Intelligent Rescheduling

```
┌─────────────────────────────────────┐
│ Oil Change Completed! ✓             │
│                                     │
│ Completed: June 15, 2025            │
│ At: 65,250 miles                    │
│                                     │
│ Calculating next due date...        │
│                                     │
│ Template interval:                  │
│ 6 months OR 5,000 miles             │
│                                     │
│ Next due:                           │
│ Dec 15, 2025 OR 70,250 miles        │
│ (whichever comes first)             │
│                                     │
│ Reminder will trigger:              │
│ • Dec 8, 2025 (7 days before), OR   │
│ • When odometer reaches 70,000 mi   │
│                                     │
│ Adjust next due?                    │
│ [Keep These Dates] [Customize]      │
└─────────────────────────────────────┘
```

**Smart Rescheduling Logic:**

**Time-Based:**
- Next due = completion date + interval
- Example: Completed June 15 + 6 months = Dec 15

**Metric-Based:**
- Next due = completion metric + interval
- Example: Completed at 65,250 mi + 5,000 mi = 70,250 mi

**Mixed (Time OR Metric):**
- Track both
- Trigger reminder when EITHER condition met
- Example: "Oil change due soon - you've driven 4,800 of 5,000 miles"

**Learning Over Time:**
- Notice user always does oil changes at 4,500 miles instead of 5,000?
- Suggest: "You tend to change oil early. Adjust interval to 4,500 miles?"

---

## Edge Case Workflows

### Edge Case 1: Chore Completed Early

```
┌─────────────────────────────────────┐
│ Oil Change                          │
│ Due: June 15, 2025 (in 14 days)    │
│                                     │
│ ⚠️ You're marking this complete     │
│    2 weeks early.                   │
│                                     │
│ Reason for early completion?        │
│ ○ Convenient timing                 │
│ ○ Mechanic recommended              │
│ ○ Noticed problem                   │◄─── Track patterns
│ ○ Other: [___]                      │
│                                     │
│ Next due based on:                  │
│ ○ Today's date (Dec 1, 2025)        │◄─── Recommended
│ ○ Original due (Dec 15, 2025)       │
│                                     │
│ [Continue]                          │
└─────────────────────────────────────┘
```

**Why This Matters:**
- Early completion → shorter interval until next
- Track if user consistently goes early (adjust interval?)
- Understand reasoning (problem vs. convenience)

---

### Edge Case 2: Chore Completed Late

```
┌─────────────────────────────────────┐
│ ⚠️ HVAC Service                     │
│ Was due: May 15, 2025               │
│ Completed: June 10, 2025            │
│ (26 days late)                      │
│                                     │
│ Next service due:                   │
│ ○ June 10, 2026 (1 year from today) │◄─── Recommended
│ ○ May 15, 2026 (1 year from original│
│   due date)                         │
│                                     │
│ If this keeps happening, would you  │
│ like to adjust the due date to June │
│ to better match your schedule?      │
│                                     │
│ [Yes, adjust] [No, keep May]        │
└─────────────────────────────────────┘
```

**Adaptive Learning:**
- Notice patterns (always late in May → suggest June instead)
- Adjust to user's reality, not ideal schedule
- Reduce guilt/stress from "overdue" labels

---

### Edge Case 3: Chore No Longer Needed

```
┌─────────────────────────────────────┐
│ Lawn Mower Maintenance              │
│ Due: April 15, 2025                 │
│                                     │
│ [Complete] [Snooze] [More...]       │
└─────────────────────────────────────┘
        │
        ▼ (User taps [More...])
┌─────────────────────────────────────┐
│ Lawn Mower Maintenance              │
│                                     │
│ ✓ Complete                          │
│ ⏰ Snooze                            │
│ ✏️ Edit                             │
│ 🗑️ Delete (no longer needed)        │◄───
│ 💤 Pause indefinitely               │
└─────────────────────────────────────┘
        │
        ▼ (User taps Delete)
┌─────────────────────────────────────┐
│ Delete this chore?                  │
│                                     │
│ Lawn Mower Maintenance              │
│                                     │
│ This will:                          │
│ • Cancel future reminders           │
│ • Keep completion history           │◄─── Important
│ • Archive (not permanently delete)  │
│                                     │
│ Reason (optional):                  │
│ [Hired landscaping service]         │
│                                     │
│ [Cancel] [Delete Chore]             │
└─────────────────────────────────────┘
```

**Archival Not Deletion:**
- Keep history for reference
- Can restore if situation changes
- Helps with insurance claims, home sale records

---

## Summary: Chore Breakdown Workflow Principles

**1. Meet Users Where They Are:**
- Templates for speed
- Customization for flexibility
- Simple mode vs. checklist mode

**2. Reduce Cognitive Load:**
- Break big tasks into small steps
- Show time estimates upfront
- Clear progress visualization

**3. Smart Defaults, Easy Overrides:**
- Auto-calculate next due dates
- Learn from user behavior
- Always allow manual adjustment

**4. Capture Context Naturally:**
- Metrics integrated into workflow
- Photos at relevant steps
- Notes when they make sense

**5. Adapt Over Time:**
- Learn optimal intervals
- Suggest better scheduling
- Recognize patterns (early/late completion)

**6. Handle Reality:**
- External dependencies (appointments)
- Seasonal variations
- Life changes (no longer needed)

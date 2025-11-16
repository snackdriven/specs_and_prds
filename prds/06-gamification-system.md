# PRD: Gamification System

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The Gamification System transforms testing from a routine task into an engaging experience through XP points, levels, achievements, streaks, daily challenges, and personal records. This system motivates consistent testing, rewards quality work, and makes progress visible and rewarding.

## Problem Statement

Testing can feel repetitive and unrewarding:
- **No Visible Progress**: Hard to see improvement over time
- **Lack of Motivation**: Testing feels like a chore, not an achievement
- **Inconsistent Engagement**: No incentive to test regularly
- **No Recognition**: Good work goes unnoticed
- **Burnout Risk**: Monotonous work without variety or celebration

## Goals & Objectives

### Primary Goals
1. Increase daily testing engagement by 40%
2. Improve testing consistency (reduce gaps between sessions)
3. Make progress visible through levels and achievements
4. Reward quality testing (accuracy, thoroughness, speed)
5. Create positive reinforcement for learning and improvement

### Success Metrics
- **Engagement**: 80% of days have at least one testing session (up from 50% baseline)
- **Streak Maintenance**: Average streak length > 7 days
- **Achievement Completion**: 70% of users unlock 5+ achievements in first month
- **XP Growth**: Average 200 XP per week
- **Positive Sentiment**: 80% of users report gamification makes testing more enjoyable

## User Stories

### Epic: XP & Leveling
- **US-061**: As a tester, I want to earn XP for completing tickets so my work is rewarded
- **US-062**: As a tester, I want to level up as I gain XP so I can see my progress
- **US-063**: As a tester, I want bonus XP for quality work so excellence is rewarded
- **US-064**: As a tester, I want to see my XP progress bar so I know how close I am to the next level

### Epic: Achievements
- **US-065**: As a tester, I want to unlock achievements for milestones so I feel accomplished
- **US-066**: As a tester, I want to see locked achievements so I have goals to work toward
- **US-067**: As a tester, I want achievement notifications so my accomplishments are celebrated
- **US-068**: As a tester, I want diverse achievement types (streaks, mastery, discovery) so there are multiple ways to succeed

### Epic: Streaks & Consistency
- **US-069**: As a tester, I want to build a testing streak so I'm motivated to test daily
- **US-070**: As a tester, I want streak multipliers for XP so consistency is rewarded
- **US-071**: As a tester, I want streak recovery if I miss one day so I don't lose all progress
- **US-072**: As a tester, I want to see my longest streak so I can try to beat it

### Epic: Daily Challenges
- **US-073**: As a tester, I want daily challenges so I have variety in my work
- **US-074**: As a tester, I want challenge rewards so there's incentive to complete them
- **US-075**: As a tester, I want challenges that match my skill level so they're achievable but not trivial
- **US-076**: As a tester, I want to see my challenge progress so I can track completion

### Epic: Personal Records
- **US-077**: As a tester, I want to track personal bests so I can challenge myself
- **US-078**: As a tester, I want notifications when I break records so my achievements are celebrated
- **US-079**: As a tester, I want to see records for different categories so I can improve in specific areas

## Functional Requirements

### FR-501: XP Point System
- **Priority**: P0 (Critical)
- **Description**: Award XP for testing activities
- **Acceptance Criteria**:
  - Base XP per ticket: 10 points
  - Speed bonus: +5 XP if completed under estimated time
  - Completeness bonus: +5 XP if all predicted steps tested
  - Prediction usage bonus: +2 XP if predictions used
  - Difficulty multiplier: 1.5x for hard tickets (difficulty 4-5)
  - First test of the day: +3 XP bonus
  - Calculate and award immediately on session end
  - Display XP earned notification
  - Update user's total XP in user_profiles table

### FR-502: Level Progression System
- **Priority**: P0 (Critical)
- **Description**: Progress through levels as XP accumulates
- **Acceptance Criteria**:
  - Level formula: `level = floor(sqrt(total_xp / 10))`
  - Level 1: 0 XP, Level 2: 10 XP, Level 3: 40 XP, Level 4: 90 XP, etc.
  - Max level: 50 (25,000 XP)
  - Display current level and XP progress bar
  - Show XP needed for next level
  - Level-up notification with celebration animation
  - Track highest level achieved
  - Level displayed next to username

### FR-503: Streak Tracking
- **Priority**: P0 (Critical)
- **Description**: Track consecutive days of testing
- **Acceptance Criteria**:
  - Increment streak if session completed today and yesterday
  - Reset streak if 1+ days missed (grace period: none initially)
  - Track current_streak and longest_streak
  - Display streak count with fire emoji 🔥
  - Streak multiplier: 1.5x XP when streak >= 7 days
  - Streak reminder notification if no session today
  - Streak freeze item (future): Save streak if one day missed

### FR-504: Achievement System
- **Priority**: P1 (High)
- **Description**: Unlock achievements for milestones and accomplishments
- **Acceptance Criteria**:
  - 11 pre-defined achievements (see Appendix)
  - Achievement types: milestone, streak, mastery, discovery
  - Each has: name, description, XP reward, unlock condition
  - Track progress toward locked achievements
  - Auto-check unlock conditions after each session
  - Achievement unlocked notification with confetti effect
  - Display earned achievements in profile
  - Show locked achievements as goals (grayscale + progress)

### FR-505: Daily Challenges
- **Priority**: P2 (Medium)
- **Description**: Daily goals for variety and engagement
- **Acceptance Criteria**:
  - Generate new challenge each day (midnight UTC)
  - Challenge types:
    - Speed Demon: Complete 3 tickets under estimated time
    - Accuracy King: Accept 5 predictions (all accurate)
    - Variety Seeker: Test 3 different components today
    - Marathon: Test for 2+ hours today
    - Early Bird: Complete first ticket before 10 AM
  - Track progress in real-time
  - Reward: +50 XP on completion
  - Streak challenges: Bonus if completed 3 days in a row
  - UI: Challenge card on dashboard

### FR-506: Combo System
- **Priority**: P2 (Medium)
- **Description**: Multipliers for consecutive achievements
- **Acceptance Criteria**:
  - Combo counter: Increments with each quick success (< estimated time)
  - Combo multiplier: 1.1x per combo level (max 2.0x at 10 combo)
  - Combo breaks if: Session over time OR session failed OR 1+ hour gap
  - Display combo count and multiplier
  - Combo saved across sessions (same day only)
  - Visual effect on combo milestones (5, 10, 15)

### FR-507: Personal Records
- **Priority**: P2 (Medium)
- **Description**: Track personal bests
- **Acceptance Criteria**:
  - Records tracked:
    - Fastest ticket (by duration)
    - Most tickets in one day
    - Longest session
    - Highest combo
    - Most XP in one day
    - Best accuracy (%) in a week
  - Auto-detect record breaks
  - Notification: "New Record! Fastest ticket: 12 minutes!"
  - Display records in stats page
  - History: Track when record was set

### FR-508: Leaderboard (Future)
- **Priority**: P3 (Low) - Out of Scope for v1
- **Description**: Compare stats with other users
- **Acceptance Criteria**:
  - Not implemented in single-user version
  - Future: If multi-user, show XP, levels, achievements

### FR-509: XP History & Analytics
- **Priority**: P2 (Medium)
- **Description**: Visualize XP growth over time
- **Acceptance Criteria**:
  - Chart: XP earned per day (last 30 days)
  - Chart: XP by source (base, speed bonus, streak multiplier)
  - Total XP, this week, this month
  - Average XP per day
  - XP trend (increasing/decreasing)

### FR-510: Gamification Toggle
- **Priority**: P1 (High)
- **Description**: Enable/disable gamification features
- **Acceptance Criteria**:
  - Global setting: `enable_gamification` (default: true)
  - If disabled: No XP awarded, no achievements checked, no streaks tracked
  - Existing XP and achievements preserved
  - Can re-enable anytime
  - UI: Toggle in settings page

## Non-Functional Requirements

### Performance
- **NFR-501**: XP calculation and award < 100ms
- **NFR-502**: Achievement unlock check < 200ms
- **NFR-503**: Dashboard loads with gamification elements < 1 second

### Reliability
- **NFR-504**: 100% accuracy in XP calculation (no missing/duplicate awards)
- **NFR-505**: Streak calculations accurate across timezone changes
- **NFR-506**: Achievement unlock conditions evaluated correctly (0 false unlocks)

### Usability
- **NFR-507**: Gamification enhances UX, doesn't distract from core testing
- **NFR-508**: Achievements feel meaningful and achievable
- **NFR-509**: Notifications celebratory but not annoying
- **NFR-510**: Progress visible but not overwhelming

### Engagement
- **NFR-511**: Daily challenges refresh interest in testing
- **NFR-512**: Achievements provide long-term goals (weeks/months to unlock)
- **NFR-513**: XP curve balanced: Not too easy, not too grindy

## Technical Architecture

### XP Calculation Algorithm

```python
def calculate_xp(session):
    xp = 10  # Base XP

    # Speed bonus
    if session.duration < session.estimated_time:
        time_saved = session.estimated_time - session.duration
        speed_bonus = min(5, time_saved / session.estimated_time * 5)
        xp += speed_bonus

    # Completeness bonus
    if session.steps_completed >= session.steps_total:
        xp += 5

    # Prediction usage bonus
    if session.prediction_id:
        xp += 2

    # Difficulty multiplier
    ticket_difficulty = get_difficulty_rating(session.ticket_id)
    if ticket_difficulty >= 4:
        xp *= 1.5

    # First test of day bonus
    if is_first_session_today(session.user_id):
        xp += 3

    # Streak multiplier
    streak = get_current_streak(session.user_id)
    if streak >= 7:
        xp *= 1.5

    # Combo multiplier
    combo = get_current_combo(session.user_id)
    combo_multiplier = min(2.0, 1.0 + (combo * 0.1))
    xp *= combo_multiplier

    return round(xp)
```

### Streak Calculation

```python
def update_streak(user_id, session_date):
    user = UserRepository.get(user_id)
    today = session_date.date()

    # Get last session date
    last_session = SessionRepository.get_latest(user_id)

    if not last_session:
        # First session ever
        user.current_streak = 1
        user.last_session_date = today
    else:
        last_date = last_session.started_at.date()
        days_diff = (today - last_date).days

        if days_diff == 0:
            # Same day - no change
            pass
        elif days_diff == 1:
            # Consecutive day - increment
            user.current_streak += 1
        else:
            # Gap - reset
            user.current_streak = 1

        # Update longest streak
        if user.current_streak > user.longest_streak:
            user.longest_streak = user.current_streak

    UserRepository.update(user)
```

### Achievement Unlock Check

```python
def check_achievements(user_id, session):
    user = UserRepository.get(user_id)
    achievements = AchievementRepository.get_all()

    unlocked = []
    for achievement in achievements:
        if achievement.is_earned:
            continue  # Already unlocked

        if evaluate_unlock_condition(achievement, user, session):
            achievement.is_earned = True
            achievement.earned_at = utcnow()
            user.xp_total += achievement.xp_reward
            unlocked.append(achievement)

    AchievementRepository.update_many(unlocked)
    UserRepository.update(user)

    return unlocked

def evaluate_unlock_condition(achievement, user, session):
    if achievement.achievement_name == "First Steps":
        return session.is_completed

    if achievement.achievement_name == "Week Warrior":
        return user.current_streak >= 7

    if achievement.achievement_name == "MHIS Master":
        mhis_count = SessionRepository.count_by_component(user.id, 'MHIS')
        return mhis_count >= 25

    # ... more conditions
```

## Data Models

### user_profiles Table (Gamification Fields)
```sql
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    xp_total INTEGER DEFAULT 0,
    xp_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_session_date DATE,
    -- ... other fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### achievements Table
```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    achievement_type TEXT NOT NULL,  -- 'milestone', 'streak', 'mastery', 'discovery'
    achievement_name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,                        -- Emoji or icon name
    target INTEGER,                   -- Goal value (e.g., 25 tickets)
    current_progress INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 50,
    is_earned BOOLEAN DEFAULT 0,
    earned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### daily_challenges Table
```sql
CREATE TABLE daily_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_date DATE NOT NULL,
    challenge_type TEXT NOT NULL,    -- 'speed_demon', 'accuracy', 'variety', etc.
    challenge_goal TEXT NOT NULL,    -- Human-readable goal
    target INTEGER NOT NULL,         -- Numeric target
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    completed_at TIMESTAMP,
    xp_reward INTEGER DEFAULT 50,
    UNIQUE(user_id, challenge_date),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

### personal_records Table
```sql
CREATE TABLE personal_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    record_type TEXT NOT NULL,       -- 'fastest_ticket', 'most_tickets_day', etc.
    record_value REAL NOT NULL,
    record_context TEXT,             -- JSON with details (ticket_key, date, etc.)
    set_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

## Achievement Definitions

### Milestone Achievements
1. **First Steps** - Complete your first ticket analysis (10 XP)
2. **Getting Started** - Complete 10 tickets (25 XP)
3. **Century Club** - Complete 100 tickets (100 XP)
4. **Testing Legend** - Complete 500 tickets (500 XP)

### Streak Achievements
5. **Week Warrior** - Test 7 consecutive days (50 XP)
6. **Month Master** - Test 30 consecutive days (200 XP)
7. **Unbreakable** - Reach a 100-day streak (1000 XP)

### Mastery Achievements
8. **MHIS Master** - Test 25 MHIS tickets (75 XP)
9. **Workflow Wizard** - Test 25 Workflow tickets (75 XP)
10. **Component Completionist** - Test all 5 components (150 XP)

### Discovery Achievements
11. **Edge Case Detective** - Discover 10 untested edge cases (100 XP)
12. **Pattern Pioneer** - Use predictions for 50 tickets (100 XP)

## Daily Challenge Examples

### Speed Demon
- **Goal**: Complete 3 tickets under estimated time
- **Reward**: +50 XP
- **Target Audience**: Experienced testers
- **Difficulty**: Medium

### Accuracy King
- **Goal**: Accept 5 predictions (all rated 4+ stars)
- **Reward**: +50 XP
- **Target Audience**: All users
- **Difficulty**: Medium

### Variety Seeker
- **Goal**: Test 3 different components today
- **Reward**: +50 XP
- **Target Audience**: All users
- **Difficulty**: Easy

### Marathon Runner
- **Goal**: Test for 2+ hours total today
- **Reward**: +75 XP
- **Target Audience**: Power users
- **Difficulty**: Hard

### Early Bird
- **Goal**: Complete first ticket before 10 AM
- **Reward**: +30 XP
- **Target Audience**: Morning people
- **Difficulty**: Easy

## UI Components

### XP Progress Bar
```
┌─────────────────────────────────────────────┐
│  Level 8  🏆  230/300 XP                    │
│  [████████████████░░░░░░] 77% to Level 9    │
└─────────────────────────────────────────────┘
```

### Achievement Card
```
┌──────────────────────────────┐
│  🏆 Week Warrior              │
│  Test 7 consecutive days     │
│                              │
│  Progress: 5/7 days          │
│  [████████░░] 71%            │
│  Reward: +50 XP              │
└──────────────────────────────┘
```

### Daily Challenge
```
┌──────────────────────────────────────┐
│  Today's Challenge: Speed Demon 🏃   │
│  Complete 3 tickets under estimate   │
│                                      │
│  Progress: 2/3 ✅✅⬜                 │
│  Reward: +50 XP                      │
│  [Accept Challenge]                  │
└──────────────────────────────────────┘
```

### Level Up Notification
```
┌─────────────────────────────────┐
│  🎉 LEVEL UP! 🎉                │
│  You reached Level 9!           │
│  You earned +10 bonus XP        │
│  Keep up the great work!        │
└─────────────────────────────────┘
```

## Balancing & Tuning

### XP Curve
- Level 1-10: Fast progression (10-30 minutes per level)
- Level 11-25: Moderate (1-2 hours per level)
- Level 26-50: Slow (3-5 hours per level)

### Achievement Difficulty Distribution
- Easy: 40% (achievable in 1-2 weeks)
- Medium: 40% (achievable in 1-2 months)
- Hard: 20% (achievable in 3-6 months)

### Daily Challenge Completion Rate Target
- Target: 60% completion rate
- Adjust difficulty if < 40% or > 80%

## Out of Scope

- **Social Features**: No friends, sharing, or social comparison (single-user)
- **Leaderboards**: Not applicable in single-user version
- **Virtual Currency**: No coins, gems, or purchasable items
- **Cosmetic Customization**: No avatars, themes, or cosmetic unlocks
- **Seasonal Events**: No holiday-specific challenges or time-limited events

## Implementation Phases

### Phase 1: Core XP & Levels (Week 1)
- XP calculation and award
- Level progression
- Basic UI for XP/level display
- Database schema

### Phase 2: Achievements & Streaks (Week 2)
- Achievement system
- Streak tracking
- Achievement unlock checks
- Notification system

### Phase 3: Daily Challenges (Week 3)
- Daily challenge generation
- Challenge progress tracking
- Challenge UI
- Challenge completion rewards

### Phase 4: Polish & Advanced Features (Week 4)
- Combo system
- Personal records
- XP analytics
- Celebration animations

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Gamification feels gimmicky | High | Medium | Focus on meaningful rewards, avoid excessive notifications |
| Users ignore gamification | Medium | Medium | Make optional, gather feedback, iterate |
| XP inflation (too easy to level) | Medium | Low | Playtesting, balanced XP curve, monitor data |
| Achievement burnout | Low | Medium | Variety in achievement types, long-term goals |
| Streak pressure causes stress | Medium | Low | Grace period, streak freeze items, positive framing |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] XP awarded correctly in 100% of cases
- [ ] All 11 achievements unlockable
- [ ] Streak tracking accurate across days
- [ ] Daily challenges generate and complete correctly
- [ ] Unit test coverage > 80%
- [ ] User testing shows positive sentiment
- [ ] Documentation complete

## Appendices

### A. XP Award Examples
```
Base ticket: 10 XP
+ Speed bonus (20% faster): +4 XP
+ Completeness bonus: +5 XP
+ Prediction usage: +2 XP
+ Difficulty 4/5: 1.5x multiplier = (10+4+5+2) * 1.5 = 31.5 XP
+ 7-day streak: 1.5x multiplier = 31.5 * 1.5 = 47 XP
+ Combo 3: 1.3x multiplier = 47 * 1.3 = 61 XP

Total: 61 XP for this session
```

### B. Level Formula Chart
```
Level 1:  0 XP
Level 2:  10 XP
Level 3:  40 XP
Level 4:  90 XP
Level 5:  160 XP
Level 10: 900 XP
Level 20: 3900 XP
Level 30: 8900 XP
Level 50: 24900 XP
```

### C. Related Documentation
- [Gamification Guide](/docs/gamification-guide.md)
- [User Engagement Strategy](/docs/engagement-strategy.md)

# PRD: AI Coach System

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The AI Coach System provides personalized, context-aware feedback and motivation through five distinct coach personalities. The coach adapts its tone and messaging based on user performance, testing patterns, and preferences, creating a supportive AI companion for the testing journey.

## Problem Statement

Software testing can be isolating and demotivating:
- **No Feedback Loop**: Testers work alone with limited feedback on their approach
- **Motivation Gaps**: Difficult to stay motivated during repetitive testing
- **Missed Learning Opportunities**: No one points out improvement areas
- **One-Size-Fits-All**: Generic feedback doesn't resonate with different personalities
- **Lack of Encouragement**: No recognition for good work or progress

## Goals & Objectives

### Primary Goals
1. Provide personalized feedback tailored to user's testing patterns
2. Offer motivation and encouragement to maintain engagement
3. Identify learning opportunities and improvement areas
4. Adapt communication style to user preferences (5 personalities)
5. Create a sense of partnership between user and AI

### Success Metrics
- **User Satisfaction**: 80% of users find coach feedback helpful
- **Engagement**: Coach messages read rate > 70%
- **Personality Fit**: 90% of users find a personality they like
- **Behavior Change**: 40% of users modify behavior based on coach suggestions
- **Retention**: Users with coach enabled have 25% higher retention

## User Stories

### Epic: Coach Personalities
- **US-080**: As a user, I want to choose a coach personality that matches my style so feedback resonates with me
- **US-081**: As a user, I want to switch personalities anytime so I can find the best fit
- **US-082**: As a user, I want a "Silent" mode if I prefer no coach so it's optional
- **US-083**: As a user, I want to preview personalities before choosing so I know what to expect

### Epic: Contextual Feedback
- **US-084**: As a tester, I want coach feedback on my testing approach so I can improve
- **US-085**: As a tester, I want encouragement when I do well so my good work is recognized
- **US-086**: As a tester, I want constructive suggestions when I struggle so I can learn
- **US-087**: As a tester, I want coach feedback timed appropriately (not overwhelming) so it's helpful not annoying

### Epic: Learning & Improvement
- **US-088**: As a tester, I want the coach to identify my weak areas so I can focus improvement efforts
- **US-089**: As a tester, I want tips on testing techniques so I can expand my skills
- **US-090**: As a tester, I want pattern insights so I understand my testing habits
- **US-091**: As a tester, I want celebratory messages for achievements so my progress is acknowledged

### Epic: Adaptive Messaging
- **US-092**: As a user, I want coach messages relevant to my current situation so they're timely
- **US-093**: As a user, I want different message types (tips, motivation, insights) so feedback is varied
- **US-094**: As a user, I want the coach to remember context so messages make sense
- **US-095**: As a user, I want to dismiss or snooze coach messages so I control my experience

## Functional Requirements

### FR-601: Coach Personality Selection
- **Priority**: P0 (Critical)
- **Description**: Choose from 5 distinct coach personalities
- **Acceptance Criteria**:
  - 5 personalities available:
    1. **Coach** - Supportive, educational, balanced
    2. **Analyst** - Data-driven, detailed, analytical
    3. **Hype Man** - Enthusiastic, motivational, celebratory
    4. **Drill Sergeant** - Direct, efficiency-focused, no-nonsense
    5. **Silent** - No messages, predictions only
  - Default: Coach
  - Setting stored in user_profiles.coach_personality
  - Switch anytime in settings
  - Preview: Show sample messages for each personality
  - Immediate effect on new messages

### FR-602: Contextual Message Generation
- **Priority**: P0 (Critical)
- **Description**: Generate messages based on context and performance
- **Acceptance Criteria**:
  - Context inputs:
    - User stats (XP, level, streak, accuracy)
    - Recent sessions (performance trend)
    - Current session status
    - Achievement unlocks
    - Time of day, day of week
  - Message types:
    - Motivational (start of session, mid-session)
    - Feedback (end of session)
    - Tips (learning opportunities)
    - Insights (pattern observations)
    - Celebrations (achievements, records)
  - Personality-specific tone and phrasing
  - Message relevance score (0-100%)
  - Never repeat same message twice in 7 days

### FR-603: Coach Personality: "Coach"
- **Priority**: P0 (Critical)
- **Description**: Balanced, supportive, educational coach
- **Acceptance Criteria**:
  - Tone: Encouraging yet realistic, focuses on growth
  - Messages:
    - "Great work on WRKA-1234! Your testing speed has improved 15% this week."
    - "I noticed you're spending more time on Workflow tickets. Want some tips for efficiency?"
    - "You're on a 5-day streak! Consistency is key to mastery."
  - Use cases: Best for users who want balanced feedback
  - Emoji usage: Moderate (1-2 per message)
  - Message length: Medium (2-3 sentences)

### FR-604: Coach Personality: "Analyst"
- **Priority**: P0 (Critical)
- **Description**: Data-driven, detailed, analytical coach
- **Acceptance Criteria**:
  - Tone: Objective, precise, data-focused
  - Messages:
    - "Your average session duration is 47 minutes, 8% below your 30-day moving average."
    - "Pattern analysis: 67% of your MHIS tickets completed in < 45 minutes (optimal range: 40-50)."
    - "Prediction accuracy: 83%. Top performing pattern: MHIS Form Validation (92% success rate)."
  - Use cases: Best for data-oriented users
  - Emoji usage: Minimal (charts/graphs only: 📊📈)
  - Message length: Long (3-5 sentences with metrics)
  - Always include specific numbers and percentages

### FR-605: Coach Personality: "Hype Man"
- **Priority**: P0 (Critical)
- **Description**: Enthusiastic, motivational, celebratory coach
- **Acceptance Criteria**:
  - Tone: High-energy, positive, celebratory
  - Messages:
    - "🔥🔥🔥 CRUSHING IT! 5 tickets before lunch! You're UNSTOPPABLE! 🚀"
    - "YESSSS! New record! Fastest MHIS ticket EVER! 12 minutes! 🏆👏"
    - "STREAK KING! 🔥 7 days in a row! You're on FIRE! Keep that momentum! 💪"
  - Use cases: Best for users who need motivation
  - Emoji usage: Heavy (3-5 per message)
  - Message length: Short, punchy (1-2 sentences)
  - Lots of exclamation points and caps for emphasis

### FR-606: Coach Personality: "Drill Sergeant"
- **Priority**: P0 (Critical)
- **Description**: Direct, efficiency-focused, no-nonsense coach
- **Acceptance Criteria**:
  - Tone: Blunt, efficient, results-oriented
  - Messages:
    - "WRKA-1234: 62 minutes. Estimate was 45. Tighten up."
    - "5 tickets this week. Your target was 8. Pick up the pace."
    - "Session abandoned. Finish what you start."
  - Use cases: Best for users who want directness
  - Emoji usage: None or minimal (targets: 🎯)
  - Message length: Very short (1 sentence, often fragments)
  - No sugar-coating, focuses on results and accountability

### FR-607: Coach Personality: "Silent"
- **Priority**: P1 (High)
- **Description**: No coach messages, predictions only
- **Acceptance Criteria**:
  - No motivational messages
  - No tips or insights
  - No celebrations
  - Predictions still provided (core functionality)
  - Stats still calculated (no UI messages)
  - Use case: Users who prefer no AI personality

### FR-608: Message Timing & Frequency
- **Priority**: P1 (High)
- **Description**: Deliver messages at appropriate times
- **Acceptance Criteria**:
  - Timing rules:
    - Session start: Welcome/motivational (optional)
    - Session end: Feedback (always)
    - Achievement unlock: Celebration (immediately)
    - New record: Celebration (immediately)
    - Daily challenge complete: Recognition (immediately)
    - Streak risk: Reminder (8 PM if no session today)
    - Improvement tip: Weekly (Monday morning)
  - Max frequency: 5 messages per day
  - User can configure frequency: High/Medium/Low
  - Dismissible: User can close messages
  - Snooze: "Don't show tips for 1 week"

### FR-609: Learning Tip Library
- **Priority**: P2 (Medium)
- **Description**: Database of testing tips and best practices
- **Acceptance Criteria**:
  - 50+ tips across categories:
    - Testing Techniques (boundary testing, equivalence partitioning)
    - Time Management (batching similar tickets, break scheduling)
    - Component-Specific Tips (MHIS, Workflow, Permissions)
    - Tool Usage (prediction acceptance, note-taking)
    - Pattern Recognition (identifying common scenarios)
  - Tip relevance: Match to user's weak areas
  - Tip delivery: 1 tip per week (Monday 9 AM)
  - Tip rating: User can rate helpful/not helpful
  - Adapt tip selection based on ratings

### FR-610: Performance Insights
- **Priority**: P1 (High)
- **Description**: Provide data-driven insights on testing patterns
- **Acceptance Criteria**:
  - Insights generated:
    - "You test 35% faster on Tuesday mornings"
    - "Your MHIS accuracy is 92%, but Workflow is 78%. Focus area?"
    - "Prediction usage correlation: +12% accuracy when using predictions"
    - "Break pattern: Sessions with 1 break are 15% faster"
  - Frequency: 1 insight per week
  - Minimum data: 20 sessions before generating insights
  - Insights personalized to individual patterns
  - Actionable: Always suggest next step

### FR-611: Coach Message History
- **Priority**: P2 (Medium)
- **Description**: Log all coach messages for review
- **Acceptance Criteria**:
  - Store in coach_tips_history table
  - Fields: message_text, message_type, personality, shown_at
  - View history in UI (last 30 days)
  - Filter by type and personality
  - Mark favorites (useful messages)
  - Export to text file

### FR-612: A/B Testing Personalities
- **Priority**: P3 (Low) - Future
- **Description**: Test effectiveness of different personalities
- **Acceptance Criteria**:
  - Out of scope for single-user
  - Future: Track which personality leads to best outcomes

## Non-Functional Requirements

### Personality
- **NFR-601**: Each personality feels distinct and consistent
- **NFR-602**: Messages authentic to personality (no generic fallbacks)
- **NFR-603**: Tone matches across all message types per personality

### Relevance
- **NFR-604**: 90% of messages rated as relevant by users
- **NFR-605**: Context-awareness: Messages make sense given recent activity
- **NFR-606**: No repeated messages within 7 days

### Engagement
- **NFR-607**: Messages encourage rather than nag
- **NFR-608**: Positive sentiment even for constructive feedback
- **NFR-609**: Varied message types prevent monotony

### Performance
- **NFR-610**: Message generation < 100ms
- **NFR-611**: No performance impact from coach system
- **NFR-612**: Messages load asynchronously (don't block UI)

## Technical Architecture

### Message Generation Flow

```
User completes session
    ↓
CoachService.generate_feedback(session)
    ↓
Gather context:
  - User profile (personality, stats)
  - Session data (duration, outcome)
  - Recent history (last 5 sessions)
  - Achievements/records unlocked
    ↓
Select message type:
  - Feedback (session performance)
  - Celebration (achievement)
  - Tip (learning opportunity)
  - Insight (pattern observation)
    ↓
Generate message for personality:
  - Coach: balanced_feedback(context)
  - Analyst: data_driven_feedback(context)
  - Hype Man: enthusiastic_feedback(context)
  - Drill Sergeant: direct_feedback(context)
  - Silent: None
    ↓
Check delivery rules:
  - Not shown in last 7 days?
  - Under daily message limit?
  - User hasn't snoozed?
    ↓
if pass: Display message
else: Skip
    ↓
Log to coach_tips_history
```

### Message Template System

```python
class CoachService:
    def __init__(self, personality):
        self.personality = personality
        self.templates = load_templates(personality)

    def generate_feedback(self, session, context):
        if self.personality == 'silent':
            return None

        # Select template based on performance
        if session.duration < session.estimated_time:
            template_key = 'session_fast'
        elif session.duration > session.estimated_time * 1.5:
            template_key = 'session_slow'
        else:
            template_key = 'session_normal'

        template = self.templates[template_key]

        # Fill template with context
        message = template.format(
            ticket_key=session.ticket_key,
            duration=session.duration,
            estimate=session.estimated_time,
            variance_pct=((session.duration - session.estimated_time) / session.estimated_time * 100)
        )

        return message

# Example templates by personality
TEMPLATES = {
    'coach': {
        'session_fast': "Nice work on {ticket_key}! You completed it in {duration} minutes, {variance_pct}% faster than estimated. You're getting more efficient! 👍",
        'session_slow': "{ticket_key} took {duration} minutes, a bit over the {estimate} minute estimate. No worries - some tickets are trickier. Want tips for this component?",
        'session_normal': "Solid work on {ticket_key}! Right on track with the estimate. Consistency is key!"
    },
    'analyst': {
        'session_fast': "Session efficiency: {variance_pct}% above baseline. Duration: {duration}min (est: {estimate}min). Positive deviation from mean.",
        'session_slow': "Session duration: {duration}min exceeded estimate by {variance_pct}%. Recommend reviewing component-specific patterns.",
        'session_normal': "Session completed within acceptable variance range. Duration: {duration}min (est: {estimate}min)."
    },
    'hype_man': {
        'session_fast': "🚀 SPEED DEMON! {ticket_key} DONE in {duration}min! That's {variance_pct}% FASTER! You're CRUSHING IT! 🔥💪",
        'session_slow': "Hey, {ticket_key} was a tough one! {duration}min shows you're being THOROUGH! Quality over speed! 👏",
        'session_normal': "NICE! {ticket_key} COMPLETE! Right on target! Keep that rhythm going! 🎯✨"
    },
    'drill_sergeant': {
        'session_fast': "{ticket_key}: {duration}min. Under estimate. Good. Stay sharp.",
        'session_slow': "{ticket_key}: {duration}min. Over by {variance_pct}%. Tighten up.",
        'session_normal': "{ticket_key}: {duration}min. On target. Move to the next one."
    }
}
```

### Insight Generation

```python
def generate_insights(user_id):
    sessions = SessionRepository.get_recent(user_id, days=30)

    insights = []

    # Time of day performance
    performance_by_hour = analyze_performance_by_time(sessions)
    best_hour = max(performance_by_hour, key=lambda x: x.efficiency)
    insights.append({
        'type': 'time_pattern',
        'message': f"You test {best_hour.efficiency_pct}% faster at {best_hour.hour}:00"
    })

    # Component expertise gaps
    component_accuracy = analyze_accuracy_by_component(sessions)
    weakest = min(component_accuracy, key=lambda x: x.accuracy)
    if weakest.accuracy < 0.8:
        insights.append({
            'type': 'improvement_area',
            'message': f"Your {weakest.component} accuracy is {weakest.accuracy}%. Focus area?"
        })

    # Prediction correlation
    with_predictions = [s for s in sessions if s.prediction_id]
    without_predictions = [s for s in sessions if not s.prediction_id]
    if len(with_predictions) >= 5 and len(without_predictions) >= 5:
        accuracy_diff = avg_accuracy(with_predictions) - avg_accuracy(without_predictions)
        if accuracy_diff > 0.05:
            insights.append({
                'type': 'tool_correlation',
                'message': f"Prediction usage correlation: +{accuracy_diff*100:.0f}% accuracy"
            })

    return insights
```

## Data Models

### coach_tips_history Table
```sql
CREATE TABLE coach_tips_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT NOT NULL,     -- 'feedback', 'tip', 'insight', 'celebration'
    personality TEXT NOT NULL,      -- 'coach', 'analyst', 'hype_man', etc.
    context_data TEXT,              -- JSON with session/achievement data
    shown_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_rating TEXT,               -- 'helpful', 'not_helpful', null
    is_favorite BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

### Message Types
```python
MESSAGE_TYPES = {
    'feedback': 'Performance feedback on session',
    'tip': 'Educational tip or best practice',
    'insight': 'Data-driven pattern observation',
    'celebration': 'Achievement or milestone recognition',
    'motivation': 'Encouragement or pep talk',
    'reminder': 'Streak reminder or prompt'
}
```

## Out of Scope

- **Natural Conversation**: No chat interface, pre-generated messages only
- **Voice Output**: Text-only, no text-to-speech
- **Customizable Personalities**: Can't create custom coaches
- **Multi-Language**: English only
- **Real-Time Coaching**: Messages generated at specific events, not continuous

## Implementation Phases

### Phase 1: Core Coach System (Week 1)
- CoachService implementation
- 3 personalities: Coach, Analyst, Silent
- Basic message templates
- Session feedback messages

### Phase 2: Additional Personalities (Week 2)
- Hype Man personality
- Drill Sergeant personality
- Personality switching
- Message history logging

### Phase 3: Advanced Messaging (Week 3)
- Learning tip library
- Performance insights
- Timing rules
- Frequency controls

### Phase 4: Polish & Personalization (Week 4)
- A/B testing (if multi-user)
- Message rating system
- Adaptive tip selection
- Context-aware improvements

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Personalities feel fake/robotic | High | Medium | Careful copywriting, user testing, iterative refinement |
| Messages annoy rather than help | Medium | High | Frequency controls, dismissible, snooze, Silent mode |
| Generic messages lack relevance | Medium | Medium | Strong context gathering, personalization, A/B testing |
| Users don't engage with coach | Low | Medium | Make optional, showcase value, iterate based on feedback |

## Acceptance Criteria

### Definition of Done
- [ ] All 5 personalities implemented
- [ ] Message templates created (20+ per personality)
- [ ] Timing rules functional
- [ ] Message history tracked
- [ ] User can switch personalities
- [ ] Silent mode works (no messages)
- [ ] 80% user satisfaction in testing
- [ ] Documentation complete

## Appendices

### A. Personality Comparison Matrix

| Feature | Coach | Analyst | Hype Man | Drill Sergeant | Silent |
|---------|-------|---------|----------|----------------|--------|
| Tone | Balanced | Objective | Enthusiastic | Direct | None |
| Emoji | Moderate | Minimal | Heavy | None | N/A |
| Length | Medium | Long | Short | Very Short | N/A |
| Data Focus | Medium | High | Low | Medium | N/A |
| Motivation | High | Low | Very High | Medium | N/A |

### B. Sample Message Library

See `/docs/coach-message-templates.md` (to be created)

### C. Related Documentation
- [Coach Service Implementation](/docs/services/coach_service.py)
- [Gamification Guide](/docs/gamification-guide.md)

# PRD: Ticket Analysis & Pattern Learning

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The Ticket Analysis & Pattern Learning module automatically analyzes JIRA tickets to extract test requirements, identifies recurring patterns in testing workflows, and builds a knowledge base of proven test scenarios for future reuse.

## Problem Statement

Testers face these challenges:
- **Manual Analysis**: Spending 10-15 minutes analyzing each ticket to determine what needs testing
- **Inconsistent Coverage**: Missing edge cases because similar tickets were tested differently
- **Lost Knowledge**: Forgetting effective test strategies used on previous similar tickets
- **Repetitive Work**: Re-creating test scenarios for common patterns (e.g., MHIS updates, deferral logic)
- **No Historical Insights**: Unable to learn from past testing successes and failures

## Goals & Objectives

### Primary Goals
1. Automatically analyze JIRA tickets to identify test requirements
2. Extract affected system components and test scenario types
3. Detect and learn recurring test patterns from historical data
4. Build a searchable knowledge base of test patterns
5. Provide pattern-based recommendations for new tickets

### Success Metrics
- **Analysis Speed**: Analyze ticket in < 2 seconds
- **Accuracy**: 85%+ accuracy in component identification
- **Pattern Detection**: Identify 50+ unique patterns in first month
- **Pattern Reuse**: 70% of tickets match existing patterns
- **Time Savings**: Reduce analysis time from 15 minutes to < 5 minutes per ticket

## User Stories

### Epic: Automated Ticket Analysis
- **US-011**: As a tester, I want ATLAS to analyze ticket descriptions automatically so I don't have to manually parse requirements
- **US-012**: As a tester, I want to see which system components are affected so I know where to focus testing
- **US-013**: As a tester, I want to see what type of test scenarios apply so I can plan my approach
- **US-014**: As a tester, I want to find similar historical tickets so I can learn from past testing

### Epic: Pattern Learning
- **US-015**: As a user, I want ATLAS to detect recurring test patterns so I don't have to reinvent approaches
- **US-016**: As a user, I want patterns to improve over time based on feedback so recommendations get better
- **US-017**: As a user, I want to see pattern success rates so I can trust the most effective approaches

### Epic: Pattern Discovery
- **US-018**: As a tester, I want to browse learned patterns so I can understand common testing scenarios
- **US-019**: As a tester, I want to filter patterns by component or type so I can find relevant ones quickly
- **US-020**: As a tester, I want to see when patterns were last used so I know if they're still relevant

## Functional Requirements

### FR-101: Ticket Content Analysis
- **Priority**: P0 (Critical)
- **Description**: Parse and analyze JIRA ticket content to extract test-relevant information
- **Acceptance Criteria**:
  - Parse summary and description fields
  - Extract key terms and entities (forms, workflows, rules)
  - Identify action verbs (update, create, delete, approve, deny)
  - Recognize technical terms (MHIS, TARS, deferral, approval, authorization)
  - Handle structured and unstructured descriptions
  - Support multiple ticket types (Story, Task, Bug, Sub-task)

### FR-102: Component Identification
- **Priority**: P0 (Critical)
- **Description**: Automatically identify affected system components
- **Acceptance Criteria**:
  - Detect 5 primary components:
    - Workflow Engine
    - MHIS (Member Health Information System)
    - Letters/Correspondence
    - Permissions/Authorization
    - TARS (Technical Assistance Request System)
  - Extract from ticket labels, components field, and description
  - Support multi-component tickets
  - Assign confidence scores (0-100%)
  - Flag unknown/ambiguous components

### FR-103: Test Scenario Type Detection
- **Priority**: P0 (Critical)
- **Description**: Classify tickets into test scenario types
- **Acceptance Criteria**:
  - Support scenario types:
    - Form Submission Testing
    - Workflow State Transitions
    - Data Validation
    - Integration Testing
    - Regression Testing
    - UI/UX Testing
    - Permission Checks
    - Error Handling
  - Assign multiple types per ticket
  - Rank types by relevance
  - Provide reasoning for each type

### FR-104: Similar Ticket Discovery
- **Priority**: P1 (High)
- **Description**: Find historically tested tickets similar to current ticket
- **Acceptance Criteria**:
  - Compare ticket descriptions using text similarity
  - Match on components, labels, and ticket type
  - Return top 5 similar tickets
  - Show similarity score (0-100%)
  - Include historical test results and feedback
  - Filter by date range (last 3 months default)

### FR-105: Pattern Detection Algorithm
- **Priority**: P0 (Critical)
- **Description**: Automatically detect recurring test patterns from historical tickets
- **Acceptance Criteria**:
  - Analyze completed tickets and their test scenarios
  - Group similar test sequences
  - Calculate pattern frequency (occurrence count)
  - Track pattern success rate (% of successful tests)
  - Identify pattern variations
  - Assign pattern names and types
  - Update patterns incrementally as new data arrives

### FR-106: Pattern Storage & Management
- **Priority**: P1 (High)
- **Description**: Store and manage learned patterns in database
- **Acceptance Criteria**:
  - Store in `test_patterns` table
  - Fields: pattern_type, pattern_name, test_steps (JSON), success_rate, frequency
  - Support CRUD operations via PatternRepository
  - Track creation and last_used timestamps
  - Support pattern versioning
  - Archive inactive patterns (not used in 6 months)

### FR-107: Pattern-Based Recommendations
- **Priority**: P1 (High)
- **Description**: Recommend relevant patterns for new tickets
- **Acceptance Criteria**:
  - Match ticket components to pattern types
  - Rank patterns by relevance and success rate
  - Return top 3 patterns
  - Show pattern details (steps, avg time, success rate)
  - Explain why pattern was recommended
  - Allow pattern customization before use

### FR-108: Pattern Analytics
- **Priority**: P2 (Medium)
- **Description**: Provide insights into pattern effectiveness
- **Acceptance Criteria**:
  - Calculate success rate per pattern
  - Track average time per pattern
  - Show frequency distribution
  - Identify trending patterns (increasing usage)
  - Highlight high-performing patterns (>90% success)
  - Flag underperforming patterns (<60% success)

## Non-Functional Requirements

### Performance
- **NFR-101**: Ticket analysis completes in < 2 seconds
- **NFR-102**: Similar ticket search returns in < 1 second
- **NFR-103**: Pattern detection batch process completes in < 10 minutes for 1000 tickets
- **NFR-104**: Pattern recommendation returns in < 500ms

### Accuracy
- **NFR-105**: Component identification accuracy > 85%
- **NFR-106**: Test scenario type accuracy > 80%
- **NFR-107**: Similar ticket relevance > 75% (user feedback)
- **NFR-108**: Pattern match relevance > 80%

### Scalability
- **NFR-109**: Support up to 100,000 analyzed tickets
- **NFR-110**: Store up to 1,000 unique patterns
- **NFR-111**: Handle tickets with up to 10,000 character descriptions
- **NFR-112**: Efficient indexing for fast search (< 1s for 100K records)

### Reliability
- **NFR-113**: Gracefully handle malformed ticket data
- **NFR-114**: Never fail analysis due to missing fields
- **NFR-115**: Provide partial results if full analysis fails
- **NFR-116**: Log all analysis errors for debugging

## Technical Architecture

### Components
1. **TicketAnalyzerService** - Main analysis orchestrator
2. **PatternService** - Pattern detection and management
3. **PatternRepository** - Database access for patterns
4. **TicketRepository** - Database access for tickets
5. **Text Processing Module** - NLP utilities (keyword extraction, similarity)

### Data Flow
```
JIRA Ticket
    ↓
TicketAnalyzerService.analyze(ticket)
    ├─→ Extract Components
    ├─→ Detect Scenario Types
    ├─→ Find Similar Tickets
    └─→ Analysis Result
            ↓
PatternService.detect_patterns(tickets)
    ├─→ Group Similar Tests
    ├─→ Calculate Metrics
    └─→ Store Patterns
            ↓
PatternRepository.save(pattern)
```

### Algorithms

#### Component Identification Algorithm
```python
def identify_components(ticket):
    components = []
    keywords = {
        'MHIS': ['mhis', 'member health', 'health information'],
        'Workflow': ['workflow', 'state', 'transition'],
        'Letters': ['letter', 'correspondence', 'notice'],
        'Permissions': ['permission', 'authorization', 'access control'],
        'TARS': ['tar', 'technical assistance']
    }

    text = f"{ticket.summary} {ticket.description}".lower()

    for component, terms in keywords.items():
        if any(term in text for term in terms):
            confidence = calculate_confidence(text, terms)
            components.append({
                'name': component,
                'confidence': confidence
            })

    return components
```

#### Pattern Detection Algorithm
```python
def detect_patterns(tickets):
    # Group tickets by component and type
    groups = group_by_similarity(tickets, threshold=0.7)

    patterns = []
    for group in groups:
        if len(group) >= 3:  # Minimum 3 occurrences to be a pattern
            pattern = {
                'pattern_type': infer_type(group),
                'pattern_name': generate_name(group),
                'test_steps': extract_common_steps(group),
                'frequency': len(group),
                'success_rate': calculate_success_rate(group),
                'avg_time_minutes': calculate_avg_time(group)
            }
            patterns.append(pattern)

    return patterns
```

## Data Model

### test_patterns Table
```sql
CREATE TABLE test_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_type TEXT NOT NULL,  -- 'MHIS', 'Deferral', 'Approval', etc.
    pattern_name TEXT NOT NULL,  -- Human-readable name
    test_steps TEXT NOT NULL,    -- JSON array of step descriptions
    success_rate REAL DEFAULT 0, -- 0-100%
    frequency INTEGER DEFAULT 0, -- Number of times pattern seen
    avg_time_minutes INTEGER,    -- Average completion time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);
```

### Analysis Result JSON
```json
{
    "ticket_key": "WRKA-1234",
    "components": [
        {"name": "MHIS", "confidence": 0.95},
        {"name": "Workflow", "confidence": 0.75}
    ],
    "scenario_types": [
        {"type": "Form Submission", "relevance": 0.90},
        {"type": "Data Validation", "relevance": 0.85}
    ],
    "similar_tickets": [
        {
            "ticket_key": "WRKA-1100",
            "similarity": 0.88,
            "summary": "Update MHIS form validation",
            "tested_at": "2024-11-01"
        }
    ],
    "recommended_patterns": [
        {
            "pattern_id": 42,
            "pattern_name": "MHIS Form Update Pattern",
            "relevance": 0.92,
            "success_rate": 0.95,
            "test_steps": ["..."]
        }
    ]
}
```

## Pattern Types

### 1. MHIS Patterns
- **MHIS Form Update** - Testing form field changes
- **MHIS Data Validation** - Testing validation rules
- **MHIS Integration** - Testing data flow to/from MHIS

### 2. Workflow Patterns
- **Workflow State Transition** - Testing state changes
- **Workflow Rule Updates** - Testing business rule modifications
- **Workflow Permission Checks** - Testing authorization at each state

### 3. Deferral Patterns
- **Deferral Logic Update** - Testing deferral conditions
- **Deferral Form Changes** - Testing deferral submission
- **Deferral Notification** - Testing deferral alerts

### 4. Approval Patterns
- **Approval Flow Testing** - Testing approval workflows
- **Approval Notification** - Testing approval alerts
- **Approval Permissions** - Testing who can approve

### 5. Integration Patterns
- **TARS Integration** - Testing TARS data sync
- **External System Sync** - Testing third-party integrations
- **Batch Processing** - Testing scheduled jobs

## Out of Scope

- **Manual Pattern Creation**: Users cannot manually create patterns (auto-detected only)
- **Pattern Editing**: Patterns are system-managed, not user-editable
- **Cross-Project Patterns**: Patterns are project-specific (WRKA vs WMB)
- **Advanced NLP**: No machine learning for text analysis (rule-based only)
- **Real-Time Pattern Detection**: Patterns detected in batch, not per-ticket

## Implementation Phases

### Phase 1: Basic Analysis (Week 1)
- Implement TicketAnalyzerService
- Component identification
- Scenario type detection
- Unit tests

### Phase 2: Similar Ticket Discovery (Week 2)
- Text similarity algorithm
- Database queries for similar tickets
- Ranking and scoring

### Phase 3: Pattern Detection (Week 3)
- PatternService implementation
- Pattern grouping algorithm
- Pattern storage

### Phase 4: Pattern Recommendations (Week 4)
- Pattern matching
- Recommendation engine
- Integration with prediction service

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Low accuracy in component detection | High | Medium | Iterative refinement of keywords, user feedback loop |
| Pattern overload (too many patterns) | Medium | High | Set minimum frequency threshold (3+ occurrences) |
| Outdated patterns not removed | Low | Medium | Auto-archive patterns unused for 6 months |
| Ambiguous ticket descriptions | Medium | High | Request clarification, provide partial analysis |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Analysis accuracy > 85% on test dataset
- [ ] Pattern detection identifies 50+ patterns
- [ ] Unit test coverage > 80%
- [ ] Performance benchmarks met
- [ ] User documentation complete
- [ ] Code review approved

## Appendices

### A. Sample Analysis Output
```python
{
    "ticket_key": "WRKA-5432",
    "summary": "Update MHIS form to add new eligibility field",
    "components": [
        {"name": "MHIS", "confidence": 0.98},
        {"name": "Workflow", "confidence": 0.45}
    ],
    "scenario_types": [
        {"type": "Form Submission", "relevance": 0.95},
        {"type": "Data Validation", "relevance": 0.90},
        {"type": "Integration Testing", "relevance": 0.70}
    ],
    "estimated_complexity": "Medium",
    "similar_tickets_count": 3
}
```

### B. Related Documentation
- [Architecture Overview](/docs/development/architecture/architecture-overview.md)
- [Pattern Service Documentation](/docs/pattern-learning.md)

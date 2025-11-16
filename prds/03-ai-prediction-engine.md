# PRD: AI-Powered Prediction Engine

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active

## Executive Summary

The AI-Powered Prediction Engine is the core intelligence of ATLAS, combining neural network predictions with similarity-based matching to generate highly accurate test scenario recommendations, edge case suggestions, and time estimates for JIRA testing tickets.

## Problem Statement

Testers face significant challenges when starting work on a new ticket:
- **Blank Slate Problem**: Not knowing where to start testing
- **Missed Edge Cases**: Overlooking critical edge cases that cause production bugs
- **Inconsistent Testing**: Different testers approaching similar tickets differently
- **Time Estimation**: Difficulty estimating how long testing will take
- **Knowledge Gaps**: Not knowing what similar tickets required in the past

## Goals & Objectives

### Primary Goals
1. Generate top 5 test scenario predictions with 80%+ accuracy
2. Suggest edge cases that testers might overlook
3. Provide confidence scores for each prediction
4. Estimate testing time based on ticket complexity
5. Improve predictions over time through continuous learning

### Success Metrics
- **Prediction Accuracy**: 80%+ acceptance rate from users
- **Edge Case Value**: 60%+ of suggested edge cases rated as useful
- **Confidence Calibration**: Confidence scores correlate with actual acceptance (r > 0.7)
- **Time Estimate Accuracy**: Within ±30% of actual time for 75% of tickets
- **Response Time**: Generate predictions in < 3 seconds
- **Learning Rate**: 5% improvement in accuracy per month with feedback

## User Stories

### Epic: Test Scenario Predictions
- **US-021**: As a tester, I want ATLAS to suggest test scenarios so I don't have to create them from scratch
- **US-022**: As a tester, I want to see confidence scores so I can prioritize the most reliable predictions
- **US-023**: As a tester, I want explanations for predictions so I understand the reasoning
- **US-024**: As a tester, I want to accept/reject predictions so ATLAS learns what works

### Epic: Edge Case Discovery
- **US-025**: As a tester, I want ATLAS to suggest edge cases so I don't miss critical scenarios
- **US-026**: As a tester, I want edge cases specific to the ticket's components so they're relevant
- **US-027**: As a tester, I want to see which edge cases were missed in similar tickets so I can learn from past mistakes

### Epic: Time Estimation
- **US-028**: As a tester, I want time estimates for tickets so I can plan my day
- **US-029**: As a tester, I want estimates broken down by scenario so I can track progress
- **US-030**: As a tester, I want estimates to improve as ATLAS learns my testing speed

## Functional Requirements

### FR-201: Hybrid Prediction Model
- **Priority**: P0 (Critical)
- **Description**: Combine neural network and similarity-based predictions
- **Acceptance Criteria**:
  - 70% weight to Flow-Nexus neural predictions
  - 30% weight to AgentDB similarity matching
  - Ensemble predictions for higher accuracy
  - Fallback to similarity-only if neural service unavailable
  - Blend confidence scores from both models
  - Return top 5 predictions ranked by blended confidence

### FR-202: Flow-Nexus Neural Predictions
- **Priority**: P0 (Critical)
- **Description**: Generate predictions using LSTM neural network
- **Acceptance Criteria**:
  - Send ticket features to Flow-Nexus API
  - Features include: summary, description, components, type, priority
  - Receive top 10 predictions with confidence scores
  - Handle API timeouts (5 second max)
  - Cache predictions for 1 hour
  - Log prediction latency for monitoring

### FR-203: AgentDB Similarity Matching
- **Priority**: P0 (Critical)
- **Description**: Find similar historical tickets using vector search
- **Acceptance Criteria**:
  - Convert ticket to embedding vector
  - Query AgentDB for top 10 similar tickets
  - Similarity threshold: 0.65 minimum
  - Extract test scenarios from similar tickets
  - Calculate confidence based on similarity score
  - Weight by historical success rate

### FR-204: Confidence Score Calculation
- **Priority**: P1 (High)
- **Description**: Calculate accurate confidence scores (0-100%)
- **Acceptance Criteria**:
  - Neural confidence: Based on softmax probability
  - Similarity confidence: Based on cosine similarity
  - Blend: `0.7 * neural_conf + 0.3 * similarity_conf`
  - Calibrate scores using historical acceptance rates
  - Normalize to 0-100% range
  - Flag low-confidence predictions (< 60%)

### FR-205: Edge Case Generation
- **Priority**: P1 (High)
- **Description**: Generate relevant edge case suggestions
- **Acceptance Criteria**:
  - Analyze ticket components for edge case templates
  - Component-specific edge cases:
    - MHIS: Data validation failures, null values, special characters
    - Workflow: Invalid state transitions, concurrent updates
    - Permissions: Unauthorized access, role boundaries
    - Forms: Maximum length, required fields, special formats
  - Historical edge cases from similar tickets
  - Return 5-10 edge cases
  - Prioritize by criticality (high/medium/low)

### FR-206: Test Step Details
- **Priority**: P1 (High)
- **Description**: Provide detailed test steps for each prediction
- **Acceptance Criteria**:
  - Each prediction includes step-by-step instructions
  - Steps include: setup, action, expected result
  - Steps formatted as JSON array
  - Include data requirements (test users, sample data)
  - Link to relevant documentation or past tickets
  - Support step customization by user

### FR-207: Time Estimation
- **Priority**: P1 (High)
- **Description**: Estimate testing time based on complexity
- **Acceptance Criteria**:
  - Calculate based on:
    - Number of predicted scenarios
    - Ticket complexity (simple/medium/complex)
    - Historical time for similar tickets
    - Component-specific averages
  - Provide range (min-max-average)
  - Break down by scenario
  - Learn from actual time via feedback
  - Adjust for user's speed over time

### FR-208: Prediction Explanations
- **Priority**: P2 (Medium)
- **Description**: Explain why predictions were generated
- **Acceptance Criteria**:
  - Show contributing factors:
    - Similar tickets used
    - Patterns matched
    - Components detected
    - Neural model reasoning (if available)
  - Human-readable explanations
  - Link to source data (tickets, patterns)
  - Transparency in confidence calculation

### FR-209: Prediction Caching
- **Priority**: P2 (Medium)
- **Description**: Cache predictions to improve performance
- **Acceptance Criteria**:
  - Cache key: ticket_id + ticket_updated_at timestamp
  - Cache TTL: 1 hour
  - Invalidate on ticket update
  - Store in-memory (Python dict or Redis if available)
  - Cache hit ratio > 50%
  - Reduce API calls to Flow-Nexus by 60%

### FR-210: Continuous Learning
- **Priority**: P1 (High)
- **Description**: Improve predictions using user feedback
- **Acceptance Criteria**:
  - Collect feedback: accepted/rejected/modified
  - Store in `predictions` table with feedback fields
  - Trigger retraining when feedback threshold met (100 new feedbacks)
  - Retrain neural model with new data
  - Update similarity matching with new patterns
  - Track accuracy improvement over time
  - Weekly automated retraining

## Non-Functional Requirements

### Performance
- **NFR-201**: Generate predictions in < 3 seconds
- **NFR-202**: Neural API call < 2 seconds
- **NFR-203**: Similarity search < 500ms
- **NFR-204**: Handle 100 concurrent prediction requests

### Accuracy
- **NFR-205**: Prediction acceptance rate > 80%
- **NFR-206**: Top-1 accuracy > 60%
- **NFR-207**: Top-5 accuracy > 85%
- **NFR-208**: Time estimate within ±30% for 75% of tickets

### Reliability
- **NFR-209**: 99% uptime for prediction service
- **NFR-210**: Graceful degradation if neural service fails (use similarity only)
- **NFR-211**: Never return 0 predictions (always provide at least similarity-based)
- **NFR-212**: Handle malformed ticket data without crashing

### Scalability
- **NFR-213**: Support up to 1000 predictions per day
- **NFR-214**: Store up to 100,000 prediction records
- **NFR-215**: Neural model training on 50,000+ tickets
- **NFR-216**: Vector database with 100,000+ embeddings

## Technical Architecture

### System Components

```
┌─────────────────────────────────────────┐
│         PredictionService               │
│  (Main orchestrator - prediction.py)    │
└─────────────────┬───────────────────────┘
                  │
          ┌───────┴────────┐
          ↓                ↓
┌──────────────────┐  ┌──────────────────┐
│ Flow-Nexus       │  │ AgentDB          │
│ Neural Service   │  │ Similarity       │
│ (70% weight)     │  │ (30% weight)     │
└──────────────────┘  └──────────────────┘
          │                │
          └───────┬────────┘
                  ↓
        ┌──────────────────┐
        │ Ensemble Blender │
        │ (Weighted avg)   │
        └──────────────────┘
                  ↓
        ┌──────────────────┐
        │ Top 5 Predictions│
        │ + Confidence     │
        │ + Edge Cases     │
        │ + Time Estimate  │
        └──────────────────┘
```

### Data Flow

```
1. User requests prediction for WRKA-1234
2. PredictionService checks cache (hit/miss)
3. If miss:
   a. Extract ticket features
   b. Call Flow-Nexus API (async)
   c. Call AgentDB search (async)
   d. Wait for both responses (max 3s)
   e. Blend predictions (0.7 * neural + 0.3 * similarity)
   f. Sort by confidence
   g. Generate edge cases
   h. Estimate time
   i. Cache result
4. Return prediction response
5. Store in predictions table
```

### Prediction Algorithm

```python
def predict(ticket):
    # Step 1: Get neural predictions
    neural_preds = flow_nexus.predict(ticket, top_k=10)

    # Step 2: Get similarity predictions
    similar_tickets = agentdb.search(ticket, top_k=10)
    similarity_preds = extract_scenarios(similar_tickets)

    # Step 3: Blend predictions
    blended = {}
    for pred in neural_preds:
        blended[pred.scenario] = {
            'confidence': pred.confidence * 0.7,
            'source': 'neural'
        }

    for pred in similarity_preds:
        if pred.scenario in blended:
            # Average if both models predict same scenario
            blended[pred.scenario]['confidence'] += pred.confidence * 0.3
            blended[pred.scenario]['source'] = 'hybrid'
        else:
            blended[pred.scenario] = {
                'confidence': pred.confidence * 0.3,
                'source': 'similarity'
            }

    # Step 4: Sort by confidence and take top 5
    top_5 = sorted(blended.items(), key=lambda x: x[1]['confidence'], reverse=True)[:5]

    # Step 5: Add details
    predictions = []
    for scenario, data in top_5:
        predictions.append({
            'scenario': scenario,
            'confidence': data['confidence'],
            'source': data['source'],
            'steps': get_scenario_steps(scenario),
            'estimated_time': estimate_time(scenario, ticket)
        })

    # Step 6: Generate edge cases
    edge_cases = generate_edge_cases(ticket, predictions)

    return {
        'predictions': predictions,
        'edge_cases': edge_cases,
        'total_estimated_time': sum(p['estimated_time'] for p in predictions)
    }
```

## Data Models

### Prediction Response
```json
{
    "ticket_key": "WRKA-1234",
    "predictions": [
        {
            "scenario_id": 1,
            "scenario_name": "MHIS Form Validation Testing",
            "confidence": 92.5,
            "source": "hybrid",
            "steps": [
                {
                    "step_number": 1,
                    "action": "Navigate to MHIS form",
                    "expected_result": "Form loads successfully"
                },
                {
                    "step_number": 2,
                    "action": "Enter invalid data in eligibility field",
                    "expected_result": "Validation error displayed"
                }
            ],
            "estimated_time_minutes": 15,
            "pattern_id": 42,
            "similar_tickets": ["WRKA-1100", "WRKA-1150"]
        }
    ],
    "edge_cases": [
        {
            "case_id": 1,
            "description": "Submit form with maximum character length in all fields",
            "criticality": "high",
            "component": "MHIS"
        },
        {
            "case_id": 2,
            "description": "Test form with special characters (< > & \" ')",
            "criticality": "medium",
            "component": "MHIS"
        }
    ],
    "total_estimated_time": 45,
    "generated_at": "2025-11-15T10:30:00Z"
}
```

### predictions Table
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    pattern_id INTEGER,
    confidence_score REAL NOT NULL,      -- 0-100
    predicted_steps TEXT NOT NULL,       -- JSON array
    source TEXT NOT NULL,                -- 'neural', 'similarity', 'hybrid'
    user_feedback TEXT,                  -- 'accepted', 'rejected', 'modified'
    user_rating INTEGER,                 -- 1-5 stars
    user_comments TEXT,
    actual_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (pattern_id) REFERENCES test_patterns(id)
);
```

## Edge Case Templates

### MHIS Edge Cases
1. Null/empty values in required fields
2. Maximum length validation
3. Special characters in text fields
4. Invalid date formats
5. Duplicate member IDs
6. Concurrent form submissions

### Workflow Edge Cases
1. Invalid state transitions
2. Permission checks at each state
3. Concurrent state updates
4. Rollback scenarios
5. Timeout handling
6. Missing required data for transition

### Permission Edge Cases
1. Unauthorized role access
2. Role boundary testing (user has role A tries to access role B function)
3. Expired credentials
4. Missing permissions
5. Permission inheritance issues

### Form Submission Edge Cases
1. Required field validation
2. Format validation (email, phone, SSN)
3. Cross-field validation (date ranges, dependencies)
4. File upload limits
5. CSRF protection
6. Session timeout during submission

## Retraining Process

### Trigger Conditions
- 100+ new feedback records since last training
- Weekly automated schedule (Sunday 2 AM)
- Manual trigger by admin
- Accuracy drop below 75%

### Retraining Steps
1. Collect feedback data from `predictions` table
2. Extract accepted predictions as positive examples
3. Extract rejected predictions as negative examples
4. Prepare training data (features + labels)
5. Send to Flow-Nexus retraining API
6. Update model version in config
7. Validate new model on hold-out set
8. Deploy if accuracy improvement > 2%
9. Rollback if accuracy decreases

### Feedback Loop
```
User accepts/rejects prediction
    ↓
Store feedback in predictions table
    ↓
Feedback count >= 100?
    ↓ Yes
Trigger retraining
    ↓
Flow-Nexus retrains model
    ↓
New model deployed
    ↓
Future predictions use updated model
```

## Out of Scope

- **Natural Language Processing**: No advanced NLP (BERT, transformers) for ticket analysis
- **Multi-Language Support**: English-only
- **Real-Time Learning**: Batch retraining only, not online learning
- **Automated Test Execution**: Predictions only, no automatic test running
- **Integration with Test Management Tools**: No Zephyr/TestRail integration

## Implementation Phases

### Phase 1: Basic Prediction (Week 1)
- Implement PredictionService
- Flow-Nexus integration
- Top-5 prediction generation
- Basic confidence scoring

### Phase 2: Similarity Matching (Week 2)
- AgentDB integration
- Vector embeddings
- Similarity search
- Hybrid blending

### Phase 3: Edge Cases & Time Estimation (Week 3)
- Edge case templates
- Edge case generation
- Time estimation algorithm
- Prediction explanations

### Phase 4: Continuous Learning (Week 4)
- Feedback collection
- Retraining service
- Model versioning
- Accuracy tracking

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Flow-Nexus API downtime | High | Medium | Fallback to similarity-only, cache predictions |
| Low prediction accuracy | High | Medium | Continuous learning, user feedback, model tuning |
| Slow response times | Medium | Low | Caching, async calls, timeout handling |
| Overfitting to user's bias | Medium | High | Diversity in training data, cross-validation |
| Edge cases too generic | Low | Medium | Component-specific templates, user feedback |

## Acceptance Criteria

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Prediction accuracy > 80% on test dataset
- [ ] Response time < 3 seconds for 95% of requests
- [ ] Unit test coverage > 85%
- [ ] Integration tests with mock Flow-Nexus/AgentDB pass
- [ ] Continuous learning pipeline validated
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Code review approved

## Appendices

### A. Flow-Nexus API Contract
```python
# Request
POST https://api.flow-nexus.ai/v1/predict
{
    "model_id": "atlas-lstm-v2",
    "features": {
        "summary": "Update MHIS form",
        "description": "Add new eligibility field...",
        "components": ["MHIS", "Workflow"],
        "ticket_type": "Story",
        "priority": "High"
    },
    "top_k": 10
}

# Response
{
    "predictions": [
        {
            "scenario": "MHIS Form Validation",
            "confidence": 0.85,
            "reasoning": "Based on MHIS component and form keywords"
        }
    ]
}
```

### B. Related Documentation
- [Neural Prediction Guide](/docs/neural-prediction.md)
- [Flow-Nexus Integration](/docs/integrations/flow-nexus/)
- [AgentDB Documentation](/docs/integrations/agentdb/)

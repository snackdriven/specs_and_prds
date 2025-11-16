# ATLAS Functional Specification

## Document Information
- **Version**: 1.0
- **Last Updated**: 2025-11-15
- **Owner**: ATLAS Development Team
- **Status**: Active
- **Related PRDs**: See `/docs/specifications/prds/`

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Data Layer](#3-data-layer)
4. [Service Layer](#4-service-layer)
5. [API Layer](#5-api-layer)
6. [Frontend Layer](#6-frontend-layer)
7. [Integration Points](#7-integration-points)
8. [Security & Authentication](#8-security--authentication)
9. [Performance & Scalability](#9-performance--scalability)
10. [Error Handling](#10-error-handling)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment](#12-deployment)

---

## 1. System Overview

### 1.1 Purpose

ATLAS is a single-user, local-first AI-powered testing companion for analyzing JIRA tickets and generating intelligent test scenario predictions.

### 1.2 Technology Stack

#### Backend
- **Language**: Python 3.8+
- **Framework**: Flask 3.1.0
- **Database**: SQLite 3
- **ORM**: None (raw SQL with repositories)
- **HTTP Client**: Requests 2.31+
- **Testing**: pytest 8.3+, pytest-flask

#### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: None (Vanilla JS)
- **Build Tools**: None (direct file serving)
- **Charts**: Chart.js (if needed)

#### External Services
- **JIRA Integration**: Atlassian REST API v3 + MCP
- **Neural Predictions**: Flow-Nexus LSTM API
- **Vector Database**: AgentDB (local, embedded)

### 1.3 System Context

```
┌──────────────────────────────────────────────────┐
│                    User (Browser)                 │
└────────────────────┬─────────────────────────────┘
                     │ HTTP
                     ↓
┌──────────────────────────────────────────────────┐
│              Flask Application                    │
│  ┌────────────┐  ┌──────────────┐               │
│  │ API Layer  │  │ Web UI       │               │
│  └─────┬──────┘  └──────────────┘               │
│        ↓                                          │
│  ┌──────────────────────────┐                    │
│  │    Service Layer         │                    │
│  └─────┬────────────────────┘                    │
│        ↓                                          │
│  ┌──────────────────────────┐                    │
│  │   Repository Layer       │                    │
│  └─────┬────────────────────┘                    │
└────────┼────────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────────┐
│          SQLite Database (tar_testing.db)        │
└──────────────────────────────────────────────────┘

External Integrations:
├─→ JIRA Cloud API (REST v3)
├─→ Flow-Nexus API (LSTM predictions)
└─→ AgentDB (vector embeddings, local)
```

---

## 2. Architecture

### 2.1 Layered Architecture

ATLAS follows a strict layered architecture:

1. **Presentation Layer** - HTML/CSS/JS frontend
2. **API Layer** - Flask blueprints, REST endpoints
3. **Service Layer** - Business logic
4. **Repository Layer** - Data access
5. **Data Layer** - SQLite database

**Layer Communication Rules**:
- Each layer can only communicate with the layer directly below
- No skipping layers (e.g., API cannot directly access database)
- Data flows up and down the stack

### 2.2 Component Diagram

```
┌─────────────────────────────────────────────────┐
│                  Frontend                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Dashboard │  │My Work   │  │Ticket    │     │
│  │Page      │  │Page      │  │Analysis  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└──────────────────┬──────────────────────────────┘
                   │ REST API
┌──────────────────┴──────────────────────────────┐
│              API Blueprints                      │
│  ┌──────────────┐  ┌───────────────────┐       │
│  │ atlas_api    │  │ personal_api      │       │
│  │ /api/atlas/  │  │ /api/atlas/       │       │
│  │              │  │ personal/         │       │
│  └──────┬───────┘  └────────┬──────────┘       │
└─────────┼──────────────────┼────────────────────┘
          │                  │
┌─────────┴──────────────────┴────────────────────┐
│              Service Layer                       │
│  ┌─────────────────┐  ┌──────────────────┐     │
│  │TicketAnalyzer   │  │PredictionService │     │
│  │Service          │  │                  │     │
│  └────────┬────────┘  └─────────┬────────┘     │
│  ┌────────┴────────┐  ┌─────────┴────────┐     │
│  │PersonalWork     │  │PatternService    │     │
│  │Service          │  │                  │     │
│  └────────┬────────┘  └─────────┬────────┘     │
│           │                     │               │
│  ┌────────┴────────┐  ┌─────────┴────────┐     │
│  │JiraMCP          │  │SessionRepo       │     │
│  │Service          │  │sitory            │     │
│  └─────────────────┘  └──────────────────┘     │
└─────────┬─────────────────────┬─────────────────┘
          │                     │
┌─────────┴─────────────────────┴─────────────────┐
│           Repository Layer                       │
│  ┌──────────────┐  ┌──────────────────┐        │
│  │Ticket        │  │Pattern           │        │
│  │Repository    │  │Repository        │        │
│  └──────┬───────┘  └─────────┬────────┘        │
│         │                    │                  │
│  ┌──────┴────────┐  ┌────────┴────────┐        │
│  │Session        │  │User             │        │
│  │Repository     │  │Repository       │        │
│  └──────┬────────┘  └────────┬────────┘        │
└─────────┼──────────────────┼──────────────────┘
          │                  │
┌─────────┴──────────────────┴──────────────────┐
│           SQLite Database                     │
│  tar_testing.db (9 ATLAS tables + 66K TAR)    │
└───────────────────────────────────────────────┘
```

### 2.3 Service Dependencies

```python
# Service dependency graph
PredictionService
  ├─ depends_on: FlowNexusService
  ├─ depends_on: AgentDBService
  ├─ depends_on: PatternRepository
  └─ depends_on: TicketRepository

PersonalWorkService
  ├─ depends_on: JiraMCPService
  ├─ depends_on: TicketRepository
  └─ depends_on: UserRepository

TicketAnalyzerService
  ├─ depends_on: PatternService
  └─ depends_on: TicketRepository

FeedbackService
  ├─ depends_on: RetrainingService
  └─ depends_on: PredictionRepository
```

---

## 3. Data Layer

### 3.1 Database Schema

#### Core Tables

**jira_tickets**
```sql
CREATE TABLE jira_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_key TEXT UNIQUE NOT NULL,           -- WRKA-1234
    summary TEXT NOT NULL,
    description TEXT,
    ticket_type TEXT NOT NULL,               -- Story, Task, Bug
    status TEXT NOT NULL,                    -- To Do, In Progress, Done
    priority TEXT,                           -- High, Medium, Low
    assignee TEXT,                           -- Kayla Gilbert
    reporter TEXT,
    components TEXT,                         -- JSON array
    labels TEXT,                             -- JSON array
    created_date TIMESTAMP,
    updated_date TIMESTAMP,
    resolved_date TIMESTAMP,
    project_key TEXT NOT NULL,               -- WRKA, WMB
    synced_from_jira BOOLEAN DEFAULT 0,
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jira_tickets_key ON jira_tickets(jira_key);
CREATE INDEX idx_jira_tickets_assignee ON jira_tickets(assignee);
CREATE INDEX idx_jira_tickets_status ON jira_tickets(status);
CREATE INDEX idx_jira_tickets_project ON jira_tickets(project_key);
CREATE INDEX idx_jira_tickets_updated ON jira_tickets(updated_date);
```

**test_patterns**
```sql
CREATE TABLE test_patterns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pattern_type TEXT NOT NULL,              -- MHIS, Deferral, Workflow
    pattern_name TEXT NOT NULL,              -- "MHIS Form Validation"
    test_steps TEXT NOT NULL,                -- JSON array of steps
    success_rate REAL DEFAULT 0,             -- 0.0 to 1.0
    frequency INTEGER DEFAULT 0,             -- Times pattern seen
    avg_time_minutes INTEGER,
    component TEXT,                          -- Primary component
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX idx_patterns_type ON test_patterns(pattern_type);
CREATE INDEX idx_patterns_component ON test_patterns(component);
CREATE INDEX idx_patterns_frequency ON test_patterns(frequency DESC);
CREATE INDEX idx_patterns_success ON test_patterns(success_rate DESC);
```

**predictions**
```sql
CREATE TABLE predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    pattern_id INTEGER,
    confidence_score REAL NOT NULL,          -- 0-100
    predicted_steps TEXT NOT NULL,           -- JSON array
    source TEXT NOT NULL,                    -- 'neural', 'similarity', 'hybrid'
    user_feedback TEXT,                      -- 'accepted', 'rejected', 'modified'
    user_rating INTEGER,                     -- 1-5 stars
    user_comments TEXT,
    actual_time_minutes INTEGER,
    estimated_time_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (pattern_id) REFERENCES test_patterns(id)
);

CREATE INDEX idx_predictions_ticket ON predictions(jira_ticket_id);
CREATE INDEX idx_predictions_pattern ON predictions(pattern_id);
CREATE INDEX idx_predictions_confidence ON predictions(confidence_score DESC);
CREATE INDEX idx_predictions_feedback ON predictions(user_feedback);
CREATE INDEX idx_predictions_source ON predictions(source);
```

**testing_sessions**
```sql
CREATE TABLE testing_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    prediction_id INTEGER,
    user_id INTEGER NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    duration_minutes INTEGER,
    break_count INTEGER DEFAULT 0,
    break_time_minutes INTEGER DEFAULT 0,
    steps_completed INTEGER DEFAULT 0,
    steps_total INTEGER,
    status TEXT NOT NULL,                    -- 'active', 'paused', 'completed'
    outcome TEXT,                            -- 'passed', 'failed', 'blocked'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (prediction_id) REFERENCES predictions(id),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);

CREATE INDEX idx_sessions_status ON testing_sessions(status);
CREATE INDEX idx_sessions_user_started ON testing_sessions(user_id, started_at);
CREATE INDEX idx_sessions_ticket ON testing_sessions(jira_ticket_id);
```

**user_profiles**
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
    coach_personality TEXT DEFAULT 'coach',  -- coach, analyst, hype_man, drill_sergeant, silent
    theme TEXT DEFAULT 'light',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_username ON user_profiles(username);
CREATE INDEX idx_user_xp ON user_profiles(xp_total DESC);
```

**achievements**
```sql
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    achievement_type TEXT NOT NULL,          -- milestone, streak, mastery, discovery
    achievement_name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    target INTEGER,                          -- Goal value
    current_progress INTEGER DEFAULT 0,
    xp_reward INTEGER DEFAULT 50,
    is_earned BOOLEAN DEFAULT 0,
    earned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_earned ON achievements(is_earned);
CREATE INDEX idx_achievements_type ON achievements(achievement_type);
CREATE INDEX idx_achievements_progress ON achievements(current_progress);
```

**ticket_notes**
```sql
CREATE TABLE ticket_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    jira_ticket_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    note TEXT,
    difficulty_rating INTEGER,               -- 1-5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jira_ticket_id, user_id),
    FOREIGN KEY (jira_ticket_id) REFERENCES jira_tickets(id),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

**daily_challenges**
```sql
CREATE TABLE daily_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    challenge_date DATE NOT NULL,
    challenge_type TEXT NOT NULL,
    challenge_goal TEXT NOT NULL,
    target INTEGER NOT NULL,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT 0,
    completed_at TIMESTAMP,
    xp_reward INTEGER DEFAULT 50,
    UNIQUE(user_id, challenge_date),
    FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);
```

**agent_memory**
```sql
CREATE TABLE agent_memory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_type TEXT NOT NULL,               -- pattern, context, preference, session
    key TEXT NOT NULL,
    value TEXT,                              -- JSON or text
    embedding BLOB,                          -- Vector embedding
    vector_id TEXT,                          -- AgentDB vector ID
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(memory_type, key)
);
```

### 3.2 Data Access Patterns

#### Repository Pattern

All database access goes through repository classes:

```python
class BaseRepository:
    """Base repository with common CRUD operations"""

    def __init__(self, db_connection):
        self.db = db_connection

    def execute(self, query, params=()):
        """Execute query and return cursor"""
        return self.db.execute(query, params)

    def fetchone(self, query, params=()):
        """Fetch single row as dict"""
        cursor = self.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None

    def fetchall(self, query, params=()):
        """Fetch all rows as list of dicts"""
        cursor = self.execute(query, params)
        return [dict(row) for row in cursor.fetchall()]

class TicketRepository(BaseRepository):
    def get_by_key(self, jira_key):
        """Get ticket by JIRA key"""
        query = "SELECT * FROM jira_tickets WHERE jira_key = ?"
        return self.fetchone(query, (jira_key,))

    def get_by_assignee(self, assignee, status=None):
        """Get tickets assigned to user"""
        query = "SELECT * FROM jira_tickets WHERE assignee = ?"
        params = [assignee]

        if status:
            query += " AND status = ?"
            params.append(status)

        query += " ORDER BY priority DESC, updated_date DESC"
        return self.fetchall(query, params)

    def upsert(self, ticket):
        """Insert or update ticket"""
        query = """
            INSERT INTO jira_tickets
            (jira_key, summary, description, ticket_type, status, priority,
             assignee, reporter, components, labels, created_date, updated_date,
             project_key, synced_from_jira, last_synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(jira_key) DO UPDATE SET
                summary = excluded.summary,
                description = excluded.description,
                status = excluded.status,
                updated_date = excluded.updated_date,
                last_synced = excluded.last_synced
        """
        params = (
            ticket['jira_key'], ticket['summary'], ticket.get('description'),
            ticket['ticket_type'], ticket['status'], ticket.get('priority'),
            ticket.get('assignee'), ticket.get('reporter'),
            json.dumps(ticket.get('components', [])),
            json.dumps(ticket.get('labels', [])),
            ticket.get('created_date'), ticket.get('updated_date'),
            ticket['project_key'], True, datetime.utcnow()
        )
        self.execute(query, params)
        self.db.commit()
```

---

## 4. Service Layer

### 4.1 Service Responsibilities

Each service has a single, well-defined responsibility:

| Service | Responsibility |
|---------|----------------|
| TicketAnalyzerService | Analyze tickets, extract components, find similar |
| PredictionService | Generate test predictions (neural + similarity) |
| PersonalWorkService | Manage user's personal work and notes |
| JiraMCPService | Integrate with JIRA via MCP protocol |
| JiraSyncService | Batch sync tickets from JIRA to local DB |
| FlowNexusService | Call Flow-Nexus LSTM API for predictions |
| AgentDBService | Vector database operations (embed, search) |
| FeedbackService | Process user feedback on predictions |
| PatternService | Detect and manage test patterns |
| CoachService | Generate coach messages by personality |
| RetrainingService | Trigger model retraining |
| TrainingDataService | Prepare data for model training |
| SyncService | Background sync scheduler |

### 4.2 Service Implementation Example

```python
class PredictionService:
    """Generate AI-powered test scenario predictions"""

    def __init__(self):
        self.flow_nexus = FlowNexusService()
        self.agentdb = AgentDBService()
        self.pattern_repo = PatternRepository()
        self.ticket_repo = TicketRepository()

    def predict(self, ticket, top_k=5):
        """
        Generate top-k test scenario predictions

        Args:
            ticket: Ticket dict with keys: summary, description, components
            top_k: Number of predictions to return (default 5)

        Returns:
            dict with keys: predictions, edge_cases, total_estimated_time
        """
        # Step 1: Get neural predictions (70% weight)
        try:
            neural_preds = self.flow_nexus.predict(
                ticket_summary=ticket['summary'],
                ticket_description=ticket.get('description', ''),
                components=ticket.get('components', []),
                top_k=10
            )
        except Exception as e:
            logger.error(f"Flow-Nexus prediction failed: {e}")
            neural_preds = []

        # Step 2: Get similarity-based predictions (30% weight)
        try:
            similar_tickets = self.agentdb.search_similar_tickets(
                ticket_text=f"{ticket['summary']} {ticket.get('description', '')}",
                top_k=10
            )
            similarity_preds = self._extract_predictions_from_similar(similar_tickets)
        except Exception as e:
            logger.error(f"AgentDB search failed: {e}")
            similarity_preds = []

        # Step 3: Blend predictions
        blended = self._blend_predictions(
            neural_preds,
            similarity_preds,
            neural_weight=0.7,
            similarity_weight=0.3
        )

        # Step 4: Take top-k
        top_predictions = sorted(
            blended,
            key=lambda x: x['confidence'],
            reverse=True
        )[:top_k]

        # Step 5: Enrich with details
        enriched = []
        for pred in top_predictions:
            enriched.append({
                'scenario_name': pred['scenario_name'],
                'confidence': pred['confidence'],
                'source': pred['source'],
                'steps': self._get_scenario_steps(pred['scenario_name']),
                'estimated_time': self._estimate_time(pred['scenario_name'], ticket),
                'pattern_id': pred.get('pattern_id')
            })

        # Step 6: Generate edge cases
        edge_cases = self._generate_edge_cases(ticket, top_predictions)

        # Step 7: Calculate total time
        total_time = sum(p['estimated_time'] for p in enriched)

        return {
            'predictions': enriched,
            'edge_cases': edge_cases,
            'total_estimated_time': total_time
        }

    def _blend_predictions(self, neural_preds, similarity_preds,
                           neural_weight, similarity_weight):
        """Blend neural and similarity predictions"""
        blended = {}

        # Add neural predictions
        for pred in neural_preds:
            scenario = pred['scenario_name']
            blended[scenario] = {
                'scenario_name': scenario,
                'confidence': pred['confidence'] * neural_weight,
                'source': 'neural'
            }

        # Add similarity predictions
        for pred in similarity_preds:
            scenario = pred['scenario_name']
            if scenario in blended:
                # Hybrid: both models predicted same scenario
                blended[scenario]['confidence'] += pred['confidence'] * similarity_weight
                blended[scenario]['source'] = 'hybrid'
            else:
                blended[scenario] = {
                    'scenario_name': scenario,
                    'confidence': pred['confidence'] * similarity_weight,
                    'source': 'similarity'
                }

        return list(blended.values())

    def _generate_edge_cases(self, ticket, predictions):
        """Generate edge case suggestions"""
        edge_cases = []

        components = ticket.get('components', [])

        for component in components:
            if component == 'MHIS':
                edge_cases.extend([
                    {
                        'description': 'Test with null/empty values in required fields',
                        'criticality': 'high',
                        'component': 'MHIS'
                    },
                    {
                        'description': 'Test with maximum length values',
                        'criticality': 'medium',
                        'component': 'MHIS'
                    },
                    {
                        'description': 'Test with special characters: < > & " \\' in text fields',
                        'criticality': 'medium',
                        'component': 'MHIS'
                    }
                ])
            elif component == 'Workflow':
                edge_cases.extend([
                    {
                        'description': 'Test invalid state transitions',
                        'criticality': 'high',
                        'component': 'Workflow'
                    },
                    {
                        'description': 'Test concurrent state updates',
                        'criticality': 'high',
                        'component': 'Workflow'
                    }
                ])
            # ... more component-specific edge cases

        return edge_cases[:10]  # Return max 10

    def _estimate_time(self, scenario_name, ticket):
        """Estimate time for scenario"""
        # Get base time from pattern
        pattern = self.pattern_repo.get_by_name(scenario_name)
        if pattern and pattern['avg_time_minutes']:
            base_time = pattern['avg_time_minutes']
        else:
            base_time = 45  # Default

        # Adjust for ticket complexity
        complexity_factor = 1.0
        if ticket.get('priority') == 'High':
            complexity_factor = 1.2
        elif ticket.get('priority') == 'Low':
            complexity_factor = 0.8

        return int(base_time * complexity_factor)
```

---

## 5. API Layer

### 5.1 API Endpoints

#### Atlas API (`/api/atlas/`)

```python
from flask import Blueprint, request, jsonify

atlas_api = Blueprint('atlas_api', __name__, url_prefix='/api/atlas')

@atlas_api.route('/analyze', methods=['POST'])
def analyze_ticket():
    """
    Analyze a JIRA ticket

    Request:
        POST /api/atlas/analyze
        {
            "ticket_key": "WRKA-1234"
        }

    Response:
        200 OK
        {
            "ticket_key": "WRKA-1234",
            "components": [
                {"name": "MHIS", "confidence": 0.95},
                {"name": "Workflow", "confidence": 0.75}
            ],
            "scenario_types": [
                {"type": "Form Submission", "relevance": 0.90}
            ],
            "similar_tickets": [
                {"ticket_key": "WRKA-1100", "similarity": 0.88}
            ]
        }
    """
    data = request.json
    ticket_key = data.get('ticket_key')

    if not ticket_key:
        return jsonify({'error': 'ticket_key required'}), 400

    # Get ticket from database
    ticket = ticket_repo.get_by_key(ticket_key)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404

    # Analyze
    analysis = ticket_analyzer_service.analyze(ticket)

    return jsonify(analysis), 200

@atlas_api.route('/session/start', methods=['POST'])
def start_session():
    """
    Start a testing session

    Request:
        POST /api/atlas/session/start
        {
            "jira_ticket_id": 123,
            "prediction_id": 456  # optional
        }

    Response:
        201 Created
        {
            "session_id": 789,
            "started_at": "2025-11-15T10:00:00Z",
            "status": "active"
        }
    """
    data = request.json

    session = session_repo.create({
        'jira_ticket_id': data['jira_ticket_id'],
        'prediction_id': data.get('prediction_id'),
        'user_id': 1,  # Single user
        'started_at': datetime.utcnow(),
        'status': 'active'
    })

    return jsonify(session), 201

@atlas_api.route('/session/end', methods=['POST'])
def end_session():
    """
    End a testing session

    Request:
        POST /api/atlas/session/end
        {
            "session_id": 789,
            "steps_completed": 12,
            "outcome": "passed"
        }

    Response:
        200 OK
        {
            "session_id": 789,
            "duration_minutes": 45,
            "xp_earned": 25
        }
    """
    data = request.json
    session_id = data['session_id']

    session = session_repo.end_session(
        session_id,
        steps_completed=data.get('steps_completed'),
        outcome=data.get('outcome')
    )

    # Award XP
    xp = gamification_service.award_xp(session)

    return jsonify({
        'session_id': session_id,
        'duration_minutes': session['duration_minutes'],
        'xp_earned': xp
    }), 200
```

#### Personal API (`/api/atlas/personal/`)

```python
personal_api = Blueprint('personal_api', __name__,
                         url_prefix='/api/atlas/personal')

@personal_api.route('/my-work', methods=['GET'])
def get_my_work():
    """
    Get user's assigned tickets

    Request:
        GET /api/atlas/personal/my-work?live=true&status=In Progress

    Response:
        200 OK
        {
            "tickets": [
                {
                    "jira_key": "WRKA-1234",
                    "summary": "Update MHIS form",
                    "status": "In Progress",
                    "priority": "High",
                    "updated_date": "2025-11-15T09:00:00Z",
                    "my_note": "Complex validation logic",
                    "difficulty_rating": 4
                }
            ],
            "count": 1,
            "data_source": "live" | "cached",
            "last_sync": "2025-11-15T08:00:00Z"
        }
    """
    live = request.args.get('live', 'false').lower() == 'true'
    status = request.args.get('status')

    if live:
        # Fetch from JIRA
        tickets = jira_mcp_service.get_assigned_tickets(
            assignee='Kayla Gilbert',
            status=status
        )
        data_source = 'live'
    else:
        # Fetch from local database
        tickets = personal_work_service.get_my_work(
            assignee='Kayla Gilbert',
            status=status
        )
        data_source = 'cached'

    return jsonify({
        'tickets': tickets,
        'count': len(tickets),
        'data_source': data_source,
        'last_sync': sync_service.get_last_sync_time()
    }), 200
```

### 5.2 API Response Formats

#### Success Response
```json
{
    "data": { ... },
    "meta": {
        "timestamp": "2025-11-15T10:00:00Z",
        "version": "1.0"
    }
}
```

#### Error Response
```json
{
    "error": {
        "code": "TICKET_NOT_FOUND",
        "message": "Ticket WRKA-9999 not found in database",
        "details": {
            "ticket_key": "WRKA-9999"
        }
    },
    "meta": {
        "timestamp": "2025-11-15T10:00:00Z"
    }
}
```

### 5.3 HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST creation
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - External service down

---

## 6. Frontend Layer

### 6.1 Page Structure

Each page follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ATLAS - Page Title</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/atlas.css') }}">
</head>
<body>
    {% include 'layout.html' %}

    <div class="container">
        <h1>Page Title</h1>

        <!-- Page content -->
        <div id="app">
            <!-- Populated by JavaScript -->
        </div>
    </div>

    <script src="{{ url_for('static', filename='js/atlas.js') }}"></script>
    <script>
        // Page-specific initialization
        ATLAS.init('page-name');
    </script>
</body>
</html>
```

### 6.2 JavaScript Architecture

```javascript
// atlas.js - Main application object

const ATLAS = {
    config: {
        apiBase: '/api/atlas',
        refreshInterval: 30000  // 30 seconds
    },

    state: {
        currentUser: null,
        activeSession: null,
        cachedData: {}
    },

    // Initialize application
    init(pageName) {
        this.loadUserProfile();
        this.initPage(pageName);
        this.startAutoRefresh();
    },

    // Load user profile
    async loadUserProfile() {
        const response = await fetch(`${this.config.apiBase}/user/profile`);
        this.state.currentUser = await response.json();
    },

    // Initialize specific page
    initPage(pageName) {
        switch(pageName) {
            case 'dashboard':
                this.dashboard.init();
                break;
            case 'my-work':
                this.myWork.init();
                break;
            case 'ticket-analysis':
                this.ticketAnalysis.init();
                break;
        }
    },

    // Dashboard module
    dashboard: {
        init() {
            this.loadQuickStats();
            this.loadActivityChart();
            this.loadRecentTickets();
        },

        async loadQuickStats() {
            const response = await fetch(`${ATLAS.config.apiBase}/personal/quick-stats`);
            const stats = await response.json();
            this.renderQuickStats(stats);
        },

        renderQuickStats(stats) {
            const html = `
                <div class="quick-stats">
                    <div class="stat">
                        <span class="value">${stats.tickets_today}</span>
                        <span class="label">Tickets Today</span>
                    </div>
                    <div class="stat">
                        <span class="value">${stats.current_streak} 🔥</span>
                        <span class="label">Current Streak</span>
                    </div>
                    <div class="stat">
                        <span class="value">Level ${stats.level}</span>
                        <span class="label">${stats.xp_current}/${stats.xp_next} XP</span>
                    </div>
                </div>
            `;
            document.getElementById('quick-stats').innerHTML = html;
        }
    },

    // My Work module
    myWork: {
        init() {
            this.loadTickets();
            this.setupFilters();
        },

        async loadTickets(live = false) {
            const url = `${ATLAS.config.apiBase}/personal/my-work?live=${live}`;
            const response = await fetch(url);
            const data = await response.json();
            this.renderTickets(data.tickets);
        },

        renderTickets(tickets) {
            const html = tickets.map(ticket => `
                <div class="ticket-card" data-key="${ticket.jira_key}">
                    <div class="ticket-header">
                        <span class="ticket-key">${ticket.jira_key}</span>
                        <span class="priority priority-${ticket.priority.toLowerCase()}">
                            ${ticket.priority}
                        </span>
                    </div>
                    <h3>${ticket.summary}</h3>
                    <div class="ticket-meta">
                        <span>Status: ${ticket.status}</span>
                        <span>Updated: ${this.formatDate(ticket.updated_date)}</span>
                    </div>
                    <button onclick="ATLAS.myWork.analyzeTicket('${ticket.jira_key}')">
                        Analyze
                    </button>
                </div>
            `).join('');

            document.getElementById('tickets-container').innerHTML = html;
        },

        analyzeTicket(ticketKey) {
            window.location.href = `/ticket-analysis?key=${ticketKey}`;
        }
    },

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hours ago`;
        return date.toLocaleDateString();
    },

    startAutoRefresh() {
        setInterval(() => {
            this.refreshCurrentPage();
        }, this.config.refreshInterval);
    }
};
```

---

## 7. Integration Points

### 7.1 JIRA Integration

```python
class JiraMCPService:
    """Integrate with JIRA via MCP protocol"""

    def __init__(self):
        self.base_url = os.getenv('JIRA_INSTANCE_URL')
        self.email = os.getenv('JIRA_USER_EMAIL')
        self.api_token = os.getenv('JIRA_API_KEY')
        self.auth = (self.email, self.api_token)

    def get_assigned_tickets(self, assignee, status=None):
        """Get tickets assigned to user"""
        jql = f'assignee = "{assignee}"'

        if status:
            jql += f' AND status = "{status}"'

        jql += ' ORDER BY priority DESC, updated DESC'

        return self._search_jql(jql)

    def _search_jql(self, jql, max_results=100):
        """Search JIRA using JQL"""
        url = f'{self.base_url}/rest/api/3/search'
        params = {
            'jql': jql,
            'maxResults': max_results,
            'fields': 'summary,description,status,priority,assignee,reporter,components,labels,created,updated'
        }

        response = requests.get(url, auth=self.auth, params=params)
        response.raise_for_status()

        data = response.json()
        return [self._map_jira_issue(issue) for issue in data['issues']]

    def _map_jira_issue(self, issue):
        """Map JIRA API response to internal format"""
        fields = issue['fields']
        return {
            'jira_key': issue['key'],
            'summary': fields['summary'],
            'description': fields.get('description', {}).get('content', ''),
            'ticket_type': fields['issuetype']['name'],
            'status': fields['status']['name'],
            'priority': fields.get('priority', {}).get('name'),
            'assignee': fields.get('assignee', {}).get('displayName'),
            'reporter': fields.get('reporter', {}).get('displayName'),
            'components': [c['name'] for c in fields.get('components', [])],
            'labels': fields.get('labels', []),
            'created_date': fields['created'],
            'updated_date': fields['updated'],
            'project_key': issue['key'].split('-')[0]
        }
```

### 7.2 Flow-Nexus Integration

```python
class FlowNexusService:
    """Call Flow-Nexus LSTM API for neural predictions"""

    def __init__(self):
        self.api_key = os.getenv('FLOW_NEXUS_API_KEY')
        self.base_url = 'https://api.flow-nexus.ai/v1'
        self.model_id = 'atlas-lstm-v2'

    def predict(self, ticket_summary, ticket_description, components, top_k=10):
        """
        Get neural predictions from Flow-Nexus

        Args:
            ticket_summary: Ticket summary text
            ticket_description: Ticket description text
            components: List of component names
            top_k: Number of predictions to return

        Returns:
            List of predictions with confidence scores
        """
        url = f'{self.base_url}/predict'
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        payload = {
            'model_id': self.model_id,
            'features': {
                'summary': ticket_summary,
                'description': ticket_description,
                'components': components
            },
            'top_k': top_k
        }

        response = requests.post(url, headers=headers, json=payload, timeout=5)
        response.raise_for_status()

        data = response.json()
        return [
            {
                'scenario_name': pred['scenario'],
                'confidence': pred['confidence'] * 100,  # Convert to 0-100
                'reasoning': pred.get('reasoning', '')
            }
            for pred in data['predictions']
        ]
```

### 7.3 AgentDB Integration

```python
class AgentDBService:
    """Vector database for similarity search"""

    def __init__(self):
        self.db_path = os.getenv('AGENTDB_PATH', './agentdb')
        self.db = AgentDB(
            path=self.db_path,
            dimensions=384,  # Sentence-BERT embedding size
            metric='cosine'
        )

    def search_similar_tickets(self, ticket_text, top_k=10):
        """
        Search for similar tickets using vector similarity

        Args:
            ticket_text: Ticket summary + description
            top_k: Number of similar tickets to return

        Returns:
            List of similar tickets with similarity scores
        """
        # Generate embedding
        embedding = self._embed_text(ticket_text)

        # Search AgentDB
        results = self.db.search(
            vector=embedding,
            top_k=top_k,
            threshold=0.65  # Minimum similarity
        )

        # Retrieve full ticket data
        similar_tickets = []
        for result in results:
            ticket = ticket_repo.get(result['metadata']['ticket_id'])
            if ticket:
                ticket['similarity_score'] = result['score']
                similar_tickets.append(ticket)

        return similar_tickets

    def _embed_text(self, text):
        """Generate embedding for text using Sentence-BERT"""
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embedding = model.encode(text)
        return embedding.tolist()

    def store_ticket_embedding(self, ticket_id, ticket_text):
        """Store ticket embedding in AgentDB"""
        embedding = self._embed_text(ticket_text)

        self.db.insert(
            vector=embedding,
            metadata={
                'ticket_id': ticket_id,
                'stored_at': datetime.utcnow().isoformat()
            }
        )
```

---

## 8. Security & Authentication

### 8.1 Security Principles

1. **Single-User Local App** - No authentication required
2. **Local Data Only** - No cloud storage, all data on local machine
3. **Secure External API Calls** - HTTPS only, credentials in environment variables
4. **Input Validation** - All user inputs validated
5. **SQL Injection Prevention** - Parameterized queries only

### 8.2 Input Validation

```python
def validate_ticket_key(ticket_key):
    """Validate JIRA ticket key format"""
    pattern = r'^[A-Z]+-\d+$'  # PROJECT-123
    if not re.match(pattern, ticket_key):
        raise ValueError(f'Invalid ticket key format: {ticket_key}')
    return ticket_key

def sanitize_sql_input(value):
    """Sanitize input for SQL (even though using parameterized queries)"""
    if isinstance(value, str):
        # Remove any SQL keywords
        dangerous = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER']
        for keyword in dangerous:
            if keyword.upper() in value.upper():
                raise ValueError(f'Dangerous SQL keyword detected: {keyword}')
    return value
```

### 8.3 Secrets Management

```python
# config/settings.py

import os
from dotenv import load_dotenv

load_dotenv()  # Load from .env file

SETTINGS = {
    'jira': {
        'url': os.getenv('JIRA_INSTANCE_URL'),
        'email': os.getenv('JIRA_USER_EMAIL'),
        'api_token': os.getenv('JIRA_API_KEY')  # NEVER hardcode
    },
    'flow_nexus': {
        'api_key': os.getenv('FLOW_NEXUS_API_KEY')
    }
}

# .env file (NEVER commit to git)
JIRA_INSTANCE_URL=https://your-instance.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_KEY=your_api_token_here
FLOW_NEXUS_API_KEY=your_flow_nexus_key
```

---

## 9. Performance & Scalability

### 9.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard Load | < 2 seconds | Time to interactive |
| Ticket Analysis | < 3 seconds | API response time |
| Prediction Generation | < 3 seconds | End-to-end |
| Database Query | < 500ms | 95th percentile |
| JIRA Sync (10K tickets) | < 5 minutes | Batch operation |

### 9.2 Optimization Techniques

#### Database Indexing
```sql
-- Critical indexes for performance
CREATE INDEX idx_jira_tickets_key ON jira_tickets(jira_key);
CREATE INDEX idx_jira_tickets_assignee ON jira_tickets(assignee);
CREATE INDEX idx_sessions_user_started ON testing_sessions(user_id, started_at);
CREATE INDEX idx_predictions_confidence ON predictions(confidence_score DESC);
```

#### Caching Strategy
```python
class CacheService:
    """In-memory caching for frequently accessed data"""

    def __init__(self):
        self.cache = {}
        self.ttl = 3600  # 1 hour

    def get(self, key):
        """Get from cache if not expired"""
        if key in self.cache:
            value, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl:
                return value
            else:
                del self.cache[key]
        return None

    def set(self, key, value):
        """Set cache with timestamp"""
        self.cache[key] = (value, time.time())

# Usage
cache = CacheService()

def get_predictions(ticket_key):
    # Check cache first
    cached = cache.get(f'predictions:{ticket_key}')
    if cached:
        return cached

    # Generate predictions
    predictions = prediction_service.predict(ticket)

    # Cache for 1 hour
    cache.set(f'predictions:{ticket_key}', predictions)

    return predictions
```

#### Async Operations
```python
import asyncio
import aiohttp

async def fetch_multiple_tickets(ticket_keys):
    """Fetch multiple tickets concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_ticket(session, key) for key in ticket_keys]
        return await asyncio.gather(*tasks)

async def fetch_ticket(session, ticket_key):
    url = f'{JIRA_BASE}/rest/api/3/issue/{ticket_key}'
    async with session.get(url, auth=auth) as response:
        return await response.json()
```

---

## 10. Error Handling

### 10.1 Error Categories

1. **User Errors** (4xx) - Invalid input, missing data
2. **System Errors** (5xx) - Database errors, crashes
3. **Integration Errors** - External API failures
4. **Data Errors** - Corrupt data, validation failures

### 10.2 Error Handling Strategy

```python
class ATLASError(Exception):
    """Base exception for ATLAS errors"""
    def __init__(self, message, code, details=None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(self.message)

class TicketNotFoundError(ATLASError):
    """Ticket not found in database or JIRA"""
    def __init__(self, ticket_key):
        super().__init__(
            message=f'Ticket {ticket_key} not found',
            code='TICKET_NOT_FOUND',
            details={'ticket_key': ticket_key}
        )

class PredictionServiceError(ATLASError):
    """Prediction service failed"""
    def __init__(self, reason):
        super().__init__(
            message=f'Prediction service failed: {reason}',
            code='PREDICTION_FAILED',
            details={'reason': reason}
        )

# Error handler
@app.errorhandler(ATLASError)
def handle_atlas_error(error):
    response = {
        'error': {
            'code': error.code,
            'message': error.message,
            'details': error.details
        },
        'meta': {
            'timestamp': datetime.utcnow().isoformat()
        }
    }
    return jsonify(response), 400

@app.errorhandler(Exception)
def handle_generic_error(error):
    logger.exception('Unhandled exception')
    response = {
        'error': {
            'code': 'INTERNAL_ERROR',
            'message': 'An unexpected error occurred'
        }
    }
    return jsonify(response), 500
```

---

## 11. Testing Strategy

### 11.1 Test Pyramid

```
         /\
        /  \  E2E Tests (5%)
       /────\
      /      \  Integration Tests (25%)
     /────────\
    /          \  Unit Tests (70%)
   /────────────\
```

### 11.2 Unit Tests

```python
# tests/test_prediction_service.py

import pytest
from services.prediction_service import PredictionService

class TestPredictionService:
    @pytest.fixture
    def service(self):
        return PredictionService()

    def test_predict_returns_top_5(self, service):
        ticket = {
            'summary': 'Update MHIS form',
            'description': 'Add eligibility field',
            'components': ['MHIS']
        }

        result = service.predict(ticket, top_k=5)

        assert len(result['predictions']) == 5
        assert all(p['confidence'] > 0 for p in result['predictions'])

    def test_blend_predictions_weights_correctly(self, service):
        neural = [{'scenario_name': 'Test A', 'confidence': 0.9}]
        similarity = [{'scenario_name': 'Test A', 'confidence': 0.8}]

        blended = service._blend_predictions(neural, similarity, 0.7, 0.3)

        # Expected: 0.9 * 0.7 + 0.8 * 0.3 = 0.87
        assert blended[0]['confidence'] == pytest.approx(0.87, rel=0.01)
```

### 11.3 Integration Tests

```python
# tests/test_api_integration.py

import pytest
from app import app

class TestAPIIntegration:
    @pytest.fixture
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            yield client

    def test_analyze_ticket_endpoint(self, client):
        response = client.post('/api/atlas/analyze', json={
            'ticket_key': 'WRKA-1234'
        })

        assert response.status_code == 200
        data = response.json
        assert 'components' in data
        assert 'scenario_types' in data
```

---

## 12. Deployment

### 12.1 Local Deployment

```bash
# 1. Clone repository
git clone https://github.com/your-org/ATLAS.git
cd ATLAS

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env
# Edit .env with your JIRA credentials

# 5. Initialize database
python build_database.py

# 6. Run application
python app.py

# 7. Open browser
open http://localhost:5000
```

### 12.2 Configuration

```python
# config/settings.py

SETTINGS = {
    'app': {
        'debug': os.getenv('FLASK_ENV') == 'development',
        'host': '127.0.0.1',
        'port': 5000
    },
    'database': {
        'path': './tar_testing.db',
        'backup_enabled': True,
        'backup_dir': './backups'
    },
    'jira': {
        'url': os.getenv('JIRA_INSTANCE_URL'),
        'sync_frequency': 'daily'
    }
}
```

---

## Appendices

### A. API Quick Reference

See section 5 for full API documentation.

### B. Database Schema Quick Reference

See section 3 for full schema.

### C. Related Documents

- Product Requirements Documents: `/docs/specifications/prds/`
- Architecture Documentation: `/docs/development/architecture/`
- User Documentation: `/docs/README.md`

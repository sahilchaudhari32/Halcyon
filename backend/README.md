# Halcyon — Backend

Production-ready **FastAPI** backend for AI-powered log analysis.  
Accepts raw log files, routes them through an intelligent multi-tier LLM pipeline, and stores every incident + audit decision in a local SQLite database.

---

## Quick Start

```bash
cd backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Copy and fill in your environment variables
cp .env.example .env
# → add your GROQ_API_KEY at minimum

# 3. Start the server
uvicorn app:app --reload

# Server runs at: http://127.0.0.1:8000
# API docs at:    http://127.0.0.1:8000/docs
```

---

## Folder Structure

```
backend/
│
├── app.py              # FastAPI app factory, lifespan, CORS, global error handler
├── routes.py           # All /api/* endpoints (APIRouter)
├── ai.py               # AI analysis engine — cascadeflow routing + Groq SDK
├── cascadeflow.py      # Local stub: CascadeAgent + ModelConfig (draft→verify routing)
├── memory.py           # Hindsight integration — semantic memory recall & retain
├── database.py         # SQLAlchemy models + async engine + session factory
├── schemas.py          # Pydantic request/response models for all endpoints
├── config.py           # Settings via pydantic-settings (reads .env)
├── utils.py            # Log parsing, file validation, similarity detection
│
├── data/
│   ├── generate.py     # Script to generate synthetic incidents.json dataset
│   ├── loader.py       # Loader for incidents.json used to seed Hindsight memory
│   └── incidents.json  # 30 synthetic historical incidents (5 failure families)
│
├── sample_logs/        # Pre-built .log files for demo & testing
│   ├── auth_breach_attempt.log
│   ├── db_connection_timeout.log
│   ├── disk_full.log
│   ├── k8s_crashloop.log
│   └── memory_leak.log
│
├── uploads/            # Uploaded log files are saved here (auto-created)
├── halcyon.db          # SQLite database (auto-created on first run)
├── requirements.txt    # Python dependencies
├── .env.example        # Template for environment variables
└── .env                # Your local secrets (git-ignored)
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Web Framework** | [FastAPI](https://fastapi.tiangolo.com/) | Async REST API, auto-generated OpenAPI docs |
| **ASGI Server** | [Uvicorn](https://www.uvicorn.org/) | High-performance async server |
| **Database ORM** | [SQLAlchemy 2.x](https://docs.sqlalchemy.org/) | Async ORM with full type support |
| **Database Driver** | [aiosqlite](https://github.com/omnilib/aiosqlite) | Non-blocking SQLite adapter |
| **Data Validation** | [Pydantic v2](https://docs.pydantic.dev/) | Request/response schema validation |
| **Configuration** | [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) | `.env` loading with type coercion |
| **AI / LLM** | [Groq SDK](https://console.groq.com/docs/quickstart) | LLM inference (llama-3.3-70b, qwen3-32b) |
| **Model Routing** | `cascadeflow.py` (local stub) | Draft → Verifier cost-optimization routing |
| **Agent Memory** | [Hindsight by Vectorize](https://vectorize.io/hindsight) | Semantic long-term incident memory |
| **File Upload** | python-multipart + aiofiles | Async multipart form handling |
| **HTTP Client** | httpx | Async HTTP for internal/external calls |

---

## File-by-File Explanation

### `app.py` — Application Entry Point
Creates the FastAPI application instance. Responsibilities:
- Configures **CORS** to allow requests from `localhost:3000` / `localhost:5173` (React/Vite frontends)
- Runs `init_db()` and `init_memory()` on startup via the **lifespan** context manager
- Registers a **global exception handler** that catches unhandled errors and returns a clean JSON 500
- Mounts the main `APIRouter` from `routes.py`

### `routes.py` — API Endpoints
All routes are prefixed with `/api`. Contains:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Liveness check — verifies API, DB, and memory status |
| `/api/upload-log` | POST | Upload a `.log`/`.txt` file, returns preview + content |
| `/api/incidents` | POST | **Core endpoint** — submit log for AI analysis |
| `/api/history` | GET | Paginated list of saved incidents (search, filter by severity) |
| `/api/history/{id}` | GET | Fetch a single incident by ID |
| `/api/history/{id}` | PATCH | Update incident title, severity, tags |
| `/api/history/{id}` | DELETE | Delete an incident |
| `/api/history/{id}/solve` | POST | Mark incident as solved with solution text |
| `/api/decisions` | GET | Paginated decision audit log (routing + cost history) |
| `/api/dashboard/stats` | GET | Aggregated analytics: counts, severity breakdown, cost totals |
| `/api/samples` | GET | List available sample log files |
| `/api/samples/{name}` | GET | Load a specific sample log by filename stem |

### `ai.py` — AI Analysis Engine
The brain of the backend. Handles the full analysis pipeline:

1. **Compliance Gate** — sensitive logs are routed directly to the compliance model, bypassing cascadeflow
2. **Known Pattern Matching** — instant, zero-cost responses for 5 predefined incident signatures (DB pool, MongoDB OOM, CPU spike, disk full, k8s crashloop)
3. **CascadeFlow Routing** — if `_cascade_agent` is initialized, calls `CascadeAgent.run()` for draft→verify routing
4. **Direct Groq Fallback** — if cascadeflow is unavailable, calls Groq SDK directly
5. **Mock Fallback** — if no API key is set, returns deterministic mock data based on log severity keywords

Returns both an `AIAnalysisResult` and a `RoutingMetadata` dataclass containing cost, latency, and the full decision trace.

### `cascadeflow.py` — Model Routing Stub
Local implementation of a draft-then-verify routing agent (since the `cascadeflow` PyPI package is not available).

**How it works:**
```
Log content
    │
    ▼
[Drafter] qwen/qwen3-32b (cheap)
    │
    ▼
Quality Score (0.0 – 1.0)
  ├─ score ≥ 0.75 → ✅ return draft (saves ~90% cost)
  └─ score < 0.75 → ⬆️ escalate to Verifier
                          │
                          ▼
                    [Verifier] llama-3.3-70b (capable)
                          │
                          ▼
                       Return result
```

Quality scoring checks: valid JSON, all 6 required fields present, valid severity value, confidence score in range.

### `memory.py` — Hindsight Integration
Wraps the Hindsight client for semantic incident memory:
- **`recall_similar(log_content)`** — searches the memory bank for past incidents semantically similar to the given log
- **`retain_resolution(…)`** — stores a resolved incident into memory so future similar logs can be resolved instantly
- **`init_memory()`** — called on startup; seeds the Hindsight bank from `data/incidents.json`
- Gracefully degrades to disabled if `hindsight-client` is not installed or the service is unreachable

### `database.py` — ORM Models

| Table | Description |
|---|---|
| `incidents` | Core incident record: log, AI analysis results, severity, resolution status |
| `decision_logs` | Audit trail: which model was used, cost, latency, memory hit/miss, escalation |
| `incident_tags` | Free-form tags associated with each incident |
| `similar_incident_refs` | Links between similar incidents with similarity scores |

### `schemas.py` — Pydantic Schemas
Defines all request and response shapes:
- `IncidentSubmitRequest` / `IncidentSubmitResponse` — analysis pipeline I/O
- `AIAnalysisResult` — structured LLM output (root_cause, severity, fix_suggestion, etc.)
- `RoutingInfo` — model routing metadata (model used, tier, cost, latency)
- `MemoryInfo` — Hindsight lookup result (hit/miss, score)
- `IncidentResponse` / `IncidentListResponse` — CRUD response shapes
- `DecisionLogSchema` / `DecisionLogListResponse` — audit log pagination
- `HealthResponse`, `MessageResponse`, `ErrorResponse` — utility schemas

### `config.py` — Settings
All configuration is loaded from `.env` via pydantic-settings:

| Variable | Default | Description |
|---|---|---|
| `GROQ_API_KEY` | _(required)_ | Groq API key for LLM inference |
| `DRAFT_MODEL` | `qwen/qwen3-32b` | Cheap drafter model |
| `VERIFIER_MODEL` | `llama-3.3-70b-versatile` | Capable verifier model |
| `COMPLIANCE_MODEL` | `local/llama-3.1-8b` | Model for sensitive data |
| `CASCADEFLOW_ENABLED` | `true` | Enable/disable routing |
| `CASCADEFLOW_MODE` | `observe` | Routing mode |
| `CASCADEFLOW_BUDGET` | `0.50` | Max cost budget per request |
| `HINDSIGHT_ENABLED` | `true` | Enable semantic memory |
| `HINDSIGHT_URL` | `http://localhost:8888` | Hindsight service URL |
| `HINDSIGHT_BANK_ID` | `halcyon-incidents` | Memory bank identifier |
| `MEMORY_MATCH_THRESHOLD` | `0.80` | Min score to trigger fast-path recall |
| `DATABASE_URL` | `sqlite+aiosqlite:///./halcyon.db` | Database connection string |
| `MAX_UPLOAD_SIZE_MB` | `10` | Max log file size |
| `ALLOWED_EXTENSIONS` | `.log,.txt,.out,.err` | Accepted file types |

### `utils.py` — Utilities
- `validate_log_file(filename, size)` — enforces extension and size limits
- `parse_log_content(content)` — splits into lines, returns preview + count
- `sanitize_log_content(content)` — removes null bytes, normalizes line endings
- `save_uploaded_file(bytes, filename)` — saves to `uploads/` with MD5-based unique name
- `extract_error_fingerprints(log)` — keyword-based categorization (database, memory, network, auth, disk, crash)
- `compute_similarity(fp_a, fp_b)` — cosine-style similarity between two fingerprint dicts
- `find_similar_incidents(log, incidents)` — returns top-K similar incidents by fingerprint score

---

## Analysis Workflow (Full Request Lifecycle)

```
POST /api/incidents
{
  "alert_title": "Payment service down",
  "log_content": "...",
  "sensitive": false
}

         │
         ▼
┌─────────────────────┐
│  1. Memory Recall   │  ← Hindsight searches for similar past incidents
└─────────────────────┘
         │
    match_score ≥ 0.80?
    ├── YES → Fast Path: format memory resolution with cheap model (free, <100ms)
    └── NO  ↓
         │
┌─────────────────────┐
│  2. AI Analysis     │
│                     │
│  sensitive=true?    │  → Compliance model (local/llama-3.1-8b)
│  known pattern?     │  → Instant match, zero cost
│  cascadeflow on?    │  → Draft (qwen3-32b) → score → maybe Verifier
│  fallback?          │  → Direct Groq call
│  no API key?        │  → Mock response
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  3. Persist to DB   │  ← Save Incident row with full AI analysis
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  4. Audit Log       │  ← Save DecisionLog: model, cost, latency, memory hit
└─────────────────────┘
         │
         ▼
Response: analysis + routing metadata + memory info
```

---

## Sample Logs

Five ready-to-use log files are included in `sample_logs/`:

| File | Scenario | Expected Severity |
|---|---|---|
| `db_connection_timeout.log` | PostgreSQL connection pool exhausted | CRITICAL |
| `auth_breach_attempt.log` | Brute force / credential stuffing attack | HIGH |
| `memory_leak.log` | Container OOM kill from heap leak | HIGH |
| `disk_full.log` | Filesystem 100% — writes failing | HIGH |
| `k8s_crashloop.log` | Kubernetes pod in CrashLoopBackOff | CRITICAL |

---

## Database

SQLite (`halcyon.db`) is auto-created on first startup. Tables are created idempotently via `Base.metadata.create_all`.

To inspect the database directly:
```bash
# Using sqlite3 CLI
sqlite3 halcyon.db

sqlite> .tables
decision_logs  incident_tags  incidents  similar_incident_refs

sqlite> SELECT id, title, severity, is_solved FROM incidents LIMIT 10;
```

---

## API Documentation

Interactive docs are available at runtime:
- **Swagger UI** → `http://127.0.0.1:8000/docs`
- **ReDoc** → `http://127.0.0.1:8000/redoc`

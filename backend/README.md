# Hackathon Backend API

A clean, production-ready, and lightweight REST API built with **FastAPI**, **SQLite**, and **Uvicorn**, packaged using **Astral `uv`**.

---

## 🚀 Features

- **Fast & Modern**: Built on FastAPI with async support and automatic OpenAPI documentation.
- **Data & Records Hub API**: Persistent SQLite endpoints for tracking pipeline tasks, categories, statuses, and logs.
- **Live KPI Stats**: Auto-computed metrics for dashboard overview (active jobs, accuracy, task throughput).
- **AI Playground Inference**: Structured AI prompt evaluation endpoint ready for live model integration.
- **Hackathon Demo Seeding**: Auto-populates realistic pipeline records on startup if the database is empty.
- **Render-Optimized CORS**: Ready out-of-the-box for frontends hosted on Render (`https://codeforge-0j8e.onrender.com`), preview domains (`*.onrender.com`), and local development.
- **Health Check**: Dedicated `GET /health` endpoint returning `{"status":"ok"}`.
- **Package Management with `uv`**: Ultra-fast virtual environment and dependency management.

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI app, lifespan setup, and CORS configuration
│   ├── database.py         # SQLAlchemy SQLite engine, session, and seed_initial_data()
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py       # Pydantic Settings loaded from .env
│   ├── models/
│   │   ├── __init__.py
│   │   ├── item.py         # Basic item model
│   │   └── record.py       # Pipeline ActivityRecord database model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── health.py       # Health check response schema
│   │   ├── item.py         # Item request/response schemas
│   │   ├── record.py       # ActivityRecord CRUD schemas
│   │   ├── stats.py        # Dashboard stats schemas
│   │   └── ai.py           # AI generation schemas
│   └── routers/
│       ├── __init__.py
│       ├── health.py       # GET /health
│       ├── records.py      # CRUD for /api/v1/records
│       ├── stats.py        # GET /api/v1/stats
│       ├── ai.py           # POST /api/v1/ai/generate
│       └── items.py        # CRUD for /api/v1/items
├── tests/
│   └── test_api.py         # Automated pytest test suite
├── .env.example            # Sample environment variables
├── .gitignore              # Git ignore rules for virtual environments & SQLite
├── pyproject.toml          # Project configuration for uv
├── requirements.txt        # Pinned requirements for production/Render deployment
└── README.md               # Setup and deployment documentation
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | **Required health check** (returns `{"status":"ok"}`) |
| `GET` | `/` | API status & discovery links |
| `GET` | `/docs` | Interactive Swagger API documentation |
| `GET` | `/redoc` | Interactive ReDoc API documentation |
| `GET` | `/api/v1/records` | List pipeline activity records (supports `category`, `status`, `search`) |
| `POST` | `/api/v1/records` | Create a new pipeline activity record |
| `GET` | `/api/v1/records/{id}` | Get record details by ID |
| `PUT` | `/api/v1/records/{id}` | Update record status, details, or metadata |
| `DELETE` | `/api/v1/records/{id}` | Delete record by ID |
| `GET` | `/api/v1/stats` | Live KPI dashboard metrics calculated from database |
| `POST` | `/api/v1/ai/generate` | AI playground inference engine |
| `GET` | `/api/v1/items` | Item list endpoint |
| `POST` | `/api/v1/items` | Item create endpoint |

---

## 🛠️ Local Setup with `uv`

### Prerequisites

Install `uv`:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 1. Install Dependencies
```bash
cd backend
cp .env.example .env
uv sync
```

### 2. Run the Development Server
```bash
# Option A: Local runner with hot reload
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Option B: Run using Render command format
PORT=8000 uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Visit the interactive API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

### 3. Run Tests
```bash
uv run pytest -v
```

---

## 🌐 Deploying to Render

1. Connect repository on [Render](https://dashboard.render.com).
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `pip install -r requirements.txt` *(or `curl -LsSf https://astral.sh/uv/install.sh | sh && uv pip install -r requirements.txt`)*
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set **Health Check Path**: `/health`

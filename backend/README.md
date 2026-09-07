# Hackathon Backend API

A clean, production-ready, and lightweight REST API built with **FastAPI**, **SQLite**, and **Uvicorn**, packaged using **Astral `uv`**.

---

## 🚀 Features

- **Fast & Modern**: Built on FastAPI with async support and automatic OpenAPI documentation.
- **Google OAuth Authentication**: Full support for Google Identity Services / One-Tap ID token verification and OAuth2 callback redirect flows with JWT user sessions.
- **Data & Records Hub API**: Persistent SQLite endpoints for tracking pipeline tasks, categories, statuses, and logs.
- **Live KPI Stats**: Auto-computed metrics for dashboard overview (active jobs, accuracy, task throughput).
- **AI Playground Inference**: Blazing-fast Groq LLM inference (`openai/gpt-oss-120b`).
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
│   │   ├── security.py     # JWT token generation, decode, and get_current_user dependency
│   │   └── config.py       # Pydantic Settings loaded from .env and client_secret*.json
│   ├── models/
│   │   ├── __init__.py
│   │   ├── item.py         # Basic item model
│   │   ├── user.py         # Google OAuth User database model
│   │   └── record.py       # Pipeline ActivityRecord database model
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py         # Google auth & JWT schemas
│   │   ├── health.py       # Health check response schema
│   │   ├── item.py         # Item request/response schemas
│   │   ├── record.py       # ActivityRecord CRUD schemas
│   │   ├── stats.py        # Dashboard stats schemas
│   │   └── ai.py           # AI generation schemas
│   └── routers/
│       ├── __init__.py
│       ├── health.py       # GET /health
│       ├── auth.py         # Google OAuth & session endpoints
│       ├── records.py      # CRUD for /api/v1/records
│       ├── stats.py        # GET /api/v1/stats
│       ├── ai.py           # POST /api/v1/ai/generate (Groq)
│       └── items.py        # CRUD for /api/v1/items
├── tests/
│   └── test_api.py         # Automated pytest test suite (11 passing tests)
├── .env.example            # Sample environment variables
├── .gitignore              # Git ignore rules for virtual environments, secrets & SQLite
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
| `GET` | `/api/v1/auth/google/config` | Returns Google Client ID & auth config for frontend |
| `GET` | `/api/v1/auth/google/url` | Generates standard Google OAuth2 consent screen URL |
| `POST` | `/api/v1/auth/google/verify` | Validates Google One-Tap ID token and returns app JWT |
| `GET` | `/api/v1/auth/google/callback`| OAuth2 authorization code callback and frontend redirect |
| `GET` | `/api/v1/auth/me` | Returns profile of current authenticated user (Bearer JWT) |
| `GET` | `/api/v1/records` | List pipeline activity records (supports `category`, `status`, `search`) |
| `POST` | `/api/v1/records` | Create a new pipeline activity record |
| `GET` | `/api/v1/records/{id}` | Get record details by ID |
| `PUT` | `/api/v1/records/{id}` | Update record status, details, or metadata |
| `DELETE` | `/api/v1/records/{id}` | Delete record by ID |
| `GET` | `/api/v1/stats` | Live KPI dashboard metrics calculated from database |
| `POST` | `/api/v1/ai/generate` | AI playground inference engine (powered by Groq) |
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
6. Add **Environment Variables**:
   - `GROQ_API_KEY`: Your Groq API key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret

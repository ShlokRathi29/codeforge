import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# In-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


def test_health_check(client):
    """Test required GET /health endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_root_endpoint(client):
    """Test GET / endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "/health" in data["health"]


def test_cors_preflight_localhost(client):
    """Test CORS preflight for local frontend development."""
    response = client.options(
        "/health",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_cors_preflight_render_domain(client):
    """Test CORS preflight for Render-hosted frontend."""
    response = client.options(
        "/api/v1/records",
        headers={
            "Origin": "https://codeforge-0j8e.onrender.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://codeforge-0j8e.onrender.com"


def test_records_crud(client):
    """Test pipeline activity records endpoints."""
    # 1. Create record
    res = client.post(
        "/api/v1/records",
        json={
            "title": "Quantum RAG Embedder",
            "category": "AI / ML",
            "status": "in_progress",
            "author": "Hackathon Lead",
            "details": "Fine-tuning vector projections",
        },
    )
    assert res.status_code == 201
    record = res.json()
    assert record["title"] == "Quantum RAG Embedder"
    rec_id = record["id"]

    # 2. List records with category filter
    res = client.get("/api/v1/records?category=AI%20/%20ML")
    assert res.status_code == 200
    records = res.json()
    assert any(r["id"] == rec_id for r in records)

    # 3. Update record
    res = client.put(f"/api/v1/records/{rec_id}", json={"status": "completed"})
    assert res.status_code == 200
    assert res.json()["status"] == "completed"

    # 4. Get record
    res = client.get(f"/api/v1/records/{rec_id}")
    assert res.status_code == 200
    assert res.json()["id"] == rec_id

    # 5. Delete record
    res = client.delete(f"/api/v1/records/{rec_id}")
    assert res.status_code == 200

    # 6. Verify 404
    res = client.get(f"/api/v1/records/{rec_id}")
    assert res.status_code == 404


def test_dashboard_stats(client):
    """Test dynamic KPI stats calculation."""
    # Seed a record
    client.post(
        "/api/v1/records",
        json={
            "title": "Benchmark Test Run",
            "category": "Database",
            "status": "completed",
            "author": "Tester",
        },
    )
    res = client.get("/api/v1/stats")
    assert res.status_code == 200
    data = res.json()
    assert "stats" in data
    assert len(data["stats"]) == 4
    assert data["total_records"] >= 1


def test_ai_playground_generation(client):
    """Test AI playground generation endpoint."""
    res = client.post(
        "/api/v1/ai/generate",
        json={
            "prompt": "Evaluate code scalability for high throughput",
            "temperature": 0.8,
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert len(data["text"]) > 10
    assert "model" in data


def test_google_auth_config(client):
    """Test retrieving Google OAuth client configuration."""
    res = client.get("/api/v1/auth/google/config")
    assert res.status_code == 200
    data = res.json()
    assert "client_id" in data
    assert data["client_id"] is not None
    assert "1049306881558" in data["client_id"]


def test_google_auth_url(client):
    """Test generating Google OAuth redirect URL."""
    res = client.get("/api/v1/auth/google/url")
    assert res.status_code == 200
    data = res.json()
    assert "accounts.google.com" in data["url"]
    assert "client_id=" in data["url"]


def test_auth_me_unauthorized(client):
    """Test accessing /me without token returns 401."""
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401


def test_auth_me_authenticated(client):
    """Test accessing /me with valid JWT token."""
    from app.core.security import create_access_token
    from app.models.user import User

    # Seed test user
    db = TestingSessionLocal()
    test_user = User(
        id="usr-test-123",
        google_id="google-sub-456",
        email="hackathon.user@example.com",
        name="Hackathon Developer",
    )
    db.add(test_user)
    db.commit()
    db.close()

    token = create_access_token(data={"sub": "usr-test-123", "email": "hackathon.user@example.com"})

    res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    user_data = res.json()
    assert user_data["email"] == "hackathon.user@example.com"
    assert user_data["name"] == "Hackathon Developer"

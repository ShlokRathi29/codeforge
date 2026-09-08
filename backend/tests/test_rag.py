import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_status_endpoint():
    res = client.get("/api/v1/ai/status")
    assert res.status_code == 200
    data = res.json()
    assert data["configured"] is True
    assert "Groq" in data["provider"]
    assert "Sarvam" in data["provider"]
    assert "providers" in data
    assert data["providers"]["groq"]["configured"] is True
    assert data["providers"]["sarvam"]["configured"] is True
    assert data["knowledge_base_count"] >= 5


def test_student_rag_query():
    payload = {
        "query": "How can I get better sleep during finals week?",
        "student_name": "Test Student",
        "recent_context": {"mood": "neutral", "stress_level": 3, "sleep_quality": 2},
    }
    res = client.post("/api/v1/ai/rag/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["answer"]) > 10
    assert "references" in data
    assert len(data["references"]) > 0


def test_student_rag_indic_routing():
    payload = {
        "query": "mujhe bohot tension ho rahi hai exams ki",
        "student_name": "Rohan",
        "provider": "auto",
    }
    res = client.post("/api/v1/ai/rag/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["answer"]) > 10
    assert "Sarvam" in data["provider"]


def test_counselor_suggestion_endpoint():
    payload = {
        "student_name": "Sarah Jenkins",
        "streak_days": 3,
        "stress_level": 5,
        "affected_dates": "Oct 12 – Oct 14",
    }
    res = client.post("/api/v1/ai/counselor-suggestion", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["suggestion"]) > 20
    assert "Sarah" in data["suggestion"]


def test_ai_test_handshake():
    res = client.post("/api/v1/ai/test")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "providers" in data
    assert "groq" in data["providers"]
    assert "sarvam" in data["providers"]
    assert data["providers"]["groq"]["status"] == "ok"
    assert data["providers"]["sarvam"]["status"] == "ok"

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import get_settings

settings = get_settings()

# SQLite requires check_same_thread=False when used across multiple FastAPI worker threads
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields an independent database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_initial_data(db: Session) -> None:
    """Seed initial demonstration records for hackathon if database is empty."""
    from app.models.record import ActivityRecord

    if db.query(ActivityRecord).first() is None:
        initial_records = [
            ActivityRecord(
                id="rec-1",
                title="Model Pipeline Inference",
                category="AI / ML",
                status="completed",
                author="Alex Dev",
                details="Executed distributed LLM batch generation with 99.4% accuracy.",
            ),
            ActivityRecord(
                id="rec-2",
                title="Data Ingestion Batch #84",
                category="Database",
                status="in_progress",
                author="System Worker",
                details="Streaming 50,000 JSON entities into SQLite index.",
            ),
            ActivityRecord(
                id="rec-3",
                title="Semantic Vector Re-indexing",
                category="Search Engine",
                status="pending",
                author="Sam Architect",
                details="Refreshing vector embeddings for document similarity queries.",
            ),
            ActivityRecord(
                id="rec-4",
                title="OAuth Provider Sync Check",
                category="Auth & Security",
                status="completed",
                author="DevOps Bot",
                details="Token rotation validation passed across all authentication gateways.",
            ),
            ActivityRecord(
                id="rec-5",
                title="Real-time RAG Knowledge Query",
                category="AI / ML",
                status="completed",
                author="AI Engine",
                details="Retrieved context chunks and generated summarized executive answer.",
            ),
        ]
        db.add_all(initial_records)
        db.commit()


def init_db() -> None:
    """Initialize database tables and seed initial data on application startup."""
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_initial_data(db)

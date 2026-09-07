from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, DateTime, String, Text
from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def generate_record_id() -> str:
    return f"rec-{uuid.uuid4().hex[:8]}"


class ActivityRecord(Base):
    """Database model for pipeline tasks and activity records."""

    __tablename__ = "records"

    id = Column(String(50), primary_key=True, default=generate_record_id, index=True)
    title = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, default="AI / ML", index=True)
    status = Column(String(50), nullable=False, default="pending", index=True)  # completed, in_progress, pending, failed
    author = Column(String(100), nullable=False, default="System Worker")
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

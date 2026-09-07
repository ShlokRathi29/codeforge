from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class RecordBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Record / task title")
    category: str = Field(default="AI / ML", description="Category (e.g. AI / ML, Database, Search Engine, Auth & Security)")
    status: str = Field(default="pending", description="Status: completed | in_progress | pending | failed")
    author: str = Field(default="System Worker", description="Creator or worker name")
    details: Optional[str] = Field(None, description="Optional payload or execution logs")


class RecordCreate(RecordBase):
    pass


class RecordUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[str] = None
    status: Optional[str] = None
    author: Optional[str] = None
    details: Optional[str] = None


class RecordResponse(RecordBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

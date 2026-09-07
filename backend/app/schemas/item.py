from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class ItemBase(BaseModel):
    """Base item schema."""

    title: str = Field(..., min_length=1, max_length=255, description="Item title", examples=["Build hackathon demo"])
    description: Optional[str] = Field(None, description="Detailed item description", examples=["Wire backend API to frontend"])
    is_completed: bool = Field(default=False, description="Completion status")


class ItemCreate(ItemBase):
    """Payload schema for creating a new item."""

    pass


class ItemUpdate(BaseModel):
    """Payload schema for updating an existing item."""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class ItemResponse(ItemBase):
    """Response schema representing an item."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str

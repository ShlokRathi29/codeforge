from typing import List, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., description="user | assistant | system")
    content: str = Field(..., description="Message content")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt or instruction")
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    system_prompt: Optional[str] = Field(None, description="Optional system instructions")
    conversation: Optional[List[ChatMessage]] = Field(default=[], description="Past conversation turns")


class GenerateResponse(BaseModel):
    text: str
    model: str = "mock-ai-engine"
    tokens_used: int = 42
    status: str = "success"

from typing import Any, Dict, List, Optional
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


class RAGReference(BaseModel):
    title: str
    category: str
    source: str


class RAGQueryRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Student wellness question or query")
    student_name: Optional[str] = Field("Student", description="Name of student")
    recent_context: Optional[Dict[str, Any]] = Field(None, description="Confidential non-clinical context")
    provider: Optional[str] = Field("auto", description="auto | groq | sarvam")


class RAGQueryResponse(BaseModel):
    answer: str
    model: str
    provider: str
    latency_ms: int = 0
    references: List[RAGReference] = []
    status: str = "live"


class CounselorSuggestionRequest(BaseModel):
    student_name: str = Field(..., description="Name of student")
    streak_days: int = Field(default=3, ge=1, le=14)
    stress_level: int = Field(default=5, ge=1, le=5)
    affected_dates: str = Field(default="Recent consecutive days")
    provider: Optional[str] = Field("auto", description="auto | groq | sarvam")


class CounselorSuggestionResponse(BaseModel):
    suggestion: str
    model: str
    provider: str
    status: str = "live"


class AIProviderDetail(BaseModel):
    name: str
    configured: bool
    model: str
    type: str


class AIStatusResponse(BaseModel):
    configured: bool
    provider: str
    active_strategy: str = "auto"
    knowledge_base_count: int
    categories: List[str]
    providers: Dict[str, Any] = {}

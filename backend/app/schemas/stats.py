from typing import List, Literal, Optional
from pydantic import BaseModel


class StatItem(BaseModel):
    id: str
    label: str
    value: str
    change: Optional[str] = None
    trend: Optional[Literal["up", "down", "neutral"]] = "up"
    iconName: Optional[str] = None


class DashboardStatsResponse(BaseModel):
    stats: List[StatItem]
    total_records: int
    completed_records: int
    in_progress_records: int
    pending_records: int
    failed_records: int

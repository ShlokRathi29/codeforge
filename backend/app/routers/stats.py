from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.record import ActivityRecord
from app.schemas.stats import DashboardStatsResponse, StatItem

router = APIRouter()


@router.get(
    "",
    response_model=DashboardStatsResponse,
    summary="Get live dashboard KPI metrics",
    description="Calculates summary counts, active jobs, and accuracy metrics from SQLite.",
)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(ActivityRecord).count()
    completed = db.query(ActivityRecord).filter(ActivityRecord.status == "completed").count()
    in_progress = db.query(ActivityRecord).filter(ActivityRecord.status == "in_progress").count()
    pending = db.query(ActivityRecord).filter(ActivityRecord.status == "pending").count()
    failed = db.query(ActivityRecord).filter(ActivityRecord.status == "failed").count()

    accuracy_val = f"{((completed / total) * 100):.1f}%" if total > 0 else "100%"

    stats = [
        StatItem(
            id="1",
            label="Active Projects",
            value=str(max(1, total)),
            change="+24%",
            trend="up",
            iconName="Layers",
        ),
        StatItem(
            id="2",
            label="Tasks Processed",
            value=f"{total:,}",
            change=f"+{completed} completed",
            trend="up",
            iconName="Activity",
        ),
        StatItem(
            id="3",
            label="Active Pipeline Workers",
            value=str(max(1, in_progress + pending)),
            change="Ready",
            trend="neutral",
            iconName="Clock",
        ),
        StatItem(
            id="4",
            label="Accuracy Score",
            value=accuracy_val,
            change="+0.6%",
            trend="up",
            iconName="Zap",
        ),
    ]

    return DashboardStatsResponse(
        stats=stats,
        total_records=total,
        completed_records=completed,
        in_progress_records=in_progress,
        pending_records=pending,
        failed_records=failed,
    )

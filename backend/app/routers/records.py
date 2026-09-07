from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.record import ActivityRecord
from app.schemas.item import MessageResponse
from app.schemas.record import RecordCreate, RecordResponse, RecordUpdate

router = APIRouter()


@router.get(
    "",
    response_model=List[RecordResponse],
    summary="List all pipeline activity records",
    description="Filter by category, search text, or execution status.",
)
def list_records(
    category: Optional[str] = Query(None, description="Category filter (e.g. AI / ML, Database)"),
    status_filter: Optional[str] = Query(None, alias="status", description="Status filter: completed, in_progress, pending, failed"),
    search: Optional[str] = Query(None, description="Search in title, details, or author"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(ActivityRecord)
    if category and category.lower() != "all":
        query = query.filter(ActivityRecord.category == category)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(ActivityRecord.status == status_filter)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (ActivityRecord.title.ilike(search_fmt))
            | (ActivityRecord.author.ilike(search_fmt))
            | (ActivityRecord.details.ilike(search_fmt))
        )
    return query.order_by(ActivityRecord.created_at.desc()).offset(skip).limit(limit).all()


@router.post(
    "",
    response_model=RecordResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new task / activity record",
)
def create_record(payload: RecordCreate, db: Session = Depends(get_db)):
    record = ActivityRecord(
        title=payload.title,
        category=payload.category,
        status=payload.status,
        author=payload.author,
        details=payload.details,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get(
    "/{record_id}",
    response_model=RecordResponse,
    summary="Get single record details",
)
def get_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(ActivityRecord).filter(ActivityRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found",
        )
    return record


@router.put(
    "/{record_id}",
    response_model=RecordResponse,
    summary="Update an existing activity record",
)
def update_record(record_id: str, payload: RecordUpdate, db: Session = Depends(get_db)):
    record = db.query(ActivityRecord).filter(ActivityRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)
    return record


@router.delete(
    "/{record_id}",
    response_model=MessageResponse,
    summary="Delete a record",
)
def delete_record(record_id: str, db: Session = Depends(get_db)):
    record = db.query(ActivityRecord).filter(ActivityRecord.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found",
        )

    db.delete(record)
    db.commit()
    return MessageResponse(message=f"Record '{record_id}' deleted successfully")

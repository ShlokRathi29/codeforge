from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.item import Item
from app.schemas.item import ItemCreate, ItemResponse, ItemUpdate, MessageResponse

router = APIRouter()


@router.get(
    "",
    response_model=List[ItemResponse],
    summary="List all items",
    description="Retrieve a list of items with optional filtering and pagination.",
)
def list_items(
    search: Optional[str] = Query(None, description="Filter items by title substring"),
    is_completed: Optional[bool] = Query(None, description="Filter items by completion status"),
    skip: int = Query(0, ge=0, description="Pagination skip"),
    limit: int = Query(50, ge=1, le=100, description="Pagination limit"),
    db: Session = Depends(get_db),
):
    query = db.query(Item)
    if search:
        query = query.filter(Item.title.ilike(f"%{search}%"))
    if is_completed is not None:
        query = query.filter(Item.is_completed == is_completed)
    return query.order_by(Item.id.desc()).offset(skip).limit(limit).all()


@router.post(
    "",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new item",
)
def create_item(payload: ItemCreate, db: Session = Depends(get_db)):
    item = Item(
        title=payload.title,
        description=payload.description,
        is_completed=payload.is_completed,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get(
    "/{item_id}",
    response_model=ItemResponse,
    summary="Get item by ID",
)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found",
        )
    return item


@router.put(
    "/{item_id}",
    response_model=ItemResponse,
    summary="Update an existing item",
)
def update_item(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete(
    "/{item_id}",
    response_model=MessageResponse,
    summary="Delete an item",
)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item with ID {item_id} not found",
        )

    db.delete(item)
    db.commit()
    return MessageResponse(message=f"Item {item_id} successfully deleted")

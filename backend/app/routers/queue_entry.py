from uuid import UUID
from fastapi import APIRouter, Depends, status

from app.schemas.queue_entry import QueueEntryCreate, QueueEntryResponse
from app.services.queue_entry import QueueEntryService
from app.dependencies import get_queue_entry_service


router = APIRouter(
    prefix="/queue_entry",
    tags=["queue_entry"]
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=QueueEntryResponse
)
def create(
    payload: QueueEntryCreate,
    db: QueueEntryService = Depends(get_queue_entry_service)
):
    return db.create(payload)

@router.get(
    "/{queue_entry_id}",
    status_code=status.HTTP_200_OK,
    response_model=QueueEntryResponse
)
def get_by_id(
    queue_entry_id: UUID,
    db: QueueEntryService = Depends(get_queue_entry_service)
):
    return db.get_by_id(queue_entry_id)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[QueueEntryResponse]
)
def get_all_queue_entries(db: QueueEntryService = Depends(get_queue_entry_service)):
    return db.get_all_queue_entries()
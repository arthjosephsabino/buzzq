from uuid import UUID
from fastapi import APIRouter, Depends, Response, HTTPException, status

from app.schemas.queue import QueueCreate, QueueResponse
from app.dependencies import get_queue_service
from app.services.queue import QueueService


router = APIRouter(
    prefix="/queue",
    tags=["queue"]
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=QueueResponse
)
def create(
    payload: QueueCreate,
    db: QueueService = Depends(get_queue_service)
):
    return db.create(payload)

@router.get(
    "/{queue_id}",
    status_code=status.HTTP_200_OK,
    response_model=QueueResponse
)
def get_by_id(
    queue_id: UUID,
    db: QueueService = Depends(get_queue_service)
):
    return db.get_by_id(queue_id)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[QueueResponse]
)
def get_all_queues(
    db: QueueService = Depends(get_queue_service)
):
    return db.get_all_queues()

@router.get("/{queue_id}/qr")
def get_qr(
    queue_id: UUID, 
    db: QueueService = Depends(get_queue_service)
):
    qr = db.get_qr(queue_id)
    if qr is None:
        raise HTTPException(status_code=404, detail="QR code not found")
    return Response(content=qr, media_type="image/png")
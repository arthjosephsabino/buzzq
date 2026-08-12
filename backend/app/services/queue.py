from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.queue import QueueRepository
from app.models import Queue
from app.schemas.queue import QueueCreate


class QueueService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = QueueRepository(session)

    def create(self, queue: QueueCreate) -> Queue:
        if queue.name is None or queue.name == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Name is required."
            )
        if queue.organization_id is None or queue.organization_id == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Organization ID is required."
            )
        
        new_queue = Queue(
            organization_id=queue.organization_id,
            name=queue.name,
            ticket_prefix=queue.ticket_prefix
        )

        return self._repo.create(new_queue)

    def get_by_id(self, queue_id: UUID) -> Queue | None:
        return self._repo.get_by_id(queue_id)

    def get_all_queues(self) -> list[Queue]:
        return self._repo.get_all_queues()
        
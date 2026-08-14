from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.queue_entry import QueueEntryRepository
from app.schemas.queue_entry import QueueEntryCreate
from app.models import QueueEntry
from app.repositories.queue import QueueRepository

class QueueEntryService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._entry_repo = QueueEntryRepository(session)
        self._queue_repo = QueueRepository(session)

    def create(self, queue_entry: QueueEntryCreate) -> QueueEntry:
        if queue_entry.client_id is None or queue_entry.client_id == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Client ID is required."
            )
        if queue_entry.queue_id is None or queue_entry.queue_id == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Queue ID is required."
            )
        result = self._queue_repo.allocate_next_ticket(queue_entry.queue_id)
        if result is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                description="Queue is inactive."

            )
        
        ticket, order = result
        
        new_queue_entry = QueueEntry(
            client_id = queue_entry.client_id,
            queue_id = queue_entry.queue_id,
            ticket_number = ticket,
            ticket_order = order

        )
        return self._entry_repo.create(new_queue_entry)

    def get_by_id(self, queue_entry_id: UUID) -> QueueEntry | None:
        return self._entry_repo.get_by_id(queue_entry_id)

    def get_by_queue_id(self, queue_id: UUID) -> list[QueueEntry]:
        return self._entry_repo.get_by_queue_id(queue_id)
    
    def get_by_client_id(self, client_id: UUID) -> list[QueueEntry]:
        return self._entry_repo.get_by_client_id(client_id)

    def get_all_queue_entries(self) -> list[QueueEntry]:
        return self._entry_repo.get_all_queue_entries()

    def get_queue_entry_progress_all(self, queue_entry_id: UUID) -> list[QueueEntry]:
        return self._entry_repo.get_queue_entry_progress_all(queue_entry_id)

    def get_queue_entry_progress(self, queue_entry_id: UUID) -> list[QueueEntry]:
        return self._entry_repo.get_queue_entry_progress(queue_entry_id)
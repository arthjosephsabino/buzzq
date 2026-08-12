from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.orm import Session

from app.models import QueueEntry
from app.models.enums import QueueEntryStatus


class QueueEntryRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, queue_entry: QueueEntry) -> QueueEntry:
        self._session.add(queue_entry)
        self._session.commit()
        self._session.refresh(queue_entry)

        return queue_entry

    def get_by_id(self, queue_entry_id: UUID) -> QueueEntry | None:
        return self._session.get(QueueEntry, queue_entry_id)

    def get_by_queue_id(self, queue_id: UUID) -> list[QueueEntry]:
        stmt = select(QueueEntry).where(
            and_(
                QueueEntry.queue_id == queue_id,
                QueueEntry.status != QueueEntryStatus.DONE
            )
        )
        queue_entries = self._session.scalars(stmt)
        return queue_entries

    def get_by_client_id(self, client_id: UUID) -> list[QueueEntry]:
        stmt = select(QueueEntry).where(
            and_(
                QueueEntry.client_id == client_id,
                QueueEntry.status != QueueEntryStatus.DONE
            )
        )
        queue_entries = self._session.scalars(stmt)

        return queue_entries

    def get_all_queue_entries(self) -> list[QueueEntry]:
        stmt = select(QueueEntry)
        return list(self._session.scalars(stmt).all())
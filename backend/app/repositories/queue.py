from uuid import UUID
from sqlalchemy import Integer, select, and_
from sqlalchemy.orm import Session

from app.models.queue import Queue
from app.models.enums import QueueStatus


class QueueRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, queue: Queue) -> Queue:
        self._session.add(queue)
        self._session.commit()
        self._session.refresh(queue)

        return queue

    def get_by_id(self, queue_id: UUID) -> Queue | None:
        return self._session.get(Queue, queue_id)

    def allocate_next_ticket(self, queue_id: UUID) -> str | None:
        stmt = (
            select(Queue).where(
                and_(
                    Queue.id == queue_id,
                    Queue.status != QueueStatus.INACTIVE
                )
            )
            .with_for_update()
        )
        
        queue = self._session.scalar(stmt)

        if queue is None:
            return None

        number = queue.next_ticket_number
        ticket = f"{queue.ticket_prefix}{number:03d}"
        queue.next_ticket_number = number + 1
        return ticket

    def get_all_queues(self) -> list[Queue]:
        stmt = select(Queue)
        return list(self._session.scalars(stmt).all())
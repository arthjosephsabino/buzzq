import uuid
from sqlalchemy import Column, UUID, ForeignKey, String, Enum, DateTime, func
from sqlalchemy.orm import relationship
from app.models.enums import QueueEntryStatus
from app.db.base import Base

class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    queue_id = Column(UUID(as_uuid=True), ForeignKey("queues.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    ticket_number = Column(String, nullable=False)
    status = Column(Enum(QueueEntryStatus), default=QueueEntryStatus.NEW)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # relationships
    queue = relationship("Queue", foreign_keys=[queue_id], back_populates="queue_entries")
    user = relationship("User", foreign_keys=[user_id], back_populates="queue_entries")


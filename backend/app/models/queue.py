import uuid
from sqlalchemy import UUID, Column, Enum, ForeignKey, String, DateTime, func
from sqlalchemy.orm import relationship
from app.models.enums import QueueStatus

class Queue():
    __tablename__ = "queues"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organization.id"), nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Enum(QueueStatus), default=QueueStatus.NEW)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # relationships
    queue_entries = relationship("Queue Entries", back_populates="queue")
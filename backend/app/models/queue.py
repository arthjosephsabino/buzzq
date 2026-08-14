import uuid
from sqlalchemy import UUID, Column, Enum, ForeignKey, Integer, LargeBinary, String, DateTime, func
from sqlalchemy.orm import relationship
from app.models.enums import QueueStatus
from app.db.base import Base

class Queue(Base):
    __tablename__ = "queues"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    ticket_prefix = Column(String, nullable=False)
    next_ticket_number = Column(Integer, default=1)
    qr_code = Column(LargeBinary, nullable=True)
    status = Column(Enum(QueueStatus), default=QueueStatus.NEW)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationships
    queue_entries = relationship("QueueEntry", back_populates="queue")
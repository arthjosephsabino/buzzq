import uuid
from sqlalchemy import Column, UUID, DateTime, String, relationship, func
from app.db.base import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    # relationships
    personnel = relationship(
        "Personnel",
        back_populates="organization",
    )
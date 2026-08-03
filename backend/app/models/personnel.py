import uuid
from sqlalchemy import Column, ForeignKey, UUID, String, DateTime, Enum, relationship, func
from app.db.base import Base
from app.models.enums import PersonnelRole

class Personnel(Base):
    __tablename__ = "personnel"

    id: Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    organization_id: Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name: Column(String, nullable=False)
    role: Column(Enum(PersonnelRole), default=PersonnelRole.STAFF)
    created_at: Column(DateTime, server_default=func.now())
    updated_at: Column(DateTime, onupdate=func.now())

    # relationship
    organization = relationship(
        "Organization",
        back_populates="personnel",
    )
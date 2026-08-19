import uuid
from sqlalchemy import Column, ForeignKey, UUID, String, DateTime, Enum, func
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.models.enums import PersonnelRole

class Personnel(Base):
    __tablename__ = "personnel"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    name =  Column(String, nullable=False)
    role = Column(Enum(PersonnelRole), default=PersonnelRole.STAFF)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationship
    organization = relationship(
        "Organization",
        back_populates="personnel",
    )
import uuid
from sqlalchemy import Column, UUID, DateTime, ForeignKey, Enum, func
from app.models.enums import OrganizationMemberRole

class OrganizationMember():
    __tablename__ = "organization_members"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    role = Column(Enum(OrganizationMemberRole), default=OrganizationMemberRole.STAFF)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
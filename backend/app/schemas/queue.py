from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.models.enums import QueueStatus

class QueueCreate(BaseModel):
    ticket_prefix: str
    organization_id: UUID
    name: str

class QueueResponse(BaseModel):
    id: UUID
    organization_id: UUID
    ticket_prefix: str
    name: str
    status: QueueStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

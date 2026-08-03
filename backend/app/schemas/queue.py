from datetime import datetime
from uuid import UUID
from pydantic import BaseModel
from app.models.enums import QueueStatus

class QueueCreate(BaseModel):
    organization_id: UUID
    name: str

class QueueResponse(BaseModel):
    id: UUID
    organization_id: UUID
    name: str
    status: QueueStatus
    created_at: datetime
    updated_at: datetime

from uuid import UUID
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.enums import QueueEntryStatus

class QueueEntryCreate(BaseModel):
    client_id: UUID
    queue_id: UUID

class QueueEntryResponse(BaseModel):
    id: UUID
    client_id: UUID
    queue_id: UUID
    ticket_number: str
    ticket_order: int
    status: QueueEntryStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

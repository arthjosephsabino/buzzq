from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.queue_entry import QueueEntryResponse

class ClientCreate(BaseModel):
    name: str
    phone: str
    organization_id: UUID

class ClientResponse(BaseModel):
    id: UUID
    name: str
    phone: str
    queue_entries: list[QueueEntryResponse] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
    

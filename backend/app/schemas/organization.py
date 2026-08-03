from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class OrganizationCreate(BaseModel):
    name: str

class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    updated_at: datetime
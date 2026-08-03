from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.models.enums import PersonnelRole

class PersonnelCreate(BaseModel):
    organization_id: UUID
    name: str
    role: PersonnelRole = PersonnelRole.STAFF

class PersonnelResponse(BaseModel):
    name: str
    created_at: datetime
    updated_at: datetime
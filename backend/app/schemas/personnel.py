from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from app.models.enums import PersonnelRole

class PersonnelCreate(BaseModel):
    organization_id: UUID
    name: str
    username: str
    password: str
    role: PersonnelRole = PersonnelRole.STAFF

class PersonnelResponse(BaseModel):
    id: UUID
    organization_id: UUID
    role: PersonnelRole
    name: str
    username: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
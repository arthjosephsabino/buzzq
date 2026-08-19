from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class AdminCreate(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: UUID
    username: str
    created_at: datetime
    updated_at: datetime

class AdminUpdate(BaseModel):
    username: str
    password: str

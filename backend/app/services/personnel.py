from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.personnel import PersonnelRepository
from app.models import Personnel
from app.schemas.personnel import PersonnelCreate
from app.utils.password import get_password_hash


class PersonnelService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = PersonnelRepository(session)

    def get_by_id(self, personnel_id: UUID) -> Personnel | None:
        return self._repo.get_by_id(personnel_id)

    def create(self, payload: PersonnelCreate) -> Personnel:
        if payload.organization_id is None or payload.organization_id == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Organization ID is required."
            )
        if payload.name is None or payload.name == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Personnel name is required."
            )
        new_personnel = Personnel(
            organization_id=payload.organization_id,
            name=payload.name,
            username=payload.username,
            password=get_password_hash(payload.password),
            role=payload.role
        )

        return self._repo.create(new_personnel)
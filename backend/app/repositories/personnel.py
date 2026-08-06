from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.sql import select

from app.models import Personnel


class PersonnelRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_id(self, personnel_id: UUID) -> Personnel | None:
        return self._session.get(Personnel, personnel_id)

    def create(self, personnel: Personnel) -> Personnel:
        self._session.add(personnel)
        self._session.commit()
        self._session.refresh(personnel)

        return personnel

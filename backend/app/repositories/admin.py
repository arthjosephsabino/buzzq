from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.sql import select

from app.models.admin import Admin


class AdminRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def create(self, admin: Admin) -> Admin:
        self._session.add(admin)
        self._session.commit()
        self._session.refresh(admin)

        return admin

    def get_all_admins(self) -> list[Admin]:
        stmt = select(Admin)
        return list(self._session.scalars(stmt).all())

    def get_admin_by_id(self, admin_id: UUID) -> Admin | None:
        return self._session.get(Admin, admin_id)

    def get_admin_by_username(self, username: str) -> Admin | None:
        stmt = select(Admin).where(Admin.username == username)
        return self._session.scalar(stmt)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.admin import AdminRepository
from app.models.admin import Admin
from app.schemas.admin import AdminCreate
from app.utils.password import get_password_hash


class AdminService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = AdminRepository(session)

    def create(self, payload: AdminCreate) -> Admin:
        if payload.username is None or payload.username == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Username is required."
            )
        if payload.password is None or payload.password == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Password is required."
            )
        new_admin = Admin(
            username=payload.username,
            password=get_password_hash(payload.password)
        )
        return self._repo.create(new_admin)
        
    def get_all_admins(self) -> list[Admin]:
        return self._repo.get_all_admins()
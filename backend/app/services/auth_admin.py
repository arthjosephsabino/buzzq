from fastapi import HTTPException, status
import jwt

from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from app.repositories.admin import AdminRepository
from app.models.admin import Admin
from app.models.token import TokenData
from app.utils.password import verify_password
from app.core.config import settings

JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM

class AuthAdminService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._admin_repo = AdminRepository(session)

    def authenticate_admin(self, username: str, password: str) -> Admin | None:
        admin = self._admin_repo.get_admin_by_username(username)

        if not admin:
            return None
        if not verify_password(password, admin.password):
            return None
        
        return admin

    def create_admin_access_token(self, data: dict, expires_delta: timedelta | None = timedelta(hours=36)):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta

        to_encode.update({ "exp" : expire, "role": "admin" })
        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        return encoded_jwt

    def get_admin_from_token(self, token: str) -> Admin:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            if payload.get("role") != "admin":
                raise credentials_exception

            username = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
            
        except jwt.InvalidTokenError:
            raise credentials_exception

        admin = self._admin_repo.get_admin_by_username(token_data.username)

        if admin is None:
            raise credentials_exception
            
        return admin
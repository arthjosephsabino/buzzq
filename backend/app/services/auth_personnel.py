from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.repositories.personnel import PersonnelRepository
from app.models.personnel import Personnel
from app.models.token import TokenData
from app.utils.password import verify_password
from app.core.config import settings


JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_ALGORITHM = settings.JWT_ALGORITHM

class AuthPersonnelService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._personnel_repo = PersonnelRepository(session)

    def authenticate_personnel(self, username: str, password: str) -> Personnel | None:
        personnel = self._personnel_repo.get_personnel_by_username(username)
        if not personnel:
            return None
        if not verify_password(password, personnel.password):
            return None
        return personnel

    def create_personnel_access_token(self, data: dict, expires_delta: timedelta | None = timedelta(hours=36)) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + expires_delta

        to_encode.update({ "exp" : expire, "role": "personnel" })

        encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

        return encoded_jwt

    def get_personnel_from_token(self, token: str) -> Personnel:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
        try:
            decoded = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            username = decoded.get("sub")
            
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
            
        except jwt.InvalidTokenError:
            raise credentials_exception

        personnel = self._personnel_repo.get_personnel_by_username(token_data.username)
        
        if personnel is None:
            raise credentials_exception
        
        return personnel
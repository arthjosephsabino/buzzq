import jwt

from typing import Annotated, Union
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.services.organization import OrganizationService
from app.services.personnel import PersonnelService
from app.services.client import ClientService
from app.services.queue import QueueService
from app.services.queue_entry import QueueEntryService
from app.services.admin import AdminService
from app.services.auth_admin import AuthAdminService
from app.services.auth_personnel import AuthPersonnelService

from app.models.admin import Admin
from app.models import Personnel

from fastapi.security import OAuth2PasswordBearer


AdminOrPersonnel = Union[Admin, Personnel]
allowed_roles = ["admin", "personnel"]

def get_organization_service(db: Session = Depends(get_db)) -> OrganizationService:
    return OrganizationService(db)

def get_personnel_service(db: Session = Depends(get_db)) -> PersonnelService:
    return PersonnelService(db)

def get_client_service(db: Session = Depends(get_db)) -> ClientService:
    return ClientService(db)

def get_queue_service(db: Session = Depends(get_db)) -> QueueService:
    return QueueService(db)

def get_queue_entry_service(db: Session = Depends(get_db)) -> QueueEntryService:
    return QueueEntryService(db)

def get_admin_service(db: Session = Depends(get_db)) -> AdminService:
    return AdminService(db)

def get_auth_admin_service(db: Session = Depends(get_db)) -> AuthAdminService:
    return AuthAdminService(db)

def get_auth_personnel_service(db: Session = Depends(get_db)) -> AuthPersonnelService:
    return AuthPersonnelService(db)

# auth
def get_bearer_scheme(token_url: str) -> OAuth2PasswordBearer:
    return OAuth2PasswordBearer(tokenUrl=token_url)

admin_oauth2_scheme = get_bearer_scheme("/auth/admins/token")
personnel_oauth2_scheme = get_bearer_scheme("/auth/personnel/token")

# admin
def get_current_admin(
    token: Annotated[str, Depends(admin_oauth2_scheme)],
    auth_admin_service: Annotated[AuthAdminService, Depends(get_auth_admin_service)]
) -> Admin: 
    return auth_admin_service.get_admin_from_token(token)

def get_current_active_admin(
    current_admin: Annotated[Admin, Depends(get_current_admin)]
) -> Admin:
    return current_admin

# personnel
def get_current_admin_or_personnel(
    token: Annotated[str, Depends(personnel_oauth2_scheme)],
    auth_admin_service: Annotated[AuthAdminService, Depends(get_auth_admin_service)],
    auth_personnel_service: Annotated[AuthPersonnelService, Depends(get_auth_personnel_service)],
) -> AdminOrPersonnel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        role = payload.get("role")
        if role not in allowed_roles:
            raise credentials_exception
        
        username = payload.get("sub")
        if username is None:
            raise credentials_exception

    except jwt.InvalidTokenError:
        raise credentials_exception
        
    if role == "admin":
        return auth_admin_service.get_admin_from_token(token)
    
    if role == "personnel":
        return auth_personnel_service.get_personnel_from_token(token)

def get_current_active_admin_or_personnel(
    current_admin_or_personnel: Annotated[AdminOrPersonnel, Depends(get_current_admin_or_personnel)]
) -> AdminOrPersonnel:
    return current_admin_or_personnel
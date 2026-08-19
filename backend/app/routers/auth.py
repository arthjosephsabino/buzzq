from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Form, status

from app.services.auth_admin import AuthAdminService
from app.services.auth_personnel import AuthPersonnelService
from app.models.token import Token
from app.core.dependencies import get_auth_admin_service, get_auth_personnel_service
from app.schemas.auth import LoginForm


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post(
    "/admins/token",
    status_code=status.HTTP_200_OK
)
def login_for_admin_access_token(
    form_data: Annotated[LoginForm, Form()],
    db: Annotated[AuthAdminService, Depends(get_auth_admin_service)]
) -> Token:
    admin = db.authenticate_admin(form_data.username, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = db.create_admin_access_token(data={"sub" : admin.username})

    return Token(access_token=access_token, token_type="bearer")

@router.post(
    "/personnel/token",
    status_code=status.HTTP_200_OK
)
def login_for_admin_or_personnel_access_token(
    form_data: Annotated[LoginForm, Form()],
    auth_admin_service: Annotated[AuthAdminService, Depends(get_auth_admin_service)],
    auth_personnel_service: Annotated[AuthPersonnelService, Depends(get_auth_personnel_service)]
) -> Token:
    admin = auth_admin_service.authenticate_admin(form_data.username, form_data.password)
    if admin is not None:
        access_token = auth_admin_service.create_admin_access_token(data={"sub" : admin.username})
    
    else:
        personnel = auth_personnel_service.authenticate_personnel(form_data.username, form_data.password)
        
        if personnel is not None:
            access_token = auth_personnel_service.create_personnel_access_token(data={"sub" : personnel.username})

        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    
    
    return Token(access_token=access_token, token_type="bearer")

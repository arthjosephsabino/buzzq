from typing import Annotated
from fastapi import Depends, status
from fastapi.routing import APIRouter

from app.schemas.admin import AdminCreate, AdminResponse
from app.core.dependencies import get_admin_service, get_current_active_admin
from app.services.admin import AdminService


router = APIRouter(
    prefix="/admins",
    tags=["admins"],
    dependencies=[Depends(get_current_active_admin)]
)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[AdminResponse]
)
def get_all_admins(db: Annotated[AdminService, Depends(get_admin_service)]):
    return db.get_all_admins()

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=AdminResponse
)
def create(
    payload: AdminCreate,
    db: Annotated[AdminService, Depends(get_admin_service)]
):
    return db.create(payload)
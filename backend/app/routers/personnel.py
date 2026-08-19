from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, status

from app.schemas.personnel import PersonnelCreate, PersonnelResponse
from app.core.dependencies import get_current_active_admin_or_personnel, get_personnel_service
from app.services.personnel import PersonnelService


router = APIRouter(
    prefix="/personnel",
    tags=["personnel"],
    dependencies=[Depends(get_current_active_admin_or_personnel)]
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=PersonnelResponse
)
def create(
    payload: PersonnelCreate,
    db: Annotated[PersonnelService, Depends(get_personnel_service)]
):
    return db.create(payload)

@router.get(
    "/{personnel_id}",
    status_code=status.HTTP_200_OK,
    response_model=PersonnelResponse,
)
def get_by_id(
    personnel_id: UUID,
    db: Annotated[PersonnelService, Depends(get_personnel_service)]
):
    return db.get_by_id(personnel_id)


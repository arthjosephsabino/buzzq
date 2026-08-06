from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.schemas.organization import OrganizationResponse, OrganizationCreate
from app.db.session import get_db
from app.services.organization import OrganizationService
from app.dependencies import get_organization_service

router = APIRouter(
    prefix="/organizations",
    tags=["organizations"]
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=OrganizationResponse
)
def create_organization(
    payload: OrganizationCreate,
    db: OrganizationService = Depends(get_organization_service)
):
    return db.create(payload)

@router.get(
    "/{organization_id}",
    status_code=status.HTTP_200_OK,
    response_model=OrganizationResponse
)
def get_organization_by_id(
    organization_id: UUID,
    db: OrganizationService = Depends(get_organization_service)
):
    return db.get_by_id(organization_id)
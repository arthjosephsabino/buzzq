from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, status
from app.schemas.organization import OrganizationResponse, OrganizationCreate
from app.services.organization import OrganizationService
from app.core.dependencies import get_organization_service
from app.schemas.personnel import PersonnelResponse

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
    db: Annotated[OrganizationService, Depends(get_organization_service)]
):
    return db.create(payload)

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[OrganizationResponse]
)
def get_all_organizations(
    db: Annotated[OrganizationService, Depends(get_organization_service)]
):
    return db.get_all_organizations()

@router.get(
    "/{organization_id}",
    status_code=status.HTTP_200_OK,
    response_model=OrganizationResponse
)
def get_organization_by_id(
    organization_id: UUID,
    db: Annotated[OrganizationService, Depends(get_organization_service)]
):
    return db.get_by_id(organization_id)

@router.get(
    "/{organization_id}/personnel",
    status_code=status.HTTP_200_OK,
    response_model=list[PersonnelResponse]
)
def get_org_personnel(
    organization_id: UUID,
    db: Annotated[OrganizationService, Depends(get_organization_service)]
):
    return db.get_org_personnel(organization_id)
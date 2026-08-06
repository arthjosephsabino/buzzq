from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.organization import OrganizationRepository
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate
from app.models import Personnel


class OrganizationService:
    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = OrganizationRepository(session)

    def create(self, organization: OrganizationCreate) -> Organization:
        if organization.name == "" or organization is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Organization name is required."
            )
        new_name = organization.name
        name_check = self._repo.get_by_name(new_name)

        if name_check is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Organization name is already taken."
            )
        
        new_organization = Organization(name=new_name)

        return self._repo.create(new_organization)

    def get_by_id(self, organization_id: UUID) -> Organization | None:
        return self._repo.get_by_id(organization_id)

    def get_org_personnel(self, organization_id: UUID) -> list[Personnel]:
        return self._repo.get_org_personnel(organization_id)

    def get_all_organizations(self) -> list[Organization]:
        return self._repo.get_all_organizations()
        
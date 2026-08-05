from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Organization


class OrganizationRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_id(self, organization_id: UUID) -> Organization | None:
        return self._session.get(Organization, organization_id)

    def get_by_name(self, name: str) -> Organization | None:
        stmt = select(Organization).where(Organization.name==name)
        organization = self._session.scalar(stmt)

        return organization

    def create(self, organization: Organization) -> Organization:
        self._session.add(organization)
        self._session.commit()
        self._session.refresh(organization)
        return organization
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.organization import OrganizationService
from app.services.personnel import PersonnelService


def get_organization_service(db: Session = Depends(get_db)) -> OrganizationService:
    return OrganizationService(db)

def get_personnel_service(db: Session = Depends(get_db)) -> PersonnelService:
    return PersonnelService(db)
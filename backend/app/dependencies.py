from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.organization import OrganizationService
from app.services.personnel import PersonnelService
from app.services.client import ClientService
from app.services.queue import QueueService
from app.services.queue_entry import QueueEntryService


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
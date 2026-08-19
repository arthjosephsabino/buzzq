from uuid import UUID
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.client import ClientRepository
from app.models.client import Client
from app.schemas.client import ClientCreate

class ClientService:

    def __init__(self, session: Session) -> None:
        self._session = session
        self._repo = ClientRepository(session)

    def create(self, payload: ClientCreate) -> Client:
        if payload.name is None or payload.name == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Name is required."
            )
        
        if payload.phone is None or payload.phone == "":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                description="Phone is required."
            )

        new_client = Client(
            name=payload.name,
            phone=payload.phone
        )
        return self._repo.create(new_client)

    
    def get_by_id(self, client_id: UUID) -> Client:
        return self._repo.get_by_id(client_id)

    def get_all_clients(self) -> list[Client]:
        return self._repo.get_all_clients()


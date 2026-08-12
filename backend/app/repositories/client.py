from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Client


class ClientRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_by_id(self, client_id: UUID) -> Client:
        return self._session.get(Client, client_id)
    
    def create(self, client: Client) -> Client:
        self._session.add(client)
        self._session.commit()
        self._session.refresh(client)

        return client

    def get_all_clients(self) -> list[Client]:
        stmt = select(Client)
        return list(self._session.scalars(stmt).all())
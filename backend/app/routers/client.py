from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, status
from starlette.status import HTTP_200_OK

from app.schemas.client import ClientCreate, ClientResponse
from app.core.dependencies import get_client_service
from app.services.client import ClientService


router = APIRouter(
    prefix="/clients",
    tags=["clients"]
)

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ClientResponse
)
def create(
    payload: ClientCreate, 
    db: Annotated[ClientService, Depends(get_client_service)]
):
    return db.create(payload)

@router.get(
    "/{client_id}",
    status_code=HTTP_200_OK,
    response_model=ClientResponse
)
def get_by_id(
    client_id: UUID,
    db: Annotated[ClientService, Depends(get_client_service)]
):
    return db.get_by_id(client_id)


@router.get(
    "",
    status_code=HTTP_200_OK,
    response_model=list[ClientResponse]
)
def get_all_clients(db: Annotated[ClientService, Depends(get_client_service)]):
    return db.get_all_clients()
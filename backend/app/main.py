from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, get_db

from app.routers.organization import router as organization_router
from app.routers.personnel import router as personnel_router
from app.routers.client import router as client_router
from app.routers.queue import router as queue_router
from app.routers.queue_entry import router as queue_entry_router

import app.models

app = FastAPI()
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {
        "Hello": "World"
    }

@app.get("/health/db")
def db_health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"db": "ok"}

app.include_router(organization_router)
app.include_router(personnel_router)
app.include_router(client_router)
app.include_router(queue_router)
app.include_router(queue_entry_router)
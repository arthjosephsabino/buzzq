from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine, get_db

from app.routers.organization import router as organization_router
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
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from . import requisition_crud, requisition_schemas, database, requisition_models
from typing import List

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/requisition", response_model=requisition_schemas.RequisitionOut)
def create_requisition(request: requisition_schemas.RequisitionCreate, db: Session = Depends(get_db)):
    return requisition_crud.create_requisition(db, request)

@router.get("/requisition", response_model=List[requisition_schemas.RequisitionOut])
def get_requisitions(db: Session = Depends(get_db)):
    return db.query(requisition_models.Requisition).all()

# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from . import maintenance_crud, maintenance_schemas, database

# router = APIRouter()
# def get_db():
#     db = database.SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# @router.post("/maintenance", response_model=maintenance_schemas.MaintenanceOut)
# def create_maintenance(request: maintenance_schemas.MaintenanceCreate, db: Session = Depends(get_db)):
#     return maintenance_crud.create_maintenance(db, request)

# @router.get("/maintenance", response_model=list[maintenance_schemas.MaintenanceOut])
# def list_maintenance(db: Session = Depends(get_db)):
#     return maintenance_crud.get_all_maintenance(db)


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import maintenance_crud, maintenance_schemas, database

router = APIRouter()
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/maintenance", response_model=maintenance_schemas.MaintenanceOut)
def create_maintenance_entry(entry: maintenance_schemas.MaintenanceCreate, db: Session = Depends(get_db)):
    return maintenance_crud.create_maintenance(db, entry)

@router.get("/maintenance", response_model=list[maintenance_schemas.MaintenanceOut])
def get_maintenance_entries(db: Session = Depends(get_db)):
    return maintenance_crud.get_all_maintenance(db)
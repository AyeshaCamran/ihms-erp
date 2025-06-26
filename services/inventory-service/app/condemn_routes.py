from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import condemn_crud, condemn_schemas, database

router = APIRouter()

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/condemn", response_model=condemn_schemas.CondemnOut)
def create_condemn(item: condemn_schemas.CondemnCreate, db: Session = Depends(get_db)):
    return condemn_crud.create_condemned_item(db, item)

@router.get("/condemn", response_model=list[condemn_schemas.CondemnOut])
def read_all_condemned(db: Session = Depends(get_db)):
    return condemn_crud.get_all_condemned_items(db)

@router.get("/condemn/{item_id}", response_model=condemn_schemas.CondemnOut)
def read_condemned_by_id(item_id: int, db: Session = Depends(get_db)):
    item = condemn_crud.get_condemned_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Condemned item not found")
    return item

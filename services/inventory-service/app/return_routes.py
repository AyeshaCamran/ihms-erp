from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import return_crud, return_schemas, database

router = APIRouter()

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/returns", response_model=return_schemas.ReturnOut)
def create_return_entry(data: return_schemas.ReturnCreate, db: Session = Depends(get_db)):
    return return_crud.create_return(db, data)

@router.get("/returns", response_model=list[return_schemas.ReturnOut])
def get_all_returns(db: Session = Depends(get_db)):
    return return_crud.get_all_returns(db)

@router.get("/returns/{return_id}", response_model=return_schemas.ReturnOut)
def get_return_by_id(return_id: int, db: Session = Depends(get_db)):
    result = return_crud.get_return_by_id(db, return_id)
    if not result:
        raise HTTPException(status_code=404, detail="Return entry not found")
    return result

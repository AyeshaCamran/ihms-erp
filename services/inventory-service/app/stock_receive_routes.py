from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import stock_receive_crud, schemas, database

router = APIRouter()

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/stock-receive", response_model=schemas.StockReceiveOut)
def create_receive(data: schemas.StockReceiveCreate, db: Session = Depends(get_db)):
    return stock_receive_crud.create_stock_receive(db, data)

@router.get("/stock-receive", response_model=list[schemas.StockReceiveOut])
def get_all_receives(db: Session = Depends(get_db)):
    return stock_receive_crud.get_all_stock_receives(db)

@router.get("/stock-receive/{receive_id}", response_model=schemas.StockReceiveOut)
def get_receive_by_id(receive_id: int, db: Session = Depends(get_db)):
    receive = stock_receive_crud.get_stock_receive_by_id(db, receive_id)
    if not receive:
        raise HTTPException(status_code=404, detail="Stock receive record not found")
    return receive

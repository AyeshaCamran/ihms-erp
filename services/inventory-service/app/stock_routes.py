from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import stock_crud, stock_schemas, database

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/stock", response_model=stock_schemas.StockOut)
def create_stock(stock: stock_schemas.StockCreate, db: Session = Depends(get_db)):
    return stock_crud.create_stock(db, stock)

@router.get("/stock", response_model=list[stock_schemas.StockOut])
def read_stocks(db: Session = Depends(get_db)):
    return stock_crud.get_all_stocks(db)

@router.get("/stock/{stock_id}", response_model=stock_schemas.StockOut)
def read_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = stock_crud.get_stock_by_id(db, stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

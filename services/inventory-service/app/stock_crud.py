from sqlalchemy.orm import Session
from . import stock_models, stock_schemas

def create_stock(db: Session, stock: stock_schemas.StockCreate):
    db_stock = stock_models.Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def get_all_stocks(db: Session):
    return db.query(stock_models.Stock).all()

def get_stock_by_id(db: Session, stock_id: int):
    return db.query(stock_models.Stock).filter(stock_models.Stock.id == stock_id).first()

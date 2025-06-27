from sqlalchemy.orm import Session
from . import models, schemas

def create_stock_receive(db: Session, data: schemas.StockReceiveCreate):
    db_entry = models.StockReceive(**data.dict())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_all_stock_receives(db: Session):
    return db.query(models.StockReceive).all()

def get_stock_receive_by_id(db: Session, receive_id: int):
    return db.query(models.StockReceive).filter(models.StockReceive.id == receive_id).first()

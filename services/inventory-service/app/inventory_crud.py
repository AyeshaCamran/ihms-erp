from sqlalchemy.orm import Session
from . import models, schemas

def create_item(db: Session, item: schemas.InventoryItemCreate):
    db_item = models.InventoryItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session):
    return db.query(models.InventoryItem).all()

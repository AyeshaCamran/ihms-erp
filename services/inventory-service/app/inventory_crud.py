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

def get_item_by_id(db: Session, item_id: int):
    return db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()

def update_item(db: Session, item_id: int, data: schemas.InventoryItemCreate):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if item:
        for key, value in data.dict().items():
            setattr(item, key, value)
        db.commit()
        db.refresh(item)
    return item

def delete_item(db: Session, item_id: int):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if item:
        db.delete(item)
        db.commit()
    return item

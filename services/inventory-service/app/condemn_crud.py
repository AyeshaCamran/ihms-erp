from sqlalchemy.orm import Session
from . import condemn_models, condemn_schemas

def create_condemned_item(db: Session, item: condemn_schemas.CondemnCreate):
    db_item = condemn_models.CondemnedItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_all_condemned_items(db: Session):
    return db.query(condemn_models.CondemnedItem).all()

def get_condemned_item_by_id(db: Session, item_id: int):
    return db.query(condemn_models.CondemnedItem).filter(condemn_models.CondemnedItem.id == item_id).first()

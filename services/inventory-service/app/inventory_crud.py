from sqlalchemy.orm import Session
from . import models, schemas
import pandas as pd
from io import BytesIO
from datetime import datetime
from pytz import timezone
from fastapi import UploadFile, HTTPException


KOLKATA = timezone("Asia/Kolkata")

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

def get_inventory_items(db: Session):
    return db.query(models.InventoryItem).all()

def get_item_quantity_by_id(db: Session, item_id: int):
    item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item_id).first()
    if item:
        return {"available_quantity": item.qty}
    return {"available_quantity": 0}




# # Optional: Export logic (you may move to separate file later)
# def export_items_to_excel_logic(db: Session):
#     items = db.query(models.InventoryItem).all()
#     data = [{
#         "TAG": i.tag,
#         "TYPE": i.type,
#         "STOCK_FROM": i.stock_from,
#         "VOCNO_IN": i.voc_no_in,
#         "VOCDATE_IN": i.voc_date_in.strftime("%Y-%m-%d") if i.voc_date_in else "",
#         "ITEMNAME": i.item_name,
#         "DESCRIPTION": i.description,
#         "QTY": i.quantity,
#         "UNIT": i.unit,
#         "CREATED_AT": i.created_at.strftime("%Y-%m-%d %H:%M:%S")
#     } for i in items]

#     df = pd.DataFrame(data)
#     output = BytesIO()
#     df.to_excel(output, index=False)
#     output.seek(0)
#     return output

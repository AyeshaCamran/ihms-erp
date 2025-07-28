from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import inventory_crud, database, schemas, models
from typing import List



router = APIRouter()

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/items")
def fetch_inventory_items(db: Session = Depends(get_db)):
    return inventory_crud.get_inventory_items(db)

@router.get("/items/{item_id}")
def fetch_item_by_id(item_id: int, db: Session = Depends(get_db)):
    return inventory_crud.get_item_by_id(db, item_id)

@router.get("/items/{item_id}/quantity")
def fetch_item_quantity(item_id: int, db: Session = Depends(get_db)):
    return inventory_crud.get_item_quantity_by_id(db, item_id)

@router.post("/items", response_model=schemas.InventoryItemOut)
def create_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    return inventory_crud.create_item(db, item)

@router.put("/items/{item_id}", response_model=schemas.InventoryItemOut)
def update_item(item_id: int, item_data: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    updated = inventory_crud.update_item(db, item_id, item_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated

@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    deleted = inventory_crud.delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"msg": f"Item ID {item_id} deleted"}



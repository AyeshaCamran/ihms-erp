from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, inventory_crud
from .stock_routes import router as stock_router

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="IHMS Inventory Service")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/inventory/items", response_model=list[schemas.InventoryItemOut])
def read_items(db: Session = Depends(get_db)):
    return inventory_crud.get_items(db)

@app.post("/inventory/items", response_model=schemas.InventoryItemOut)
def create_item(item: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    return inventory_crud.create_item(db, item)

app.include_router(stock_router, prefix="/inventory", tags=["Stock"])

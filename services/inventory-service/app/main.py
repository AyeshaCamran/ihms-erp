from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, inventory_crud
from .stock_routes import router as stock_router       #stock route
from .condemn_routes import router as condemn_router   #condemn route
from .return_routes import router as return_router     #return route
from .issue_routes import router as issue_router       #issue route

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

app.include_router(stock_router, prefix="/inventory", tags=["Stock"])                           #stock API
app.include_router(condemn_router, prefix="/inventory", tags=["Condemnation"])                  #condemnation API
app.include_router(return_router, prefix="/inventory", tags=["Return to Vendor"])               #return to vendor API
app.include_router(issue_router, prefix="/inventory", tags=["Issue to Department"])             #issue to dept API  


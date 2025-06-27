from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, inventory_crud
from .stock_routes import router as stock_router                            #stock route
from .condemn_routes import router as condemn_router                        #condemn route
from .return_routes import router as return_router                          #return route
from .issue_routes import router as issue_router                            #issue route
from .stock_receive_routes import router as stock_receive_router            #stock receive route


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

@app.get("/inventory/items/{item_id}", response_model=schemas.InventoryItemOut)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = inventory_crud.get_item_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.put("/inventory/items/{item_id}", response_model=schemas.InventoryItemOut)
def update_item(item_id: int, item_data: schemas.InventoryItemCreate, db: Session = Depends(get_db)):
    updated = inventory_crud.update_item(db, item_id, item_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated

@app.delete("/inventory/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    deleted = inventory_crud.delete_item(db, item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"msg": f"Item ID {item_id} deleted"}


app.include_router(stock_router, prefix="/inventory", tags=["Stock"])                           #stock API
app.include_router(condemn_router, prefix="/inventory", tags=["Condemnation"])                  #condemnation API
app.include_router(return_router, prefix="/inventory", tags=["Return to Vendor"])               #return to vendor API
app.include_router(issue_router, prefix="/inventory", tags=["Issue to Department"])             #issue to dept API  
app.include_router(stock_receive_router, prefix="/inventory", tags=["Stock Receive"])           #stock receive API


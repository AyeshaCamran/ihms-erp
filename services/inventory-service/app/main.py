from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, inventory_crud

# Routers (inventory submodules)
# from .stock_routes import router as stock_router
# from .condemn_routes import router as condemn_router
# from .return_routes import router as return_router
# from .issue_routes import router as issue_router
# from .stock_receive_routes import router as stock_receive_router
# from .uom_routes import router as uom_router
# from .rack_routes import router as rack_router
# from .vendor_routes import router as vendor_router
# from .threshold_routes import router as threshold_router
from .requisition_routes import router as requisition_router
from .inventory_routes import router as inventory_router  # ✅ updated inventory routes
from .maintenance_routes import router as maintenance_router

from fastapi.middleware.cors import CORSMiddleware


# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

# App init
app = FastAPI(title="IHMS Inventory Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend on localhost:5173
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register all routers
# app.include_router(stock_router, prefix="/inventory", tags=["Stock"])
# app.include_router(condemn_router, prefix="/inventory", tags=["Condemnation"])
# app.include_router(return_router, prefix="/inventory", tags=["Return to Vendor"])
# app.include_router(issue_router, prefix="/inventory", tags=["Issue to Department"])
# app.include_router(stock_receive_router, prefix="/inventory", tags=["Stock Receive"])
# app.include_router(uom_router, prefix="/inventory", tags=["Unit of Measure"])
# app.include_router(rack_router, prefix="/inventory", tags=["Rack/Location"])
# app.include_router(vendor_router, prefix="/inventory", tags=["Vendor"])
# app.include_router(threshold_router, prefix="/inventory", tags=["Threshold Config"])
app.include_router(requisition_router, prefix="/inventory", tags=["Requisition"])
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])  # ✅ this has /items, /import, /export
app.include_router(maintenance_router, prefix="/inventory", tags=["Maintenance"])  # ✅ this has /items, /import, /export

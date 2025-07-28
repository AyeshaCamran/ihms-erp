from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, List

class InventoryItemBase(BaseModel):
    tag: Optional[str]
    type: Optional[str]
    stock_from: Optional[str]
    vocno_in: Optional[str]
    vocdate_in: Optional[datetime]
    itemname: str
    description: Optional[str]
    qty: int  # ✅ stays as QTY
    unit: str
    created_at: Optional[datetime] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemOut(InventoryItemBase):
    id: int

    class Config:
        orm_mode = True


# Requisition schemas
class RequisitionBase(BaseModel):
    dept_id: int
    item_id: int
    quantity_requested: int
    status: str = "Pending"

class RequisitionCreate(RequisitionBase):
    pass

class RequisitionOut(RequisitionBase):
    req_id: int

    class Config:
        orm_mode = True



#stock_receive
# class StockReceiveBase(BaseModel):
#     item_id: int
#     quantity: int
#     received_by: str

# class StockReceiveCreate(StockReceiveBase):
#     pass

# class StockReceiveOut(StockReceiveBase):
#     id: int
#     received_at: datetime

#     class Config:
#         orm_mode = True

# # unit_of_measure.py

# class UOMBase(BaseModel):
#     name: str
#     description: str | None = None

# class UOMCreate(UOMBase):
#     pass

# class UOMOut(UOMBase):
#     id: int

#     class Config:
#         orm_mode = True

# # rack_routes.py
# class RackBase(BaseModel):
#     location_name: str

# class RackCreate(RackBase):
#     pass

# class RackOut(RackBase):
#     rack_id: int

#     class Config:
#         orm_mode = True

# # vendors.py

# class VendorBase(BaseModel):
#     name: str
#     address: str | None = None
#     contact_person: str | None = None
#     phone: str | None = None
#     email: str | None = None
#     gst_number: str | None = None

# class VendorCreate(VendorBase):
#     pass

# class VendorOut(VendorBase):
#     id: int

#     class Config:
#         orm_mode = True

# # ThresholdConfig model for item thresholds
# class ThresholdBase(BaseModel):
#     item_id: int
#     min_level: int
#     max_level: int

# class ThresholdCreate(ThresholdBase):
#     pass

# class ThresholdOut(ThresholdBase):
#     id: int

#     class Config:
#         orm_mode = True



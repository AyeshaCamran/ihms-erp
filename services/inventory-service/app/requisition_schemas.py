# ✅ requisition_schemas.py (updated)
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime

class RequisitionItemBase(BaseModel):
    item_id: int
    requiredQty: int
    issuedQty: Optional[int] = 0
    remarks: Optional[str] = None

class RequisitionItemCreate(RequisitionItemBase):
    pass

class RequisitionItemOut(RequisitionItemBase):
    id: int
    class Config:
        orm_mode = True

class RequisitionCreate(BaseModel):
    department: str
    date: date
    month: str
    material_types: Optional[str] = None
    requirement_types: Optional[str] = None
    justification: Optional[str] = None
    items: List[RequisitionItemCreate]

    # Optional fields for Inventory Incharge
    request_received_on: Optional[datetime] = None
    material_issued_on: Optional[datetime] = None
    voucher_number: Optional[str] = None
    defective_material_received: Optional[str] = None
    store_incharge: Optional[str] = None

class RequisitionOut(RequisitionCreate):
    id: int
    hod_status: Optional[str]
    hod_remarks: Optional[str]
    dean_status: Optional[str]
    dean_remarks: Optional[str]
    stock_status: Optional[str]
    stock_remarks: Optional[str]
    items: List[RequisitionItemOut]

    class Config:
        orm_mode = True

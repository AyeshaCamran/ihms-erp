# ✅ requisition_schemas.py (updated)
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

class RequisitionItemBase(BaseModel):
    item_id: int
    requiredQty: int
    issuedQty: Optional[int] = 0
    remarks: Optional[str] = None

    # Include these (used in frontend for mapping)
    type: Optional[str]
    itemname: Optional[str] = None
    availableQty: Optional[int] = None
    balQty: Optional[int] = None

class RequisitionItemCreate(RequisitionItemBase):
    pass

class RequisitionItemOut(RequisitionItemBase):
    id: int
    item_id: int
    type: Optional[str]
    itemname: Optional[str]
    requiredQty: int = Field(..., alias="required_qty")
    availableQty: Optional[int] = Field(None, alias="available_qty")
    issuedQty: Optional[int] = Field(0, alias="issued_qty")
    balQty: Optional[int] = Field(None, alias="bal_qty")
    remarks: Optional[str]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


class RequisitionCreate(BaseModel):
    department: str
    date: date
    month: str
    material_types: Optional[str] = None
    requirement_types: Optional[str] = None
    justification: Optional[str] = None
    items: List[RequisitionItemCreate]

    hod_remarks: Optional[str] = None
    dean_remarks: Optional[str] = None
    stock_remarks: Optional[str] = None

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
        allow_population_by_field_name = True


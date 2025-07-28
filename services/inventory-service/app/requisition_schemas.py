from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class RequisitionItemBase(BaseModel):
    item_id: int                     # Only this is sent from frontend
    requiredQty: int
    issuedQty: Optional[int] = 0
    remarks: Optional[str]

class RequisitionItemOut(BaseModel):
    id: int
    type: str
    itemname: str
    required_qty: int
    available_qty: int
    issued_qty: int
    bal_qty: int
    remarks: Optional[str]

    class Config:
        orm_mode = True

class RequisitionCreate(BaseModel):
    department: str
    date: date
    month: str
    justification: Optional[str]
    items: List[RequisitionItemBase]

class RequisitionOut(BaseModel):
    id: int
    department: str
    date: date
    month: str
    justification: Optional[str]
    items: List[RequisitionItemOut]

    class Config:
        orm_mode = True

# services/inventory-service/app/material_voucher_schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaterialVoucherBase(BaseModel):
    voucher_no: Optional[str] = None
    date: datetime
    req_form_no: str
    req_date: Optional[str] = None
    authorised_by: str
    procurement_officer: str
    material_issued_by: str
    store_keeper: str
    received_by_name: str
    received_by_signature: Optional[str] = None
    received_by_emp_code: Optional[str] = None
    material_status: str = "complete"
    material_condition: str = "intact"
    note_1: Optional[str] = "No material can be taken outside the University premises through this voucher."
    note_2: Optional[str] = "Non material will be used until the requisition form is properly approved"

class MaterialVoucherCreate(MaterialVoucherBase):
    pass

class MaterialVoucherUpdate(MaterialVoucherBase):
    voucher_no: Optional[str] = None
    date: Optional[datetime] = None
    req_form_no: Optional[str] = None
    authorised_by: Optional[str] = None
    procurement_officer: Optional[str] = None
    material_issued_by: Optional[str] = None
    store_keeper: Optional[str] = None
    received_by_name: Optional[str] = None

class MaterialVoucherOut(BaseModel):
    id: int
    voucher_no: Optional[str]
    date: datetime
    req_form_no: str
    req_date: Optional[str]
    authorised_by: str
    procurement_officer: str
    material_issued_by: str
    store_keeper: str
    received_by_name: str
    received_by_signature: Optional[str]
    received_by_emp_code: Optional[str]
    material_status: str
    material_condition: str
    note_1: Optional[str]
    note_2: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str]

    class Config:
        orm_mode = True
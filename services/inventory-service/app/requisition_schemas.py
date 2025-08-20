# ✅ STEP 4: Updated requisition_schemas.py with complete workflow
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from datetime import date, datetime

class RequisitionItemBase(BaseModel):
    item_id: int
    requiredQty: int
    issuedQty: Optional[int] = 0
    remarks: Optional[str] = None

    # Include these for frontend mapping
    type: Optional[str] = None
    itemname: Optional[str] = None
    availableQty: Optional[int] = None
    balQty: Optional[int] = None

class RequisitionItemCreate(RequisitionItemBase):
    pass

class RequisitionItemOut(BaseModel):
    id: int
    item_id: int
    type: Optional[str]
    itemname: Optional[str]
    
    # ✅ Map database field names to frontend field names using aliases
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
    
    # ✅ Accept arrays from frontend, convert to strings in CRUD
    material_types: Optional[List[str]] = []
    requirement_types: Optional[List[str]] = []
    
    justification: Optional[str] = None
    items: List[RequisitionItemCreate]

    # Optional approval fields (for admin use)
    hod_remarks: Optional[str] = None
    dean_remarks: Optional[str] = None
    ca_remarks: Optional[str] = None
    po_remarks: Optional[str] = None
    inventory_remarks: Optional[str] = None

    # Optional office use fields
    material_issued_on: Optional[datetime] = None
    voucher_number: Optional[str] = None
    defective_material_received: Optional[str] = "No"
    store_incharge: Optional[str] = None

    # ✅ Validate arrays are not None
    @validator('material_types', pre=True)
    def validate_material_types(cls, v):
        return v if v is not None else []
    
    @validator('requirement_types', pre=True)
    def validate_requirement_types(cls, v):
        return v if v is not None else []

class RequisitionOut(BaseModel):
    id: int
    department: str
    date: date
    month: str
    material_types: Optional[str]  # ✅ String in database
    requirement_types: Optional[str]  # ✅ String in database
    justification: Optional[str]
    
    # ✅ STEP 4: Complete approval workflow status fields
    created_by: Optional[str]
    
    # HOD Approval (Step 2)
    hod_status: Optional[str] = "Pending"
    hod_remarks: Optional[str]
    hod_approved_at: Optional[datetime]
    hod_approved_by: Optional[str]
    
    # Dean Approval (Step 3)
    dean_status: Optional[str] = "Pending"
    dean_remarks: Optional[str]
    dean_approved_at: Optional[datetime]
    dean_approved_by: Optional[str]
    
    # Competent Authority Approval (Step 4)
    ca_status: Optional[str] = "Pending"
    ca_remarks: Optional[str]
    ca_approved_at: Optional[datetime]
    ca_approved_by: Optional[str]
    
    # PO Approval (Step 5)
    po_status: Optional[str] = "Pending"
    po_remarks: Optional[str]
    po_approved_at: Optional[datetime]
    po_approved_by: Optional[str]
    
    # Inventory Admin (Step 6)
    inventory_status: Optional[str] = "Pending"
    inventory_remarks: Optional[str]
    inventory_approved_at: Optional[datetime]
    inventory_approved_by: Optional[str]
    
    # Overall status
    overall_status: Optional[str] = "Pending"
    
    # Office use fields
    request_received_on: Optional[datetime]
    material_issued_on: Optional[datetime]
    voucher_number: Optional[str]
    defective_material_received: Optional[str]
    store_incharge: Optional[str]
    
    # Audit fields
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    items: List[RequisitionItemOut]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

# ✅ STEP 4: New schema for approval actions
class ApprovalAction(BaseModel):
    status: str  # "Approved" or "Rejected"
    remarks: Optional[str] = None
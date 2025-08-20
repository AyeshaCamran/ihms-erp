# ✅ STEP 3: Updated requisition_models.py with complete workflow
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from pytz import timezone
from .database import Base

KOLKATA = timezone("Asia/Kolkata")

class Requisition(Base):
    __tablename__ = "requisition"

    id = Column(Integer, primary_key=True, index=True)
    department = Column(String)
    date = Column(Date)
    month = Column(String)
    material_types = Column(String)
    requirement_types = Column(String)
    justification = Column(Text)

    # ✅ STEP 3: Complete Approval Workflow - All Levels
    # Step 1: Created by Incharge (auto-filled)
    created_by = Column(String, nullable=True)  # Incharge who created the form
    
    # Step 2: HOD Approval
    hod_status = Column(String, default="Pending")  # Pending/Approved/Rejected
    hod_remarks = Column(Text, nullable=True)
    hod_approved_at = Column(DateTime, nullable=True)
    hod_approved_by = Column(String, nullable=True)

    # Step 3: Dean Approval  
    dean_status = Column(String, default="Pending")  # Pending/Approved/Rejected
    dean_remarks = Column(Text, nullable=True)
    dean_approved_at = Column(DateTime, nullable=True)
    dean_approved_by = Column(String, nullable=True)

    # Step 4: Competent Authority Approval
    ca_status = Column(String, default="Pending")  # Pending/Approved/Rejected
    ca_remarks = Column(Text, nullable=True)
    ca_approved_at = Column(DateTime, nullable=True)
    ca_approved_by = Column(String, nullable=True)

    # Step 5: Purchase Officer (PO) Approval
    po_status = Column(String, default="Pending")  # Pending/Approved/Rejected
    po_remarks = Column(Text, nullable=True)
    po_approved_at = Column(DateTime, nullable=True)
    po_approved_by = Column(String, nullable=True)

    # Step 6: Inventory Admin (Final Processing)
    inventory_status = Column(String, default="Pending")  # Pending/Approved/Rejected/Issued
    inventory_remarks = Column(Text, nullable=True)
    inventory_approved_at = Column(DateTime, nullable=True)
    inventory_approved_by = Column(String, nullable=True)

    # Overall Status Helper (computed field)
    overall_status = Column(String, default="Pending")  # Pending/In Progress/Approved/Rejected/Issued

    # Office Use Only Section
    request_received_on = Column(DateTime, default=lambda: datetime.now(KOLKATA))
    material_issued_on = Column(DateTime, nullable=True)
    voucher_number = Column(String, nullable=True)
    defective_material_received = Column(String, nullable=True)  # Yes / No
    store_incharge = Column(String, nullable=True)

    # Audit fields
    created_at = Column(DateTime, default=lambda: datetime.now(KOLKATA))
    updated_at = Column(DateTime, default=lambda: datetime.now(KOLKATA), onupdate=lambda: datetime.now(KOLKATA))

    items = relationship("RequisitionItem", back_populates="requisition", cascade="all, delete-orphan")

class RequisitionItem(Base):
    __tablename__ = "requisition_item"

    id = Column(Integer, primary_key=True, index=True)
    requisition_id = Column(Integer, ForeignKey("requisition.id"))
    item_id = Column(Integer)

    type = Column(String)
    itemname = Column(String)
    required_qty = Column(Integer)     
    available_qty = Column(Integer)    
    issued_qty = Column(Integer, default=0)  
    bal_qty = Column(Integer)          

    remarks = Column(Text, nullable=True)

    requisition = relationship("Requisition", back_populates="items")
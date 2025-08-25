# services/inventory-service/app/material_voucher_models.py
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from pytz import timezone

Base = declarative_base()
KOLKATA = timezone("Asia/Kolkata")

class MaterialVoucher(Base):
    __tablename__ = "material_voucher"

    id = Column(Integer, primary_key=True, index=True)
    
    # Voucher identification
    voucher_no = Column(String, unique=True, index=True)  # Auto-generated like "23002"
    date = Column(DateTime, default=lambda: datetime.now(KOLKATA))
    
    # Requisition reference
    req_form_no = Column(String)  # REQ-123
    req_date = Column(String)  # Date from requisition
    
    # Authorization details
    authorised_by = Column(String)  # From requisition creator
    procurement_officer = Column(String)
    
    # Material issuing details
    material_issued_by = Column(String)  # Store Keeper (Inventory Admin)
    store_keeper = Column(String)  # Same as material_issued_by
    
    # Receiving details
    received_by_name = Column(String)
    received_by_signature = Column(String, nullable=True)
    received_by_emp_code = Column(String, nullable=True)
    
    # Material status
    material_status = Column(String, default="complete")  # complete/partial/balance
    material_condition = Column(String, default="intact")  # intact/damaged/partial
    
    # Notes
    note_1 = Column(Text, default="No material can be taken outside the University premises through this voucher.")
    note_2 = Column(Text, default="Non material will be used until the requisition form is properly approved")
    
    # Status and audit
    status = Column(String, default="Issued")  # Issued/Completed
    created_at = Column(DateTime, default=lambda: datetime.now(KOLKATA))
    updated_at = Column(DateTime, default=lambda: datetime.now(KOLKATA), onupdate=lambda: datetime.now(KOLKATA))
    created_by = Column(String)
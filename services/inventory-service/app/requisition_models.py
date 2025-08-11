# ✅ requisition_models.py (updated model)
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

    # Approval Workflow
    hod_status = Column(String, default="Pending")
    hod_remarks = Column(Text, nullable=True)

    dean_status = Column(String, default="Pending")
    dean_remarks = Column(Text, nullable=True)

    inventory_status = Column(String, default="Pending")
    inventory_remarks = Column(Text, nullable=True)

    # Office Use Only Section
    request_received_on = Column(DateTime, default=lambda: datetime.now(KOLKATA))
    material_issued_on = Column(DateTime, nullable=True)
    voucher_number = Column(String, nullable=True)
    defective_material_received = Column(String, nullable=True)  # Yes / No
    store_incharge = Column(String, nullable=True)

    items = relationship("RequisitionItem", back_populates="requisition", cascade="all, delete-orphan")

class RequisitionItem(Base):
    __tablename__ = "requisition_item"

    id = Column(Integer, primary_key=True, index=True)
    requisition_id = Column(Integer, ForeignKey("requisition.id"))
    item_id = Column(Integer)

    type = Column(String)
    itemname = Column(String)
    required_qty = Column(Integer)     # ✅ change from requiredQty
    available_qty = Column(Integer)    # ✅ change from availableQty
    issued_qty = Column(Integer, default=0)  # ✅ change from issuedQty
    bal_qty = Column(Integer)          # ✅ change from bal

    remarks = Column(Text, nullable=True)

    requisition = relationship("Requisition", back_populates="items")

from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Requisition(Base):
    __tablename__ = "requisition"

    id = Column(Integer, primary_key=True, index=True)
    department = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    month = Column(String, nullable=False)
    justification = Column(Text)

    items = relationship("RequisitionItem", back_populates="requisition", cascade="all, delete-orphan")

class RequisitionItem(Base):
    __tablename__ = "requisition_items"

    id = Column(Integer, primary_key=True, index=True)
    requisition_id = Column(Integer, ForeignKey("requisition.id"))
    type = Column(String)
    itemname = Column(String)
    required_qty = Column(Integer)
    available_qty = Column(Integer)
    issued_qty = Column(Integer, default=0)
    bal_qty = Column(Integer)  # ✅ NEW: Calculated as available_qty - issued_qty
    remarks = Column(String)

    requisition = relationship("Requisition", back_populates="items")

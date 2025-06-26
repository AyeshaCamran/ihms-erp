from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class ReturnToVendor(Base):
    __tablename__ = "returns_to_vendor"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    vendor_name = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    return_date = Column(DateTime(timezone=True), server_default=func.now())

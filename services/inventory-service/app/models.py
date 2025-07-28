from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text
from datetime import datetime
from .database import Base
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from pytz import timezone

KOLKATA = timezone("Asia/Kolkata")

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, nullable=True)
    type = Column(String, nullable=True)
    stock_from = Column(String, nullable=True)
    vocno_in = Column(String, nullable=True)
    vocdate_in = Column(DateTime, nullable=True)
    itemname = Column(String, nullable=False)
    description = Column(String, nullable=True)
    qty = Column(Integer, nullable=False)  # ✅ stays as QTY
    unit = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(KOLKATA))




#stock_receive
# class StockReceive(Base):
#     __tablename__ = "stock_receive"

#     id = Column(Integer, primary_key=True, index=True)
#     item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
#     quantity = Column(Integer, nullable=False)
#     received_by = Column(String, nullable=False)
#     received_at = Column(DateTime, server_default=func.now())

#     #item = relationship("InventoryItem", back_populates="receives")

# # unit_of_measure.py
# class UnitOfMeasure(Base):
#     __tablename__ = "unit_of_measures"

#     unit_id = Column(Integer, primary_key=True, index=True)
#     unit_name = Column(String, unique=True, nullable=False)
#     description = Column(String, nullable=True)

# # rack_routes.py
# class RackLocation(Base):
#     __tablename__ = "rack_locations"

#     rack_id = Column(Integer, primary_key=True, index=True)
#     location_name = Column(String, unique=True, nullable=False)

# # vendors.py

# class Vendor(Base):
#     __tablename__ = "vendors"

#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     address = Column(String)
#     contact_person = Column(String)
#     phone = Column(String)
#     email = Column(String)
#     gst_number = Column(String)

# # ThresholdConfig model for item thresholds

# class ThresholdConfig(Base):
#     __tablename__ = "thresholds"

#     id = Column(Integer, primary_key=True, index=True)
#     item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
#     min_level = Column(Integer, nullable=False)
#     max_level = Column(Integer, nullable=False)



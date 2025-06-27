from sqlalchemy import Column, Integer, String
from .database import Base
from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit = Column(String)
    min_level = Column(Integer)
    max_level = Column(Integer)
    barcode = Column(String, unique=True)
    receives = relationship("StockReceive", back_populates="item")

#stock_receive
class StockReceive(Base):
    __tablename__ = "stock_receive"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    received_by = Column(String, nullable=False)
    received_at = Column(DateTime, server_default=func.now())

    item = relationship("InventoryItem", back_populates="receives")
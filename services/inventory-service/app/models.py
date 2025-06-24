from sqlalchemy import Column, Integer, String
from .database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit = Column(String)
    min_level = Column(Integer)
    max_level = Column(Integer)
    barcode = Column(String, unique=True)

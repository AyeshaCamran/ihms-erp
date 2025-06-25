from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="Available")  # e.g., Available, Reserved, Damaged

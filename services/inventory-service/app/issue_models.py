from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Issue(Base):
    __tablename__ = "issued_items"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    department = Column(String, nullable=False)
    issued_by = Column(String, nullable=False)
    issue_date = Column(DateTime(timezone=True), server_default=func.now())
    remarks = Column(String, nullable=True)

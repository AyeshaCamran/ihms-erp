# from sqlalchemy import Column, Integer, String, Date, Text
# from app.database import Base

# # ✅ Maintenance table model
# class Maintenance(Base):
#     __tablename__ = "maintenance"

#     id = Column(Integer, primary_key=True, index=True)
#     complaint_no = Column(Integer)
#     date = Column(Date)
#     emp_code = Column(String)
#     complaint = Column(String)  # ✅ Keep this as 'complaint'
#     department = Column(String)
#     nature_of_maintenance = Column(String)
#     type_of_maintenance = Column(String)
#     description = Column(Text)
from sqlalchemy import Column, Integer, String, Date, Text
from .database import Base

class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    complaint_no = Column(Integer, nullable=False, unique=True)  # ✅ INT TYPE
    date = Column(Date, nullable=False)
    emp_code = Column(String, nullable=False)
    complaint = Column(String, nullable=False)  # ✅ Renamed from name
    department = Column(String, nullable=False)
    nature_of_maintenance = Column(String, nullable=False)
    type_of_maintenance = Column(String, nullable=False)
    description = Column(Text)

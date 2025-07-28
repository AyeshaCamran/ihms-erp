# from pydantic import BaseModel
# from datetime import date

# # ✅ Schema for creating a maintenance entry
# class MaintenanceCreate(BaseModel):
#     complaintNo: int
#     date: date
#     empCode: str
#     complaint: str  # ✅ this stays as 'complaint'
#     department: str
#     natureOfMaintenance: str
#     typeOfMaintenance: str
#     description: str
# # ✅ Schema for returning maintenance entries
# class MaintenanceOut(MaintenanceCreate):
#     id: int

#     class Config:
#         orm_mode = True

from pydantic import BaseModel
from datetime import date

class MaintenanceBase(BaseModel):
    complaint_no: int  # ✅ INT TYPE
    date: date
    emp_code: str
    complaint: str  # ✅ Renamed from name
    department: str
    nature_of_maintenance: str
    type_of_maintenance: str
    description: str

class MaintenanceCreate(MaintenanceBase):
    pass

class MaintenanceOut(MaintenanceBase):
    id: int

    class Config:
        orm_mode = True

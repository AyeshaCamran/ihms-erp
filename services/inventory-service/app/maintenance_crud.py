# from sqlalchemy.orm import Session
# from . import maintenance_models, maintenance_schemas

# # ✅ Save maintenance form data to DB
# def create_maintenance(db: Session, data: maintenance_schemas.MaintenanceCreate):
#     maintenance = maintenance_models.Maintenance(
#         complaint_no=data.complaintNo,
#         date=data.date,
#         emp_code=data.empCode,
#         complaint=data.complaint,
#         department=data.department,
#         nature_of_maintenance=data.natureOfMaintenance,
#         type_of_maintenance=data.typeOfMaintenance,
#         description=data.description
#     )
#     db.add(maintenance)
#     db.commit()
#     db.refresh(maintenance)
#     return maintenance

# # ✅ Fetch all maintenance entries
# def get_all_maintenance(db: Session):
#     return db.query(maintenance_models.Maintenance).all()

from sqlalchemy.orm import Session
from . import maintenance_models, maintenance_schemas
import os

def create_maintenance(db: Session, data: maintenance_schemas.MaintenanceCreate):
    new_entry = maintenance_models.Maintenance(**data.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def get_all_maintenance(db: Session):
    return db.query(maintenance_models.Maintenance).all()

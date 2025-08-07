
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from . import requisition_crud, requisition_schemas, requisition_models, database, auth_utils
# from auth_utils import get_current_user

router = APIRouter()


# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# # Decode token to get role/department
# def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         return {"role": payload.get("role"), "department": payload.get("department")}
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid token")

# ✅ 1. Create Requisition
@router.post("/requisition", response_model=requisition_schemas.RequisitionOut)
def create_requisition(request: requisition_schemas.RequisitionCreate, db: Session = Depends(get_db)):
    return requisition_crud.create_requisition(db, request)

# ✅ 2. Get Requisitions with filters or auto-role detection
@router.get("/requisition", response_model=List[requisition_schemas.RequisitionOut])
def get_requisitions(
    role: Optional[str] = None,
    status: Optional[str] = None,
    department: Optional[str] = None,
    db: Session = Depends(get_db),
    user: Optional[dict] = Depends(auth_utils.get_current_user),
):
    actual_role = role or (user.get("role") if user else None)
    actual_dept = department or (user.get("department") if user else None)

    query = db.query(requisition_models.Requisition)

    if actual_dept:
        query = query.filter(requisition_models.Requisition.department == actual_dept)

    if actual_role == "HOD" and status:
        query = query.filter(requisition_models.Requisition.hod_status == status)
    elif actual_role == "Dean" and status:
        query = query.filter(requisition_models.Requisition.dean_status == status)
    elif actual_role == "Store" and status:
        query = query.filter(requisition_models.Requisition.stock_status == status)

    return query.all()


# ✅ 3. Approve Requisition
@router.put("/requisition/{req_id}/approve")
def approve_requisition(
    req_id: int,
    role: str = Query(...),
    user: dict = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(requisition_models.Requisition).filter_by(id=req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requisition not found")

    if role == "HOD":
        req.hod_status = "Approved"
    elif role == "Dean":
        req.dean_status = "Approved"
    elif role == "Store":
        req.stock_status = "Issued"
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": f"{role} approved requisition."}

# ✅ 4. Reject Requisition
@router.put("/requisition/{req_id}/reject")
def reject_requisition(
    req_id: int,
    role: str = Query(...),
    remarks: Optional[str] = Query(""),
    user: dict = Depends(auth_utils.get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(requisition_models.Requisition).filter_by(id=req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requisition not found")

    if role == "HOD":
        req.hod_status = "Rejected"
        req.hod_remarks = remarks
    elif role == "Dean":
        req.dean_status = "Rejected"
        req.dean_remarks = remarks
    elif role == "Store":
        req.stock_status = "Rejected"
        req.stock_remarks = remarks
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": f"{role} rejected requisition with remarks."}

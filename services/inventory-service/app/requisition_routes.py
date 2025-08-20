from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from . import requisition_crud, requisition_schemas, requisition_models, database, auth_utils

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ 1. Create Requisition - Fixed
@router.post("/requisition", response_model=requisition_schemas.RequisitionOut)
def create_requisition(
    request: requisition_schemas.RequisitionCreate, 
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)  # ✅ Require authentication
):
    try:
        print(f"📝 Creating requisition for user: {user}")
        print(f"📦 Request data: {request.dict()}")
        
        result = requisition_crud.create_requisition(db, request)
        print(f"✅ Requisition created with ID: {result.id}")
        return result
        
    except Exception as e:
        print(f"❌ Error creating requisition: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create requisition: {str(e)}")

# ✅ 2. Get Requisitions - Fixed with better filtering
@router.get("/requisition", response_model=List[requisition_schemas.RequisitionOut])
def get_requisitions(
    role: Optional[str] = Query(None, description="User role filter"),
    status: Optional[str] = Query(None, description="Status filter"),
    department: Optional[str] = Query(None, description="Department filter"),
    db: Session = Depends(get_db),
    user: Optional[dict] = Depends(auth_utils.get_current_user),
):
    try:
        print(f"🔍 Fetching requisitions for user: {user}")
        print(f"🔍 Query params - role: {role}, department: {department}, status: {status}")
        
        # ✅ Use user data if role/department not provided in query
        actual_role = role or (user.get("role") if user else None)
        actual_dept = department or (user.get("department") if user else None)
        
        print(f"🎯 Using - role: {actual_role}, department: {actual_dept}")
        
        # ✅ Fetch requisitions using the fixed CRUD function
        requisitions = requisition_crud.get_requisitions_by_filter(
            db=db, 
            role=actual_role, 
            department=actual_dept, 
            status=status
        )
        
        print(f"📊 Found {len(requisitions)} requisitions")
        
        # ✅ Debug: Print first requisition structure
        if requisitions:
            first_req = requisitions[0]
            print(f"🔍 First requisition items count: {len(first_req.items) if first_req.items else 0}")
        
        return requisitions
        
    except Exception as e:
        print(f"❌ Error fetching requisitions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch requisitions: {str(e)}")

# ✅ 3. Get Single Requisition by ID
@router.get("/requisition/{req_id}", response_model=requisition_schemas.RequisitionOut)
def get_requisition_by_id(
    req_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    requisition = requisition_crud.get_requisition_by_id(db, req_id)
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisition not found")
    return requisition

# ✅ 4. Update Requisition Status (PATCH) - Fixed
@router.patch("/requisition/{req_id}")
def update_requisition_status(
    req_id: int,
    updates: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    try:
        print(f"🔄 Updating requisition {req_id} with: {updates}")
        
        req = db.query(requisition_models.Requisition).filter_by(id=req_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Requisition not found")
        
        # ✅ Update fields from the request body
        for field, value in updates.items():
            if hasattr(req, field):
                setattr(req, field, value)
                print(f"✅ Updated {field} = {value}")
        
        db.commit()
        db.refresh(req)
        
        print(f"✅ Requisition {req_id} updated successfully")
        return req
        
    except Exception as e:
        print(f"❌ Error updating requisition: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to update requisition: {str(e)}")

# ✅ 5. Approve Requisition (Simplified)
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
    elif role == "Inventory Admin":
        req.inventory_status = "Approved"
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": f"{role} approved requisition {req_id}"}

# ✅ 6. Reject Requisition (Simplified)
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
    elif role == "Inventory Admin":
        req.inventory_status = "Rejected"
        req.inventory_remarks = remarks
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    db.commit()
    return {"message": f"{role} rejected requisition {req_id}"}
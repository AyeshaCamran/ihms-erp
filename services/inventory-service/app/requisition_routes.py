# services/inventory-service/app/requisition_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from . import requisition_crud, requisition_schemas, requisition_models, database, auth_utils
# from .auth import get_current_user  # ✅ FIXED: Import from correct path

router = APIRouter()

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ 1. Create Requisition - Only Incharge can create
@router.post("/requisition", response_model=requisition_schemas.RequisitionOut)  # ✅ FIXED: Changed from /requisition to /requisitions
def create_requisition(
    request: requisition_schemas.RequisitionCreate, 
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    try:
        print(f"📝 Creating requisition for user: {user}")
        print(f"📦 Request data: {request.dict()}")
        
        result = requisition_crud.create_requisition(db, request, user)
        print(f"✅ Requisition created with ID: {result.id}")
        return result
        
    except Exception as e:
        print(f"❌ Error creating requisition: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create requisition: {str(e)}")

# ✅ 2. Get Requisitions - All roles can view
@router.get("/requisition", response_model=List[requisition_schemas.RequisitionOut])  # ✅ FIXED: Changed from /requisition to /requisitions
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
        
        # Use user data if role/department not provided in query
        actual_role = role or (user.get("role") if user else None)
        actual_dept = department or (user.get("department") if user else None)
        
        print(f"🎯 Using - role: {actual_role}, department: {actual_dept}")
        
        requisitions = requisition_crud.get_requisitions_by_filter(
            db=db, 
            role=actual_role, 
            department=actual_dept, 
            status=status
        )
        
        print(f"📊 Found {len(requisitions)} requisitions")
        
        # Debug: Print first requisition structure
        if requisitions:
            first_req = requisitions[0]
            print(f"🔍 First requisition items count: {len(first_req.items) if first_req.items else 0}")
            print(f"🔍 First requisition overall status: {first_req.overall_status}")
        
        return requisitions
        
    except Exception as e:
        print(f"❌ Error fetching requisitions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch requisitions: {str(e)}")

# ✅ 3. Get Single Requisition by ID
@router.get("/requisition/{req_id}", response_model=requisition_schemas.RequisitionOut)  # ✅ FIXED: Changed from /requisition to /requisitions
def get_requisition_by_id(
    req_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    requisition = requisition_crud.get_requisition_by_id(db, req_id)
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisition not found")
    return requisition

# ✅ 4. Check if user can approve specific requisition
@router.get("/requisition/{req_id}/can-approve")  # ✅ FIXED: Changed from /requisition to /requisitions
def check_approval_permission(
    req_id: int,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    requisition = requisition_crud.get_requisition_by_id(db, req_id)
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisition not found")
    
    can_approve = requisition_crud.can_user_approve(requisition, user.get("role"))
    next_approver = requisition_crud.get_next_approver(requisition)
    
    return {
        "can_approve": can_approve,
        "next_approver": next_approver,
        "current_status": requisition.overall_status
    }

# ✅ 5. Approve Requisition - Role-based approval
@router.post("/requisition/{req_id}/approve")  # ✅ FIXED: Changed from /requisition to /requisitions
def approve_requisition(
    req_id: int,
    action: requisition_schemas.ApprovalAction,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    try:
        print(f"🔄 Processing approval for requisition {req_id}")
        print(f"👤 User: {user.get('name')} ({user.get('role')})")
        print(f"📝 Action: {action.status}, Remarks: {action.remarks}")
        
        result = requisition_crud.update_requisition_status(
            db=db,
            req_id=req_id,
            role=user.get("role"),
            action=action.status,
            remarks=action.remarks,
            user=user
        )
        
        print(f"✅ Requisition {req_id} updated successfully")
        print(f"🎯 New overall status: {result.overall_status}")
        
        return {
            "message": f"{user.get('role')} {action.status.lower()} requisition {req_id}",
            "overall_status": result.overall_status,
            "next_approver": requisition_crud.get_next_approver(result)
        }
        
    except Exception as e:
        print(f"❌ Error processing approval: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to process approval: {str(e)}")

# ✅ 6. Get Requisitions by Status for Dashboard
@router.get("/requisition/status/{status}", response_model=List[requisition_schemas.RequisitionOut])  # ✅ FIXED
def get_requisitions_by_status(
    status: str,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    """Get requisitions by overall status"""
    try:
        query = db.query(requisition_models.Requisition)
        
        # Filter by overall status
        if status != "all":
            query = query.filter(requisition_models.Requisition.overall_status.ilike(f"%{status}%"))
        
        # Filter by department for role-based access
        user_role = user.get("role")
        user_dept = user.get("department")
        
        if user_role in ["Incharge", "HOD"] and user_dept:
            query = query.filter(requisition_models.Requisition.department == user_dept)
        
        requisitions = query.order_by(requisition_models.Requisition.created_at.desc()).all()
        return requisitions
        
    except Exception as e:
        print(f"❌ Error fetching requisitions by status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch requisitions: {str(e)}")

# ✅ 7. Get Pending Approvals for Current User
@router.get("/requisition/pending-approvals", response_model=List[requisition_schemas.RequisitionOut])  # ✅ FIXED
def get_pending_approvals(
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    """Get requisitions that are pending approval by current user"""
    try:
        user_role = user.get("role")
        user_dept = user.get("department")
        
        query = db.query(requisition_models.Requisition)
        
        # Filter based on what the user can approve
        if user_role == "HOD":
            query = query.filter(
                requisition_models.Requisition.department == user_dept,
                requisition_models.Requisition.hod_status == "Pending"
            )
        elif user_role == "Dean":
            query = query.filter(
                requisition_models.Requisition.hod_status == "Approved",
                requisition_models.Requisition.dean_status == "Pending"
            )
        elif user_role == "Competent Authority":
            query = query.filter(
                requisition_models.Requisition.dean_status == "Approved",
                requisition_models.Requisition.ca_status == "Pending"
            )
        elif user_role == "PO":
            query = query.filter(
                requisition_models.Requisition.ca_status == "Approved",
                requisition_models.Requisition.po_status == "Pending"
            )
        elif user_role == "Inventory Admin":
            query = query.filter(
                requisition_models.Requisition.po_status == "Approved",
                requisition_models.Requisition.inventory_status == "Pending"
            )
        else:
            return []
        
        pending_requisitions = query.order_by(requisition_models.Requisition.created_at.desc()).all()
        print(f"📋 Found {len(pending_requisitions)} pending approvals for {user_role}")
        
        return pending_requisitions
        
    except Exception as e:
        print(f"❌ Error fetching pending approvals: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch pending approvals: {str(e)}")

# ✅ 8. Get Requisition Statistics
@router.get("/requisition/stats")  # ✅ FIXED
def get_requisition_stats(
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    """Get requisition statistics for dashboard"""
    try:
        user_role = user.get("role")
        user_dept = user.get("department")
        
        query = db.query(requisition_models.Requisition)
        
        # Filter by department for role-based access
        if user_role in ["Incharge", "HOD"] and user_dept:
            query = query.filter(requisition_models.Requisition.department == user_dept)
        
        all_requisitions = query.all()
        
        # Calculate statistics
        total = len(all_requisitions)
        pending = len([r for r in all_requisitions if r.overall_status == "Pending"])
        approved = len([r for r in all_requisitions if "Approved" in r.overall_status])
        rejected = len([r for r in all_requisitions if "Rejected" in r.overall_status])
        issued = len([r for r in all_requisitions if r.overall_status == "Issued"])
        
        # Get pending approvals count for current user
        pending_approvals_query = db.query(requisition_models.Requisition)
        
        if user_role == "HOD":
            pending_for_user = pending_approvals_query.filter(
                requisition_models.Requisition.department == user_dept,
                requisition_models.Requisition.hod_status == "Pending"
            ).count()
        elif user_role == "Dean":
            pending_for_user = pending_approvals_query.filter(
                requisition_models.Requisition.hod_status == "Approved",
                requisition_models.Requisition.dean_status == "Pending"
            ).count()
        elif user_role == "Competent Authority":
            pending_for_user = pending_approvals_query.filter(
                requisition_models.Requisition.dean_status == "Approved",
                requisition_models.Requisition.ca_status == "Pending"
            ).count()
        elif user_role == "PO":
            pending_for_user = pending_approvals_query.filter(
                requisition_models.Requisition.ca_status == "Approved",
                requisition_models.Requisition.po_status == "Pending"
            ).count()
        elif user_role == "Inventory Admin":
            pending_for_user = pending_approvals_query.filter(
                requisition_models.Requisition.po_status == "Approved",
                requisition_models.Requisition.inventory_status == "Pending"
            ).count()
        else:
            pending_for_user = 0
        
        return {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "issued": issued,
            "pending_for_user": pending_for_user,
            "user_role": user_role
        }
        
    except Exception as e:
        print(f"❌ Error fetching requisition stats: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")

# ✅ 9. Legacy compatibility routes (PATCH) - Keep for backward compatibility
@router.patch("/requisition/{req_id}")  # ✅ FIXED
def update_requisition_status_legacy(
    req_id: int,
    updates: dict,
    db: Session = Depends(get_db),
    user: dict = Depends(auth_utils.get_current_user)
):
    """Legacy PATCH endpoint for status updates"""
    try:
        print(f"🔄 Legacy update for requisition {req_id} with: {updates}")
        
        user_role = user.get("role")
        
        if f"{user_role.lower()}_status" in updates:
            status = updates[f"{user_role.lower()}_status"]
            remarks = updates.get(f"{user_role.lower()}_remarks", "")
            
            result = requisition_crud.update_requisition_status(
                db=db,
                req_id=req_id,
                role=user_role,
                action=status,
                remarks=remarks,
                user=user
            )
            
            return result
        else:
            # Generic field updates for admin
            req = db.query(requisition_models.Requisition).filter_by(id=req_id).first()
            if not req:
                raise HTTPException(status_code=404, detail="Requisition not found")
            
            for field, value in updates.items():
                if hasattr(req, field):
                    setattr(req, field, value)
            
            db.commit()
            db.refresh(req)
            return req
        
    except Exception as e:
        print(f"❌ Error in legacy update: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to update requisition: {str(e)}")
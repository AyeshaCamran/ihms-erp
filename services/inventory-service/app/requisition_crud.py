# ✅ STEP 5: Updated requisition_crud.py with complete workflow
from . import requisition_models, requisition_schemas
from . import models
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from pytz import timezone

KOLKATA = timezone("Asia/Kolkata")

def create_requisition(db: Session, req_data: requisition_schemas.RequisitionCreate, user: dict):
    """Create a new requisition - only Incharge can create"""
    
    # ✅ Verify user is Incharge
    if user.get("role") != "Incharge":
        raise HTTPException(status_code=403, detail="Only Incharge can create requisitions")
    
    # ✅ Convert arrays to comma-separated strings for database storage
    material_types_str = ",".join(req_data.material_types) if req_data.material_types else ""
    requirement_types_str = ",".join(req_data.requirement_types) if req_data.requirement_types else ""
    
    requisition = requisition_models.Requisition(
        department=req_data.department,
        date=req_data.date,
        month=req_data.month,
        justification=req_data.justification,
        material_types=material_types_str,  
        requirement_types=requirement_types_str,  

        # ✅ STEP 5: Set creator info
        created_by=user.get("name"),

        # ✅ STEP 5: Initialize all approval statuses to Pending
        hod_status="Pending",
        dean_status="Pending", 
        ca_status="Pending",
        po_status="Pending",
        inventory_status="Pending",
        overall_status="Pending",

        # Office use fields
        request_received_on=datetime.now(KOLKATA),
        material_issued_on=req_data.material_issued_on,
        voucher_number=req_data.voucher_number,
        defective_material_received=req_data.defective_material_received or "No",
        store_incharge=req_data.store_incharge,
    )

    db.add(requisition)
    db.flush()  # ✅ Flush to get the ID

    # ✅ Process items with proper field mapping
    for item in req_data.items:
        # ✅ Fetch inventory item to get current stock info
        inv_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item.item_id).first()
        if not inv_item:
            raise HTTPException(status_code=404, detail=f"Inventory item with ID {item.item_id} not found")

        # ✅ Calculate issued and balance quantities
        issued = item.issuedQty or 0
        available = inv_item.qty
        bal = available - issued

        # ✅ Create requisition item with correct field names
        db_item = requisition_models.RequisitionItem(
            requisition_id=requisition.id,
            item_id=item.item_id, 
            type=inv_item.type,
            itemname=inv_item.itemname,
            required_qty=item.requiredQty,  
            available_qty=available,        
            issued_qty=issued,              
            bal_qty=bal,                    
            remarks=item.remarks,
        )
        db.add(db_item)

    db.commit()
    db.refresh(requisition)
    return requisition

def get_requisitions_by_filter(db: Session, role: str = None, department: str = None, status: str = None):
    """Get requisitions with proper filtering based on role"""
    
    query = db.query(requisition_models.Requisition)
    
    # ✅ STEP 5: Filter by department for Incharge and HOD
    if role in ["Incharge", "HOD"] and department:
        query = query.filter(requisition_models.Requisition.department == department)
    
    # ✅ STEP 5: Filter by status based on role - currently all can see all
    # Later we'll add role-specific filtering
    
    return query.order_by(requisition_models.Requisition.created_at.desc()).all()

def get_requisition_by_id(db: Session, req_id: int):
    """Get single requisition by ID"""
    return db.query(requisition_models.Requisition).filter(requisition_models.Requisition.id == req_id).first()

def update_requisition_status(db: Session, req_id: int, role: str, action: str, remarks: str = None, user: dict = None):
    """Update requisition approval status based on role"""
    
    requisition = db.query(requisition_models.Requisition).filter(requisition_models.Requisition.id == req_id).first()
    if not requisition:
        raise HTTPException(status_code=404, detail="Requisition not found")
    
    now = datetime.now(KOLKATA)
    user_name = user.get("name") if user else "Unknown"
    
    # ✅ STEP 5: Update status based on role - for now only allow viewing
    # We'll implement approval logic step by step
    
    if role == "HOD":
        # ✅ Check if HOD can approve (requisition is in pending state)
        if requisition.hod_status != "Pending":
            raise HTTPException(status_code=400, detail="HOD has already processed this requisition")
        
        requisition.hod_status = action
        requisition.hod_remarks = remarks
        requisition.hod_approved_at = now
        requisition.hod_approved_by = user_name
        
        # ✅ Update overall status
        if action == "Approved":
            requisition.overall_status = "HOD Approved"
        elif action == "Rejected":
            requisition.overall_status = "HOD Rejected"
            
    elif role == "Dean":
        # ✅ Check if Dean can approve (HOD must have approved first)
        if requisition.hod_status != "Approved":
            raise HTTPException(status_code=400, detail="HOD must approve first before Dean can process")
        if requisition.dean_status != "Pending":
            raise HTTPException(status_code=400, detail="Dean has already processed this requisition")
            
        requisition.dean_status = action
        requisition.dean_remarks = remarks
        requisition.dean_approved_at = now
        requisition.dean_approved_by = user_name
        
        if action == "Approved":
            requisition.overall_status = "Dean Approved"
        elif action == "Rejected":
            requisition.overall_status = "Dean Rejected"
            
    elif role == "Competent Authority":
        # ✅ Check workflow sequence
        if requisition.dean_status != "Approved":
            raise HTTPException(status_code=400, detail="Dean must approve first before CA can process")
        if requisition.ca_status != "Pending":
            raise HTTPException(status_code=400, detail="CA has already processed this requisition")
            
        requisition.ca_status = action
        requisition.ca_remarks = remarks
        requisition.ca_approved_at = now
        requisition.ca_approved_by = user_name
        
        if action == "Approved":
            requisition.overall_status = "CA Approved"
        elif action == "Rejected":
            requisition.overall_status = "CA Rejected"
            
    elif role == "PO":
        # ✅ Check workflow sequence
        if requisition.ca_status != "Approved":
            raise HTTPException(status_code=400, detail="CA must approve first before PO can process")
        if requisition.po_status != "Pending":
            raise HTTPException(status_code=400, detail="PO has already processed this requisition")
            
        requisition.po_status = action
        requisition.po_remarks = remarks
        requisition.po_approved_at = now
        requisition.po_approved_by = user_name
        
        if action == "Approved":
            requisition.overall_status = "PO Approved"
        elif action == "Rejected":
            requisition.overall_status = "PO Rejected"
            
    elif role == "Inventory Admin":
        # ✅ Check workflow sequence
        if requisition.po_status != "Approved":
            raise HTTPException(status_code=400, detail="PO must approve first before Inventory Admin can process")
        if requisition.inventory_status not in ["Pending"]:
            raise HTTPException(status_code=400, detail="Inventory Admin has already processed this requisition")
            
        requisition.inventory_status = action
        requisition.inventory_remarks = remarks
        requisition.inventory_approved_at = now
        requisition.inventory_approved_by = user_name
        
        if action == "Approved":
            requisition.overall_status = "Approved - Ready for Issue"
        elif action == "Issued":
            requisition.overall_status = "Issued"
        elif action == "Rejected":
            requisition.overall_status = "Inventory Rejected"
    else:
        raise HTTPException(status_code=400, detail="Invalid role for approval")
    
    # ✅ Update timestamp
    requisition.updated_at = now
    
    db.commit()
    db.refresh(requisition)
    return requisition

def get_next_approver(requisition: requisition_models.Requisition) -> str:
    """Get the next person who needs to approve this requisition"""
    
    if requisition.hod_status == "Pending":
        return "HOD"
    elif requisition.hod_status == "Approved" and requisition.dean_status == "Pending":
        return "Dean"
    elif requisition.dean_status == "Approved" and requisition.ca_status == "Pending":
        return "Competent Authority"
    elif requisition.ca_status == "Approved" and requisition.po_status == "Pending":
        return "PO"
    elif requisition.po_status == "Approved" and requisition.inventory_status == "Pending":
        return "Inventory Admin"
    else:
        return "Completed"

def can_user_approve(requisition: requisition_models.Requisition, user_role: str) -> bool:
    """Check if user can approve based on current status and their role"""
    
    next_approver = get_next_approver(requisition)
    return user_role == next_approver
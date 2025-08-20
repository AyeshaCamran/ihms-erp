# ✅ Fixed requisition_crud.py
from . import requisition_models, requisition_schemas
from . import models
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from pytz import timezone

KOLKATA = timezone("Asia/Kolkata")

def create_requisition(db: Session, req_data: requisition_schemas.RequisitionCreate):
    # ✅ Convert arrays to comma-separated strings for database storage
    material_types_str = ",".join(req_data.material_types) if req_data.material_types else ""
    requirement_types_str = ",".join(req_data.requirement_types) if req_data.requirement_types else ""
    
    requisition = requisition_models.Requisition(
        department=req_data.department,
        date=req_data.date,
        month=req_data.month,
        justification=req_data.justification,
        material_types=material_types_str,  # ✅ Store as string
        requirement_types=requirement_types_str,  # ✅ Store as string

        # Approval fields - set defaults
        hod_status="Pending",
        dean_status="Pending", 
        inventory_status="Pending",
        hod_remarks=req_data.hod_remarks,
        dean_remarks=req_data.dean_remarks,
        inventory_remarks=req_data.inventory_remarks,

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
            required_qty=item.requiredQty,  # ✅ Map requiredQty -> required_qty
            available_qty=available,        # ✅ Map availableQty -> available_qty  
            issued_qty=issued,              # ✅ Map issuedQty -> issued_qty
            bal_qty=bal,                    # ✅ Map balQty -> bal_qty
            remarks=item.remarks,
        )
        db.add(db_item)

    db.commit()
    db.refresh(requisition)
    return requisition

# ✅ Add function to get requisitions by role and department
def get_requisitions_by_filter(db: Session, role: str = None, department: str = None, status: str = None):
    query = db.query(requisition_models.Requisition)
    
    # ✅ Filter by department if provided
    if department:
        query = query.filter(requisition_models.Requisition.department == department)
    
    # ✅ Filter by status based on role
    if role and status:
        if role == "HOD":
            query = query.filter(requisition_models.Requisition.hod_status == status)
        elif role == "Dean":
            query = query.filter(requisition_models.Requisition.dean_status == status)
        elif role == "Inventory Admin":
            query = query.filter(requisition_models.Requisition.inventory_status == status)
    
    return query.all()

# ✅ Get single requisition by ID
def get_requisition_by_id(db: Session, req_id: int):
    return db.query(requisition_models.Requisition).filter(requisition_models.Requisition.id == req_id).first()
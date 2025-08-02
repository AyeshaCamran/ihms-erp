# ✅ requisition_crud.py (updated with full patch)
from . import requisition_models, requisition_schemas
from . import models
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from pytz import timezone

KOLKATA = timezone("Asia/Kolkata")

def create_requisition(db: Session, req_data: requisition_schemas.RequisitionCreate):
    requisition = requisition_models.Requisition(
        department=req_data.department,
        date=req_data.date,
        month=req_data.month,
        justification=req_data.justification,
        material_types=req_data.material_types,
        requirement_types=req_data.requirement_types,

        # Approval fields
        hod_status="Pending",
        dean_status="Pending",
        stock_status="Pending",
        hod_remarks=req_data.hod_remarks,
        dean_remarks=req_data.dean_remarks,
        stock_remarks=req_data.stock_remarks,

        # Office use
        request_received_on=datetime.now(KOLKATA),
        material_issued_on=req_data.material_issued_on,
        voucher_number=req_data.voucher_number,
        defective_material_received=req_data.defective_material_received,
        store_incharge=req_data.store_incharge,
    )

    db.add(requisition)
    db.flush()

    for item in req_data.items:
        inv_item = db.query(models.InventoryItem).filter(models.InventoryItem.id == item.item_id).first()
        if not inv_item:
            raise HTTPException(status_code=404, detail=f"Inventory item with ID {item.item_id} not found")

        issued = item.issuedQty or 0
        bal = inv_item.qty - issued

        db_item = requisition_models.RequisitionItem(
            requisition_id=requisition.id,
            type=inv_item.type,
            itemname=inv_item.itemname,
            required_qty=item.requiredQty,
            available_qty=inv_item.qty,
            issued_qty=issued,
            bal_qty=bal,
            remarks=item.remarks,
        )
        db.add(db_item)

    db.commit()
    db.refresh(requisition)
    return requisition

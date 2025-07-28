from . import requisition_models, requisition_schemas
from . import models
from sqlalchemy.orm import Session
from fastapi import HTTPException

def create_requisition(db: Session, req_data: requisition_schemas.RequisitionCreate):
    requisition = requisition_models.Requisition(
        department=req_data.department,
        date=req_data.date,
        month=req_data.month,
        justification=req_data.justification,
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

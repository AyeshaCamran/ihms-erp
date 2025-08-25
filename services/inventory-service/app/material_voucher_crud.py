# services/inventory-service/app/material_voucher_crud.py
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi import HTTPException
from . import material_voucher_models, material_voucher_schemas
from datetime import datetime
from pytz import timezone

KOLKATA = timezone("Asia/Kolkata")

def generate_voucher_number(db: Session) -> str:
    """Generate next voucher number"""
    # Get the latest voucher number
    latest_voucher = db.query(material_voucher_models.MaterialVoucher)\
        .filter(material_voucher_models.MaterialVoucher.voucher_no.isnot(None))\
        .order_by(desc(material_voucher_models.MaterialVoucher.voucher_no))\
        .first()
    
    if latest_voucher and latest_voucher.voucher_no:
        try:
            # Extract number from voucher_no (e.g., "23002" -> 23002)
            last_num = int(latest_voucher.voucher_no)
            next_num = last_num + 1
        except ValueError:
            # If voucher number is not a pure integer, start from 23002
            next_num = 23002
    else:
        # First voucher starts from 23002 (as shown in image)
        next_num = 23002
    
    return str(next_num)

def create_material_voucher(db: Session, voucher_data: material_voucher_schemas.MaterialVoucherCreate, user: dict):
    """Create a new material voucher - only Purchase Office (PO) can create"""
    
    # Verify user is from Purchase Office (PO role)
    if user.get("role") != "PO":
        raise HTTPException(status_code=403, detail="Only Purchase Office can create material vouchers")
    
    # Generate voucher number
    voucher_no = generate_voucher_number(db)
    
    data = voucher_data.dict(exclude_unset=True)
    data.pop("voucher_no", None)  # ensure no duplicate
    voucher = material_voucher_models.MaterialVoucher(
        **data,
        voucher_no=voucher_no,
        created_by=user.get("name"),
        status="Issued"
    )
    db.add(voucher)
    db.commit()
    db.refresh(voucher)
    
    return voucher

def get_material_vouchers(db: Session, skip: int = 0, limit: int = 100):
    """Get all material vouchers"""
    return db.query(material_voucher_models.MaterialVoucher)\
        .order_by(desc(material_voucher_models.MaterialVoucher.created_at))\
        .offset(skip).limit(limit).all()

def get_material_voucher(db: Session, voucher_id: int):
    """Get a material voucher by ID"""
    voucher = db.query(material_voucher_models.MaterialVoucher)\
        .filter(material_voucher_models.MaterialVoucher.id == voucher_id).first()
    
    if not voucher:
        raise HTTPException(status_code=404, detail="Material voucher not found")
    
    return voucher

def update_material_voucher(db: Session, voucher_id: int, voucher_data: material_voucher_schemas.MaterialVoucherUpdate, user: dict):
    """Update a material voucher - only Purchase Office (PO) can update"""
    
    # Verify user is from Purchase Office (PO role)
    if user.get("role") != "PO":
        raise HTTPException(status_code=403, detail="Only Purchase Office can update material vouchers")
    
    voucher = get_material_voucher(db, voucher_id)
    
    # Update fields that are provided
    update_data = voucher_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(voucher, field, value)
    
    voucher.updated_at = datetime.now(KOLKATA)
    
    db.commit()
    db.refresh(voucher)
    
    return voucher

def delete_material_voucher(db: Session, voucher_id: int, user: dict):
    """Delete a material voucher - only Purchase Office (PO) can delete"""
    
    # Verify user is from Purchase Office (PO role)
    if user.get("role") != "PO":
        raise HTTPException(status_code=403, detail="Only Purchase Office can delete material vouchers")
    
    voucher = get_material_voucher(db, voucher_id)
    
    db.delete(voucher)
    db.commit()
    
    return {"message": "Material voucher deleted successfully"}

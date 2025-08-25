# services/inventory-service/app/material_voucher_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import material_voucher_crud, material_voucher_schemas
from .database import get_db
from .auth import get_current_user

router = APIRouter()

@router.post("/material-vouchers", response_model=material_voucher_schemas.MaterialVoucherOut)
def create_material_voucher(
    voucher: material_voucher_schemas.MaterialVoucherCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create a new material voucher"""
    try:
        return material_voucher_crud.create_material_voucher(db, voucher, current_user)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/material-vouchers", response_model=List[material_voucher_schemas.MaterialVoucherOut])
def get_material_vouchers(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all material vouchers"""
    return material_voucher_crud.get_material_vouchers(db, skip=skip, limit=limit)

@router.get("/material-vouchers/{voucher_id}", response_model=material_voucher_schemas.MaterialVoucherOut)
def get_material_voucher(
    voucher_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get a material voucher by ID"""
    return material_voucher_crud.get_material_voucher(db, voucher_id)

@router.put("/material-vouchers/{voucher_id}", response_model=material_voucher_schemas.MaterialVoucherOut)
def update_material_voucher(
    voucher_id: int,
    voucher: material_voucher_schemas.MaterialVoucherUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Update a material voucher"""
    return material_voucher_crud.update_material_voucher(db, voucher_id, voucher, current_user)

@router.delete("/material-vouchers/{voucher_id}")
def delete_material_voucher(
    voucher_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Delete a material voucher"""
    return material_voucher_crud.delete_material_voucher(db, voucher_id, current_user)

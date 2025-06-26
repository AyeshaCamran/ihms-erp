from sqlalchemy.orm import Session
from . import return_models, return_schemas

def create_return(db: Session, data: return_schemas.ReturnCreate):
    db_return = return_models.ReturnToVendor(**data.dict())
    db.add(db_return)
    db.commit()
    db.refresh(db_return)
    return db_return

def get_all_returns(db: Session):
    return db.query(return_models.ReturnToVendor).all()

def get_return_by_id(db: Session, return_id: int):
    return db.query(return_models.ReturnToVendor).filter(return_models.ReturnToVendor.id == return_id).first()

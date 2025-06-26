from pydantic import BaseModel
from datetime import datetime

class ReturnBase(BaseModel):
    item_id: int
    quantity: int
    vendor_name: str
    reason: str

class ReturnCreate(ReturnBase):
    pass

class ReturnOut(ReturnBase):
    id: int
    return_date: datetime

    class Config:
        orm_mode = True

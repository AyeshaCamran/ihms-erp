from pydantic import BaseModel

class StockBase(BaseModel):
    item_id: int
    quantity: int
    location: str
    status: str = "Available"  # Default status

class StockCreate(StockBase):
    pass

class StockOut(StockBase):
    id: int

    class Config:
        orm_mode = True

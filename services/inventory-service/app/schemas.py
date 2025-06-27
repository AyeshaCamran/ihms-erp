from pydantic import BaseModel
from datetime import datetime

class InventoryItemBase(BaseModel):
    name: str
    category: str
    unit: str
    min_level: int
    max_level: int
    barcode: str

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemOut(InventoryItemBase):
    id: int

    class Config:
        orm_mode = True

#stock_receive
class StockReceiveBase(BaseModel):
    item_id: int
    quantity: int
    received_by: str

class StockReceiveCreate(StockReceiveBase):
    pass

class StockReceiveOut(StockReceiveBase):
    id: int
    received_at: datetime

    class Config:
        orm_mode = True

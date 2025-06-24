from pydantic import BaseModel

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

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class IssueBase(BaseModel):
    item_id: int
    quantity: int
    department: str
    issued_by: str
    remarks: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class IssueOut(IssueBase):
    id: int
    issue_date: datetime

    class Config:
        orm_mode = True

# from pydantic import BaseModel

# class UserCreate(BaseModel):
#     username: str
#     password: str
#     role: str

# class UserOut(BaseModel):
#     id: int
#     username: str
#     role: str

#     class Config:
#         orm_mode = True


from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    department: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    token: str
    new_password: str

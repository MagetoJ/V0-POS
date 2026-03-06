from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StaffMember(BaseModel):
    id: int
    employee_id: str
    name: str
    role: str
    pin: Optional[str] = None
    is_active: bool
    username: str
    email: Optional[str] = None
    reset_code: Optional[str] = None
    reset_code_expires: Optional[datetime] = None
    requires_clearing: bool = False

    class Config:
        from_attributes = True

class StaffCreate(BaseModel):
    employee_id: str
    name: str
    role: str
    username: str
    password: str
    pin: str
    email: Optional[str] = None

class LoginRequest(BaseModel):
    employee_id: str
    pin: str

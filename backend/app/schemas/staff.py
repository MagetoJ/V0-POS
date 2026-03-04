from pydantic import BaseModel
from typing import Optional

class StaffMember(BaseModel):
    id: int
    employee_id: str
    name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class StaffCreate(BaseModel):
    employee_id: str
    name: str
    role: str
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str

from pydantic import BaseModel
from typing import Optional

class Room(BaseModel):
    id: str
    type: str
    status: str
    price: Optional[float] = None
    guest: Optional[str] = None
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    last_guest: Optional[str] = None
    issue: Optional[str] = None

    class Config:
        from_attributes = True

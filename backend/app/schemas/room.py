from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Room(BaseModel):
    id: int
    room_number: str
    room_type: Optional[str] = None
    status: str = 'available'
    guest_name: Optional[str] = None
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    rate: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    image_url: Optional[str] = None
    amenities: Optional[str] = None
    floor: Optional[int] = None
    max_occupancy: Optional[int] = None

    class Config:
        from_attributes = True

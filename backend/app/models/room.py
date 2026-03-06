from sqlalchemy import Column, String, Integer, Float, DateTime, text
from ..database import Base

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, unique=True, nullable=False)
    room_type = Column(String)
    status = Column(String, default='available') # available, occupied, dirty, maintenance
    guest_name = Column(String, nullable=True)
    check_in_date = Column(DateTime, nullable=True)
    check_out_date = Column(DateTime, nullable=True)
    rate = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'), onupdate=text('CURRENT_TIMESTAMP'))
    image_url = Column(String)
    amenities = Column(String) # JSON or comma-separated string
    floor = Column(Integer)
    max_occupancy = Column(Integer)

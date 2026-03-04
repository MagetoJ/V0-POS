from sqlalchemy import Column, String, Enum, Float, ForeignKey
from ..database import Base

class Room(Base):
    __tablename__ = "rooms"
    id = Column(String, primary_key=True, index=True)
    type = Column(String)
    status = Column(Enum('available', 'occupied', 'dirty', 'maintenance', name='room_status'), default='available')
    price = Column(Float, nullable=True)
    guest = Column(String, nullable=True)
    check_in = Column(String, nullable=True)
    check_out = Column(String, nullable=True)
    last_guest = Column(String, nullable=True)
    issue = Column(String, nullable=True)

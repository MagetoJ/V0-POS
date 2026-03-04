from sqlalchemy import Column, String, Integer, Enum
from ..database import Base

class Table(Base):
    __tablename__ = "tables"
    id = Column(String, primary_key=True, index=True)
    number = Column(String, unique=True, index=True)
    capacity = Column(Integer)
    status = Column(Enum('available', 'occupied', 'reserved', name='table_status'), default='available')
    zone = Column(String, nullable=True)

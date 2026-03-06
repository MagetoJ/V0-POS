from sqlalchemy import Column, Integer, String, Boolean, text, DateTime
from ..database import Base

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True)
    employee_id = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    pin = Column(String, nullable=False) # Actual DB column name
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False) # Actual DB column name
    email = Column(String, nullable=True)
    is_active = Column(Boolean, server_default=text('true'))
    reset_code = Column(String, nullable=True)
    reset_code_expires = Column(DateTime, nullable=True)
    requires_clearing = Column(Boolean, server_default=text('false'))

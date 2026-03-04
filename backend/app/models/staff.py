from sqlalchemy import Column, Integer, String, Enum
from ..database import Base

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(Enum('admin', 'manager', 'cashier', 'waiter', 'kitchen_staff', 'receptionist', 'delivery', 'housekeeping', 'staff', 'accountant', name='user_role'))
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    hashed_password = Column(String)
    status = Column(String, default='active')

from sqlalchemy import Column, Integer, String, Enum
from ..database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True)
    role = Column(Enum('admin', 'manager', 'cashier', 'waiter', 'kitchen_staff', 'receptionist', 'delivery', 'housekeeping', 'staff', 'accountant', name='user_role'))
    hashed_password = Column(String)

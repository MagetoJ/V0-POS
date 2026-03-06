from sqlalchemy import Column, String, Integer, Float, DateTime, text, ForeignKey
from ..database import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, nullable=False)
    order_type = Column(String, nullable=False)
    table_id = Column(Integer, nullable=True)
    room_id = Column(Integer, nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    staff_id = Column(Integer, nullable=True)
    status = Column(String, default='pending')
    subtotal = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    payment_status = Column(String, default='unpaid')
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

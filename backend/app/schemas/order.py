from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    product_id: int
    quantity: int

class Order(BaseModel):
    id: int
    order_number: str
    order_type: str
    table_id: Optional[int] = None
    room_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    staff_id: Optional[int] = None
    status: str
    subtotal: float
    total_amount: float
    payment_status: str
    created_at: Optional[datetime] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

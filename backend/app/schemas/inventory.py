from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InventoryItem(BaseModel):
    id: int
    name: str
    unit: Optional[str] = None
    current_stock: int = 0
    minimum_stock: int = 10
    cost_per_unit: Optional[float] = None
    supplier: Optional[str] = None
    inventory_type: str = "bar" # bar (auto-deduct) or kitchen (static)
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    image_url: Optional[str] = None
    allowed_roles: Optional[str] = None
    buying_price: Optional[float] = None
    reorder_level: int = 10

    class Config:
        from_attributes = True

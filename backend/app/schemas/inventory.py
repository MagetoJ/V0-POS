from pydantic import BaseModel
from typing import Optional

class InventoryItem(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    item_type: str
    stock_level: int
    reorder_point: int
    unit: str
    price: float
    show_online: bool
    description: Optional[str] = None
    is_available: bool

    class Config:
        from_attributes = True

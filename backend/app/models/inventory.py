from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, text
from ..database import Base

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String)
    current_stock = Column(Integer, default=0)
    minimum_stock = Column(Integer, default=10)
    cost_per_unit = Column(Float)
    supplier = Column(String)
    inventory_type = Column(String, default="bar") # bar (auto-deduct) or kitchen (static)
    is_active = Column(Boolean, server_default=text('true'))
    created_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, server_default=text('CURRENT_TIMESTAMP'), onupdate=text('CURRENT_TIMESTAMP'))
    image_url = Column(String)
    allowed_roles = Column(String) # JSON or comma-separated string
    buying_price = Column(Float)
    reorder_level = Column(Integer, default=10)

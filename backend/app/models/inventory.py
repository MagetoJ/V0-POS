from sqlalchemy import Column, String, Integer, Float, Boolean
from ..database import Base

class InventoryItem(Base):
    __tablename__ = "inventory"
    id = Column(String, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    item_type = Column(String, default="bar") # bar or menu
    stock_level = Column(Integer, default=0)
    reorder_point = Column(Integer, default=10)
    unit = Column(String)
    price = Column(Float)
    description = Column(String)
    is_available = Column(Boolean, default=True)
    show_online = Column(Boolean, default=False)

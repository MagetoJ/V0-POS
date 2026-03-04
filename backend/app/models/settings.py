from sqlalchemy import Column, Integer, Boolean, String
from ..database import Base

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    is_online_enabled = Column(Boolean, default=False)
    online_slug = Column(String, default="mariahavens")

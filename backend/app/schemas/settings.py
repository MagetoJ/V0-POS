from pydantic import BaseModel
from typing import Optional

class SettingBase(BaseModel):
    is_online_enabled: bool
    online_slug: str

class Setting(SettingBase):
    id: int

    class Config:
        from_attributes = True

class OnlineStoreUpdate(BaseModel):
    enabled: Optional[bool] = None
    slug: Optional[str] = None

class OnlineStoreToggle(BaseModel):
    enabled: bool

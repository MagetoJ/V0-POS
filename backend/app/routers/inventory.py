from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from ..models.inventory import InventoryItem as InventoryModel
from ..schemas.inventory import InventoryItem as InventorySchema
from pydantic import BaseModel

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

class OnlineToggle(BaseModel):
    show_online: bool

@router.get("/", response_model=list[InventorySchema])
def get_all_inventory(db: Session = Depends(database.get_db)):
    return db.query(InventoryModel).all()

@router.patch("/{item_id}/online")
def toggle_item_online(item_id: str, toggle: OnlineToggle, db: Session = Depends(database.get_db)):
    item = db.query(InventoryModel).filter(InventoryModel.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item.show_online = toggle.show_online
    db.commit()
    db.refresh(item)
    return item

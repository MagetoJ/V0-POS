from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..models.inventory import InventoryItem
from ..models.settings import Setting

router = APIRouter(prefix="/api/public", tags=["public"])

@router.get("/menu/{slug}")
def get_public_menu(slug: str, db: Session = Depends(database.get_db)):
    settings = db.query(Setting).filter(Setting.online_slug == slug).first()
    
    if not settings:
        raise HTTPException(status_code=404, detail="Store not found")
        
    if not settings.is_online_enabled:
        raise HTTPException(status_code=503, detail="Online menu is currently disabled")

    # Only return products marked for online display
    items = db.query(InventoryItem).filter(InventoryItem.show_online == True).all()
    return items

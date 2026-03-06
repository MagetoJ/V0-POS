from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from ..models.inventory import InventoryItem as InventoryModel
from ..schemas.inventory import InventoryItem as InventorySchema
from pydantic import BaseModel

router = APIRouter(prefix="/api/inventory", tags=["inventory"])

@router.get("/", response_model=list[InventorySchema])
def get_all_inventory(db: Session = Depends(database.get_db)):
    return db.query(InventoryModel).all()

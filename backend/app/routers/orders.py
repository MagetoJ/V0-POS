from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import database, models
from ..schemas.order import Order
from ..models.inventory import InventoryItem

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/process")
async def process_order(order: Order, db: Session = Depends(database.get_db)):
    for item in order.items:
        product = db.query(InventoryItem).filter(InventoryItem.id == item.product_id).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item.product_id} not found")
            
        if product.inventory_type == "bar":
            if product.current_stock < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")
            product.current_stock -= item.quantity # Automatic deduction
            
    db.commit()
    return {"status": "Order processed successfully"}

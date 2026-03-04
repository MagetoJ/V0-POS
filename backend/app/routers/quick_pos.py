from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
from typing import List

router = APIRouter(
    prefix="/api/quick-pos",
    tags=["quick-pos"]
)

@router.post("/checkout")
async def checkout(order: schemas.order.Order, db: Session = Depends(get_db)):
    for item in order.items:
        # Fetch the item from the uniform database link
        product = db.query(models.inventory.InventoryItem).filter(models.inventory.InventoryItem.id == item.product_id).first()
        
        if not product:
            raise HTTPException(status_code=404, detail=f"Product with ID {item.product_id} not found")

        if product.item_type == "bar":
            # Bar logic: Automatic Deduction
            if product.stock_level < item.quantity:
                raise HTTPException(status_code=400, detail=f"Out of stock: {product.name}")
            product.stock_level -= item.quantity
        
        # Food logic: Only the sale is recorded (recording logic would go here)
        # For now, we just ensure the product exists and is processed
        
    db.commit()
    return {"message": "Transaction complete"}

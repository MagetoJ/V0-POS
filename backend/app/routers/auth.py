from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth_utils

router = APIRouter(prefix="/api/auth", tags=["auth"])

import time

@router.post("/login")
def login(credentials: schemas.LoginRequest, db: Session = Depends(database.get_db)):
    start_time = time.time()
    
    # 1. Fetch user by employee_id from Render DB
    user = db.query(models.Staff).filter(models.Staff.employee_id == credentials.employee_id).first()
    db_time = time.time() - start_time
    print(f"DB lookup took: {db_time:.4f}s")
    
    # 2. Check if user exists
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # 3. Verify PIN (using the correct 'pin' column)
    verify_start = time.time()
    is_valid = auth_utils.verify_password(credentials.pin, user.pin)
    verify_time = time.time() - verify_start
    print(f"PIN verification took: {verify_time:.4f}s")
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid PIN")

    total_time = time.time() - start_time
    print(f"Total backend login time: {total_time:.4f}s")

    return {
        "user": {
            "name": user.name,
            "role": user.role,
            "username": user.username,
            "employee_id": user.employee_id
        },
        "token": auth_utils.create_access_token(data={"sub": user.employee_id})
    }

class VerifyPinRequest(schemas.staff.BaseModel):
    employee_id: str
    pin: str

@router.post("/verify-pin")
def verify_pin(request: VerifyPinRequest, db: Session = Depends(database.get_db)):
    user = db.query(models.Staff).filter(models.Staff.employee_id == request.employee_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if not auth_utils.verify_password(request.pin, user.pin):
        raise HTTPException(status_code=401, detail="Invalid PIN")
    return {"name": user.name, "role": user.role, "employee_id": user.employee_id}

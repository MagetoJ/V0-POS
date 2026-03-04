from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from ..database import get_db
from .. import models, schemas, auth_utils
from pydantic import BaseModel
import os

# Configuration for JWT
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-keep-it-safe")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    employee_id: str
    name: str

class LoginRequest(BaseModel):
    employee_id: str
    password: str

class PinVerifyRequest(BaseModel):
    employee_id: str
    pin: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.staff.Staff).filter(
        func.lower(models.staff.Staff.employee_id) == func.lower(login_data.employee_id)
    ).first()
    
    if not user or not auth_utils.verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect employee ID or PIN",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.status != 'active':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.employee_id, "role": user.role, "name": user.name},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role,
        "employee_id": user.employee_id,
        "name": user.name
    }

@router.post("/verify-pin")
async def verify_pin(data: PinVerifyRequest, db: Session = Depends(get_db)):
    user = db.query(models.staff.Staff).filter(
        func.lower(models.staff.Staff.employee_id) == func.lower(data.employee_id)
    ).first()
    
    if not user or not auth_utils.verify_password(data.pin, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid PIN"
        )
    
    return {"status": "success", "employee_id": user.employee_id, "name": user.name}

@router.get("/me")
async def get_me(db: Session = Depends(get_db)):
    # This would normally use a security dependency to get the current user
    # For now, we'll keep it simple
    return {"message": "Authenticated"}

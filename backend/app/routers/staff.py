from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..models.staff import Staff
from ..schemas.staff import StaffMember

router = APIRouter(prefix="/api/staff", tags=["staff"])

@router.get("/", response_model=list[StaffMember])
def get_all_staff(db: Session = Depends(database.get_db)):
    # This queries the 'staff' table in your Render database
    return db.query(Staff).all()

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

@router.get("/public", response_model=list[dict])
def get_public_staff_list(db: Session = Depends(database.get_db)):
    # Only return necessary fields for public picker
    staff = db.query(Staff).filter(Staff.is_active == True).all()
    return [{"employee_id": s.employee_id, "name": s.name} for s in staff]

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import database
from ..models.room import Room as RoomModel
from ..schemas.room import Room as RoomSchema

router = APIRouter(prefix="/api/rooms", tags=["rooms"])

@router.get("/", response_model=list[RoomSchema])
def get_all_rooms(db: Session = Depends(database.get_db)):
    return db.query(RoomModel).all()

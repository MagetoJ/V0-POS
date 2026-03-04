from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, database
from ..schemas.settings import OnlineStoreToggle, OnlineStoreUpdate, Setting as SettingSchema

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("/", response_model=SettingSchema)
def get_settings(db: Session = Depends(database.get_db)):
    setting = db.query(models.Setting).first()
    if not setting:
        # Create default if it doesn't exist
        setting = models.Setting(is_online_enabled=False, online_slug="mariahavens")
        db.add(setting)
        db.commit()
        db.refresh(setting)
    return setting

@router.patch("/online-store")
def update_online_store(update: OnlineStoreUpdate, db: Session = Depends(database.get_db)):
    setting = db.query(models.Setting).first()
    if not setting:
        setting = models.Setting(
            is_online_enabled=update.enabled if update.enabled is not None else False,
            online_slug=update.slug if update.slug is not None else "mariahavens"
        )
        db.add(setting)
    else:
        if update.enabled is not None:
            setting.is_online_enabled = update.enabled
        if update.slug is not None:
            setting.online_slug = update.slug
            
    db.commit()
    db.refresh(setting)
    return setting

@router.patch("/online-toggle")
def toggle_online_store(toggle: OnlineStoreToggle, db: Session = Depends(database.get_db)):
    setting = db.query(models.Setting).first()
    if not setting:
        setting = models.Setting(is_online_enabled=toggle.enabled)
        db.add(setting)
    else:
        setting.is_online_enabled = toggle.enabled
    db.commit()
    return {"status": "success", "online": toggle.enabled}

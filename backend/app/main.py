from fastapi import FastAPI
from .database import engine, Base
from .routers import staff, room, inventory, settings, public_menu, orders

# Create tables
# Note: In a production environment with existing tables, you might want to use Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="VO POS API")

app.include_router(staff.router)
app.include_router(room.router)
app.include_router(inventory.router)
app.include_router(settings.router)
app.include_router(public_menu.router)
app.include_router(orders.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to VO POS API connected to Render DB"}

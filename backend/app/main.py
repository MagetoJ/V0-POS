from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import staff, room, inventory, settings, public_menu, orders, quick_pos, auth

# Create tables
# Note: In a production environment with existing tables, you might want to use Alembic
# Base.metadata.create_all(bind=engine)

app = FastAPI(title="VO POS API")

# Establish the uniform link by allowing your frontend origin
origins = [
    "http://localhost:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(staff.router)
app.include_router(room.router)
app.include_router(inventory.router)
app.include_router(settings.router)
app.include_router(public_menu.router)
app.include_router(orders.router)
app.include_router(quick_pos.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to VO POS API connected to Render DB"}

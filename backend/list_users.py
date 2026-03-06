import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models

def list_users():
    db = SessionLocal()
    try:
        users = db.query(models.Staff).all()
        if not users:
            print("No users found in the database.")
            return
            
        print(f"{'Username':<20} | {'Name':<20} | {'Role':<10} | {'Employee ID':<10}")
        print("-" * 65)
        for user in users:
            print(f"{user.username:<20} | {user.name:<20} | {user.role:<10} | {user.employee_id:<10}")
            
    except Exception as e:
        print(f"Error listing users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sys.path.append(os.getcwd())
    list_users()

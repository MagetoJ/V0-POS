import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, auth_utils

def fix_admin():
    db = SessionLocal()
    try:
        # Find user 'admin'
        user = db.query(models.Staff).filter(models.Staff.username == "admin").first()
        if not user:
            print("User 'admin' not found. Creating one...")
            user = models.Staff(
                username="admin",
                name="Admin User",
                role="admin",
                employee_id="EMP005",
                email="admin@example.com"
            )
            db.add(user)
        
        # Set PIN to '1234'
        user.pin = auth_utils.get_password_hash("1234")[:72]
        # Set password to 'admin123'
        user.password = auth_utils.get_password_hash("admin123")[:72]
        
        db.commit()
        print(f"User 'admin' updated with PIN: 1234")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    sys.path.append(os.getcwd())
    fix_admin()

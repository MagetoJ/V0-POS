from app.database import SessionLocal
from app import models, auth_utils
import os
import sys

def create_test_user():
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(models.Staff).filter(
            models.Staff.employee_id == "Kizito-MH"
        ).first()

        if existing_user:
            # Delete the old plain-text user so we can make a hashed one
            db.delete(existing_user)
            db.commit()
            print("Deleted existing user Kizito-MH to replace with hashed credentials.")

        # Hash the credentials
        hashed_pin = auth_utils.get_password_hash("1234")
        hashed_password = auth_utils.get_password_hash("securepassword123")

        new_admin = models.Staff(
            employee_id="Kizito-MH",
            name="Kizito Maria",
            role="admin",
            pin=hashed_pin,
            username="kizito_admin",
            password=hashed_password,
            is_active=True
        )
        db.add(new_admin)
        db.commit()
        print("Successfully created Admin user: Kizito-MH with HASHED PIN.")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # Add the current directory to sys.path to import app
    sys.path.append(os.getcwd())
    create_test_user()

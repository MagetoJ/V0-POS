import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, auth_utils

def check_user(username):
    db = SessionLocal()
    try:
        user = db.query(models.Staff).filter(models.Staff.username == username).first()
        if not user:
            print(f"User '{username}' not found.")
            return
            
        print(f"User: {user.username}")
        print(f"Name: {user.name}")
        print(f"Role: {user.role}")
        
        # Test default PINs
        test_pins = ["1234", "9012", "1111", "2222"]
        for pin in test_pins:
            if auth_utils.verify_password(pin, user.pin):
                print(f"FOUND VALID PIN: {pin}")
                return
        
        print("No default PIN (1234, 9012, 1111, 2222) matches for this user.")
            
    except Exception as e:
        print(f"Error checking user: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    sys.path.append(os.getcwd())
    # Check a few common ones from the UI
    check_user("admin")
    print("-" * 20)
    check_user("manager")
    print("-" * 20)
    check_user("Kizito-MH")

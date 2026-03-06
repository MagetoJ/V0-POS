import sys
import os
from sqlalchemy import text
from app.database import engine
from app import auth_utils

def raw_fix_admin():
    try:
        # Generate hashes
        pin_hash = auth_utils.get_password_hash("1234")
        password_hash = auth_utils.get_password_hash("admin123")
        
        # Truncate if needed (bcrypt max is 72, though normally hashes are ~60)
        if len(pin_hash) > 72: pin_hash = pin_hash[:72]
        if len(password_hash) > 72: password_hash = password_hash[:72]

        with engine.connect() as connection:
            # Check if admin exists
            result = connection.execute(text("SELECT id FROM staff WHERE username = 'admin'")).fetchone()
            
            if result:
                # Update existing
                connection.execute(
                    text("UPDATE staff SET pin = :pin, password = :pwd WHERE username = 'admin'"),
                    {"pin": pin_hash, "pwd": password_hash}
                )
                print("Updated existing 'admin' user.")
            else:
                # Insert new
                connection.execute(
                    text("INSERT INTO staff (username, name, role, employee_id, pin, password, email, is_active) "
                         "VALUES ('admin', 'Admin User', 'admin', 'EMP005', :pin, :pwd, 'admin@example.com', true)"),
                    {"pin": pin_hash, "pwd": password_hash}
                )
                print("Created new 'admin' user.")
            
            connection.commit()
            print("Successfully set credentials for 'admin': PIN=1234, Password=admin123")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    sys.path.append(os.getcwd())
    raw_fix_admin()

import sys
import os
from sqlalchemy import text
from app.database import engine

def check_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Successfully connected to the database!")
            return True
    except Exception as e:
        print(f"Failed to connect: {e}")
        return False

if __name__ == "__main__":
    # Add the current directory to sys.path to import app
    sys.path.append(os.getcwd())
    check_connection()

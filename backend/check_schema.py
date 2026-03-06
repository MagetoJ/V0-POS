from sqlalchemy import inspect
from app.database import engine

def show_tables_and_columns():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if not tables:
            print("No tables found in the database.")
            return

        for table in tables:
            print(f"\n--- TABLE: {table} ---")
            columns = inspector.get_columns(table)
            column_names = [col['name'] for col in columns]
            print(f"COLUMNS: {', '.join(column_names)}")
            
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    show_tables_and_columns()
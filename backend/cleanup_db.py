from sqlalchemy import text
from app.database import engine

# List of tables to remove based on your schema check
TABLES_TO_REMOVE = [
    "schools", 
    "subscriptions", 
    "subscription_plans", 
    "password_reset_tokens", 
    "user_sessions", 
    "users",
    "knex_migrations",
    "knex_migrations_lock"
]

def drop_bloat_tables():
    with engine.connect() as connection:
        # Start a transaction
        trans = connection.begin()
        try:
            for table in TABLES_TO_REMOVE:
                print(f"Dropping table: {table}...")
                # CASCADE ensures that foreign keys/dependencies are also removed
                connection.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE;"))
            
            trans.commit()
            print("\nSuccessfully cleaned the database of school/subscription bloat!")
        except Exception as e:
            trans.rollback()
            print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    drop_bloat_tables()
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # This must match the key in your .env file exactly
    DATABASE_URL: str 
    
    # Configure Pydantic to look for the .env file in the current or parent directory
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # Ignore extra env vars not defined here
    )

settings = Settings()

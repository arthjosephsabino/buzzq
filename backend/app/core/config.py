from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    DATABASE_URL: str
    QR_CODE_BASE_URL: str
    ENV: Literal["local", "staging", "production"] = "local"
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

settings = Settings()
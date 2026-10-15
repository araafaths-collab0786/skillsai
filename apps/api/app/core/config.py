from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    PROJECT_NAME: str = "SkillLens AI"
    API_V1_STR: str = "/api/v1"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017/skilllens"
    MONGO_DB_NAME: str = "skilllens"
    
    # Security & Auth
    JWT_SECRET_KEY: str = "demo_jwt_secret_key_change_in_production_min32chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Cookie Settings (Section 8 Hardening)
    # COOKIE_SECURE is false only when APP_ENV=development and explicitly configured
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Document Upload & Processing Limits (Section 8)
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    MAX_IMAGE_WIDTH: int = 4000
    MAX_IMAGE_HEIGHT: int = 4000
    MAX_IMAGE_PIXELS: int = 16_000_000  # 16 MP
    MAX_PDF_PAGES: int = 5
    PROCESSING_TIMEOUT_SECONDS: int = 20
    FILE_RETENTION_DAYS: int = 30
    UPLOAD_DIR: str = "./uploads"
    
    # Rate Limits
    UPLOAD_RATE_LIMIT_PER_HOUR: int = 20
    LOGIN_RATE_LIMIT_PER_MINUTE: int = 5

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

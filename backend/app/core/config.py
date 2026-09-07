import os
from functools import lru_cache
from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables and .env file."""

    # Project Information
    PROJECT_NAME: str = "Codeforge API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Hackathon REST API built with FastAPI, SQLite, and Uvicorn"

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = int(os.getenv("PORT", "8000"))
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "hackathon-dev-secret-key-replace-in-production-min-32-chars"

    # Database
    DATABASE_URL: str = "sqlite:///./hackathon.db"

    # AI Provider Keys & Model Settings
    GROQ_API_KEY: Optional[str] = None
    GROK_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    @property
    def effective_groq_api_key(self) -> Optional[str]:
        return self.GROQ_API_KEY or self.GROK_API_KEY

    # CORS Configuration
    CORS_ORIGINS: Union[str, List[str]] = ["*"]
    CORS_ORIGIN_REGEX: str = r"^(https?:\/\/.*\.onrender\.com|http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.strip() == "*":
                return ["*"]
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        if isinstance(v, list):
            return [str(origin).strip() for origin in v]
        return []

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()

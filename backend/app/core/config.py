from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "AI Academic Assistant API"
    api_v1_prefix: str = "/api/v1"
    backend_cors_origins: List[str] = ["http://localhost:5173"]

    supabase_url: str = ""
    supabase_service_role_key: str = ""
    supabase_interactions_table: str = "interactions"
    supabase_students_table: str = "students"

    gemini_api_key: str = ""
    gemini_model: str = "gemini-1.5-flash"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()

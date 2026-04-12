from functools import lru_cache
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import get_settings
from app.services.gemini_service import GeminiService
from app.services.supabase_service import SupabaseService

oauth2_scheme = HTTPBearer()

@lru_cache
def get_gemini_service() -> GeminiService:
    settings = get_settings()
    return GeminiService(api_key=settings.gemini_api_key, model_name=settings.gemini_model)

@lru_cache
def get_supabase_service() -> SupabaseService:
    settings = get_settings()
    return SupabaseService(
        url=settings.supabase_url,
        service_role_key=settings.supabase_service_role_key,
        interactions_table=settings.supabase_interactions_table,
        students_table=settings.supabase_students_table,
    )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    try:
        token = credentials.credentials
        user_resp = supabase_service.client.auth.get_user(token)
        if not user_resp or not user_resp.user:
            raise ValueError("No user found")
        return user_resp.user
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

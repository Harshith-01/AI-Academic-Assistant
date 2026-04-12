from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_gemini_service, get_supabase_service, get_current_user
from app.schemas.assistant import AskRequest, AskResponse
from app.services.gemini_service import GeminiService
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/assistant", tags=["assistant"], dependencies=[Depends(get_current_user)])


@router.post("/ask", response_model=AskResponse)
def ask_assistant(
    payload: AskRequest,
    gemini_service: GeminiService = Depends(get_gemini_service),
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    if not payload.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    response_text = gemini_service.generate_response(payload.prompt)
    supabase_service.log_interaction(payload.prompt, response_text)

    return AskResponse(response=response_text)

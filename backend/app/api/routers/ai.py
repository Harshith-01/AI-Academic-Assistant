import json
from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_gemini_service, get_supabase_service, get_current_user
from app.schemas.ai import AnalyzeRequest, AnalyzeResponse, AnalyzeClassResponse
from app.services.gemini_service import GeminiService
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/ai", tags=["ai"], dependencies=[Depends(get_current_user)])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_student(
    payload: AnalyzeRequest,
    gemini_service: GeminiService = Depends(get_gemini_service),
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    student = supabase_service.get_student_by_id(payload.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    answer = gemini_service.analyze_student(data=student, query=payload.query)
    supabase_service.log_interaction(payload.query, answer)
    return AnalyzeResponse(answer=answer)


@router.post("/analyze_class", response_model=AnalyzeClassResponse)
def analyze_class(
    gemini_service: GeminiService = Depends(get_gemini_service),
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    students = supabase_service.get_students()
    
    at_risk_students = []
    
    for s in students:
        attendance = s.get("attendance")
        att_val = 100
        if attendance is not None:
            if isinstance(attendance, str):
                att_val = float(attendance.replace("%", "").strip())
            else:
                att_val = float(attendance)
        
        math_marks = float(s.get("math_marks") or 0)
        science_marks = float(s.get("science_marks") or 0)
        english_marks = float(s.get("english_marks") or 0)
        avg_marks = (math_marks + science_marks + english_marks) / 3
        
        if att_val < 75 or avg_marks < 60:
            at_risk_students.append({
                "name": s.get("name"),
                "attendance": att_val,
                "avg_marks": avg_marks
            })

    data_for_prompt = {
        "total_students": len(students),
        "at_risk_count": len(at_risk_students),
        "at_risk_students": at_risk_students,
    }

    try:
        json_str = gemini_service.analyze_class_data(data_for_prompt)
        if json_str.startswith("```json"):
            json_str = json_str.replace("```json", "").replace("```", "").strip()
        elif json_str.startswith("```"):
            json_str = json_str.replace("```", "").strip()
            
        parsed = json.loads(json_str)
        return AnalyzeClassResponse(**parsed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze class data: {str(e)}")

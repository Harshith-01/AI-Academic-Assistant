from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import get_supabase_service, get_current_user
from app.schemas.student import StudentResponse, StudentsResponse
from app.services.supabase_service import SupabaseService

router = APIRouter(prefix="/students", tags=["students"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=StudentsResponse)
def get_students(
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    students = supabase_service.get_students()
    return StudentsResponse(students=students)


@router.get("/{id}", response_model=StudentResponse)
def get_student(
    id: str,
    supabase_service: SupabaseService = Depends(get_supabase_service),
):
    student = supabase_service.get_student_by_id(id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentResponse(student=student)

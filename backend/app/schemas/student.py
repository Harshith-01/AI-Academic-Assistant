from pydantic import BaseModel


class Student(BaseModel):
    id: str | int
    name: str
    attendance: float
    math_marks: float
    science_marks: float
    english_marks: float


class StudentsResponse(BaseModel):
    students: list[Student]


class StudentResponse(BaseModel):
    student: Student

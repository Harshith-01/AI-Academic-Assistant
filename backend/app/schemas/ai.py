from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    student_id: str = Field(..., min_length=1)
    query: str = Field(..., min_length=1, max_length=8000)


class AnalyzeResponse(BaseModel):
    answer: str


class InsightCard(BaseModel):
    title: str
    value: str
    subtitle: str


class AnalyzeClassResponse(BaseModel):
    cards: list[InsightCard]
    summary: str

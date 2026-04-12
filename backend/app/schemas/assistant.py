from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)


class AskResponse(BaseModel):
    response: str

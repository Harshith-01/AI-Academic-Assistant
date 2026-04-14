from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import ai, assistant, health, students
from app.core.config import get_settings

settings = get_settings()

print(f"Backend CORS origins: {settings.backend_cors_origin_list}")
print(f"API prefix: {settings.api_v1_prefix}")

app = FastAPI(title=settings.project_name)

@app.options("/{full_path:path}")
async def preflight(full_path: str) -> Response:
    return Response(status_code=200)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.api_v1_prefix)
app.include_router(assistant.router, prefix=settings.api_v1_prefix)
app.include_router(students.router)
app.include_router(ai.router)

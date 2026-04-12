from datetime import datetime, timezone

from fastapi import HTTPException
from supabase import Client, create_client

STUDENT_COLUMNS = "id,name,attendance,math_marks,science_marks,english_marks"


class SupabaseService:
    def __init__(
        self,
        url: str,
        service_role_key: str,
        interactions_table: str,
        students_table: str,
    ):
        self.url = url
        self.service_role_key = service_role_key
        self.interactions_table = interactions_table
        self.students_table = students_table
        self.client: Client | None = None

        if self.url and self.service_role_key:
            self.client = create_client(self.url, self.service_role_key)

    def _require_client(self) -> Client:
        if not self.client:
            raise HTTPException(
                status_code=500,
                detail="Supabase credentials are not configured",
            )
        return self.client

    def get_students(self) -> list[dict]:
        client = self._require_client()
        response = (
            client.table(self.students_table)
            .select(STUDENT_COLUMNS)
            .order("name")
            .execute()
        )
        return response.data or []

    def get_student_by_id(self, student_id: str) -> dict | None:
        client = self._require_client()
        response = (
            client.table(self.students_table)
            .select(STUDENT_COLUMNS)
            .eq("id", student_id)
            .limit(1)
            .execute()
        )
        data = response.data or []
        return data[0] if data else None

    def log_interaction(self, prompt: str, response: str) -> None:
        if not self.client:
            return

        payload = {
            "prompt": prompt,
            "response": response,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        self.client.table(self.interactions_table).insert(payload).execute()

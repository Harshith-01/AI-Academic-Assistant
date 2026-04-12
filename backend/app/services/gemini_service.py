from typing import Any

from fastapi import HTTPException

try:
    import google.generativeai as genai
except ImportError as exc:  # pragma: no cover
    raise ImportError("google-generativeai is required. Install dependencies first.") from exc


class GeminiService:
    def __init__(self, api_key: str, model_name: str):
        self.api_key = api_key
        self.model_name = model_name or "gemini-1.5-flash"

    def _run_prompt(self, prompt: str) -> str:
        if not self.api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

        genai.configure(api_key=self.api_key)
        model = genai.GenerativeModel(self.model_name)
        result = model.generate_content(prompt)

        response_text = getattr(result, "text", "")
        if not response_text:
            raise HTTPException(status_code=502, detail="Gemini returned an empty response")

        return response_text.strip()

    def generate_response(self, prompt: str) -> str:
        return self._run_prompt(prompt)

    def analyze_student(self, data: dict[str, Any], query: str) -> str:
        prompt = (
            "You are an academic performance assistant. "
            "Write a short, professional, structured response with exactly these headings:\n"
            "1) Performance Summary\n"
            "2) Weak Subjects\n"
            "3) Suggested Improvements\n\n"
            "Rules:\n"
            "- Keep total output under 140 words.\n"
            "- Be concise and actionable.\n"
            "- Use plain, clear language.\n\n"
            f"Student data: {data}\n"
            f"User query: {query}"
        )
        return self._run_prompt(prompt)

    def analyze_class_data(self, data: dict[str, Any]) -> str:
        prompt = (
            "You are an academic performance assistant. "
            "Analyze the following class data and provide a JSON response exactly matching this schema: "
            '{"cards": [{"title": "Risk Level", "value": "X students at risk", "subtitle": "attendance < 75 or marks < 60"}, ...], "summary": "Narrative summary about the class"} '
            "Constraints:\n"
            "- Exactly 3 cards.\n"
            "- 'summary' should be max 50 words.\n"
            "- Provide only valid JSON without markdown formatting backticks.\n\n"
            f"Class data: {data}"
        )
        return self._run_prompt(prompt)

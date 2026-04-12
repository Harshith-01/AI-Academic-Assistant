# AI Academic Assistant

A full-stack starter project with:
- Frontend: React (Vite) + Tailwind CSS + SaaS dashboard UI
- Backend: FastAPI with modular routers/services
- Database: Supabase (PostgreSQL)
- AI: Google Gemini API

## Project Structure

```text
ai-academic-assistant/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/
│   │   │   └── layout/
│   │   ├── data/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── backend/
    ├── app/
    │   ├── api/
    │   │   ├── routers/
    │   │   └── deps.py
    │   ├── core/
    │   ├── db/
    │   ├── schemas/
    │   ├── services/
    │   └── main.py
    ├── .env.example
    └── requirements.txt
```

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Set environment variables from `.env.example` in both `frontend` and `backend`.

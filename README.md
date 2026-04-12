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

## Deployment Setup

### Supabase

Open `Supabase Dashboard -> Project Settings -> API` and copy these values:

- `Project URL` -> use it for `SUPABASE_URL` in `backend/.env` and `VITE_SUPABASE_URL` in `frontend/.env`
- `service_role key` -> use it only for `SUPABASE_SERVICE_ROLE_KEY` in the backend on Render
- `anon/public key` -> use it only for `VITE_SUPABASE_ANON_KEY` in the frontend on Vercel

### Render Backend

Create a Python web service pointing to the `backend` directory.

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Add these Render environment variables from `backend/.env.example`:

- `PROJECT_NAME=AI Academic Assistant API`
- `API_V1_PREFIX=/api/v1`
- `BACKEND_CORS_ORIGINS=http://localhost:5173,https://your-vercel-project.vercel.app`
- `SUPABASE_URL=https://your-project-ref.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key`
- `SUPABASE_INTERACTIONS_TABLE=interactions`
- `SUPABASE_STUDENTS_TABLE=students`
- `GEMINI_API_KEY=your-gemini-api-key`
- `GEMINI_MODEL=gemini-1.5-flash`
- `PYTHON_VERSION=3.11.9`

After deployment, Render will give you a backend URL like `https://your-backend-service.onrender.com`.

### Vercel Frontend

Create the Vercel project from the `frontend` directory and add these environment variables:

- `VITE_API_BASE_URL=https://your-backend-service.onrender.com`
- `VITE_SUPABASE_URL=https://your-project-ref.supabase.co`
- `VITE_SUPABASE_ANON_KEY=your-supabase-anon-key`

Your final URL mapping should be:

- `SUPABASE_URL` and `VITE_SUPABASE_URL`: same Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: backend only on Render
- `VITE_SUPABASE_ANON_KEY`: frontend only on Vercel
- `VITE_API_BASE_URL`: your Render backend URL
- `BACKEND_CORS_ORIGINS`: must include your Vercel frontend URL so the browser can call the backend

Example deployed values:

```env
# Render backend
BACKEND_CORS_ORIGINS=https://your-frontend-app.vercel.app
SUPABASE_URL=https://abcdefghijklm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key

# Vercel frontend
VITE_API_BASE_URL=https://your-backend-service.onrender.com
VITE_SUPABASE_URL=https://abcdefghijklm.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

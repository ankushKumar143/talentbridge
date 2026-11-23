# TalentBridge PostgreSQL Integration

Ye integration package backend ke liye PostgreSQL persistence, email/password account auth, jobs aur applications APIs add karta hai.

## Setup

1. Is package ke `backend` folder ki files apne project ke `TalentBridge/backend` folder mein copy/merge karo. Existing `app/files.py` aur `app/parser.py` ko preserve karo.
2. `backend/.env.example` ko `backend/.env` naam se copy karo. Apna PostgreSQL password sirf `.env` mein daalo; chat/GitHub par share mat karo. JWT_SECRET ko random secret se replace karo.
3. Ensure karo `backend/.env` `.gitignore` mein ho.
4. Backend PowerShell terminal mein:

```powershell
cd "C:\Users\ankush\.gemini\antigravity\scratch\TalentBridge\backend"
python -m pip install -r requirements.txt
```

5. Migration apply karo:

```powershell
alembic upgrade head
```

6. Server run karo:

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

7. `http://127.0.0.1:8000/api/health` par `database: connected` check karo aur `http://127.0.0.1:8000/docs` par endpoints try karo.

## Added endpoints

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/jobs`, `POST /api/jobs`
- `POST /api/jobs/{id}/apply`, `GET /api/applications/mine`, `PATCH /api/applications/{id}/status`
- Existing resume parse, job matching, ranking routes retained

Passwords Argon2 ke saath hash hote hain. API protected routes JWT Bearer token maangte hain. Recruiter sirf apne job ki application status update kar sakta hai. Google OAuth included nahi hai.

## Important scope

Ye backend database layer hai; existing React contexts abhi `localStorage` use karte hain. React login/register, job posting and applications ko in endpoints par call karne ke liye alag frontend integration zaroori hai. Current scaffold real accounts and persistent API data provide karta hai, lekin UI tab tak purane demo behavior par rahega jab tak frontend contexts/forms update na hon.

Schema migration `backend/migrations/versions/0001_initial_schema.py` se hoti hai. `create_all` startup helper bhi first run ke liye maujood hai; existing database mein migration-based schema changes use karo.
# TalentBridge — Placement Management Platform

React 18 + Vite demo application with a FastAPI resume parsing and explainable skill matching service.

## Requirements

- Node.js 18+ and npm
- Python 3.10+

## Run locally

Terminal 1 (backend):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Terminal 2 (frontend, from project root):

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open http://localhost:5173. Set `VITE_API_BASE_URL` in `.env.local` when the API runs elsewhere; restart Vite after changing it. CORS accepts only `localhost:5173` and `127.0.0.1:5173` by default.

## API

- `GET /api/health` — health and active matching mode.
- `POST /api/resumes/parse` — multipart field `file`, PDF/DOCX/TXT, maximum 5 MB. Returns candidate contact fields, skills, education, experience, projects, completeness score, and limitations.
- `POST /api/jobs/requirements` — JSON `{ "description": "...", "skills": ["Python", "SQL"] }`.
- `POST /api/jobs/match` — returns extracted requirements and matching mode.
- `POST /api/candidates/rank` — JSON `{ "job": { "description": "...", "skills": ["Python"] }, "candidates": [{"id":"1","name":"...","skills":["Python"],"experience":[],"projects":[]}] }`.

Interactive API docs: http://127.0.0.1:8000/docs.

## Parser behavior and privacy

The implementation adapts the notebook's header name/contact/skills extraction, completeness scoring, job requirements, weighted match categories, evidence status, and skill learning suggestions. Notebook installs, tests, sample paths, repeated ranking definitions, and JSON output cells are excluded. The notebook required local `skills.txt`, `colleges.txt`, and `degrees.txt`; this app uses a small built-in skills dictionary so it has no sample file dependency. Its BERT NER and sentence-transformer models are not loaded by default. Matching is deterministic lexical/evidence matching; no semantic model is active and scores do not claim semantic similarity.

Uploaded bytes are processed in memory and are not saved or logged by this API. Parsed result fields are saved in the browser's existing localStorage demo profile and application records until removed/reset. PDF text extraction does not perform OCR, so image-only PDFs return a useful error. DOC and legacy Word files are not supported.

Resume parsing and scores can be incomplete. Recruiter ranking is decision support for human review only and must not be used to automatically reject candidates. The existing student/recruiter demo account behavior and mock profile directory remain demo data; only parsed applications can receive backend rankings.

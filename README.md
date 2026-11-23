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

## Database-backed app flow

The frontend login and registration now use the FastAPI account endpoints. Jobs, job applications, recruiter job management, profile edits, and application status changes are persisted through the API and PostgreSQL. Dashboard routes require a logged-in account with the matching student/recruiter role. Resume parsing still runs through the backend API.

Start the backend after configuring `backend/.env` and applying `alembic upgrade head`; then start Vite in a second terminal. API docs are available at http://127.0.0.1:8000/docs. Google OAuth and email verification/password reset are not configured.

## OAuth and email account setup

For Google sign-in, create a Google OAuth Web application client. Add `http://localhost:5173` and `http://127.0.0.1:5173` as authorized JavaScript origins. Put the same client ID in `backend/.env` as `GOOGLE_CLIENT_ID` and in the frontend `.env.local` as `VITE_GOOGLE_CLIENT_ID`; restart both servers after changes.

For verification and password reset emails, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`, and `WEB_APP_URL` in `backend/.env`. Gmail senders need a Google App Password with 2-Step Verification enabled. Never commit `.env` or share these values. New email/password accounts must verify their address; Google accounts are verified by Google.

After updating backend files/dependencies, run `python -m pip install -r requirements.txt` and `alembic upgrade head` in `backend`. The account token tables, saved jobs, and notifications use the migration `0002_auth_saved_notifications`.

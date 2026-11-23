import json
import logging
import os
import hashlib
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from pathlib import Path
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import select, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from .auth import create_token, current_user, hash_password, require_role, verify_password
from .database import get_db
from . import models  # register ORM tables for Alembic metadata
from .models import ActionToken, Application, Job, Notification, SavedJob, User
from .db_schemas import ApplyRequest, AuthOut, JobCreate, JobOut, LoginRequest, RegisterRequest, StatusUpdate, UserOut
from .email_service import password_reset_email, verification_email
from .files import extract_upload
from .parser import parse_resume, job_requirements, analyze_match

app = FastAPI(title="TalentBridge API", version="2.0.0")
origins = [x.strip() for x in os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["GET", "POST", "PATCH", "DELETE"], allow_headers=["Authorization", "Content-Type"])

def user_out(user: User) -> UserOut:
    return UserOut(id=user.id, name=user.name, email=user.email, role=user.role, profile=json.loads(user.profile_json or "{}"))

def job_out(job: Job) -> JobOut:
    return JobOut(id=job.id, recruiter_id=job.recruiter_id, title=job.title, company=job.company, description=job.description, data=json.loads(job.data_json or "{}"), status=job.status)

@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected", "parser": "deterministic"}

def issue_token(db: Session, user: User, purpose: str, minutes: int) -> str:
    raw = secrets.token_urlsafe(32)
    digest = hashlib.sha256(raw.encode()).hexdigest()
    db.add(ActionToken(user_id=user.id, token_hash=digest, purpose=purpose, expires_at=datetime.now(timezone.utc) + timedelta(minutes=minutes)))
    db.commit()
    return raw

def create_notification(db: Session, user_id: int, kind: str, message: str) -> None:
    db.add(Notification(user_id=user_id, kind=kind, message=message[:500]))

@app.post("/api/auth/register", response_model=AuthOut)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    email = str(data.email).lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(409, "An account with this email already exists")
    user = User(name=data.name.strip(), email=email, password_hash=hash_password(data.password), role=data.role, profile_json=json.dumps(data.profile), is_verified=True)
    db.add(user)
    try: db.commit()
    except IntegrityError as exc:
        db.rollback(); raise HTTPException(409, "An account with this email already exists") from exc
    db.refresh(user)
    return AuthOut(access_token=create_token(user), user=user_out(user))

@app.post("/api/auth/verify-email")
def verify_email(data: dict, db: Session = Depends(get_db)):
    raw = str(data.get("token", ""))
    digest = hashlib.sha256(raw.encode()).hexdigest()
    action = db.scalar(select(ActionToken).where(ActionToken.token_hash == digest, ActionToken.purpose == "verify_email", ActionToken.consumed_at.is_(None)))
    if not action or action.expires_at < datetime.now(timezone.utc): raise HTTPException(400, "Verification link is invalid or expired")
    user = db.get(User, action.user_id)
    if not user: raise HTTPException(400, "Account was not found")
    user.is_verified = True; action.consumed_at = datetime.now(timezone.utc); db.commit()
    return {"message": "Email verified. You can now sign in."}

@app.post("/api/auth/resend-verification")
def resend_verification(data: dict, db: Session = Depends(get_db)):
    email = str(data.get("email", "")).lower()
    user = db.scalar(select(User).where(User.email == email))
    if user and not user.is_verified:
        raw = issue_token(db, user, "verify_email", 24 * 60)
        try: verification_email(user.email, raw)
        except (RuntimeError, OSError, smtplib.SMTPException) as exc:
            logging.exception("Verification email could not be sent")
            raise HTTPException(503, "Verification email could not be sent. Check the backend terminal for the SMTP error.") from exc
    return {"message": "If that account needs verification, a link has been sent."}

@app.post("/api/auth/password-reset/request")
def request_password_reset(data: dict, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == str(data.get("email", "")).lower()))
    if user and user.is_verified:
        raw = issue_token(db, user, "password_reset", 30)
        try: password_reset_email(user.email, raw)
        except (RuntimeError, OSError, smtplib.SMTPException) as exc: raise HTTPException(503, "Email service is not configured") from exc
    return {"message": "If a verified account exists for this email, a reset link has been sent."}

@app.post("/api/auth/password-reset/confirm")
def confirm_password_reset(data: dict, db: Session = Depends(get_db)):
    raw = str(data.get("token", "")); password = str(data.get("password", ""))
    if len(password) < 8 or len(password) > 128: raise HTTPException(422, "Password must be between 8 and 128 characters")
    digest = hashlib.sha256(raw.encode()).hexdigest()
    action = db.scalar(select(ActionToken).where(ActionToken.token_hash == digest, ActionToken.purpose == "password_reset", ActionToken.consumed_at.is_(None)))
    if not action or action.expires_at < datetime.now(timezone.utc): raise HTTPException(400, "Reset link is invalid or expired")
    user = db.get(User, action.user_id)
    if not user: raise HTTPException(400, "Account was not found")
    user.password_hash = hash_password(password); action.consumed_at = datetime.now(timezone.utc); db.commit()
    return {"message": "Password updated. You can sign in with the new password."}

@app.post("/api/auth/google", response_model=AuthOut)
def google_login(data: dict, db: Session = Depends(get_db)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id: raise HTTPException(503, "Google sign-in is not configured")
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token
        claims = id_token.verify_oauth2_token(str(data.get("credential", "")), google_requests.Request(), client_id)
    except ValueError as exc:
        raise HTTPException(401, f"Google rejected the ID token. Confirm both apps use the same Web client ID and sign in again. Details: {exc}") from exc
    except Exception as exc:
        logging.exception("Google ID token verification could not complete")
        raise HTTPException(503, "Backend could not complete Google's token verification. Check that it can reach Google, then retry.") from exc
    email = str(claims.get("email", "")).lower()
    if not email or not claims.get("email_verified"): raise HTTPException(401, "Google must provide a verified email address")
    user = db.scalar(select(User).where(User.google_id == claims.get("sub"))) or db.scalar(select(User).where(User.email == email))
    if user:
        if user.role != data.get("role"): raise HTTPException(409, f"This account is registered as {user.role}")
        user.google_id = claims["sub"]; user.is_verified = True
        if not user.password_hash: user.password_hash = hash_password(secrets.token_urlsafe(32))
        db.commit(); db.refresh(user)
    else:
        profile = {"avatarUrl": claims.get("picture")}
        user = User(name=claims.get("name") or email.split("@")[0], email=email, google_id=claims["sub"], password_hash=hash_password(secrets.token_urlsafe(32)), role=data.get("role") if data.get("role") in ("student", "recruiter") else "student", profile_json=json.dumps(profile), is_verified=True)
        db.add(user); db.commit(); db.refresh(user)
    return AuthOut(access_token=create_token(user), user=user_out(user))

@app.post("/api/auth/login", response_model=AuthOut)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == str(data.email).lower()))
    if not user or not user.password_hash or not verify_password(data.password, user.password_hash): raise HTTPException(401, "Email or password is incorrect")
    return AuthOut(access_token=create_token(user), user=user_out(user))
@app.get("/api/auth/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user_out(user)

@app.patch("/api/auth/profile", response_model=UserOut)
def update_profile(data: dict, user: User = Depends(current_user), db: Session = Depends(get_db)):
    profile = json.loads(user.profile_json or "{}")
    profile.update(data.get("profile", {}))
    user.profile_json = json.dumps(profile)
    if "name" in data:
        user.name = str(data["name"]).strip()
    db.commit(); db.refresh(user)
    return user_out(user)
@app.get("/api/jobs", response_model=list[JobOut])
def list_jobs(db: Session = Depends(get_db)):
    return [job_out(job) for job in db.scalars(select(Job).where(Job.status == "Active").order_by(Job.created_at.desc())).all()]

@app.get("/api/jobs/match-scores")
def job_match_scores(user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    """Return live active jobs with a personalized resume skill-gap analysis."""
    profile = json.loads(user.profile_json or "{}")
    resume_record = profile.get("resume") or {}
    parsed_resume = resume_record.get("parsed") or {}
    if not parsed_resume.get("skills") and not parsed_resume.get("experience") and not parsed_resume.get("projects"):
        parsed_resume = {}
    resume = {**parsed_resume}
    resume["skills"] = list(resume.get("skills", [])) + list(profile.get("skills", []))
    jobs = db.scalars(select(Job).where(Job.status == "Active").order_by(Job.created_at.desc())).all()
    results = []
    for job in jobs:
        data = json.loads(job.data_json or "{}")
        skills = data.get("skills", [])
        if not isinstance(skills, list): skills = []
        requirements = job_requirements(job.description or "", [str(x) for x in skills if x])
        has_requirements = any(requirements.values())
        analysis = analyze_match(resume, requirements) if has_requirements and resume else None
        results.append({"job_id": job.id, "score": analysis["score"] if analysis else None,
            "analysis": analysis, "requirements": requirements})
    return {"matches": results, "has_resume": bool(resume),
        "message": None if resume else "Upload your resume to see personalized job match scores."}

@app.get("/api/jobs/mine", response_model=list[JobOut])
def my_jobs(user: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    jobs = db.scalars(select(Job).where(Job.recruiter_id == user.id).order_by(Job.created_at.desc())).all()
    return [job_out(job) for job in jobs]
@app.post("/api/jobs", response_model=JobOut, status_code=201)
def create_job(data: JobCreate, user: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    job = Job(recruiter_id=user.id, title=data.title, company=data.company, description=data.description, data_json=json.dumps(data.data), status=data.status)
    db.add(job); db.commit(); db.refresh(job)
    return job_out(job)

@app.patch("/api/jobs/{job_id}", response_model=JobOut)
def update_job(job_id: int, data: dict, user: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job.recruiter_id != user.id:
        raise HTTPException(403, "You can only edit your own jobs")
    for field in ("title", "company", "description"):
        if field in data:
            setattr(job, field, data[field])
    if "data" in data:
        job.data_json = json.dumps(data["data"])
    if "status" in data and data["status"] in ("Active", "Closed", "Draft"):
        job.status = data["status"]
    db.commit(); db.refresh(job)
    return job_out(job)

@app.delete("/api/jobs/{job_id}", status_code=204)
def delete_job(job_id: int, user: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    if job.recruiter_id != user.id:
        raise HTTPException(403, "You can only delete your own jobs")
    db.delete(job); db.commit()
@app.post("/api/jobs/{job_id}/apply", status_code=201)
def apply_to_job(job_id: int, data: ApplyRequest, user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    job = db.get(Job, job_id)
    if not job or job.status != "Active":
        raise HTTPException(404, "Active job not found")
    application = Application(job_id=job.id, student_id=user.id, resume_json=json.dumps(data.resume))
    db.add(application)
    create_notification(db, job.recruiter_id, "application", f"New application for {job.title}")
    create_notification(db, user.id, "application", f"Your application for {job.title} at {job.company} was submitted")
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback(); raise HTTPException(409, "You have already applied to this job") from exc
    db.refresh(application)
    return {"id": application.id, "job_id": job.id, "status": application.status}

@app.get("/api/applications/mine")
def my_applications(user: User = Depends(current_user), db: Session = Depends(get_db)):
    if user.role == "student":
        rows = db.scalars(select(Application).where(Application.student_id == user.id).order_by(Application.created_at.desc())).all()
    else:
        rows = db.scalars(select(Application).join(Job).where(Job.recruiter_id == user.id).order_by(Application.created_at.desc())).all()
    result = []
    for application in rows:
        job = db.get(Job, application.job_id)
        student = db.get(User, application.student_id)
        resume = json.loads(application.resume_json or "{}")
        profile = resume.get("profile", {})
        parsed_candidate = resume.get("candidate", {})
        result.append({"id": application.id, "job_id": application.job_id, "student_id": application.student_id,
            "status": application.status, "resume": resume, "created_at": application.created_at,
            "company": job.company if job else "", "role": job.title if job else "",
            "student_name": profile.get("name") or (student.name if student else "Candidate"),
            "student_email": profile.get("email") or (student.email if student else ""),
            "student_phone": profile.get("phone", ""), "college": profile.get("college", ""),
            "degree": profile.get("degree", ""), "skills": resume.get("skills", profile.get("skills", [])),
            "resume_text": " ".join(resume.get("skills", []) + [x.get("summary", "") for x in resume.get("experience", []) if isinstance(x, dict)] + resume.get("projects", [])) if resume else "",
            "resume_name": resume.get("fileName", "")})
    return result

@app.patch("/api/applications/{application_id}/status")
def update_application_status(application_id: int, data: StatusUpdate, user: User = Depends(require_role("recruiter")), db: Session = Depends(get_db)):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(404, "Application not found")
    job = db.get(Job, application.job_id)
    if not job or job.recruiter_id != user.id:
        raise HTTPException(403, "You can only update applications for your own jobs")
    application.status = data.status
    create_notification(db, application.student_id, "application_status", f"Your application for {job.title} is now {data.status}")
    db.commit()
    return {"id": application.id, "status": application.status}

@app.get("/api/saved-jobs")
def list_saved_jobs(user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    return db.scalars(select(SavedJob.job_id).where(SavedJob.user_id == user.id).order_by(SavedJob.created_at.desc())).all()

@app.post("/api/saved-jobs/{job_id}", status_code=201)
def save_job(job_id: int, user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    if not db.get(Job, job_id): raise HTTPException(404, "Job not found")
    if not db.scalar(select(SavedJob).where(SavedJob.user_id == user.id, SavedJob.job_id == job_id)):
        db.add(SavedJob(user_id=user.id, job_id=job_id)); db.commit()
    return {"job_id": job_id, "saved": True}

@app.delete("/api/saved-jobs/{job_id}", status_code=204)
def unsave_job(job_id: int, user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    saved = db.scalar(select(SavedJob).where(SavedJob.user_id == user.id, SavedJob.job_id == job_id))
    if saved: db.delete(saved); db.commit()

@app.get("/api/notifications")
def list_notifications(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Notification).where(Notification.user_id == user.id).order_by(Notification.created_at.desc()).limit(100)).all()
    return [{"id": row.id, "kind": row.kind, "t": row.message, "w": row.created_at.isoformat(), "read": row.is_read} for row in rows]

@app.post("/api/notifications/read-all")
def mark_notifications_read(user: User = Depends(current_user), db: Session = Depends(get_db)):
    rows = db.scalars(select(Notification).where(Notification.user_id == user.id, Notification.is_read.is_(False))).all()
    for row in rows: row.is_read = True
    db.commit()
    return {"updated": len(rows)}
@app.post("/api/resumes/parse")
async def parse_resume_upload(file: UploadFile = File(...), user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    content, filename, original_bytes = await extract_upload(file)
    try: result = parse_resume(content)
    except ValueError as exc: raise HTTPException(422, str(exc)) from exc
    suffix = Path(filename).suffix.lower()
    storage_dir = Path(__file__).resolve().parent.parent / "uploads" / "resumes"
    storage_dir.mkdir(parents=True, exist_ok=True)
    file_id = f"{user.id}-{secrets.token_urlsafe(18)}{suffix}"
    (storage_dir / file_id).write_bytes(original_bytes)
    profile = json.loads(user.profile_json or "{}")
    previous_file_id = profile.get("resume_file_id")
    if isinstance(previous_file_id, str) and previous_file_id.startswith(f"{user.id}-"):
        (storage_dir / previous_file_id).unlink(missing_ok=True)
    profile["resume_file_id"] = file_id
    user.profile_json = json.dumps(profile)
    db.commit()
    result["file_name"] = filename
    result["file_id"] = file_id
    return result

@app.get("/api/resumes/file")
def get_resume_file(user: User = Depends(require_role("student"))):
    profile = json.loads(user.profile_json or "{}")
    file_id = profile.get("resume_file_id")
    if not isinstance(file_id, str) or not file_id.startswith(f"{user.id}-") or Path(file_id).name != file_id:
        raise HTTPException(404, "No original resume is available. Upload the resume again to enable preview.")
    path = Path(__file__).resolve().parent.parent / "uploads" / "resumes" / file_id
    if not path.is_file():
        raise HTTPException(404, "The original resume file is missing. Upload it again to restore preview.")
    media_type = {".pdf": "application/pdf", ".txt": "text/plain; charset=utf-8", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}.get(path.suffix.lower(), "application/octet-stream")
    filename = (profile.get("resume") or {}).get("fileName") or "resume" + path.suffix
    return FileResponse(path, media_type=media_type, headers={"Content-Disposition": "inline"})

@app.delete("/api/resumes/file", status_code=204)
def delete_resume_file(user: User = Depends(require_role("student")), db: Session = Depends(get_db)):
    profile = json.loads(user.profile_json or "{}")
    file_id = profile.pop("resume_file_id", None)
    if isinstance(file_id, str) and file_id.startswith(f"{user.id}-") and Path(file_id).name == file_id:
        (Path(__file__).resolve().parent.parent / "uploads" / "resumes" / file_id).unlink(missing_ok=True)
    user.profile_json = json.dumps(profile)
    db.commit()

@app.post("/api/jobs/requirements")
def extract_requirements_endpoint(request: dict):
    return job_requirements(request.get("description", ""), request.get("skills", []))

@app.post("/api/jobs/match")
def match_job(request: dict):
    return {"requirements": job_requirements(request.get("description", ""), request.get("skills", [])), "method": "Exact normalized skill and evidence matching; semantic model disabled."}

@app.post("/api/candidates/rank")
def rank_candidates(request: dict):
    job = request.get("job", {})
    requirements = job_requirements(job.get("description", ""), job.get("skills", []))
    rows = []
    for candidate in request.get("candidates", []):
        match = analyze_match({"skills": candidate.get("skills", []), "experience": candidate.get("experience", []), "projects": candidate.get("projects", [])}, requirements)
        rows.append({"id": candidate.get("id"), "name": candidate.get("name") or "Candidate", "score": match["score"], "match": match})
    rows.sort(key=lambda row: row["score"], reverse=True)
    for rank, row in enumerate(rows, 1): row["rank"] = rank
    return {"requirements": requirements, "candidates": rows, "decision_support_note": "Rank is a review aid only; a person must assess each candidate."}













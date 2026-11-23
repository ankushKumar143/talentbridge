import os
import smtplib
from email.message import EmailMessage

WEB_APP_URL = os.getenv("WEB_APP_URL", "http://localhost:5173").rstrip("/")

def send_message(to_email: str, subject: str, body: str) -> None:
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("EMAIL_FROM") or username
    if not all((host, username, password, sender)):
        raise RuntimeError("Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD and EMAIL_FROM in backend/.env.")
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = to_email
    message.set_content(body)
    port = int(os.getenv("SMTP_PORT", "587"))
    with smtplib.SMTP(host, port, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(username, password)
        smtp.send_message(message)

def verification_email(to_email: str, token: str) -> None:
    link = f"{WEB_APP_URL}/verify-email?token={token}"
    send_message(to_email, "Verify your TalentBridge account", f"Verify your email by opening this link (valid for 24 hours):\n\n{link}\n\nIf you did not create this account, ignore this email.")

def password_reset_email(to_email: str, token: str) -> None:
    link = f"{WEB_APP_URL}/reset-password?token={token}"
    send_message(to_email, "Reset your TalentBridge password", f"Choose a new password using this one-time link (valid for 30 minutes):\n\n{link}\n\nIf you did not request this, ignore this email.")

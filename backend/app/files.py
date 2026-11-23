import io
from pathlib import Path
import pdfplumber
from docx import Document
from fastapi import HTTPException, UploadFile

MAX_BYTES = 5 * 1024 * 1024
ALLOWED = {".pdf", ".docx", ".txt"}

async def extract_upload(file: UploadFile) -> tuple[str, str, bytes]:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in ALLOWED:
        raise HTTPException(415, "Unsupported file type. Upload PDF, DOCX, or TXT.")
    data = await file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Resume exceeds the 5 MB upload limit.")
    if not data:
        raise HTTPException(400, "The uploaded file is empty.")
    try:
        if suffix == ".txt":
            text = data.decode("utf-8-sig")
        elif suffix == ".docx":
            doc = Document(io.BytesIO(data))
            text = "\n".join(p.text for p in doc.paragraphs)
            for table in doc.tables:
                text += "\n" + "\n".join(" ".join(c.text for c in row.cells) for row in table.rows)
        else:
            with pdfplumber.open(io.BytesIO(data)) as pdf:
                text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as exc:
        raise HTTPException(400, "Could not read this file. Check that it is a valid, unencrypted document.") from exc
    if not text.strip():
        raise HTTPException(422, "No readable text found. Scanned PDFs need OCR before upload.")
    return text, file.filename or "resume", data

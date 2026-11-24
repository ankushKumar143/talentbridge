from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: str = Field(pattern="^(student|recruiter)$")
    profile: dict = Field(default_factory=dict)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    profile: dict

class AuthOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    company: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=20000)
    data: dict = Field(default_factory=dict)
    status: str = Field(default="Active", pattern="^(Active|Draft)$")

class JobOut(BaseModel):
    id: int
    recruiter_id: int
    title: str
    company: str
    description: str
    data: dict
    status: str
    created_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class ApplyRequest(BaseModel):
    resume: dict = Field(default_factory=dict)

class StatusUpdate(BaseModel):
    status: str = Field(pattern="^(Under Review|Shortlisted|Accepted|Rejected)$")



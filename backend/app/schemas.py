from pydantic import BaseModel, Field

class JobMatchRequest(BaseModel):
    description: str = Field(min_length=1, max_length=20000)
    skills: list[str] = Field(default_factory=list, max_length=100)

class CandidateMatchRequest(BaseModel):
    job: JobMatchRequest
    candidates: list[dict] = Field(min_length=1, max_length=500)

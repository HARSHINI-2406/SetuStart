from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import CybersecurityRequirement
from pydantic import BaseModel

router = APIRouter(prefix="/api/cybersecurity", tags=["Cybersecurity Governance"])

class CyberReqCreate(BaseModel):
    challenge_id: int
    requirement_text: str

@router.get("/")
def get_cybersecurity_reqs(challenge_id: int = None, db: Session = Depends(get_db)):
    query = db.query(CybersecurityRequirement)
    if challenge_id:
        query = query.filter(CybersecurityRequirement.challenge_id == challenge_id)
    return query.all()

@router.post("/")
def create_cybersecurity_req(data: CyberReqCreate, db: Session = Depends(get_db)):
    req = CybersecurityRequirement(
        challenge_id=data.challenge_id,
        requirement_text=data.requirement_text,
        compliance_status="Verified"
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import IPDataClause, Pilot
from pydantic import BaseModel

router = APIRouter(prefix="/api/ip-clauses", tags=["IP & Data Governance"])

class IPClauseCreate(BaseModel):
    pilot_id: int
    ownership_terms: str
    data_handling_terms: str
    confidentiality_level: str = "High"

@router.get("/")
def get_ip_clauses(pilot_id: int = None, db: Session = Depends(get_db)):
    query = db.query(IPDataClause)
    if pilot_id:
        query = query.filter(IPDataClause.pilot_id == pilot_id)
    return query.all()

@router.post("/")
def create_ip_clause(data: IPClauseCreate, db: Session = Depends(get_db)):
    clause = IPDataClause(
        pilot_id=data.pilot_id,
        ownership_terms=data.ownership_terms,
        data_handling_terms=data.data_handling_terms,
        confidentiality_level=data.confidentiality_level,
        status="Signed"
    )
    db.add(clause)
    db.commit()
    db.refresh(clause)
    return clause

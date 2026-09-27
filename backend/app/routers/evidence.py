from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Evidence, Pilot, Startup, User
from app.schemas.schemas import EvidenceCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/evidence", tags=["Pilot Evidence"])

@router.get("/")
def get_evidence(pilot_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Evidence)
    if pilot_id:
        query = query.filter(Evidence.pilot_id == pilot_id)
    return query.all()

@router.post("/")
def submit_evidence(
    data: EvidenceCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Government Department", "Administrator"]))
):
    pilot = db.query(Pilot).filter(Pilot.id == data.pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")

    if user.role == "Startup":
        startup = db.query(Startup).filter(Startup.user_id == user.id).first()
        if not startup or (pilot.startup_id != startup.id and user.role != "Administrator"):
            raise HTTPException(status_code=403, detail="Not authorized to submit evidence for this pilot")

    ev = Evidence(
        pilot_id=data.pilot_id,
        title=data.title,
        description=data.description,
        evidence_type=data.evidence_type,
        submitted_by=user.full_name,
        validation_status="Not Validated"
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)

    log_action(db, "EVIDENCE_SUBMITTED", "Evidence", ev.id, user, {"title": ev.title, "pilot_id": ev.pilot_id})
    return ev

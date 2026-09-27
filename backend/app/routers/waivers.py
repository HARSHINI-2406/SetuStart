from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import EligibilityWaiver, Application, User
from app.schemas.schemas import WaiverCreate, WaiverReview
from app.services.matching_service import calculate_match_score
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/waivers", tags=["Eligibility Waiver Engine"])

@router.get("/")
def get_waivers(db: Session = Depends(get_db)):
    return db.query(EligibilityWaiver).all()

@router.post("/")
def request_waiver(
    data: WaiverCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    app = db.query(Application).filter(Application.id == data.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    existing = db.query(EligibilityWaiver).filter(EligibilityWaiver.application_id == app.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Waiver request already filed for this application")

    waiver = EligibilityWaiver(
        application_id=app.id,
        criteria_failed=data.criteria_failed,
        justification=data.justification,
        status="Pending Review"
    )
    db.add(waiver)
    db.commit()
    db.refresh(waiver)

    log_action(db, "WAIVER_REQUESTED", "EligibilityWaiver", waiver.id, user, {"criteria_failed": waiver.criteria_failed})
    return waiver

@router.put("/{waiver_id}/review")
def review_waiver(
    waiver_id: int,
    data: WaiverReview,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    waiver = db.query(EligibilityWaiver).filter(EligibilityWaiver.id == waiver_id).first()
    if not waiver:
        raise HTTPException(status_code=404, detail="Waiver request not found")

    waiver.status = data.status
    waiver.reviewed_by = user.full_name
    waiver.review_comment = data.review_comment
    waiver.reviewed_at = datetime.utcnow()
    db.commit()

    # Recalculate match score with updated waiver status
    calculate_match_score(db, waiver.application)

    log_action(db, "WAIVER_REVIEWED", "EligibilityWaiver", waiver.id, user, {"status": data.status, "reviewer": user.full_name})
    return waiver

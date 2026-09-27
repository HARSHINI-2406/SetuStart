from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import ReuseRecommendation, User
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/reuse-recommendations", tags=["Cross-Department Reuse Engine"])

@router.get("/")
def get_reuse_recommendations(db: Session = Depends(get_db)):
    recs = db.query(ReuseRecommendation).all()
    result = []
    for r in recs:
        result.append({
            "id": r.id,
            "procurement_id": r.procurement_id,
            "target_department_id": r.target_department_id,
            "target_department_name": r.target_department.department_name if r.target_department else "",
            "target_challenge_id": r.target_challenge_id,
            "target_challenge_title": r.target_challenge.title if r.target_challenge else "",
            "similarity_score": r.similarity_score,
            "rationale": r.rationale,
            "status": r.status
        })
    return result

@router.put("/{rec_id}/action")
def action_reuse_recommendation(
    rec_id: int,
    action_status: str, # Approved, Notified, Actioned
    db: Session = Depends(get_db),
    admin: User = Depends(RoleChecker(["Administrator"]))
):
    rec = db.query(ReuseRecommendation).filter(ReuseRecommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.status = action_status
    db.commit()

    log_action(db, "REUSE_RECOMMENDATION_ACTIONED", "ReuseRecommendation", rec.id, admin, {"status": action_status})
    return rec

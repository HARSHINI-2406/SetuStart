from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Evaluation, Application, User
from app.schemas.schemas import EvaluationCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/evaluations", tags=["Evaluations"])

@router.get("/")
def get_evaluations(application_id: int = None, db: Session = Depends(get_db)):
    query = db.query(Evaluation)
    if application_id:
        query = query.filter(Evaluation.application_id == application_id)
    return query.all()

@router.post("/")
def submit_evaluation(
    data: EvaluationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Evaluator", "Administrator"]))
):
    app = db.query(Application).filter(Application.id == data.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    evaluation = Evaluation(
        application_id=data.application_id,
        evaluator_id=user.id,
        technical_score=data.technical_score,
        impact_score=data.impact_score,
        readiness_score=data.readiness_score,
        experience_score=data.experience_score,
        comments=data.comments,
        recommendation=data.recommendation
    )
    db.add(evaluation)
    db.commit()
    db.refresh(evaluation)

    # Update application status if recommended
    if data.recommendation == "Recommend":
        app.status = "Shortlisted"
        db.commit()

    log_action(db, "EVALUATION_SUBMITTED", "Evaluation", evaluation.id, user, {
        "application_id": evaluation.application_id,
        "recommendation": evaluation.recommendation
    })
    return evaluation

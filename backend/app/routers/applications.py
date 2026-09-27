from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Application, Startup, Challenge, StartupSolution, User
from app.schemas.schemas import ApplicationCreate, ApplicationResponse
from app.services.matching_service import calculate_match_score
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/applications", tags=["Applications"])

@router.get("/", response_model=List[ApplicationResponse])
def get_applications(
    challenge_id: int = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    query = db.query(Application)
    if challenge_id:
        query = query.filter(Application.challenge_id == challenge_id)
    if user.role == "Startup":
        startup = db.query(Startup).filter(Startup.user_id == user.id).first()
        if startup:
            query = query.filter(Application.startup_id == startup.id)
    return query.all()

@router.post("/", response_model=ApplicationResponse)
def submit_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    startup = db.query(Startup).filter(Startup.user_id == user.id).first()
    if not startup:
        raise HTTPException(status_code=400, detail="Startup profile missing")

    # Prevent duplicate applications
    existing = db.query(Application).filter(
        Application.challenge_id == data.challenge_id,
        Application.startup_id == startup.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted an application to this challenge")

    app = Application(
        challenge_id=data.challenge_id,
        startup_id=startup.id,
        solution_id=data.solution_id,
        proposal_summary=data.proposal_summary,
        implementation_plan=data.implementation_plan,
        expected_impact=data.expected_impact,
        status="Applied"
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    # Immediately calculate initial deterministic match score
    calculate_match_score(db, app)

    log_action(db, "APPLICATION_SUBMITTED", "Application", app.id, user, {"challenge_id": app.challenge_id})
    return app

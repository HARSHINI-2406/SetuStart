from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Challenge, ChallengeRequirement, ChallengeKPI, GovernmentDepartment, User
from app.schemas.schemas import ChallengeCreate, ChallengeResponse
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/challenges", tags=["Challenges"])

@router.get("", response_model=List[ChallengeResponse])
@router.get("/", response_model=List[ChallengeResponse])
def get_challenges(
    category: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Challenge)
    if category and category.strip():
        cat_clean = category.strip()
        query = query.filter(func.lower(Challenge.category) == func.lower(cat_clean))
    if status and status.strip():
        query = query.filter(Challenge.status == status.strip())
    return query.all()

@router.get("/{challenge_id}", response_model=ChallengeResponse)
def get_challenge_by_id(
    challenge_id: int,
    db: Session = Depends(get_db)
):
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@router.post("/", response_model=ChallengeResponse)
def create_challenge(
    data: ChallengeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    # Find department for current user or default
    dept = db.query(GovernmentDepartment).filter(GovernmentDepartment.organization_id == user.organization_id).first()
    dept_id = dept.id if dept else 1
    dept_name = dept.department_name if dept else (user.organization.name if user.organization else "Gov Department")

    new_challenge = Challenge(
        title=data.title,
        department_id=dept_id,
        department_name=dept_name,
        category=data.category,
        problem_statement=data.problem_statement,
        current_process=data.current_process,
        desired_outcome=data.desired_outcome,
        functional_requirements=data.functional_requirements,
        technical_requirements=data.technical_requirements,
        eligibility_requirements=data.eligibility_requirements,
        budget_range=data.budget_range,
        timeline=data.timeline,
        location=data.location,
        status=data.status or "Draft",
        created_by_user_id=user.id
    )
    db.add(new_challenge)
    db.commit()
    db.refresh(new_challenge)

    if data.requirements:
        for req in data.requirements:
            db.add(ChallengeRequirement(
                challenge_id=new_challenge.id,
                requirement_type=req.requirement_type,
                title=req.title,
                description=req.description,
                is_mandatory=req.is_mandatory
            ))
    if data.kpis:
        for kpi in data.kpis:
            db.add(ChallengeKPI(
                challenge_id=new_challenge.id,
                name=kpi.name,
                description=kpi.description,
                target_value=kpi.target_value,
                unit=kpi.unit
            ))
    db.commit()

    log_action(db, "CHALLENGE_CREATED", "Challenge", new_challenge.id, user, {"title": new_challenge.title, "status": new_challenge.status})
    return new_challenge

@router.put("/{challenge_id}/status")
def update_challenge_status(
    challenge_id: int,
    status_str: str,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    ch = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="Challenge not found")
    ch.status = status_str
    db.commit()
    log_action(db, "CHALLENGE_STATUS_UPDATED", "Challenge", ch.id, user, {"new_status": status_str})
    return {"message": f"Challenge status updated to {status_str}"}

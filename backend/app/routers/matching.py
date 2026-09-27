from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Application, MatchScore, Challenge, Startup, User
from app.schemas.schemas import MatchScoreResponse
from app.services.matching_service import calculate_match_score, compute_profile_match

router = APIRouter(prefix="/api/matching", tags=["Matching & Opportunity Discovery"])

@router.get("/startup-recommendations")
def get_startup_recommendations(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Profile-based opportunity discovery: calculates match scores between current startup profile
    and published government challenges.
    """
    startup = db.query(Startup).filter(Startup.user_id == user.id).first()
    if not startup:
        # If user is admin or hasn't created profile, pick first startup as default or return empty
        startup = db.query(Startup).first()
    if not startup:
        return []

    challenges = db.query(Challenge).filter(Challenge.status == "Published").all()
    if not challenges:
        challenges = db.query(Challenge).all()

    recommendations = [compute_profile_match(db, startup, ch) for ch in challenges]
    recommendations.sort(key=lambda x: x["total_score"], reverse=True)
    return recommendations


@router.get("/matched-startups/{challenge_id}")
def get_matched_startups_for_challenge(
    challenge_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Opportunity discovery for government departments: calculates match scores for all registered
    startups against a specific challenge.
    """
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    startups = db.query(Startup).all()
    matched = [compute_profile_match(db, st, challenge) for st in startups]
    matched.sort(key=lambda x: x["total_score"], reverse=True)
    return matched


@router.get("/score/{application_id}", response_model=MatchScoreResponse)
def get_application_score(application_id: int, db: Session = Depends(get_db)):
    score = db.query(MatchScore).filter(MatchScore.application_id == application_id).first()
    if not score:
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        score = calculate_match_score(db, app)
    return score



from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import AISuggestionLog, User
from app.schemas.schemas import AIAnalyzeRequest, AIAnalyzeResponse
from app.services.ai_service import analyze_challenge_ai

router = APIRouter(prefix="/api/ai", tags=["AI Assistance & Transparency Ledger"])

@router.post("/analyze-challenge", response_model=AIAnalyzeResponse)
def analyze_challenge(
    request: AIAnalyzeRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """Backend AI proxy call to Gemini API with mandatory logging to the AI Transparency Ledger"""
    result = analyze_challenge_ai(
        db=db,
        user=user,
        problem_statement=request.problem_statement,
        functional_reqs=request.functional_requirements,
        technical_reqs=request.technical_requirements,
        challenge_id=request.challenge_id
    )
    return result

@router.get("/logs")
def get_ai_transparency_logs(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """AI Transparency Ledger endpoint - auditable log of prompts, responses, and human actions"""
    logs = db.query(AISuggestionLog).order_by(AISuggestionLog.created_at.desc()).all()
    return logs

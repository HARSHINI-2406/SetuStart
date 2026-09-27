from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Startup, StartupSolution, DemandSignal, StartupTrackRecord, User
from app.schemas.schemas import StartupCreate, StartupResponse, SolutionCreate, SolutionResponse

router = APIRouter(prefix="/api/startups", tags=["Startup Discovery & Ledger"])

@router.get("/", response_model=List[StartupResponse])
def list_startups(db: Session = Depends(get_db)):
    return db.query(Startup).all()

@router.get("/my-profile", response_model=StartupResponse)
def get_my_startup_profile(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    startup = db.query(Startup).filter(Startup.user_id == user.id).first()
    if not startup:
        raise HTTPException(status_code=404, detail="Startup profile not created yet")
    return startup

@router.post("/my-profile", response_model=StartupResponse)
def create_or_update_startup_profile(
    data: StartupCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    existing = db.query(Startup).filter(Startup.user_id == user.id).first()
    if existing:
        existing.startup_name = data.startup_name
        existing.description = data.description
        existing.industry = data.industry
        existing.solution_category = data.solution_category
        existing.technology = data.technology
        existing.location = data.location
        existing.team_size = data.team_size
        existing.annual_turnover = data.annual_turnover
        existing.years_in_operation = data.years_in_operation
        db.commit()
        db.refresh(existing)
        return existing

    new_startup = Startup(
        user_id=user.id,
        organization_id=user.organization_id,
        startup_name=data.startup_name,
        description=data.description,
        industry=data.industry,
        solution_category=data.solution_category,
        technology=data.technology,
        location=data.location,
        team_size=data.team_size,
        annual_turnover=data.annual_turnover,
        years_in_operation=data.years_in_operation
    )
    db.add(new_startup)
    db.commit()
    db.refresh(new_startup)
    return new_startup

@router.get("/solutions", response_model=List[SolutionResponse])
def list_solutions(db: Session = Depends(get_db)):
    return db.query(StartupSolution).all()

@router.post("/solutions", response_model=SolutionResponse)
def create_solution(
    data: SolutionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    startup = db.query(Startup).filter(Startup.user_id == user.id).first()
    if not startup:
        raise HTTPException(status_code=400, detail="Must create a startup profile before creating a solution")

    sol = StartupSolution(
        startup_id=startup.id,
        solution_name=data.solution_name,
        description=data.description,
        problem_solved=data.problem_solved,
        features=data.features,
        implementation_requirements=data.implementation_requirements,
        deployment_readiness=data.deployment_readiness or "Pilot Ready",
        past_experience=data.past_experience
    )
    db.add(sol)
    db.commit()
    db.refresh(sol)
    return sol

@router.get("/demand-radar")
def get_demand_radar(
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    """Demand Radar module showing upcoming anonymized pipeline demand signals"""
    return db.query(DemandSignal).all()

@router.get("/{startup_id}/track-record")
def get_startup_track_record(startup_id: int, db: Session = Depends(get_db)):
    """Startup Track Record Ledger module - portable history across pilots"""
    records = db.query(StartupTrackRecord).filter(StartupTrackRecord.startup_id == startup_id).all()
    return records

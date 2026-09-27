from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Pilot, SandboxConstraint, PilotMilestone, PilotKPI, PilotRisk, Challenge, GovernmentDepartment, User
from app.schemas.schemas import PilotCreate, PilotMilestoneCreate, PilotKPICreate, PilotRiskCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/pilots", tags=["Pilot Sandbox & Risk Heatmap"])

@router.get("/")
def get_pilots(db: Session = Depends(get_db)):
    pilots = db.query(Pilot).all()
    result = []
    for p in pilots:
        result.append({
            "id": p.id,
            "pilot_name": p.pilot_name,
            "challenge_id": p.challenge_id,
            "challenge_title": p.challenge.title if p.challenge else "",
            "startup_id": p.startup_id,
            "startup_name": p.startup.startup_name if p.startup else "",
            "department_id": p.department_id,
            "start_date": p.start_date,
            "end_date": p.end_date,
            "status": p.status,
            "objectives": p.objectives,
            "sandbox_constraint": p.sandbox_constraint,
            "milestones_count": len(p.milestones),
            "kpis_count": len(p.kpis),
            "risks_count": len(p.risks)
        })
    return result

@router.get("/{pilot_id}")
def get_pilot_detail(pilot_id: int, db: Session = Depends(get_db)):
    pilot = db.query(Pilot).filter(Pilot.id == pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")
    return {
        "id": pilot.id,
        "pilot_name": pilot.pilot_name,
        "challenge_id": pilot.challenge_id,
        "challenge_title": pilot.challenge.title if pilot.challenge else "",
        "startup_id": pilot.startup_id,
        "startup_name": pilot.startup.startup_name if pilot.startup else "",
        "department_id": pilot.department_id,
        "start_date": pilot.start_date,
        "end_date": pilot.end_date,
        "status": pilot.status,
        "objectives": pilot.objectives,
        "sandbox_constraint": pilot.sandbox_constraint,
        "milestones": pilot.milestones,
        "kpis": pilot.kpis,
        "risks": pilot.risks,
        "contract": pilot.contract,
        "ip_clause": pilot.ip_clause
    }

@router.post("/")
def create_pilot(
    data: PilotCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Evaluator", "Administrator"]))
):
    challenge = db.query(Challenge).filter(Challenge.id == data.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    existing_pilot = db.query(Pilot).filter(
        Pilot.challenge_id == data.challenge_id,
        Pilot.startup_id == data.startup_id
    ).first()
    if existing_pilot:
        raise HTTPException(
            status_code=400,
            detail=f"A pilot sandbox ('{existing_pilot.pilot_name}') already exists for this application's challenge and startup."
        )

    pilot = Pilot(
        pilot_name=data.pilot_name,
        challenge_id=data.challenge_id,
        startup_id=data.startup_id,
        department_id=challenge.department_id,
        start_date=data.start_date,
        end_date=data.end_date,
        status="Active",
        objectives=data.objectives
    )
    db.add(pilot)
    db.commit()
    db.refresh(pilot)

    # Attach sandbox constraints (Section 18a)
    constraint = SandboxConstraint(
        pilot_id=pilot.id,
        data_boundary=data.sandbox_constraint.data_boundary,
        compliance_notes=data.sandbox_constraint.compliance_notes,
        permitted_environment=data.sandbox_constraint.permitted_environment,
        reviewed_by=user.full_name
    )
    db.add(constraint)

    # Automatically set challenge status to Pilot
    challenge.status = "Pilot"
    db.commit()

    log_action(db, "PILOT_CREATED", "Pilot", pilot.id, user, {"pilot_name": pilot.pilot_name})
    return {
        "id": pilot.id,
        "pilot_name": pilot.pilot_name,
        "challenge_id": pilot.challenge_id,
        "startup_id": pilot.startup_id,
        "department_id": pilot.department_id,
        "start_date": pilot.start_date,
        "end_date": pilot.end_date,
        "status": pilot.status,
        "objectives": pilot.objectives
    }

@router.post("/{pilot_id}/milestones")
def add_milestone(
    pilot_id: int,
    data: PilotMilestoneCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    ms = PilotMilestone(
        pilot_id=pilot_id,
        name=data.name,
        description=data.description,
        due_date=data.due_date,
        status="Pending",
        completion_percentage=0.0
    )
    db.add(ms)
    db.commit()
    db.refresh(ms)
    return ms

@router.put("/milestones/{milestone_id}/status")
def update_milestone_status(
    milestone_id: int,
    status_str: str,
    completion_pct: float = 100.0,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    ms = db.query(PilotMilestone).filter(PilotMilestone.id == milestone_id).first()
    if not ms:
        raise HTTPException(status_code=404, detail="Milestone not found")
    ms.status = status_str
    ms.completion_percentage = completion_pct
    db.commit()
    log_action(db, "MILESTONE_UPDATED", "PilotMilestone", ms.id, user, {"status": status_str, "pct": completion_pct})
    return ms

@router.post("/{pilot_id}/kpis")
def add_kpi(
    pilot_id: int,
    data: PilotKPICreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    kpi = PilotKPI(
        pilot_id=pilot_id,
        name=data.name,
        target_value=data.target_value,
        current_value=0.0,
        unit=data.unit,
        status="On Track"
    )
    db.add(kpi)
    db.commit()
    db.refresh(kpi)
    return kpi

@router.post("/{pilot_id}/risks")
def add_risk(
    pilot_id: int,
    data: PilotRiskCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    risk = PilotRisk(
        pilot_id=pilot_id,
        risk_title=data.risk_title,
        description=data.description,
        severity=data.severity,
        probability=data.probability,
        owner=data.owner,
        mitigation=data.mitigation,
        status="Open"
    )
    db.add(risk)
    db.commit()
    db.refresh(risk)
    return risk

@router.get("/risk-heatmap/aggregate")
def get_risk_heatmap_aggregate(db: Session = Depends(get_db)):
    """Cross-Pilot Risk Heatmap (Section 20/27a) - plotting severity x probability across active pilots"""
    risks = db.query(PilotRisk).filter(PilotRisk.status == "Open").all()
    matrix = {
        "Critical": {"High": [], "Medium": [], "Low": []},
        "High": {"High": [], "Medium": [], "Low": []},
        "Medium": {"High": [], "Medium": [], "Low": []},
        "Low": {"High": [], "Medium": [], "Low": []}
    }
    for r in risks:
        sev = r.severity if r.severity in matrix else "Medium"
        prob = r.probability if r.probability in matrix[sev] else "Medium"
        matrix[sev][prob].append({
            "risk_id": r.id,
            "title": r.risk_title,
            "pilot_id": r.pilot_id,
            "mitigation": r.mitigation
        })
    return matrix

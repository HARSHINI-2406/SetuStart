from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import ProcurementRecord, ApprovalGate, Pilot, StartupTrackRecord, User, IndependentValidation, Evidence, PilotKPI
from app.schemas.schemas import ProcurementCreate, ApprovalGateAction
from app.services.audit_service import log_action
from app.services.reuse_service import generate_reuse_recommendations

router = APIRouter(prefix="/api/procurement", tags=["Procurement & Approval Gates"])

def calculate_procurement_scores(db: Session, pilot_id: int):
    """
    Dynamically calculates evidence_score and kpi_achievement from persisted database records.
    - evidence_score: Average score across submitted evidence packs based on independent validation status
      (Validated = 100.0, Partially Validated = 50.0, Not Validated / Rejected = 0.0). Returns None if no evidence packs exist.
    - kpi_achievement: Average KPI achievement percentage min(100.0, (current_value / target_value) * 100.0)
      across all PilotKPI records. Returns None if no KPI records exist or target_value <= 0.
    """
    # 1. Dynamic Evidence Score Calculation
    evidence_list = db.query(Evidence).filter(Evidence.pilot_id == pilot_id).all()
    if evidence_list:
        scores = []
        for ev in evidence_list:
            if ev.validation_status == "Validated":
                scores.append(100.0)
            elif ev.validation_status == "Partially Validated":
                scores.append(50.0)
            else:
                scores.append(0.0)
        evidence_score = round(sum(scores) / len(scores), 1) if scores else None
    else:
        evidence_score = None

    # 2. Dynamic KPI Achievement Calculation
    kpi_list = db.query(PilotKPI).filter(PilotKPI.pilot_id == pilot_id).all()
    if kpi_list:
        kpi_percentages = []
        for kpi in kpi_list:
            if kpi.target_value and kpi.target_value > 0:
                pct = min(100.0, (kpi.current_value / kpi.target_value) * 100.0)
                kpi_percentages.append(pct)
        kpi_achievement = round(sum(kpi_percentages) / len(kpi_percentages), 1) if kpi_percentages else None
    else:
        kpi_achievement = None

    return evidence_score, kpi_achievement

@router.get("/")
def get_procurement_records(db: Session = Depends(get_db)):
    records = db.query(ProcurementRecord).all()
    result = []
    for r in records:
        result.append({
            "id": r.id,
            "pilot_id": r.pilot_id,
            "pilot_name": r.pilot.pilot_name if r.pilot else "",
            "startup_id": r.startup_id,
            "startup_name": r.startup.startup_name if r.startup else "",
            "evidence_score": r.evidence_score,
            "kpi_achievement": r.kpi_achievement,
            "evaluator_recommendation": r.evaluator_recommendation,
            "independent_validation_result": r.independent_validation_result,
            "procurement_status": r.procurement_status,
            "approval_status": r.approval_status,
            "decision_reason": r.decision_reason,
            "created_at": r.created_at
        })
    return result

@router.post("/")
def create_procurement_recommendation(
    data: ProcurementCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    pilot = db.query(Pilot).filter(Pilot.id == data.pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")

    # 1. Prevent duplicate procurement recommendation for the same pilot
    existing_rec = db.query(ProcurementRecord).filter(
        ProcurementRecord.pilot_id == data.pilot_id
    ).first()
    if existing_rec:
        raise HTTPException(
            status_code=400,
            detail=f"A procurement recommendation already exists for pilot #{data.pilot_id}."
        )

    # 2. Check independent validation prerequisite (Section 21)
    val = db.query(IndependentValidation).filter(
        IndependentValidation.pilot_id == data.pilot_id,
        IndependentValidation.validation_result.in_(["Validated", "Partially Validated"])
    ).first()
    if not val:
        raise HTTPException(
            status_code=400,
            detail=f"Pilot #{data.pilot_id} has not passed independent validation. Independent validation is required before procurement nomination."
        )

    # 3. Dynamically calculate procurement scores from persisted data
    evidence_score, kpi_achievement = calculate_procurement_scores(db, data.pilot_id)

    rec = ProcurementRecord(
        pilot_id=data.pilot_id,
        startup_id=data.startup_id,
        evidence_score=evidence_score,
        kpi_achievement=kpi_achievement,
        evaluator_recommendation="Recommend",
        independent_validation_result=val.validation_result,
        procurement_status="Under Review",
        approval_status="Pending Gate 1",
        decision_reason=data.decision_reason
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)

    # Initialize approval gates
    gate1 = ApprovalGate(
        entity_type="Procurement",
        entity_id=rec.id,
        gate_name="Gate 1: Department Nodal Sign-off",
        status="Pending"
    )
    gate2 = ApprovalGate(
        entity_type="Procurement",
        entity_id=rec.id,
        gate_name="Gate 2: Finance & Compliance Sign-off",
        status="Pending"
    )
    db.add_all([gate1, gate2])
    db.commit()

    log_action(db, "PROCUREMENT_RECOMMENDATION_CREATED", "ProcurementRecord", rec.id, user, {"pilot_id": rec.pilot_id})
    return rec

@router.get("/approval-gates")
def get_approval_gates(db: Session = Depends(get_db)):
    return db.query(ApprovalGate).all()

@router.put("/approval-gates/{gate_id}")
def process_approval_gate(
    gate_id: int,
    action: ApprovalGateAction,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    gate = db.query(ApprovalGate).filter(ApprovalGate.id == gate_id).first()
    if not gate:
        raise HTTPException(status_code=404, detail="Approval gate not found")

    gate.status = action.status
    gate.approved_by = user.full_name
    gate.comment = action.comment
    gate.acted_at = datetime.utcnow()
    db.commit()

    # Update associated procurement record
    rec = db.query(ProcurementRecord).filter(ProcurementRecord.id == gate.entity_id).first()
    if rec and action.status == "Approved":
        if "Gate 1" in gate.gate_name:
            rec.approval_status = "Gate 1 Approved"
            rec.procurement_status = "Recommended"
        elif "Gate 2" in gate.gate_name:
            rec.approval_status = "Final Approved"
            rec.procurement_status = "Scaled"

            # 1. Update startup track record ledger
            track = StartupTrackRecord(
                startup_id=rec.startup_id,
                pilot_id=rec.pilot_id,
                challenge_title=rec.pilot.challenge.title if rec.pilot and rec.pilot.challenge else "Innovation Challenge",
                department_name=rec.pilot.challenge.department_name if rec.pilot and rec.pilot.challenge else "Gov Dept",
                performance_score=rec.evidence_score,
                milestone_punctuality="100% On Time",
                evidence_validation_result="Validated"
            )
            db.add(track)

            # 2. Trigger Cross-Department Reuse Engine (Section 21a)
            generate_reuse_recommendations(db, rec)
        db.commit()

    log_action(db, "APPROVAL_GATE_PROCESSED", "ApprovalGate", gate.id, user, {"status": action.status, "gate": gate.gate_name})
    return gate

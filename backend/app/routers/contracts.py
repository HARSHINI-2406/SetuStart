from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Contract, Pilot, User, ProcurementRecord, ApprovalGate, PaymentMilestone
from app.schemas.schemas import ContractCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/contracts", tags=["Contracts"])

@router.get("/")
def get_contracts(db: Session = Depends(get_db)):
    return db.query(Contract).all()

@router.post("/")
def create_contract(
    data: ContractCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    pilot = db.query(Pilot).filter(Pilot.id == data.pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Pilot not found")

    # 1. Prevent duplicate contract creation for the same pilot/procurement
    existing_contract = db.query(Contract).filter(Contract.pilot_id == data.pilot_id).first()
    if existing_contract:
        raise HTTPException(
            status_code=400,
            detail=f"A contract (Contract #{existing_contract.id}) already exists for this pilot sandbox."
        )

    # 2. Check procurement recommendation record
    proc_rec = db.query(ProcurementRecord).filter(ProcurementRecord.pilot_id == data.pilot_id).first()
    if not proc_rec:
        raise HTTPException(
            status_code=400,
            detail=f"No procurement recommendation found for pilot #{data.pilot_id}. Procurement recommendation and gate approvals are required."
        )

    # 3. Gate-gating check: Verify all approval gates (Gate 1 & Gate 2) are approved
    gates = db.query(ApprovalGate).filter(
        ApprovalGate.entity_type == "Procurement",
        ApprovalGate.entity_id == proc_rec.id
    ).all()
    pending_gates = [g for g in gates if g.status != "Approved"]
    if pending_gates or proc_rec.approval_status != "Final Approved":
        raise HTTPException(
            status_code=400,
            detail=f"Contract creation requires all approval gates (Gate 1 & Gate 2) to be approved. Current status: '{proc_rec.approval_status}'."
        )

    contract = Contract(
        pilot_id=data.pilot_id,
        startup_id=data.startup_id,
        department_id=pilot.department_id,
        contract_terms=data.contract_terms,
        total_value=data.total_value,
        status="Active"
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)

    # 4. Initialize Payment Milestones linked to the new Contract
    if pilot.milestones:
        tranche_amount = round(data.total_value / len(pilot.milestones), 2)
        for idx, ms in enumerate(pilot.milestones, start=1):
            pm = PaymentMilestone(
                contract_id=contract.id,
                milestone_id=ms.id,
                title=f"Tranche {idx}: {ms.name}",
                amount=tranche_amount,
                due_condition=f"Completion and verification of milestone: {ms.name}",
                status="Pending",
                sla_days_overdue=0
            )
            db.add(pm)
    else:
        tranche1 = PaymentMilestone(
            contract_id=contract.id,
            title="Tranche 1: Initial Deployment & Setup",
            amount=round(data.total_value * 0.5, 2),
            due_condition="Contract signing & setup verification",
            status="Pending",
            sla_days_overdue=0
        )
        tranche2 = PaymentMilestone(
            contract_id=contract.id,
            title="Tranche 2: Final Evidence Audit & Acceptance",
            amount=round(data.total_value * 0.5, 2),
            due_condition="Final independent audit sign-off",
            status="Pending",
            sla_days_overdue=0
        )
        db.add_all([tranche1, tranche2])
    db.commit()

    log_action(db, "CONTRACT_CREATED", "Contract", contract.id, user, {
        "pilot_id": contract.pilot_id,
        "startup_id": contract.startup_id,
        "total_value": contract.total_value,
        "procurement_id": proc_rec.id
    })
    return contract

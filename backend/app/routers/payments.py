from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import PaymentMilestone, Contract, PilotMilestone, User
from app.schemas.schemas import PaymentMilestoneCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/payments", tags=["Milestone Payments & Payment SLA Engine"])

@router.get("/")
def get_payment_milestones(contract_id: int = None, db: Session = Depends(get_db)):
    query = db.query(PaymentMilestone)
    if contract_id:
        query = query.filter(PaymentMilestone.contract_id == contract_id)
    payments = query.all()

    # Calculate real-time Payment SLA Overdue Days (Section 28a)
    now = datetime.utcnow()
    for p in payments:
        if p.status == "Invoiced" and p.invoice_raised_at:
            delta = (now - p.invoice_raised_at).days
            p.sla_days_overdue = max(0, delta - 7) # SLA target = 7 days post invoice
        elif p.status == "Paid":
            p.sla_days_overdue = 0
    return payments

@router.post("/")
def create_payment_milestone(
    data: PaymentMilestoneCreate,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    pm = PaymentMilestone(
        contract_id=data.contract_id,
        milestone_id=data.milestone_id,
        title=data.title,
        amount=data.amount,
        due_condition=data.due_condition,
        status="Pending"
    )
    db.add(pm)
    db.commit()
    db.refresh(pm)
    return pm

@router.put("/{payment_id}/raise-invoice")
def raise_invoice(
    payment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Startup", "Administrator"]))
):
    pm = db.query(PaymentMilestone).filter(PaymentMilestone.id == payment_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment milestone not found")

    pm.status = "Invoiced"
    pm.invoice_raised_at = datetime.utcnow()
    db.commit()

    log_action(db, "INVOICE_RAISED", "PaymentMilestone", pm.id, user, {"amount": pm.amount})
    return pm

@router.put("/{payment_id}/approve-and-pay")
def approve_and_pay(
    payment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(RoleChecker(["Government Department", "Administrator"]))
):
    pm = db.query(PaymentMilestone).filter(PaymentMilestone.id == payment_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment milestone not found")

    pm.status = "Paid"
    pm.paid_at = datetime.utcnow()
    pm.sla_days_overdue = 0
    db.commit()

    log_action(db, "PAYMENT_COMPLETED", "PaymentMilestone", pm.id, user, {"amount": pm.amount})
    return pm

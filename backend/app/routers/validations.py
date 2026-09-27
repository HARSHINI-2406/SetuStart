from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import IndependentValidation, Evidence, Evaluation, Application, Pilot, User
from app.schemas.schemas import IndependentValidationCreate
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/validations", tags=["Independent Validation"])

@router.get("/")
def get_independent_validations(pilot_id: int = None, db: Session = Depends(get_db)):
    query = db.query(IndependentValidation)
    if pilot_id:
        query = query.filter(IndependentValidation.pilot_id == pilot_id)
    return query.all()

@router.post("/")
def submit_independent_validation(
    data: IndependentValidationCreate,
    db: Session = Depends(get_db),
    validator: User = Depends(RoleChecker(["Independent Validator", "Administrator"]))
):
    ev = db.query(Evidence).filter(Evidence.id == data.evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")

    pilot = db.query(Pilot).filter(Pilot.id == ev.pilot_id).first()
    if not pilot:
        raise HTTPException(status_code=404, detail="Associated pilot not found")

    # STRICT ROLE SEGREGATION CHECK (Section 7 & 20a):
    # Check if this user previously submitted an evaluation for any application to this pilot's challenge
    prior_eval = db.query(Evaluation).join(Application).filter(
        Application.challenge_id == pilot.challenge_id,
        Evaluation.evaluator_id == validator.id
    ).first()

    if prior_eval and validator.role != "Administrator":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Conflict of Interest: User evaluated the original application for this challenge and cannot perform independent pilot validation."
        )

    val = IndependentValidation(
        evidence_id=ev.id,
        validator_id=validator.id,
        pilot_id=ev.pilot_id,
        validation_result=data.validation_result,
        detailed_report=data.detailed_report
    )
    db.add(val)

    # Update evidence status
    ev.validation_status = data.validation_result
    db.commit()
    db.refresh(val)

    log_action(db, "INDEPENDENT_VALIDATION_SUBMITTED", "IndependentValidation", val.id, validator, {
        "result": val.validation_result,
        "pilot_id": val.pilot_id
    })
    return val

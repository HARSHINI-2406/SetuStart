from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import AuditLog, User

router = APIRouter(prefix="/api/audit-logs", tags=["Audit Trail"])

@router.get("")
@router.get("/")
def get_audit_logs(
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(RoleChecker(["Administrator", "Government Department"]))
):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()

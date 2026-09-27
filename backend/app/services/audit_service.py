from sqlalchemy.orm import Session
from app.models.models import AuditLog, User
from typing import Optional, Any
import json

def log_action(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
    user: Optional[User] = None,
    details: Optional[Any] = None
):
    details_str = json.dumps(details) if isinstance(details, (dict, list)) else str(details or "")
    audit_entry = AuditLog(
        user_id=user.id if user else None,
        user_role=user.role if user else "SYSTEM",
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details_str
    )
    db.add(audit_entry)
    db.commit()
    return audit_entry

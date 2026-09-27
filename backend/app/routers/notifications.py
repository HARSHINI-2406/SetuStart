from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.models import Notification, User

router = APIRouter(prefix="/api/notifications", tags=["In-App Notifications"])

@router.get("/")
def get_user_notifications(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return db.query(Notification).filter(
        (Notification.user_id == user.id) | (Notification.user_id == 0)
    ).order_by(Notification.created_at.desc()).all()

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"message": "Notification marked as read"}

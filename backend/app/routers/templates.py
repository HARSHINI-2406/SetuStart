from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user, RoleChecker
from app.models.models import Template, User
from app.schemas.schemas import TemplateCreate, TemplateResponse

router = APIRouter(prefix="/api/templates", tags=["Template Library"])

@router.get("/", response_model=List[TemplateResponse])
def get_templates(db: Session = Depends(get_db)):
    return db.query(Template).filter(Template.is_active == True).all()

@router.post("/", response_model=TemplateResponse)
def create_template(
    data: TemplateCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(RoleChecker(["Administrator"]))
):
    template = Template(
        template_type=data.template_type,
        title=data.title,
        content=data.content,
        version=data.version or "1.0",
        is_active=True
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template

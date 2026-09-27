from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.services.seed_service import seed_database

# Import routers
from app.routers import (
    auth, users, challenges, templates, startups, applications, waivers,
    evaluations, matching, pilots, evidence, validations, contracts, payments,
    ip_clauses, cybersecurity, procurement, reuse, audit, notifications, ai, public
)

# Initialize DB tables
Base.metadata.create_all(bind=engine)

# Auto seed initial demo data
try:
    db = SessionLocal()
    seed_database(db)
    db.close()
except Exception as e:
    print(f"Error seeding database: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"Governed Public Procurement Platform by {settings.TEAM_NAME}",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(challenges.router)
app.include_router(templates.router)
app.include_router(startups.router)
app.include_router(applications.router)
app.include_router(waivers.router)
app.include_router(evaluations.router)
app.include_router(matching.router)
app.include_router(pilots.router)
app.include_router(evidence.router)
app.include_router(validations.router)
app.include_router(contracts.router)
app.include_router(payments.router)
app.include_router(ip_clauses.router)
app.include_router(cybersecurity.router)
app.include_router(procurement.router)
app.include_router(reuse.router)
app.include_router(audit.router)
app.include_router(notifications.router)
app.include_router(ai.router)
app.include_router(public.router)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "team": settings.TEAM_NAME,
        "status": "Online & Governed",
        "docs": "/docs",
        "public_transparency_portal": "/api/public/stats"
    }

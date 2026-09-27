from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

# --- Auth & User Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str # Government Department, Startup, Evaluator, Independent Validator, Administrator
    organization_name: Optional[str] = "Independent"
    org_type: Optional[str] = "Startup"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    user_id: int

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    organization_id: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Template Schemas ---
class TemplateCreate(BaseModel):
    template_type: str
    title: str
    content: str
    version: Optional[str] = "1.0"

class TemplateResponse(BaseModel):
    id: int
    template_type: str
    title: str
    content: str
    version: str
    is_active: bool

    class Config:
        from_attributes = True

# --- Challenge Schemas ---
class ChallengeRequirementCreate(BaseModel):
    requirement_type: str
    title: str
    description: Optional[str] = ""
    is_mandatory: bool = True

class ChallengeKPICreate(BaseModel):
    name: str
    description: Optional[str] = ""
    target_value: float
    unit: str

class ChallengeCreate(BaseModel):
    title: str
    category: str
    problem_statement: str
    current_process: str
    desired_outcome: str
    functional_requirements: str
    technical_requirements: str
    eligibility_requirements: str
    budget_range: str
    timeline: str
    location: str
    status: Optional[str] = "Draft"
    requirements: Optional[List[ChallengeRequirementCreate]] = []
    kpis: Optional[List[ChallengeKPICreate]] = []

class ChallengeResponse(BaseModel):
    id: int
    title: str
    department_id: int
    department_name: str
    category: str
    problem_statement: str
    current_process: str
    desired_outcome: str
    functional_requirements: str
    technical_requirements: str
    eligibility_requirements: str
    budget_range: str
    timeline: str
    location: str
    status: str
    created_by_user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Startup & Solution Schemas ---
class StartupCreate(BaseModel):
    startup_name: str
    description: str
    industry: str
    solution_category: str
    technology: str
    location: str
    team_size: int = 1
    annual_turnover: float = 0.0
    years_in_operation: int = 1

class StartupResponse(BaseModel):
    id: int
    user_id: int
    startup_name: str
    description: str
    industry: str
    solution_category: str
    technology: str
    location: str
    team_size: int
    annual_turnover: float
    years_in_operation: int
    eligibility_status: str
    verification_status: str

    class Config:
        from_attributes = True

class SolutionCreate(BaseModel):
    solution_name: str
    description: str
    problem_solved: str
    features: str
    implementation_requirements: Optional[str] = ""
    deployment_readiness: Optional[str] = "Pilot Ready"
    past_experience: Optional[str] = ""

class SolutionResponse(BaseModel):
    id: int
    startup_id: int
    solution_name: str
    description: str
    problem_solved: str
    features: str
    implementation_requirements: Optional[str]
    deployment_readiness: str
    past_experience: Optional[str]

    class Config:
        from_attributes = True

# --- Application & Waiver Schemas ---
class ApplicationCreate(BaseModel):
    challenge_id: int
    solution_id: int
    proposal_summary: str
    implementation_plan: str
    expected_impact: str

class ApplicationResponse(BaseModel):
    id: int
    challenge_id: int
    startup_id: int
    solution_id: int
    proposal_summary: str
    implementation_plan: str
    expected_impact: str
    status: str
    applied_at: datetime

    class Config:
        from_attributes = True

class WaiverCreate(BaseModel):
    application_id: int
    criteria_failed: str
    justification: str

class WaiverReview(BaseModel):
    status: str # Approved, Rejected
    review_comment: str

# --- Evaluation & Scoring Schemas ---
class EvaluationCreate(BaseModel):
    application_id: int
    technical_score: float
    impact_score: float
    readiness_score: float
    experience_score: float
    comments: str
    recommendation: str # Recommend, Needs Review, Do Not Recommend

class MatchScoreResponse(BaseModel):
    application_id: int
    eligibility_score: float
    requirement_score: float
    technical_score: float
    impact_score: float
    readiness_score: float
    experience_score: float
    total_score: float
    breakdown_notes: Optional[str]

    class Config:
        from_attributes = True

# --- Pilot, Milestones, KPIs, Risks & Constraints ---
class SandboxConstraintCreate(BaseModel):
    data_boundary: str
    compliance_notes: str
    permitted_environment: str = "Sandboxed Test Cluster"

class PilotCreate(BaseModel):
    pilot_name: str
    challenge_id: int
    startup_id: int
    start_date: str
    end_date: str
    objectives: str
    sandbox_constraint: SandboxConstraintCreate

class PilotMilestoneCreate(BaseModel):
    name: str
    description: str
    due_date: str

class PilotKPICreate(BaseModel):
    name: str
    target_value: float
    unit: str

class PilotRiskCreate(BaseModel):
    risk_title: str
    description: str
    severity: str # Low, Medium, High, Critical
    probability: str # Low, Medium, High
    owner: str
    mitigation: str

# --- Evidence & Independent Validation ---
class EvidenceCreate(BaseModel):
    pilot_id: int
    title: str
    description: str
    evidence_type: str

class IndependentValidationCreate(BaseModel):
    evidence_id: int
    validation_result: str # Validated, Partially Validated, Rejected
    detailed_report: str

# --- Contracts & Payments ---
class ContractCreate(BaseModel):
    pilot_id: int
    startup_id: int
    contract_terms: str
    total_value: float

class PaymentMilestoneCreate(BaseModel):
    contract_id: int
    milestone_id: Optional[int] = None
    title: str
    amount: float
    due_condition: str

# --- Procurement & Gate Schemas ---
class ProcurementCreate(BaseModel):
    pilot_id: int
    startup_id: int
    decision_reason: str

class ApprovalGateAction(BaseModel):
    gate_id: int
    status: str # Approved, Rejected
    comment: str

# --- AI & Stats Schemas ---
class AIAnalyzeRequest(BaseModel):
    challenge_id: Optional[int] = None
    problem_statement: str
    functional_requirements: str
    technical_requirements: str

class AIAnalyzeResponse(BaseModel):
    problem_summary: str
    key_requirements: List[str]
    important_keywords: List[str]
    suggested_evaluation_criteria: List[str]
    suggested_kpis: List[str]
    disclaimer: str = "AI provides recommendations. Final decisions remain with authorized human evaluators."

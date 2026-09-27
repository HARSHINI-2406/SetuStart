```python
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    org_type = Column(String(50), nullable=False)  # Department, Startup, Independent Validator, Evaluator, Admin
    description = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # Government Department, Startup, Evaluator, Independent Validator, Administrator
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")
    startup_profile = relationship("Startup", back_populates="user", uselist=False)


class GovernmentDepartment(Base):
    __tablename__ = "government_departments"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=False)
    department_name = Column(String(255), nullable=False)
    ministry_or_state = Column(String(255), nullable=False)
    nodal_officer_name = Column(String(255), nullable=False)
    contact_email = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Startup(Base):
    __tablename__ = "startups"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)

    startup_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    industry = Column(String(100), nullable=False)
    solution_category = Column(String(100), nullable=False)
    technology = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)

    team_size = Column(Integer, default=1)
    annual_turnover = Column(Float, default=0.0)  # For waiver engine checks
    years_in_operation = Column(Integer, default=1)

    eligibility_status = Column(
        String(50),
        default="Eligible"
    )  # Eligible, Waiver Required, Pending

    verification_status = Column(
        String(50),
        default="Pending"
    )  # Pending, Under Review, Verified, Rejected

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="startup_profile")
    solutions = relationship("StartupSolution", back_populates="startup")


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    organization_id = Column(
        Integer,
        ForeignKey("organizations.id"),
        nullable=True
    )

    verification_type = Column(
        String(50),
        nullable=False
    )
    # Startup, Government Department, Evaluator, Independent Validator

    status = Column(
        String(50),
        default="Pending"
    )
    # Pending, Under Review, Verified, Rejected,
    # Additional Information Required

    registration_number = Column(
        String(255),
        nullable=True
    )

    dpiit_number = Column(
        String(255),
        nullable=True
    )

    verification_source = Column(
        String(255),
        nullable=True
    )
    # Official Registry, Document Review, OTP,
    # Administrator Review

    evidence_reference = Column(
        Text,
        nullable=True
    )

    reviewed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    review_notes = Column(
        Text,
        nullable=True
    )

    submitted_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    verified_at = Column(
        DateTime,
        nullable=True
    )

    user = relationship(
        "User",
        foreign_keys=[user_id]
    )

    reviewer = relationship(
        "User",
        foreign_keys=[reviewed_by]
    )

    organization = relationship(
        "Organization"
    )


class StartupSolution(Base):
    __tablename__ = "startup_solutions"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    solution_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    problem_solved = Column(Text, nullable=False)
    features = Column(Text, nullable=False)
    implementation_requirements = Column(Text, nullable=True)
    deployment_readiness = Column(String(50), default="Pilot Ready")  # Concept, Prototype, Pilot Ready, Market Ready
    past_experience = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    startup = relationship("Startup", back_populates="solutions")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("government_departments.id"), nullable=False)
    department_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # Waste Management, Health, Mobility, Water, Education, AgTech, Citizen Services
    problem_statement = Column(Text, nullable=False)
    current_process = Column(Text, nullable=False)
    desired_outcome = Column(Text, nullable=False)
    functional_requirements = Column(Text, nullable=False)
    technical_requirements = Column(Text, nullable=False)
    eligibility_requirements = Column(Text, nullable=False)
    budget_range = Column(String(100), nullable=False)
    timeline = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(String(50), default="Draft")  # Draft, Published, Under Evaluation, Pilot, Completed, Closed
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    requirements = relationship(
        "ChallengeRequirement",
        back_populates="challenge",
        cascade="all, delete-orphan"
    )

    kpis = relationship(
        "ChallengeKPI",
        back_populates="challenge",
        cascade="all, delete-orphan"
    )

    applications = relationship(
        "Application",
        back_populates="challenge"
    )


class ChallengeRequirement(Base):
    __tablename__ = "challenge_requirements"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    requirement_type = Column(String(50), nullable=False)  # Functional, Technical, Eligibility
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_mandatory = Column(Boolean, default=True)

    challenge = relationship(
        "Challenge",
        back_populates="requirements"
    )


class ChallengeKPI(Base):
    __tablename__ = "challenge_kpis"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False)

    challenge = relationship(
        "Challenge",
        back_populates="kpis"
    )


class Template(Base):
    __tablename__ = "templates"

    id = Column(Integer, primary_key=True, index=True)
    template_type = Column(String(100), nullable=False)  # Problem Statement, Evaluation Criteria, Pilot Agreement, Data/IP Clause, Cybersecurity Requirement, Risk Management, Procurement Pathway
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    version = Column(String(20), default="1.0")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class DemandSignal(Base):
    __tablename__ = "demand_signals"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    sector = Column(String(100), nullable=False)
    estimated_timeline = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    department_name = Column(String(255), nullable=False)
    status = Column(String(50), default="Pipeline")  # Pipeline, Upcoming, Converted
    created_at = Column(DateTime, default=datetime.utcnow)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    solution_id = Column(Integer, ForeignKey("startup_solutions.id"), nullable=False)
    proposal_summary = Column(Text, nullable=False)
    implementation_plan = Column(Text, nullable=False)
    expected_impact = Column(Text, nullable=False)
    status = Column(String(50), default="Applied")  # Applied, Under Review, Shortlisted, Rejected, Selected
    applied_at = Column(DateTime, default=datetime.utcnow)

    challenge = relationship(
        "Challenge",
        back_populates="applications"
    )

    startup = relationship("Startup")
    solution = relationship("StartupSolution")

    match_score = relationship(
        "MatchScore",
        back_populates="application",
        uselist=False
    )

    evaluations = relationship(
        "Evaluation",
        back_populates="application"
    )

    waiver = relationship(
        "EligibilityWaiver",
        back_populates="application",
        uselist=False
    )


class EligibilityWaiver(Base):
    __tablename__ = "eligibility_waivers"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    criteria_failed = Column(String(255), nullable=False)  # e.g. Prior Turnover < $100k, Operations < 3 Years
    justification = Column(Text, nullable=False)
    status = Column(String(50), default="Pending Review")  # Pending Review, Approved, Rejected
    reviewed_by = Column(String(255), nullable=True)
    review_comment = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

    application = relationship(
        "Application",
        back_populates="waiver"
    )


class MatchScore(Base):
    __tablename__ = "match_scores"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    eligibility_score = Column(Float, default=20.0)  # max 20
    requirement_score = Column(Float, default=25.0)  # max 25
    technical_score = Column(Float, default=20.0)  # max 20
    impact_score = Column(Float, default=15.0)  # max 15
    readiness_score = Column(Float, default=10.0)  # max 10
    experience_score = Column(Float, default=10.0)  # max 10
    total_score = Column(Float, default=100.0)  # max 100
    breakdown_notes = Column(Text, nullable=True)
    calculated_at = Column(DateTime, default=datetime.utcnow)

    application = relationship(
        "Application",
        back_populates="match_score"
    )


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    evaluator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    technical_score = Column(Float, nullable=False)
    impact_score = Column(Float, nullable=False)
    readiness_score = Column(Float, nullable=False)
    experience_score = Column(Float, nullable=False)
    comments = Column(Text, nullable=False)
    recommendation = Column(String(50), nullable=False)  # Recommend, Needs Review, Do Not Recommend
    submitted_at = Column(DateTime, default=datetime.utcnow)

    application = relationship(
        "Application",
        back_populates="evaluations"
    )

    evaluator = relationship("User")


class Pilot(Base):
    __tablename__ = "pilots"

    id = Column(Integer, primary_key=True, index=True)
    pilot_name = Column(String(255), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("government_departments.id"), nullable=False)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    status = Column(String(50), default="Not Started")  # Not Started, Active, Paused, Completed, Cancelled
    objectives = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    challenge = relationship("Challenge")
    startup = relationship("Startup")

    sandbox_constraint = relationship(
        "SandboxConstraint",
        back_populates="pilot",
        uselist=False
    )

    milestones = relationship(
        "PilotMilestone",
        back_populates="pilot",
        cascade="all, delete-orphan"
    )

    kpis = relationship(
        "PilotKPI",
        back_populates="pilot",
        cascade="all, delete-orphan"
    )

    risks = relationship(
        "PilotRisk",
        back_populates="pilot",
        cascade="all, delete-orphan"
    )

    contract = relationship(
        "Contract",
        back_populates="pilot",
        uselist=False
    )

    ip_clause = relationship(
        "IPDataClause",
        back_populates="pilot",
        uselist=False
    )


class SandboxConstraint(Base):
    __tablename__ = "sandbox_constraints"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    data_boundary = Column(Text, nullable=False)  # Synthetic test data only, isolated environment, no live citizen PII
    compliance_notes = Column(Text, nullable=False)
    permitted_environment = Column(String(100), default="Sandboxed Test Cluster")
    reviewed_by = Column(String(255), nullable=False)

    pilot = relationship(
        "Pilot",
        back_populates="sandbox_constraint"
    )


class PilotMilestone(Base):
    __tablename__ = "pilot_milestones"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    due_date = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending")  # Pending, In Progress, Completed, Delayed
    completion_percentage = Column(Float, default=0.0)

    pilot = relationship(
        "Pilot",
        back_populates="milestones"
    )


class PilotKPI(Base):
    __tablename__ = "pilot_kpis"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    unit = Column(String(50), nullable=False)
    status = Column(String(50), default="On Track")  # On Track, At Risk, Achieved, Exceeded

    pilot = relationship(
        "Pilot",
        back_populates="kpis"
    )


class PilotRisk(Base):
    __tablename__ = "pilot_risks"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    risk_title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(50), nullable=False)  # Low, Medium, High, Critical
    probability = Column(String(50), nullable=False)  # Low, Medium, High
    owner = Column(String(255), nullable=False)
    mitigation = Column(Text, nullable=False)
    status = Column(String(50), default="Open")  # Open, Mitigated, Closed

    pilot = relationship(
        "Pilot",
        back_populates="risks"
    )


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("government_departments.id"), nullable=False)
    contract_terms = Column(Text, nullable=False)
    total_value = Column(Float, nullable=False)
    status = Column(String(50), default="Active")  # Draft, Active, Completed, Terminated
    created_at = Column(DateTime, default=datetime.utcnow)

    pilot = relationship(
        "Pilot",
        back_populates="contract"
    )

    payment_milestones = relationship(
        "PaymentMilestone",
        back_populates="contract"
    )


class PaymentMilestone(Base):
    __tablename__ = "payment_milestones"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    milestone_id = Column(Integer, ForeignKey("pilot_milestones.id"), nullable=True)
    title = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    due_condition = Column(Text, nullable=False)
    status = Column(String(50), default="Pending")  # Pending, Invoiced, Approved, Paid, Disputed
    invoice_raised_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    sla_days_overdue = Column(Integer, default=0)  # Payment SLA tracking

    contract = relationship(
        "Contract",
        back_populates="payment_milestones"
    )

    milestone = relationship("PilotMilestone")


class IPDataClause(Base):
    __tablename__ = "ip_data_clauses"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    ownership_terms = Column(Text, nullable=False)
    data_handling_terms = Column(Text, nullable=False)
    confidentiality_level = Column(String(50), default="High")
    status = Column(String(50), default="Signed")  # Draft, Acknowledged, Signed

    pilot = relationship(
        "Pilot",
        back_populates="ip_clause"
    )


class CybersecurityRequirement(Base):
    __tablename__ = "cybersecurity_requirements"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    requirement_text = Column(Text, nullable=False)
    compliance_status = Column(String(50), default="Verified")  # Pending, Verified, Non-Compliant
    verified_by = Column(String(255), nullable=True)


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    evidence_type = Column(String(100), nullable=False)  # Performance Metric, Audit Report, User Feedback, System Logs
    submitted_by = Column(String(255), nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    validation_status = Column(String(50), default="Not Validated")  # Validated, Partially Validated, Not Validated

    pilot = relationship("Pilot")

    independent_validation = relationship(
        "IndependentValidation",
        back_populates="evidence",
        uselist=False
    )


class IndependentValidation(Base):
    __tablename__ = "independent_validations"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=False)
    validator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    validation_result = Column(String(50), nullable=False)  # Validated, Partially Validated, Rejected
    detailed_report = Column(Text, nullable=False)
    validated_at = Column(DateTime, default=datetime.utcnow)

    evidence = relationship(
        "Evidence",
        back_populates="independent_validation"
    )

    validator = relationship("User")


class ProcurementRecord(Base):
    __tablename__ = "procurement_records"

    id = Column(Integer, primary_key=True, index=True)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    evidence_score = Column(Float, nullable=True)
    kpi_achievement = Column(Float, nullable=True)
    evaluator_recommendation = Column(String(50), nullable=False)
    independent_validation_result = Column(String(50), nullable=False)
    procurement_status = Column(String(50), default="Under Review")  # Under Review, Recommended, Approved, Procurement Initiated, Scaled, Not Recommended
    approval_status = Column(String(50), default="Pending Gate 1")  # Pending Gate 1, Gate 1 Approved, Gate 2 Approved, Final Approved
    decision_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pilot = relationship("Pilot")
    startup = relationship("Startup")


class ReuseRecommendation(Base):
    __tablename__ = "reuse_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    procurement_id = Column(Integer, ForeignKey("procurement_records.id"), nullable=False)
    target_department_id = Column(Integer, ForeignKey("government_departments.id"), nullable=False)
    target_challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=True)
    similarity_score = Column(Float, nullable=False)
    rationale = Column(Text, nullable=False)
    status = Column(String(50), default="Suggested")  # Suggested, Approved, Notified, Actioned

    procurement = relationship("ProcurementRecord")
    target_department = relationship("GovernmentDepartment")
    target_challenge = relationship("Challenge")


class StartupTrackRecord(Base):
    __tablename__ = "startup_track_records"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startups.id"), nullable=False)
    pilot_id = Column(Integer, ForeignKey("pilots.id"), nullable=False)
    challenge_title = Column(String(255), nullable=False)
    department_name = Column(String(255), nullable=False)
    performance_score = Column(Float, nullable=False)
    milestone_punctuality = Column(String(50), nullable=False)  # 100% On Time, 90% On Time
    evidence_validation_result = Column(String(50), nullable=False)  # Validated, Partially Validated
    completed_at = Column(DateTime, default=datetime.utcnow)


class AISuggestionLog(Base):
    __tablename__ = "ai_suggestion_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=True)
    prompt_text = Column(Text, nullable=False)
    response_json = Column(JSON, nullable=False)
    human_action = Column(String(50), default="Pending Review")  # Accepted, Modified, Ignored
    created_at = Column(DateTime, default=datetime.utcnow)


class ApprovalGate(Base):
    __tablename__ = "approval_gates"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # Procurement, Pilot, Waiver
    entity_id = Column(Integer, nullable=False)
    gate_name = Column(String(100), nullable=False)  # Department Head Approval, Administrator Compliance Sign-off
    status = Column(String(50), default="Pending")  # Pending, Approved, Rejected
    approved_by = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    acted_at = Column(DateTime, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="Info")  # Info, Warning, Alert, Success
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_role = Column(String(50), nullable=True)
    action = Column(String(100), nullable=False)  # USER_REGISTER, CHALLENGE_CREATED, APPLICATION_SUBMITTED, MATCH_SCORED, WAIVER_APPROVED, PAYMENT_APPROVED, etc.
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(Integer, nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

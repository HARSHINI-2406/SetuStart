from sqlalchemy.orm import Session
from app.models.models import Challenge, Startup, StartupSolution, Application, MatchScore

def calculate_match_score(db: Session, application: Application) -> MatchScore:
    challenge: Challenge = application.challenge
    startup: Startup = application.startup
    solution: StartupSolution = application.solution

    # 1. Eligibility (20 pts)
    eligibility_score = 20.0
    if startup.eligibility_status != "Eligible" and not (application.waiver and application.waiver.status == "Approved"):
        eligibility_score = 10.0 # partial deduction if waiver not approved

    # 2. Requirement Match (25 pts)
    req_terms = (challenge.functional_requirements + " " + challenge.technical_requirements).lower().split()
    sol_terms = (solution.description + " " + solution.features + " " + solution.problem_solved).lower()
    matches = sum(1 for term in set(req_terms) if len(term) > 4 and term in sol_terms)
    req_match_pct = min(1.0, max(0.4, matches / max(1, len(set(req_terms)) * 0.3)))
    requirement_score = round(req_match_pct * 25.0, 1)

    # 3. Technical Fit (20 pts)
    tech_score = 20.0 if solution.deployment_readiness in ["Pilot Ready", "Market Ready"] else 14.0

    # 4. Impact Potential (15 pts)
    impact_score = 15.0 if len(application.expected_impact) > 100 else 10.0

    # 5. Implementation Readiness (10 pts)
    readiness_score = 10.0 if len(application.implementation_plan) > 100 else 7.0

    # 6. Relevant Experience (10 pts)
    exp_score = min(10.0, max(4.0, startup.years_in_operation * 2.0))

    total = round(eligibility_score + requirement_score + tech_score + impact_score + readiness_score + exp_score, 1)

    breakdown_notes = (
        f"Eligibility: {eligibility_score}/20; "
        f"Requirement Match: {requirement_score}/25; "
        f"Technical Fit: {tech_score}/20; "
        f"Impact Potential: {impact_score}/15; "
        f"Implementation Readiness: {readiness_score}/10; "
        f"Relevant Experience: {exp_score}/10."
    )

    # Save or update MatchScore in DB
    existing_score = db.query(MatchScore).filter(MatchScore.application_id == application.id).first()
    if existing_score:
        existing_score.eligibility_score = eligibility_score
        existing_score.requirement_score = requirement_score
        existing_score.technical_score = tech_score
        existing_score.impact_score = impact_score
        existing_score.readiness_score = readiness_score
        existing_score.experience_score = exp_score
        existing_score.total_score = total
        existing_score.breakdown_notes = breakdown_notes
        match_score = existing_score
    else:
        match_score = MatchScore(
            application_id=application.id,
            eligibility_score=eligibility_score,
            requirement_score=requirement_score,
            technical_score=tech_score,
            impact_score=impact_score,
            readiness_score=readiness_score,
            experience_score=exp_score,
            total_score=total,
            breakdown_notes=breakdown_notes
        )
        db.add(match_score)

    db.commit()
    db.refresh(match_score)
    return match_score


def compute_profile_match(db: Session, startup: Startup, challenge: Challenge) -> dict:
    """
    Computes dynamic match score (0-100) between a Startup Profile and a Government Challenge.
    Used purely for Opportunity Discovery and Relevance Recommendations.
    """
    # 1. Eligibility (20 pts)
    eligibility_score = 20.0 if startup.eligibility_status == "Eligible" else 10.0

    # 2. Requirement Match (25 pts)
    req_terms = (
        (challenge.category or "") + " " +
        (challenge.title or "") + " " +
        (challenge.problem_statement or "") + " " +
        (challenge.functional_requirements or "") + " " +
        (challenge.technical_requirements or "")
    ).lower().split()
    
    solutions_text = " ".join([
        (s.solution_name or "") + " " + (s.description or "") + " " + (s.problem_solved or "") + " " + (s.features or "")
        for s in (startup.solutions or [])
    ])
    startup_text = (
        (startup.startup_name or "") + " " +
        (startup.industry or "") + " " +
        (startup.solution_category or "") + " " +
        (startup.technology or "") + " " +
        (startup.description or "") + " " +
        solutions_text
    ).lower()

    valid_terms = set(term for term in req_terms if len(term) > 3)
    matches = sum(1 for term in valid_terms if term in startup_text)
    match_ratio = min(1.0, max(0.35, matches / max(1, len(valid_terms) * 0.25)))
    requirement_score = round(match_ratio * 25.0, 1)

    # 3. Technical Fit (20 pts)
    readiness_levels = [s.deployment_readiness for s in (startup.solutions or [])]
    if "Market Ready" in readiness_levels:
        tech_score = 20.0
    elif "Pilot Ready" in readiness_levels:
        tech_score = 17.0
    else:
        tech_score = 13.0

    # 4. Impact Potential (15 pts)
    cat_match = (challenge.category or "").lower() in (startup.solution_category or "").lower() or (challenge.category or "").lower() in (startup.industry or "").lower()
    impact_score = 15.0 if cat_match else 11.0

    # 5. Implementation Readiness (10 pts)
    readiness_score = 10.0 if (startup.team_size or 0) >= 5 else 7.0

    # 6. Relevant Experience (10 pts)
    exp_score = min(10.0, max(4.0, (startup.years_in_operation or 1) * 2.0))

    total = round(eligibility_score + requirement_score + tech_score + impact_score + readiness_score + exp_score, 1)

    breakdown_notes = (
        f"Eligibility: {eligibility_score}/20; "
        f"Requirement Match: {requirement_score}/25; "
        f"Technical Fit: {tech_score}/20; "
        f"Impact Potential: {impact_score}/15; "
        f"Implementation Readiness: {readiness_score}/10; "
        f"Relevant Experience: {exp_score}/10."
    )

    return {
        "challenge_id": challenge.id,
        "challenge_title": challenge.title,
        "category": challenge.category,
        "department_name": challenge.department_name,
        "budget_range": challenge.budget_range,
        "location": challenge.location,
        "startup_id": startup.id,
        "startup_name": startup.startup_name,
        "solution_category": startup.solution_category,
        "industry": startup.industry,
        "technology": startup.technology,
        "total_score": total,
        "breakdown": {
            "eligibility": eligibility_score,
            "requirement_match": requirement_score,
            "technical_fit": tech_score,
            "impact_potential": impact_score,
            "implementation_readiness": readiness_score,
            "relevant_experience": exp_score
        },
        "breakdown_notes": breakdown_notes
    }


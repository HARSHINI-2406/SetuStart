from sqlalchemy.orm import Session
from app.models.models import ProcurementRecord, Challenge, GovernmentDepartment, ReuseRecommendation

def generate_reuse_recommendations(db: Session, procurement: ProcurementRecord):
    scaled_pilot = procurement.pilot
    origin_challenge = scaled_pilot.challenge
    origin_dept_id = scaled_pilot.department_id

    # Search for challenges in other departments with matching category or overlapping requirements
    other_challenges = db.query(Challenge).filter(
        Challenge.department_id != origin_dept_id,
        Challenge.status.in_(["Draft", "Published", "Under Evaluation"])
    ).all()

    for ch in other_challenges:
        similarity = 0.0
        rationale_bits = []

        if ch.category == origin_challenge.category:
            similarity += 50.0
            rationale_bits.append(f"Matching category '{ch.category}'")

        # Compare problem statement keywords
        keywords_origin = set(origin_challenge.problem_statement.lower().split())
        keywords_target = set(ch.problem_statement.lower().split())
        common = keywords_origin.intersection(keywords_target)
        if len(common) > 3:
            overlap_score = min(40.0, len(common) * 5.0)
            similarity += overlap_score
            rationale_bits.append(f"Overlapping domain terms: {', '.join(list(common)[:4])}")

        if similarity >= 40.0:
            existing = db.query(ReuseRecommendation).filter(
                ReuseRecommendation.procurement_id == procurement.id,
                ReuseRecommendation.target_challenge_id == ch.id
            ).first()
            if not existing:
                rec = ReuseRecommendation(
                    procurement_id=procurement.id,
                    target_department_id=ch.department_id,
                    target_challenge_id=ch.id,
                    similarity_score=round(similarity, 1),
                    rationale="; ".join(rationale_bits) + f" — Proven solution from {origin_challenge.department_name}.",
                    status="Suggested"
                )
                db.add(rec)
    db.commit()

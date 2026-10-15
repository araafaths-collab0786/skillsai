"""
Section 7: Readiness Index Formula Implementation
Readiness = 100 * sum(s_i * e_i * w_i) / sum(w_i)
"""
from typing import List, Dict, Any

EVIDENCE_MULTIPLIERS = {
    "verified": 1.0,
    "demonstrated": 0.85,
    "claimed": 0.6,
    "absent": 0.0,
}

def calculate_readiness_index(skills: List[Dict[str, Any]]) -> Dict[str, Any]:
    weighted_sum = 0.0
    total_weight = 0

    breakdowns = []
    for item in skills:
        w_i = item.get("weight", 1)
        s_i = item.get("s_i", 0.0)
        evidence_level = item.get("evidence_level", "absent")
        e_i = EVIDENCE_MULTIPLIERS.get(evidence_level, 0.0)

        contribution = s_i * e_i * w_i
        weighted_sum += contribution
        total_weight += w_i

        breakdowns.append({
            "skill_id": item.get("skill_id"),
            "skill_name": item.get("skill_name"),
            "weight": w_i,
            "s_i": s_i,
            "e_i": e_i,
            "contribution": round(contribution, 2),
        })

    raw_readiness = (100.0 * weighted_sum) / total_weight if total_weight > 0 else 0.0
    clamped_readiness = min(100, max(0, round(raw_readiness)))

    return {
        "readiness_index": clamped_readiness,
        "total_required_weight": total_weight,
        "weighted_sum": round(weighted_sum, 2),
        "breakdowns": breakdowns,
    }

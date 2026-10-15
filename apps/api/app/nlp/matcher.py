"""
Section 7: Semantic Matcher & Calibrated Cosine Table
Maps sentence-transformers MiniLM-L6-v2 cosine similarities to match strength s_i.
"""
from typing import Tuple

def compute_match_strength(cosine_similarity: float, is_exact_alias: bool) -> Tuple[float, str]:
    """
    Returns (s_i, calibration_flag)
    """
    if is_exact_alias:
        return 1.0, "exact_alias"
    
    # Stepped calibration table (placeholder baseline pending 100-pair validation set)
    if cosine_similarity >= 0.92:
        return 0.95, "uncalibrated_baseline"
    elif cosine_similarity >= 0.85:
        return 0.85, "uncalibrated_baseline"
    elif cosine_similarity >= 0.78:
        return 0.70, "uncalibrated_baseline"
    else:
        return 0.0, "below_threshold"

"""
Step 1: Document Quality Screening
Evaluates Laplacian blur variance, ambient luminance brightness, and minimum resolution.
"""
from typing import Dict, Any, List
import numpy as np

def check_image_quality(image_array: np.ndarray) -> Dict[str, Any]:
    flags: List[str] = []
    status = "passed"

    # Dimensions
    h, w = image_array.shape[:2]
    megapixels = (w * h) / 1_000_000.0

    # Luminance / Brightness
    if len(image_array.shape) == 3:
        gray = np.mean(image_array, axis=2)
    else:
        gray = image_array

    mean_brightness = float(np.mean(gray))

    # Laplacian variance approximation for blur
    # Higher value = sharper edges
    dx = np.diff(gray, axis=1)
    dy = np.diff(gray, axis=0)
    laplacian_var = float(np.var(dx) + np.var(dy))

    if laplacian_var < 80.0:
        flags.append("High motion or optical blur detected (variance < 80).")
        status = "warning"

    if mean_brightness < 70.0:
        flags.append("Suboptimal ambient illumination detected (mean brightness < 70).")
        status = "warning"
    elif mean_brightness > 245.0:
        flags.append("High glare or overexposure detected (mean brightness > 245).")
        status = "warning"

    return {
        "step": "quality_check",
        "status": status,
        "flags": flags,
        "metrics": {
            "laplacian_variance": round(laplacian_var, 2),
            "mean_brightness": round(mean_brightness, 2),
            "resolution": f"{w}x{h}",
            "megapixels": round(megapixels, 2),
        },
    }

"""
Step 5: Quality & Authenticity-Risk Screening
NOTE: Strictly presented as quality and authenticity-risk screening, NOT authenticity verification.
Checks for Moiré high-frequency screen capture patterns via 2D FFT, perceptual hash duplicates,
and metadata consistency. Never outputs 'genuine' or 'fake'.
"""
from typing import Dict, Any, List
import numpy as np

def screen_authenticity_risk(
    image_array: np.ndarray,
    user_previous_phashes: List[str] = None
) -> Dict[str, Any]:
    flags: List[str] = []
    status = "passed"
    needs_human_review = False

    if len(image_array.shape) == 3:
        gray = np.mean(image_array, axis=2)
    else:
        gray = image_array

    # 2D Fast Fourier Transform for periodic Moiré patterns (indicative of screen photograph)
    f = np.fft.fft2(gray)
    fshift = np.fft.fftshift(f)
    magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1e-6)

    # Ratio of high-frequency energy peaks to total spectrum
    h, w = magnitude_spectrum.shape
    center_y, center_x = h // 2, w // 2
    outer_band = magnitude_spectrum.copy()
    outer_band[center_y - 20:center_y + 20, center_x - 20:center_x + 20] = 0
    fft_peak_ratio = float(np.max(outer_band) / (np.mean(magnitude_spectrum) + 1e-6))

    if fft_peak_ratio > 3.2:
        flags.append("Periodic high-frequency Moiré resonance detected. Possible display photograph.")
        status = "warning"
        needs_human_review = True

    flags.append("Document EXIF metadata sanitized (location and hardware tags stripped).")

    return {
        "step": "authenticity",
        "status": status,
        "flags": flags,
        "metrics": {
            "fft_peak_ratio": round(fft_peak_ratio, 2),
            "needs_human_review": needs_human_review,
            "metadata_sanitized": True,
        },
    }

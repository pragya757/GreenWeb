"""
Carbon Estimation Engine
========================
Transparent, modular estimation of website carbon emissions.

Methodology (simplified for educational demonstration):
  1. Estimate data transfer (MB) from HTML size + heuristic multiplier.
  2. Energy (kWh) = Transfer (GB) × Energy Intensity (kWh/GB)
  3. Carbon (gCO2e) = Energy (kWh) × Grid Carbon Intensity (gCO2e/kWh)

These are ILLUSTRATIVE ESTIMATES, not certified carbon measurements.
Default parameter values are demonstration assumptions.
"""

import config


# ── Heuristic multipliers ────────────────────────────────────────────────────
# A raw HTML fetch captures only the HTML document.  In a real browser, the
# total page weight is much larger (images, scripts, fonts, etc.).
# We use a conservative heuristic based on resource counts to estimate
# total transfer size.

BASE_IMAGE_SIZE_KB     = 80    # average image ~80 KB
BASE_SCRIPT_SIZE_KB    = 40    # average JS file ~40 KB
BASE_STYLESHEET_SIZE_KB= 15    # average CSS file ~15 KB
BASE_EXTERNAL_SIZE_KB  = 10    # generic external resource ~10 KB


def estimate_transfer_size(
    html_size_bytes: float,
    image_count: int,
    script_count: int,
    stylesheet_count: int,
    external_resource_count: int,
) -> float:
    """
    Returns estimated total page transfer size in **bytes**.

    This is a heuristic estimate.  The actual browser transfer size
    will differ because we do not download sub-resources via a headless browser.
    """
    html_kb       = html_size_bytes / 1024
    images_kb     = image_count     * BASE_IMAGE_SIZE_KB
    scripts_kb    = script_count    * BASE_SCRIPT_SIZE_KB
    stylesheets_kb= stylesheet_count* BASE_STYLESHEET_SIZE_KB
    external_kb   = external_resource_count * BASE_EXTERNAL_SIZE_KB

    total_kb = html_kb + images_kb + scripts_kb + stylesheets_kb + external_kb
    return total_kb * 1024  # return bytes


def estimate_energy(transfer_bytes: float) -> float:
    """
    Returns estimated energy consumption in **kWh**.

    Energy (kWh) = Data (GB) × Energy Intensity (kWh/GB)
    Default energy intensity: {ENERGY_INTENSITY_KWH_PER_GB} kWh/GB (configurable).
    """
    transfer_gb = transfer_bytes / (1024 ** 3)
    return transfer_gb * config.ENERGY_INTENSITY_KWH_PER_GB


def estimate_carbon(energy_kwh: float) -> float:
    """
    Returns estimated carbon emissions in **gCO2e**.

    Carbon (gCO2e) = Energy (kWh) × Grid Carbon Intensity (gCO2e/kWh)
    Default grid intensity: {CARBON_INTENSITY_G_PER_KWH} gCO2e/kWh (configurable).
    """
    return energy_kwh * config.CARBON_INTENSITY_G_PER_KWH


def score_website(
    carbon_emissions_g: float,
    html_size_bytes: float,
    script_count: int,
    image_count: int,
    response_time_s: float,
) -> tuple[float, str]:
    """
    Calculates an environmental performance score (0–100).

    This is a project-defined HEURISTIC scoring system,
    NOT an official industry certification or standard.

    Returns (score: float, category: str).
    """
    score = 100.0

    # Carbon penalty (main driver)
    # A page with <0.5 gCO2e is excellent; >5 gCO2e is poor.
    if carbon_emissions_g > 5.0:
        score -= 50
    elif carbon_emissions_g > 2.0:
        score -= 35
    elif carbon_emissions_g > 1.0:
        score -= 20
    elif carbon_emissions_g > 0.5:
        score -= 10

    # Page size penalty
    size_kb = html_size_bytes / 1024
    if size_kb > 500:
        score -= 15
    elif size_kb > 200:
        score -= 8
    elif size_kb > 100:
        score -= 3

    # Script count penalty (JS is heavy on energy)
    if script_count > 20:
        score -= 15
    elif script_count > 10:
        score -= 8
    elif script_count > 5:
        score -= 3

    # Image count penalty
    if image_count > 30:
        score -= 10
    elif image_count > 15:
        score -= 5
    elif image_count > 8:
        score -= 2

    # Response time penalty (slow servers = more energy)
    if response_time_s > 5.0:
        score -= 10
    elif response_time_s > 2.0:
        score -= 5
    elif response_time_s > 1.0:
        score -= 2

    score = max(0.0, min(100.0, score))

    # Category
    if score >= 80:
        category = "Excellent"
    elif score >= 60:
        category = "Good"
    elif score >= 40:
        category = "Needs Improvement"
    else:
        category = "Poor"

    return round(score, 1), category


def get_model_assumptions() -> dict:
    """Return the configurable model parameters used for transparency."""
    return {
        "energy_intensity_kwh_per_gb": config.ENERGY_INTENSITY_KWH_PER_GB,
        "carbon_intensity_g_per_kwh":  config.CARBON_INTENSITY_G_PER_KWH,
        "base_image_size_kb":          BASE_IMAGE_SIZE_KB,
        "base_script_size_kb":         BASE_SCRIPT_SIZE_KB,
        "base_stylesheet_size_kb":     BASE_STYLESHEET_SIZE_KB,
        "disclaimer": (
            "These values are illustrative demonstration assumptions "
            "and NOT universal scientific constants or certified standards."
        ),
    }

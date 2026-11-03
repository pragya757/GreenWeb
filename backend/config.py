"""
GreenWeb Backend Configuration
Configurable carbon estimation parameters.
"""

import os

# ── Server ──────────────────────────────────────────────────────────────────
DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"
HOST  = os.getenv("HOST", "0.0.0.0")
PORT  = int(os.getenv("PORT", 5001))

# ── Database ─────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(BASE_DIR, 'greenweb.db')}"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# ── Carbon Estimation Parameters (ILLUSTRATIVE DEFAULTS) ────────────────────
# These are demonstration assumptions, NOT certified scientific constants.
ENERGY_INTENSITY_KWH_PER_GB = float(os.getenv("ENERGY_INTENSITY", 0.05))   # kWh per GB
CARBON_INTENSITY_G_PER_KWH  = float(os.getenv("CARBON_INTENSITY", 400.0))  # gCO2e per kWh

# ── HTTP Fetch Parameters ─────────────────────────────────────────────────────
REQUEST_TIMEOUT_SECONDS = int(os.getenv("REQUEST_TIMEOUT", 15))
MAX_RESPONSE_SIZE_BYTES = int(os.getenv("MAX_RESPONSE_SIZE", 10 * 1024 * 1024))  # 10 MB

# ── SSRF Block-list ───────────────────────────────────────────────────────────
BLOCKED_HOSTS = [
    "localhost", "127.0.0.1", "0.0.0.0",
    "::1", "metadata.google.internal",
]
BLOCKED_PREFIXES = [
    "169.254.",        # link-local
    "10.",             # RFC-1918
    "172.16.", "172.17.", "172.18.", "172.19.",
    "172.20.", "172.21.", "172.22.", "172.23.",
    "172.24.", "172.25.", "172.26.", "172.27.",
    "172.28.", "172.29.", "172.30.", "172.31.",
    "192.168.",
    "fd", "fc",        # IPv6 ULA
]
ALLOWED_SCHEMES = {"http", "https"}

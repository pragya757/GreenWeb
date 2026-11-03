"""
Website Analyzer Service
========================
Safely fetches a URL and extracts page metrics.

IMPORTANT – What this measures vs. what it estimates:
  DIRECTLY MEASURED:
    • HTML document size (bytes)
    • HTTP response time (seconds)
    • HTTP status code
    • Content-Type header

  COUNTED FROM HTML (approximate – depends on page structure):
    • Number of <img> tags
    • Number of <script> tags
    • Number of <link rel="stylesheet"> tags
    • Number of external domain references

  ESTIMATED (heuristic):
    • Total page transfer size (HTML + weighted resource counts)
    • Energy consumption
    • Carbon emissions

  NOT AVAILABLE without a headless browser:
    • Actual sub-resource download sizes
    • JavaScript-rendered content
    • Service worker / cache behaviour
"""

import time
import ipaddress
import socket
from urllib.parse import urlparse, urljoin

import requests
from bs4 import BeautifulSoup

import config
from app.utils.url_validator import validate_url, normalise_url
from app.services.carbon_engine import (
    estimate_transfer_size,
    estimate_energy,
    estimate_carbon,
    score_website,
)
from app.services.recommender import generate_recommendations


# ── SSRF-safe session ─────────────────────────────────────────────────────────

class _SSRFSafeAdapter(requests.adapters.HTTPAdapter):
    """Validates every resolved socket address before connecting."""

    def send(self, request, *args, **kwargs):
        parsed = urlparse(request.url)
        valid, err = validate_url(request.url)
        if not valid:
            raise ValueError(f"SSRF guard rejected redirect target: {err}")
        return super().send(request, *args, **kwargs)


def _build_session() -> requests.Session:
    session = requests.Session()
    adapter = _SSRFSafeAdapter()
    session.mount("http://",  adapter)
    session.mount("https://", adapter)
    session.headers.update({
        "User-Agent": (
            "GreenWeb-Analyzer/1.0 (Educational carbon-estimation project; "
            "https://github.com/greenweb)"
        )
    })
    return session


# ── Main analysis function ────────────────────────────────────────────────────

def analyze_website(raw_url: str) -> dict:
    """
    Fetches and analyses a website URL.
    Returns a dict with all metrics, estimates, and recommendations.
    Raises ValueError for invalid / blocked URLs and RuntimeError for fetch failures.
    """
    url = normalise_url(raw_url)

    # 1. Validate URL (SSRF checks included)
    valid, err = validate_url(url)
    if not valid:
        raise ValueError(err)

    session = _build_session()

    # 2. Fetch the page
    start_time = time.perf_counter()
    try:
        response = session.get(
            url,
            timeout=config.REQUEST_TIMEOUT_SECONDS,
            allow_redirects=True,
            stream=True,
        )
        # Read up to MAX_RESPONSE_SIZE_BYTES to prevent memory abuse
        content = b""
        for chunk in response.iter_content(chunk_size=32768):
            content += chunk
            if len(content) > config.MAX_RESPONSE_SIZE_BYTES:
                break

    except requests.exceptions.ConnectionError as e:
        raise RuntimeError(f"Could not connect to '{url}': {e}")
    except requests.exceptions.Timeout:
        raise RuntimeError(
            f"Request timed out after {config.REQUEST_TIMEOUT_SECONDS} seconds."
        )
    except requests.exceptions.TooManyRedirects:
        raise RuntimeError("Too many redirects.")
    except ValueError:
        raise
    except Exception as e:
        raise RuntimeError(f"Unexpected error fetching URL: {e}")

    response_time = round(time.perf_counter() - start_time, 3)

    # 3. Extract basic info
    html_size    = len(content)          # bytes (DIRECTLY MEASURED)
    http_status  = response.status_code
    content_type = response.headers.get("Content-Type", "unknown")
    final_url    = response.url          # after redirects

    # 4. Parse HTML with BeautifulSoup
    try:
        text = content.decode("utf-8", errors="replace")
        soup = BeautifulSoup(text, "lxml")
    except Exception:
        soup = None

    image_count             = 0
    script_count            = 0
    stylesheet_count        = 0
    external_resource_count = 0

    if soup:
        parsed_final = urlparse(final_url)
        base_domain  = parsed_final.netloc

        # Count images (src or data-src for lazy-loaded)
        image_count = len(soup.find_all("img"))

        # Count <script src=...>
        script_count = len([
            t for t in soup.find_all("script")
            if t.get("src")
        ])

        # Count <link rel="stylesheet">
        stylesheet_count = len([
            t for t in soup.find_all("link")
            if "stylesheet" in (t.get("rel") or [])
        ])

        # Count external resources (different domain)
        external_resource_count = _count_external_resources(soup, base_domain)

    # 5. Carbon estimation
    transfer_size   = estimate_transfer_size(
        html_size, image_count, script_count,
        stylesheet_count, external_resource_count
    )
    energy_kwh      = estimate_energy(transfer_size)
    carbon_g        = estimate_carbon(energy_kwh)
    score, category = score_website(
        carbon_g, html_size, script_count, image_count, response_time
    )

    # 6. Recommendations
    recommendations = generate_recommendations(
        html_size, image_count, script_count,
        stylesheet_count, external_resource_count,
        response_time, carbon_g, transfer_size
    )

    return {
        # Identity
        "website_url":             url,
        "final_url":               final_url,

        # Directly measured
        "html_size":               html_size,
        "response_time":           response_time,
        "http_status":             http_status,
        "content_type":            content_type,

        # Counted from HTML
        "image_count":             image_count,
        "script_count":            script_count,
        "stylesheet_count":        stylesheet_count,
        "external_resource_count": external_resource_count,

        # Estimates
        "estimated_transfer_size": round(transfer_size, 2),
        "energy_consumption":      round(energy_kwh, 8),
        "carbon_emissions":        round(carbon_g, 6),
        "environmental_score":     score,
        "performance_category":    category,

        # Recommendations
        "recommendations":         recommendations,

        # Transparency metadata
        "measurement_notes": {
            "html_size":               "DIRECTLY MEASURED — raw HTTP response body size",
            "response_time":           "DIRECTLY MEASURED — wall-clock time for HTTP response",
            "image_count":             "COUNTED from HTML <img> tags (may miss JS-injected images)",
            "script_count":            "COUNTED from HTML <script src=...> tags",
            "stylesheet_count":        "COUNTED from HTML <link rel=stylesheet> tags",
            "external_resource_count": "COUNTED from HTML — links to external domains",
            "estimated_transfer_size": "ESTIMATED via heuristic (not actual browser transfer)",
            "energy_consumption":      "ESTIMATED — see model_assumptions for parameters",
            "carbon_emissions":        "ESTIMATED — see model_assumptions for parameters",
            "environmental_score":     "PROJECT-DEFINED heuristic, NOT an industry certification",
        },
    }


# ── Helpers ───────────────────────────────────────────────────────────────────

def _count_external_resources(soup: BeautifulSoup, base_domain: str) -> int:
    """Count tags referencing resources on a different domain."""
    count = 0
    tags = (
        [(t.get("src"),  t) for t in soup.find_all(src=True)] +
        [(t.get("href"), t) for t in soup.find_all(href=True)]
    )
    seen = set()
    for url_val, _ in tags:
        if not url_val or url_val in seen:
            continue
        seen.add(url_val)
        try:
            parsed = urlparse(url_val)
            if parsed.netloc and parsed.netloc != base_domain:
                count += 1
        except Exception:
            pass
    return count

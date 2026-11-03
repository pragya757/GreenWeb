"""
SSRF-safe URL validator.

Blocks:
  • non-http/https schemes
  • localhost / loopback addresses
  • RFC-1918 private IP ranges
  • link-local (169.254.x.x)
  • IPv6 ULA (fc/fd prefixes)
  • AWS/GCP metadata endpoints
  • bare hostnames without dots (e.g. 'intranet')
"""

import ipaddress
import socket
from urllib.parse import urlparse

import config

# ─────────────────────────────────────────────────────────────────────────────

def validate_url(url: str) -> tuple[bool, str]:
    """
    Returns (is_valid: bool, error_message: str).
    error_message is empty when is_valid is True.
    """
    if not url or not url.strip():
        return False, "URL cannot be empty."

    url = url.strip()

    # Prepend scheme if absent
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        parsed = urlparse(url)
    except Exception:
        return False, "Malformed URL."

    # Scheme check
    if parsed.scheme not in config.ALLOWED_SCHEMES:
        return False, f"Scheme '{parsed.scheme}' is not allowed. Use http or https."

    hostname = parsed.hostname
    if not hostname:
        return False, "URL has no hostname."

    # Bare-hostname check (no dots = likely internal)
    if "." not in hostname and hostname not in ("localhost",):
        return False, "Hostname appears to be an internal address."

    # Blocked hostname strings
    if hostname.lower() in [h.lower() for h in config.BLOCKED_HOSTS]:
        return False, "Access to this host is not permitted."

    # DNS resolve → check resolved IPs
    try:
        infos = socket.getaddrinfo(hostname, None)
    except socket.gaierror:
        return False, f"Cannot resolve hostname '{hostname}'."

    for info in infos:
        ip_str = info[4][0]
        try:
            ip = ipaddress.ip_address(ip_str)
        except ValueError:
            continue

        if ip.is_loopback:
            return False, "Requests to loopback addresses are not allowed."
        if ip.is_private:
            return False, "Requests to private IP ranges are not allowed."
        if ip.is_link_local:
            return False, "Requests to link-local addresses are not allowed."
        if ip.is_reserved:
            return False, "Requests to reserved IP ranges are not allowed."
        if ip.is_multicast:
            return False, "Requests to multicast addresses are not allowed."

        # String prefix checks (catches some IPv6 ULA / metadata)
        for prefix in config.BLOCKED_PREFIXES:
            if ip_str.startswith(prefix):
                return False, "Requests to this IP range are not allowed."

    return True, ""


def normalise_url(url: str) -> str:
    """Add https:// if no scheme is present."""
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url

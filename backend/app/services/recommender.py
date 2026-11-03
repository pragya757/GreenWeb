"""
Recommendation Engine
=====================
Generates data-driven, prioritised optimisation recommendations
based on the measured / estimated page metrics.

Recommendations are NOT generic — they are triggered by specific
threshold conditions from the actual analysis results.
"""

from typing import List, Dict


def generate_recommendations(
    html_size_bytes: float,
    image_count: int,
    script_count: int,
    stylesheet_count: int,
    external_resource_count: int,
    response_time_s: float,
    carbon_emissions_g: float,
    estimated_transfer_bytes: float,
) -> List[Dict]:
    """
    Returns a list of recommendation dicts, each containing:
      title, explanation, sustainability_impact, priority
    """
    recs = []

    # ── Image optimisation ─────────────────────────────────────────────────────
    if image_count > 5:
        recs.append({
            "title": "Compress and Optimise Images",
            "explanation": (
                f"We detected approximately {image_count} images on this page. "
                "Unoptimised images are often the largest contributor to page weight. "
                "Use tools like Squoosh or ImageOptim to reduce file sizes."
            ),
            "sustainability_impact": (
                "Smaller images reduce data transfer, lowering energy consumption "
                "for both servers and user devices."
            ),
            "priority": "High" if image_count > 15 else "Medium",
        })

        recs.append({
            "title": "Use Modern Image Formats (WebP / AVIF)",
            "explanation": (
                "WebP images are ~25–35% smaller than JPEG/PNG with similar quality. "
                "AVIF offers even better compression (~50% vs JPEG). "
                "Switch to these formats to cut image payload significantly."
            ),
            "sustainability_impact": (
                "Smaller images mean less data transferred per page view, "
                "directly reducing carbon emissions at scale."
            ),
            "priority": "High" if image_count > 10 else "Medium",
        })

        recs.append({
            "title": "Implement Lazy Loading for Images",
            "explanation": (
                "Add loading='lazy' to <img> tags so images below the fold are "
                "only downloaded when the user scrolls to them."
            ),
            "sustainability_impact": (
                "Lazy loading prevents unnecessary data transfer for content "
                "the user never sees, reducing energy wasted per visit."
            ),
            "priority": "Medium",
        })

    # ── Script optimisation ───────────────────────────────────────────────────
    if script_count > 5:
        recs.append({
            "title": "Minify and Bundle JavaScript",
            "explanation": (
                f"The page references approximately {script_count} script files. "
                "Minifying removes whitespace and comments; bundling reduces "
                "the number of HTTP requests."
            ),
            "sustainability_impact": (
                "Smaller JS bundles consume less bandwidth and require less CPU "
                "energy to parse and execute on the user's device."
            ),
            "priority": "High" if script_count > 15 else "Medium",
        })

    if script_count > 10:
        recs.append({
            "title": "Remove Unused JavaScript",
            "explanation": (
                "Audit your JavaScript bundles with browser DevTools Coverage panel. "
                "Removing dead code can eliminate 30–70% of JS payload on typical sites."
            ),
            "sustainability_impact": (
                "Every KB of unused code still costs energy to download, parse, "
                "and compile — even if it never runs."
            ),
            "priority": "High",
        })

    # ── Stylesheet optimisation ────────────────────────────────────────────────
    if stylesheet_count > 3:
        recs.append({
            "title": "Minify CSS and Remove Unused Styles",
            "explanation": (
                f"The page loads approximately {stylesheet_count} stylesheets. "
                "Tools like PurgeCSS can remove unused rules; minification removes "
                "whitespace and comments."
            ),
            "sustainability_impact": (
                "Leaner CSS means faster rendering and less data transferred, "
                "contributing to a lower per-visit carbon footprint."
            ),
            "priority": "Medium",
        })

    # ── External resources ─────────────────────────────────────────────────────
    if external_resource_count > 10:
        recs.append({
            "title": "Reduce Third-Party Scripts and Trackers",
            "explanation": (
                f"The page references approximately {external_resource_count} external "
                "resources. Each third-party request adds latency, increases attack "
                "surface, and consumes extra energy."
            ),
            "sustainability_impact": (
                "Fewer external requests lower overall data transfer and reduce "
                "server energy usage across multiple data centres."
            ),
            "priority": "High" if external_resource_count > 20 else "Medium",
        })

    # ── Caching ───────────────────────────────────────────────────────────────
    recs.append({
        "title": "Enable Browser Caching with Long Cache Headers",
        "explanation": (
            "Set Cache-Control headers (e.g. max-age=31536000) for static assets "
            "like images, CSS, and JS so returning visitors do not re-download them."
        ),
        "sustainability_impact": (
            "Cached assets require zero server energy on repeat visits, "
            "significantly reducing cumulative carbon emissions."
        ),
        "priority": "High",
    })

    # ── CDN ───────────────────────────────────────────────────────────────────
    recs.append({
        "title": "Use a Content Delivery Network (CDN)",
        "explanation": (
            "A CDN serves assets from edge servers close to the user, "
            "reducing round-trip distance and latency."
        ),
        "sustainability_impact": (
            "Shorter network paths mean lower transmission energy. "
            "Many CDN providers also use renewable-powered infrastructure."
        ),
        "priority": "Medium",
    })

    # ── Page size ─────────────────────────────────────────────────────────────
    if html_size_bytes > 100 * 1024:  # > 100 KB HTML
        recs.append({
            "title": "Reduce HTML Document Size",
            "explanation": (
                f"The HTML document is {html_size_bytes / 1024:.1f} KB. "
                "Large HTML often indicates inline CSS/JS or deeply nested markup. "
                "Extract styles to external files and simplify the DOM tree."
            ),
            "sustainability_impact": (
                "Smaller HTML reduces initial download size and speeds up "
                "browser parsing, lowering energy use per page view."
            ),
            "priority": "Medium" if html_size_bytes > 200 * 1024 else "Low",
        })

    # ── Response time ─────────────────────────────────────────────────────────
    if response_time_s > 2.0:
        recs.append({
            "title": "Optimise Server Response Time (TTFB)",
            "explanation": (
                f"The server responded in {response_time_s:.2f} seconds. "
                "Consider server-side caching (Redis/Memcached), database query "
                "optimisation, or upgrading your hosting tier."
            ),
            "sustainability_impact": (
                "Faster servers process requests more efficiently, "
                "reducing energy consumption per request."
            ),
            "priority": "High" if response_time_s > 5.0 else "Medium",
        })

    # ── Fonts ──────────────────────────────────────────────────────────────────
    recs.append({
        "title": "Optimise Web Font Loading",
        "explanation": (
            "Use font-display: swap and preload key fonts. "
            "Host fonts locally instead of loading from Google Fonts or Adobe to "
            "eliminate an extra DNS lookup and round trip."
        ),
        "sustainability_impact": (
            "Reducing font-related requests saves bandwidth and eliminates "
            "unnecessary connections to third-party servers."
        ),
        "priority": "Low",
    })

    # ── Green hosting ─────────────────────────────────────────────────────────
    if carbon_emissions_g > 1.0:
        recs.append({
            "title": "Switch to a Green Hosting Provider",
            "explanation": (
                "The estimated carbon footprint of this page is relatively high. "
                "Hosting providers powered by renewable energy (e.g. GreenGeeks, "
                "Kualo, or Google Cloud with carbon-neutral commitments) can "
                "dramatically reduce grid-sourced emissions."
            ),
            "sustainability_impact": (
                "Switching to 100% renewable hosting is one of the highest-impact "
                "changes a website owner can make."
            ),
            "priority": "High",
        })

    return recs

"""
POST /api/analyze
Accepts a website URL, runs analysis, saves to DB, returns JSON.
"""

import json
from flask import Blueprint, request, jsonify
from app import db
from app.models.analysis import Analysis
from app.services.analyzer import analyze_website
from app.services.carbon_engine import get_model_assumptions

analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    url  = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "URL is required."}), 400

    # Run analysis (raises ValueError / RuntimeError on failure)
    try:
        result = analyze_website(url)
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502
    except Exception as e:
        return jsonify({"error": f"Unexpected server error: {e}"}), 500

    # Persist to database
    record = Analysis(
        website_url             = result["website_url"],
        html_size               = result["html_size"],
        response_time           = result["response_time"],
        http_status             = result["http_status"],
        content_type            = result["content_type"],
        image_count             = result["image_count"],
        script_count            = result["script_count"],
        stylesheet_count        = result["stylesheet_count"],
        external_resource_count = result["external_resource_count"],
        estimated_transfer_size = result["estimated_transfer_size"],
        energy_consumption      = result["energy_consumption"],
        carbon_emissions        = result["carbon_emissions"],
        environmental_score     = result["environmental_score"],
        performance_category    = result["performance_category"],
        recommendations         = json.dumps(result["recommendations"]),
    )
    db.session.add(record)
    db.session.commit()

    # Build response with DB id
    response_data = result.copy()
    response_data["id"]             = record.id
    response_data["analyzed_at"]    = record.analyzed_at.isoformat()
    response_data["model_assumptions"] = get_model_assumptions()

    return jsonify(response_data), 200

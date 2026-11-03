"""
GET /api/dashboard
Returns aggregated statistics for the dashboard.
"""

from flask import Blueprint, jsonify
from sqlalchemy import func
from app import db
from app.models.analysis import Analysis

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard", methods=["GET"])
def get_dashboard():
    total_analyses = Analysis.query.count()

    stats = db.session.query(
        func.avg(Analysis.carbon_emissions).label("avg_carbon"),
        func.avg(Analysis.html_size).label("avg_html_size"),
        func.avg(Analysis.environmental_score).label("avg_score"),
        func.avg(Analysis.estimated_transfer_size).label("avg_transfer"),
    ).one()

    # Recent 10 analyses
    recent = (
        Analysis.query
        .order_by(Analysis.analyzed_at.desc())
        .limit(10)
        .all()
    )

    # Score distribution
    excellent   = Analysis.query.filter(Analysis.environmental_score >= 80).count()
    good        = Analysis.query.filter(Analysis.environmental_score >= 60,
                                        Analysis.environmental_score < 80).count()
    needs_imp   = Analysis.query.filter(Analysis.environmental_score >= 40,
                                        Analysis.environmental_score < 60).count()
    poor        = Analysis.query.filter(Analysis.environmental_score < 40).count()

    return jsonify({
        "total_analyses":        total_analyses,
        "avg_carbon_emissions":  round(stats.avg_carbon  or 0, 6),
        "avg_html_size":         round(stats.avg_html_size or 0, 2),
        "avg_transfer_size":     round(stats.avg_transfer or 0, 2),
        "avg_environmental_score": round(stats.avg_score or 0, 1),
        "score_distribution": {
            "excellent":        excellent,
            "good":             good,
            "needs_improvement": needs_imp,
            "poor":             poor,
        },
        "recent_analyses":       [a.to_dict() for a in recent],
    }), 200

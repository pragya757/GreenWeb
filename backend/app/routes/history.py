"""
GET  /api/history        – list all analyses
GET  /api/history/<id>   – get one analysis
DELETE /api/history/<id> – delete one analysis
"""

from flask import Blueprint, jsonify, request
from app import db
from app.models.analysis import Analysis

history_bp = Blueprint("history", __name__)


@history_bp.route("/history", methods=["GET"])
def get_history():
    search = request.args.get("search", "").strip()
    page   = int(request.args.get("page", 1))
    per_page = int(request.args.get("per_page", 20))

    query = Analysis.query.order_by(Analysis.analyzed_at.desc())

    if search:
        query = query.filter(
            Analysis.website_url.ilike(f"%{search}%")
        )

    total    = query.count()
    analyses = query.offset((page - 1) * per_page).limit(per_page).all()

    return jsonify({
        "total":    total,
        "page":     page,
        "per_page": per_page,
        "items":    [a.to_dict() for a in analyses],
    }), 200


@history_bp.route("/history/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    record = Analysis.query.get(analysis_id)
    if not record:
        return jsonify({"error": "Analysis not found."}), 404
    return jsonify(record.to_dict()), 200


@history_bp.route("/history/<int:analysis_id>", methods=["DELETE"])
def delete_analysis(analysis_id):
    record = Analysis.query.get(analysis_id)
    if not record:
        return jsonify({"error": "Analysis not found."}), 404
    db.session.delete(record)
    db.session.commit()
    return jsonify({"message": "Analysis deleted successfully."}), 200

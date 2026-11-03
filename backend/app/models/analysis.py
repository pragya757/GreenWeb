"""
SQLAlchemy model for website carbon analyses.
Stored in SQLite via Flask-SQLAlchemy.
"""

import json
from datetime import datetime, timezone
from app import db


class Analysis(db.Model):
    __tablename__ = "analysis"

    id                      = db.Column(db.Integer, primary_key=True)
    website_url             = db.Column(db.String(2048), nullable=False)
    analyzed_at             = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Raw / directly measured
    html_size               = db.Column(db.Float, nullable=True)   # bytes
    response_time           = db.Column(db.Float, nullable=True)   # seconds
    http_status             = db.Column(db.Integer, nullable=True)
    content_type            = db.Column(db.String(256), nullable=True)

    # Page resource counts (parsed from HTML)
    image_count             = db.Column(db.Integer, default=0)
    script_count            = db.Column(db.Integer, default=0)
    stylesheet_count        = db.Column(db.Integer, default=0)
    external_resource_count = db.Column(db.Integer, default=0)

    # Estimates
    estimated_transfer_size = db.Column(db.Float, nullable=True)   # bytes
    energy_consumption      = db.Column(db.Float, nullable=True)   # kWh
    carbon_emissions        = db.Column(db.Float, nullable=True)   # gCO2e
    environmental_score     = db.Column(db.Float, nullable=True)   # 0-100
    performance_category    = db.Column(db.String(32), nullable=True)

    # JSON blob for recommendations list
    recommendations         = db.Column(db.Text, nullable=True)

    # ── Serialisation ─────────────────────────────────────────────────────────
    def to_dict(self):
        recs = []
        if self.recommendations:
            try:
                recs = json.loads(self.recommendations)
            except (json.JSONDecodeError, TypeError):
                recs = []

        return {
            "id":                      self.id,
            "website_url":             self.website_url,
            "analyzed_at":             self.analyzed_at.isoformat() if self.analyzed_at else None,
            "html_size":               self.html_size,
            "response_time":           self.response_time,
            "http_status":             self.http_status,
            "content_type":            self.content_type,
            "image_count":             self.image_count,
            "script_count":            self.script_count,
            "stylesheet_count":        self.stylesheet_count,
            "external_resource_count": self.external_resource_count,
            "estimated_transfer_size": self.estimated_transfer_size,
            "energy_consumption":      self.energy_consumption,
            "carbon_emissions":        self.carbon_emissions,
            "environmental_score":     self.environmental_score,
            "performance_category":    self.performance_category,
            "recommendations":         recs,
        }

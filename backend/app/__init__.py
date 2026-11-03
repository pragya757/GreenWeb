"""
GreenWeb Backend – Application Factory
"""

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_pyfile("../config.py", silent=False)

    # Enable CORS for deployed frontend and dev server
    cors_origins = app.config.get("CORS_ORIGINS", "*")
    if cors_origins != "*":
        cors_origins = [o.strip() for o in cors_origins.split(",") if o.strip()]
    CORS(
        app,
        resources={r"/*": {"origins": cors_origins}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Init SQLAlchemy
    db.init_app(app)

    # Register blueprints
    from app.routes.analysis import analysis_bp
    from app.routes.history  import history_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.health   import health_bp

    app.register_blueprint(analysis_bp,  url_prefix="/api")
    app.register_blueprint(history_bp,   url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")
    app.register_blueprint(health_bp,    url_prefix="/api")

    # Root health endpoint in addition to /api/health
    @app.route("/health", methods=["GET"])
    def root_health():
        import datetime
        from flask import jsonify
        return jsonify({
            "status": "ok",
            "service": "GreenWeb Backend",
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        }), 200

    # Create tables
    with app.app_context():
        db.create_all()

    return app

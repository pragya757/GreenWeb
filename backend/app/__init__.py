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

    # Enable CORS for React dev server
    CORS(app, resources={r"/api/*": {"origins": "*"}})

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

    # Create tables
    with app.app_context():
        db.create_all()

    return app

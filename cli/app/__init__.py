""" Top level module

This module:

- Contains create_app()
- Registers extensions
"""

from flask import Flask

# Import extensions
from .extensions import cors

# Import config
from config import config_by_name


def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.update(TEMPLATES_AUTO_RELOAD=True)
    app.config.from_object(config_by_name[config_name])

    register_extensions(app)

    # Register blueprints
    from .EndPoints.database import database_bp
    from .EndPoints.endpoint import endpoint_bp
    from .EndPoints.display import display_bp
    from .EndPoints.metadata import metadata_bp

    app.register_blueprint(database_bp, url_prefix="/api/database")
    app.register_blueprint(endpoint_bp, url_prefix="/api/endpoint")
    app.register_blueprint(display_bp, url_prefix="/api/display")
    app.register_blueprint(metadata_bp, url_prefix="/api/metadata")

    return app


def register_extensions(app):
    cors.init_app(app)

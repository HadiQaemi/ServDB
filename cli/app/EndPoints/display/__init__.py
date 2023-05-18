from flask_restx import Api
from flask import Blueprint

# Import display namespace
from ..Controllers.display import api as display_ns

display_bp = Blueprint("display", __name__)

display = Api(display_bp, title="Display", description="Display image.")

# API namespaces
display.add_namespace(display_ns)

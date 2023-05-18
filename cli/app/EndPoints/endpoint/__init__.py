from flask_restx import Api
from flask import Blueprint

# Import endpoint namespace
from ..Controllers.endpoint import api as endpoint_ns

endpoint_bp = Blueprint("endpoint", __name__)

endpoint = Api(endpoint_bp, title="Endpoint", description="Endpoint collector.")

# API namespaces
endpoint.add_namespace(endpoint_ns)

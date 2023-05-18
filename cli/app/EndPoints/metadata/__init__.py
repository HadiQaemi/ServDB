from flask_restx import Api
from flask import Blueprint

# Import metadata namespace
from ..Controllers.metadata import api as metadata_ns

metadata_bp = Blueprint("metadata", __name__)

metadata = Api(metadata_bp, title="Metadata", description="Metadata collector.")

# API namespaces
metadata.add_namespace(metadata_ns)

from flask_restx import Api
from flask import Blueprint

# Import database namespace
from ..Controllers.database import api as database_ns

database_bp = Blueprint("database", __name__)

database = Api(database_bp, title="Database", description="Database collector.")

# API namespaces
database.add_namespace(database_ns)

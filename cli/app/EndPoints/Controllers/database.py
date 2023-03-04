from flask import request
from flask_restx import Resource

# Database modules
from ...Core.ApplicationServices.database import DatabaseService
from ...Core.Entities.database import DatabaseDto

api = DatabaseDto.api


@api.route("/config", methods=["POST"])
class Config(Resource):
    """config"""

    database_config = DatabaseDto.database_config
    @api.doc(
        "config",
        responses={
            200: ("Database success"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    @api.expect(database_config, validate=True)
    def post(self):
        """config"""
        return DatabaseService.data(request)
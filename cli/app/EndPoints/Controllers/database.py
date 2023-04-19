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


@api.route("/endpoints", methods=["POST"])
class Endpoints(Resource):
    """Endpoints collector"""

    @api.doc(
        "Endpoints collect",
        responses={
            200: ("Endpoints collect"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    def post(self):
        """Database collector"""

        return DatabaseService.endpoints(request)


@api.route("/collect", methods=["POST"])
class Collect(Resource):
    """Database collector endpoint
    Database collector then receives the user's information and access_token
    """

    @api.doc(
        "Database collect",
        responses={
            200: ("Database collect"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    def post(self):
        """Database collector"""

        return DatabaseService.collect()


@api.route("/clone", methods=["POST"])
class Clone(Resource):
    """Database clone endpoint
    Database clones then receives the user's information and access_token
    """

    @api.doc(
        "Database clone",
        responses={
            201: ("Database clone"),
            400: "Malformed data or validations failed.",
        },
    )
    def post(self):
        """Database clone"""

        return DatabaseService.clone()


@api.route("/preprocessor", methods=["POST"])
class preprocessor(Resource):
    """Preprocessor endpoint
    Preprocessor then receives the user's information and access_token
    """

    @api.doc(
        "Text preprocessor",
        responses={
            201: ("Text preprocessor."),
            400: "Malformed data or validations failed.",
        },
    )
    def post(self):
        """Text preprocessor"""

        return DatabaseService.preprocessor(request)


@api.route("/preprocessor_toText", methods=["POST"])
class Clone(Resource):
    """Text preprocessoring endpoint
    Text preprocessoring then receives the user's information and access_token
    """
    
    @api.doc(
        "Text preprocessoring",
        responses={
            201: ("Text preprocessoring."),
            400: "Malformed data or validations failed.",
        },
    )
    def post(self):
        """Text preprocessoring"""

        return DatabaseService.preprocessor_toText(request)

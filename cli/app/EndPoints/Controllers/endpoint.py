from flask import request
from flask_restx import Resource

from ...Core.ApplicationServices.endpoint import EndpointService
from ...Core.Entities.endpoint import EndpointDto

api = EndpointDto.api


@api.route("/collect")
class collect(Resource):
    """endpoint collector"""

    @api.doc(
        "Endpoint collector",
        responses={
            200: ("Success"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    def post(self):
        """Endpoint collector"""
        # Grab the json data
        endpoint_data = request.get_json()

        return EndpointService.collect_endpoints()


@api.route("/clone")
class clone(Resource):
    """endpoint clone"""

    @api.doc(
        "Endpoint clone",
        responses={
            201: ("Successfully registered user."),
            400: "Malformed data or validations failed.",
        },
    )
    def post(self):
        """Endpoint clone"""
        # Grab the json data

        return EndpointService.clone_endpoints()


@api.route("/config")
class config(Resource):
    """endpoint config"""

    @api.doc(
        "Endpoint config",
        responses={
            201: ("Successfully registered user."),
            400: "Malformed data or validations failed.",
        },
    )
    def post(self):
        """Endpoint config"""
        # Grab the json data
        endpoint_config_data = request.get_json()

        return EndpointService.save_config(endpoint_config_data)

from flask import request
from flask_restx import Resource

# Service modules
from ...Core.ApplicationServices.display import DisplayService
from ...Core.Entities.display import DisplayDto

api = DisplayDto.api


@api.route("/createImages")
class create_images(Resource):
    """Create Images"""

    @api.doc(
        "Create Images",
        responses={
            200: ("Success"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    def get(self):
        """Create Images"""
        # Grab the json data

        return DisplayService.create_images()


@api.route("/image")
class image(Resource):
    """Display image"""

    @api.doc(
        "Display image",
        responses={
            201: ("Successfully registered user."),
            400: "Malformed data or validations failed.",
        },
    )
    def get(self):
        """Display image"""
        # Grab the json data
        image_data = request.get_json()

        return DisplayService.show_images()

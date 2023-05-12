from flask import request
from flask_restx import Resource

# Auth modules
from ...Core.ApplicationServices.metadata import MetadataService
from ...Core.Entities.metadata import MetadataDto

api = MetadataDto.api


@api.route("/summarizer")
class summarizer(Resource):
    """metadata summarizer"""

    summarizer = MetadataDto.summarizer

    @api.doc(
        "Metadata collector",
        responses={
            200: ("Success"),
            400: "Validations failed.",
            403: "Incorrect password or incomplete credentials.",
            404: "Email does not match any account.",
        },
    )
    @api.expect(summarizer, validate=False)
    def post(self):
        """Metadata collector"""
        # Grab the json data
        metadata_data = request.get_json()

        return MetadataService.summarizer(metadata_data)

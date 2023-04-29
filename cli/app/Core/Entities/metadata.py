from flask_restx import Namespace, fields


class MetadataDto:
    api = Namespace("V1", description="metadata.")

    summarizer = api.model(
        "summarizer",
        {
            "checkbox_summarizer": fields.Boolean(required=False),
            "checkbox_keyword": fields.Boolean(required=False),
            "summarizer_size": fields.Integer(required=False),
            "keyword_size": fields.Integer(required=False),
        },
    )

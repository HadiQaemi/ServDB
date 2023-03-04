from flask_restx import Namespace, fields


class DatabaseDto:
    api = Namespace("V1", description="Database collector.")

    database_config = api.model(
        "Collect data",
        {
            "web_services": fields.List(fields.String),
            "libraries_io_api_keys": fields.String,
            "liberary_number": fields.Integer,
            "repository_number": fields.Integer,
            "lang": fields.String,
            "github_token": fields.List(fields.String),
            "github_endpoint_repository": fields.String,
            "github_endpoint_code": fields.String,
            "libraries_endpoint": fields.String,
        },
    )

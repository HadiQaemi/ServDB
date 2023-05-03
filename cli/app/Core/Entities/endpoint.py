from flask_restx import Namespace, fields


class EndpointDto:
    api = Namespace("V1", description="endpoints.")
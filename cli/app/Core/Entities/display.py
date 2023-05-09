from flask_restx import Namespace, fields


class DisplayDto:
    api = Namespace("V1", description="display.")
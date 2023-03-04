from flask import jsonify
import json
from environs import Env

env = Env()
env.read_env()


class DatabaseService:
    @staticmethod
    def data(request):
        if request.method == "POST":
            json_data = request.json
            with open(env.str("DIRECTION_CONFIG") + "\\sample.json", "w") as outfile:
                json.dump(json_data, outfile)
        return jsonify({"result": json_data, "status": "OK"})
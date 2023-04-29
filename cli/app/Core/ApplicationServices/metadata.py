from flask import jsonify
from ...Framework.shared.Collector import Collector
from environs import Env

env = Env()
env.read_env()

class MetadataService:
    @staticmethod
    def summarizer(json_data):
        collector = Collector(
            env.str("DIRECTION_PROJECT"),
            env.str("DIRECTION_CONFIG") + "\\sample.json",
            env.str("DIRECTION_SCRIPTS"),
        )
        if json_data["checkbox_summarizer"]:
            collector.summarize_items(
                env.str("DIRECTION_DATA") + "\\data.csv",
                env.str("DIRECTION_DATA") + "\\data_summarized.csv",
            )
        return jsonify({"status": "OK"})

from flask import jsonify
from git import Repo
import requests

from ...Framework.shared.Collector import Collector
from ...Framework.Utils import clean_address, data_maker

import os
import pandas as pd
import json
from environs import Env

env = Env()
env.read_env()

class EndpointService:
    @staticmethod
    def clone_endpoints():
        services = pd.read_csv(env.str("DIRECTION_DATA") + "\\endpoints_data.csv")
        for _, service in services.iterrows():
            clean_webservice = clean_address(service["webservice"])
            if not os.path.exists(
                env.str("DIRECTION_DATA")
                + "/repositories-endpoints/"
                + clean_webservice
                + "/"
                + service["repository_name"].replace("/", "_")
            ):
                Repo.clone_from(
                    service["clone_url"],
                    env.str("DIRECTION_DATA")
                    + "/repositories-endpoints/"
                    + clean_webservice
                    + "/"
                    + service["repository_name"].replace("/", "_"),
                )
        return jsonify({"result": services, "status": "OK"})

    @staticmethod
    def save_config(json_data):
        with open(env.str("DIRECTION_CONFIG") + "\\endpoints.json", "w") as outfile:
            json.dump(json_data, outfile)
        return jsonify({"result": json_data, "status": "OK"})

    @staticmethod
    def collect_endpoints():
        ### remove
        data = []
        # Initialize the collector class
        collector = Collector(
            env.str("DIRECTION_PROJECT"),
            env.str("DIRECTION_CONFIG") + "\\sample.json",
            env.str("DIRECTION_SCRIPTS"),
        )
        json = collector.read_json(env.str("DIRECTION_CONFIG") + "\\endpoints.json")
        # Irritate on web services
        for service in json["endpoints"]:
            # Make query for searching web service and program language on GitHub
            collector.make_query(
                collector.config["github_endpoint_code"],
                {"__@QUERY__": service, "__@LANG__": "java"},
            )
            # Send request to GitHub
            page_items = collector.check_session_send_request()
            item_count = 1
            for item in page_items["items"]:
                # Make Query for searching source codes on GitHub
                collector.make_query(item["repository"]["url"], {})
                repository = collector.send_request()
                # Prepair path
                path = (
                    repository["html_url"].replace(
                        env.str("URL_GITHUB"), env.str("URL_GITHUBCONTENT")
                    )
                    + "/"
                    + repository["default_branch"]
                )
                readme_file_extensions = [
                    "md",
                    "txt",
                    "scroll",
                    "rst",
                    "",
                    "mkd",
                    "markdown",
                    "rdoc",
                ]
                # Make Query for searching source codes on GitHub
                for extension in readme_file_extensions:
                    readme = requests.request("GET", path + "/README" + extension)
                    if readme.ok:
                        break
                    readme = requests.request("GET", path + "/readme" + extension)
                    if readme.ok:
                        break
                # Check if the readMe file found read it
                if readme.ok:
                    with open(env.str("DIRECTION_DATA") + "/readme.md", "wb") as f:
                        f.write(readme.content)
                # Clear readMe by calling clear_readme method
                cleared_text = collector.clear_readme(readme.ok)
                # Extract data from repository
                repository_data = data_maker(
                    repository, readme, cleared_text, item, service
                )
                # Append repository data
                data.append(repository_data)
                item_count += 1
                if item_count >= int(collector.config["liberary_number"]):
                    break
        df = pd.DataFrame(data)
        df.to_csv(
            env.str("DIRECTION_DATA") + "\\endpoints_data.csv",
            sep=",",
            encoding="utf-8",
        )
        return jsonify({"result": data, "status": "OK"})
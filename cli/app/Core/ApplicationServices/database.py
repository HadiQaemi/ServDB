from flask import current_app, jsonify
from ...Framework.shared.CodeToTextPreprocess import CodeToTextPreprocess
from ...Framework.shared.Collector import Collector
from ...Framework.shared.JavaCodePreprocess import JavaCodePreprocess
from ...Framework.Utils import data_maker_full
from app.utils import internal_err_resp
from git import Repo

import os
import pandas as pd
import time
import json
import requests
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
    
    @staticmethod
    def collect():
        # Assign vars
        try:
            data = []
            # Initialize the collector class
            collector = Collector(
                env.str("DIRECTION_PROJECT"),
                env.str("DIRECTION_CONFIG") + "\\sample.json",
                env.str("DIRECTION_SCRIPTS"),
            )
            # Irritate on web services
            for service in collector.config["web_services"]:
                # Make query for searching web service and program language on GitHub
                collector.make_query(
                    collector.config["github_endpoint_repository"],
                    {"__@QUERY__": service.replace("_", "+"), "__@LANG__": "java"},
                )
                # Send request to GitHub
                page_items = collector.check_session_send_request()
                item_count = 1
                # Irritate on result
                for item in page_items["items"]:
                    time.sleep(4)
                    # Make Query for searching libraries on libraries.io
                    collector.make_query(
                        collector.config["libraries_endpoint"],
                        {
                            "__@QUERY__": item["full_name"],
                            "__@APIKEY__": collector.config["libraries_io_api_keys"],
                        },
                    )
                    # Send request to libraries.io
                    libraries = collector.send_request()
                    # Check result
                    if (
                        "error" in libraries
                        or len(libraries) == 0
                        or libraries[0] == "error"
                    ):
                        continue

                    # Specify the library name
                    name = libraries[0]["name"].split(":")
                    name_split = name[0].split(".")
                    if len(name_split) > 2:
                        query = name_split[0] + "." + name_split[1]
                    else:
                        query = name[0]

                    # Make Query for searching source codes on GitHub
                    collector.make_query(
                        collector.config["github_endpoint_code"],
                        {"__@QUERY__": query, "__@LANG__": "java"},
                    )
                    repositories = collector.check_session_send_request()
                    repository_count = 1
                    # Make Query for searching source codes on GitHub
                    for source_repository in repositories["items"]:
                        # Make query for downloading the repository of GitHub
                        collector.make_query(source_repository["repository"]["url"], {})
                        # Download the repository of GitHub
                        repository = collector.send_request()
                        # Prepair path
                        path = (
                            item["html_url"].replace(
                                env.str("URL_GITHUB"), env.str("URL_GITHUBCONTENT")
                            )
                            + "/"
                            + repository["default_branch"]
                        )
                        # Download readme file of repository and consider various type of files
                        readme_file_extensions = [
                            ".md",
                            ".txt",
                            ".scroll",
                            ".rst",
                            "",
                            ".mkd",
                            ".markdown",
                            ".rdoc",
                        ]
                        for extension in readme_file_extensions:
                            readme = requests.request(
                                "GET", path + "/README" + extension
                            )
                            if readme.ok:
                                break
                            readme = requests.request(
                                "GET", path + "/readme" + extension
                            )
                            if readme.ok:
                                break
                        # Check if the readMe file found read it
                        if readme.ok:
                            with open(
                                env.str("DIRECTION_DATA") + "/readme.md", "wb"
                            ) as f:
                                f.write(readme.content)
                        # Clear readMe by calling clear_readme method
                        cleared_text = collector.clear_readme(readme.ok)
                        # Extract data from repository
                        repository_data = data_maker_full(
                            item,
                            repository,
                            readme,
                            cleared_text,
                            source_repository,
                            name,
                            repositories,
                            repository_count,
                            service,
                        )
                        # Append repository data
                        data.append(repository_data)
                        if repository_count >= int(
                            collector.config["repository_number"]
                        ):
                            break
                        repository_count += 1
                    # break
                    if item_count >= int(collector.config["liberary_number"]):
                        break
                    item_count += 1
            df = pd.DataFrame(data)
            # Save data
            df.to_csv(
                env.str("DIRECTION_DATA") + "\\data.csv", sep=",", encoding="utf-8"
            )
            return jsonify({"status": "OK", "result": data})

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def clone():
        services = pd.read_csv(env.str("DIRECTION_DATA") + "\\data.csv")
        for _, service in services.iterrows():
            path = (
                str(env.str("DIRECTION_DATA"))
                + "/repositories/"
                + str(service["webservice"])
                + "/"
                + str(service["full_name"].replace("/", "_"))
                + "/"
                + str(service["repository_name"].replace("/", "_"))
            )
            if not os.path.exists(path):
                try:
                    Repo.clone_from(service["clone_url"], path)
                except Exception as error:
                    print(error)
        return jsonify({"result": "clone", "status": "OK"})
    
    @staticmethod
    def preprocessor(request):
        if request.method == "POST":
            file_direction_serc = env.str("DIRECTION_DATA") + "\\repositories\\"
            file_direction_desc = (
                env.str("DIRECTION_DATA") + "\\repositories_preprocessed\\"
            )
            literal = env.str("DIRECTION_CONFIG") + "\\literals.json"
            JavaCodePreprocess(file_direction_serc, file_direction_desc, literal)
        return jsonify({"result": file_direction_desc, "status": "OK"})
    
    @staticmethod
    def endpoints(request):
        if request.method == "POST":
            src_dir = env.str("DIRECTION_DATA") + "\\repositories_preprocessed\\"
            des_dir = env.str("DIRECTION_DATA") + "\\endpoints\\"
            file_type = "train.txt"
            specify_domain = "NO"
            codeToTextPreprocess = CodeToTextPreprocess(
                src_dir, file_type, des_dir, specify_domain
            )
            result = codeToTextPreprocess.endpoints(des_dir, "endpoints.txt")
        return jsonify({'result': result, 'status': "OK"})

    @staticmethod
    def preprocessor_toText(request):
        if request.method == "POST":
            src_dir = env.str("DIRECTION_DATA") + "\\repositories_preprocessed\\"
            des_dir = env.str("DIRECTION_DATA") + "\\repositories_text\\"
            file_type = "train.txt"
            specify_domain = "NO"
            CodeToTextPreprocess(src_dir, file_type, des_dir, specify_domain)
        return jsonify(
            {"result": des_dir, "status": "OK"}
        )

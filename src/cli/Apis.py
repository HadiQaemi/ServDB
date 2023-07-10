# !/usr/bin/env python
# coding: utf-8

from flask_cors import CORS
from flask import Flask, request
from flask import jsonify
from classes.Collector import Collector
from classes.Preprocessor import Preprocessor
from classes.Plots import Plots
from git import Repo

from preprocess.JavaCodePreprocess import JavaCodePreprocess
from preprocess.CodeToTextPreprocess import CodeToTextPreprocess
import json
import os
import time
import pandas as pd
import base64
import requests

app = Flask(__name__)
CORS(app)

@app.route("/")
def mail():
    return "Dataset Generator"

global _file_direction
_file_direction = "/home/zakieh/Documents/SoftwareX/src/cli"
root = "/home/zakieh/Documents/SoftwareX"
@app.route('/endpoints/clone', methods=['POST'])
def clone_endpoints():
    file_direction = _file_direction + "/../../data"
    services = pd.read_csv(file_direction + "/endpoints_data.csv")
    for index, service in services.iterrows():
        print(file_direction + '/repositories-endpoints/' + service['webservice'].replace('https://', '').replace('//',
                                                                                                                  '_') + '/' +
              service['repository_name'].replace('/', '_') + '/' + service['repository_name'].replace('/', '_'))
        if not os.path.exists(
                file_direction + '/repositories-endpoints/' + service['webservice'].replace('https://', '').replace('/', '_') + '/' + service['repository_name'].replace('/',
                                                                                                               '_') + '/' +
                service['repository_name'].replace('/', '_')):
            Repo.clone_from(service['clone_url'],
                            file_direction + '/repositories-endpoints/' + service['webservice'].replace('https://', '').replace('/', '_') + '/' + service[
                                'repository_name'].replace('/', '_') + '/' + service['repository_name'].replace('/', '_'))
    return jsonify({'result': 'clone', 'status': 'OK'})

@app.route('/endpoints/collect', methods=['POST'])
def collect_endpoints():
    ### remove
    data = []
    collector = Collector(_file_direction, '/configs/sample.json', '/data/code_scripts')
    json = collector.read_json(_file_direction + '/configs/endpoints.json')
    # print(collector.config)
    for service in json['endpoints']:
        print('service:', service)
        collector.make_query(collector.config['github_endpoint_code'],
                             {'__@QUERY__': service, '__@LANG__': 'java'})
        page_items = collector.check_session_send_request()
        item_count = 1
        for item in page_items['items']:
            collector.make_query(item['repository']['url'], {})
            repository = collector.send_request()
            path = repository["html_url"].replace('https://github.com/', 'https://raw.githubusercontent.com/') + '/' + \
                   repository[
                       'default_branch']
            readme = requests.request("GET", path + '/README.md')
            if readme.ok == False:
                readme = requests.request("GET", path + '/readme.md')
                if readme.ok == False:
                    readme = requests.request("GET", path + '/README.txt')
                    if readme.ok == False:
                        readme = requests.request("GET", path + '/readme.txt')
                        if readme.ok == False:
                            readme = requests.request("GET", path + '/readme.scroll')
                            if readme.ok == False:
                                readme = requests.request("GET", path + '/README.scroll')
                                if readme.ok == False:
                                    readme = requests.request("GET", path + '/README.rst')
                                    if readme.ok == False:
                                        readme = requests.request("GET", path + '/readme.rst')
                                        if readme.ok == False:
                                            readme = requests.request("GET", path + '/README')
                                            if readme.ok == False:
                                                readme = requests.request("GET", path + '/README.mkd')
                                                if readme.ok == False:
                                                    readme = requests.request("GET", path + '/Readme.markdown')
                                                    if readme.ok == False:
                                                        readme = requests.request("GET", path + '/README.markdown')
                                                        if readme.ok == False:
                                                            readme = requests.request("GET",
                                                                                      path + '/readme.markdown')
                                                            if readme.ok == False:
                                                                readme = requests.request("GET",
                                                                                          path + '/README.rdoc')
                                                                if readme.ok == False:
                                                                    readme = requests.request("GET",
                                                                                              path + '/readme.rdoc')
                                                                    if readme.ok == False:
                                                                        readme = requests.request("GET",
                                                                                                  path + '/Readme.rdoc')
            if readme.ok:
                with open(_file_direction + '/readme.md', 'wb') as f:
                    f.write(readme.content)
            cleared_text = collector.clear_readme(readme.ok)
            repository_data = {
                "repository_name": repository['name'],
                "default_branch": repository['default_branch'],
                'readme_original': readme.content,
                'readme_cleared': cleared_text,
                'readme_summarized': '',
                'keywords': '',
                'html_url': item['html_url'],
                "clone_url": repository["clone_url"],
                "created_at": repository["created_at"],
                "updated_at": repository["updated_at"],
                "size": repository["size"],
                "stargazers_count": repository["stargazers_count"],
                "watchers_count": repository["watchers_count"],
                "has_issues": repository["has_issues"],
                "has_projects": repository["has_projects"],
                "has_downloads": repository["has_downloads"],
                "has_wiki": repository["has_wiki"],
                "has_pages": repository["has_pages"],
                "has_discussions": repository["has_discussions"],
                "forks_count": repository["forks_count"],
                "mirror_url": repository["mirror_url"],
                "archived": repository["archived"],
                "disabled": repository["disabled"],
                "open_issues_count": repository["open_issues_count"],
                "network_count": repository["network_count"],
                "subscribers_count": repository["subscribers_count"],
                "webservice": service,
                "description": repository["description"]
            }
            data.append(repository_data)
            # time.sleep(4)
            # break
            item_count += 1
            if item_count >= int(collector.config['liberary_number']):
                break
            print('item_count:', item_count)
    df = pd.DataFrame(data)
    df.to_csv(_file_direction + "/data/endpoints_data.csv", sep=',', encoding='utf-8')
    print(_file_direction + "/data/endpoints_data.csv")
    # createImages()
    return jsonify({'status': 'OK'})

@app.route('/endpoints/config', methods=['POST'])
def save_endpoints():
    if request.method == 'POST':
        json_data = request.json
        with open(_file_direction + "/configs/endpoints.json", "w") as outfile:
            json.dump(json_data, outfile)
    return jsonify({'result': json_data, 'status': 'OK'})

@app.route('/metadata/summarizer', methods=['POST'])
def summarizer():
    json_data = request.json
    collector = Collector(_file_direction, '/configs/sample.json', '/data/code_scripts')
    if json_data['checkbox_summarizer'] == 'checked':
        collector.summarize_items(root + "/data/data.csv", root + "/data/data_summarized.csv")
    if json_data['checkbox_keyword'] == 'checked':
        print('checked: checkbox_keyword')
        print(json_data['keyword_size'])
    print(json_data['checkbox_summarizer'])
    return jsonify({'status': 'OK'})

@app.route('/display/createImages', methods=['GET'])
def createImages():
    path = _file_direction + "/images/"
    files = os.listdir(path + "category/")
    for file_name in files:
        # construct full file path
        file = path + "category/" + file_name
        # print(file)
        if os.path.isfile(file):
            os.remove(file)
    preprocessor = Preprocessor()
    plots = Plots(_file_direction)
    df = pd.read_csv(_file_direction + "/../../data/data.csv")
    df = preprocessor.removeCommonWords(df, 'description')
    # print(df)
    # print('plot_workCloud')
    plots.plot_workCloud(df)
    # print('plot_yearly_statistic')
    plots.plot_yearly_statistic(df, 'webservice')
    # print('chart')
    # print(df)
    plots.chart(df)
    files = os.listdir(path + "category/")
    categories = []
    for file in files:
        temp = os.path.join(path + "category/" + file)
        f_temp = open(temp, 'rb')
        benc_temp = base64.b64encode(f_temp.read()).decode('utf-8')
        _temp = "data:image/png;base64," + benc_temp
        categories.append(_temp)
    year = os.path.join(path + 'statistic/', 'dataset_statistic_year.png')
    f_year = open(year, 'rb')
    benc_year = base64.b64encode(f_year.read()).decode('utf-8')
    _year = "data:image/png;base64," + benc_year
    issues_repo = os.path.join(path + 'statistic/', 'dataset_statistic_issues_repo.png')
    f_issues_repo = open(issues_repo, 'rb')
    benc_issues_repo = base64.b64encode(f_issues_repo.read()).decode('utf-8')
    _issues_repo = "data:image/png;base64," + benc_issues_repo
    return jsonify({'year': _year, 'issues_repo': _issues_repo, 'categories': categories})

@app.route('/display/image', methods=['GET'])
def showimage():
    path = _file_direction + "/images/"
    files = os.listdir(path + "category/")
    categories = []
    for file in files:
        temp = os.path.join(path + "category/" + file)
        f_temp = open(temp, 'rb')
        benc_temp = base64.b64encode(f_temp.read()).decode('utf-8')
        _temp = "data:image/png;base64," + benc_temp
        categories.append(_temp)
    year = os.path.join(path + 'statistic/', 'dataset_statistic_year.png')
    f_year = open(year, 'rb')
    benc_year = base64.b64encode(f_year.read()).decode('utf-8')
    _year = "data:image/png;base64," + benc_year
    issues_repo = os.path.join(path + 'statistic/', 'dataset_statistic_issues_repo.png')
    f_issues_repo = open(issues_repo, 'rb')
    benc_issues_repo = base64.b64encode(f_issues_repo.read()).decode('utf-8')
    _issues_repo = "data:image/png;base64," + benc_issues_repo
    return jsonify({'year': _year, 'issues_repo': _issues_repo, 'categories': categories})

@app.route('/database/config', methods=['POST'])
def data():
    if request.method == 'POST':
        json_data = request.json
        with open(_file_direction + "/configs/sample.json", "w") as outfile:
            json.dump(json_data, outfile)
    return jsonify({'result': json_data, 'status': 'OK'})

@app.route('/database/endpoints', methods=['POST'])
def endpoints():
    if request.method == 'POST':
        src_dir = root + "/data/repositories_preprocessed/"
        des_dir = root + "/data/endpoints/"
        file_type = "train.txt"
        specify_domain = "NO"
        codeToTextPreprocess = CodeToTextPreprocess(src_dir, file_type, des_dir, specify_domain)
        result = codeToTextPreprocess.endpoints(des_dir, 'endpoints.txt')
        print(result)
    return jsonify({'result': result, 'status': 'OK'})


@app.route('/database/preprocessor', methods=['POST'])
def preprocessor():
    if request.method == 'POST':
        file_direction_serc = root + "/data/repositories/"
        file_direction_desc = root + "/data/repositories_preprocessed/"
        literal = _file_direction + "/configs/literals.json"
        javaCodePreprocess = JavaCodePreprocess(file_direction_serc, file_direction_desc, literal)
        print(javaCodePreprocess)
    return jsonify({'result': file_direction_desc, 'status': 'OK'})


@app.route('/database/preprocessor_toText', methods=['POST'])
def preprocessor_toText():
    if request.method == 'POST':
        print('/database/preprocessor')
        src_dir =  root + "/data/repositories_preprocessed/"
        des_dir = root + "/data/repositories_text/"
        file_type = "train.txt"
        specify_domain = "NO"
        codeToTextPreprocess = CodeToTextPreprocess(src_dir, file_type, des_dir, specify_domain)
        print(codeToTextPreprocess)
    return jsonify({'result': des_dir, 'status': 'OK'})

@app.route('/database/collect', methods=['POST'])
def collect():
    ### remove
    data = []
    collector = Collector(_file_direction, '/configs/sample.json', '/../../data/code_scripts')
    # print(collector.config)
    for service in collector.config['web_services']:
        collector.make_query(collector.config['github_endpoint_repository'],
                             {'__@QUERY__': service.replace("_", "+"), '__@LANG__': 'java'})
        page_items = collector.check_session_send_request()
        print(service.replace("_", "+"))
        item_count = 1
        for item in page_items['items']:
            time.sleep(4)
            collector.make_query(collector.config['libraries_endpoint'], {'__@QUERY__': item['full_name'],
                                                                          '__@APIKEY__': collector.config[
                                                                              'libraries_io_api_keys']})
            libraries = collector.send_request()
            if 'error' in libraries:
                continue
            else:
                if len(libraries) == 0:
                    continue
            library_count = 1
            if libraries[0] == 'error':
                continue
            name = libraries[0]['name'].split(":")
            name_split = name[0].split(".")
            if len(name_split) > 2:
                query = name_split[0] + '.' + name_split[1]
            else:
                query = name[0]
            # print(name[0], query)
            collector.make_query(collector.config['github_endpoint_code'], {'__@QUERY__': query, '__@LANG__': 'java'})
            repositories = collector.check_session_send_request()
            repository_count = 1
            for source_repository in repositories['items']:
                collector.make_query(source_repository['repository']['url'], {})
                # print(source_repository['repository']['url'])
                repository = collector.send_request()
                path = item['html_url'].replace('https://github.com/', 'https://raw.githubusercontent.com/') + '/' + repository[
                    'default_branch']
                readme = requests.request("GET", path + '/README.md')
                if readme.ok == False:
                    readme = requests.request("GET", path + '/readme.md')
                    if readme.ok == False:
                        readme = requests.request("GET", path + '/README.txt')
                        if readme.ok == False:
                            readme = requests.request("GET", path + '/readme.txt')
                            if readme.ok == False:
                                readme = requests.request("GET", path + '/readme.scroll')
                                if readme.ok == False:
                                    readme = requests.request("GET", path + '/README.scroll')
                                    if readme.ok == False:
                                        readme = requests.request("GET", path + '/README.rst')
                                        if readme.ok == False:
                                            readme = requests.request("GET", path + '/readme.rst')
                                            if readme.ok == False:
                                                readme = requests.request("GET", path + '/README')
                                                if readme.ok == False:
                                                    readme = requests.request("GET", path + '/README.mkd')
                                                    if readme.ok == False:
                                                        readme = requests.request("GET", path + '/Readme.markdown')
                                                        if readme.ok == False:
                                                            readme = requests.request("GET", path + '/README.markdown')
                                                            if readme.ok == False:
                                                                readme = requests.request("GET",
                                                                                          path + '/readme.markdown')
                                                                if readme.ok == False:
                                                                    readme = requests.request("GET",
                                                                                              path + '/README.rdoc')
                                                                    if readme.ok == False:
                                                                        readme = requests.request("GET",
                                                                                                  path + '/readme.rdoc')
                                                                        if readme.ok == False:
                                                                            readme = requests.request("GET",
                                                                                                      path + '/Readme.rdoc')
                # print(source_repository)
                # print(repository)
                if readme.ok:
                    with open(
                            _file_direction + '/readme.md', 'wb') as f:
                        f.write(readme.content)
                cleared_text = collector.clear_readme(readme.ok)
                repository_data = {
                    "full_name": item['full_name'],
                    "repository_name": repository['name'],
                    "default_branch": repository['default_branch'],
                    'readme_original': readme.content,
                    'readme_cleared': cleared_text,
                    'readme_summarized': '',
                    'keywords': '',
                    'html_url': item['html_url'],
                    "sha": source_repository['sha'],
                    "library": name[0],
                    "total_count": repositories['total_count'],
                    "repository_count": repository_count,
                    "url": source_repository['repository']['url'],
                    "clone_url": repository["clone_url"],
                    "created_at": repository["created_at"],
                    "updated_at": repository["updated_at"],
                    "size": repository["size"],
                    "stargazers_count": repository["stargazers_count"],
                    "watchers_count": repository["watchers_count"],
                    "has_issues": repository["has_issues"],
                    "has_projects": repository["has_projects"],
                    "has_downloads": repository["has_downloads"],
                    "has_wiki": repository["has_wiki"],
                    "has_pages": repository["has_pages"],
                    "has_discussions": repository["has_discussions"],
                    "forks_count": repository["forks_count"],
                    "mirror_url": repository["mirror_url"],
                    "archived": repository["archived"],
                    "disabled": repository["disabled"],
                    "open_issues_count": repository["open_issues_count"],
                    "network_count": repository["network_count"],
                    "subscribers_count": repository["subscribers_count"],
                    "webservice": service,
                    "description": repository["description"]
                }
                data.append(repository_data)
                print('repository_count:', repository_count)
                if repository_count >= int(collector.config['repository_number']):
                    break
                repository_count += 1
            # break
            if item_count >= int(collector.config['liberary_number']):
                break
            item_count += 1
            print('item_count:', item_count)
    df = pd.DataFrame(data)
    df.to_csv(_file_direction + "/../../data/data.csv", sep=',', encoding='utf-8')
    print(_file_direction + "/../../data/data.csv")
    # createImages()
    return jsonify({'status': 'OK'})

@app.route('/database/clone', methods=['POST'])
def clone():
    file_direction = _file_direction + "/../../data"
    services = pd.read_csv(file_direction + "/data.csv")
    print(services)
    for index, service in services.iterrows():
        if not os.path.exists(
                file_direction + '/repositories/' + service['webservice'] + '/' + service['full_name'].replace('/',
                                                                                                               '_') + '/' +
                service['repository_name'].replace('/', '_')):
            Repo.clone_from(service['clone_url'],
                            file_direction + '/repositories/' + service['webservice'] + '/' + service[
                                'full_name'].replace('/', '_') + '/' + service['repository_name'].replace('/', '_'))
            # print(service)
            print(file_direction + '/repositories/' + service['webservice'] + '/' + service[
                                'full_name'].replace('/', '_') + '/' + service['repository_name'].replace('/', '_'))
    print(file_direction + '/repositories/' + service['webservice'] + '/' + service[
        'full_name'].replace('/', '_') + '/' + service['repository_name'].replace('/', '_'))
    return jsonify({'result': 'clone', 'status': 'OK'})

if __name__ == "__main__":
    app.run('0.0.0.0', port=5000, debug=True)  # default port is 5000

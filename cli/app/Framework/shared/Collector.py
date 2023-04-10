import random
import json
import requests
import os
import time
import wget
import subprocess
import nltk
import pandas as pd
import numpy as np
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from bs4 import BeautifulSoup


class Collector:
    config = None
    config_path = ""
    des_direction = ""
    path = ""
    query = ""
    tokenizer = None
    model = None

    def __init__(self, path, config_path, des_direction):
        self.path = path
        self.config_path = config_path
        self.des_direction = des_direction
        self.read_config()

    def read_json(self, file):
        f = open(file)
        return json.load(f)

    def read_config(self):
        f = open(self.config_path)
        self.config = json.load(f)

    def get_config(self):
        return self.config

    def git_header(self):
        return self.config["github_token"][
            random.randint(0, len(self.config["github_token"]) - 1)
        ]

    def make_query(self, item, values):
        query = item
        for value in values:
            query = query.replace(value, values[value])
        self.query = query

    def send_request(self):
        headers = {"Authorization": "Token " + self.git_header()}
        return json.loads(requests.request("GET", self.query, headers=headers).content)

    def check_directory(self, directories):
        des_direction = self.des_direction
        for directory in directories:
            des_direction += "/" + directory
            if not os.path.exists(des_direction):
                os.makedirs(des_direction)
        return des_direction

    def take_file(self, topic, item):
        directories = ["files", topic, item["repository"]["name"]]
        des_direction = self.check_directory(directories)
        try:
            file_info = self.check_session_send_request(item["url"])
            wget.download(url=file_info["download_url"], out=des_direction)
        except:
            print(item["url"], "**", file_info["download_url"])
        return file_info

    def check_session_send_request(self):
        page_items = self.send_request()
        loop = 0
        if "message" in page_items:
            check_session = 1
            while check_session:
                loop += 1
                time.sleep(loop * 10)
                check_session_send = self.send_request()
            if "message" not in check_session_send:
                check_session = 0
                page_items = check_session_send
        return page_items

    def clear_readme(self, status):
        context = ""
        if status:
            try:
                p = subprocess.Popen(
                    "pandoc -s " + self.path + "/data/readme.md",
                    stdout=subprocess.PIPE,
                    shell=True,
                )
                # my_string = str(p.communicate())
                soup = BeautifulSoup(
                    str(p.communicate()).replace("', None)", "").replace("(b'", ""),
                    "html.parser",
                )
                for div in soup.find_all("pre"):
                    div.decompose()
                text = ""
                for div in soup.find_all("p"):
                    if len(div.get_text()) > 10:
                        text += div.get_text() + ". "
                context = text.replace("\\n", "").replace("..", ".")
            except Exception as error:
                return context
        return context

    def get_dataset(self, status):
        context = ""
        if status:
            try:
                p = subprocess.Popen(
                    "pandoc -s " + self.path + "/data/readme.md",
                    stdout=subprocess.PIPE,
                    shell=True,
                )
                # my_string = str(p.communicate())
                soup = BeautifulSoup(
                    str(p.communicate()).replace("', None)", "").replace("(b'", ""),
                    "html.parser",
                )
                for div in soup.find_all("pre"):
                    div.decompose()
                text = ""
                for div in soup.find_all("p"):
                    if len(div.get_text()) > 10:
                        text += div.get_text() + ". "
                context = text.replace("\\n", "").replace("..", ".")

            except Exception as error:
                return context
        return context

    def isNaN(self, string):
        return string != string

    def summarize(self, data):
        max_input_length = 512
        if self.isNaN(data):
            return ""
        if self.tokenizer == None and self.model == None:
            self.tokenizer = AutoTokenizer.from_pretrained(
                "hadiqaemi/t5-github-readme-summarizer"
            )
            self.model = AutoModelForSeq2SeqLM.from_pretrained(
                "hadiqaemi/t5-github-readme-summarizer"
            )
        inputs = ["summarize: " + str(data)]
        inputs = self.tokenizer(
            inputs, max_length=max_input_length, truncation=True, return_tensors="pt"
        )
        output = self.model.generate(
            **inputs, num_beams=20, do_sample=True, min_length=20, max_length=64
        )
        decoded_output = self.tokenizer.batch_decode(output, skip_special_tokens=True)[
            0
        ]
        predicted_title = nltk.sent_tokenize(decoded_output.strip())
        if len(decoded_output):
            return predicted_title[0]
        return ""

    def batch_summarize(self, data):
        max_input_length = 512
        if self.tokenizer == None and self.model == None:
            self.tokenizer = AutoTokenizer.from_pretrained(
                "hadiqaemi/t5-github-readme-summarizer"
            )
            self.model = AutoModelForSeq2SeqLM.from_pretrained(
                "hadiqaemi/t5-github-readme-summarizer"
            )
        inputs = self.tokenizer(
            data,
            max_length=max_input_length,
            truncation=True,
            padding=True,
            return_tensors="pt",
        )
        output = self.model.generate(
            **inputs, num_beams=20, do_sample=True, min_length=20, max_length=64
        )
        decoded_output = self.tokenizer.batch_decode(output, skip_special_tokens=True)
        outputs = []
        for count in range(0, len(decoded_output)):
            outputs.append(decoded_output[count].strip())
        return outputs

    def summarize_items(self, data, desc):
        df = pd.read_csv(data)
        outputs = []
        for _, row in df.iterrows():
            outputs.append(self.summarize(row["readme_cleared"]))
        df["readme_summarized"] = outputs
        df.to_csv(desc, sep=",", encoding="utf-8")
        return True

# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.
import os.path
import argparse

import javalang
import json
import os, fnmatch
import re
from argparse import ArgumentTypeError, ArgumentParser
from pathlib import Path


class JavaCodePreprocess:
    lit_file_path = ""
    lits = []
    src_dir = ""
    des_dir = ""

    def __init__(self, src_dir, des_dir, literal):
        self.src_dir = src_dir
        self.des_dir = des_dir
        self.lit_file_path = literal
        self.lits = json.load(open(self.lit_file_path))
        self.main()

    def process_string(self, token, special_chars={" ": "U+0020", ",": "U+002C"}):
        str_quote_options = ["'''", '"""', "'", '"']
        start_quote = ""
        end_quote = ""
        qualifier_regex = r"^[a-z]+"
        qualifier_match = re.search(qualifier_regex, token)
        # string qualifiers like 'r' for regex, 'f' for formatted string, 'b' for bytes, 'u' for unicode, etc (or combination of them)
        qualifier = "" if not qualifier_match else qualifier_match[0]
        # token string without qualifiers
        token_string = re.sub(qualifier_regex, "", token)
        # string literal without quotes
        str_lit = token_string
        for q in str_quote_options:
            if token_string.startswith(q):
                start_quote = q
                str_lit = str_lit[len(q) :]
                if token_string.endswith(q):
                    end_quote = q
                    str_lit = str_lit[: -len(q)]
                    end_quote = q
                    str_lit = qualifier
                break
        use_char = False
        if len(str_lit) == 1 and start_quote == "'":
            use_char = True
        for sc in special_chars:
            str_lit = str_lit.replace(sc, special_chars[sc])
        if not use_char:
            ret = (
                f"{qualifier}{start_quote}<STR_LIT:{str_lit}>{end_quote}"
                if str_lit in self.lits["str"]
                else f"{qualifier}{start_quote}<STR_LIT>{end_quote}"
            )
        else:
            ret = (
                f"{qualifier}{start_quote}<CHAR_LIT:{str_lit}>{end_quote}"
                if str_lit in self.lits["char"]
                else f"{qualifier}{start_quote}<CHAR_LIT>{end_quote}"
            )
        return ret

    def clean_comment_code_line(self, inputLine: str) -> str:
        comment_placeholder = ""
        """
        1-Code between two comments /* Comment 1 */ foo(); /* Comment 2 */
        2-Line comments starting with an asterisk: //***NOTE***
        3-Comment delimiters inside string literals: stringbuilder.append("/*");; 
          also if there is a double quote inside single quotes before the comment
    
        replace comments with placeholders<comment>.
        """

        filteredInput = re.sub(
            "(/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+/)|(//.*)",
            comment_placeholder,
            inputLine,
        )  # for remove /*comments
        filteredInput2 = re.sub(
            "/\*(.*)?", comment_placeholder, filteredInput
        )  # for remove /*comments
        filteredInput3 = re.sub(
            r"^\*[\s]?.*", comment_placeholder, filteredInput2
        )  # for remove *comment
        filteredInput4 = re.sub(
            "\*[\s]?@.*", comment_placeholder, filteredInput3
        )  # for remove *@test but keep Type Annotations in Java 8:@override |@interface,.
        pat_linestartbystar = r"^\*[\w\s\d\n$!?#$%&\'()*+,-./:;<=>?@[\]^_`{|}~]+"

        filteredInput5 = re.sub(
            pat_linestartbystar, comment_placeholder, filteredInput4
        )  # for remove /*comments
        filteredInput6 = re.sub(
            r"^\*.*?", comment_placeholder, filteredInput5
        )  # emove anything between * and
        filteredInput6 = re.sub(
            r"^.*\*$", comment_placeholder, filteredInput6
        )  # emove anything between * and

        # filteredInput=re.sub(comment_placeholder, "", filteredInput) #for remove <comments> tags
        return filteredInput6

    def Findurl(self, string_input):
        # return empty string if it is not url
        endpoint = ""
        endpoints = [
            "https://graph.facebook.com/",
            "https://maps.googleapis.com/map",
            "http://maps.googleapis.com/map",
            "https://www.googleapis.com/auth/youtube",
            "https://api.twitter.com/",
            "https://api.openstreetmap.org",
            "https://api.rainforestapi.com",
            "https://www.flickr.com/services/rest",
            "https://api.twilio.com",
            "http://ws.audioscrobbler.com",
            "https://api.soundcloud.com",
            "https://api.linkedin.com",
            "https://graph.facebook.com",
            "https://www.mediawiki.org/",
            "https://www.mediawiki.org/wiki",
            "http://api.indeed.com/",
            "http://www.google.com/maps/",
        ]
        if string_input.startswith('"http'):
            # return URL string if it is not in wite list url
            endpoint = "<STR_URL>"
            for endpoint_url in endpoints:
                if string_input.startswith('"' + endpoint_url):
                    endpoint = string_input
        return endpoint

    def preprocess(self, file_name, des_dir_file, projectname, file_type):
        global broken_files
        try:
            contents = open(file_name, "r").readlines()
        except:
            broken_files = broken_files + 1
            contents = []
            pass
        dirname = os.path.dirname(des_dir_file)
        isExist = os.path.exists(dirname)
        if not isExist:
            os.makedirs(dirname)
        wf = open(des_dir_file, "w")
        for content in contents:
            # keep the indents
            space_count = 0
            content_len = len(content)
            content_lstrip = len(content.lstrip())
            if re.search(r"^\t+", content):
                tabs_count = content_len - content_lstrip
                space_count = 4 * tabs_count
            if re.search(r"^\s+", content):
                space_count = content_len - content_lstrip
            space_begining = " " * space_count
            new_data = []
            try:
                token_list_line = list(javalang.tokenizer.tokenize(content))
            except Exception:
                print("e")
                continue
            for tok in token_list_line:
                if "String" in str(type(tok)) or "Character" in str(type(tok)):
                    url = self.Findurl(str(tok.value))
                    if not (url is None) and (len(url) > 0):
                        token = f"{tok.value}"
                    else:
                        token = self.process_string(tok.value)
                elif "Integer" in str(type(tok)) or "FloatingPoint" in str(type(tok)):
                    if tok.value in self.lits["num"]:
                        token = f"<NUM_LIT:{tok.value}>"
                    else:
                        token = "<NUM_LIT>"
                else:
                    token = tok.value
                new_data.append(token)
            data = " ".join(new_data)
            if len(data) > 250:
                cleaned_comment_data = ""
            else:
                cleaned_comment_data = self.clean_comment_code_line(data)
            if len(cleaned_comment_data) > 0:
                try:
                    wf.write((space_begining + data) + "\n")
                except Exception:
                    print("e")
                    pass
        wf.close()

    def NonEmptyFile(self, s):
        p = Path(s)
        if p.stat().st_size == 0:
            raise ArgumentTypeError(f"{s} cannot be empty")
        return p

    def main(self):
        global broken_files
        broken_files = 0
        if not os.path.exists(self.des_dir):
            os.makedirs(self.des_dir)

        file_ext_pattern = "*.java"
        java_files_path_list = []
        domain_dir = os.listdir(self.src_dir)
        for repo_domain in domain_dir:
            projects = os.listdir(str(self.src_dir) + "/" + str(repo_domain))
            # the projects in repo
            j = 0
            file_count = 0
            for project in projects:
                j = j + 1
                projectname = project
                directory = (
                    str(self.src_dir) + "/" + str(repo_domain) + "/" + str(project)
                )

                for root, dirs, files in os.walk(directory):

                    for basename in files:
                        if fnmatch.fnmatch(basename, file_ext_pattern):
                            filename_in = os.path.join(root, basename)
                            """
                            some projects have path which project name is repeated several time
                            like cilib several time is repeated, so split based on first accurence of project name
                            :/root/environments/test_repos/cilib/simulator/
                            src/main/java/net/sourceforge/cilib/simulator/SimulatorShell.java
                            """
                            current_dir = filename_in.split(projectname, 1)
                            des_dir_file = (
                                str(self.des_dir)
                                + repo_domain
                                + "/"
                                + str(projectname)
                                + str(current_dir[1])
                            )

                            if os.path.isfile(filename_in):
                                file_count = file_count + 1
                                try:
                                    self.preprocess(
                                        filename_in,
                                        des_dir_file,
                                        projectname,
                                        file_type="",
                                    )
                                except Exception as error:
                                    print(error)

                # save statistic
                a_dictionary = {
                    "filecounts": file_count,
                    "projects": j,
                    "broken_files": broken_files,
                }
                file = open("train_counts_statistic.txt", "w")
                str_dictionary = repr(a_dictionary)
                file.write("a_dictionary = " + str_dictionary + "\n")
                file.close()

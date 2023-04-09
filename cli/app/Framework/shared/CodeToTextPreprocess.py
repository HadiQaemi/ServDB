import os.path
import os
import pathlib
from argparse import ArgumentTypeError
from pathlib import Path
import re
import glob
from datetime import datetime
import pandas as pd
import urllib.parse
from langdetect import detect
import numpy as np


class CodeToTextPreprocess:
    src_dir = ""
    file_type = ""
    des_dir = ""
    specify_domain = ""

    def __init__(self, src_dir, file_type, des_dir, specify_domain):
        self.src_dir = src_dir
        self.file_type = file_type
        self.des_dir = des_dir
        self.specify_domain = specify_domain
        self.main()

    def clean_comment_code_line(self, inputLine: str) -> str:
        comment_placeholder = ""
        """
        1-Code between two comments /* Comment 1 */ foo(); /* Comment 2 */
        2-Line comments starting with an asterisk: //***NOTE***
        3-Comment delimiters inside string literals: stringbuilder.append("/*");; 
          also if there is a double quote inside single quotes before the comment
        replace comments with placeholders<comment>.
        """

        filteredInput2 = re.sub(
            "/\*(.*)?", comment_placeholder, inputLine
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
        return filteredInput6

    def replace_token_param(self, inputLine: str) -> str:
        """
        1-replace id number or token spechialy on URLs
        """
        inputLine = re.sub(
            r"/[0-9]{1,50}\/", "/<NUM_PARAM>/", inputLine
        )  # remove number like  http:test.com/4355/rjr
        inputLine = re.sub(
            r"=[+-]?[0-9]{1,50}.?[0-9]{,5}&", "=<NUM_PARAM>&", inputLine
        )  # remove number in url  http:test.com>id=-44.66
        inputLine = re.sub(
            r"=[+-]?[0-9]{1,50}.?[0-9]{,5}", "=<NUM_PARAM>", inputLine
        )  # remove number in url  http:test.com>id=44
        return inputLine

    def process_service_domain(self, topic):
        """
        split topic
        """
        new_topic = ""
        if (topic.find("Advertising") != -1) or (topic.find("AMAZON") != -1):
            new_topic = "[ADVERESTING][AMAZON]"

        elif topic.find("Facebook") != -1:
            new_topic = "[SOCIAL][FACEBOOK]"

        elif topic.find("Flickr") != -1:
            new_topic = "[PHOTOS][FLICKR]"

        elif (topic.find("Engine") != -1) or (topic.find("AppEngine") != -1):
            new_topic = "[TOOLS][GOOGLE]"

        elif topic.find("YouTube") != -1:
            new_topic = "[VIDEO][YOUTUBE]"

        elif topic.find("GoogleCalendar") != -1:
            new_topic = "[CALENDAR][GOOGLE]"

        elif topic.find("GoogleDrive") != -1:
            new_topic = "[STORAGE][GOOGLE]"

        elif topic.find("GoogleMaps") != -1:
            new_topic = "[MAP][GOOGLE]"

        elif topic.find("Instagram") != -1:
            new_topic = "[PHOTOS][INSTAGRAM]"

        elif topic.find("Lastfm") != -1:
            new_topic = "[MUSIC][LASTFM]"

        elif topic.find("LinkedIn") != -1:
            new_topic = "[SOCIAL][LINKEDIN]"

        elif topic.find("OpenStreetMap") != -1:
            new_topic = "[MAP][OPENSTREET]"

        elif topic.find("SoundCloud") != -1:
            new_topic = "[MUSIC][SOUNDCLOUD]"

        elif topic.find("Twilio") != -1:
            new_topic = "[TELEPHONY][TWILIO]"

        elif topic.find("Twitter") != -1:
            new_topic = "[SOCIAL][TWITTER]"

        elif topic.find("Wikipedia") != -1:
            new_topic = "[REFERENCE][WIKIPEDIA]"

        return new_topic

    def NonEmptyFile(self, s):
        p = Path(s)
        if p.stat().st_size == 0:
            raise ArgumentTypeError(f"{s} cannot be empty")
        return p

    def preprocess(self, src_dir, domain_file, des_dir, file_type, specify_domain):
        train_target_path = str(src_dir) + str(domain_file)
        for filepath in pathlib.Path(train_target_path).glob("**/*.java"):
            try:
                absolute_javafilepath = filepath.absolute()
                contents = open(absolute_javafilepath, "r").readlines()
                target_txt_file_name = (
                    r"" + str(des_dir) + str(domain_file) + "_" + file_type
                )
                isExist = os.path.exists(des_dir)
                if not isExist:
                    os.makedirs(des_dir)
                wf = open(target_txt_file_name, "+a")
                for content in contents:
                    content = content.rstrip()
                    if len(content) > 1:
                        content = self.clean_comment_code_line(content)
                        content = self.replace_token_param(content)
                        if specify_domain == "NO":
                            train_line = str(content)  # + '<|endoftext|>'
                        elif specify_domain == "YES":
                            domain = domain_file.replace("API", "")  # GOOGLE MAP
                            domain = domain.replace("_", "")  # GOOGLE-MAP
                            domain = domain.replace(".", "")  # removedot
                            processed_domain = self.process_service_domain(domain)
                            train_line = (
                                "" + processed_domain + " " + str(content)
                            )  # + '<|endoftext|>'
                    wf.write((train_line) + "\n")
                wf.close()
            except Exception as e:
                print("e", repr(e))
                break

    import urllib.parse

    def preprocess_clean_url(self, urlstr_input):
        import re

        pre_processed = urlstr_input
        try:
            pre_processed = re.sub(
                r"(https://www.youtube.com/channel/.*<STR_TOKEN>.*)",
                "https://www.youtube.com/channel/<STR_TOKEN>",
                pre_processed,
            )
            pre_processed = re.sub(
                r"(=[A-Za-z0-9-]{20,}&)", "=<STR_TOKEN>", pre_processed
            )
            pre_processed = re.sub(
                r"(https://www.youtube.com/playlist?list=[A-Za-z0-9-_]{20,})",
                "https://www.youtube.com/playlist?list=<STR_TOKEN>",
                pre_processed,
            )
            pre_processed = re.sub(
                r"(https://www.youtube.com/watch?v={10,}&)",
                "https://www.youtube.com/playlist?list=<STR_TOKEN>",
                pre_processed,
            )
            pre_processed = re.sub(
                r"(https://www.youtube.com/channel/[A-Za-z0-9-_]{10,})",
                "https://www.youtube.com/playlist?list=<STR_TOKEN>",
                pre_processed,
            )

            pre_processed = re.sub(
                r"(=[A-Za-z0-9-]{34})", "=<STR_TOKEN>", pre_processed
            )
            pre_processed = re.sub(r"(=[a-z0-9]{27})", "=<STR_TOKEN>", pre_processed)
            pre_processed = re.sub(r"(=[a-z0-9]{21})", "=<STR_TOKEN>", pre_processed)
            pre_processed = re.sub(
                r"(=[A-Za-z0-9-_]{39})", "=<STR_TOKEN>", pre_processed
            )
            pre_processed = re.sub(
                r"(=[A-Za-z0-9]{11,11}&)", "=<STR_TOKEN>", pre_processed
            )
            pre_processed = re.sub(
                r"(=<STR_TOKEN>[A-Za-z0-9-_]*<STR_TOKEN>*)",
                "=<STR_TOKEN>",
                pre_processed,
            )
            pre_processed = re.sub(
                r"(=<STR_TOKEN>[A-Za-z0-9-_]*)", "=<STR_TOKEN>", pre_processed
            )
            pre_processed = re.sub(
                r"(playlist?list=[A-Za-z0-9-_]*<STR_TOKEN>[A-Za-z0-9-_]*)",
                "playlist?list=<STR_TOKEN>",
                pre_processed,
            )
            pre_processed = re.sub(
                r"(https://www.youtube.com/channel/.*<STR_TOKEN>.*)",
                "https://www.youtube.com/channel/<STR_TOKEN>",
                pre_processed,
            )
        except AttributeError:
            pre_processed = ""  # apply your error handling
        return pre_processed

    def preprocess_clean_url_number_token(self, urlstr_input):
        try:
            pre_processed = re.sub(r"([0-9-_]{8,})", "<STR_TOKEN>", urlstr_input)
        except AttributeError:
            pre_processed = ""  # apply your error handling
        return pre_processed

    def preprocess_urldecode(self, urlstr_input):
        import re

        found = ""
        try:
            pre_processed = urllib.parse.unquote(urlstr_input)
            pre_processed = re.sub("%2F", "/", pre_processed)
            pre_processed = re.sub("%22", '"', pre_processed)
            pre_processed = re.sub("%26", "&", pre_processed)
            pre_processed = re.sub("/?&&", "", pre_processed)
            pre_processed = re.sub("%20", " ", pre_processed)

        except AttributeError:
            pre_processed = ""  # apply your error handling
        return pre_processed

    def detect_en(self, text):
        try:
            return detect(text) == "en"
        except:
            return False

    def filter_en_data(self, clm_name, df=None):

        if clm_name in df:
            df = df[df[clm_name].apply(self.detect_en)]
            return df
        return df

    def detect_noise(self, text):
        import re

        if (
            re.match(r'^"', text)
            or ("https://github.com/" in text)
            or ("https://mail.google.com/" in text)
            or ('"https' in text)
        ):
            return False
        else:
            return True

    def filter_noise_data(self, clm_name, df=None):

        if clm_name in df:
            df = df[df[clm_name].apply(self.detect_noise)]
            return df
        return df

    def filter_based_len(self, clm_name, len=50, df=None):

        if not clm_name in df.columns:
            return df

        df["length"] = df[clm_name].str.len()
        df.sort_values("length", ascending=False, inplace=True)

        df["length"] = df["length"].astype("Int64")
        df = df[~(df["length"] > len)]
        df = df.drop(["index", "Unnamed: 0"], axis=1, errors="ignore")
        # remove null
        df = df.replace(np.nan, "", regex=True)  # All data frame
        # reindex
        df.reset_index(inplace=True)
        return df

    def endpoints(self, src_dir, final_file_name):
        os.chdir(src_dir)
        extension = "txt"
        all_txt_filenames = [i for i in glob.glob("*.{}".format(extension))]

        final_test_txt = f"" + self.src_dir + final_file_name
        # Open file3 in write mode
        with open(final_test_txt, "w") as outfile:
            k = 0
            # Iterate through list
            for names in all_txt_filenames:
                # Open each file in read mode

                path_file = r"" + str(src_dir) + "/" + str(names)
                with open(path_file) as infile:
                    k = k + 1
                    # read the data from file1 and
                    # file2 and write it in file3
                    outfile.write(infile.read())
                    now = datetime.now()
                    current_time = now.strftime("%H:%M:%S")
                # Add '\n' to enter data of file2
                # from next line
                outfile.write("\n")
        codes = []
        with open(final_test_txt, "r") as fp:
            for line in fp:
                codes.append(line)
        df_api = pd.DataFrame({"code": codes})
        contain_values_http = df_api[df_api["code"].str.contains(r"\"https?://")]
        contain_values_http["code"] = (
            contain_values_http["code"].astype(str).apply(self.extracturl_info)
        )
        http_ser_url = contain_values_http[
            contain_values_http["code"].str.contains(
                r".instagram|facebook|googleapis|api.linkedin|youtube|twilio|api.openstreetmap.org|appengine.api|en.wikipedia.org/w/api|soundcloud.api|api.soundcloud|api.rainforestapi.com"
            )
        ]
        http_ser_url["code"] = (
            http_ser_url["code"].astype(str).apply(self.preprocess_urldecode)
        )
        http_ser_url["code"] = (
            http_ser_url["code"].astype(str).apply(self.preprocess_clean_url)
        )
        http_ser_url["code"] = (
            http_ser_url["code"]
            .astype(str)
            .apply(self.preprocess_clean_url_number_token)
        )
        deduplicated_urls = http_ser_url.drop_duplicates(subset="code", keep="last")
        df_rm_non_en = self.filter_based_len("code", 150, deduplicated_urls)
        df_rm_non_en = df_rm_non_en.sort_values(by="length", ascending=True)
        df_rm_non_en.to_csv(src_dir + "extracted_url_api.csv")
        return src_dir + "extracted_url_api.csv"

    def extracturl_info(self, urlstr_input):
        found = ""
        try:
            found = re.search('.* "(.+)".*', urlstr_input).group(1)
        except AttributeError:
            found = ""  # apply your error handling
        return found

    def main(self):
        domain_dir = os.listdir(self.src_dir)
        for train_domain_file in domain_dir:
            self.preprocess(
                self.src_dir,
                train_domain_file,
                self.des_dir,
                self.file_type,
                self.specify_domain,
            )

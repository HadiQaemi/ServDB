import nltk
import re
import re
import numpy as np

nltk.download("stopwords")


class Preprocessor:
    config_path = ""

    def __init__(self):
        self.config_path = "config_path"

    def removeHTMLTags(string):
        result = re.sub("<.*?>", "", string)
        return result

    def getCommonWords(self, count_data, countVectorizerOBJ, n):
        words = countVectorizerOBJ.get_feature_names_out()
        total_counts = np.zeros(len(words))
        for t in count_data:
            total_counts += t.toarray()[0]

        count_dict = zip(words, total_counts)
        count_dict = sorted(count_dict, key=lambda x: x[1], reverse=True)[0:n]
        words = [w[0] for w in count_dict]
        counts = [w[1] for w in count_dict]
        x_pos = np.arange(len(words))
        return words

    def getCommonWord(self, df, clmName, n=10):
        from sklearn.feature_extraction.text import CountVectorizer

        countVectorizerOBJ = CountVectorizer()
        countData = countVectorizerOBJ.fit_transform(df[clmName].values.astype("U"))
        commonWords = self.getCommonWords(countData, countVectorizerOBJ, n)
        return commonWords

    def removeCommonWords(self, df, clmName, n=10):
        commonwords = self.getCommonWord(df, clmName, n)
        pat = r"\b(?:{})\b".format("|".join(commonwords))
        df[clmName] = df[clmName].str.replace(pat, "", regex=True)
        return df

    def isNaN(string):
        return string != string

    def removeStopWords(self, sentence):
        from nltk.corpus import stopwords

        global re_stop_words
        stop_words = set(stopwords.words("english"))
        stop_words.update(
            [
                "monthly",
                "google",
                "use",
                "api",
                "apis",
                "json",
                "Json",
                "service",
                "data",
                "REST",
                "RESTFUL",
                "website",
                "site",
                "Java",
                "java",
                "Android",
            ]
        )
        re_stop_words = re.compile(r"\b(" + "|".join(stop_words) + ")\\W", re.I)
        # replace each non-letter with empty string
        sentence = re.sub("[^a-zA-Z]", " ", str(sentence))
        if self.isNaN(sentence):
            sentence = ""
        sentence_ = re_stop_words.sub(" ", sentence)
        return sentence_


import pandas as pd


class ServiceCrawledDataPreProcess:
    df_crawled = pd.DataFrame()

    def select_baseon_keyword(self, keyword, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled = self.df_crawled[self.df_crawled.keywords.isin(keyword)]
        return self.df_crawled

    def Replace_keywords_to_category(self, replacement, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled["keywords"] = self.df_crawled["keywords"].replace(
            replacement, regex=True
        )
        return self.df_crawled

    # filter english text:
    def detect_en(self, text):
        from langdetect import detect

        try:
            return detect(text) == "en"
        except:
            return False

    # preprocess and delete html tags
    def removeNone_english(self, string):
        match = re.search("[a-zA-Z\s]+", string)
        if match:
            return match.group()
        else:
            return ""

    def filter_en_data(self, Clm_name, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled = self.df_crawled[
            self.df_crawled[Clm_name].apply(self.detect_en)
        ]
        return self.df_crawled

    # preprocess and delete html tags
    def removeHTMLTags(self, string):
        result = re.sub("<.*?>", "", string)
        return result

    def filter_HTML_data(self, Clm_name, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled[Clm_name] = (
            self.df_crawled[Clm_name].astype(str).apply(self.removeHTMLTags)
        )
        return self.df_crawled

    def filter_URL_data(self, Clm_name, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled[Clm_name] = self.df_crawled[Clm_name].str.replace(
            "http\S+|www.\S+", "", case=False, regex=True
        )
        return self.df_crawled

    def remove_characters(self, string):
        result = re.sub("[^A-Za-z0-9 ]+", " ", string)
        return result

    def remove_special_characters(self, Clm_name, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled[Clm_name] = (
            self.df_crawled[Clm_name].astype(str).apply(self.remove_characters)
        )
        return self.df_crawled

    def filter_based_len(self, Clm_name, len=50, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled["length"] = self.df_crawled[Clm_name].str.len()
        self.df_crawled.sort_values("length", ascending=False, inplace=True)

        self.df_crawled["length"] = self.df_crawled["length"].astype("Int64")
        self.df_crawled = self.df_crawled[~(self.df_crawled["length"] <= 50)]
        self.df_crawled = self.df_crawled.drop(
            ["index", "Unnamed: 0"], axis=1, errors="ignore"
        )
        # remove null
        self.df_crawled = self.df_crawled.replace(
            np.nan, "", regex=True
        )  # All data frame
        # reindex
        self.df_crawled.reset_index(inplace=True)
        return self.df_crawled

    def filter_based_len(self, Clm_name, len=50, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled["length"] = self.df_crawled[Clm_name].str.len()
        return self.df_crawled

    def remove_null(self, Clm_name, len=50, df=None):
        if df is not None:
            self.df_crawled = df
        self.df_crawled = self.df_crawled[self.df_crawled[Clm_name].isnull() == False]
        self.df_crawled = self.df_crawled[self.df_crawled[Clm_name].isna() == False]
        return self.df_crawled

    def map_clm_name(self, map_clm, df=None):
        if df is not None:
            self.df_crawled = df
        df_temp = self.df_crawled
        df_temp = df_temp.rename(map_clm)
        self.df_crawled = df_temp
        return self.df_crawled

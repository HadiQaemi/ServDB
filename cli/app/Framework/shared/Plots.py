import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS
from sklearn.preprocessing import LabelEncoder
import numpy as np
import matplotlib
import os
import pandas as pd
from environs import Env

env = Env()
env.read_env()
matplotlib.use("agg")

class Plots:
    path = ""

    def __init__(self, path):
        self.path = path

    def unique_list(self, l):
        ulist = []
        [ulist.append(x) for x in l if x not in ulist]
        return ulist

    def plot_wordcloud(self, df: pd.DataFrame, category: str):
        value_list = df[df["webservice"] == category]["description"].values
        words = ",".join(str(v) for v in value_list)
        plt.rcParams["figure.figsize"] = 4, 4
        wordcloud = WordCloud(
            stopwords=STOPWORDS, background_color="black", max_words=1000
        ).generate(words)
        plt.title("WordCloud For {}".format(category))
        plt.style.use("dark_background")
        plt.imshow(wordcloud, interpolation="bilinear")
        plt.axis("off")
        plt.savefig(env.str("DIRECTION_IMAGE_CATEGORY") + "\\" + category + ".png")

    def plot_barchart(self, df: pd.DataFrame, clmn: str, title="Bar Chart"):
        fg, axs = plt.subplots(1, 1, figsize=(15, 20))
        ax = sns.countplot(y=clmn, data=df)
        plt.title(title)

    def plot_yearly_statistic(
        self, df: pd.DataFrame, clmn_target: str, title="sssss Chart"
    ):
        df_all = df
        df_all["yyyy"] = pd.to_datetime(df["created_at"]).dt.year
        grouped_by_year = df_all.groupby(["yyyy", "webservice"])["webservice"].count()
        plt.style.use("dark_background")
        grouped_by_year.unstack(level=1).plot.bar(figsize=(14, 6))
        plt.grid(False)
        if not os.path.exists(env.str("DIRECTION_IMAGE_STATISTIC")):
            os.makedirs(env.str("DIRECTION_IMAGE_STATISTIC"))
        plt.savefig(env.str("DIRECTION_IMAGE_STATISTIC") + "\\dataset_statistic_year.png")

    def plot_workCloud(self, df: pd.DataFrame):
        df_temp = df
        # Plot word Cloud
        labeler = LabelEncoder()
        df_temp["target"] = labeler.fit_transform(df_temp["webservice"])
        mapping = []
        for i in range(0, len(labeler.classes_)):
            mapping.append(labeler.classes_[i])
        plt.style.use("dark_background")
        for i in range(0, len(mapping)):
            self.plot_wordcloud(df, mapping[i])

    def chart(self, df):
        def extract_categories3(df: pd.DataFrame, clmn_target: str) -> None:
            apis_lable = df[clmn_target].unique()
            lable_plot = []
            for i in apis_lable:
                lable_plot.append(i)
            lable_plot
            return lable_plot

        extract_cat_arr = extract_categories3(df, "webservice")

        def extract_featuers_sum3(
            df: pd.DataFrame, clmn_lable: str, clmn_target_feature: str
        ) -> None:
            df2_statis = df.groupby(clmn_lable).agg({clmn_target_feature: ["sum"]})
            lable_plot = []
            species = df2_statis[clmn_target_feature].values
            count_arr = []
            for i in species:
                count_arr.append(i[0])
            return count_arr

        repository_count_arr = extract_featuers_sum3(
            df, "webservice", "repository_count"
        )
        has_projects_arr = extract_featuers_sum3(df, "webservice", "has_projects")
        has_issues_arr = extract_featuers_sum3(df, "webservice", "has_issues")

        # figure(figsize=(9, 4))

        species = extract_cat_arr
        # species = ( 'Amazon Product Advertising','Facebook', 'Google Maps','Twitter','YouTube')
        sex_counts = {
            "Repository count": np.array(repository_count_arr),
            "Issues": np.array(has_issues_arr),
            "Projects": np.array(has_projects_arr),
        }
        width = 0.9  # the width of the bars: can also be len(x) sequence
        fg_year, ax_year = plt.subplots(1, 1, figsize=(9, 4))
        p = ax_year.barh(
            species,
            np.array(has_projects_arr),
            width,
            label="Projects",
            color="#b3cccc",
        )
        ax_year.bar_label(p, label_type="center")
        p = ax_year.barh(
            species,
            np.array(repository_count_arr),
            width,
            left=np.array(has_projects_arr),
            label="Repository count",
            color="#686868",
        )
        ax_year.bar_label(p, label_type="center")
        p = ax_year.barh(
            species,
            np.array(has_issues_arr),
            width,
            label="Issues",
            left=np.array(repository_count_arr),
            color="#75a3a3",
        )
        ax_year.bar_label(p, label_type="center")
        ax_year.set_title("Statistic of project and service usage")
        plt.style.use("dark_background")
        ax_year.legend()
        plt.grid(False)
        if not os.path.exists(env.str("DIRECTION_IMAGE_STATISTIC")):
            os.makedirs(env.str("DIRECTION_IMAGE_STATISTIC"))
        plt.savefig(
            env.str("DIRECTION_IMAGE_STATISTIC") + "\\dataset_statistic_issues_repo.png"
        )
        return ""

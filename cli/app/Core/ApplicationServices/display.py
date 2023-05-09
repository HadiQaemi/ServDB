import base64
from flask import jsonify

from ...Framework.shared.Plots import Plots
from ...Framework.shared.Preprocessor import Preprocessor

import os
import pandas as pd
from environs import Env

env = Env()
env.read_env()

class DisplayService:
    @staticmethod
    def create_images():
        isExist = os.path.exists(env.str("DIRECTION_IMAGE_CATEGORY"))
        if not isExist:
            os.makedirs(env.str("DIRECTION_IMAGE_CATEGORY"))
        files = os.listdir(env.str("DIRECTION_IMAGE_CATEGORY"))
        for file_name in files:
            file = env.str("DIRECTION_IMAGE_CATEGORY") + "\\" + file_name
            if os.path.isfile(file):
                os.remove(file)
        preprocessor = Preprocessor()
        plots = Plots(env.str("DIRECTION_DATA"))
        df = pd.read_csv(env.str("DIRECTION_DATA") + "\\data.csv")
        df = preprocessor.removeCommonWords(df, "description")
        plots.plot_workCloud(df)
        plots.plot_yearly_statistic(df, "webservice")
        plots.chart(df)
        categories = []
        for file in files:
            temp = os.path.join(env.str("DIRECTION_IMAGE_CATEGORY"), file)
            f_temp = open(temp, "rb")
            benc_temp = base64.b64encode(f_temp.read()).decode("utf-8")
            _temp = "data:image/png;base64," + benc_temp
            categories.append(_temp)
        year = os.path.join(
            env.str("DIRECTION_IMAGE_STATISTIC"), "dataset_statistic_year.png"
        )
        f_year = open(year, "rb")
        benc_year = base64.b64encode(f_year.read()).decode("utf-8")
        _year = "data:image/png;base64," + benc_year
        issues_repo = os.path.join(
            env.str("DIRECTION_IMAGE_STATISTIC"), "dataset_statistic_issues_repo.png"
        )
        f_issues_repo = open(issues_repo, "rb")
        benc_issues_repo = base64.b64encode(f_issues_repo.read()).decode("utf-8")
        _issues_repo = "data:image/png;base64," + benc_issues_repo
        return jsonify(
            {"year": _year, "issues_repo": _issues_repo, "categories": categories}
        )

    @staticmethod
    def show_images():
        files = os.listdir(env.str("DIRECTION_IMAGE_CATEGORY"))
        categories = []
        for file in files:
            temp = os.path.join(env.str("DIRECTION_IMAGE_CATEGORY"), file)
            f_temp = open(temp, "rb")
            benc_temp = base64.b64encode(f_temp.read()).decode("utf-8")
            _temp = "data:image/png;base64," + benc_temp
            categories.append(_temp)
        year = os.path.join(env.str("DIRECTION_IMAGE_STATISTIC"), "dataset_statistic_year.png")
        f_year = open(year, "rb")
        benc_year = base64.b64encode(f_year.read()).decode("utf-8")
        _year = "data:image/png;base64," + benc_year
        issues_repo = os.path.join(
            env.str("DIRECTION_IMAGE_STATISTIC"), "dataset_statistic_issues_repo.png"
        )
        f_issues_repo = open(issues_repo, "rb")
        benc_issues_repo = base64.b64encode(f_issues_repo.read()).decode("utf-8")
        _issues_repo = "data:image/png;base64," + benc_issues_repo
        return jsonify(
            {"year": _year, "issues_repo": _issues_repo, "categories": categories}
        )

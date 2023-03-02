# Introduction
ServDB provides a framework for data collection, preprocessing, and visualization of web service data to advance experimental analysis in this area. This framework is developed to be a parametric, systematic, and extendable framework. Moreover, Text-to-Text Transfer Transformer
(T5) is employed to provide short text, which helps to reduce the computational complexity for current Deep Learning (DL) models (e.g., Bert, GPT). The architecture of the framework includes the following components: 1) Collector, 2) Preprocessor, 3) Data enhancer using AI, 4) Formatter, 5)  Theia extension Interface and a CLI. 

- [Requirements](#requirements)
- [Quick Installation](#quick-usage)
- [Notebooks](#Notebooks)
- [Theia Interface](#theia-interface)

# Requirements
The list of the third-party library are listed on the requirments.txt file; however, the two main used library and requirements are:

- Python 3.7+
- [HuggingFace](https://huggingface.co/)
- [Javalang](https://pypi.org/project/javalang/)
- [scikit-learn](https://scikit-learn.org)
- System Requirements: CPU: 2cv RAM: 8 GB

# Quick Usage
The trained models have been packaged using the Python Setuptools library. Therefore, this component must install the related package by cloning the package, browsing to the main directory, and executing the following commands. 
```
git clone https://github.com/eclipse-opensmartclide/smartclide-smart-assistant.git
python3 pip install -r request.txt
python3 ServDB/src/cli/Apis.py   
cd /src/TheiaGUI/ & yarn
cd /src/TheiaGUI/ & yarn theia start --hostname 0.0.0.0 --port 8080
```
Open http://localhost:8080 in the browser.


### Theia Interface
In ServDB, many tasks are required to run in the background independently of the user interface (UI). AI Models are one of these tasks that must serve requests in real-time and return results. Theia interface have used for GUI, which is an online IDE
that have brought benefits like browser-based accessibility and convenient deployment workspaces. 


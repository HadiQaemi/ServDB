# Introduction
ServDB provides a framework for data collection, preprocessing, and visualization of web service data to advance experimental analysis in this area. This framework is developed to be a parametric, systematic, and extendable framework. Moreover, Text-to-Text Transfer Transformer(T5) is employed to provide short text, which helps to reduce the computational complexity for current Deep Learning (DL) models (e.g., Bert, GPT). The architecture of the framework includes the following components: 1) Collector, 2) Preprocessor, 3) Data enhancer using AI, 4) Formatter, 5)  Theia extension Interface and a CLI. 

This system has two parts: one on the server side, which runs on Python, and the other on the client side, which uses Theia, a cloud-based IDE. The image below illustrates the system's architecture. Additionally, for summarizing lengthy project readmes, we've implemented a summary model based on T5.

<img src="https://github.com/HadiQaemi/ServDB/blob/main/docs/architecture.svg" alt="drawing" width="100%"/>


- [Requirements](#requirements)
- [Quick Installation](#quick-usage)
- [Notebooks](#Notebooks)
- [Theia Interface](#theia-interface)

# Requirements
The list of the third-party libraries is listed on the requirments.txt file; however, the two main used libraries and requirements are:

- Python 3.7+
- [HuggingFace](https://huggingface.co/)
- [Javalang](https://pypi.org/project/javalang/)
- [scikit-learn](https://scikit-learn.org)
- System Requirements: CPU: 2cv RAM: 8 GB

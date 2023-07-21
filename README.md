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
# Theia Interface
In ServDB, many tasks are required to run in the background independently of the user interface (UI). AI Models are one of these tasks that must serve requests in real time and return results. Theia interface is used for GUI, which is an online IDE
that have brought benefits like browser-based accessibility and convenient deployment workspaces. 


## Datasetb Reactjs
Reactjs, Node16, docker

The example of how to build the Theia-based applications with the dataset.
## Getting started

Please install all necessary [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Start environment
To start a Docker environment, you must install [Docker](https://www.docker.com/get-started) and type the following command in the terminal:
```sh
docker image build --pull --file "Dockerfile" --tag "servdb_theia" "."
```
After creating the image "servdb_theia", you will need to use the following steps to run the container:
```sh
docker run -d -p 3000:3000 servdb_theia
```
Upon completion, you can open your browser and navigate to http://localhost:3000 to see how your app works!

For pulling images on the server run the following commands:
```sh
docker pull hadiqaemi/servdb_theia:latest
```

## build project
In your favorite terminal, run the following command to make a build from the project:
```sh
npm run build 
```

## Running the browser example

    yarn start:browser

*or:*

    yarn rebuild:browser
    cd browser-app
    yarn start

*or:* launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.
## Running the browser example
Once you've installed and set up the system, it's important to configure the .env file correctly.

# ServDB CLI
## Getting started

Please install all necessary [prerequisites](https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites).

## Start environment
To start a Docker environment, you must install [Docker](https://www.docker.com/get-started) and type the following command in the terminal:
```sh
docker image build --pull --file "Dockerfile" --tag "servdb_back" "."
```
After creating the image "servdb_theia", you will need to use the following steps to run the container:
```sh
docker run -d -p 5000:5000 servdb_theia
```
Upon completion, you can open your browser and navigate to http://localhost:5000 to see how your app works!

For pulling images on the server run the following commands:
```sh
docker pull hadiqaemi/servdb_cli:latest
```
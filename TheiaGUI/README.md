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
```
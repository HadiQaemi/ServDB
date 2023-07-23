
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
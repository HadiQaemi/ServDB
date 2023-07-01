FROM ubuntu:22.04

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install pre-reqs
RUN apt-get update
RUN apt-get -y install curl build-essential python3-pip libx11-dev libxkbfile-dev libsecret-1-dev

# Install NODEJS
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -

# Install YARN
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update
RUN apt-get update -qq && apt-get install -y nodejs yarn git

# Install Theia
RUN git clone https://github.com/eclipse-theia/theia
WORKDIR /theia
RUN yarn
RUN yarn download:plugins
RUN yarn browser build
RUN npm install -g @theia/cli

# Install ServDV
WORKDIR /app
COPY . .
#RUN yarn

WORKDIR /app/browser-app
#CMD ["yarn", "start"]
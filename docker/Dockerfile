FROM node:18.3.0-alpine

RUN adduser -s /bin/bash --disabled-password hubot
USER hubot
WORKDIR /home/hubot

COPY ./scripts /home/hubot/scripts
COPY ./utils /home/hubot/utils
COPY ./package.json /home/hubot/package.json
COPY ./external-scripts.json /home/hubot/external-scripts.json

RUN npm install

ENTRYPOINT ["npx", "hubot", "-a", "slack"]

FROM node:14.2

WORKDIR /home/hubot

COPY ./scripts /home/hubot/scripts
COPY ./utils /home/hubot/utils
COPY ./package.json /home/hubot/package.json

RUN npm install

CMD npx hubot -a slack

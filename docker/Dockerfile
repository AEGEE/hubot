FROM node:14.2

WORKDIR /home/hubot

COPY ./scripts /home/hubot/scripts
COPY ./utils /home/hubot/utils
COPY ./docker/entrypoint.sh /home/hubot/entrypoint.sh
COPY ./package.json /home/hubot/package.json

RUN npm install

# ENTRYPOINT ["/home/hubot/entrypoint.sh"]

CMD npx hubot -a slack

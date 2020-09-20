FROM node:14.2 AS builder

ARG OWNER="fabrizio <bellicaf@tcd.ie>"
ARG BOT_NAME="myhubot"
ARG DESCRIPTION="I help people without hating them"

RUN useradd -ms /bin/bash hubot \
      && chown hubot /usr/local/lib/node_modules \
      && chown -R hubot /usr/local/bin \
      && apt-get update && apt-get install -y jq

USER hubot

WORKDIR /home/hubot

RUN npm install -g yo generator-hubot@latest \
      && yo hubot --owner="${OWNER}" \
            --name="${BOT_NAME}" \
            --description="${DESCRIPTION}" \
            --adapter="slack" \
            --defaults

ARG HUBOT_VERSION="3.3.2"

RUN jq --arg HUBOT_VERSION "$HUBOT_VERSION" '.dependencies.hubot = $HUBOT_VERSION' package.json > /tmp/package.json \
      && mv /tmp/package.json .

FROM node:14.2-alpine AS prod

RUN addgroup -S hubot && adduser -S hubot -G hubot \
      && apk update && apk add --no-cache jq

USER hubot

WORKDIR /home/hubot

COPY --from=builder --chown=hubot /home/hubot/ /home/hubot/
COPY --chown=hubot ./scripts /home/hubot/scripts
COPY --chown=hubot ./utils /home/hubot/utils
COPY --chown=hubot ./docker/entrypoint.sh /home/hubot/entrypoint.sh
COPY --chown=hubot ./external-scripts.json /home/hubot/external-scripts.json

ENTRYPOINT ["/home/hubot/entrypoint.sh"]
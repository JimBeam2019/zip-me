FROM node:14

ARG NODE_ENV=test
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/zipme

RUN apt-get update && apt-get install -y procps vim
RUN yarn upgrade

COPY package.json yarn.lock ./

RUN set -ex; \
    if [ "$NODE_ENV" = "production" ]; then \
    yarn install --no-cache --frozen-lockfile --production; \
    elif [ "$NODE_ENV" = "test" ]; then \
    yarn install --no-cache --frozen-lockfile; \
    fi;

COPY . .

ENV HOST=0.0.0.0 PORT=4200

EXPOSE ${PORT}
CMD [ "yarn", "start" ]

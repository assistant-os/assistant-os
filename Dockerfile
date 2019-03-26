# https://github.com/mhart/alpine-node
FROM mhart/alpine-node:10

WORKDIR /app

COPY packages packages
COPY scripts scripts
COPY webpack.config.js .
COPY lerna.json .
COPY package.json .
COPY yarn.lock .
